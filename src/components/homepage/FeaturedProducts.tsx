"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";

type MockProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  tag?: string;
  isNew?: boolean;
};

const bestSellers: MockProduct[] = [
  { id: "1", name: "Red Roses Bouquet", slug: "red-roses-bouquet", price: 799, originalPrice: 999, rating: 4.8, reviews: 1240, emoji: "🌹", tag: "Bestseller" },
  { id: "2", name: "Chocolate Truffle Cake", slug: "chocolate-truffle-cake", price: 649, originalPrice: 799, rating: 4.7, reviews: 890, emoji: "🎂", tag: "Bestseller" },
  { id: "3", name: "Flower & Cake Combo", slug: "flower-cake-combo", price: 1299, originalPrice: 1599, rating: 4.9, reviews: 2100, emoji: "🎁", tag: "Top Rated" },
  { id: "4", name: "Personalised Photo Frame", slug: "photo-frame", price: 599, rating: 4.6, reviews: 450, emoji: "🖼️" },
  { id: "5", name: "Luxury Chocolate Box", slug: "luxury-chocolates", price: 899, originalPrice: 1099, rating: 4.8, reviews: 670, emoji: "🍫", tag: "New" },
  { id: "6", name: "Succulent Plant Gift", slug: "succulent-plant", price: 499, rating: 4.5, reviews: 320, emoji: "🪴" },
  { id: "7", name: "Rose Gold Jewellery Set", slug: "rose-gold-jewellery", price: 1499, originalPrice: 1999, rating: 4.7, reviews: 180, emoji: "💍", tag: "Premium" },
  { id: "8", name: "Teddy Bear Hamper", slug: "teddy-hamper", price: 999, rating: 4.6, reviews: 540, emoji: "🧸" },
];

const newArrivals: MockProduct[] = [
  { id: "9", name: "Dried Flower Wreath", slug: "dried-flower-wreath", price: 1199, rating: 4.8, reviews: 120, emoji: "🌸", isNew: true },
  { id: "10", name: "Scented Candle Set", slug: "scented-candles", price: 699, rating: 4.7, reviews: 85, emoji: "🕯️", isNew: true },
  { id: "11", name: "Spa Gift Hamper", slug: "spa-hamper", price: 1799, rating: 4.9, reviews: 60, emoji: "🧴", isNew: true },
  { id: "12", name: "Handmade Chocolate Box", slug: "handmade-chocolates", price: 849, rating: 4.8, reviews: 95, emoji: "🍬", isNew: true },
  { id: "13", name: "Minimalist Planter Set", slug: "minimalist-planters", price: 1299, rating: 4.6, reviews: 45, emoji: "🌿", isNew: true },
  { id: "14", name: "Silver Rakhi Combo", slug: "silver-rakhi", price: 599, rating: 4.7, reviews: 200, emoji: "🎀", isNew: true },
  { id: "15", name: "Personalised Mug Set", slug: "personalised-mugs", price: 499, rating: 4.5, reviews: 135, emoji: "☕", isNew: true },
  { id: "16", name: "Premium Gift Box", slug: "premium-gift-box", price: 2499, rating: 4.9, reviews: 30, emoji: "📦", isNew: true },
];

const tabs = [
  { label: "Best Sellers", key: "best" },
  { label: "New Arrivals", key: "new" },
];

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<"best" | "new">("best");
  const products = activeTab === "best" ? bestSellers : newArrivals;

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground">
            Curated for You
          </h2>
          {/* Tabs */}
          <div className="flex bg-muted rounded-full p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "best" | "new")}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                  activeTab === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary/5" asChild>
            <Link href="/shop">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: MockProduct; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/shop/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-200 rounded-2xl overflow-hidden mb-3 shadow-card group-hover:shadow-card-hover transition-shadow">
          <div className="h-full flex items-center justify-center text-6xl">
            {product.emoji}
          </div>
          {product.tag && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
              {product.tag}
            </Badge>
          )}
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-charcoal-500 text-white text-xs">
              New
            </Badge>
          )}
          <button
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </button>
          <button
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-warm"
          >
            <ShoppingBag className="h-3 w-3" /> Add to Cart
          </button>
        </div>
        <div className="space-y-1 px-0.5">
          <h3 className="font-medium text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
