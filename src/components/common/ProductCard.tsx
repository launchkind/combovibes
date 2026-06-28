"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product.types";
import { useCartStore } from "@/store/cartStore";

type Props = { data: Product };

function getDiscountedPrice(product: Product) {
  if (product.discount.percentage > 0)
    return Math.round(product.price - (product.price * product.discount.percentage) / 100);
  if (product.discount.amount > 0)
    return product.price - product.discount.amount;
  return product.price;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-2.5 h-2.5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ProductCard = ({ data }: Props) => {
  const addItem = useCartStore((s) => s.addItem);
  const discountedPrice = getDiscountedPrice(data);
  const hasDiscount = data.discount.percentage > 0 || data.discount.amount > 0;
  const productSlug = `/shop/product/${data.id}/${data.title.split(" ").join("-")}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group w-full">
      {/* Image */}
      <div className="relative bg-[#f7f3ee] overflow-hidden aspect-square">
        <Link href={productSlug}>
          <Image
            src={data.srcUrl}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top-left badge */}
        {data.badge === "best-seller" && (
          <span className="absolute top-2.5 left-2.5 bg-[#D81B60] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {data.badge === "new" && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
            New
          </span>
        )}

        {/* Discount badge top-right */}
        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 bg-[#FFD700] text-gray-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
            -{data.discount.percentage > 0 ? `${data.discount.percentage}%` : `₹${data.discount.amount}`}
          </span>
        )}

        {/* Wishlist hover */}
        <button className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#D81B60] hover:text-white text-gray-400">
          <Heart className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <Link href={productSlug}>
          <p className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2 leading-snug hover:text-[#D81B60] transition-colors">
            {data.title}
          </p>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Stars rating={data.rating} />
          <span className="text-[9px] text-gray-400">({data.reviewCount ?? Math.floor(data.rating * 20)})</span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-sm font-black text-gray-900">₹{discountedPrice}</span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">₹{data.price}</span>
          )}
        </div>

        <button
          onClick={() =>
            addItem({
              id: String(data.id),
              title: data.title,
              price: discountedPrice,
              srcUrl: data.srcUrl,
            })
          }
          className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
