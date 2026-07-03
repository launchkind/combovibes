import Link from "next/link";
import Image from "next/image";

export type PromoCard = {
  id: string;
  title: string;
  title_text: string | null;
  alt_text: string | null;
  cta_text: string | null;
  image_url: string;
  link_url: string | null;
  title_color: string | null;
  bg_color: string | null;
};

type Props = { cards: PromoCard[] };

export default function PromoCards({ cards }: Props) {
  if (cards.length === 0) return null;

  const visibleCards = cards.slice(0, 3);

  return (
    <section className="bg-white px-4 py-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibleCards.map((card) => (
            <Link
              key={card.id}
              href={card.link_url || "/shop"}
              className="relative rounded-2xl overflow-hidden p-5 h-[170px] flex flex-col justify-center group"
              style={!card.image_url ? { backgroundColor: card.bg_color || "#C2185B" } : undefined}
            >
              {card.image_url && (
                <>
                  <Image
                    src={card.image_url}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </>
              )}

              <div className="relative z-10 max-w-[65%]">
                <h3 className="text-white text-sm font-black uppercase tracking-wide leading-tight mb-1.5">
                  {card.title}
                </h3>
                {card.title_text && (
                  <p
                    className="text-2xl font-black leading-tight mb-1"
                    style={{ color: card.title_color || "#FFD700" }}
                  >
                    {card.title_text}
                  </p>
                )}
                {card.alt_text && (
                  <p className="text-white/90 text-xs font-medium mb-3">{card.alt_text}</p>
                )}
                <span className="inline-block bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full group-hover:scale-105 transition-transform">
                  {card.cta_text || "Shop Now"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
