"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import type { Order } from "@/types/order.types";

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

const STATUS_LABEL: Record<string, string> = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  processing:       "Processing",
  shipped:          "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
  returned:         "Returned",
};

const SLOT_LABELS: Record<string, string> = {
  morning: "8–12 AM", evening: "4–8 PM", midnight: "10 PM–12 AM",
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Partial<Order>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((j) => { setOrders(j.data ?? []); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <Package className="w-16 h-16 text-gray-300 mx-auto" />
        <p className="text-gray-500 font-medium">No orders yet</p>
        <Link href="/shop" className="inline-block bg-[#D81B60] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#C2185B] transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-black text-gray-900">My Orders</h1>
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-[#D81B60]/30 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-sm">{order.order_number}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.order_status ?? "pending"]}`}>
                  {STATUS_LABEL[order.order_status ?? "pending"]}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                For {order.recipient_name} · {order.delivery_city}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {order.delivery_date} · {SLOT_LABELS[order.delivery_slot ?? "morning"]}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-gray-900 text-sm">
                ₹{Number(order.total_amount).toLocaleString("en-IN")}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
