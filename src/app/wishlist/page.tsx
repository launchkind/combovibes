import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
      <h1 className="font-playfair text-2xl font-semibold text-foreground">Your Wishlist</h1>
      <p className="text-muted-foreground mt-2">
        Save gifts you love — wishlist activates once you sign in.
      </p>
      <div className="flex gap-3 justify-center mt-6">
        <Button className="rounded-full" asChild>
          <Link href="/shop">Browse Gifts</Link>
        </Button>
        <Button variant="outline" className="rounded-full border-primary text-primary" asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
