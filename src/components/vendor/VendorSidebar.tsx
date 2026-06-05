"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, IndianRupee, Settings, LogOut, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/vendor", icon: LayoutDashboard },
  { label: "My Orders", href: "/vendor/orders", icon: ShoppingBag },
  { label: "Earnings", href: "/vendor/earnings", icon: IndianRupee },
  { label: "Settings", href: "/vendor/settings", icon: Settings },
];

export function VendorSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-background border-r border-border min-h-screen sticky top-0">
      <div className="p-5 border-b border-border">
        <Link href="/vendor" className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span className="font-playfair font-bold text-primary">Vendor</span>
        </Link>
        <p className="text-[10px] text-muted-foreground mt-0.5">Combovibes Partner Portal</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <Icon className="h-4 w-4 shrink-0" />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
          <LogOut className="h-4 w-4" />Back to Store
        </Link>
      </div>
    </aside>
  );
}
