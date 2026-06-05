import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Link from "next/link";
import React from "react";
import * as motion from "framer-motion/client";

const occasions = [
  { name: "Birthday", emoji: "🎂", color: "from-pink-400 to-rose-500", url: "/shop?occasion=birthday" },
  { name: "Anniversary", emoji: "💍", color: "from-purple-400 to-violet-600", url: "/shop?occasion=anniversary" },
  { name: "Wedding", emoji: "💒", color: "from-rose-300 to-pink-500", url: "/shop?occasion=wedding" },
  { name: "Diwali", emoji: "🪔", color: "from-orange-400 to-amber-500", url: "/shop?occasion=diwali" },
  { name: "Congratulations", emoji: "🏆", color: "from-yellow-400 to-orange-400", url: "/shop?occasion=congrats" },
  { name: "Just Because", emoji: "❤️", color: "from-red-400 to-rose-500", url: "/shop?occasion=just-because" },
];

const DressStyle = () => {
  return (
    <div className="px-4 xl:px-0">
      <section className="max-w-frame mx-auto bg-white px-4 py-12 md:py-20">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn([
              integralCF.className,
              "text-[28px] leading-[34px] md:text-4xl capitalize font-bold",
            ])}
          >
            SHOP BY OCCASION
          </motion.h2>
          <Link href="/shop" className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all text-red-500">
            VIEW ALL <span>→</span>
          </Link>
        </div>
        <motion.div
          initial={{ y: "100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
        >
          {occasions.map((occasion, idx) => (
            <motion.div
              key={occasion.name}
              initial={{ y: "40px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * idx, duration: 0.5 }}
            >
              <Link
                href={occasion.url}
                className="group flex flex-col items-center justify-center rounded-2xl aspect-square p-4 hover:shadow-lg transition-all duration-300 overflow-hidden relative bg-gray-50 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${occasion.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <span className="text-3xl md:text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {occasion.emoji}
                </span>
                <span className="text-xs md:text-sm font-semibold text-center text-black/80">
                  {occasion.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default DressStyle;
