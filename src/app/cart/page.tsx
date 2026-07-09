"use client";

import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0 flex flex-col items-center text-gray-300 mt-32">
          <ShoppingBag strokeWidth={1} className="w-16 h-16 mb-4" />
          <span className="text-gray-500 text-base mb-6">Your cart is empty.</span>
          <Link
            href="/shop"
            className="bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold px-8 py-3 rounded-full transition-all"
          >
            Shop Now
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = totalPrice();

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <h2 className="font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6 mt-6">
          Your Cart
        </h2>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Cart items */}
          <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
            {items.map((item, idx) => (
              <div key={item.id}>
                {idx > 0 && <hr className="border-t-black/10 mb-4 md:mb-6" />}
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="relative w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden bg-[#f7f3ee]">
                    {item.srcUrl ? (
                      <Image src={item.srcUrl} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.title}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-9 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line subtotal */}
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">₹{item.price * item.quantity}</p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400">₹{item.price} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="w-full lg:max-w-[380px] shrink-0 p-5 md:px-6 flex-col space-y-4 rounded-[20px] border border-black/10">
            <h6 className="text-xl md:text-2xl font-bold text-black">Order Summary</h6>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="md:text-base text-black/60">Subtotal</span>
                <span className="md:text-base font-bold">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="md:text-base text-black/60">Delivery</span>
                <span className="md:text-base font-bold text-emerald-600">Free</span>
              </div>
              <hr className="border-t-black/10" />
              <div className="flex items-center justify-between">
                <span className="md:text-base font-bold text-black">Total</span>
                <span className="text-xl md:text-2xl font-black text-gray-900">₹{subtotal}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-900 text-white text-sm font-bold py-4 rounded-full transition-all"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
