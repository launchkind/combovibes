"use client";
import { useCartStore, cartTotal } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/formatters";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, couponDiscount } = useCartStore();
  const { subtotal, delivery, discount, total } = cartTotal(items, couponDiscount);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart
            {itemCount > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {itemCount} item{itemCount > 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="font-playfair text-lg text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add some gifts to get started</p>
              <Button className="mt-6 rounded-full" onClick={() => setOpen(false)} asChild>
                <Link href="/shop">Browse Gifts</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-3xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 border border-border rounded-full px-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 flex items-center justify-center hover:text-primary"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 flex items-center justify-center hover:text-primary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  {item.deliveryDate && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      📅 Deliver by {item.deliveryDate}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon discount</span><span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-green-600">Free</span> : formatPrice(delivery)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
              {subtotal < 999 && (
                <p className="text-xs text-muted-foreground text-center">
                  Add {formatPrice(999 - subtotal)} more for free delivery
                </p>
              )}
            </div>
            <Button
              className="w-full rounded-full shadow-warm"
              onClick={() => setOpen(false)}
              asChild
            >
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full text-sm" onClick={() => setOpen(false)} asChild>
              <Link href="/cart">View Full Cart</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
