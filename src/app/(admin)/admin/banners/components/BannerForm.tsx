"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerSchema, BannerFormValues } from "@/lib/validations/banner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../../components/ImageUploader";

type Props = {
  defaultValues?: Partial<BannerFormValues>;
  bannerId?: string;
};

const placements = [
  { value: "hero", label: "Hero (Homepage Carousel)" },
  { value: "category", label: "Category Page" },
  { value: "occasion", label: "Occasion Page" },
  { value: "sidebar", label: "Sidebar" },
  { value: "popup", label: "Popup" },
  { value: "announcement", label: "Announcement Bar" },
] as const;

export default function BannerForm({ defaultValues, bannerId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const isEditing = !!bannerId;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      placement: "hero",
      link_target: "_self",
      sort_order: 0,
      is_active: true,
      ...defaultValues,
    },
  });

  const imageUrl       = watch("image_url");
  const mobileImageUrl = watch("mobile_image_url");
  const placement      = watch("placement");
  const titleColor     = watch("title_color") ?? "#ffffff";
  const isHero         = placement === "hero";

  async function onSubmit(values: BannerFormValues) {
    setSaving(true);
    setServerError("");

    const url = isEditing ? `/api/admin/banners/${bannerId}` : "/api/admin/banners";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      if (typeof json.error === "string") {
        setServerError(json.error);
      } else if (json.error?.fieldErrors || json.error?.formErrors) {
        const fieldMsgs = Object.entries(json.error.fieldErrors ?? {})
          .map(([f, msgs]) => `${f}: ${(msgs as string[]).join(", ")}`)
          .join(" | ");
        setServerError(fieldMsgs || "Validation failed. Please check your inputs.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
      return;
    }

    window.location.href = "/admin/banners";
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Main */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-800">Images</h3>
              {isHero && (
                <span className="text-[10px] bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded">Hero Layout</span>
              )}
            </div>

            {isHero && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Hero image tip:</p>
                <p>The uploaded image fills the <strong>entire hero background</strong>. A wide landscape image works best (recommended: 1920×700px). The text overlays on the left side.</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {isHero ? "Background Image *" : "Desktop Image *"}
                <span className="text-gray-400 font-normal ml-1">
                  {isHero ? "(fills the entire hero — recommended: 1920×700px wide landscape)" : "(recommended: 1920×600px)"}
                </span>
              </label>
              <ImageUploader
                value={imageUrl}
                onChange={(url) => setValue("image_url", url)}
                onClear={() => setValue("image_url", "")}
                bucket="banner-images"
                label={isHero ? "Upload hero background image" : "Upload desktop banner"}
                hint="JPG, PNG, WebP — max 10MB"
              />
              {errors.image_url && <p className="text-xs text-red-500 mt-1">{errors.image_url.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {isHero ? "Second Image" : "Mobile Image"}
                <span className="text-gray-400 font-normal ml-1">
                  {isHero ? "(optional — bottom-left square in collage)" : "(optional — recommended: 768×400px)"}
                </span>
              </label>
              <ImageUploader
                value={mobileImageUrl ?? ""}
                onChange={(url) => setValue("mobile_image_url", url)}
                onClear={() => setValue("mobile_image_url", "")}
                bucket="banner-images"
                label={isHero ? "Upload second image" : "Upload mobile banner"}
                hint={isHero ? "Square crop works best" : "Different crop for mobile screens"}
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">
              {isHero ? "Hero Slide Text" : "Details"}
            </h3>

            {isHero && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800 space-y-1">
                <p className="font-semibold">How these fields appear on the homepage hero:</p>
                <p>• <strong>Tag Line</strong> → small caps text at the top (e.g. LOVE | STYLE | HAPPINESS)</p>
                <p>• <strong>Subtitle</strong> → description line below the heading</p>
                <p>• <strong>Italic Tagline</strong> → cursive text below subtitle</p>
                <p>• <strong>Shop Link</strong> → where the "Shop Now" button goes</p>
                <p className="text-blue-600">Heading always shows "Combo Vibes" in Dancing Script font.</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHero ? "Tag Line *" : "Internal Title *"}
              </label>
              <input
                {...register("title")}
                placeholder={isHero ? "e.g. LOVE | STYLE | HAPPINESS" : "e.g. Valentine Hero Banner – Feb 2026"}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHero ? "Subtitle" : "Alt Text"}
              </label>
              <input
                {...register("alt_text")}
                placeholder={isHero ? "e.g. Jewellery | Men & Women Accessories | Gift Combo" : "Describe the image for accessibility"}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHero ? "Italic Tagline" : "CTA Button Text"}
              </label>
              <input
                {...register("cta_text")}
                placeholder={isHero ? "e.g. For Every Vibe, For Everyone" : "e.g. Shop Now"}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>

            {isHero && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hero Title Text
                </label>
                <input
                  {...register("title_text")}
                  placeholder="Combo Vibes"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leave blank to use "Combo Vibes"</p>
              </div>
            )}

            {isHero && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  &quot;Combo Vibes&quot; Title Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => setValue("title_color", e.target.value)}
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    {...register("title_color")}
                    placeholder="#ffffff"
                    maxLength={7}
                    className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                  />
                  <div
                    className="w-10 h-10 rounded border border-gray-200 shrink-0"
                    style={{ background: titleColor }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isHero ? "Shop Now Link" : "Link URL"}
                </label>
                <input
                  {...register("link_url")}
                  placeholder="/shop or https://..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                />
              </div>
              {!isHero && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Link Target</label>
                  <select
                    {...register("link_target")}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                  >
                    <option value="_self">Same Tab</option>
                    <option value="_blank">New Tab</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Validity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Validity Period <span className="text-gray-400 font-normal text-xs">(optional)</span></h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Show From</label>
                <input
                  type="datetime-local"
                  {...register("valid_from")}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hide After</label>
                <input
                  type="datetime-local"
                  {...register("valid_until")}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                />
              </div>
            </div>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Settings</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Placement *</label>
              <select
                {...register("placement")}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              >
                {placements.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              {errors.placement && <p className="text-xs text-red-500 mt-1">{errors.placement.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                {...register("sort_order", { valueAsNumber: true })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
              <p className="text-[10px] text-gray-400 mt-1">Lower = shown first</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="w-4 h-4 accent-[#D81B60]" />
              <div>
                <span className="text-sm font-medium text-gray-700">Active</span>
                <p className="text-[10px] text-gray-400">Show on website</p>
              </div>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : isEditing ? "Update Banner" : "Save Banner"}
            </button>
          </div>

          {/* Image preview */}
          {imageUrl && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-600">Preview</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="w-full rounded-lg object-cover aspect-video" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
