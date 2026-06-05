import { mockVendorOrders } from "@/lib/mockVendorOrders";
import { formatPrice } from "@/lib/formatters";
import { ShoppingBag, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default function VendorDashboard() {
  const totalEarnings = mockVendorOrders.reduce((s, o) => s + o.earnings, 0);
  const pendingOrders = mockVendorOrders.filter((o) => o.status !== "delivered").length;
  const completedOrders = mockVendorOrders.filter((o) => o.status === "delivered").length;

  const stats = [
    { label: "Active Orders", value: pendingOrders.toString(), icon: ShoppingBag, color: "text-blue-600 bg-blue-100" },
    { label: "Total Earnings", value: formatPrice(totalEarnings), icon: IndianRupee, color: "text-green-600 bg-green-100" },
    { label: "Completed", value: completedOrders.toString(), icon: CheckCircle2, color: "text-primary bg-primary/10" },
    { label: "Avg Delivery", value: "28 min", icon: Clock, color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-foreground">Vendor Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your assigned orders and track earnings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-background rounded-2xl border border-border p-5 shadow-card">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Today's orders */}
      <div className="bg-background rounded-2xl border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Active Orders</h2>
          <Link href="/vendor/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {mockVendorOrders.filter((o) => o.status !== "delivered").map((order) => (
            <div key={order.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
              <div className="flex gap-1">
                {order.items.slice(0, 2).map((item, i) => (
                  <span key={i} className="text-xl">{item.emoji}</span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{order.deliveryDate} · {order.deliverySlot}</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700 shrink-0">
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
