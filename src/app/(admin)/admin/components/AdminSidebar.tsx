"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Image,
  ShoppingCart,
  Tag,
  Users,
  Settings,
  ChevronRight,
  Layers,
  Star,
  Store,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add Product", href: "/admin/products/new" },
    ],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Layers,
    children: [
      { label: "All Categories", href: "/admin/categories" },
      { label: "Add Category", href: "/admin/categories/new" },
    ],
  },
  {
    label: "Vendors",
    href: "/admin/vendors",
    icon: Store,
    children: [
      { label: "All Vendors", href: "/admin/vendors" },
      { label: "Add Vendor", href: "/admin/vendors/new" },
    ],
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: Image,
    children: [
      { label: "All Banners", href: "/admin/banners" },
      { label: "Add Banner", href: "/admin/banners/new" },
    ],
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
    children: [
      { label: "All Reviews", href: "/admin/reviews" },
      { label: "Add Review", href: "/admin/reviews/new" },
    ],
  },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Coupons", href: "/admin/coupons", icon: Tag, soon: true },
  { label: "Customers", href: "/admin/customers", icon: Users, soon: true },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#1a1a2e] text-white flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#D81B60] flex items-center justify-center text-white font-black text-sm">CV</span>
          <span className="font-bold text-lg">Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.href}>
              <Link
                href={item.soon ? "#" : item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  isActive
                    ? "bg-[#D81B60] text-white"
                    : item.soon
                    ? "text-white/30 cursor-not-allowed"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.soon && (
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">Soon</span>
                )}
                {hasChildren && !item.soon && (
                  <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? "rotate-90" : ""}`} />
                )}
              </Link>

              {/* Sub-items */}
              {hasChildren && isActive && (
                <div className="ml-7 mt-1 space-y-0.5">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                        pathname === child.href
                          ? "text-white bg-white/10"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
