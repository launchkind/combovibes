import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Heart,
  ShoppingBag,
  Headphones,
  ArrowLeft,
  ArrowRight,
  Gift,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

const shopLinks = [
  { label: "Women Accessories", href: "/shop?category=women" },
  { label: "Men Accessories", href: "/shop?category=men" },
  { label: "Jewellery", href: "/shop?category=jewellery" },
  { label: "Hair Accessories", href: "/shop?category=hair" },
  { label: "Gift Combos", href: "/shop?category=combos" },
  { label: "New Arrivals", href: "/shop?sort=new" },
  { label: "Best Sellers", href: "/shop?sort=bestselling" },
  { label: "Valentine Special", href: "/shop?occasion=valentine" },
];

const occasionLinks = [
  { label: "Birthday", href: "/shop?occasion=birthday" },
  { label: "Anniversary", href: "/shop?occasion=anniversary" },
  { label: "Wedding", href: "/shop?occasion=wedding" },
  { label: "Love & Romance", href: "/shop?occasion=romance" },
  { label: "Thank You", href: "/shop?occasion=thank-you" },
  { label: "Gift Hampers", href: "/shop?category=hampers" },
  { label: "Festive Gifts", href: "/shop?occasion=festive" },
  { label: "Corporate Gifting", href: "/shop?occasion=corporate" },
];

const helpLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Return & Refund", href: "/refund" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "FAQ", href: "/faq" },
];

const HeartBullet = () => (
  <Heart className="w-2.5 h-2.5 text-[#D81B60] fill-[#D81B60] shrink-0" />
);

const FooterList = ({ items }: { items: { label: string; href: string }[] }) => (
  <ul className="space-y-1 sm:space-y-2.5">
    {items.map((l) => (
      <li key={l.label}>
        <Link
          href={l.href}
          className="flex items-center gap-2 py-1 sm:py-0 text-[13px] text-gray-600 hover:text-[#D81B60] transition-colors"
        >
          <HeartBullet />
          {l.label}
        </Link>
      </li>
    ))}
  </ul>
);

async function getFooterSettings() {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_settings")
      .select("key, value")
      .in("key", ["address", "phone", "email", "whatsapp", "instagram_url", "footer_tagline"]);
    const map: Record<string, string> = {};
    data?.forEach((row) => { map[row.key] = row.value; });
    return map;
  } catch {
    return {} as Record<string, string>;
  }
}

