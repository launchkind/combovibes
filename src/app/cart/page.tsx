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
  const whatsappText = items
    .map((i) => `${i.title} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`)
    .join(", ");

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
              Go to Checkout
            </Link>

            <a
              href={`https://wa.me/919608217057?text=${encodeURIComponent(`I want to order: ${whatsappText}. Total: ₹${subtotal}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white text-sm font-bold py-3.5 rounded-full transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
