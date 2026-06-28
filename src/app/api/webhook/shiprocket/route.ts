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

  const awbCode   = (body.awb ?? body.awb_code ?? "") as string;
  const srStatus  = ((body.current_status ?? body.status ?? "") as string).toUpperCase().trim();

  const mappedStatus = STATUS_MAP[srStatus];
  if (!awbCode || !mappedStatus) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, order_status, sender_email, sender_phone, order_number, awb_code, courier_name, tracking_url")
    .eq("awb_code", awbCode)
    .single();

  if (!order) return NextResponse.json({ ok: true });

  // Skip if status hasn't changed or moved backward
  if (order.order_status === mappedStatus) return NextResponse.json({ ok: true });

  const updates: Record<string, string | null> = { order_status: mappedStatus };
  if (mappedStatus === "shipped")   updates.shipped_at   = new Date().toISOString();
  if (mappedStatus === "delivered") updates.delivered_at = new Date().toISOString();

  await admin.from("orders").update(updates).eq("id", order.id);

  await admin.from("order_status_history").insert({
    order_id:   order.id,
    status:     mappedStatus,
    note:       `Shiprocket update: ${srStatus}`,
    changed_by: "system",
  });

  // Send "shipped" notifications when package is in transit
  if (mappedStatus === "shipped") {
    const { data: fullOrder } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order.id)
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
