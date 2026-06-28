import Link from "next/link";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Combo Offers", href: "/shop?tag=combo" },
  { label: "New Arrivals", href: "/shop?sort=new" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categories = [
  { label: "Women Accessories", href: "/shop?category=women" },
  { label: "Men Accessories", href: "/shop?category=men" },
  { label: "Gift Combos", href: "/shop?category=combos" },
  { label: "Hair Accessories", href: "/shop?category=hair" },
  { label: "Jewellery Sets", href: "/shop?category=jewellery" },
  { label: "Valentine Special", href: "/shop?occasion=valentine" },
];

const information = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Return & Refund", href: "/refund" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "FAQ", href: "/faq" },
];

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
  const phone = settings.phone ?? "9608217057";
  const email = settings.email ?? "bussniseatau1@gmail.com";
  const whatsapp = settings.whatsapp ?? "919608217057";
  const instagramUrl = settings.instagram_url ?? "https://instagram.com";

  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="max-w-frame mx-auto px-4 xl:px-0 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D81B60] to-[#880E4F] flex items-center justify-center text-white font-black text-lg shrink-0">
                CV
              </div>
              <span
                className="text-2xl text-[#D81B60]"
                style={{ fontFamily: "var(--font-dancing-script)" }}
              >
                ComboVibes
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-1 font-medium">
              Style Meets Gifting ✨
            </p>
            <p className="text-gray-500 text-xs leading-relaxed mb-5 max-w-[240px]">
              Jewellery, Men &amp; Women Accessories aur Premium Gift Combos — For Every Vibe, For Everyone.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D81B60] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#D81B60] text-xs transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {categories.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#D81B60] text-xs transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information + Contact */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Information</h3>
              <ul className="space-y-2">
                {information.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-gray-400 hover:text-[#D81B60] text-xs transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-[#D81B60] shrink-0 mt-0.5" />
                  {address}
                </li>
                <li>
                  <a href={`tel:${phone}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D81B60] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
                    {phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D81B60] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
                    {email}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-400">
                  <Instagram className="w-3.5 h-3.5 text-[#D81B60] shrink-0" />
                  Instagram: Combo Vibes
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Combo Vibes. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
