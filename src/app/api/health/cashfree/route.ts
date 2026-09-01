import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getCashfreeCredentials,
  getCashfreeEnv,
  getCashfreeWebhookSecret,
} from "@/lib/cashfree";

export const dynamic = "force-dynamic";

/**
 * Diagnostic for the Cashfree integration.
 *
 * Answers the question the checkout flow can't: are the configured keys actually
 * accepted by the gateway? A bad key pair otherwise only shows up as a generic
 * "Payment session could not be created" at the end of checkout.
 *
 * Open in development; admin-only in production. Never returns key material.
 */

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes((user.email ?? "").toLowerCase());
}

/** Shows enough of a key to identify it without exposing it. */
function fingerprint(value: string): string {
  if (value.length <= 12) return `${value.slice(0, 2)}…(${value.length} chars)`;
  return `${value.slice(0, 8)}…${value.slice(-4)} (${value.length} chars)`;
}

export async function GET() {
  if (process.env.NODE_ENV === "production" && !(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode    = getCashfreeEnv();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(siteUrl);

  const base = {
    mode,
    rawEnvValue:      process.env.NEXT_PUBLIC_CASHFREE_ENV ?? null,
    siteUrl,
    webhookReachable: !isLocal,
    webhookSecretConfigured: Boolean(getCashfreeWebhookSecret()),
    notes: isLocal
      ? "Site URL is local: Cashfree cannot deliver webhooks. Payments are confirmed by return-URL verification instead."
      : "Webhooks enabled. Register " + siteUrl + "/api/webhook/cashfree in the Cashfree dashboard.",
  };

  let creds;
  try {
    creds = getCashfreeCredentials();
  } catch (err) {
    return NextResponse.json({
      ...base,
      credentialsPresent: false,
      authenticated:      false,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }

  // Cheapest authenticated call: look up an order that cannot exist.
  // 404 means the credentials were accepted; 401/403 means they were not.
  const apiBase = mode === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

  let status = 0;
  let body   = "";
  try {
    const res = await fetch(`${apiBase}/orders/healthcheck-probe-does-not-exist`, {
      headers: {
        "x-client-id":     creds.appId,
        "x-client-secret": creds.secretKey,
        "x-api-version":   "2023-08-01",
      },
      cache: "no-store",
    });
    status = res.status;
    body   = (await res.text()).slice(0, 300);
  } catch (err) {
    return NextResponse.json({
      ...base,
      credentialsPresent: true,
      authenticated:      false,
      error: `Could not reach Cashfree: ${err instanceof Error ? err.message : String(err)}`,
    }, { status: 502 });
  }

  const authenticated = status !== 401 && status !== 403;

  return NextResponse.json({
    ...base,
    credentialsPresent: true,
    appId:     fingerprint(creds.appId),
    secretKey: fingerprint(creds.secretKey),
    authenticated,
    probeStatus: status,
    ...(authenticated
      ? {}
      : {
          error: "Cashfree rejected these credentials.",
          hint:
            `Copy the ${mode === "production" ? "Production" : "Sandbox/Test"} App ID and Secret Key ` +
            `from Cashfree Dashboard → Developers → API Keys into ` +
            `CASHFREE_APP_ID_TEST / CASHFREE_SECRET_KEY_TEST, then restart the dev server. ` +
            `Regenerating a secret key invalidates the previous one.`,
          gatewayResponse: body,
        }),
  }, { status: authenticated ? 200 : 502 });
}
