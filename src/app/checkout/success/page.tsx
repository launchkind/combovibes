import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Package, MapPin, Calendar } from "lucide-react";
import ClearCartOnSuccess from "./ClearCartOnSuccess";
import PendingView from "./PendingView";
import { verifyOrderPayment } from "@/lib/order-verification";

export const dynamic = "force-dynamic";

const SLOT_LABELS: Record<string, string> = {
  morning:  "8 AM – 12 PM",
  evening:  "4 PM – 8 PM",
  midnight: "10 PM – 12 AM",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!order_id || !uuidRe.test(order_id)) notFound();

  // Cashfree has just redirected the customer back here. Reconcile with the
  // gateway before rendering so the confirmed page shows immediately, rather
  // than waiting on a webhook that never arrives in sandbox/test mode.
  await verifyOrderPayment(order_id).catch((err) => {
    console.error("[checkout/success] verification failed:", err);
  });

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, order_number, payment_status, order_status, total_amount, sender_name, sender_email, recipient_name, delivery_line1, delivery_line2, delivery_city, delivery_state, delivery_pincode, delivery_date, delivery_slot, order_items(product_name, quantity, unit_price)")
    .eq("id", order_id)
    .single();

  if (!order) notFound();

  // Still unresolved (e.g. a UPI collect request awaiting approval) — the client
  // keeps polling the verify endpoint until it settles.
  if (order.payment_status === "pending") {
    return <PendingView orderId={order_id} />;
  }

  if (order.payment_status === "failed" || order.order_status === "cancelled") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-black text-gray-900">Payment Failed</h1>
          <p className="text-gray-500 text-sm">Your payment could not be processed. No money has been charged.</p>
          <p className="text-xs text-gray-400">Order ref: {order.order_number}</p>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/checkout" className="bg-[#D81B60] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#C2185B] transition-colors">
              Try Again
            </Link>
            <Link href="/shop" className="text-sm text-gray-500 hover:text-gray-700 py-2">
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Paid!
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <ClearCartOnSuccess />
      <div className="max-w-2xl mx-auto px-4 pt-12 space-y-6">

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-3">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-black text-gray-900">Order Confirmed! 🎁</h1>
          <p className="text-gray-500 text-sm">
            Hi {order.sender_name}, your gift is being prepared with love.
          </p>
          <div className="inline-block bg-gray-100 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500">Order Number</p>
            <p className="text-lg font-black text-gray-900">{order.order_number}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#D81B60]" /> Items Ordered
          </h2>
          {(order.order_items ?? []).map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700">
              <span>{item.product_name} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="font-medium">₹{(item.unit_price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
            <span>Total Paid</span>
            <span>₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D81B60]" /> Delivery Details
          </h2>
          <p className="text-sm font-medium text-gray-800">{order.recipient_name}</p>
          <p className="text-sm text-gray-600">
            {order.delivery_line1}{order.delivery_line2 ? `, ${order.delivery_line2}` : ""},{" "}
            {order.delivery_city}, {order.delivery_state} – {order.delivery_pincode}
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-1.5 mt-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            {order.delivery_date} · {SLOT_LABELS[order.delivery_slot] ?? order.delivery_slot}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account/orders"
            className="flex-1 text-center bg-[#D81B60] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#C2185B] transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="flex-1 text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400">
          A confirmation email has been sent to {order.sender_email}
        </p>
      </div>
    </main>
  );
}
