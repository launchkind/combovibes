import { Metadata } from "next";
import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
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
