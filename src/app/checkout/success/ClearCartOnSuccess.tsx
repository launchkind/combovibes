"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ClearCartOnSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    clearCart();
    sessionStorage.removeItem("cv_order_id");
  }, [clearCart]);
  return null;
}
