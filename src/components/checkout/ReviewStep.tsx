"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, MapPin, CalendarDays, MessageSquareHeart, Lock } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { cartTotal, type CartItem } from "@/store/cartStore";
import type { CheckoutData } from "@/app/checkout/page";

type Props = {
  data: CheckoutData;
  items: CartItem[];
  couponDiscount: number;
  onBack: () => void;
  onPlaceOrder: () => void;
};

export function ReviewStep({ data, items, couponDiscount, onBack, onPlaceOrder }: Props) {
  const { subtotal, delivery, discount, total } = cartTotal(items, couponDiscount);

  return (
    <div className="space-y-4">
      {/* Address */}
      <div className="bg-background border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Delivery Address</h3>
        </div>
        {data.address && (
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="font-medium text-foreground">{data.address.name} · +91 {data.address.phone}</p>
            <p>{data.address.line1}{data.address.line2 ? `, ${data.address.line2}` : ""}</p>
            <p>{data.address.city}, {data.address.state} – {data.address.pincode}</p>
          </div>
        )}
      </div>

      {/* Delivery */}
      <div className="bg-background border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Delivery Details</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p>Date: <span className="text-foreground font-medium">{data.deliveryDate}</span></p>
          <p>Slot: <span className="text-foreground font-medium capitalize">{data.deliverySlot}</span></p>
        </div>
        {data.giftMessage && (
          <div className="mt-3 flex items-start gap-2">
            <MessageSquareHeart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm italic text-muted-foreground">&ldquo;{data.giftMessage}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-background border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-3">Order Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.variant} × {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="text-green-600">Free</span> : formatPrice(delivery)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="rounded-full" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button className="flex-1 rounded-full shadow-warm" size="lg" onClick={onPlaceOrder}>
          <Lock className="mr-2 h-4 w-4" /> Place Order · {formatPrice(total)}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        🔒 Secure checkout · Payment handled in next step
      </p>
    </div>
  );
}
