import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  "Gift Ideas": [
    { label: "Birthday Gifts", href: "/occasion/birthday" },
    { label: "Anniversary Gifts", href: "/occasion/anniversary" },
    { label: "Wedding Gifts", href: "/occasion/wedding" },
    { label: "Corporate Gifts", href: "/corporate" },
    { label: "Personalised Gifts", href: "/category/personalised" },
  ],
  "Categories": [
    { label: "Fresh Flowers", href: "/category/flowers" },
    { label: "Designer Cakes", href: "/category/cakes" },
    { label: "Gift Combos", href: "/category/combos" },
    { label: "Chocolates", href: "/category/chocolates" },
    { label: "Indoor Plants", href: "/category/plants" },
  ],
  "Help": [
    { label: "Track Order", href: "/orders" },
    { label: "FAQs", href: "/faq" },
    { label: "Delivery Info", href: "/delivery" },
    { label: "Return Policy", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Company": [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Vendor Registration", href: "/vendor/register" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-charcoal-600 text-cream-200 mt-16">
      {/* Newsletter */}
      <div className="bg-primary/90 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-playfair text-xl font-semibold text-white">
              Get gifting inspiration &amp; exclusive offers
            </h3>
            <p className="text-white/80 text-sm mt-1">
              Join 50,000+ happy gifters. No spam, unsubscribe anytime.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white max-w-xs"
            />
            <Button variant="secondary" type="submit" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <span className="font-playfair text-2xl font-bold text-primary">Combovibes</span>
            <p className="mt-2 text-sm text-cream-400 leading-relaxed">
              India&apos;s premium gifting destination. Delivering smiles since 2024.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Instagram" className="text-cream-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-cream-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-cream-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-cream-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-cream-100 text-sm mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-charcoal-500" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-cream-500">
          <p>© {new Date().getFullYear()} Combovibes. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs">Secure payments via</span>
            <div className="flex gap-2 items-center">
              <span className="px-2 py-0.5 rounded bg-charcoal-500 text-cream-300 text-xs font-medium">Razorpay</span>
              <span className="px-2 py-0.5 rounded bg-charcoal-500 text-cream-300 text-xs font-medium">UPI</span>
              <span className="px-2 py-0.5 rounded bg-charcoal-500 text-cream-300 text-xs font-medium">Visa</span>
              <span className="px-2 py-0.5 rounded bg-charcoal-500 text-cream-300 text-xs font-medium">Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
