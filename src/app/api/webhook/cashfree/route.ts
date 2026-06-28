import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { createShiprocketOrder, generateAWB, buildShiprocketPayload } from "@/lib/shiprocket";
import { sendOrderConfirmationEmail, sendShippedEmail } from "@/lib/notifications/email";
import { sendOrderConfirmationWhatsApp, sendShippedWhatsApp } from "@/lib/notifications/whatsapp";
import type { Order } from "@/types/order.types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody   = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";

  if (!signature || !timestamp) {
    return NextResponse.json({ error: "Missing signature headers" }, { status: 400 });
  }

  let valid = false;
  try {
    valid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);
  } catch {
    return NextResponse.json({ error: "Signature verification error" }, { status: 400 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event     = JSON.parse(rawBody) as Record<string, unknown>;
  const eventType = event.type as string;
  const admin     = createAdminClient();

  if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
    const eventData   = event.data as Record<string, Record<string, unknown>>;
    const cfOrderId   = eventData.order.cf_order_id as string;
    const paymentId   = eventData.payment.cf_payment_id as string;
    const paymentGroup = eventData.payment.payment_group as string;

    const { data: order, error } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("cashfree_order_id", cfOrderId)
      .single();

    if (error || !order) {
      console.error("[cashfree-webhook] Order not found for cf_order_id:", cfOrderId);
      return NextResponse.json({ received: true });
    }

    // Idempotency guard
    if (order.payment_status === "paid") {
      return NextResponse.json({ received: true });
    }

    // Mark payment as paid + order as confirmed
    const now = new Date().toISOString();
    await admin.from("orders").update({
      payment_status:      "paid",
      order_status:        "confirmed",
      cashfree_payment_id: String(paymentId),
      payment_method:      paymentGroup,
      paid_at:             now,
    }).eq("id", order.id);

    await admin.from("order_status_history").insert({
      order_id:   order.id,
      status:     "confirmed",
      note:       `Payment received via ${paymentGroup}. Payment ID: ${paymentId}`,
      changed_by: "system",
    });

    // Decrement stock for tracked products
    for (const item of (order.order_items ?? [])) {
      if (item.product_id) {
        const { error: stockErr } = await admin.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity:   item.quantity,
        });
        if (stockErr) console.error("[cashfree-webhook] stock decrement failed:", stockErr);
      }
    }

    // Create Shiprocket order + assign AWB
    try {
      const srPayload = buildShiprocketPayload(order as Order);
      const srOrder   = await createShiprocketOrder(srPayload);

      // Auto-assign AWB (Shiprocket picks best courier)
      await generateAWB(srOrder.shipment_id);

      const awbCode    = srOrder.awb_code;
      const trackingUrl = awbCode
        ? `https://shiprocket.co/tracking/${awbCode}`
        : null;

      await admin.from("orders").update({
        shiprocket_order_id:    srOrder.order_id,
        shiprocket_shipment_id: srOrder.shipment_id,
        awb_code:               awbCode,
        courier_name:           srOrder.courier_name,
        tracking_url:           trackingUrl,
        order_status:           "processing",
      }).eq("id", order.id);

      await admin.from("order_status_history").insert({
        order_id:   order.id,
        status:     "processing",
        note:       `Shipment created via ${srOrder.courier_name}. AWB: ${awbCode}`,
        changed_by: "system",
      });
    } catch (srErr) {
      // Non-fatal: order is paid; admin can retry from the panel
      console.error("[cashfree-webhook] Shiprocket creation failed:", srErr);
    }

    // Fetch updated order for notifications
    const { data: fullOrder } = await admin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order.id)
      .single();

    if (fullOrder) {
      const o = fullOrder as Order;
      sendOrderConfirmationEmail(o);
      sendOrderConfirmationWhatsApp({
        phone:        o.sender_phone,
        orderNumber:  o.order_number,
        senderName:   o.sender_name,
        deliveryDate: o.delivery_date,
        totalAmount:  o.total_amount,
      });
    }
  }

  if (eventType === "PAYMENT_FAILED_WEBHOOK") {
    const eventData = event.data as Record<string, Record<string, unknown>>;
    const cfOrderId = eventData.order.cf_order_id as string;

    const { data: order } = await admin
      .from("orders")
      .select("id")
      .eq("cashfree_order_id", cfOrderId)
      .single();

    if (order) {
      await admin.from("orders")
        .update({ payment_status: "failed", order_status: "cancelled" })
        .eq("id", order.id);

      await admin.from("order_status_history").insert({
        order_id:   order.id,
        status:     "cancelled",
        note:       "Payment failed",
        changed_by: "system",
      });
    }
  }

  if (eventType === "SHIPMENT_PICKED_UP" || eventType === "SHIPMENT_DELIVERED") {
    // Handled by Shiprocket webhook — but Cashfree may also relay these in some configs
  }

  return NextResponse.json({ received: true });
}
