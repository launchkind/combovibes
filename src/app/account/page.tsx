"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { ShoppingBag, MapPin, Heart, ChevronRight, Gift, Star } from "lucide-react";

const quickLinks = [
  {
    href: "/account/orders",
    icon: ShoppingBag,
    label: "My Orders",
    description: "Track and manage your orders",
    color: "bg-blue-50 text-blue-500",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    label: "Addresses",
    description: "Manage delivery addresses",
    color: "bg-green-50 text-green-500",
  },
  {
    href: "/account/wishlist",
    icon: Heart,
    label: "Wishlist",
    description: "Saved gifts for later",
    color: "bg-pink-50 text-pink-500",
  },
];

export default function AccountPage() {
  const { displayName, user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Gift className="w-6 h-6 opacity-80" />
          <span className="text-sm font-medium opacity-80">Welcome back</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Hello, {displayName} 👋</h1>
        <p className="text-sm opacity-70">{user?.email}</p>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-3 px-1">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl border border-black/5 p-5 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-sm text-black group-hover:text-red-500 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-black/40 mt-0.5">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent orders placeholder */}
      <div className="bg-white rounded-2xl border border-black/5">
        <div className="flex items-center justify-between p-5 border-b border-black/5">
          <h2 className="font-semibold text-sm">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-black/20" />
          </div>
          <p className="text-sm font-medium text-black/60">No orders yet</p>
          <p className="text-xs text-black/40 mt-1 mb-4">
            Start gifting your loved ones today!
          </p>
          <Link
            href="/shop"
            className="inline-block bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Browse Gifts →
          </Link>
        </div>
      </div>

      {/* Trust badges */}
      <div className="bg-white rounded-2xl border border-black/5 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">Your Combovibes Perks</span>
        </div>
        <p className="text-xs text-black/40 mb-4">Enjoy these benefits with your account</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: "🚀", label: "Same-Day Delivery" },
            { emoji: "🔒", label: "Secure Checkout" },
            { emoji: "🎁", label: "Gift Wrapping" },
            { emoji: "💬", label: "Personal Message" },
          ].map((perk) => (
            <div key={perk.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{perk.emoji}</div>
              <p className="text-xs font-medium text-black/60">{perk.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
