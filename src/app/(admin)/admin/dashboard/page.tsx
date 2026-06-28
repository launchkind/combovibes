import { Package, Image, CheckCircle, Eye, Layers, Star } from "lucide-react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

async function getStats() {
  try {
    const admin = createAdminClient();
    const [products, banners, activeProducts, activeBanners, categories, reviews] = await Promise.all([
      admin.from("products").select("id", { count: "exact", head: true }),
      admin.from("banners").select("id", { count: "exact", head: true }),
      admin.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
      admin.from("banners").select("id", { count: "exact", head: true }).eq("is_active", true),
      admin.from("categories").select("id", { count: "exact", head: true }),
      admin.from("site_reviews").select("id", { count: "exact", head: true }),
    ]);
    return {
      totalProducts: products.count ?? 0,
      totalBanners: banners.count ?? 0,
      activeProducts: activeProducts.count ?? 0,
      activeBanners: activeBanners.count ?? 0,
      totalCategories: categories.count ?? 0,
      totalReviews: reviews.count ?? 0,
    };
  } catch {
    return { totalProducts: 0, totalBanners: 0, activeProducts: 0, activeBanners: 0, totalCategories: 0, totalReviews: 0 };
  }
}

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/products",
      sub: `${stats.activeProducts} active`,
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      icon: CheckCircle,
      color: "bg-emerald-500",
      href: "/admin/products?status=active",
      sub: "Published to shop",
    },
    {
      label: "Total Banners",
      value: stats.totalBanners,
      icon: Image,
      color: "bg-purple-500",
      href: "/admin/banners",
      sub: `${stats.activeBanners} active`,
    },
    {
      label: "Active Banners",
      value: stats.activeBanners,
      icon: Eye,
      color: "bg-[#D81B60]",
      href: "/admin/banners?active=true",
      sub: "Live on site",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Layers,
      color: "bg-orange-500",
      href: "/admin/categories",
      sub: "Product categories",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "bg-yellow-500",
      href: "/admin/reviews",
      sub: "Site testimonials",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 mb-0.5">{card.value}</p>
            <p className="text-sm font-medium text-gray-600">{card.label}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#D81B60] hover:bg-pink-50 transition-all group"
          >
            <Package className="w-6 h-6 text-gray-400 group-hover:text-[#D81B60]" />
            <span className="text-xs font-medium text-gray-600 group-hover:text-[#D81B60]">Add Product</span>
          </Link>
          <Link
            href="/admin/banners/new"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#D81B60] hover:bg-pink-50 transition-all group"
          >
            <Image className="w-6 h-6 text-gray-400 group-hover:text-[#D81B60]" />
            <span className="text-xs font-medium text-gray-600 group-hover:text-[#D81B60]">Add Banner</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <CheckCircle className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
            <span className="text-xs font-medium text-gray-600 group-hover:text-blue-500">Manage Products</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all group"
          >
            <Eye className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
            <span className="text-xs font-medium text-gray-600">View Site</span>
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      {stats.totalProducts === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-800 mb-1">Getting Started</h3>
          <p className="text-sm text-amber-700 mb-3">
            Your store is empty. Run the SQL migrations in Supabase, then add your first product and banner.
          </p>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
            <li>Run migrations 002, 003, 004 in Supabase SQL Editor</li>
            <li>Create Storage buckets: <code className="bg-amber-100 px-1 rounded">product-images</code> and <code className="bg-amber-100 px-1 rounded">banner-images</code> (set to Public)</li>
            <li>Add your first product → <Link href="/admin/products/new" className="underline font-medium">Add Product</Link></li>
            <li>Add your first banner → <Link href="/admin/banners/new" className="underline font-medium">Add Banner</Link></li>
          </ol>
        </div>
      )}
    </div>
  );
}
