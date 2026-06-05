import { notFound } from "next/navigation";
import Link from "next/link";
import { mockOrders } from "@/lib/mockOrders";
import { formatPrice } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, MapPin, CalendarDays, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === id);
  return { title: order ? `Order ${order.orderNumber}` : "Order Not Found" };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === id);
  if (!order) notFound();

  const isDelivered = order.status === "delivered";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="font-playfair text-xl sm:text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="text-xs text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Tracking timeline */}
      <div className="bg-background border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-semibold text-sm mb-4">Order Tracking</h2>
        <div className="space-y-0">
          {order.timeline.map((step, i) => (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  step.done ? "border-primary bg-primary" : "border-border bg-background"
                )}>
                  {step.done
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                    : <Circle className="h-3.5 w-3.5 text-muted-foreground/30" />
                  }
                </div>
                {i < order.timeline.length - 1 && (
                  <div className={cn("w-0.5 flex-1 my-1", step.done ? "bg-primary" : "bg-border")} style={{ minHeight: 24 }} />
                )}
              </div>
              <div className="pb-4">
                <p className={cn("text-sm font-medium", step.done ? "text-foreground" : "text-muted-foreground")}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="bg-background border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-semibold text-sm mb-3">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between font-bold">
          <span>Total</span><span className="text-primary">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-background border border-border rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm">Delivery Address</h2>
        </div>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p className="font-medium text-foreground">{order.address.name} · +91 {order.address.phone}</p>
          <p>{order.address.line1}</p>
          <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{order.deliveryDate} · {order.deliverySlot}</span>
        </div>
      </div>

      {isDelivered && (
        <Button variant="outline" className="w-full rounded-full border-primary text-primary" asChild>
          <Link href={`/shop`}>Reorder or Gift Again</Link>
        </Button>
      )}
    </div>
  );
}
