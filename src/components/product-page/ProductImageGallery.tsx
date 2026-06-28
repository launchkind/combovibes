"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  url: string;
  alt_text?: string | null;
};

type Props = {
  productName: string;
  primaryImage: string | null;
  galleryImages: GalleryImage[];
  badge?: string | null;
};

export default function ProductImageGallery({ productName, primaryImage, galleryImages, badge }: Props) {
  // Merge primary + gallery into one ordered list (deduplicated)
  const allImages: GalleryImage[] = (() => {
    if (galleryImages.length > 0) return galleryImages;
    if (primaryImage) return [{ url: primaryImage }];
    return [];
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex] ?? null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f7f3ee] border border-gray-100">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={activeImage.alt_text ?? productName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">No image</div>
        )}

        {badge === "best-seller" && (
          <span className="absolute top-4 left-4 bg-[#D81B60] text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
            Best Seller
          </span>
        )}
        {badge === "new" && (
          <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
            New Arrival
          </span>
        )}
      </div>

      {/* Thumbnails — only shown when there are multiple images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[#D81B60]"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `${productName} image ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
