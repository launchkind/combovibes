import { mockVendorOrders } from "@/lib/mockVendorOrders";
import { formatPrice } from "@/lib/formatters";
import { IndianRupee } from "lucide-react";

export const metadata = { title: "Earnings" };

export default function VendorEarningsPage() {
  const total = mockVendorOrders.reduce((s, o) => s + o.earnings, 0);
  const delivered = mockVendorOrders.filter((o) => o.status === "delivered");
  const paid = delivered.reduce((s, o) => s + o.earnings, 0);
  const pending = total - paid;

  return (
    <div className="space-y-6">
      <h1 className="font-playfair text-2xl font-bold">Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Earnings", value: formatPrice(total), color: "text-foreground" },
          { label: "Paid Out", value: formatPrice(paid), color: "text-green-600" },
          { label: "Pending", value: formatPrice(pending), color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-background border border-border rounded-2xl p-5 shadow-card">
            <IndianRupee className="h-5 w-5 text-primary mb-2" />
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-background border border-border rounded-2xl p-5 shadow-card">
        <h2 className="font-semibold mb-4">Order Earnings Breakdown</h2>
        <div className="space-y-3">
          {mockVendorOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-3 text-sm">
              <div className="flex gap-1">
                {order.items.slice(0, 1).map((item, i) => (
                  <span key={i} className="text-xl">{item.emoji}</span>
                ))}
              </div>
              <div className="flex-1">
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">{order.customerName}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === "delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {order.status === "delivered" ? "Paid" : "Pending"}
              </span>
              <span className="font-semibold text-green-600 shrink-0">{formatPrice(order.earnings)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
