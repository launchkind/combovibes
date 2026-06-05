"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const priceRanges = [
  { label: "Under ₹500", value: "0-500" },
  { label: "₹500 – ₹1,000", value: "500-1000" },
  { label: "₹1,000 – ₹2,000", value: "1000-2000" },
  { label: "Above ₹2,000", value: "2000-99999" },
];

const deliveryOptions = [
  { label: "Same Day", value: "same_day" },
  { label: "Next Day", value: "next_day" },
  { label: "2-3 Days", value: "standard" },
];

const occasionOptions = [
  { label: "Birthday", value: "birthday" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Wedding", value: "wedding" },
  { label: "Valentine's Day", value: "valentines" },
  { label: "Mother's Day", value: "mothers-day" },
];

type FilterSidebarProps = { className?: string };

export function FilterSidebar({ className }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const clearAll = () => router.push(pathname);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside className={cn("space-y-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="text-primary text-xs h-auto p-0" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      {/* Price */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((r) => (
            <div key={r.value} className="flex items-center gap-2">
              <Checkbox
                id={`price-${r.value}`}
                checked={searchParams.get("price") === r.value}
                onCheckedChange={(checked) => updateParam("price", checked ? r.value : "")}
              />
              <Label htmlFor={`price-${r.value}`} className="text-sm font-normal cursor-pointer">{r.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Delivery */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Delivery Time</h4>
        <div className="space-y-2">
          {deliveryOptions.map((d) => (
            <div key={d.value} className="flex items-center gap-2">
              <Checkbox
                id={`delivery-${d.value}`}
                checked={searchParams.get("delivery") === d.value}
                onCheckedChange={(checked) => updateParam("delivery", checked ? d.value : "")}
              />
              <Label htmlFor={`delivery-${d.value}`} className="text-sm font-normal cursor-pointer">{d.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Occasion */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Occasion</h4>
        <div className="space-y-2">
          {occasionOptions.map((o) => (
            <div key={o.value} className="flex items-center gap-2">
              <Checkbox
                id={`occ-${o.value}`}
                checked={searchParams.get("occasion") === o.value}
                onCheckedChange={(checked) => updateParam("occasion", checked ? o.value : "")}
              />
              <Label htmlFor={`occ-${o.value}`} className="text-sm font-normal cursor-pointer">{o.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
