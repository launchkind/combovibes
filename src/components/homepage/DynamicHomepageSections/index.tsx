import Link from "next/link";
import ProductCarousel from "./ProductCarousel";
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
      {categories.map((cat) => {
        const products: DBProduct[] = (cat.product_categories ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((pc) => pc.products)
          .filter((p) => p && p.status === "active");

        if (products.length === 0) return null;

        return (
          <div key={cat.id}>
            <section className="py-4 bg-white">
              <div className="max-w-[1400px] mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span style={{ color: cat.title_color || "#D81B60" }} className="text-sm shrink-0">♥</span>
                    <h2
                      style={{ color: cat.title_color || "#D81B60" }}
                      className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-wide shrink-0"
                    >
                      {cat.name}
                    </h2>
                    <span style={{ color: cat.title_color || "#D81B60" }} className="text-sm shrink-0">♥</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                  )}
                </div>

                {/* Product carousel */}
                <ProductCarousel products={products} buttonColor={cat.button_color} />

                {/* View all */}
                <div className="text-center mt-3">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="inline-block border-2 border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white font-bold px-7 py-2 rounded-full text-sm transition-all"
                  >
                    View All
                  </Link>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </>
  );
}
