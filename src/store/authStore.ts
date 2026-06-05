import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, session: null, isLoading: false }),
}));
