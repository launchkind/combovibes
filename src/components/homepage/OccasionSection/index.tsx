"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Heart, Gem, ThumbsUp, ChevronRight, Star, PartyPopper, Sparkles } from "lucide-react";
import { CategoryWithProducts, DBProduct } from "@/types/category.types";

type Props = { categories: CategoryWithProducts[] };

const ICON_MAP: Record<string, React.ElementType> = {
  Gift, Heart, Gem, ThumbsUp, Star, PartyPopper, Sparkles,
};

function getIcon(iconName: string | null | undefined): React.ElementType {
  if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
  return Gift;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function OccasionSection({ categories }: Props) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  if (!active) return null;

  const products: DBProduct[] = (active.product_categories ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((pc) => pc.products)
    .filter((p) => p && p.status === "active")
    .slice(0, 4);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">

        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
          Tailored For Your Occasions
        </h2>

        {/* Tab bar */}
        <div className="border-b border-gray-200 mb-0 overflow-x-auto">
          <div className="flex min-w-max">
            {categories.map((cat) => {
              const isActive = cat.id === activeId;
              const Icon = getIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveId(cat.id)}
                  className={`
                    relative flex flex-col items-center gap-1.5 px-8 py-3 min-w-[120px]
                    transition-colors duration-150
                    ${isActive
                      ? "bg-[#faf6ef] text-[#3d3123] rounded-t-lg"
                      : "bg-transparent text-gray-400 hover:text-gray-600"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-[#3d3123]" : "text-gray-400"}`}
                    strokeWidth={1.5}
                  />
                  <span className={`text-[13px] whitespace-nowrap leading-none ${isActive ? "font-bold" : "font-normal"}`}>
                    {cat.name}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3d3123] rounded-t-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="border border-gray-200 border-t-0 py-12 text-center text-gray-400 text-sm">
            No products assigned to this category yet. Go to Admin → Categories → Edit to add products.
          </div>
        ) : (
          <div className="relative border border-gray-200 border-t-0">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.id}/${product.slug}`}
                  className="group block bg-white hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
                    {product.primary_image_url ? (
                      <Image
                        src={product.primary_image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">No image</div>
                    )}
                  </div>

                  <div className="flex justify-center gap-1 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                  </div>

                  <div className="px-3 pb-4">
                    <p className="text-[13px] text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-[#D81B60] transition-colors">
                      {product.name}
                    </p>

                    <div className="flex items-baseline gap-2 mb-1.5">
                      {product.mrp && product.mrp > product.base_price && (
                        <span className="text-[12px] text-gray-400 line-through">
                          ₹{product.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                      <span className="text-[15px] font-bold text-gray-900">
                        ₹{product.base_price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <Stars rating={product.average_rating} />
                      <span className="text-[12px] text-gray-500">{product.review_count}</span>
                    </div>

                    {product.badge === "price-drop" && (
                      <span className="inline-block bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                        PRICE DROP
                      </span>
                    )}
                    {product.badge === "best-seller" && (
                      <span className="inline-block bg-white text-purple-700 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-purple-400">
                        Best Seller
                      </span>
                    )}
                    {product.badge === "new" && (
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-emerald-300">
                        New
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <button className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-300 rounded-full shadow items-center justify-center hover:bg-gray-50 transition-all z-10">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
