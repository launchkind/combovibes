import type { ProductCardData } from "@/components/product/ProductCard";

export const mockProducts: ProductCardData[] = [
  { id: "1", name: "Red Roses Bouquet (12 stems)", slug: "red-roses-bouquet", price: 799, originalPrice: 999, rating: 4.8, reviews: 1240, emoji: "🌹", tag: "Bestseller", isSameDay: true },
  { id: "2", name: "Chocolate Truffle Cake (500g)", slug: "chocolate-truffle-cake", price: 649, originalPrice: 799, rating: 4.7, reviews: 890, emoji: "🎂", tag: "Bestseller", deliveryDays: 1 },
  { id: "3", name: "Flower & Chocolate Combo", slug: "flower-chocolate-combo", price: 1299, originalPrice: 1599, rating: 4.9, reviews: 2100, emoji: "🎁", tag: "Top Rated", isSameDay: true },
  { id: "4", name: "Personalised Photo Frame", slug: "photo-frame", price: 599, rating: 4.6, reviews: 450, emoji: "🖼️", deliveryDays: 2 },
  { id: "5", name: "Luxury Chocolate Box (24 pcs)", slug: "luxury-chocolates", price: 899, originalPrice: 1099, rating: 4.8, reviews: 670, emoji: "🍫", isSameDay: true },
  { id: "6", name: "Succulent Plant Gift Set", slug: "succulent-plant", price: 499, rating: 4.5, reviews: 320, emoji: "🪴", deliveryDays: 1 },
  { id: "7", name: "Rose Gold Jewellery Set", slug: "rose-gold-jewellery", price: 1499, originalPrice: 1999, rating: 4.7, reviews: 180, emoji: "💍", tag: "Premium" },
  { id: "8", name: "Teddy Bear Hamper", slug: "teddy-hamper", price: 999, rating: 4.6, reviews: 540, emoji: "🧸", deliveryDays: 1 },
  { id: "9", name: "Dried Flower Wreath", slug: "dried-flower-wreath", price: 1199, rating: 4.8, reviews: 120, emoji: "🌸", tag: "New" },
  { id: "10", name: "Scented Candle Gift Set", slug: "scented-candles", price: 699, rating: 4.7, reviews: 85, emoji: "🕯️", tag: "New", isSameDay: true },
  { id: "11", name: "Spa & Wellness Hamper", slug: "spa-hamper", price: 1799, originalPrice: 2199, rating: 4.9, reviews: 60, emoji: "🧴", tag: "Premium" },
  { id: "12", name: "Handmade Chocolate Assortment", slug: "handmade-chocolates", price: 849, rating: 4.8, reviews: 95, emoji: "🍬", isSameDay: true },
  { id: "13", name: "Minimalist Planter Trio", slug: "minimalist-planters", price: 1299, rating: 4.6, reviews: 45, emoji: "🌿", deliveryDays: 2 },
  { id: "14", name: "Personalised Cushion", slug: "personalised-cushion", price: 799, originalPrice: 999, rating: 4.5, reviews: 200, emoji: "🛋️", tag: "New" },
  { id: "15", name: "Personalised Mug Set (2 pcs)", slug: "personalised-mugs", price: 499, rating: 4.5, reviews: 135, emoji: "☕", isSameDay: true },
  { id: "16", name: "Premium Gift Hamper", slug: "premium-gift-box", price: 2499, originalPrice: 2999, rating: 4.9, reviews: 30, emoji: "📦", tag: "Premium" },
  { id: "17", name: "Mixed Seasonal Bouquet", slug: "mixed-bouquet", price: 549, rating: 4.6, reviews: 780, emoji: "💐", isSameDay: true },
  { id: "18", name: "Butterscotch Cake (1 kg)", slug: "butterscotch-cake", price: 749, rating: 4.7, reviews: 430, emoji: "🍰", deliveryDays: 1 },
  { id: "19", name: "Silver Anklet & Earring Set", slug: "silver-jewellery", price: 1199, originalPrice: 1499, rating: 4.6, reviews: 95, emoji: "✨", tag: "New" },
  { id: "20", name: "Cactus Garden Kit", slug: "cactus-garden", price: 699, rating: 4.4, reviews: 65, emoji: "🌵", deliveryDays: 2 },
  { id: "21", name: "Ferrero Rocher Tower (16 pcs)", slug: "ferrero-tower", price: 1099, originalPrice: 1299, rating: 4.8, reviews: 340, emoji: "🎀", isSameDay: true },
  { id: "22", name: "Love Birds Soft Toy Pair", slug: "love-birds-toy", price: 849, rating: 4.5, reviews: 175, emoji: "🧸", tag: "Bestseller" },
  { id: "23", name: "Orchid Plant in Ceramic Pot", slug: "orchid-plant", price: 1399, originalPrice: 1699, rating: 4.7, reviews: 88, emoji: "🌺", tag: "Premium" },
  { id: "24", name: "Couple Photo Book (20 pages)", slug: "couple-photo-book", price: 999, rating: 4.9, reviews: 210, emoji: "📖", deliveryDays: 3 },
];

export const categories = [
  { label: "All", value: "" },
  { label: "Flowers", value: "flowers" },
  { label: "Cakes", value: "cakes" },
  { label: "Combos", value: "combos" },
  { label: "Chocolates", value: "chocolates" },
  { label: "Plants", value: "plants" },
  { label: "Personalised", value: "personalised" },
  { label: "Jewellery", value: "jewellery" },
  { label: "Soft Toys", value: "soft-toys" },
];

export const sortOptions = [
  { label: "Popularity", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Top Rated", value: "rating" },
];
