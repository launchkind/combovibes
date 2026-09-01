/**
 * Shiprocket API client.
 *
 * Credentials are read lazily (never at module scope) so a build-time env
 * snapshot can't silently break runtime, and every call surfaces Shiprocket's
 * own error text — its failures are almost always data problems (unserviceable
 * pincode, unregistered pickup location) that are undiagnosable otherwise.
 */

const SR_BASE = "https://apiv2.shiprocket.in/v1/external";

// Shiprocket tokens are valid for 10 days; refresh well inside that.
const TOKEN_TTL_MS = 23 * 60 * 60 * 1000;

let tokenCache: { token: string; expiresAt: number } | null = null;

export interface ShiprocketCredentials {
  email:    string;
  password: string;
}

export function getShiprocketCredentials(): ShiprocketCredentials {
  const email    = process.env.SHIPROCKET_EMAIL?.trim();
  const password = process.env.SHIPROCKET_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error(
      "Shiprocket credentials missing. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local."
    );
  }

  // The scaffold ships placeholders; treat them as unconfigured rather than
  // letting them fail later as a confusing 403 from Shiprocket.
  if (email === "your@shiprocket.email" || password === "your_shiprocket_password") {
    throw new Error(
      "Shiprocket credentials are still the placeholder values. " +
      "Set real SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD in .env.local."
    );
  }

  return { email, password };
}

export function hasShiprocketCredentials(): boolean {
  try {
    getShiprocketCredentials();
    return true;
  } catch {
    return false;
  }
}

async function readError(res: Response): Promise<string> {
  const body = await res.text().catch(() => "");
  try {
    const json = JSON.parse(body) as {
      message?: string;
      errors?: Record<string, string[] | string>;
    };
    // Shiprocket returns per-field errors for bad payloads — surface them all,
    // otherwise "order creation failed" tells you nothing actionable.
    if (json.errors && typeof json.errors === "object") {
      const detail = Object.entries(json.errors)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
        .join("; ");
      return json.message ? `${json.message} (${detail})` : detail;
    }
    return json.message ?? body.slice(0, 300);
  } catch {
    return body.slice(0, 300) || res.statusText;
  }
}

async function login(): Promise<string> {
  const { email, password } = getShiprocketCredentials();

  const res = await fetch(`${SR_BASE}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
    cache:   "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shiprocket auth failed (${res.status}): ${await readError(res)}`);
  }

  const data = await res.json() as { token?: string };
  if (!data.token) throw new Error("Shiprocket auth returned no token");

  tokenCache = { token: data.token, expiresAt: Date.now() + TOKEN_TTL_MS };
  return data.token;
}

async function getToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }
  return login();
}

/** Clears the cached token — used by the health check to force a live auth. */
export function resetShiprocketToken(): void {
  tokenCache = null;
}

/**
 * Authenticated fetch that retries once on 401.
 *
 * A cached token can be invalidated server-side (password change, session
 * revoke) long before our TTL expires, so a blind cache would wedge every
 * shipment until the process restarted.
 */
