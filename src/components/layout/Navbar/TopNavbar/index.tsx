"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import UserBtn from "./UserBtn";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { usePathname } from "next/navigation";
import { Category } from "@/types/category.types";

type NavLink = {
  label: string;
  href:  string;
  children?: { label: string; href: string }[];
};

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function buildNavLinks(navCategories: Category[]): NavLink[] {
  const shopChildren = navCategories.length > 0
    ? navCategories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }))
    : [{ label: "All Products", href: "/shop" }];

  return [
    { label: "HOME",          href: "/" },
    { label: "SHOP",          href: "/shop",         children: shopChildren },
    {
      label: "COMBO OFFERS",  href: "/shop?type=combo",
      children: [
        { label: "Birthday Combos",    href: "/shop?occasion=birthday" },
        { label: "Anniversary Combos", href: "/shop?occasion=anniversary" },
        { label: "Wedding Combos",     href: "/shop?occasion=wedding" },
        { label: "Festival Combos",    href: "/shop?occasion=festival" },
        { label: "View All Combos",    href: "/shop?type=combo" },
      ],
    },
    { label: "NEW ARRIVALS",  href: "/shop?sort=newest" },
    { label: "ABOUT US",      href: "/about" },
    { label: "CONTACT US",    href: "/contact" },
  ];
}

type Props = { navCategories?: Category[] };

const TopNavbar = ({ navCategories = [] }: Props) => {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [openDropdown,  setOpenDropdown]  = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mounted,       setMounted]       = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const pathname   = usePathname();
  const navLinks   = buildNavLinks(navCategories);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-frame mx-auto px-4 xl:px-0 flex items-center justify-between h-[90px] gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0 py-1">
          <Image
            src="/icons/logo.PNG"
            alt="ComboVibes"
            width={180}
            height={60}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-0.5 px-3 py-2 text-[13px] font-bold tracking-wide transition-colors ${
                    isActive(link.href) ? "text-[#D81B60]" : "text-gray-800 hover:text-[#D81B60]"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 mt-0.5 transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`}
                  />
                </button>
                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-xl py-2 min-w-[210px] z-40">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#D81B60] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-2 text-[13px] font-bold tracking-wide transition-colors ${
                  isActive(link.href) ? "text-[#D81B60]" : "text-gray-800 hover:text-[#D81B60]"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* ── Right icons ── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Search */}
          <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-full hover:bg-pink-50 transition-colors text-gray-700 hover:text-[#D81B60]">
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Wishlist */}
          <Link
            href="/account/wishlist"
            className="hidden sm:relative sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-pink-50 transition-colors text-gray-700 hover:text-[#D81B60]"
          >
            <Heart className="w-[18px] h-[18px]" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D81B60] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-pink-50 transition-colors text-gray-700 hover:text-[#D81B60]"
          >
            <ShoppingCart className="w-[18px] h-[18px]" />
            {mounted && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D81B60] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          <UserBtn />

          {/* WhatsApp Order button */}
          <a
            href="https://wa.me/917810952116"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 ml-2"
          >
            {WA_ICON}
            WhatsApp Order
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-pink-50 transition-colors ml-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => setMobileExpanded((p) => p === link.label ? null : link.label)}
                  className="w-full flex items-center justify-between py-3 text-sm font-bold text-gray-800 border-b border-gray-50"
                >
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === link.label ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === link.label && (
                  <div className="pl-4 pb-1 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-sm text-gray-600 hover:text-[#D81B60] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="block py-3 text-sm font-bold text-gray-800 hover:text-[#D81B60] border-b border-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href="https://wa.me/917810952116"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-3 bg-[#D81B60] text-white text-sm font-bold px-4 py-3 rounded-xl"
          >
            {WA_ICON}
            WhatsApp Order
          </a>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
