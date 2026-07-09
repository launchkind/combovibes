import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, CreditCard, Truck, Clock } from "lucide-react";
import ShipButton from "./ShipButton";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  pending:          "bg-gray-100 text-gray-600",
  blocked:          "bg-red-100 text-red-600",
  confirmed:        "bg-blue-100 text-blue-700",
  processing:       "bg-amber-100 text-amber-700",
  shipped:          "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered:        "bg-green-100 text-green-700",
  cancelled:        "bg-red-100 text-red-600",
  returned:         "bg-orange-100 text-orange-700",
  failed:           "bg-red-100 text-red-600",
};

const SLOT_LABELS: Record<string, string> = {
  morning: "8 AM – 12 PM", evening: "4 PM – 8 PM", midnight: "10 PM – 12 AM",
};

type ShipmentRow = {
  id: string;
  vendor_id: string | null;
  vendor_name_snapshot: string;
  status: string;
  courier_name: string | null;
  awb_code: string | null;
  tracking_url: string | null;
  shiprocket_order_id: number | null;
  last_error: string | null;
};

type OrderItemRow = {
  id: string; product_name: string; quantity: number;
  unit_price: number; line_total: number; vendor_id: string | null;
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
    .select("*, order_items(*), order_status_history(*), shipments(*)")
    .eq("id", id)
    .order("created_at", { ascending: true, referencedTable: "order_status_history" })
    .single();

  if (error || !order) notFound();

  const shipments: ShipmentRow[] = order.shipments ?? [];
  const items: OrderItemRow[] = order.order_items ?? [];

  const itemsByVendor = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    const key = item.vendor_id ?? "";
    if (!itemsByVendor.has(key)) itemsByVendor.set(key, []);
    itemsByVendor.get(key)!.push(item);
  }

  const canShipAny = order.payment_status === "paid" && shipments.some((s) => s.status !== "processing" && !["shipped", "out_for_delivery", "delivered"].includes(s.status));
  let disabledMsg = "";
  if (order.payment_status !== "paid") disabledMsg = "not paid";

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
          {shipments.length > 1 && (
            <ShipButton orderId={id} disabled={!canShipAny} disabledMsg={disabledMsg} label="Retry All Shipments" />
          )}
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Order Total</h2>
          <p className="text-sm text-gray-600">Subtotal: ₹{Number(order.subtotal).toLocaleString("en-IN")}</p>
          <p className="text-sm text-gray-600">Delivery: {Number(order.delivery_fee) === 0 ? "FREE" : `₹${Number(order.delivery_fee).toLocaleString("en-IN")}`}</p>
          <p className="text-base font-black text-gray-900">Total: ₹{Number(order.total_amount).toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Per-vendor shipments */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Shipments {shipments.length > 0 && `(${shipments.length})`}
        </h2>

        {shipments.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-400">No shipments created yet — shipments are created automatically once payment is confirmed.</p>
          </div>
        )}

        {shipments.map((s) => {
          const vendorItems = itemsByVendor.get(s.vendor_id ?? "") ?? [];
          const canRetry = order.payment_status === "paid" && s.status !== "processing" && !["shipped", "out_for_delivery", "delivered"].includes(s.status);
          let retryDisabledMsg = "";
          if (order.payment_status !== "paid") retryDisabledMsg = "not paid";
          else if (s.status === "processing" || ["shipped", "out_for_delivery", "delivered"].includes(s.status)) retryDisabledMsg = "already shipped";

          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{s.vendor_name_snapshot}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[s.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {s.status}
                  </span>
                </div>
                <ShipButton
                  orderId={id}
                  vendorId={s.vendor_id ?? undefined}
                  disabled={!canRetry}
                  disabledMsg={retryDisabledMsg}
                  label={s.status === "blocked" || s.status === "failed" ? "Retry Shipment" : "Create Shipment"}
                />
              </div>

              {s.status === "processing" || ["shipped", "out_for_delivery", "delivered"].includes(s.status) ? (
                <div className="text-sm text-gray-700 space-y-0.5">
                  <p>Courier: <strong>{s.courier_name}</strong></p>
                  <p>AWB: <strong>{s.awb_code}</strong></p>
                  {s.tracking_url && (
                    <a href={s.tracking_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-[#D81B60] font-medium hover:underline inline-block mt-1">
                      Track Package →
                    </a>
                  )}
                </div>
              ) : (s.status === "blocked" || s.status === "failed") && s.last_error ? (
                <p className="text-xs text-red-500">{s.last_error}</p>
              ) : null}

              <table className="w-full text-sm border-t border-gray-100 pt-2">
                <tbody className="divide-y divide-gray-50">
                  {vendorItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-1.5 text-gray-700">{item.product_name} <span className="text-gray-400">×{item.quantity}</span></td>
                      <td className="py-1.5 text-right font-medium text-gray-900">₹{Number(item.line_total).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
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
