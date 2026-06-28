"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Initialise session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Redirect to reset-password page when user clicks the reset email link
      if (event === "PASSWORD_RECOVERY") {
        router.push("/auth/reset-password");
      }

      // Cart merge: when user signs in and has guest cart items,
      // persist them to Supabase (Phase 4 will wire this to the DB).
      // The guest cart already lives in localStorage via Zustand persist,
      // so it survives login automatically. Full DB sync added in Phase 4.
      if (event === "SIGNED_IN" && cartItems.length > 0) {
        // TODO(Phase 4): POST /api/cart/merge with cartItems
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setLoading, router, cartItems.length]);

  return <>{children}</>;
}
