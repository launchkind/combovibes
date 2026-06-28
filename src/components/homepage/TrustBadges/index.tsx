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
    <section className="bg-[#FFF0F7] border-y border-pink-100 py-5 px-4">
      <div className="max-w-frame mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map(({ Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D81B60]/10 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#D81B60]" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{label}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
