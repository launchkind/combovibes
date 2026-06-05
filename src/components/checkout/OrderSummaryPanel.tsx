"use client";
import { useCartStore, cartTotal } from "@/store/cartStore";
import { formatPrice } from "@/lib/formatters";
import { Separator } from "@/components/ui/separator";

export function OrderSummaryPanel() {
  const { items, couponDiscount, couponCode } = useCartStore();
  const { subtotal, delivery, discount, total } = cartTotal(items, couponDiscount);

  return (
    <div className="bg-background border border-border rounded-2xl p-5 sticky top-24 space-y-3">
      <h3 className="font-playfair text-lg font-semibold">Order Summary</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="text-xl">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
              <p className="text-[10px] text-muted-foreground">×{item.quantity}</p>
            </div>
            <span className="text-xs font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 text-xs">
            <span>Coupon ({couponCode})</span><span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery</span>
          <span>{delivery === 0 ? <span className="text-green-600">Free</span> : formatPrice(delivery)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
