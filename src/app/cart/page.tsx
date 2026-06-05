"use client";
import { useState } from "react";
import Link from "next/link";
import { useCartStore, cartTotal } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag, Trash2, Plus, Minus, Tag, X, ArrowRight, ChevronLeft
} from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const { subtotal, delivery, discount, total } = cartTotal(items, couponDiscount);

  const handleApplyCoupon = () => {
    const error = applyCoupon(couponInput.trim());
    if (error) toast.error(error);
    else { toast.success("Coupon applied!"); setCouponInput(""); }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="font-playfair text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Looks like you haven&apos;t added any gifts yet.</p>
        <Button className="mt-6 rounded-full" asChild>
          <Link href="/shop">Browse Gifts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/shop"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="font-playfair text-2xl font-semibold">
          Your Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-background border border-border rounded-2xl p-4">
              <Link href={`/shop/product/${item.slug}`} className="w-20 h-20 rounded-xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-4xl shrink-0 hover:opacity-80 transition-opacity">
                {item.emoji}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/shop/product/${item.slug}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                    {item.deliveryDate && (
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        📅 {item.deliveryDate}
                      </Badge>
                    )}
                    {item.giftMessage && (
                      <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
                        💌 &ldquo;{item.giftMessage}&rdquo;
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border border-border rounded-full px-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 flex items-center justify-center hover:text-primary">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 flex items-center justify-center hover:text-primary">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-2xl p-5 space-y-4 sticky top-24">
            <h2 className="font-playfair text-lg font-semibold">Order Summary</h2>

            {/* Coupon */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{couponCode} ({couponDiscount}% off)</span>
                </div>
                <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="flex-1 rounded-full"
                />
                <Button variant="outline" onClick={handleApplyCoupon} className="rounded-full shrink-0">
                  Apply
                </Button>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
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
                <span>{delivery === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(delivery)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            {subtotal < 999 && (
              <p className="text-xs text-center text-muted-foreground bg-muted rounded-lg px-3 py-2">
                🎁 Add {formatPrice(999 - subtotal)} more for <strong>free delivery</strong>
              </p>
            )}

            <Button className="w-full rounded-full shadow-warm" size="lg" asChild>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Try: FIRST10, SAVE20, COMBO15
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
