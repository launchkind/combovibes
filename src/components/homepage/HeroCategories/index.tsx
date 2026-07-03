import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/category.types";

type Props = { categories: Category[] };

export default function HeroCategories({ categories }: Props) {
  if (categories.length === 0) return null;

  const visibleCategories = categories.slice(0, 7);

  return (
    <section className="bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-nowrap items-start justify-between gap-2 sm:gap-4">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 min-w-0 group"
            >
              <div
                className="relative w-[60px] h-[60px] xs:w-[75px] xs:h-[75px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow"
                style={{ background: cat.color || "#fce4ec" }}
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
              <span className="text-xs xs:text-sm sm:text-base font-black text-center text-gray-900 group-hover:text-[#D81B60] transition-colors leading-tight max-w-[80px] sm:max-w-[130px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
