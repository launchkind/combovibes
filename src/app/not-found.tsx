import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🎁</div>
        <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">
          Oops! Page not found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to finding the perfect gift.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button className="rounded-full" asChild>
            <Link href="/"><Home className="mr-2 h-4 w-4" />Go Home</Link>
          </Button>
          <Button variant="outline" className="rounded-full border-primary text-primary" asChild>
            <Link href="/shop"><ShoppingBag className="mr-2 h-4 w-4" />Browse Gifts</Link>
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/search"><Search className="mr-2 h-4 w-4" />Search</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
