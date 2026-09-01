import crypto from "crypto";

/**
 * Cashfree PG integration.
 *
 * Environment resolution is deliberately forgiving: the same codebase is run
 * against the sandbox ("test mode") and production, and the credential env vars
 * may be suffixed (`_TEST` / `_PROD`) so both sets can live side by side in
 * `.env.local`. Everything is resolved lazily — reading `process.env` at module
 * scope captures build-time values and silently breaks at runtime.
 */

export type CashfreeEnv = "sandbox" | "production";

const PRODUCTION_ALIASES = new Set(["production", "prod", "live"]);

/** Normalises NEXT_PUBLIC_CASHFREE_ENV ("development", "test", "TEST", …) to an SDK-valid mode. */
export function getCashfreeEnv(): CashfreeEnv {
  const raw = (process.env.NEXT_PUBLIC_CASHFREE_ENV ?? "sandbox").trim().toLowerCase();
  return PRODUCTION_ALIASES.has(raw) ? "production" : "sandbox";
}

export function isCashfreeSandbox(): boolean {
  return getCashfreeEnv() === "sandbox";
}

function cashfreeBase(): string {
  return getCashfreeEnv() === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

/** Picks the first non-empty env var from `names`. */
function pickEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export interface CashfreeCredentials {
  appId:     string;
  secretKey: string;
}

/**
 * Resolves credentials for the active environment, preferring the
 * environment-suffixed vars and falling back to the unsuffixed pair.
 */
export function getCashfreeCredentials(): CashfreeCredentials {
  const sandbox = isCashfreeSandbox();

  const appId = sandbox
    ? pickEnv("CASHFREE_APP_ID_TEST", "CASHFREE_APP_ID_SANDBOX", "CASHFREE_APP_ID")
    : pickEnv("CASHFREE_APP_ID_PROD", "CASHFREE_APP_ID_LIVE", "CASHFREE_APP_ID");

  const secretKey = sandbox
    ? pickEnv("CASHFREE_SECRET_KEY_TEST", "CASHFREE_SECRET_KEY_SANDBOX", "CASHFREE_SECRET_KEY")
    : pickEnv("CASHFREE_SECRET_KEY_PROD", "CASHFREE_SECRET_KEY_LIVE", "CASHFREE_SECRET_KEY");

  if (!appId || !secretKey) {
    const suffix = sandbox ? "_TEST" : "_PROD";
    throw new Error(
      `Cashfree credentials missing for "${getCashfreeEnv()}" mode. ` +
      `Set CASHFREE_APP_ID${suffix} and CASHFREE_SECRET_KEY${suffix} ` +
      `(or the unsuffixed CASHFREE_APP_ID / CASHFREE_SECRET_KEY) in .env.local.`
    );
  }

  return { appId, secretKey };
}

/** True when credentials for the active mode are present — used for health checks. */
export function hasCashfreeCredentials(): boolean {
  try {
    getCashfreeCredentials();
    return true;
  } catch {
    return false;
  }
}

function cfHeaders(): Record<string, string> {
  const { appId, secretKey } = getCashfreeCredentials();
  return {
    "x-client-id":     appId,
    "x-client-secret": secretKey,
    "x-api-version":   "2023-08-01",
    "Content-Type":    "application/json",
  };
}

async function cashfreeFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${cashfreeBase()}${path}`, {
    ...init,
    headers: { ...cfHeaders(), ...(init?.headers ?? {}) },
    cache:   "no-store",
  });
}

async function readError(res: Response): Promise<string> {
  const body = await res.text().catch(() => "");
  try {
    const json = JSON.parse(body) as { message?: string; code?: string };
    return json.message ?? json.code ?? body;
  } catch {
    return body || res.statusText;
  }
}

// ── Orders ───────────────────────────────────────────────────────────────────

export interface CashfreeOrder {
  cf_order_id:        string;
  order_id:           string;
  payment_session_id: string;
  order_status:       string;
}

/** Cashfree rejects phone numbers that aren't 10–15 digits, so strip everything else. */
function normalisePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Already carries a country code (e.g. 919876543210) — leave it alone.
  if (digits.length > 10) return digits.slice(-12);
  return `91${digits}`;
}

export async function createCashfreeOrder(params: {
  orderId:       string;
  orderAmount:   number;
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  returnUrl:     string;
  notifyUrl?:    string;
}): Promise<CashfreeOrder> {
  const body = {
    order_id:       params.orderId,
    // Cashfree only accepts 2-decimal amounts.
    order_amount:   Number(params.orderAmount.toFixed(2)),
    order_currency: "INR",
    customer_details: {
      customer_id:    params.orderId.replace(/-/g, ""),
      customer_name:  params.customerName,
      customer_email: params.customerEmail,
      customer_phone: normalisePhone(params.customerPhone),
    },
    order_meta: {
      return_url: params.returnUrl,
      ...(params.notifyUrl ? { notify_url: params.notifyUrl } : {}),
    },
  };

  const res = await cashfreeFetch("/orders", {
    method: "POST",
    body:   JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Cashfree order creation failed (${res.status}): ${await readError(res)}`);
  }

  return res.json() as Promise<CashfreeOrder>;
}

