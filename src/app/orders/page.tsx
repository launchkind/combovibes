import Link from "next/link";
import { mockOrders } from "@/lib/mockOrders";
import { formatPrice } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:           { label: "Pending",           className: "bg-yellow-100 text-yellow-700 border-0" },
  confirmed:         { label: "Confirmed",          className: "bg-blue-100 text-blue-700 border-0" },
  processing:        { label: "Preparing",          className: "bg-purple-100 text-purple-700 border-0" },
  shipped:           { label: "Picked Up",          className: "bg-indigo-100 text-indigo-700 border-0" },
  out_for_delivery:  { label: "Out for Delivery",   className: "bg-orange-100 text-orange-700 border-0" },
  delivered:         { label: "Delivered",          className: "bg-green-100 text-green-700 border-0" },
  cancelled:         { label: "Cancelled",          className: "bg-red-100 text-red-700 border-0" },
};

export const metadata = { title: "My Orders" };

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground mb-6">
        My Orders
      </h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-playfair text-xl">No orders yet</p>
          <Button className="mt-4 rounded-full" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const status = statusConfig[order.status] ?? { label: order.status, className: "" };
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-background border border-border rounded-2xl p-5 hover:shadow-card-hover transition-shadow group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} className="text-2xl">{item.emoji}</span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>
                  )}
                  <span className="ml-auto font-semibold text-sm">{formatPrice(order.total)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