async function srFetch(path: string, init?: RequestInit): Promise<Response> {
  const doFetch = async (token: string) =>
    fetch(`${SR_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

  let res = await doFetch(await getToken());

  if (res.status === 401) {
    tokenCache = null;
    res = await doFetch(await getToken(true));
  }

  return res;
}

// ── Pickup locations ─────────────────────────────────────────────────────────

export interface AddPickupLocationParams {
  pickup_location: string;
  name:            string;
  email:           string;
  phone:           string;
  address:         string;
  address_2?:      string;
  city:            string;
  state:           string;
  country:         string;
  pin_code:        string;
}

export interface AddPickupLocationResult {
  success?:   boolean;
  pickup_id?: number;
  address?:   Record<string, unknown>;
}

export async function addPickupLocation(
  params: AddPickupLocationParams
): Promise<AddPickupLocationResult> {
  const res = await srFetch("/settings/company/addpickup", {
    method: "POST",
    body:   JSON.stringify({
      ...params,
      // Shiprocket rejects phone numbers carrying a country code here.
      phone: params.phone.replace(/\D/g, "").slice(-10),
    }),
  });

  if (!res.ok) {
    const message = await readError(res);
    // Re-registering an existing nickname is not a failure — it means the
    // pickup location is already usable, which is all the caller cares about.
    if (/already exist/i.test(message)) {
      return { success: true };
    }
    throw new Error(`Shiprocket pickup location registration failed (${res.status}): ${message}`);
  }

  return res.json() as Promise<AddPickupLocationResult>;
}

/** All pickup locations on the account — used to verify a nickname really exists. */
export async function listPickupLocations(): Promise<Array<{ pickup_location: string }>> {
  const res = await srFetch("/settings/company/pickup");
  if (!res.ok) throw new Error(`Shiprocket pickup list failed (${res.status}): ${await readError(res)}`);
  const json = await res.json() as {
    data?: { shipping_address?: Array<{ pickup_location: string }> };
  };
  return json.data?.shipping_address ?? [];
}

// ── Serviceability ───────────────────────────────────────────────────────────

export interface CourierOption {
  courier_company_id: number;
  courier_name:       string;
  rate:               number;
  etd:                string;
}

/**
 * Checks whether any courier can carry this parcel between two pincodes.
 *
 * Worth calling before creating the order: Shiprocket will happily accept an
 * order for an unserviceable pincode and only fail at AWB assignment, leaving
 * an orphaned order in their dashboard.
 */
export async function checkServiceability(params: {
  pickupPincode:   string;
  deliveryPincode: string;
  weightKg:        number;
}): Promise<CourierOption[]> {
  const qs = new URLSearchParams({
    pickup_postcode:   params.pickupPincode,
    delivery_postcode: params.deliveryPincode,
    weight:            String(params.weightKg),
    cod:               "0",
  });

  const res = await srFetch(`/courier/serviceability/?${qs.toString()}`);
  if (!res.ok) {
    throw new Error(`Shiprocket serviceability check failed (${res.status}): ${await readError(res)}`);
  }

  const json = await res.json() as {
    data?: { available_courier_companies?: CourierOption[] };
  };
  return json.data?.available_courier_companies ?? [];
}

// ── Orders ───────────────────────────────────────────────────────────────────

export interface ShiprocketOrderPayload {
  order_id:               string;
  order_date:             string;
  pickup_location:        string;
  comment:                string;
  billing_customer_name:  string;
  billing_last_name:      string;
  billing_address:        string;
  billing_city:           string;
  billing_pincode:        string;
  billing_state:          string;
  billing_country:        string;
  billing_email:          string;
  billing_phone:          string;
  shipping_is_billing:    boolean;
  shipping_customer_name: string;
  shipping_last_name:     string;
  shipping_address:       string;
  shipping_city:          string;
  shipping_pincode:       string;
  shipping_country:       string;
  shipping_state:         string;
  shipping_email:         string;
  shipping_phone:         string;
  order_items: Array<{
    name:          string;
    sku:           string;
    units:         number;
    selling_price: string;
  }>;
  payment_method: "Prepaid";
  sub_total:      number;
  length:         number;
  breadth:        number;
  height:         number;
  weight:         number;
}

export interface ShiprocketOrderResult {
  order_id:    number;
  shipment_id: number;
  status?:     string;
  status_code?: number;
}

export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload
): Promise<ShiprocketOrderResult> {
  const res = await srFetch("/orders/create/adhoc", {
    method: "POST",
    body:   JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket order creation failed (${res.status}): ${await readError(res)}`);
  }

  const json = await res.json() as ShiprocketOrderResult & { message?: string };

  if (!json.shipment_id) {
    throw new Error(`Shiprocket order creation returned no shipment_id: ${json.message ?? JSON.stringify(json).slice(0, 200)}`);
  }

  return json;
}

// ── AWB assignment ───────────────────────────────────────────────────────────

export interface AwbResult {
  awb_code:           string;
  courier_name:       string;
  courier_company_id: number | null;
  /** Shiprocket's own tracking page for this AWB. */
  tracking_url:       string;
}

/**
 * Assigns a courier + AWB to a shipment and returns the assigned details.
 *
 * The AWB lives ONLY in this response — `/orders/create/adhoc` does not return
 * one. Discarding it (as the previous implementation did) meant awb_code,
 * courier_name and tracking_url were silently persisted as null on every
 * shipment, breaking tracking and suppressing the "shipped" notifications.
 */
