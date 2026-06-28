import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";

export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "Valentine Special Combo",
    srcUrl: "/images/pic1.png",
    gallery: ["/images/pic1.png", "/images/pic10.png", "/images/pic11.png"],
    price: 699,
    discount: { amount: 0, percentage: 50 },
    rating: 4.5,
    badge: "best-seller",
    reviewCount: 128,
  },
  {
    id: 2,
    title: "Women Jewellery Combo",
    srcUrl: "/images/pic2.png",
    gallery: ["/images/pic2.png"],
    price: 649,
    discount: { amount: 0, percentage: 23 },
    rating: 4.8,
    badge: "new",
    reviewCount: 96,
  },
  {
    id: 3,
    title: "Eid Special Gift Combo",
    srcUrl: "/images/pic3.png",
    gallery: ["/images/pic3.png"],
    price: 999,
    discount: { amount: 0, percentage: 45 },
    rating: 4.5,
    badge: "best-seller",
    reviewCount: 87,
  },
  {
    id: 4,
    title: "Hair Accessories Combo",
    srcUrl: "/images/pic4.png",
    gallery: ["/images/pic4.png", "/images/pic10.png", "/images/pic11.png"],
    price: 399,
    discount: { amount: 0, percentage: 50 },
    rating: 4.3,
    badge: "new",
    reviewCount: 73,
  },
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Men Accessories Combo",
    srcUrl: "/images/pic5.png",
    gallery: ["/images/pic5.png", "/images/pic10.png", "/images/pic11.png"],
    price: 999,
    discount: { amount: 0, percentage: 40 },
    rating: 4.7,
    badge: "best-seller",
    reviewCount: 112,
  },
  {
    id: 6,
    title: "Pearl Necklace Set",
    srcUrl: "/images/pic6.png",
    gallery: ["/images/pic6.png", "/images/pic10.png", "/images/pic11.png"],
    price: 799,
    discount: { amount: 0, percentage: 0 },
    rating: 4.9,
    badge: "new",
    reviewCount: 64,
  },
  {
    id: 7,
    title: "Gold Earrings Gift Box",
    srcUrl: "/images/pic7.png",
    gallery: ["/images/pic7.png"],
    price: 549,
    discount: { amount: 0, percentage: 0 },
    rating: 4.6,
    badge: "best-seller",
    reviewCount: 91,
  },
  {
    id: 8,
    title: "Couple Bracelet Combo",
    srcUrl: "/images/pic8.png",
    gallery: ["/images/pic8.png"],
    price: 899,
    discount: { amount: 0, percentage: 22 },
    rating: 4.8,
    badge: "new",
    reviewCount: 55,
  },
];

export const relatedProductData: Product[] = [
  {
    id: 12,
    title: "Scrunchie Gift Set",
    srcUrl: "/images/pic12.png",
    gallery: ["/images/pic12.png", "/images/pic10.png", "/images/pic11.png"],
    price: 299,
    discount: { amount: 0, percentage: 33 },
    rating: 4.4,
    badge: "new",
    reviewCount: 42,
  },
  {
    id: 13,
    title: "Anniversary Jewellery Box",
    srcUrl: "/images/pic13.png",
    gallery: ["/images/pic13.png", "/images/pic10.png", "/images/pic11.png"],
    price: 1199,
    discount: { amount: 0, percentage: 0 },
    rating: 4.9,
    badge: "best-seller",
    reviewCount: 78,
  },
  {
    id: 14,
    title: "Luxury Watch & Wallet Set",
    srcUrl: "/images/pic14.png",
    gallery: ["/images/pic14.png"],
    price: 1499,
    discount: { amount: 0, percentage: 20 },
    rating: 4.7,
    badge: "best-seller",
    reviewCount: 103,
  },
  {
    id: 15,
    title: "Diwali Gift Hamper",
    srcUrl: "/images/pic15.png",
    gallery: ["/images/pic15.png"],
    price: 849,
    discount: { amount: 0, percentage: 0 },
    rating: 4.6,
    badge: "new",
    reviewCount: 67,
  },
];

export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Priya Sharma",
    content:
      "Bahut hi beautiful products! Quality superb hai aur packaging bhi amazing.",
    rating: 5,
    date: "March 12, 2026",
  },
  {
    id: 2,
    user: "Rohan Verma",
    content:
      "Best gift combos! Maine apni girlfriend ke liye order kiya, she loved it 😍",
    rating: 5,
    date: "February 14, 2026",
  },
  {
    id: 3,
    user: "Ananya Dutta",
    content:
      "Fast delivery and premium quality. Combo Vibes is my go-to shopping store now!",
    rating: 5,
    date: "April 3, 2026",
  },
  {
    id: 4,
    user: "Rohit Kumar",
    content:
      "Ordered the men's combo for my brother's birthday. Delivery was super fast and packaging was very nice!",
    rating: 5,
    date: "January 7, 2026",
  },
  {
    id: 5,
    user: "Neha Singh",
    content:
      "The jewellery combo I ordered was exactly as shown. Very beautiful quality and affordable price. Highly recommend!",
    rating: 5,
    date: "May 22, 2026",
  },
  {
    id: 6,
    user: "Arjun Mehta",
    content:
      "Excellent products at the best price. The combo gifts are perfect for any occasion. Will order again!",
    rating: 5,
    date: "April 18, 2026",
  },
];
