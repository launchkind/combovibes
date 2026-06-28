import Link from "next/link";
import Image from "next/image";

const banners = [
  {
    id: 1,
    bg: "bg-gradient-to-br from-[#6B0028] to-[#A00040]",
    tag: "VALENTINE'S DAY OFFER!",
    price: "₹349",
    priceLabel: "JUST",
    sub: "Limited Time Only!",
    btnText: "Shop Now",
    btnClass: "bg-white text-[#D81B60] hover:bg-pink-50",
    href: "/shop?occasion=valentine",
    image: "/images/pic7.png",
    textColor: "text-white",
  },
  {
    id: 2,
    bg: "bg-gradient-to-br from-[#FCE4EC] to-[#F8BBD0]",
    tag: "EID SPECIAL COMBO",
    price: "₹549",
    priceLabel: "NOW ONLY",
    sub: "Limited Stock!",
    btnText: "Shop Now",
    btnClass: "bg-gray-900 text-white hover:bg-gray-800",
    href: "/shop?occasion=eid",
    image: "/images/pic3.png",
    textColor: "text-gray-900",
  },
  {
    id: 3,
    bg: "bg-gradient-to-br from-[#7B0033] to-[#C2185B]",
    tag: "COMBO OFFERS",
    price: null,
    priceLabel: null,
    sub: "Best Combos\nBest Prices",
    btnText: "Shop Now",
    btnClass: "bg-[#FFD700] text-gray-900 hover:bg-yellow-400",
    href: "/shop?tag=combo",
    image: "/images/pic8.png",
    textColor: "text-white",
  },
];

export default function PromoBanners() {
  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-frame mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`${b.bg} rounded-2xl overflow-hidden relative flex items-center justify-between p-5 min-h-[160px]`}
          >
            {/* Text */}
            <div className="z-10 flex-1">
              <p className={`text-xs font-black tracking-widest uppercase ${b.textColor} mb-1`}>
                {b.tag}
              </p>
              {b.price && (
                <>
                  <p className={`text-xs font-semibold ${b.textColor} opacity-80`}>{b.priceLabel}</p>
                  <p className={`text-4xl font-black ${b.textColor} leading-none`}>{b.price}</p>
                </>
              )}
              <p className={`text-xs ${b.textColor} opacity-80 mt-1 whitespace-pre-line`}>{b.sub}</p>
              <Link
                href={b.href}
                className={`inline-block mt-3 px-5 py-1.5 rounded-full text-xs font-bold transition-all ${b.btnClass}`}
              >
                {b.btnText}
              </Link>
            </div>

            {/* Image */}
            <div className="relative w-20 h-20 shrink-0 ml-2">
              <Image src={b.image} alt={b.tag} fill className="object-cover rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
