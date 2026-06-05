import { ProductCard } from "@/components/product/ProductCard";
import { mockProducts } from "@/lib/mockData";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export async function ProductGrid({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort ?? "popular";
  const price = params.price ?? "";
  const delivery = params.delivery ?? "";

  let products = [...mockProducts];

  // Filter by price
  if (price) {
    const [min, max] = price.split("-").map(Number);
    products = products.filter((p) => p.price >= min && p.price <= max);
  }

  // Filter by delivery
  if (delivery === "same_day") {
    products = products.filter((p) => p.isSameDay);
  }

  // Sort
  if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
  else if (sort === "rating") products.sort((a, b) => b.rating - a.rating);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {products.length} products found
      </p>
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-playfair text-xl text-foreground">No products found</p>
          <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