/**
 * Cashfree order lifecycle status.
 * ACTIVE = awaiting payment, PAID = settled, EXPIRED/TERMINATED = dead.
 */
export type CashfreeOrderStatus =
  | "ACTIVE"
  | "PAID"
  | "EXPIRED"
  | "TERMINATED"
  | "TERMINATION_REQUESTED";

export interface CashfreeOrderDetails {
  cf_order_id:   string;
  order_id:      string;
  order_status:  CashfreeOrderStatus;
  order_amount:  number;
}

/**
 * Fetches an order by the **merchant** order id (the value passed as `order_id`
 * on creation), which is what `GET /pg/orders/{order_id}` expects — not cf_order_id.
 */
export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderDetails> {
  const res = await cashfreeFetch(`/orders/${encodeURIComponent(orderId)}`);
  if (!res.ok) {
    throw new Error(`Cashfree order lookup failed (${res.status}): ${await readError(res)}`);
  }
  return res.json() as Promise<CashfreeOrderDetails>;
}

export type CashfreePaymentStatus =
  | "SUCCESS"
  | "NOT_ATTEMPTED"
  | "FAILED"
  | "USER_DROPPED"
  | "VOID"
  | "CANCELLED"
  | "PENDING";

export interface CashfreePayment {
  cf_payment_id:  string | number;
  order_id:       string;
  payment_status: CashfreePaymentStatus;
  payment_amount: number;
  payment_group:  string | null;
  payment_time:   string | null;
  payment_message?: string | null;
}

/** All payment attempts against an order, newest last. Empty array if none were made. */
export async function getCashfreePayments(orderId: string): Promise<CashfreePayment[]> {
  const res = await cashfreeFetch(`/orders/${encodeURIComponent(orderId)}/payments`);
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`Cashfree payments lookup failed (${res.status}): ${await readError(res)}`);
  }
  const json = await res.json().catch(() => null);
  return Array.isArray(json) ? (json as CashfreePayment[]) : [];
}

// ── Webhooks ─────────────────────────────────────────────────────────────────

export function getCashfreeWebhookSecret(): string | undefined {
  return pickEnv(
    isCashfreeSandbox() ? "CASHFREE_WEBHOOK_SECRET_TEST" : "CASHFREE_WEBHOOK_SECRET_PROD",
    "CASHFREE_WEBHOOK_SECRET",
    // Cashfree signs webhooks with the same secret key used for the API.
    isCashfreeSandbox() ? "CASHFREE_SECRET_KEY_TEST" : "CASHFREE_SECRET_KEY_PROD",
    "CASHFREE_SECRET_KEY"
  );
}

export function verifyCashfreeWebhookSignature(
  rawBody:   string,
  signature: string,
  timestamp: string,
  secret:    string | undefined = getCashfreeWebhookSecret(),
): boolean {
  if (!secret) throw new Error("No Cashfree webhook secret configured");
  const payload  = timestamp + rawBody;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
