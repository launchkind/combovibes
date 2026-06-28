"use client";

import type { CheckoutFormData } from "@/app/checkout/page";
import type { CartItem } from "@/store/cartStore";
import { ChevronLeft, MapPin, Calendar, Gift, Package, Loader2 } from "lucide-react";
import Image from "next/image";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

const SLOT_LABELS: Record<string, string> = {
  morning:  "8 AM – 12 PM",
  evening:  "4 PM – 8 PM",
  midnight: "10 PM – 12 AM",
};

interface Props {
  data:           CheckoutFormData;
  items:          CartItem[];
  onBack:         () => void;
  onPlaceOrder:   () => void;
  placing:        boolean;
}

export function ReviewStep({ data, items, onBack, onPlaceOrder, placing }: Props) {
  const subtotal    = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD
    ? 0
    : Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 0);
  const total       = subtotal + deliveryFee;

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#D81B60]" /> Items ({items.length})
        </h2>
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
              {item.srcUrl && <Image src={item.srcUrl} alt={item.title} fill className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-400">Qty {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
            </div>
            <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200 mt-1">
            <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Delivery details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#D81B60]" /> Delivery Address
        </h2>
        <p className="text-sm font-medium text-gray-800">{data.recipient_name} · {data.recipient_phone}</p>
        <p className="text-sm text-gray-600">
          {data.delivery_line1}{data.delivery_line2 ? `, ${data.delivery_line2}` : ""},{" "}
          {data.delivery_city}, {data.delivery_state} – {data.delivery_pincode}
        </p>
      </div>

      {/* Date & slot */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D81B60]" /> Delivery Schedule
        </h2>
        <p className="text-sm text-gray-700">
          <strong>{data.delivery_date}</strong> &nbsp;·&nbsp; {SLOT_LABELS[data.delivery_slot] ?? data.delivery_slot}
        </p>
      </div>

      {/* Gift message */}
      {(data.gift_message || data.special_instructions) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-1">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#D81B60]" /> Gift Details
          </h2>
          {data.gift_message && <p className="text-sm text-gray-700 italic">"{data.gift_message}"</p>}
          {data.special_instructions && (
            <p className="text-xs text-gray-500 mt-1">Note: {data.special_instructions}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-5 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={placing}
          className="flex-1 bg-[#D81B60] hover:bg-[#C2185B] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {placing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <>Place Order & Pay ₹{total.toLocaleString("en-IN")} →</>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Secured by Cashfree · Your payment is 100% safe
      </p>
    </div>
  );
}
