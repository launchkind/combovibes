"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  title: string;
  price: number;
  srcUrl: string;
};

type WishlistState = {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set((state) => ({
          items: exists
            ? state.items.filter((i) => i.id !== item.id)
            : [...state.items, item],
        }));
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "combovibes-wishlist",
    }
  )
);
