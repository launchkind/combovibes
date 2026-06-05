"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Share2, Star, Truck, ShieldCheck, RotateCcw,
  ChevronRight, Minus, Plus, ShoppingBag, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import type { ProductCardData } from "@/components/product/ProductCard";
import { DeliveryDatePicker } from "@/components/product/DeliveryDatePicker";
import { GiftMessageInput } from "@/components/product/GiftMessageInput";

const variants = ["Standard", "Premium", "Deluxe"];

export function ProductDetailClient({ product }: { product: ProductCardData }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [giftMessage, setGiftMessage] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Left — Image gallery */}
      <div className="space-y-3">
        {/* Main image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square rounded-3xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center overflow-hidden shadow-card"
        >
          <span className="text-[140px]">{product.emoji}</span>
        </motion.div>
        {/* Thumbnails */}
        <div className="flex gap-2">
          {[product.emoji, "🎀", "📦", "✨"].map((e, i) => (
            <button
              key={i}
              className={cn(
                "aspect-square w-16 rounded-xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-2xl border-2 transition-colors",
                i === 0 ? "border-primary" : "border-transparent hover:border-primary/30"
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Right — Product info */}
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {product.tag && <Badge className="bg-primary text-primary-foreground">{product.tag}</Badge>}
          {product.isSameDay && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
              <Truck className="h-3 w-3 mr-1" /> Same Day Delivery
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground leading-snug">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
            ))}
          </div>
          <span className="font-semibold text-sm">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <Separator />

        {/* Variants */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Size / Variant: <span className="text-primary">{variants[selectedVariant]}</span>
          </p>
          <div className="flex gap-2">
            {variants.map((v, i) => (
              <button
                key={v}
                onClick={() => setSelectedVariant(i)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all",
                  selectedVariant === i
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery date */}
        <DeliveryDatePicker value={deliveryDate} onChange={setDeliveryDate} />

        {/* Gift message */}
        <GiftMessageInput value={giftMessage} onChange={setGiftMessage} />

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-border rounded-full px-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-8 w-8 flex items-center justify-center hover:text-primary transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="h-8 w-8 flex items-center justify-center hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button
            size="lg"
            className={cn("flex-1 rounded-full shadow-warm transition-all", addedToCart && "bg-green-600 hover:bg-green-600")}
            onClick={handleAddToCart}
          >
            {addedToCart ? (
              <><ShieldCheck className="h-4 w-4 mr-2" /> Added!</>
            ) : (
              <><ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart</>
            )}
          </Button>

          <Button size="lg" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">
            <Zap className="h-4 w-4 mr-1" /> Buy Now
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setWishlisted((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-primary text-primary")} />
            {wishlisted ? "Wishlisted" : "Add to Wishlist"}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>

        <Separator />

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Truck, label: "Free Delivery", sub: "Above ₹999" },
            { icon: ShieldCheck, label: "Quality Assured", sub: "100% Fresh" },
            { icon: RotateCcw, label: "Easy Returns", sub: "7-day policy" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="text-center p-3 bg-muted/50 rounded-xl">
              <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs font-medium text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
