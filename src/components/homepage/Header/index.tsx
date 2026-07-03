"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import * as motion from "framer-motion/client";

export type HeroBanner = {
  id: string;
  title: string;
  image_url: string;
  mobile_image_url?: string | null;
  link_url?: string | null;
  link_target?: string | null;
  cta_text?: string | null;
  alt_text?: string | null;
  title_color?: string | null;
  title_text?: string | null;
  tagline_color?: string | null;
  subtitle_color?: string | null;
  cta_text_color?: string | null;
};

type Props = {
  heroBanners?: HeroBanner[];
};

export default function Header({ heroBanners = [] }: Props) {
  const hasCms = heroBanners.length > 0;
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 250);
  }, []);

  const next = useCallback(() => {
    if (!hasCms) return;
    goTo((current + 1) % heroBanners.length);
  }, [current, heroBanners.length, hasCms, goTo]);

  const prev = useCallback(() => {
    if (!hasCms) return;
    goTo((current - 1 + heroBanners.length) % heroBanners.length);
  }, [current, heroBanners.length, hasCms, goTo]);

  useEffect(() => {
    if (!hasCms || heroBanners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [hasCms, heroBanners.length, next]);

  const nav = hasCms && heroBanners.length > 1 ? (
    <>
      <button
        onClick={prev}
        style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        aria-label="Previous"
      >
        <ChevronLeft size={20} color="#333" />
      </button>
      <button
        onClick={next}
        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        aria-label="Next"
      >
        <ChevronRight size={20} color="#333" />
      </button>
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 20 }}>
        {heroBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{ width: i === current ? 24 : 10, height: 10, borderRadius: 5, background: i === current ? "#D81B60" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }}
          />
        ))}
      </div>
    </>
  ) : null;

  /* ── CMS banner carousel ── */
  if (hasCms) {
    const b = heroBanners[current];
    return (
      <div style={{ position: "relative", overflow: "hidden", minHeight: "520px", background: "linear-gradient(135deg, #FFE0EE 0%, #FFC2D9 50%, #FFD6E7 100%)" }}>
        <Image
          src={b.image_url}
          alt={b.alt_text || ""}
          fill
          style={{ objectFit: "cover", opacity: fading ? 0 : 1, transition: "opacity 0.25s ease" }}
          priority
        />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "77.5rem", margin: "0 auto", padding: "80px 24px", minHeight: 520, display: "flex", alignItems: "center" }}>
          <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.25s ease", maxWidth: 560 }}>
            <p style={{ color: b.tagline_color || "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              {b.title}
            </p>
            <h1 style={{ fontFamily: "'Dancing Script', var(--font-dancing-script), cursive", fontSize: "clamp(32px,8vw,96px)", fontWeight: 700, color: b.title_color || "#fff", lineHeight: 1.1, margin: "0 0 12px", overflowWrap: "break-word" }}>
              {b.title_text || "Combo Vibes"}
            </h1>
            <p style={{ color: b.subtitle_color || "rgba(255,255,255,0.85)", fontSize: 16, marginBottom: 8 }}>
              {b.alt_text || "Jewellery | Men & Women Accessories | Gift Combo"}
            </p>
            <p style={{ fontFamily: "'Dancing Script', var(--font-dancing-script), cursive", color: b.cta_text_color || "#ffc2d4", fontSize: "clamp(24px,3.5vw,34px)", fontStyle: "italic", marginBottom: 32 }}>
              {b.cta_text || "For Every Vibe, For Everyone"}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href={b.link_url || "/shop"}
                style={{ background: "#D81B60", color: "#fff", fontWeight: 700, padding: "14px 32px", borderRadius: 12, fontSize: 14, textDecoration: "none", border: "2px solid transparent", display: "inline-block", boxShadow: "0 4px 14px rgba(216,27,96,0.4)" }}
              >
                Shop Now
              </Link>
              <Link
                href="/shop"
                style={{ background: "#fff", color: "#000", fontWeight: 700, padding: "14px 32px", borderRadius: 12, fontSize: 14, textDecoration: "none", border: "2px solid rgba(255,255,255,0.8)", display: "inline-block" }}
              >
                View Combos ↗
              </Link>
            </div>
          </div>
        </div>
        {nav}
      </div>
    );
  }

  /* ── Static fallback ── */
  return (
    <header className="bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] pt-10 md:pt-20 pb-10 md:pb-0 overflow-hidden">
      <div className="md:max-w-frame mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="max-w-frame px-4">
          <div className="mb-4">
            <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
              🎁 Same-Day Delivery Available
            </span>
          </div>
          <motion.h2
            initial={{ y: "100px", opacity: 0, rotate: 5 }}
            whileInView={{ y: "0", opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn([
              integralCF.className,
              "text-4xl lg:text-[56px] lg:leading-[1.1] mb-5 lg:mb-6 font-black",
            ])}
          >
            SEND GIFTS<br />THAT FEEL<br />
            <span className="text-red-500">PERSONAL.</span>
          </motion.h2>
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-black/60 text-sm lg:text-base mb-8 max-w-[480px] leading-relaxed"
          >
            Flowers, cakes, chocolates & curated hampers — delivered same day across India with a personalized message.
          </motion.p>
          <motion.div
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Link
              href="/shop"
              className="inline-block text-center bg-red-500 hover:bg-red-600 transition-all text-white px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg shadow-red-200"
            >
              SEND A GIFT NOW
            </Link>
            <Link
              href="/shop#same-day"
              className="inline-block text-center border-2 border-black/20 hover:border-black/50 transition-all text-black px-8 py-3.5 text-sm font-semibold rounded-xl"
            >
              SAME-DAY DELIVERY
            </Link>
          </motion.div>

          {/* Occasion quick links */}
          <motion.div
            initial={{ y: "50px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {["🎂 Birthday", "💍 Anniversary", "💐 Just Because", "🏆 Congratulations", "❤️ Romance"].map((tag) => (
              <Link
                key={tag}
                href="/shop"
                className="text-xs bg-white border border-black/10 hover:border-red-300 hover:text-red-500 transition-all px-3 py-1.5 rounded-full font-medium shadow-sm"
              >
                {tag}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: "50px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex items-center gap-6 md:gap-8 md:mb-16 flex-wrap"
          >
            <div className="flex flex-col">
              <span className="font-bold text-2xl lg:text-3xl">
                <AnimatedCounter from={0} to={50} />k+
              </span>
              <span className="text-xs text-black/50 text-nowrap">Happy Recipients</span>
            </div>
            <Separator className="h-10 bg-black/10" orientation="vertical" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl lg:text-3xl">
                <AnimatedCounter from={0} to={20} />+
              </span>
              <span className="text-xs text-black/50 text-nowrap">Cities Covered</span>
            </div>
            <Separator className="h-10 bg-black/10" orientation="vertical" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl lg:text-3xl">
                <AnimatedCounter from={0} to={500} />+
              </span>
              <span className="text-xs text-black/50 text-nowrap">Gift Options</span>
            </div>
          </motion.div>
        </section>

        <motion.section
          initial={{ y: "60px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative px-4 md:px-0 flex items-center justify-center"
        >
          {/* Gift showcase grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm md:max-w-full md:pr-4">
            {[
              { emoji: "🌹", label: "Fresh Flowers", sublabel: "From ₹399", bg: "bg-pink-50 border-pink-200" },
              { emoji: "🎂", label: "Custom Cakes", sublabel: "From ₹599", bg: "bg-yellow-50 border-yellow-200" },
              { emoji: "🍫", label: "Chocolates", sublabel: "From ₹299", bg: "bg-amber-50 border-amber-200" },
              { emoji: "🎁", label: "Gift Hampers", sublabel: "From ₹899", bg: "bg-purple-50 border-purple-200" },
            ].map((item, idx) => (
              <Link
                key={item.label}
                href="/shop"
                className={`${item.bg} border rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition-all group cursor-pointer`}
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="font-semibold text-sm text-black">{item.label}</span>
                <span className="text-xs text-black/50 mt-0.5">{item.sublabel}</span>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </header>
  );
}
