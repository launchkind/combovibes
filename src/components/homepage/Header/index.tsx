import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React from "react";
import * as motion from "framer-motion/client";

const Header = () => {
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
              className="inline-block text-center bg-red-500 hover:bg-red-600 transition-all text-white px-8 py-3.5 text-sm font-bold rounded-full shadow-lg shadow-red-200"
            >
              SEND A GIFT NOW
            </Link>
            <Link
              href="/shop#same-day"
              className="inline-block text-center border-2 border-black/20 hover:border-black/50 transition-all text-black px-8 py-3.5 text-sm font-semibold rounded-full"
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
};

export default Header;
