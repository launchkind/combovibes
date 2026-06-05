"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
  const orderNum = Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
        Order Placed! 🎉
      </h1>
      <p className="text-muted-foreground mb-2">
        Your gift is on its way. We&apos;ll send you updates via email and SMS.
      </p>
      <div className="bg-muted/50 rounded-2xl p-4 my-6 inline-block">
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">Order #CV-</span>
          <span className="font-mono font-bold text-primary">{orderNum}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button className="rounded-full" asChild>
          <Link href="/orders">Track Order <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="outline" className="rounded-full border-primary text-primary" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
