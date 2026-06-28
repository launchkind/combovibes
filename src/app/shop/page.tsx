import { createAdminClient } from "@/lib/supabase/admin";
import { DBProduct, Category } from "@/types/category.types";
import DBProductCard from "@/components/common/DBProductCard";
import Link from "next/link";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import { FiSliders } from "react-icons/fi";

export const dynamic = "force-dynamic";

type SearchParams = { category?: string; sort?: string; page?: string };

async function fetchCategories(): Promise<Category[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("categories")
      .select("id, name, slug, color, image_url, icon")
      .eq("is_active", true)
      .order("sort_order");
    return (data ?? []) as Category[];
  } catch { return []; }
}

async function fetchProducts(categorySlug?: string, sort?: string, page = 1): Promise<{ products: DBProduct[]; total: number }> {
  try {
    const admin = createAdminClient();
    const limit = 12;
    const offset = (page - 1) * limit;

    if (categorySlug) {
      // Get category ID first
      const { data: cat } = await admin
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .single();

      if (!cat) return { products: [], total: 0 };

      const { data, error } = await admin
        .from("product_categories")
        .select("sort_order, products!inner(id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order)")
        .eq("category_id", cat.id)
        .eq("products.status", "active")
        .order("sort_order")
        .range(offset, offset + limit - 1);

      if (error || !data) return { products: [], total: 0 };

      const products = data.map((r) => r.products as unknown as DBProduct).filter(Boolean);
      return { products, total: products.length };
    }

    // No category filter — fetch all active products
    let query = admin
      .from("products")
      .select("id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order", { count: "exact" })
      .eq("status", "active");

    if (sort === "low-price")  query = query.order("base_price", { ascending: true });
    else if (sort === "high-price") query = query.order("base_price", { ascending: false });
    else if (sort === "newest") query = query.order("created_at", { ascending: false });
    else                        query = query.order("sort_order").order("created_at", { ascending: false });

    const { data, count } = await query.range(offset, offset + limit - 1);
    return { products: (data ?? []) as DBProduct[], total: count ?? 0 };
  } catch { return { products: [], total: 0 }; }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const categorySlug = sp.category ?? "";
  const sort = sp.sort ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1"));

  const [categories, { products, total }] = await Promise.all([
    fetchCategories(),
    fetchProducts(categorySlug || undefined, sort, page),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  function buildHref(overrides: Partial<SearchParams>) {
    const params = new URLSearchParams();
    const merged = { category: categorySlug, sort, page: String(page), ...overrides };
    if (merged.category) params.set("category", merged.category);
    if (merged.sort) params.set("sort", merged.sort);
    if (merged.page && merged.page !== "1") params.set("page", merged.page);
    const s = params.toString();
    return `/shop${s ? `?${s}` : ""}`;
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />

        <div className="flex md:space-x-5 items-start">
          {/* Sidebar */}
          <div className="hidden md:block min-w-[240px] max-w-[240px] border border-black/10 rounded-[20px] px-5 py-5 space-y-5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Categories</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <div className="space-y-1">
              <Link
                href="/shop"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!categorySlug ? "bg-[#D81B60] text-white font-bold" : "text-gray-700 hover:bg-pink-50 hover:text-[#D81B60]"}`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildHref({ category: cat.slug, page: "1" })}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${categorySlug === cat.slug ? "bg-[#D81B60] text-white font-bold" : "text-gray-700 hover:bg-pink-50 hover:text-[#D81B60]"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col w-full space-y-5">
            {/* Header row */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
              <div>
                <h1 className="font-bold text-2xl md:text-[28px]">
                  {activeCategory ? activeCategory.name : "All Products"}
                </h1>
                <p className="text-sm text-black/50 mt-0.5">
                  {total > 0 ? `${total} product${total !== 1 ? "s" : ""}` : "No products found"}
                </p>
              </div>

              {/* Mobile category pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
                <Link href="/shop" className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${!categorySlug ? "bg-[#D81B60] text-white border-[#D81B60]" : "border-gray-200 text-gray-600"}`}>
                  All
                </Link>
                {categories.slice(0, 6).map((cat) => (
                  <Link key={cat.id} href={buildHref({ category: cat.slug, page: "1" })}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${categorySlug === cat.slug ? "bg-[#D81B60] text-white border-[#D81B60]" : "border-gray-200 text-gray-600"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-black/60">Sort by:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { value: "", label: "Popular" },
                    { value: "newest", label: "Newest" },
                    { value: "low-price", label: "Price ↑" },
                    { value: "high-price", label: "Price ↓" },
                  ].map(({ value, label }) => (
                    <Link
                      key={value}
                      href={buildHref({ sort: value, page: "1" })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${sort === value ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Product grid */}
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-semibold mb-2">No products found</p>
                <p className="text-sm">
                  {categorySlug
                    ? "No products have been assigned to this category yet."
                    : "No active products in the store yet."}
                </p>
                {categorySlug && (
                  <Link href="/shop" className="mt-4 inline-block text-[#D81B60] font-bold hover:underline text-sm">
                    View all products →
                  </Link>
                )}
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <DBProductCard key={product.id} data={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {page > 1 && (
                  <Link href={buildHref({ page: String(page - 1) })}
                    className="px-4 py-2 border border-black/10 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                    ← Previous
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <Link key={p} href={buildHref({ page: String(p) })}
                    className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${p === page ? "bg-[#D81B60] text-white" : "border border-black/10 text-black/60 hover:bg-gray-50"}`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link href={buildHref({ page: String(page + 1) })}
                    className="px-4 py-2 border border-black/10 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                    Next →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
