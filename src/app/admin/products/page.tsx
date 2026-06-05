import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star } from "lucide-react";

export const metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{mockProducts.length} products</p>
        </div>
        <Button className="rounded-full shrink-0" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden sm:table-cell">Price</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Rating</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden lg:table-cell">Tag</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.emoji}</span>
                      <div>
                        <p className="font-medium text-foreground leading-snug">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="font-semibold">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    {product.tag && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">
                        {product.tag}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