export async function generateAWB(shipmentId: number, courierId?: number): Promise<AwbResult> {
  const res = await srFetch("/courier/assign/awb", {
    method: "POST",
    body:   JSON.stringify({
      shipment_id: String(shipmentId),
      ...(courierId ? { courier_id: courierId } : {}),
    }),
  });

  const json = await res.json().catch(() => null) as {
    awb_assign_status?: number;
    message?:           string;
    response?: {
      data?: {
        awb_code?:           string;
        courier_name?:       string;
        courier_company_id?: number;
      };
      // Failures put the reason here rather than at the top level.
      data_message?: string;
    };
  } | null;

  if (!res.ok) {
    const reason = json?.message ?? json?.response?.data_message ?? `HTTP ${res.status}`;
    throw new Error(`Shiprocket AWB assignment failed: ${reason}`);
  }

  const data = json?.response?.data;

  // A 200 with awb_assign_status 0 is still a failure — usually "no courier
  // available for this pincode/weight".
  if (!data?.awb_code) {
    const reason =
      json?.response?.data_message ??
      json?.message ??
      "no AWB returned (often means no courier serves this route)";
    throw new Error(`Shiprocket AWB assignment failed: ${reason}`);
  }

  return {
    awb_code:           data.awb_code,
    courier_name:       data.courier_name ?? "Courier",
    courier_company_id: data.courier_company_id ?? null,
    tracking_url:       `https://shiprocket.co/tracking/${data.awb_code}`,
  };
}

// ── Pickup & tracking ────────────────────────────────────────────────────────

export interface PickupResult {
  scheduled:  boolean;
  date?:      string;
  token?:     string;
  message?:   string;
}

/**
 * Requests a courier pickup. Best-effort: a shipment with an AWB is already
 * valid and couriers often auto-schedule, so callers should not fail an order
 * because this step didn't take.
 */
export async function schedulePickup(shipmentIds: number[]): Promise<PickupResult> {
  const res = await srFetch("/courier/generate/pickup", {
    method: "POST",
    body:   JSON.stringify({ shipment_id: shipmentIds }),
  });

  const json = await res.json().catch(() => null) as {
    pickup_status?: number;
    message?:       string;
    response?: { pickup_scheduled_date?: string; pickup_token_number?: string };
  } | null;

  if (!res.ok) {
    return { scheduled: false, message: json?.message ?? `HTTP ${res.status}` };
  }

  return {
    scheduled: true,
    date:      json?.response?.pickup_scheduled_date,
    token:     json?.response?.pickup_token_number,
    message:   json?.message,
  };
}

export async function trackByAWB(awbCode: string): Promise<unknown> {
  const res = await srFetch(`/courier/track/awb/${encodeURIComponent(awbCode)}`);
  if (!res.ok) throw new Error(`Shiprocket tracking failed (${res.status}): ${await readError(res)}`);
  return res.json();
}

// ── Payload builder ──────────────────────────────────────────────────────────

