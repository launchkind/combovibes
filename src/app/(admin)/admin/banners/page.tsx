import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import BannerToggle from "./components/BannerToggle";
import DeleteBannerButton from "./components/DeleteBannerButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banners" };

const placementColors: Record<string, string> = {
  hero: "bg-blue-100 text-blue-700",
  promo_cards: "bg-pink-100 text-[#D81B60]",
  category: "bg-purple-100 text-purple-700",
  occasion: "bg-amber-100 text-amber-700",
  sidebar: "bg-gray-100 text-gray-600",
  popup: "bg-red-100 text-red-600",
  announcement: "bg-emerald-100 text-emerald-700",
};

async function getBanners() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("banners")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function BannersPage() {
  let banners: Awaited<ReturnType<typeof getBanners>> = [];
  let fetchError = "";
  try {
    banners = await getBanners();
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load banners";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500">{banners.length} banners total</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </Link>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 space-y-1">
          <p><strong>Database Error:</strong> {fetchError}</p>
          {fetchError.includes("does not exist") && (
            <p className="text-red-500">The <code className="bg-red-100 px-1 rounded">banners</code> table is missing. Run migration <strong>003_banners.sql</strong> in your Supabase SQL Editor.</p>
          )}
        </div>
      )}

      {/* Grid */}
      {!fetchError && banners.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16">
          <p className="text-gray-400 text-sm mb-4">No banners yet.</p>
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center gap-2 bg-[#D81B60] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C2185B]"
          >
            <Plus className="w-4 h-4" /> Add your first banner
          </Link>
        </div>
      )}
      {!fetchError && banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image_url}
                  alt={banner.alt_text || banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Active toggle overlay */}
                <div className="absolute top-2 right-2">
                  <BannerToggle id={banner.id} isActive={banner.is_active} />
                </div>
                {/* Placement badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${placementColors[banner.placement] ?? "bg-gray-100 text-gray-600"}`}>
                    {banner.placement}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">{banner.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Sort: {banner.sort_order}</span>
                  {banner.link_url && (
                    <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-blue-400 hover:text-blue-600">
                      <ExternalLink className="w-3 h-3" /> Link
                    </a>
                  )}
                </div>
                {(banner.valid_from || banner.valid_until) && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    {banner.valid_from && `From: ${new Date(banner.valid_from).toLocaleDateString("en-IN")}`}
                    {banner.valid_from && banner.valid_until && " · "}
                    {banner.valid_until && `Until: ${new Date(banner.valid_until).toLocaleDateString("en-IN")}`}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-3 pb-3 flex items-center gap-2">
                <Link
                  href={`/admin/banners/${banner.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-[#D81B60] hover:text-white transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
                <DeleteBannerButton id={banner.id} title={banner.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
