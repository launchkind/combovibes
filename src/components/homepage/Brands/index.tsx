import React from "react";

const trustItems = [
  { icon: "🚚", label: "Same-Day Delivery" },
  { icon: "🎁", label: "Handcrafted Gifts" },
  { icon: "💳", label: "Secure Payments" },
  { icon: "📞", label: "24/7 Support" },
  { icon: "⭐", label: "4.8★ Rated" },
];

const Brands = () => {
  return (
    <div className="bg-black">
      <div className="max-w-frame mx-auto flex flex-wrap items-center justify-center md:justify-between py-4 md:py-0 px-4 xl:px-0 gap-4 md:gap-0">
        {trustItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-white my-4 md:my-10"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-semibold tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
