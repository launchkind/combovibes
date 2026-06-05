import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  emoji: string;
  price: number;
  variant: string;
  quantity: number;
  giftMessage?: string;
  deliveryDate?: string;
};

type CartState = {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateGiftMessage: (id: string, message: string) => void;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
};

const VALID_COUPONS: Record<string, number> = {
  FIRST10: 10,
  SAVE20: 20,
  COMBO15: 15,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variant === item.variant
        );
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          set((s) => ({
            items: [
              ...s.items,
              { ...item, id: `${item.productId}-${item.variant}-${Date.now()}` },
            ],
          }));
        }
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      updateGiftMessage: (id, giftMessage) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, giftMessage } : i)),
        })),

      applyCoupon: (code) => {
        const discount = VALID_COUPONS[code.toUpperCase()];
        if (!discount) return "Invalid coupon code";
        set({ couponCode: code.toUpperCase(), couponDiscount: discount });
        return null;
      },

      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      clearCart: () =>
        set({ items: [], couponCode: "", couponDiscount: 0 }),

      setOpen: (isOpen) => set({ isOpen }),
    }),
    { name: "combovibes-cart" }
  )
);

// Selectors
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const cartTotal = (
  items: CartItem[],
  couponDiscount: number
) => {
  const sub = cartSubtotal(items);
  const delivery = sub >= 999 ? 0 : 99;
  const discount = Math.round((sub * couponDiscount) / 100);
  return { subtotal: sub, delivery, discount, total: sub + delivery - discount };
};
