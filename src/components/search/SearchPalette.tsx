"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockProducts } from "@/lib/mockData";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const popular = ["Birthday cake", "Red roses", "Personalised gifts", "Same day delivery", "Anniversary combo"];

export function SearchPalette({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const results = query.length >= 2
    ? mockProducts
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const submit = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-background rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] overflow-hidden border border-border">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Search for gifts, flowers, cakes..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {results.length > 0 ? (
                  <div>
                    <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Products
                    </p>
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          router.push(`/shop/product/${product.slug}`);
                          onClose();
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <span className="text-2xl">{product.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={submit}
                      className="w-full text-center text-sm text-primary py-2 hover:underline"
                    >
                      See all results for &ldquo;{query}&rdquo;
                    </button>
                  </div>
                ) : query.length >= 2 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">No results for &ldquo;{query}&rdquo;</p>
                  </div>
                ) : (
                  <div className="p-2">
                    <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Popular
                    </p>
                    {popular.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          router.push(`/search?q=${encodeURIComponent(term)}`);
                          onClose();
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground">{term}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
