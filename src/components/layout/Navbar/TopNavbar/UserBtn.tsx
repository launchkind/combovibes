"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { User, LogOut, ShoppingBag, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserBtn() {
  const { isAuthenticated, displayName, logout, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Always render the same thing on server and first client paint
  if (!mounted || isLoading) {
    return (
      <div className="w-[22px] h-[22px] rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="p-1" aria-label="Sign in">
        <User className="w-[22px] h-[22px] text-black/70 hover:text-black transition-colors" />
      </Link>
    );
  }

  const initial = displayName[0]?.toUpperCase() ?? "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Account menu"
      >
        <div className="w-[22px] h-[22px] rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
          {initial}
        </div>
        <ChevronDown className="w-3 h-3 text-black/40" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-black/10 border border-black/5 py-1 z-50">
          <div className="px-4 py-2.5 border-b border-black/5">
            <p className="text-xs font-semibold truncate">{displayName}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-black/70 hover:bg-gray-50 hover:text-black transition-colors"
          >
            <User className="w-4 h-4" />
            My Account
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-black/70 hover:bg-gray-50 hover:text-black transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            My Orders
          </Link>
          <button
            onClick={() => { setOpen(false); logout(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
