import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

const images = [
  "/images/pic1.png",
  "/images/pic2.png",
  "/images/pic4.png",
  "/images/pic5.png",
  "/images/pic7.png",
  "/images/pic8.png",
];

export default function InstagramFeed() {
  return (
    <section className="py-12 px-4 bg-white border-t border-gray-100">
      <div className="max-w-frame mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#D81B60] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">FOLLOW OUR JOURNEY</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            Gift{" "}
            <span
              className="text-[#D81B60]"
              style={{ fontFamily: "var(--font-dancing-script)", fontSize: "1.15em" }}
            >
              Gallery
            </span>
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#D81B60] font-bold hover:underline"
          >
            <Instagram className="w-4 h-4" />
            @ComboVibes
          </a>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {images.map((src, i) => (
            <Link
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-2xl group shadow-sm hover:shadow-lg transition-shadow"
            >
              <Image
                src={src}
                alt={`Gift photo ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#D81B60]/0 group-hover:bg-[#D81B60]/30 transition-all flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white font-bold px-8 py-2.5 rounded-full text-sm transition-all"
          >
            <Instagram className="w-4 h-4" />
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
