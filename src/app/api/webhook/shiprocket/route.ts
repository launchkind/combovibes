import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendShippedEmail } from "@/lib/notifications/email";
import { sendShippedWhatsApp } from "@/lib/notifications/whatsapp";
import type { Order } from "@/types/order.types";

export const dynamic = "force-dynamic";

/**
 * Shiprocket's tracking vocabulary is wider than the labels in their UI —
 * mapping only a handful left real transitions (RTO, undelivered, pickup
 * exceptions) silently dropped.
 */
const STATUS_MAP: Record<string, string> = {
  "PICKUP SCHEDULED":        "processing",
  "PICKUP GENERATED":        "processing",
  "PICKUP QUEUED":           "processing",
  "PICKED UP":               "processing",
  "SHIPPED":                 "shipped",
  "IN TRANSIT":              "shipped",
  "OUT FOR DELIVERY":        "out_for_delivery",
  "DELIVERED":               "delivered",
  "RTO INITIATED":           "returned",
  "RTO IN TRANSIT":          "returned",
  "RTO DELIVERED":           "returned",
  "RETURN PICKED UP":        "returned",
  "RETURN DELIVERED":        "returned",
  "CANCELED":                "cancelled",
  "CANCELLED":               "cancelled",
};

/**
 * Shiprocket signs webhooks with a token you set in their dashboard
 * (Settings → API → Webhooks), sent as the `x-api-key` header.
 *
 * Without this check the endpoint accepted any anonymous POST, letting anyone
 * who guessed an AWB mark orders delivered and fire customer notifications.
 */
function verifyWebhookToken(request: NextRequest): boolean {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN?.trim();
  if (!expected) return false;

  const provided = request.headers.get("x-api-key")?.trim() ?? "";
  if (provided.length !== expected.length) return false;

  // Constant-time compare so the token can't be recovered byte by byte.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: NextRequest) {
  if (!process.env.SHIPROCKET_WEBHOOK_TOKEN?.trim()) {
    console.error(
      "[shiprocket-webhook] SHIPROCKET_WEBHOOK_TOKEN is not set; rejecting. " +
      "Set it here and in Shiprocket → Settings → API → Webhooks."
    );
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  if (!verifyWebhookToken(request)) {
    return NextResponse.json({ error: "Invalid webhook token" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: true });

  const awbCode  = (body.awb ?? body.awb_code ?? "") as string;
  const srStatus = ((body.current_status ?? body.status ?? "") as string).toUpperCase().trim();

  const mappedStatus = STATUS_MAP[srStatus];
  if (!awbCode || !mappedStatus) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();

  const { data: shipment } = await admin
    .from("shipments")
    .select("id, order_id, status, vendor_name_snapshot")
    .eq("awb_code", awbCode)
    .single();

  if (!shipment) return NextResponse.json({ ok: true });

  // Skip if status hasn't changed
  if (shipment.status === mappedStatus) return NextResponse.json({ ok: true });

  const shipmentUpdates: Record<string, string | null> = { status: mappedStatus };
  if (mappedStatus === "shipped")   shipmentUpdates.shipped_at   = new Date().toISOString();
  if (mappedStatus === "delivered") shipmentUpdates.delivered_at = new Date().toISOString();

  await admin.from("shipments").update(shipmentUpdates).eq("id", shipment.id);

  await admin.from("order_status_history").insert({
    order_id:   shipment.order_id,
    status:     mappedStatus,
    note:       `Shiprocket update for vendor "${shipment.vendor_name_snapshot}": ${srStatus}`,
    changed_by: "system",
  });

  // Recompute the order's aggregate status from all its shipments
  const { data: allShipments } = await admin
    .from("shipments")
    .select("status")
    .eq("order_id", shipment.order_id);

  if (allShipments && allShipments.length > 0) {
    const statuses = allShipments.map((s) => s.status);
    let orderStatus: string | null = null;
    if (statuses.every((s) => s === "delivered")) orderStatus = "delivered";
    else if (statuses.some((s) => s === "out_for_delivery")) orderStatus = "out_for_delivery";
    else if (statuses.some((s) => s === "shipped")) orderStatus = "shipped";
    else if (statuses.some((s) => s === "processing")) orderStatus = "processing";

    if (orderStatus) {
      const orderUpdates: Record<string, string> = { order_status: orderStatus };
      if (orderStatus === "shipped")   orderUpdates.shipped_at   = new Date().toISOString();
      if (orderStatus === "delivered") orderUpdates.delivered_at = new Date().toISOString();
      await admin.from("orders").update(orderUpdates).eq("id", shipment.order_id);
    }

    // Mirror single-shipment fields for the common single-vendor case
    if (allShipments.length === 1) {
      const { data: s } = await admin
        .from("shipments")
        .select("awb_code, courier_name, tracking_url")
        .eq("id", shipment.id)
        .single();
      if (s) {
        await admin.from("orders").update({
          awb_code:     s.awb_code,
          courier_name: s.courier_name,
          tracking_url: s.tracking_url,
        }).eq("id", shipment.order_id);
      }
    }
  }

  // Send "shipped" notifications when package is in transit
  if (mappedStatus === "shipped") {
    const { data: fullOrder } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", shipment.order_id)
      .single();

    if (fullOrder) {
      const o = fullOrder as Order;
      // Awaited: in a serverless runtime the response ends the invocation, so
      // fire-and-forget notifications can be killed before they're sent.
      await Promise.allSettled([
        sendShippedEmail(o),
        o.awb_code && o.courier_name
          ? sendShippedWhatsApp({
              phone:       o.sender_phone,
              orderNumber: o.order_number,
              awbCode:     o.awb_code,
              courierName: o.courier_name,
              trackingUrl: o.tracking_url ?? `https://shiprocket.co/tracking/${o.awb_code}`,
            })
          : Promise.resolve(),
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}

/** Lets you confirm the endpoint is reachable and configured. */
export async function GET() {
  return NextResponse.json({
    ok:              true,
    endpoint:        "shiprocket-webhook",
    tokenConfigured: Boolean(process.env.SHIPROCKET_WEBHOOK_TOKEN?.trim()),
  });
}
