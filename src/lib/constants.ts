export const SITE_NAME = "Combovibes";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SUPPORT_WHATSAPP = "+91-XXXXXXXXXX";

export const CURRENCY = "₹";
export const CURRENCY_CODE = "INR";

export const FREE_DELIVERY_THRESHOLD = 999;
export const SAME_DAY_CUTOFF_HOUR = 14; // 2 PM

export const CITIES_SERVED = 20;
export const HAPPY_CUSTOMERS = 50000;
export const RATING = 4.8;

export const OCCASIONS = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "anniversary", label: "Anniversary", emoji: "💍" },
  { id: "valentines", label: "Valentine's Day", emoji: "❤️" },
  { id: "wedding", label: "Wedding", emoji: "💒" },
  { id: "congratulations", label: "Congratulations", emoji: "🏆" },
  { id: "thank-you", label: "Thank You", emoji: "🙏" },
] as const;

export const RELATIONSHIPS = [
  { id: "him", label: "For Him", emoji: "👨", color: "bg-blue-50" },
  { id: "her", label: "For Her", emoji: "👩", color: "bg-pink-50" },
  { id: "kids", label: "For Kids", emoji: "👶", color: "bg-yellow-50" },
  { id: "friend", label: "For Friend", emoji: "🤝", color: "bg-green-50" },
  { id: "girlfriend", label: "For Girlfriend", emoji: "💕", color: "bg-rose-50" },
  { id: "boyfriend", label: "For Boyfriend", emoji: "💑", color: "bg-purple-50" },
  { id: "wife", label: "For Wife", emoji: "💍", color: "bg-red-50" },
  { id: "parents", label: "For Parents", emoji: "👴", color: "bg-orange-50" },
] as const;

export const GIFT_CATEGORIES = [
  { id: "same-day", label: "Same Day", emoji: "⚡", color: "bg-amber-50" },
  { id: "birthday", label: "Birthday", emoji: "🎂", color: "bg-pink-50" },
  { id: "anniversary", label: "Anniversary", emoji: "💍", color: "bg-purple-50" },
  { id: "flowers", label: "Flowers", emoji: "🌹", color: "bg-red-50" },
  { id: "cakes", label: "Cakes", emoji: "🎂", color: "bg-yellow-50" },
  { id: "chocolates", label: "Chocolates", emoji: "🍫", color: "bg-amber-50" },
  { id: "hampers", label: "Hampers", emoji: "🎁", color: "bg-green-50" },
  { id: "plants", label: "Plants", emoji: "🌿", color: "bg-emerald-50" },
] as const;

export const NAV_CATEGORIES = [
  { label: "Birthday", url: "/shop?category=birthday" },
  { label: "Occasions", url: "/shop?category=occasions" },
  { label: "Anniversary", url: "/shop?category=anniversary" },
  { label: "Flowers", url: "/shop?category=flowers" },
  { label: "Cakes", url: "/shop?category=cakes" },
  { label: "Personalised", url: "/shop?category=personalised" },
  { label: "Chocolates", url: "/shop?category=chocolates" },
  { label: "Hampers", url: "/shop?category=hampers" },
  { label: "Plants", url: "/shop?category=plants" },
  { label: "Same Day", url: "/shop?delivery=same-day", highlight: true },
] as const;
