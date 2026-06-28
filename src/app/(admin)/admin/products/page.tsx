import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil, Eye, Archive } from "lucide-react";
import ProductStatusBadge from "./components/ProductStatusBadge";
import ProductSearch from "./components/ProductSearch";

export const metadata = { title: "Products" };

async function getProducts(search: string, status: string) {
  try {
    const admin = createAdminClient();
    let query = admin
      .from("products")
      .select("id, name, base_price, mrp, discount_percent, status, is_featured, is_bestseller, stock_quantity, primary_image_url, created_at")
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("name", `%${search}%`);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const status = sp.status ?? "";
  const products = await getProducts(search, status);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} products found</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <ProductSearch defaultSearch={search} />
        <div className="flex gap-2 flex-wrap">
          {["", "active", "draft", "archived"].map((s) => (
            <Link
              key={s}
              href={`/admin/products${s ? `?status=${s}` : ""}${search ? `${s ? "&" : "?"}search=${search}` : ""}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                status === s
                  ? "bg-[#D81B60] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">No products found.</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B]"
            >
              <Plus className="w-4 h-4" /> Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Image</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {product.primary_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.primary_image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <div className="flex gap-1 mt-0.5">
                        {product.is_featured && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Featured</span>}
                        {product.is_bestseller && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">Bestseller</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">₹{product.base_price}</p>
                      {product.mrp && product.mrp > product.base_price && (
                        <p className="text-xs text-gray-400 line-through">₹{product.mrp}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${
                        product.stock_quantity === 0 ? "text-red-500" :
                        product.stock_quantity < 10 ? "text-amber-500" : "text-emerald-600"
                      }`}>
                        {product.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ProductStatusBadge status={product.status} id={product.id} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/shop/product/${product.id}/${product.name.replace(/\s+/g, "-").toLowerCase()}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-[#D81B60] hover:bg-pink-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
