import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React from "react";
import * as motion from "framer-motion/client";

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
              "text-[32px] leading-[36px] md:text-4xl capitalize font-bold",
            ])}
          >
            EXPLORE OUR COLLECTIONS
          </motion.h2>
          <a href="#" className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            VIEW ALL CATEGORIES <span>→</span>
          </a>
        </div>
        <motion.div
          initial={{ y: "100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {/* Category cards */}
          {[
            { name: "HOODIES", img: "/images/pic1.png" },
            { name: "JACKETS", img: "/images/pic2.png" },
            { name: "JEANS", img: "/images/pic3.png" },
            { name: "T-SHIRTS", img: "/images/pic4.png" },
            { name: "SHIRTS", img: "/images/pic5.png" },
            { name: "SNEAKERS", img: "/images/pic6.png" },
          ].map((category, idx) => (
            <motion.a
              key={category.name}
              href="/shop"
              initial={{ y: "50px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.6 }}
              className="group relative overflow-hidden rounded-lg aspect-square flex items-end justify-start p-4 bg-gray-200 hover:shadow-lg transition-all duration-300"
              style={{
                backgroundImage: `url('${category.img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
              <h3 className="text-white font-bold text-lg md:text-xl relative z-10 group-hover:translate-x-1 transition-transform">
                {category.name}
                <br />
                <span className="text-xs md:text-sm font-normal">SHOP NOW</span>
              </h3>
            </motion.a>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default DressStyle;
