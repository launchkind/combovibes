"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Fresh Flowers", href: "/category/flowers", emoji: "🌹", bg: "bg-rose-50" },
  { label: "Designer Cakes", href: "/category/cakes", emoji: "🎂", bg: "bg-amber-50" },
  { label: "Gift Combos", href: "/category/combos", emoji: "🎁", bg: "bg-purple-50" },
  { label: "Chocolates", href: "/category/chocolates", emoji: "🍫", bg: "bg-orange-50" },
  { label: "Indoor Plants", href: "/category/plants", emoji: "🪴", bg: "bg-green-50" },
  { label: "Personalised", href: "/category/personalised", emoji: "✍️", bg: "bg-blue-50" },
  { label: "Soft Toys", href: "/category/soft-toys", emoji: "🧸", bg: "bg-pink-50" },
  { label: "Jewellery", href: "/category/jewellery", emoji: "💍", bg: "bg-yellow-50" },
];

export function CategoriesStrip() {
  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">
          Shop by Category
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={cat.href}
                className="flex flex-col items-center gap-2 group shrink-0 w-20 sm:w-auto"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 group-hover:shadow-warm",
                  cat.bg
                )}>
                  {cat.emoji}
                </div>
                <span className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
