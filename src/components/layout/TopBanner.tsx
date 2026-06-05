"use client";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "🎁 Free delivery on orders above ₹999 | Use code FIRST10 for 10% off",
  "🌹 Same-day delivery available in 50+ cities across India",
  "💝 Personalise your gifts — add photos, messages & more",
];

export function TopBanner() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  if (!visible) return null;

  const prev = () => setIndex((i) => (i - 1 + messages.length) % messages.length);
  const next = () => setIndex((i) => (i + 1) % messages.length);

  return (
    <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <button onClick={prev} className="shrink-0 opacity-70 hover:opacity-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-center flex-1"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
        <button onClick={next} className="shrink-0 opacity-70 hover:opacity-100">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 opacity-70 hover:opacity-100 ml-2"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
