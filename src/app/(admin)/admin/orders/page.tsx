import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", out_for_delivery: "Out for Delivery",
  delivered: "Delivered", cancelled: "Cancelled", returned: "Returned",
};

const PAYMENT_COLOR: Record<string, string> = {
  pending:  "text-gray-500",
  paid:     "text-green-600 font-semibold",
  failed:   "text-red-500",
  refunded: "text-orange-500",
};

const FILTERS = ["", "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const sp     = await searchParams;
  const status = sp.status ?? "";
  const search = sp.search ?? "";
  const page   = parseInt(sp.page ?? "1");
  const limit  = 20;
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select(
      "id, order_number, sender_name, sender_email, recipient_name, delivery_city, delivery_date, delivery_slot, order_status, payment_status, total_amount, awb_code, courier_name, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("order_status", status);
  if (search) query = query.or(`order_number.ilike.%${search}%,sender_name.ilike.%${search}%`);

  const { data: orders, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / limit);

  function filterUrl(s: string) {
    const params = new URLSearchParams();
    if (s)      params.set("status", s);
    if (search) params.set("search", search);
    return `/admin/orders?${params.toString()}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-gray-900">Orders</h1>
        <span className="text-sm text-gray-500">{count ?? 0} total</span>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <Link
            key={f || "all"}
            href={filterUrl(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              status === f
                ? "bg-[#D81B60] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f ? STATUS_LABEL[f] : "All"}
          </Link>
        ))}
      </div>

      {/* Search */}
      <form method="GET" action="/admin/orders" className="flex gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="Search order # or customer name…"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
        />
        <button type="submit" className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Order #", "Customer", "Recipient / City", "Date", "Status", "Payment", "Total", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(orders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">No orders found</td>
                </tr>
              ) : (
                (orders ?? []).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900">{order.order_number}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-xs">{order.sender_name}</p>
                      <p className="text-[10px] text-gray-400">{order.sender_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700">{order.recipient_name}</p>
                      <p className="text-[10px] text-gray-400">{order.delivery_city}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{order.delivery_date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.order_status]}`}>
                        {STATUS_LABEL[order.order_status]}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs ${PAYMENT_COLOR[order.payment_status]}`}>
                      {order.payment_status}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-xs whitespace-nowrap">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-0.5 text-[#D81B60] hover:underline text-xs font-medium whitespace-nowrap"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?${new URLSearchParams({ ...(status ? { status } : {}), ...(search ? { search } : {}), page: String(p) }).toString()}`}
              className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                p === page ? "bg-[#D81B60] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
