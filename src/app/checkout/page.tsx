"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { StepProgress }        from "@/components/checkout/StepProgress";
import { DeliveryDetailsStep } from "@/components/checkout/DeliveryDetailsStep";
import { GiftMessageStep }     from "@/components/checkout/GiftMessageStep";
import { ReviewStep }          from "@/components/checkout/ReviewStep";
import { OrderSummaryPanel }   from "@/components/checkout/OrderSummaryPanel";
import type { Address } from "@/types/order.types";

export type CheckoutFormData = {
  sender_name:          string;
  sender_email:         string;
  sender_phone:         string;
  recipient_name:       string;
  recipient_phone:      string;
  delivery_line1:       string;
  delivery_line2:       string;
  delivery_city:        string;
  delivery_state:       string;
  delivery_pincode:     string;
  delivery_date:        string;
  delivery_slot:        "morning" | "evening" | "midnight";
  gift_message:         string;
  special_instructions: string;
};

const EMPTY: CheckoutFormData = {
  sender_name: "", sender_email: "", sender_phone: "",
  recipient_name: "", recipient_phone: "",
  delivery_line1: "", delivery_line2: "",
  delivery_city: "", delivery_state: "", delivery_pincode: "",
  delivery_date: "", delivery_slot: "morning",
  gift_message: "", special_instructions: "",
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user }    = useAuthStore();
  const router      = useRouter();
  const [step,      setStep]      = useState(1);
  const [formData,  setFormData]  = useState<CheckoutFormData>(EMPTY);
  const [placing,   setPlacing]   = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Pre-fill sender info for logged-in users
  useEffect(() => {
    if (user) {
      setFormData((d) => ({
        ...d,
        sender_name:  user.user_metadata?.full_name ?? "",
        sender_email: user.email ?? "",
        sender_phone: user.user_metadata?.phone ?? "",
      }));
      // Fetch saved addresses
      fetch("/api/addresses")
        .then((r) => r.json())
        .then((j) => setAddresses(j.data ?? []));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block bg-[#D81B60] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#C2185B] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </main>
    );
  }

  function patch(vals: Partial<CheckoutFormData>) {
    setFormData((d) => ({ ...d, ...vals }));
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const payload = {
        sender_name:          formData.sender_name,
        sender_email:         formData.sender_email,
        sender_phone:         formData.sender_phone,
        recipient_name:       formData.recipient_name,
        recipient_phone:      formData.recipient_phone,
        delivery_line1:       formData.delivery_line1,
        delivery_line2:       formData.delivery_line2 || undefined,
        delivery_city:        formData.delivery_city,
        delivery_state:       formData.delivery_state,
        delivery_pincode:     formData.delivery_pincode,
        delivery_date:        formData.delivery_date,
        delivery_slot:        formData.delivery_slot,
        gift_message:         formData.gift_message || undefined,
        special_instructions: formData.special_instructions || undefined,
        items: items.map((i) => ({
          id:            i.id,
          quantity:      i.quantity,
          giftMessage:   i.giftMessage,
          greetingCard:  i.greetingCard,
          selectedColor: i.selectedColor,
          selectedSize:  i.selectedSize,
        })),
      };

      const res  = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        const msg = typeof json.error === "string"
          ? json.error
          : (json.error?.formErrors?.[0] ?? "Could not place order. Please try again.");
        toast.error(msg);
        setPlacing(false);
        return;
      }

      // Save order ID in session storage (fallback if redirect fails)
      sessionStorage.setItem("cv_order_id", json.orderId);

      // Load Cashfree SDK and launch payment
      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode: (process.env.NEXT_PUBLIC_CASHFREE_ENV ?? "sandbox") as "sandbox" | "production",
      });

      cashfree.checkout({
        paymentSessionId: json.paymentSessionId,
        redirectTarget:   "_self",
      });

      // Cart is cleared on the success page after payment confirmation
    } catch (err) {
      console.error("[checkout] handlePlaceOrder error:", err);
      toast.error("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 xl:px-0 pt-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Checkout</h1>

        <StepProgress current={step} />

        <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start">
          {/* Step content */}
          <div className="w-full lg:flex-1 min-w-0">
            {step === 1 && (
              <DeliveryDetailsStep
                data={formData}
                isGuest={!user}
                savedAddresses={addresses}
                onNext={(vals) => { patch(vals); setStep(2); }}
              />
            )}
            {step === 2 && (
              <GiftMessageStep
                data={formData}
                onBack={() => setStep(1)}
                onNext={(vals) => { patch(vals); setStep(3); }}
              />
            )}
            {step === 3 && (
              <ReviewStep
                data={formData}
                items={items}
                onBack={() => setStep(2)}
                onPlaceOrder={handlePlaceOrder}
                placing={placing}
              />
            )}
          </div>

          {/* Sticky order summary */}
          <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-6">
            <OrderSummaryPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
