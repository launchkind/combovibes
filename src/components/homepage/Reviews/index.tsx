"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Review } from "@/types/review.types";

type Props = { data: Review[]; titleColor?: string };

const avatarColors = [
  "bg-pink-400", "bg-purple-400", "bg-blue-400",
  "bg-green-400", "bg-orange-400", "bg-rose-400",
];

const Stars = () => (
  <div className="flex gap-0.5 my-1">
    {[1,2,3,4,5].map((i) => (
      <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Reviews = ({ data, titleColor }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const accent = titleColor || "#D81B60";

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-frame mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400 text-sm">• •</span>
            <span style={{ color: accent }} className="text-lg">❤</span>
            <h2 style={{ color: accent }} className="text-xl md:text-2xl font-black tracking-wide uppercase">
              What Our Customers Say
            </h2>
            <span style={{ color: accent }} className="text-lg">❤</span>
            <span className="text-gray-400 text-sm">• •</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data.map((review, i) => (
              <div
                key={review.id}
                className="shrink-0 w-[280px] sm:w-[320px] bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {review.user[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{review.user}</p>
                    <Stars />
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
