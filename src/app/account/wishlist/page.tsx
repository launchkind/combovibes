"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Wishlist</h1>

        <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-black/20" />
          </div>
          <p className="text-sm font-medium text-black/60">Your wishlist is empty</p>
          <p className="text-xs text-black/40 mt-1 mb-5">
            Save gifts you love for later.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Explore Gifts →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Wishlist ({items.length})</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden group relative">
            <button
              onClick={() => removeItem(item.id)}
              aria-label="Remove from wishlist"
              className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="relative aspect-square bg-[#f7f3ee]">
              {item.srcUrl ? (
                <Image src={item.srcUrl} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">No image</div>
              )}
            </div>

            <div className="p-3">
              <p className="text-xs font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug">{item.title}</p>
              <p className="text-sm font-black text-gray-900 mb-2">₹{item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
