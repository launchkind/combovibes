import { Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SortSelect } from "@/components/shop/SortSelect";

export const metadata = { title: "Shop Gifts" };

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-semibold text-foreground">
            All Gifts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked combos for every occasion
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <SortSelect />
          </Suspense>
          {/* Mobile filter trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Suspense>
                  <FilterSidebar />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-background border border-border rounded-2xl p-5">
            <Suspense>
              <FilterSidebar />
            </Suspense>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
      ))}
    </div>
  );
}
