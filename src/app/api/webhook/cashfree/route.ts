import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getCashfreeWebhookSecret,
  isCashfreeSandbox,
  verifyCashfreeWebhookSignature,
} from "@/lib/cashfree";
import { markOrderFailed, markOrderPaid } from "@/lib/order-fulfillment";

export const dynamic = "force-dynamic";

/**
 * Cashfree payment webhook.
 *
 * This is the primary confirmation path in production. It is NOT the only one:
 * /api/checkout/[orderId]/verify performs the same reconciliation from the
 * return URL, which is what carries the sandbox/test flow where Cashfree cannot
 * reach a local dev server. Both funnel into `markOrderPaid`, whose conditional
 * state transition makes running twice harmless.
 */

interface WebhookOrder  { order_id?: string; cf_order_id?: string | number }
interface WebhookPayment {
  cf_payment_id?:   string | number;
  payment_group?:   string;
  payment_time?:    string;
  payment_message?: string;
}

/**
 * Resolves the local order from a webhook payload.
 *
 * Prefers the merchant `order_id` (our UUID, set at creation time) over
 * `cf_order_id`, because `orders.cashfree_order_id` is written *after* the
 * Cashfree API call returns — a fast webhook can arrive before that write lands.
 */
async function findOrder(
  admin: ReturnType<typeof createAdminClient>,
  wh: WebhookOrder
): Promise<{ id: string } | null> {
  if (wh.order_id) {
    const { data } = await admin
      .from("orders")
      .select("id")
      .eq("id", wh.order_id)
      .maybeSingle();
    if (data) return data;
  }

  if (wh.cf_order_id != null) {
    const { data } = await admin
      .from("orders")
      .select("id")
      .eq("cashfree_order_id", String(wh.cf_order_id))
      .maybeSingle();
    if (data) return data;
  }

  return null;
}

export async function POST(request: NextRequest) {
  const rawBody   = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";

  const secret = getCashfreeWebhookSecret();

  if (!secret) {
    // Without a secret we cannot prove the caller is Cashfree. Refuse rather
    // than trust it — the return-URL verification path still confirms orders.
    console.error(
      "[cashfree-webhook] No webhook secret configured; rejecting. " +
      "Set CASHFREE_WEBHOOK_SECRET in the environment."
    );
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  if (!signature || !timestamp) {
    return NextResponse.json({ error: "Missing signature headers" }, { status: 400 });
  }

  let valid = false;
  try {
    valid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp, secret);
  } catch (err) {
    console.error("[cashfree-webhook] signature verification error:", err);
    return NextResponse.json({ error: "Signature verification error" }, { status: 400 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type?: string; data?: { order?: WebhookOrder; payment?: WebhookPayment } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type ?? "";
  const whOrder   = event.data?.order ?? {};
  const whPayment = event.data?.payment ?? {};
  const admin     = createAdminClient();

  // Always ack unknown/irrelevant events so Cashfree stops retrying them.
  if (eventType !== "PAYMENT_SUCCESS_WEBHOOK" && eventType !== "PAYMENT_FAILED_WEBHOOK") {
    return NextResponse.json({ received: true, ignored: eventType });
  }

  const order = await findOrder(admin, whOrder);
  if (!order) {
    console.error(
      "[cashfree-webhook] no matching order for",
      { order_id: whOrder.order_id, cf_order_id: whOrder.cf_order_id }
    );
    // Ack anyway — retrying will not make the order appear.
    return NextResponse.json({ received: true, matched: false });
  }

  try {
    if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      const result = await markOrderPaid({
        orderId:           order.id,
        cashfreePaymentId: whPayment.cf_payment_id != null ? String(whPayment.cf_payment_id) : null,
        paymentMethod:     whPayment.payment_group ?? "cashfree",
        paidAt:            whPayment.payment_time ?? null,
        source:            "webhook",
      });
      return NextResponse.json({ received: true, transitioned: result.transitioned });
    }

    const result = await markOrderFailed(
      order.id,
      whPayment.payment_message?.trim() || "Payment failed",
      "webhook"
    );
    return NextResponse.json({ received: true, transitioned: result.transitioned });
  } catch (err) {
    console.error("[cashfree-webhook] fulfillment error:", err);
    // 500 asks Cashfree to retry — safe, because fulfillment is idempotent.
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
  }
}

/** Lets you confirm the endpoint is reachable from the Cashfree dashboard. */
export async function GET() {
  return NextResponse.json({
    ok:              true,
    endpoint:        "cashfree-webhook",
    mode:            isCashfreeSandbox() ? "sandbox" : "production",
    secretConfigured: Boolean(getCashfreeWebhookSecret()),
  });
}
