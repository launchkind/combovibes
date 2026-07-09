"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, Truck, CheckCircle2, Circle } from "lucide-react";
import type { Order, OrderStatusHistory } from "@/types/order.types";

const STATUS_STEPS = [
  { key: "pending",          label: "Order Placed",        icon: Package },
  { key: "confirmed",        label: "Payment Confirmed",   icon: CheckCircle2 },
  { key: "processing",       label: "Being Prepared",      icon: Package },
  { key: "shipped",          label: "Shipped",             icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery",    icon: Truck },
  { key: "delivered",        label: "Delivered",           icon: CheckCircle2 },
];

const SLOT_LABELS: Record<string, string> = {
  morning: "8 AM – 12 PM", evening: "4 PM – 8 PM", midnight: "10 PM – 12 AM",
};

export default function OrderDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) setError(j.error);
        else setOrder(j.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />;
  if (error || !order) return <p className="text-red-500 text-sm">{error || "Order not found"}</p>;

  const historyMap = new Map<string, OrderStatusHistory>(
    (order.order_status_history ?? []).map((h) => [h.status, h])
  );

  const activeStepIdx = STATUS_STEPS.findIndex((s) => s.key === order.order_status);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/account/orders" className="text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-black text-gray-900">{order.order_number}</h1>
          <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Order Status</h2>
        <div className="space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const isCompleted = i <= activeStepIdx;
            const isCurrent   = i === activeStepIdx;
            const history     = historyMap.get(step.key);
            const Icon        = step.icon;
            return (
              <div key={step.key} className="flex gap-3 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                    isCompleted ? "bg-[#D81B60] border-[#D81B60] text-white" : "bg-white border-gray-200 text-gray-300"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${isCompleted ? "bg-[#D81B60]" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="pt-1 pb-1">
                  <p className={`text-sm font-semibold ${isCurrent ? "text-[#D81B60]" : isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  {history && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(history.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {history.note ? ` · ${history.note}` : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking info */}
      {order.shipments && order.shipments.length > 1 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#D81B60]" /> Tracking ({order.shipments.length} packages)
          </h2>
          {order.shipments.map((s) => (
            <div key={s.id} className="space-y-1 border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
              <p className="text-sm font-semibold text-gray-800">{s.vendor_name_snapshot}</p>
              {s.awb_code ? (
                <>
                  <p className="text-sm text-gray-700">Courier: <strong>{s.courier_name}</strong></p>
                  <p className="text-sm text-gray-700">AWB: <strong>{s.awb_code}</strong></p>
                  {s.tracking_url && (
                    <a href={s.tracking_url} target="_blank" rel="noopener noreferrer"
                       className="inline-block text-sm text-[#D81B60] font-medium hover:underline mt-1">
                      Track Package →
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400">Preparing for dispatch…</p>
              )}
            </div>
          ))}
        </div>
      ) : order.awb_code && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#D81B60]" /> Tracking
          </h2>
          <p className="text-sm text-gray-700">Courier: <strong>{order.courier_name}</strong></p>
          <p className="text-sm text-gray-700">AWB: <strong>{order.awb_code}</strong></p>
          {order.tracking_url && (
            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
               className="inline-block text-sm text-[#D81B60] font-medium hover:underline mt-1">
              Track Package →
            </a>
          )}
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#D81B60]" /> Items
        </h2>
        {(order.order_items ?? []).map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.product_name} <span className="text-gray-400">×{item.quantity}</span></span>
            <span className="font-medium text-gray-900">₹{(item.unit_price * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-2 space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className={order.delivery_fee === 0 ? "text-green-600" : ""}>
              {order.delivery_fee === 0 ? "FREE" : `₹${order.delivery_fee}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-1">
            <span>Total Paid</span><span>₹{order.total_amount.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#D81B60]" /> Delivery Details
        </h2>
        <p className="text-sm font-medium text-gray-800">{order.recipient_name} · {order.recipient_phone}</p>
        <p className="text-sm text-gray-600">
          {order.delivery_line1}{order.delivery_line2 ? `, ${order.delivery_line2}` : ""}, {order.delivery_city}, {order.delivery_state} – {order.delivery_pincode}
        </p>
        <p className="text-sm text-gray-600">{order.delivery_date} · {SLOT_LABELS[order.delivery_slot]}</p>
        {order.gift_message && (
          <p className="text-sm text-gray-500 italic mt-1">Gift message: "{order.gift_message}"</p>
        )}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#D81B60]" /> Payment
        </h2>
        <p className="text-sm text-gray-700">Status: <span className={`font-semibold ${order.payment_status === "paid" ? "text-green-600" : "text-gray-700"}`}>{order.payment_status}</span></p>
        {order.payment_method && <p className="text-sm text-gray-600">Method: {order.payment_method}</p>}
        {order.cashfree_payment_id && <p className="text-xs text-gray-400 font-mono">Payment ID: {order.cashfree_payment_id}</p>}
      </div>
    </div>
  );
}
