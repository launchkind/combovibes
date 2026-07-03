"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "@/lib/validations/category";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../../components/ImageUploader";
import ProductAssignment from "./ProductAssignment";

type Props = {
  defaultValues?: Partial<CategoryFormValues>;
  categoryId?: string;
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").slice(0, 100);
}

const ICONS = [
  "Gift", "Heart", "Gem", "Star", "Sparkles", "ShoppingBag", "Package",
  "Crown", "Flower", "Cake", "Music", "Camera", "Watch", "Ribbon",
  "TrendingUp", "PartyPopper", "ThumbsUp",
];

const VISIBILITY_FIELDS = [
  { field: "show_on_homepage"  as const, label: "Show on Homepage",     desc: "Renders as a product list section on the homepage" },
  { field: "show_in_navbar"    as const, label: "Show in Navbar",       desc: "Appears in the Shop dropdown menu" },
  { field: "show_after_hero"   as const, label: "Show After Hero",      desc: "Appears as a quick-access box below the hero banner" },
  { field: "show_in_occasions" as const, label: "Show in Occasions",    desc: "Appears as a tab in Tailored For Your Occasions" },
];

export default function CategoryForm({ defaultValues, categoryId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const isEditing = !!categoryId;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      show_on_homepage:  false,
      show_in_navbar:    true,
      show_after_hero:   false,
      show_in_occasions: false,
      sort_order: 0,
      is_active: true,
      color: "#D81B60",
      title_color: "#D81B60",
      button_color: "#D81B60",
      ...defaultValues,
    },
  });

  const name        = watch("name");
  const imageUrl    = watch("image_url");
  const color       = watch("color");
  const titleColor  = watch("title_color");
  const buttonColor = watch("button_color");

  async function onSubmit(values: CategoryFormValues) {
    setSaving(true);
    setServerError("");

    const url    = isEditing ? `/api/admin/categories/${categoryId}` : "/api/admin/categories";
    const method = isEditing ? "PUT" : "POST";

    const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setServerError(typeof json.error === "string" ? json.error : "Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Main content ── */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Basic info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Category Details</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name *</label>
              <input
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  if (!isEditing) setValue("slug", slugify(e.target.value));
                }}
                placeholder="e.g. New Arrivals"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Slug *</label>
              <input
                {...register("slug")}
                placeholder="new-arrivals"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] bg-gray-50 font-mono"
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={2}
                placeholder="Brief description shown as subtitle"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Icon (for Occasions tab)</label>
                <select
                  {...register("icon")}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                >
                  <option value="">None</option>
                  {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register("color")}
                    className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    {...register("color")}
                    placeholder="#D81B60"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title Color</label>
                <p className="text-[11px] text-gray-400 mb-1">Heading + heart/line accent on the homepage product section</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register("title_color")}
                    className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    {...register("title_color")}
                    placeholder="#D81B60"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Add to Cart Button Color</label>
                <p className="text-[11px] text-gray-400 mb-1">Applies to product cards in this section</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register("button_color")}
                    className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    {...register("button_color")}
                    placeholder="#D81B60"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                {...register("sort_order", { valueAsNumber: true })}
                className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
              <p className="text-[11px] text-gray-400 mt-1">Lower = shown first. Use multiples of 10 (10, 20, 30…).</p>
            </div>
          </div>

          {/* Visibility toggles */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Visibility Settings</h3>
            {VISIBILITY_FIELDS.map(({ field, label, desc }) => (
              <label key={field} className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <input type="checkbox" {...register(field)} className="w-4 h-4 accent-[#D81B60]" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Cover Image <span className="font-normal text-gray-400">(used in after-hero boxes)</span></h3>
            <ImageUploader
              value={imageUrl ?? ""}
              onChange={(url) => setValue("image_url", url)}
              onClear={() => setValue("image_url", "")}
              bucket="product-images"
              label="Upload category image"
            />
          </div>

          {/* Product assignment — only on edit */}
          {isEditing && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Products in This Category</h3>
              <ProductAssignment categoryId={categoryId} />
            </div>
          )}

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-800">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="w-4 h-4 accent-[#D81B60]" />
              <span className="text-sm text-gray-700">Active (visible on site)</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-2"
            >
              {saving ? "Saving…" : isEditing ? "Update Category" : "Create Category"}
            </button>
          </div>

          {/* Live preview chip */}
          {name && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-600">Preview</h3>
              <div
                className="rounded-xl p-3 text-center text-white text-sm font-bold"
                style={{ background: color || "#D81B60" }}
              >
                {name}
              </div>
              <div className="rounded-xl border border-gray-100 p-3 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span style={{ color: titleColor || "#D81B60" }}>♥</span>
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-black uppercase" style={{ color: titleColor || "#D81B60" }}>
                    {name}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                  <span style={{ color: titleColor || "#D81B60" }}>♥</span>
                </div>
                <div
                  className="w-full text-center text-white text-xs font-bold py-1.5 rounded-lg"
                  style={{ background: buttonColor || "#D81B60" }}
                >
                  Add to Cart
                </div>
              </div>
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Cover" className="w-full rounded-lg object-cover aspect-square mt-2" />
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
