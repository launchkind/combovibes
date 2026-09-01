import { createAdminClient } from "@/lib/supabase/admin";
import { createShipmentsForOrder } from "@/lib/shipment-service";
import { sendOrderConfirmationEmail } from "@/lib/notifications/email";
import { sendOrderConfirmationWhatsApp } from "@/lib/notifications/whatsapp";
import type { Order } from "@/types/order.types";

/**
 * Post-payment fulfillment, shared by the Cashfree webhook and the return-URL
 * verification endpoint. Both can fire for the same order, in either order, and
 * concurrently — so the state transition is the lock: only the caller that wins
 * the conditional `pending -> paid` update runs the side effects.
 */

export interface MarkPaidInput {
  orderId:        string;
  cashfreePaymentId?: string | null;
  paymentMethod?: string | null;
  paidAt?:        string | null;
  /** Recorded in the audit trail so we can tell webhook-driven from return-driven. */
  source:         "webhook" | "verify" | "admin";
}

export interface FulfillmentResult {
  /** False when another caller had already transitioned the order. */
  transitioned: boolean;
  paymentStatus: "paid" | "failed" | "pending" | "refunded";
  orderStatus:   string;
}

/**
 * Atomically flips an order to paid and runs fulfillment exactly once.
 *
 * The `payment_status` predicate is the guard — Postgres serialises the two
 * updates, so the loser gets zero rows back and skips the side effects rather
 * than double-decrementing stock or double-shipping.
 *
 * It accepts `failed` as well as `pending`, which matters: Cashfree emits
 * PAYMENT_FAILED_WEBHOOK the moment a card declines, but the customer is still
 * on the Cashfree page and can retry with another instrument. Only `paid` is
 * terminal here — otherwise a recovered payment would leave the customer
 * charged against a cancelled order.
 */
export async function markOrderPaid(input: MarkPaidInput): Promise<FulfillmentResult> {
  const admin = createAdminClient();
  const now   = input.paidAt ?? new Date().toISOString();

  const { data: claimed, error: claimErr } = await admin
    .from("orders")
    .update({
      payment_status:      "paid",
      order_status:        "confirmed",
      cashfree_payment_id: input.cashfreePaymentId ? String(input.cashfreePaymentId) : null,
      payment_method:      input.paymentMethod ?? null,
      paid_at:             now,
    })
    .eq("id", input.orderId)
    .in("payment_status", ["pending", "failed"])
    .select("id");

  if (claimErr) {
    throw new Error(`Failed to mark order paid: ${claimErr.message}`);
  }

  // Lost the race (or the order was never pending) — report current state, do nothing else.
  if (!claimed || claimed.length === 0) {
    const { data: current } = await admin
      .from("orders")
      .select("payment_status, order_status")
      .eq("id", input.orderId)
      .single();

    return {
      transitioned:  false,
      paymentStatus: (current?.payment_status ?? "pending") as FulfillmentResult["paymentStatus"],
      orderStatus:   current?.order_status ?? "pending",
    };
  }

  // ── We own this transition: run side effects exactly once ──────────────────

  await admin.from("order_status_history").insert({
    order_id:   input.orderId,
    status:     "confirmed",
    note:       `Payment confirmed via ${input.paymentMethod ?? "Cashfree"}` +
                (input.cashfreePaymentId ? ` (payment ID: ${input.cashfreePaymentId})` : "") +
                ` [${input.source}]`,
    changed_by: "system",
  });

  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", input.orderId)
    .single();

  // Decrement stock for tracked products.
  for (const item of (order?.order_items ?? [])) {
    if (!item.product_id) continue;
    const { error: stockErr } = await admin.rpc("decrement_stock", {
      p_product_id: item.product_id,
      p_quantity:   item.quantity,
    });
    if (stockErr) {
      console.error("[fulfillment] stock decrement failed:", item.product_id, stockErr.message);
    }
  }

  // Create per-vendor Shiprocket shipments. Non-fatal: the order is paid either
  // way and an admin can retry from the panel.
  try {
    const result = await createShipmentsForOrder(input.orderId, { actor: "system" });
    if (result.anyFailed) {
      console.error("[fulfillment] some vendor shipments failed/blocked:", result.results);
    }
  } catch (err) {
    console.error("[fulfillment] shipment creation failed:", err);
  }

  // Notifications are best-effort — never let them fail the payment flow.
  if (order) {
    const o = order as Order;
    await Promise.allSettled([
      sendOrderConfirmationEmail(o),
      sendOrderConfirmationWhatsApp({
        phone:        o.sender_phone,
        orderNumber:  o.order_number,
        senderName:   o.sender_name,
        deliveryDate: o.delivery_date,
        totalAmount:  o.total_amount,
      }),
    ]);
  }

  const { data: fresh } = await admin
    .from("orders")
    .select("payment_status, order_status")
    .eq("id", input.orderId)
    .single();

  return {
    transitioned:  true,
    paymentStatus: (fresh?.payment_status ?? "paid") as FulfillmentResult["paymentStatus"],
    orderStatus:   fresh?.order_status ?? "confirmed",
  };
}

/**
 * Marks a still-pending order as failed. Guarded the same way, so a late
 * "failed" webhook can never clobber an order that has already been paid.
 */
export async function markOrderFailed(
  orderId: string,
  reason:  string,
  source:  "webhook" | "verify" | "admin" = "webhook"
): Promise<FulfillmentResult> {
  const admin = createAdminClient();

  const { data: claimed } = await admin
    .from("orders")
    .update({ payment_status: "failed", order_status: "cancelled" })
    .eq("id", orderId)
    .eq("payment_status", "pending")
    .select("id");

  if (claimed && claimed.length > 0) {
    await admin.from("order_status_history").insert({
      order_id:   orderId,
      status:     "cancelled",
      note:       `${reason} [${source}]`,
      changed_by: "system",
    });
    return { transitioned: true, paymentStatus: "failed", orderStatus: "cancelled" };
  }

  const { data: current } = await admin
    .from("orders")
    .select("payment_status, order_status")
    .eq("id", orderId)
    .single();

  return {
    transitioned:  false,
    paymentStatus: (current?.payment_status ?? "pending") as FulfillmentResult["paymentStatus"],
    orderStatus:   current?.order_status ?? "pending",
  };
}
