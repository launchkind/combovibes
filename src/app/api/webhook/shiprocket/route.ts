import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendShippedEmail } from "@/lib/notifications/email";
import { sendShippedWhatsApp } from "@/lib/notifications/whatsapp";
import type { Order } from "@/types/order.types";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, string> = {
  "PICKED UP":        "processing",
  "IN TRANSIT":       "shipped",
  "OUT FOR DELIVERY": "out_for_delivery",
  "DELIVERED":        "delivered",
  "RTO INITIATED":    "returned",
  "CANCELLED":        "cancelled",
};

export async function POST(request: NextRequest) {
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
      sendShippedEmail(o);
      if (o.awb_code && o.courier_name) {
        sendShippedWhatsApp({
          phone:       o.sender_phone,
          orderNumber: o.order_number,
          awbCode:     o.awb_code,
          courierName: o.courier_name,
          trackingUrl: o.tracking_url ?? `https://shiprocket.co/tracking/${o.awb_code}`,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
