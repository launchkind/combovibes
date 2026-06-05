import { mockOrders } from "@/lib/mockOrders";
import { formatPrice } from "@/lib/formatters";
import { Search } from "lucide-react";

export const metadata = { title: "Orders" };

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{mockOrders.length} total orders</p>
        </div>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary w-64"
          />
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Order</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">Customer</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <p className="text-foreground">{order.address.name}</p>
                    <p className="text-xs text-muted-foreground">{order.address.city}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex gap-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="text-xl">{item.emoji}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
