"use client";

import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { DBProduct } from "@/types/category.types";

export default function AddToCartButton({ product }: { product: DBProduct }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function addToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        title: product.name,
        price: product.base_price,
        srcUrl: product.primary_image_url || "",
      });
    }
  }

  function handleAdd() {
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addToCart();
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-bold text-gray-900">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
          added
            ? "bg-green-500 text-white"
            : "bg-[#D81B60] hover:bg-[#C2185B] text-white"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {added ? "Added to Cart!" : "Add to Cart"}
      </button>

      {/* Buy now */}
      <button
        onClick={handleBuyNow}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold border-2 border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white transition-all active:scale-95"
      >
        <Zap className="w-4 h-4" />
        Buy Now
      </button>
    </div>
  );
}
