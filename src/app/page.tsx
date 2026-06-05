import ProductListSec from "@/components/common/ProductListSec";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "Sunrise Rose Bouquet",
    srcUrl: "/images/pic1.png",
    gallery: ["/images/pic1.png", "/images/pic10.png", "/images/pic11.png"],
    price: 799,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 2,
    title: "Red Velvet Love Cake",
    srcUrl: "/images/pic2.png",
    gallery: ["/images/pic2.png"],
    price: 999,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.8,
  },
  {
    id: 3,
    title: "Belgian Chocolate Box",
    srcUrl: "/images/pic3.png",
    gallery: ["/images/pic3.png"],
    price: 599,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 4,
    title: "Luxury Gift Hamper",
    srcUrl: "/images/pic4.png",
    gallery: ["/images/pic4.png", "/images/pic10.png", "/images/pic11.png"],
    price: 1499,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 5.0,
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Lavender Dreams Bouquet",
    srcUrl: "/images/pic5.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 1199,
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 5.0,
  },
  {
    id: 6,
    title: "Birthday Celebration Cake",
    srcUrl: "/images/pic6.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 849,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.7,
  },
  {
    id: 7,
    title: "Teddy & Roses Combo",
    srcUrl: "/images/pic7.png",
    gallery: ["/images/pic7.png"],
    price: 699,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.3,
  },
  {
    id: 8,
    title: "Anniversary Hamper Deluxe",
    srcUrl: "/images/pic8.png",
    gallery: ["/images/pic8.png"],
    price: 1999,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.9,
  },
];

export const relatedProductData: Product[] = [
  {
    id: 12,
    title: "Mixed Flower Vase",
    srcUrl: "/images/pic12.png",
    gallery: ["/images/pic12.png", "/images/pic10.png", "/images/pic11.png"],
    price: 649,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.2,
  },
  {
    id: 13,
    title: "Truffle Cake Box",
    srcUrl: "/images/pic13.png",
    gallery: ["/images/pic13.png", "/images/pic10.png", "/images/pic11.png"],
    price: 749,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.6,
  },
  {
    id: 14,
    title: "Spa & Wellness Hamper",
    srcUrl: "/images/pic14.png",
    gallery: ["/images/pic14.png"],
    price: 1299,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.8,
  },
  {
    id: 15,
    title: "Choco-Bloom Gift Set",
    srcUrl: "/images/pic15.png",
    gallery: ["/images/pic15.png"],
    price: 899,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 4.9,
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Priya S.",
    content:
      '"I ordered flowers for my mom\'s birthday at 10 AM and they arrived by 2 PM — absolutely fresh and beautifully wrapped. She was in tears. Combovibes made it so easy!"',
    rating: 5,
    date: "March 12, 2026",
  },
  {
    id: 2,
    user: "Arjun M.",
    content: `"Sent a surprise cake to my girlfriend for our anniversary. The delivery was on time, the cake was delicious, and the gift message card was a lovely touch. Will definitely order again!"`,
    rating: 5,
    date: "February 14, 2026",
  },
  {
    id: 3,
    user: "Neha R.",
    content: `"The chocolate hamper I ordered for Diwali was packaged so beautifully. Everyone in the family loved it. The quality was premium and the price was very reasonable."`,
    rating: 5,
    date: "October 30, 2025",
  },
  {
    id: 4,
    user: "Rohit K.",
    content: `"I was skeptical about same-day delivery, but Combovibes delivered! Ordered at noon and the bouquet reached my wife by evening. She was absolutely delighted. 10/10!"`,
    rating: 5,
    date: "January 7, 2026",
  },
  {
    id: 5,
    user: "Ananya P.",
    content: `"The gift hamper I selected for my best friend's baby shower was a huge hit. The packaging was premium and everything inside was thoughtfully curated. Love this platform!"`,
    rating: 5,
    date: "April 3, 2026",
  },
  {
    id: 6,
    user: "Vikram D.",
    content: `"Been using Combovibes for all my gifting needs for the past year. Never disappointed. The variety is great, the delivery is reliable, and customer support is always helpful."`,
    rating: 5,
    date: "May 22, 2026",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListSec
          title="NEW ARRIVALS"
          data={newArrivalsData}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="BESTSELLERS"
            data={topSellingData}
            viewAllLink="/shop#bestsellers"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        <Reviews data={reviewsData} />
      </main>
    </>
  );
}
