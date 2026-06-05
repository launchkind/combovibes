"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  tag?: string;
  deliveryDays?: number;
  isSameDay?: boolean;
};

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="group"
    >
      <div className="bg-background rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
        {/* Image area */}
        <Link href={`/shop/product/${product.slug}`} className="block relative aspect-square bg-gradient-to-br from-cream-100 to-cream-200 overflow-hidden">
          <div className="h-full flex items-center justify-center text-7xl">
            {product.emoji}
          </div>
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.tag && (
              <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                {product.tag}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 border-0">
                {discount}% OFF
              </Badge>
            )}
          </div>
          {/* Delivery badge */}
          {product.isSameDay && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/90 backdrop-blur text-[10px] font-medium text-primary px-2 py-1 rounded-full">
              <Truck className="h-3 w-3" /> Today
            </div>
          )}
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted((v) => !v); }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Wishlist"
          >
            <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-primary text-primary" : "text-muted-foreground")} />
          </button>
          {/* Quick add */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
            <Button size="sm" className="rounded-full text-xs shadow-warm whitespace-nowrap h-7 px-3">
              <ShoppingBag className="h-3 w-3 mr-1" /> Add to Cart
            </Button>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <Link href={`/shop/product/${product.slug}`}>
            <h3 className="text-sm font-medium leading-snug text-foreground hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
