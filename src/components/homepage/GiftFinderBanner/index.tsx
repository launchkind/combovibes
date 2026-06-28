import Link from "next/link";
import { Sparkles } from "lucide-react";

const budgets = [
  { label: "Under ₹299", href: "/shop?maxPrice=299", emoji: "🎀" },
  { label: "₹300 – ₹599", href: "/shop?minPrice=300&maxPrice=599", emoji: "🎁" },
  { label: "₹600 – ₹999", href: "/shop?minPrice=600&maxPrice=999", emoji: "💝" },
  { label: "₹1000+", href: "/shop?minPrice=1000", emoji: "👑" },
];

const recipients = [
  { label: "For Girlfriend", href: "/shop?for=girlfriend", emoji: "💑" },
  { label: "For Mom", href: "/shop?for=mom", emoji: "🤱" },
  { label: "For Friend", href: "/shop?for=friend", emoji: "🤝" },
  { label: "For Brother", href: "/shop?for=brother", emoji: "🙌" },
];

export default function GiftFinderBanner() {
  return (
    <section className="py-14 px-4 bg-gradient-to-br from-[#6B0028] via-[#9C1040] to-[#C2185B] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 50% 0%, white 0%, transparent 60%)" }} />
      {["top-6 left-10", "top-16 right-20", "bottom-10 left-1/4", "bottom-6 right-1/3"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-white/15 text-2xl select-none pointer-events-none`}>✦</div>
      ))}

      <div className="max-w-frame mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-white text-xs font-semibold">Gift Finder</span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-white mb-3 leading-none"
            style={{ fontFamily: "var(--font-dancing-script)" }}
          >
            Find the Perfect Gift
          </h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto">
            Not sure what to gift? Pick your budget or who you're gifting to
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Budget picker */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
            <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
              <span>🎯</span> Shop by Budget
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {budgets.map((b) => (
                <Link
                  key={b.label}
                  href={b.href}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/40 rounded-2xl px-4 py-3 transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{b.emoji}</span>
                  <span className="text-white text-sm font-semibold">{b.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recipient picker */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
            <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
              <span>💌</span> Shop by Recipient
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recipients.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/40 rounded-2xl px-4 py-3 transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{r.emoji}</span>
                  <span className="text-white text-sm font-semibold">{r.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-[#C2185B] font-bold px-10 py-3.5 rounded-full text-sm hover:bg-pink-50 transition-all shadow-xl hover:scale-105"
          >
            Browse All Gifts →
          </Link>
        </div>
      </div>
    </section>
  );
}
