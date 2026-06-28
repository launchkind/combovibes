import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, Truck, Clock } from "lucide-react";
import ShipButton from "./ShipButton";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  pending:          "bg-gray-100 text-gray-600",
  confirmed:        "bg-blue-100 text-blue-700",
  processing:       "bg-amber-100 text-amber-700",
  shipped:          "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered:        "bg-green-100 text-green-700",
  cancelled:        "bg-red-100 text-red-600",
  returned:         "bg-orange-100 text-orange-700",
};

const SLOT_LABELS: Record<string, string> = {
  morning: "8 AM – 12 PM", evening: "4 PM – 8 PM", midnight: "10 PM – 12 AM",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = await params;
  const admin   = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .select("*, order_items(*), order_status_history(*)")
    .eq("id", id)
    .order("created_at", { ascending: true, referencedTable: "order_status_history" })
    .single();

  if (error || !order) notFound();

  const canShip = order.payment_status === "paid" && !order.shiprocket_order_id;
  let disabledMsg = "";
  if (order.payment_status !== "paid") disabledMsg = "not paid";
  else if (order.shiprocket_order_id)  disabledMsg = "already shipped";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900">{order.order_number}</h1>
            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLOR[order.order_status]}`}>
            {order.order_status}
          </span>
          <ShipButton orderId={id} disabled={!canShip} disabledMsg={disabledMsg} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Sender */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sender (Buyer)</h2>
          <p className="text-sm font-medium text-gray-800">{order.sender_name}</p>
          <p className="text-sm text-gray-600">{order.sender_email}</p>
          <p className="text-sm text-gray-600">{order.sender_phone}</p>
        </div>

        {/* Recipient */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Recipient & Delivery
          </h2>
          <p className="text-sm font-medium text-gray-800">{order.recipient_name} · {order.recipient_phone}</p>
          <p className="text-sm text-gray-600">
            {order.delivery_line1}{order.delivery_line2 ? `, ${order.delivery_line2}` : ""}<br />
            {order.delivery_city}, {order.delivery_state} – {order.delivery_pincode}
          </p>
          <p className="text-sm text-gray-700 font-medium">{order.delivery_date} · {SLOT_LABELS[order.delivery_slot]}</p>
          {order.gift_message && (
            <p className="text-xs text-gray-500 italic mt-1">"{order.gift_message}"</p>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" /> Payment
          </h2>
          <p className="text-sm">
            Status: <span className={`font-semibold ${order.payment_status === "paid" ? "text-green-600" : "text-red-500"}`}>{order.payment_status}</span>
          </p>
          {order.payment_method && <p className="text-sm text-gray-600">Method: {order.payment_method}</p>}
          {order.cashfree_order_id && <p className="text-xs text-gray-400 font-mono">CF Order: {order.cashfree_order_id}</p>}
          {order.cashfree_payment_id && <p className="text-xs text-gray-400 font-mono">CF Payment: {order.cashfree_payment_id}</p>}
          {order.paid_at && <p className="text-xs text-gray-400">Paid: {new Date(order.paid_at).toLocaleString("en-IN")}</p>}
        </div>

        {/* Shipment */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Shipment
          </h2>
          {order.shiprocket_order_id ? (
            <>
              <p className="text-sm text-gray-700">Courier: <strong>{order.courier_name}</strong></p>
              <p className="text-sm text-gray-700">AWB: <strong>{order.awb_code}</strong></p>
              <p className="text-xs text-gray-400">SR Order ID: {order.shiprocket_order_id}</p>
              {order.tracking_url && (
                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                   className="text-xs text-[#D81B60] font-medium hover:underline">
                  Track Package →
                </a>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">No shipment created yet</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
          <Package className="w-3.5 h-3.5" /> Order Items
        </h2>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-gray-100">
            <tr>
              <th className="text-left py-2">Product</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(order.order_items ?? []).map((item: {
              id: string; product_name: string; quantity: number;
              unit_price: number; line_total: number;
            }) => (
              <tr key={item.id}>
                <td className="py-2 text-gray-800">{item.product_name}</td>
                <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                <td className="py-2 text-right text-gray-600">₹{Number(item.unit_price).toLocaleString("en-IN")}</td>
                <td className="py-2 text-right font-medium text-gray-900">₹{Number(item.line_total).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-200">
            <tr>
              <td colSpan={2} />
              <td className="py-2 text-right text-sm text-gray-500">Delivery</td>
              <td className="py-2 text-right text-sm font-medium text-gray-700">
                {Number(order.delivery_fee) === 0 ? "FREE" : `₹${Number(order.delivery_fee).toLocaleString("en-IN")}`}
              </td>
            </tr>
            <tr>
              <td colSpan={2} />
              <td className="py-2 text-right font-bold text-gray-900">Total</td>
              <td className="py-2 text-right font-black text-gray-900 text-base">₹{Number(order.total_amount).toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Status History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Status History
        </h2>
        {(order.order_status_history ?? []).map((h: {
          id: string; status: string; note: string | null;
          changed_by: string; created_at: string;
        }) => (
          <div key={h.id} className="flex gap-3 text-xs">
            <span className="text-gray-400 whitespace-nowrap shrink-0">
              {new Date(h.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className={`font-semibold px-2 py-0.5 rounded-full self-start ${STATUS_COLOR[h.status] ?? "bg-gray-100 text-gray-600"}`}>
              {h.status}
            </span>
            {h.note && <span className="text-gray-600">{h.note}</span>}
            <span className="text-gray-400 ml-auto shrink-0">{h.changed_by}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
