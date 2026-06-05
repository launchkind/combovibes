import { mockOrders } from "@/lib/mockOrders";
import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/formatters";
import { DashboardChart } from "@/components/admin/DashboardChart";
import { TrendingUp, ShoppingBag, Package, Users, ArrowUpRight } from "lucide-react";

export const metadata = { title: "Dashboard" };

export default function AdminDashboard() {
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = mockOrders.length;
  const activeProducts = mockProducts.length;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), change: "+12.5%", icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "Total Orders", value: totalOrders.toString(), change: "+8.2%", icon: ShoppingBag, color: "text-blue-600 bg-blue-100" },
    { label: "Active Products", value: activeProducts.toString(), change: "+3", icon: Package, color: "text-purple-600 bg-purple-100" },
    { label: "Customers", value: "1,284", change: "+24", icon: Users, color: "text-primary bg-primary/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-background rounded-2xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />{stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-background rounded-2xl border border-border p-5 shadow-card">
        <h2 className="font-semibold text-foreground mb-4">Revenue — Last 7 days</h2>
        <DashboardChart />
      </div>

      {/* Recent orders */}
      <div className="bg-background rounded-2xl border border-border p-5 shadow-card">
        <h2 className="font-semibold text-foreground mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {mockOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-3 text-sm">
              <div className="flex-1">
                <p className="font-medium text-foreground">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{order.address.name} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                order.status === "delivered" ? "bg-green-100 text-green-700" :
                order.status === "out_for_delivery" ? "bg-orange-100 text-orange-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {order.status.replace(/_/g, " ")}
              </span>
              <span className="font-semibold shrink-0">{formatPrice(order.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
