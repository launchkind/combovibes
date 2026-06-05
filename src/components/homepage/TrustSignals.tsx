import { Truck, Shield, Clock, HeartHandshake } from "lucide-react";

const signals = [
  {
    icon: Truck,
    title: "Same Day Delivery",
    description: "Order by 4 PM for same-day delivery in 50+ cities",
  },
  {
    icon: Clock,
    title: "On-Time Guaranteed",
    description: "We deliver exactly when we promise — or your money back",
  },
  {
    icon: Shield,
    title: "Fresh & Quality Assured",
    description: "Hand-picked flowers, freshly baked cakes, quality guaranteed",
  },
  {
    icon: HeartHandshake,
    title: "Personalised Gifts",
    description: "Add photos, messages & custom packaging to any order",
  },
];

export function TrustSignals() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div key={signal.title} className="flex gap-4 items-start p-5 bg-background rounded-2xl shadow-card">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{signal.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
