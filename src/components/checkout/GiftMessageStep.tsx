"use client";

import { useState } from "react";
import type { CheckoutFormData } from "@/app/checkout/page";
import { Gift, ChevronLeft } from "lucide-react";

interface Props {
  data:    CheckoutFormData;
  onBack:  () => void;
  onNext:  (vals: Partial<CheckoutFormData>) => void;
}

export function GiftMessageStep({ data, onBack, onNext }: Props) {
  const [giftMessage,        setGiftMessage]        = useState(data.gift_message);
  const [specialInstructions, setSpecialInstructions] = useState(data.special_instructions);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#D81B60]" />
          <h2 className="font-bold text-gray-900">Gift Message</h2>
          <span className="text-xs text-gray-400 ml-auto">Optional</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Personal Gift Message
          </label>
          <textarea
            rows={4}
            maxLength={150}
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder="Write a heartfelt message for the recipient… (e.g. Happy Birthday! Wishing you all the joy in the world 🎉)"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{giftMessage.length}/150</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Special Delivery Instructions
          </label>
          <textarea
            rows={2}
            maxLength={300}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g. Leave at the door, call before delivery, surprise delivery…"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60] resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{specialInstructions.length}/300</p>
        </div>
      </div>

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
          onClick={() => onNext({ gift_message: giftMessage, special_instructions: specialInstructions })}
          className="flex-1 bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          Review Order →
        </button>
      </div>
    </div>
  );
}
