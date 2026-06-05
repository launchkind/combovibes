"use client";
import { useState } from "react";
import { mockVendorOrders, statusFlow, statusLabels, type VendorOrderItem } from "@/lib/mockVendorOrders";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { MapPin, CalendarDays, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  assigned: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-indigo-100 text-indigo-700",
  picked_up: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrderItem[]>(mockVendorOrders);

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = statusFlow[o.status];
        if (!next) return o;
        toast.success(`Order ${o.orderNumber} → ${statusLabels[next]}`);
        return { ...o, status: next as VendorOrderItem["status"] };
      })
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-playfair text-2xl font-bold">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const nextStatus = statusFlow[order.status];
          return (
            <div key={order.id} className="bg-background rounded-2xl border border-border p-5 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-foreground">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">{order.customerName}</p>
                </div>
                <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium shrink-0", statusColors[order.status])}>
                  {statusLabels[order.status]}
                </span>
              </div>

              {/* Items */}
              <div className="flex gap-2 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery info */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  {order.deliveryDate} · {order.deliverySlot}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {order.address}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-600">Earnings: {formatPrice(order.earnings)}</span>
                {nextStatus ? (
                  <Button size="sm" className="rounded-full text-xs" onClick={() => advance(order.id)}>
                    Mark as {statusLabels[nextStatus]} <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                ) : (
                  <span className="text-xs text-green-600 font-medium">✓ Completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
