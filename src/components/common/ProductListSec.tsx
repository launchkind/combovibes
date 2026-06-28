"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product.types";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  data: Product[];
  viewAllLink?: string;
  eyebrow?: string;
};

const ProductListSec = ({ title, subtitle, data, viewAllLink }: Props) => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
            <div className="mt-1.5 w-28 h-[3px] bg-gray-900 rounded-full" />
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-[#D81B60] text-sm font-bold hover:underline shrink-0"
            >
              View All →
            </Link>
          )}
        </div>

        {/* Grid — matches OccasionSection card sizing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>

        {/* Mobile view all */}
        {viewAllLink && (
          <div className="text-center mt-6 md:hidden">
            <Link
              href={viewAllLink}
              className="inline-block border-2 border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white font-bold px-7 py-2 rounded-full text-sm transition-all"
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListSec;
