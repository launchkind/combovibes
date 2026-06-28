"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/account", label: "Overview", icon: User, exact: true },
  { href: "/account/orders", label: "My Orders", icon: ShoppingBag, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { href: "/account/profile", label: "Profile", icon: User, exact: false },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout, displayName } = useAuth();

  const initial = displayName[0]?.toUpperCase() ?? "U";

  return (
    <aside className="w-full md:w-64 shrink-0">
      {/* User card */}
      <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-red-100 text-red-500 font-bold text-lg flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{displayName}</p>
          <p className="text-xs text-black/40 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {navItems.map((item, i) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/account";
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 text-sm transition-colors",
                i !== 0 && "border-t border-black/5",
                active
                  ? "bg-red-50 text-red-500 font-medium"
                  : "text-black/70 hover:bg-gray-50 hover:text-black"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className={cn("w-3.5 h-3.5 opacity-40", active && "opacity-100")} />
            </Link>
          );
        })}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-sm border-t border-black/5 text-black/50 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
