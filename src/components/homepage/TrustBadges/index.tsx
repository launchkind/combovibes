import { Shield, CreditCard, Truck, Tag, RotateCcw } from "lucide-react";

const badges = [
  { Icon: Shield, label: "Premium Quality", sub: "Best quality products" },
  { Icon: CreditCard, label: "Secure Payment", sub: "100% secure payment" },
  { Icon: Truck, label: "Fast Delivery", sub: "Quick delivery at your door" },
  { Icon: Tag, label: "Best Price", sub: "Affordable prices" },
  { Icon: RotateCcw, label: "Easy Returns", sub: "Hassle free returns" },
];

export default function TrustBadges() {
  return (
    <section className="bg-white px-4 py-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-[#FCE7F0] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-y-4">
          {badges.map(({ Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 basis-1/2 sm:basis-auto">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#D81B60]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-tight">{label}</p>
                <p className="text-xs text-gray-500 leading-tight">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
