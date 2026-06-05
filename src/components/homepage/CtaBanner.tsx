import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/80 to-rose-gold-600/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">
          Make Someone&apos;s Day Special
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Free delivery on your first order above ₹999. Use code{" "}
          <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">FIRST10</span>
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-warm" asChild>
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white/10 bg-transparent" asChild>
            <Link href="/same-day-delivery">Same Day Delivery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
