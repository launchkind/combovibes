import Link from "next/link";
import DBProductCard from "@/components/common/DBProductCard";
import { CategoryWithProducts, DBProduct } from "@/types/category.types";

type Props = { categories: CategoryWithProducts[] };

export default function DynamicHomepageSections({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-6 text-center text-gray-400 text-sm">
          No product sections configured yet. Go to Admin → Categories to set up your homepage sections.
        </div>
      </section>
    );
  }

  return (
    <>
      {categories.map((cat, idx) => {
        const products: DBProduct[] = (cat.product_categories ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((pc) => pc.products)
          .filter((p) => p && p.status === "active");

        if (products.length === 0) return null;

        return (
          <div key={cat.id}>
            <section className="py-10 bg-white">
              <div className="max-w-[1400px] mx-auto px-6">
                {/* Section header */}
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                      {cat.name.toUpperCase()}
                    </h2>
                    {cat.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                    )}
                    <div className="mt-1.5 w-28 h-[3px] bg-gray-900 rounded-full" />
                  </div>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-[#D81B60] text-sm font-bold hover:underline shrink-0"
                  >
                    View All →
                  </Link>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.slice(0, 5).map((product) => (
                    <DBProductCard key={product.id} data={product} />
                  ))}
                </div>

                {/* Mobile view all */}
                <div className="text-center mt-6 md:hidden">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="inline-block border-2 border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white font-bold px-7 py-2 rounded-full text-sm transition-all"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </section>

            {/* Divider between sections (not after last) */}
            {idx < categories.length - 1 && (
              <div className="max-w-frame mx-auto px-4 xl:px-0">
                <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
