import { mockProducts } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";

type Props = { params: Promise<{ slug: string }> };

const occasionNames: Record<string, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  wedding: "Wedding",
  valentines: "Valentine's Day",
  "mothers-day": "Mother's Day",
  diwali: "Diwali",
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = occasionNames[slug] ?? slug;
  return { title: `${name} Gifts` };
}

export default async function OccasionPage({ params }: Props) {
  const { slug } = await params;
  const name = occasionNames[slug] ?? slug;
  const products = mockProducts.slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-playfair text-3xl font-semibold text-foreground mb-2">
        {name} Gifts
      </h1>
      <p className="text-muted-foreground mb-8">
        Thoughtful gifts for {name.toLowerCase()}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
