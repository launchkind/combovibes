import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/mockData";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductCard } from "@/components/product/ProductCard";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug[0]);
  if (!product) return { title: "Product Not Found" };
  return { title: product.name, description: `Buy ${product.name} — delivered across India` };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug[0]);
  if (!product) notFound();

  const related = mockProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetailClient product={product} />

      {/* Related products */}
      <section className="mt-16">
        <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
