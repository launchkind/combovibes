"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-background to-rose-gold-50 min-h-[520px] flex items-center">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cream-300/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            India&apos;s Premium Gift Destination
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Gift Someone<br />
            <span className="text-primary">Something Special</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-md">
            Curated gift combos with fresh flowers, designer cakes &amp; personalised keepsakes — delivered same day across India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full px-6 shadow-warm group" asChild>
              <Link href="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-6 border-primary text-primary hover:bg-primary/5" asChild>
              <Link href="/occasion/birthday">Birthday Gifts</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-semibold">50+</span> Cities
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-semibold">1L+</span> Happy Customers
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-semibold">4.8★</span> Rating
            </div>
          </div>
        </motion.div>

        {/* Visual placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex justify-center"
        >
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cream-300/40 rounded-full" />
            <div className="absolute inset-8 bg-gradient-to-br from-primary/30 to-rose-gold-200/50 rounded-full flex items-center justify-center">
              <span className="text-7xl">🎁</span>
            </div>
            {/* Floating cards */}
            <div className="absolute -top-4 -right-4 bg-background rounded-2xl shadow-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Same Day</p>
              <p className="font-semibold text-sm text-primary">Delivery</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background rounded-2xl shadow-card p-3 text-center">
              <p className="text-xs text-muted-foreground">Starting at</p>
              <p className="font-semibold text-sm text-primary">₹499</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
