"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MultiImageUploader from "../../components/MultiImageUploader";

type Props = {
  defaultValues?: Partial<ProductFormValues>;
  productId?: string;
};

const tabs = ["Basic Info", "Pricing & Inventory", "Media", "Categories"] as const;

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").slice(0, 200);
}

export default function ProductForm({ defaultValues, productId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Basic Info");
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [validationError, setValidationError] = useState("");
  const isEditing = !!productId;

  // Categories state
  const [allCategories, setAllCategories] = useState<{ id: string; name: string; description: string | null }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Gallery images state (URLs in display order; first = primary)
  const [galleryImages, setGalleryImages] = useState<string[]>(
    defaultValues?.primary_image_url ? [defaultValues.primary_image_url] : []
  );

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((json) => setAllCategories(json.data ?? []));

    if (productId) {
      fetch(`/api/admin/products/${productId}/categories`)
        .then((r) => r.json())
        .then((json) => setSelectedCategoryIds(json.data ?? []));

      // Load existing product images
      fetch(`/api/admin/products/${productId}/images`)
        .then((r) => r.json())
        .then((json) => {
          const imgs: { url: string }[] = json.data ?? [];
          if (imgs.length > 0) {
            setGalleryImages(imgs.map((img) => img.url));
          }
        });
    }
  }, [productId]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "draft",
      is_featured: false,
      is_bestseller: false,
      is_new: false,
      stock_quantity: 0,
      track_inventory: true,
      supports_same_day: false,
      ...defaultValues,
    },
  });

  const name = watch("name");
  const basePrice = watch("base_price");
  const mrp = watch("mrp");

  const discountPercent =
    mrp && basePrice && mrp > basePrice
      ? Math.round(((mrp - basePrice) / mrp) * 100)
      : 0;

  function onInvalid(errs: Record<string, unknown>) {
    const basicInfoFields = ["name", "slug", "short_description", "description", "badge"];
    const pricingFields = ["base_price", "mrp", "stock_quantity"];
    if (basicInfoFields.some((f) => errs[f])) {
      setActiveTab("Basic Info");
      setValidationError("Please fill in the required fields in Basic Info.");
    } else if (pricingFields.some((f) => errs[f])) {
      setActiveTab("Pricing & Inventory");
      setValidationError("Please fill in the required fields in Pricing & Inventory.");
    } else {
      setValidationError("Please fill in all required fields before saving.");
    }
  }

  async function onSubmit(values: ProductFormValues, publish = false) {
    setSaving(true);
    setServerError("");
    setValidationError("");

    if (publish) values.status = "active";

    // Set primary_image_url from first gallery image
    values.primary_image_url = galleryImages[0] ?? null;

    const url = isEditing ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const json = await res.json();

    if (!res.ok) {
      setSaving(false);
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

    const savedId = isEditing ? productId : json.data?.id;
    if (savedId) {
      // Sync categories and images in parallel
      await Promise.all([
        fetch(`/api/admin/products/${savedId}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category_ids: selectedCategoryIds }),
        }),
        fetch(`/api/admin/products/${savedId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: galleryImages }),
        }),
      ]);
    }

    setSaving(false);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v, false), onInvalid)} className="space-y-0">
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Main content */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-[#D81B60] text-[#D81B60]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-4">
              {/* ── Tab 1: Basic Info ── */}
              {activeTab === "Basic Info" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                    <input
                      {...register("name")}
                      onChange={(e) => {
                        register("name").onChange(e);
                        if (!isEditing) setValue("slug", slugify(e.target.value));
                      }}
                      placeholder="e.g. Valentine Special Combo"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Slug *</label>
                    <input
                      {...register("slug")}
                      placeholder="valentine-special-combo"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] bg-gray-50 font-mono"
                    />
                    {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description</label>
                    <textarea
                      {...register("short_description")}
                      rows={3}
                      placeholder="Brief description shown on product cards..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Badge</label>
                    <select
                      {...register("badge")}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                    >
                      <option value="">None</option>
                      <option value="new">New</option>
                      <option value="best-seller">Best Seller</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    {(["is_featured", "is_bestseller", "is_new"] as const).map((field) => (
                      <label key={field} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" {...register(field)} className="w-4 h-4 accent-[#D81B60]" />
                        <span className="text-sm text-gray-700 capitalize">{field.replace("is_", "")}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* ── Tab 2: Pricing & Inventory ── */}
              {activeTab === "Pricing & Inventory" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Sale Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("base_price", { valueAsNumber: true })}
                        placeholder="499"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                      />
                      {errors.base_price && <p className="text-xs text-red-500 mt-1">{errors.base_price.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">MRP / Original (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("mrp", { valueAsNumber: true })}
                        placeholder="749"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                      />
                      {errors.mrp && <p className="text-xs text-red-500 mt-1">{errors.mrp.message}</p>}
                    </div>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <span className="text-xs text-emerald-700 font-medium">Discount: {discountPercent}% off</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        {...register("stock_quantity", { valueAsNumber: true })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    {(["track_inventory", "supports_same_day"] as const).map((field) => (
                      <label key={field} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" {...register(field)} className="w-4 h-4 accent-[#D81B60]" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            {field === "track_inventory" ? "Track Inventory" : "Supports Same-Day Delivery"}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* ── Tab 3: Media ── */}
              {activeTab === "Media" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Images</label>
                    <p className="text-xs text-gray-400 mb-3">
                      Upload one or more images. The first image will be shown on product cards and listings.
                    </p>
                    <MultiImageUploader
                      values={galleryImages}
                      onChange={setGalleryImages}
                      bucket="product-images"
                    />
                  </div>
                </div>
              )}

              {/* ── Tab 4: Categories ── */}
              {activeTab === "Categories" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Select which categories this product belongs to.</p>
                  {allCategories.length === 0 ? (
                    <p className="text-sm text-gray-400">No categories found. Create categories first.</p>
                  ) : (
                    allCategories.map((cat) => (
                      <label key={cat.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(cat.id)}
                          onChange={(e) => {
                            setSelectedCategoryIds((prev) =>
                              e.target.checked ? [...prev, cat.id] : prev.filter((id) => id !== cat.id)
                            );
                          }}
                          className="w-4 h-4 accent-[#D81B60] mt-0.5 shrink-0"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-800">{cat.name}</span>
                          {cat.description && (
                            <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {validationError && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
              {validationError}
            </div>
          )}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-800">Publish</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Draft"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSubmit((v) => onSubmit(v, true), onInvalid)}
                className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Publishing…" : isEditing ? "Update & Publish" : "Publish"}
              </button>
            </div>
          </div>

          {/* Preview */}
          {galleryImages.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <h3 className="text-xs font-bold text-gray-600">Card Preview</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={galleryImages[0]} alt="Preview" className="w-full rounded-lg object-cover aspect-square" />
              <p className="text-xs font-medium text-gray-800 line-clamp-2">{name || "Product name"}</p>
              {basePrice && (
                <p className="text-sm font-black text-gray-900">
                  ₹{basePrice}
                  {mrp && mrp > basePrice && (
                    <span className="ml-2 text-xs text-gray-400 line-through font-normal">₹{mrp}</span>
                  )}
                </p>
              )}
              {galleryImages.length > 1 && (
                <p className="text-[10px] text-gray-400">{galleryImages.length} images in gallery</p>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
