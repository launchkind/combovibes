"use client";
import { useState } from "react";
import { useCartStore, cartTotal } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, MapPin, CalendarDays, ShoppingBag, ChevronRight } from "lucide-react";
import { AddressStep } from "@/components/checkout/AddressStep";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { OrderSummaryPanel } from "@/components/checkout/OrderSummaryPanel";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { AddressInput } from "@/lib/validations/checkout";
import Link from "next/link";

const steps = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Delivery", icon: CalendarDays },
  { id: 3, label: "Review", icon: ShoppingBag },
];

export type CheckoutData = {
  address: AddressInput | null;
  deliveryDate: string;
  deliverySlot: string;
  giftMessage: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, couponDiscount, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CheckoutData>({
    address: null,
    deliveryDate: "",
    deliverySlot: "",
    giftMessage: "",
  });

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="font-playfair text-2xl font-semibold">Nothing to checkout</h1>
        <Button className="mt-4 rounded-full" asChild>
          <Link href="/shop">Browse Gifts</Link>
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground mb-6">
        Checkout
      </h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isComplete = step > s.id;
          const isActive = step === s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all",
                isComplete ? "bg-primary/10 text-primary" :
                isActive ? "bg-primary text-primary-foreground shadow-warm" :
                "bg-muted text-muted-foreground"
              )}>
                {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("flex-1 h-px", step > s.id ? "bg-primary" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Steps */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <AddressStep
              defaultValues={data.address ?? undefined}
              onNext={(address) => {
                setData((d) => ({ ...d, address }));
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <DeliveryStep
              value={{ date: data.deliveryDate, slot: data.deliverySlot, message: data.giftMessage }}
              onBack={() => setStep(1)}
              onNext={(v) => {
                setData((d) => ({ ...d, deliveryDate: v.date, deliverySlot: v.slot, giftMessage: v.message }));
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            <ReviewStep
              data={data}
              items={items}
              couponDiscount={couponDiscount}
              onBack={() => setStep(2)}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </div>

        {/* Summary */}
        <div className="hidden lg:block">
          <OrderSummaryPanel />
        </div>
      </div>
    </div>
  );
}
