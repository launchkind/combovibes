import { createAdminClient } from "@/lib/supabase/admin";
import { getCashfreeOrder, getCashfreePayments } from "@/lib/cashfree";
import { markOrderFailed, markOrderPaid } from "@/lib/order-fulfillment";
import type { CashfreePayment } from "@/lib/cashfree";

/**
 * Reconciles a local order against Cashfree's own record of it.
 *
 * The webhook is the primary confirmation path in production, but it cannot
 * reach a localhost tunnel-less dev server — and even in production it can be
 * delayed or dropped. So the return URL performs the same reconciliation
 * synchronously, which makes the sandbox ("test mode") flow work end to end
 * with no webhook configured at all.
 *
 * Fulfillment itself is delegated to `order-fulfillment`, whose conditional
 * update guarantees the work runs once no matter which path wins.
 */

export interface VerifyResult {
  orderId:       string;
  orderNumber:   string | null;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:   string;
  /** Set when reconciliation could not run (config/network); the order is untouched. */
  error?:        string;
}

const TERMINAL_FAILURE: ReadonlySet<string> = new Set([
  "FAILED",
  "USER_DROPPED",
  "CANCELLED",
  "VOID",
]);

/** Newest attempt wins — Cashfree returns attempts in ascending time order. */
function latestPayment(payments: CashfreePayment[]): CashfreePayment | null {
  if (payments.length === 0) return null;
  const successful = payments.find((p) => p.payment_status === "SUCCESS");
  return successful ?? payments[payments.length - 1];
}

export async function verifyOrderPayment(orderId: string): Promise<VerifyResult> {
  const admin = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .select("id, order_number, payment_status, order_status, total_amount")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return {
      orderId,
      orderNumber:   null,
      paymentStatus: "pending",
      orderStatus:   "pending",
      error:         "Order not found",
    };
  }

  const settled: VerifyResult = {
    orderId,
    orderNumber:   order.order_number,
    paymentStatus: order.payment_status,
    orderStatus:   order.order_status,
  };

  // Only `paid`/`refunded` are terminal. A `failed` order is still worth
  // re-checking: the customer may have retried successfully on Cashfree's page
  // after the declined attempt that marked it failed.
  if (order.payment_status === "paid" || order.payment_status === "refunded") {
    return settled;
  }

  let cfStatus: string;
  let cfAmount: number;
  let payments: CashfreePayment[] = [];

  try {
    // Looked up by OUR order id, which is what we passed to Cashfree as `order_id`.
    const cfOrder = await getCashfreeOrder(orderId);
    cfStatus = cfOrder.order_status;
    cfAmount = Number(cfOrder.order_amount);
    payments = await getCashfreePayments(orderId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[verify] Cashfree lookup failed for order", orderId, message);
    return { ...settled, error: message };
  }

  if (cfStatus === "PAID") {
    // Guard against a tampered/mismatched amount before granting fulfillment.
    const expected = Number(order.total_amount);
    if (Number.isFinite(expected) && Math.abs(expected - cfAmount) > 0.01) {
      console.error(
        `[verify] amount mismatch on order ${orderId}: expected ${expected}, Cashfree reports ${cfAmount}`
      );
      return { ...settled, error: "Payment amount mismatch" };
    }

    const paid = latestPayment(payments.filter((p) => p.payment_status === "SUCCESS"));
    const result = await markOrderPaid({
      orderId,
      cashfreePaymentId: paid ? String(paid.cf_payment_id) : null,
      paymentMethod:     paid?.payment_group ?? "cashfree",
      paidAt:            paid?.payment_time ?? null,
      source:            "verify",
    });

    return {
      ...settled,
      paymentStatus: result.paymentStatus,
      orderStatus:   result.orderStatus,
    };
  }

  if (cfStatus === "EXPIRED" || cfStatus === "TERMINATED") {
    const result = await markOrderFailed(
      orderId,
      `Payment session ${cfStatus.toLowerCase()}`,
      "verify"
    );
    return { ...settled, paymentStatus: result.paymentStatus, orderStatus: result.orderStatus };
  }

  // Order is still ACTIVE. If the customer's last attempt terminally failed
  // (declined card, dropped out of the UPI flow), close it out so the UI can
  // offer a retry. A PENDING attempt (UPI collect awaiting approval) stays open.
  const last = latestPayment(payments);
  if (last && TERMINAL_FAILURE.has(last.payment_status)) {
    const result = await markOrderFailed(
      orderId,
      last.payment_message?.trim() || `Payment ${last.payment_status.toLowerCase()}`,
      "verify"
    );
    return { ...settled, paymentStatus: result.paymentStatus, orderStatus: result.orderStatus };
  }

  return settled;
}
