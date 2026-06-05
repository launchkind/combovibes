import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata = { title: "Search Gifts" };

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
