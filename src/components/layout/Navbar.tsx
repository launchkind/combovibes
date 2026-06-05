"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchPalette } from "@/components/search/SearchPalette";
import { useCartStore } from "@/store/cartStore";

const categories = [
  { label: "Flowers", href: "/category/flowers" },
  { label: "Cakes", href: "/category/cakes" },
  { label: "Combos", href: "/category/combos" },
  { label: "Chocolates", href: "/category/chocolates" },
  { label: "Plants", href: "/category/plants" },
  { label: "Personalised", href: "/category/personalised" },
];

const occasions = [
  { label: "Birthday", href: "/occasion/birthday" },
  { label: "Anniversary", href: "/occasion/anniversary" },
  { label: "Wedding", href: "/occasion/wedding" },
  { label: "Valentine's Day", href: "/occasion/valentines" },
  { label: "Mother's Day", href: "/occasion/mothers-day" },
  { label: "Diwali", href: "/occasion/diwali" },
];

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="font-playfair text-2xl font-bold text-primary tracking-tight">
              Combovibes
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavDropdown label="Categories" items={categories} />
            <NavDropdown label="Occasions" items={occasions} />
            <Link
              href="/same-day-delivery"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-primary/5",
                pathname === "/same-day-delivery" ? "text-primary" : "text-foreground"
              )}
            >
              Same Day
            </Link>
            <Link
              href="/international"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-primary/5",
                pathname === "/international" ? "text-primary" : "text-foreground"
              )}
            >
              International
            </Link>
          </nav>

          {/* Search trigger (desktop) */}
          <button
            onClick={() => setSearchPaletteOpen(true)}
            className="hidden md:flex flex-1 max-w-sm items-center gap-2 bg-muted/50 hover:bg-muted rounded-lg px-3 h-9 text-sm text-muted-foreground transition-colors"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Search gifts, flowers, cakes...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 text-[10px]">
              ⌘K
            </kbd>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchPaletteOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/account" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            <button
              onClick={() => useCartStore.getState().setOpen(true)}
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <MobileMenu onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
      <SearchPalette open={searchPaletteOpen} onClose={() => setSearchPaletteOpen(false)} />
    </header>
  );
}

function NavDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-primary/5">
        {label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-48 bg-background rounded-lg shadow-card-hover border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="font-playfair text-xl font-bold text-primary">Combovibes</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <MobileSection
          label="Categories"
          items={categories}
          open={openSection === "categories"}
          onToggle={() => setOpenSection((v) => (v === "categories" ? null : "categories"))}
        />
        <MobileSection
          label="Occasions"
          items={occasions}
          open={openSection === "occasions"}
          onToggle={() => setOpenSection((v) => (v === "occasions" ? null : "occasions"))}
        />
        <Link href="/same-day-delivery" onClick={onClose} className="block px-3 py-2 text-sm font-medium hover:text-primary hover:bg-primary/5 rounded-md">
          Same Day Delivery
        </Link>
        <Link href="/international" onClick={onClose} className="block px-3 py-2 text-sm font-medium hover:text-primary hover:bg-primary/5 rounded-md">
          International
        </Link>
        <Link href="/wishlist" onClick={onClose} className="block px-3 py-2 text-sm font-medium hover:text-primary hover:bg-primary/5 rounded-md">
          Wishlist
        </Link>
      </nav>
      <div className="p-4 border-t border-border space-y-2">
        <Button className="w-full" asChild>
          <Link href="/auth/login" onClick={onClose}>Sign In</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/register" onClick={onClose}>Create Account</Link>
        </Button>
      </div>
    </div>
  );
}

function MobileSection({
  label,
  items,
  open,
  onToggle,
}: {
  label: string;
  items: { label: string; href: string }[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:text-primary hover:bg-primary/5 rounded-md"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-primary rounded-md hover:bg-primary/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
