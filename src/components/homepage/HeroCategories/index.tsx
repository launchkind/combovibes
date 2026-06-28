import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/category.types";

type Props = { categories: Category[] };

export default function HeroCategories({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-8 px-4 border-b border-gray-100">
      <div className="max-w-frame mx-auto">
        <div
          className="flex items-start gap-3 sm:gap-5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div
                className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] rounded-[20px] overflow-hidden shadow-sm group-hover:shadow-md transition-shadow border border-gray-100"
                style={{ background: cat.color || "#f7f3ee" }}
              >
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-black opacity-60">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-center text-gray-800 group-hover:text-[#D81B60] transition-colors leading-tight max-w-[100px] sm:max-w-[130px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