/** Shiprocket expects `YYYY-MM-DD HH:mm`, not an ISO 8601 string. */
function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Couriers reject numbers with country codes or separators. */
function tenDigit(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

export interface ParcelDimensions {
  lengthCm:  number;
  breadthCm: number;
  heightCm:  number;
  weightKg:  number;
}

/** Used when a product carries no shipping dimensions of its own. */
export const DEFAULT_PARCEL: ParcelDimensions = {
  lengthCm: 15, breadthCm: 15, heightCm: 10, weightKg: 0.5,
};

/**
 * Derives a parcel size for a group of items.
 *
 * Weight is additive; dimensions take the largest of each axis, with height
 * accumulated — a rough but safe stand-in for real box packing. Shiprocket
 * bills on volumetric weight, so under-declaring here causes billing
 * adjustments later; over-declaring only costs a little more.
 */
export function computeParcel(
  items: Array<{
    quantity: number;
    weight_kg?:  number | null;
    length_cm?:  number | null;
    breadth_cm?: number | null;
    height_cm?:  number | null;
  }>
): ParcelDimensions {
  let weightKg = 0;
  let length   = 0;
  let breadth  = 0;
  let height   = 0;

  for (const item of items) {
    const qty = Math.max(1, item.quantity);
    weightKg += (item.weight_kg ?? DEFAULT_PARCEL.weightKg) * qty;
    length    = Math.max(length,  item.length_cm  ?? DEFAULT_PARCEL.lengthCm);
    breadth   = Math.max(breadth, item.breadth_cm ?? DEFAULT_PARCEL.breadthCm);
    height   += (item.height_cm ?? DEFAULT_PARCEL.heightCm) * qty;
  }

  return {
    // Shiprocket rejects zero/negative values on any axis.
    weightKg:  Math.max(0.1, Number(weightKg.toFixed(2))),
    lengthCm:  Math.max(1, Math.round(length)),
    breadthCm: Math.max(1, Math.round(breadth)),
    heightCm:  Math.max(1, Math.round(height)),
  };
}

export function buildShiprocketPayload(params: {
  order: {
    order_number:     string;
    created_at:       string;
    sender_name:      string;
    sender_email:     string;
    sender_phone:     string;
    recipient_name:   string;
    recipient_phone:  string;
    delivery_line1:   string;
    delivery_line2:   string | null;
    delivery_city:    string;
    delivery_state:   string;
    delivery_pincode: string;
    gift_message:     string | null;
  };
  items: Array<{
    product_id:   string | null;
    product_name: string;
    unit_price:   number;
    quantity:     number;
    weight_kg?:   number | null;
    length_cm?:   number | null;
    breadth_cm?:  number | null;
    height_cm?:   number | null;
  }>;
  pickupLocation:          string;
  shiprocketOrderIdSuffix: string;
  parcel?:                 ParcelDimensions;
}): ShiprocketOrderPayload {
  const { order, items, pickupLocation, shiprocketOrderIdSuffix } = params;

  const senderFirst = order.sender_name.trim().split(/\s+/)[0];
  const senderLast  = order.sender_name.trim().split(/\s+/).slice(1).join(" ") || "-";
  const recipFirst  = order.recipient_name.trim().split(/\s+/)[0];
  const recipLast   = order.recipient_name.trim().split(/\s+/).slice(1).join(" ") || "-";

  const shipAddr = order.delivery_line1 + (order.delivery_line2 ? ` ${order.delivery_line2}` : "");
  const subTotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const parcel   = params.parcel ?? computeParcel(items);

  return {
    order_id:               `${order.order_number}-${shiprocketOrderIdSuffix}`,
    order_date:             formatOrderDate(order.created_at),
    pickup_location:        pickupLocation,
    comment:                order.gift_message ?? "",

    // Billing is the buyer; shipping is the gift recipient — these differ on
    // almost every order here, which is why shipping_is_billing stays false.
    billing_customer_name:  senderFirst,
    billing_last_name:      senderLast,
    billing_address:        order.delivery_line1,
    billing_city:           order.delivery_city,
    billing_pincode:        order.delivery_pincode,
    billing_state:          order.delivery_state,
    billing_country:        "India",
    billing_email:          order.sender_email,
    billing_phone:          tenDigit(order.sender_phone),

    shipping_is_billing:    false,
    shipping_customer_name: recipFirst,
    shipping_last_name:     recipLast,
    shipping_address:       shipAddr,
    shipping_city:          order.delivery_city,
    shipping_pincode:       order.delivery_pincode,
    shipping_country:       "India",
    shipping_state:         order.delivery_state,
    shipping_email:         order.sender_email,
    shipping_phone:         tenDigit(order.recipient_phone),

    order_items: items.map((i) => ({
      name:          i.product_name,
      sku:           i.product_id ?? i.product_name.toLowerCase().replace(/\s+/g, "-").slice(0, 50),
      units:         i.quantity,
      selling_price: String(i.unit_price),
    })),

    payment_method: "Prepaid",
    sub_total:      subTotal,
    length:         parcel.lengthCm,
    breadth:        parcel.breadthCm,
    height:         parcel.heightCm,
    weight:         parcel.weightKg,
  };
}
