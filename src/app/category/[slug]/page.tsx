import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categories, mockProducts } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.value === slug);
  if (!cat) return { title: "Category" };
  return { title: `${cat.label} Gifts` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.value === slug);
  if (!cat || !cat.value) notFound();

  const products = mockProducts.slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-playfair text-3xl font-semibold text-foreground mb-2">
        {cat.label} Gifts
      </h1>
      <p className="text-muted-foreground mb-8">
        Curated {cat.label.toLowerCase()} gifts for every occasion
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
