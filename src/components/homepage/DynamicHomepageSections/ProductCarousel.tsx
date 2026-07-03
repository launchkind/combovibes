"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DBProductCard from "@/components/common/DBProductCard";
import { DBProduct } from "@/types/category.types";

type Props = { products: DBProduct[]; buttonColor?: string | null };

export default function ProductCarousel({ products, buttonColor }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateArrows = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    updateArrows();
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="hidden sm:flex absolute -left-4 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-gray-600 hover:text-[#D81B60] hover:shadow-lg transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[46%] xs:w-[38%] sm:w-[31%] md:w-[23%] lg:w-[19%] shrink-0 snap-start"
          >
            <DBProductCard data={product} buttonColor={buttonColor ?? undefined} />
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden sm:flex absolute -right-4 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-gray-600 hover:text-[#D81B60] hover:shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
