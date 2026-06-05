import { mockProducts } from "@/lib/mockData";
import { ProductCard } from "@/components/product/ProductCard";

type Props = { searchParams: Promise<{ q?: string }> };

export async function SearchResults({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").toLowerCase().trim();

  const results = query
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.tag ?? "").toLowerCase().includes(query)
      )
    : [];

  return (
    <div>
      <div className="mb-6">
        {query ? (
          <>
            <h1 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground">
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {results.length} {results.length === 1 ? "product" : "products"} found
            </p>
          </>
        ) : (
          <h1 className="font-playfair text-2xl font-semibold text-foreground">
            Search for gifts
          </h1>
        )}
      </div>

      {query && results.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-playfair text-xl text-foreground">No results for &ldquo;{query}&rdquo;</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Try searching for flowers, cakes, chocolates, or personalised gifts
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {results.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {!query && (
        <div className="mt-4">
          <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">
            Popular searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {["roses", "birthday cake", "chocolate", "personalised", "same day", "anniversary", "plants", "hamper"].map((term) => (
              <a
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-2 bg-muted rounded-full text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