const Footer = async () => {
  const settings = await getFooterSettings();

  const address = settings.address ?? "Islampur, West Bengal";
  const phone = settings.phone ?? "7810952116";
  const email = settings.email ?? "bussniseatau1@gmail.com";
  const whatsapp = settings.whatsapp ?? "917810952116";
  const instagramUrl = settings.instagram_url ?? "https://instagram.com";

  return (
    <footer className="relative bg-white overflow-hidden">
      {/* Scattered hearts — top-left, over the white area */}
      <Heart className="hidden sm:block absolute z-10 top-6 left-14 w-4 h-4 text-[#F8BBD0] fill-[#F8BBD0] -rotate-12" />
      <Heart className="absolute z-10 top-16 left-6 w-3.5 h-3.5 text-[#F48FB1] fill-[#F48FB1] rotate-6" />
      <Heart className="absolute z-10 top-24 left-16 w-5 h-5 text-[#F8BBD0] fill-[#F8BBD0] -rotate-6" />

      {/* Dashed heart + squiggle leading toward the teddy */}
      <svg
        className="hidden md:block absolute z-10 top-10 left-[52%] w-14 h-14 text-[#F48FB1]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeDasharray="2.5 3"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg
        className="hidden md:block absolute z-10 top-16 left-[58%] w-64 h-20 text-[#F8BBD0]"
        viewBox="0 0 260 80"
        fill="none"
      >
        <path
          d="M0,45 C60,85 140,0 258,25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          fill="none"
        />
      </svg>
      <Heart className="hidden md:block absolute z-10 top-[4.2rem] right-[13%] w-4 h-4 text-[#F06292] fill-[#F06292]" />

      {/* Teddy bear holding a heart — top right */}
      <div className="absolute z-20 -top-6 right-3 sm:right-8 md:right-16 w-28 sm:w-36 md:w-48 pointer-events-none select-none">
        <svg viewBox="0 0 200 220" className="w-full h-auto drop-shadow-sm rotate-3">
          <ellipse cx="70" cy="205" rx="16" ry="9" fill="#C9986B" />
          <ellipse cx="130" cy="205" rx="16" ry="9" fill="#C9986B" />
          <ellipse cx="100" cy="160" rx="58" ry="52" fill="#DDB48B" />
          <ellipse cx="100" cy="168" rx="34" ry="30" fill="#EFD9BC" />
          <ellipse cx="52" cy="145" rx="19" ry="30" fill="#DDB48B" transform="rotate(-18 52 145)" />
          <ellipse cx="148" cy="145" rx="19" ry="30" fill="#DDB48B" transform="rotate(18 148 145)" />
          <circle cx="58" cy="48" r="21" fill="#DDB48B" />
          <circle cx="142" cy="48" r="21" fill="#DDB48B" />
          <circle cx="58" cy="48" r="10" fill="#EFD9BC" />
          <circle cx="142" cy="48" r="10" fill="#EFD9BC" />
          <circle cx="100" cy="72" r="44" fill="#DDB48B" />
          <ellipse cx="100" cy="86" rx="22" ry="17" fill="#EFD9BC" />
          <circle cx="86" cy="66" r="3.5" fill="#4A3626" />
          <circle cx="114" cy="66" r="3.5" fill="#4A3626" />
          <ellipse cx="100" cy="80" rx="6" ry="4.5" fill="#4A3626" />
          <path d="M100,84 v5 M100,89 q-7,6 -13,2 M100,89 q7,6 13,2" stroke="#4A3626" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path
            d="M100 150 C92 140 72 141 70 156 C68 170 84 182 100 196 C116 182 132 170 130 156 C128 141 108 140 100 150Z"
            fill="#EC4899"
          />
          <path d="M84 158 C90 154 96 156 100 162" stroke="#FBCFE8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Wave transition + pink panel */}
      <div className="relative">
        <svg
          className="block w-full h-16 sm:h-24 md:h-28 -mb-px"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 C240,190 480,10 720,70 C960,120 1200,0 1440,50 L1440,200 L0,200 Z"
            fill="#FFE3ED"
          />
        </svg>

        <div className="bg-gradient-to-b from-[#FFE3ED] to-[#FFD9E7]">
          <div className="max-w-frame mx-auto px-4 sm:px-6 md:px-8 xl:px-0 pt-6 md:pt-10 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-10">

              {/* Brand */}
              <div className="lg:col-span-1">
                <Gift className="w-8 h-8 text-[#D81B60] mb-2" strokeWidth={1.5} />
                <span
                  className="block text-3xl text-[#D81B60] mb-1"
                  style={{ fontFamily: "var(--font-dancing-script)" }}
                >
                  Combo<span className="text-black">Vibes</span>
                </span>
                <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-4">
                  <Heart className="w-3 h-3 text-[#D81B60] fill-[#D81B60]" />
                  Style Meets Gifting
                  <Heart className="w-3 h-3 text-[#D81B60] fill-[#D81B60]" />
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-5 max-w-[220px]">
                  Premium gift combos for every vibe, for every occasion.
                </p>

                <div className="relative flex items-center mb-4">
                  <Heart className="absolute left-1/2 -translate-x-1/2 -top-3 w-2.5 h-2.5 text-[#D81B60] fill-[#D81B60]" />
                  <ArrowLeft className="w-3 h-3 text-[#D81B60] shrink-0" />
                  <span className="flex-1 border-t border-dashed border-[#F48FB1] mx-2" />
                  <span className="text-[11px] font-bold tracking-widest text-[#D81B60] whitespace-nowrap">
                    FOLLOW US
                  </span>
                  <span className="flex-1 border-t border-dashed border-[#F48FB1] mx-2" />
                  <ArrowRight className="w-3 h-3 text-[#D81B60] shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#F48FB1] hover:bg-[#D81B60] hover:border-[#D81B60] flex items-center justify-center transition-colors group"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#D81B60] group-hover:text-white" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#F48FB1] hover:bg-[#D81B60] hover:border-[#D81B60] flex items-center justify-center transition-colors group"
                  >
                    <Facebook className="w-3.5 h-3.5 text-[#D81B60] group-hover:text-white" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#F48FB1] hover:bg-[#D81B60] hover:border-[#D81B60] flex items-center justify-center transition-colors group"
                  >
                    <Youtube className="w-3.5 h-3.5 text-[#D81B60] group-hover:text-white" />
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#F48FB1] hover:bg-[#D81B60] hover:border-[#D81B60] flex items-center justify-center transition-colors group"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#D81B60] group-hover:fill-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Shop */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-4 h-4 text-[#D81B60]" />
                  <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Shop</h3>
                </div>
                <FooterList items={shopLinks} />
              </div>

              {/* Occasions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-4 h-4 text-[#D81B60]" />
                  <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Occasions</h3>
                </div>
                <FooterList items={occasionLinks} />
              </div>

              {/* Help & Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className="w-4 h-4 text-[#D81B60]" />
                  <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Help &amp; Info</h3>
                </div>
                <FooterList items={helpLinks} />
              </div>

              {/* Contact Us */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-[#D81B60]" />
                  <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Contact Us</h3>
                </div>
                <ul className="space-y-2.5 mb-5">
                  <li className="flex items-start gap-2 text-[13px] text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-[#D81B60] shrink-0 mt-0.5" />
                    {address}
                  </li>
                  <li>
                    <a href={`tel:${phone}`} className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#D81B60] transition-colors">
                      <Phone className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
                      +91 {phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#D81B60] transition-colors break-all">
                      <Mail className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
                      {email}
                    </a>
                  </li>
                </ul>

                <div className="bg-white/70 border border-[#F8BBD0] rounded-2xl p-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="w-8 h-8 rounded-full bg-[#D81B60] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                    <span className="text-[11px] font-bold text-gray-900 tracking-wide">WHATSAPP SUPPORT</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3">Mon - Sun | 10 AM - 9 PM</p>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-[#D81B60] hover:bg-[#C2185B] text-white text-xs font-bold py-2 rounded-lg transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* We Accept */}
            <div className="mt-10 text-center">
              <p className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-gray-700 mb-4">
                <Heart className="w-3 h-3 text-[#D81B60] fill-[#D81B60]" />
                WE ACCEPT
                <Heart className="w-3 h-3 text-[#D81B60] fill-[#D81B60]" />
              </p>
              <div className="flex flex-wrap sm:grid sm:grid-cols-7 gap-2 sm:gap-3 justify-center sm:justify-items-center max-w-[260px] xs:max-w-[280px] sm:max-w-none mx-auto">
                <span className="w-14 sm:w-16 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center">
                  <Image src="/icons/Visa.svg" alt="Visa" width={30} height={11} />
                </span>
                <span className="w-14 sm:w-16 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center">
                  <Image src="/icons/mastercard.svg" alt="Mastercard" width={22} height={14} />
                </span>
                <span className="w-14 sm:w-16 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center font-black text-xs sm:text-[13px] tracking-tight text-gray-800">
                  UPI
                </span>
                <span className="w-14 sm:w-16 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center text-xs sm:text-[13px] font-bold">
                  <span className="text-[#0B4EA2]">Ru</span><span className="text-[#F58220]">Pay</span>
                </span>
                <span className="w-14 sm:w-16 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center text-xs sm:text-[13px] font-bold">
                  <span className="text-[#002E6E]">pay</span><span className="text-[#00BAF2]">tm</span>
                </span>
                <span className="w-16 sm:w-20 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center gap-1 px-1">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#5F259F] text-white text-[7px] sm:text-[8px] font-bold flex items-center justify-center shrink-0">₹</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#5F259F] whitespace-nowrap">PhonePe</span>
                </span>
                <span className="w-14 sm:w-16 h-10 bg-white rounded-lg border border-[#F8BBD0]/60 shadow-sm flex items-center justify-center">
                  <Image src="/icons/googlePay.svg" alt="Google Pay" width={26} height={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider + copyright */}
      <div className="relative bg-[#FFD9E7] pt-4 pb-6 px-4">
        {/* Gift box — bottom left */}
        <div className="hidden md:block absolute -bottom-1 left-4 md:left-10 w-16 md:w-20 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-auto">
            <rect x="18" y="42" width="64" height="48" rx="4" fill="#D81B60" />
            <rect x="18" y="42" width="64" height="14" fill="#C2185B" />
            <rect x="44" y="42" width="12" height="48" fill="#F8BBD0" />
            <path
              d="M50 42 C36 30 26 18 38 12 C48 8 50 28 50 42Z"
              fill="#E8A33D"
            />
            <path
              d="M50 42 C64 30 74 18 62 12 C52 8 50 28 50 42Z"
              fill="#F3B94F"
            />
          </svg>
          <Heart className="absolute -bottom-2 -right-3 w-5 h-5 text-[#F48FB1] fill-[#F48FB1]" />
        </div>

        {/* Hearts — bottom right */}
        <Heart className="hidden md:block absolute bottom-8 right-10 md:right-16 w-7 h-7 text-[#F48FB1] fill-[#F48FB1]" />
        <Heart className="hidden md:block absolute bottom-4 right-4 md:right-8 w-4 h-4 text-[#F8BBD0] fill-[#F8BBD0]" />

        <div className="max-w-frame mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="flex-1 h-px bg-[#F48FB1]/60 max-w-[240px]" />
            <Heart className="w-3.5 h-3.5 text-[#D81B60] fill-[#D81B60] shrink-0" />
            <span className="flex-1 h-px bg-[#F48FB1]/60 max-w-[240px]" />
          </div>
          <p className="text-center text-xs text-gray-700">
            © {new Date().getFullYear()} Combo Vibes. All Rights Reserved.
          </p>
          <p className="text-center text-xs text-gray-600 mt-1">
            Crafted with <span className="text-[#D81B60] font-semibold">Love</span>{" "}
            <Heart className="inline w-3 h-3 text-[#D81B60] fill-[#D81B60] -mt-0.5" />{" "}
            Style Meets Gifting
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
