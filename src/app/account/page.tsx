"use client";
import { useState } from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const menuItems = [
  { icon: Package, label: "My Orders", href: "/orders", description: "Track and manage your orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", description: "Items you've saved for later" },
  { icon: MapPin, label: "Saved Addresses", href: "/account/addresses", description: "Manage delivery addresses" },
  { icon: Settings, label: "Account Settings", href: "/account/settings", description: "Update profile and preferences" },
];

export default function AccountPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-primary/10 to-cream-100 rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-playfair text-xl font-semibold text-foreground">My Account</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your profile, orders and preferences
          </p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Orders", value: "2" },
          { label: "Wishlist", value: "0" },
          { label: "Addresses", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="bg-background border border-border rounded-xl p-3 text-center">
            <p className="font-bold text-xl text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden mb-4">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              {i < menuItems.length - 1 && <Separator />}
            </div>
          );
        })}
      </div>

      {/* Sign out */}
      <Button
        variant="outline"
        className="w-full rounded-full border-destructive text-destructive hover:bg-destructive/5"
        onClick={handleSignOut}
        disabled={isLoggingOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isLoggingOut ? "Signing out..." : "Sign Out"}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Not signed in?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">Sign in here</Link>
      </p>
    </div>
  );
}
