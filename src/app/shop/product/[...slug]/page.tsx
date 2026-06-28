import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { DBProduct } from "@/types/category.types";
import Link from "next/link";
import DBProductCard from "@/components/common/DBProductCard";
import AddToCartButton from "@/components/product-page/AddToCartButton";
import ProductImageGallery from "@/components/product-page/ProductImageGallery";

export const dynamic = "force-dynamic";

type GalleryImage = { url: string; alt_text: string | null; sort_order: number };

async function fetchProduct(id: string): Promise<DBProduct | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("products")
      .select("id, name, slug, short_description, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order")
      .eq("id", id)
      .eq("status", "active")
      .single();
    if (error || !data) return null;
    return data as DBProduct;
  } catch { return null; }
}

async function fetchGalleryImages(productId: string): Promise<GalleryImage[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("product_images")
      .select("url, alt_text, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    return (data ?? []) as GalleryImage[];
  } catch { return []; }
}

async function fetchRelated(productId: string): Promise<DBProduct[]> {
  try {
    const admin = createAdminClient();
    // Get categories this product belongs to
    const { data: cats } = await admin
      .from("product_categories")
      .select("category_id")
      .eq("product_id", productId)
      .limit(1);

    if (cats && cats.length > 0) {
      const { data } = await admin
        .from("product_categories")
        .select("products!inner(id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order)")
        .eq("category_id", cats[0].category_id)
        .eq("products.status", "active")
        .neq("product_id", productId)
        .limit(5);
      if (data) return data.map((r) => r.products as unknown as DBProduct).filter(Boolean);
    }

    // Fallback — latest active products
    const { data } = await admin
      .from("products")
      .select("id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, average_rating, review_count, status, is_featured, is_bestseller, is_new, sort_order")
      .eq("status", "active")
      .neq("id", productId)
      .order("created_at", { ascending: false })
      .limit(5);
    return (data ?? []) as DBProduct[];
  } catch { return []; }
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default async function ProductPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const productId = slug[0];

  const [product, related, galleryImages] = await Promise.all([
    fetchProduct(productId),
    fetchRelated(productId),
    fetchGalleryImages(productId),
  ]);

  if (!product) notFound();

  const hasDiscount = (product.discount_percent ?? 0) > 0;
  const savings = hasDiscount && product.mrp ? product.mrp - product.base_price : 0;

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#D81B60] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Product layout */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Image gallery */}
          <ProductImageGallery
            productName={product.name}
            primaryImage={product.primary_image_url}
            galleryImages={galleryImages}
            badge={product.badge}
          />

          {/* Info */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Stars rating={product.average_rating} />
              <span className="text-sm text-gray-500 font-medium">
                {product.average_rating.toFixed(1)} <span className="text-gray-300">/</span> 5
              </span>
              {product.review_count > 0 && (
                <span className="text-sm text-gray-400">({product.review_count} reviews)</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900">₹{product.base_price.toLocaleString("en-IN")}</span>
              {hasDiscount && product.mrp && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">₹{product.mrp.toLocaleString("en-IN")}</span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
                    {Math.round(product.discount_percent)}% off
                  </span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-green-600 font-medium -mt-2">
                You save ₹{savings.toLocaleString("en-IN")}
              </p>
            )}

            {/* Description */}
            {product.short_description && (
              <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                {product.short_description}
              </p>
            )}

            {/* Add to cart */}
            <div className="border-t border-gray-100 pt-4">
              <AddToCartButton product={product} />
            </div>

            {/* Delivery info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🚚", title: "Fast Delivery", desc: "2–5 business days" },
                { icon: "🎁", title: "Gift Wrapped", desc: "Premium packaging" },
                { icon: "✅", title: "Authentic", desc: "100% genuine products" },
                { icon: "💬", title: "WhatsApp Order", desc: "Quick & easy ordering" },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                  <span className="text-lg shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{title}</p>
                    <p className="text-[11px] text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You might also like */}
        {related.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">YOU MIGHT ALSO LIKE</h2>
                <div className="mt-1.5 w-28 h-[3px] bg-gray-900 rounded-full" />
              </div>
              <Link href="/shop" className="text-[#D81B60] text-sm font-bold hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {related.map((p) => <DBProductCard key={p.id} data={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
