const steps = [
  {
    step: "01",
    emoji: "🎯",
    title: "Choose Your Gift",
    desc: "Browse our curated collection of premium gift combos by occasion, budget, or recipient",
    gradient: "from-[#D81B60] to-[#880E4F]",
  },
  {
    step: "02",
    emoji: "🛒",
    title: "Place Your Order",
    desc: "Add to cart and checkout in seconds. Pay via UPI, Card, or Cash on Delivery",
    gradient: "from-[#7B0033] to-[#C2185B]",
  },
  {
    step: "03",
    emoji: "📦",
    title: "We Pack Beautifully",
    desc: "Every gift is wrapped with premium packaging, ready to be gifted directly",
    gradient: "from-[#C2185B] to-[#E91E63]",
  },
  {
    step: "04",
    emoji: "🚀",
    title: "Swift Delivery",
    desc: "Your gift reaches the doorstep with care and speed — on time, every time",
    gradient: "from-[#E91E63] to-[#F06292]",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-14 px-4 bg-white border-t border-gray-100">
      <div className="max-w-frame mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#D81B60] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">SIMPLE & EASY</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Gifting Made{" "}
            <span
              className="text-[#D81B60]"
              style={{ fontFamily: "var(--font-dancing-script)", fontSize: "1.15em" }}
            >
              Easy
            </span>
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Four simple steps to send the perfect gift to someone you love
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#D81B60]/20 via-[#D81B60]/40 to-[#D81B60]/20 hidden md:block" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Icon circle */}
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-3xl shadow-lg mb-5 group-hover:scale-110 transition-transform duration-200 z-10`}>
                {step.emoji}
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                  <span className="text-[9px] font-black text-[#D81B60]">{step.step}</span>
                </div>
              </div>

              <h3 className="font-black text-sm text-gray-900 mb-2">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[160px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
