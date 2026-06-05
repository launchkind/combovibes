"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const occasions = [
  { label: "Birthday", href: "/occasion/birthday", emoji: "🎂", gradient: "from-pink-400 to-rose-500" },
  { label: "Anniversary", href: "/occasion/anniversary", emoji: "💑", gradient: "from-red-400 to-pink-500" },
  { label: "Wedding", href: "/occasion/wedding", emoji: "💒", gradient: "from-amber-400 to-orange-500" },
  { label: "Valentine's", href: "/occasion/valentines", emoji: "❤️", gradient: "from-rose-400 to-red-500" },
  { label: "Mother's Day", href: "/occasion/mothers-day", emoji: "👩", gradient: "from-purple-400 to-pink-500" },
  { label: "Diwali", href: "/occasion/diwali", emoji: "🪔", gradient: "from-yellow-400 to-amber-500" },
];

export function OccasionsStrip() {
  return (
    <section className="py-10 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-2xl font-semibold text-foreground">
            Shop by Occasion
          </h2>
          <Link href="/occasions" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.href}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={occ.href}
                className="group block relative overflow-hidden rounded-2xl aspect-square"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${occ.gradient} opacity-80 group-hover:opacity-90 transition-opacity`} />
                <div className="relative h-full flex flex-col items-center justify-center gap-2 p-3">
                  <span className="text-4xl">{occ.emoji}</span>
                  <span className="font-semibold text-white text-sm text-center">{occ.label}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
