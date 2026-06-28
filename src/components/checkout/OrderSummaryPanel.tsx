"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export function OrderSummaryPanel() {
  const { items, totalPrice } = useCartStore();
  const subtotal     = totalPrice();
  const deliveryFee  = subtotal >= FREE_DELIVERY_THRESHOLD
    ? 0
    : Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 0);
  const total        = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-900 text-base">Order Summary</h3>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
              {item.srcUrl ? (
                <Image src={item.srcUrl} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-gray-900 shrink-0">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-1.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>
        {subtotal < FREE_DELIVERY_THRESHOLD && deliveryFee === 0 && (
          <p className="text-xs text-green-600">
            Add ₹{(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString("en-IN")} more for free delivery
          </p>
        )}
      </div>

      <div className="border-t-2 border-gray-900 pt-3 flex justify-between items-center">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-xl font-black text-gray-900">₹{total.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
