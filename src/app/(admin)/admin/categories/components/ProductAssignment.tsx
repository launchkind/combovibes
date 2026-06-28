"use client";

import { useState, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";

type AssignedProduct = {
  sort_order: number;
  products: {
    id: string;
    name: string;
    primary_image_url: string | null;
    base_price: number;
    status: string;
  };
};

type AvailableProduct = {
  id: string;
  name: string;
  primary_image_url: string | null;
  base_price: number;
  status: string;
};

export default function ProductAssignment({ categoryId }: { categoryId: string }) {
  const [assigned, setAssigned]   = useState<AssignedProduct[]>([]);
  const [available, setAvailable] = useState<AvailableProduct[]>([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  async function loadAssigned() {
    const res = await fetch(`/api/admin/categories/${categoryId}/products`);
    const json = await res.json();
    setAssigned(json.data ?? []);
  }

  async function loadAvailable() {
    const res = await fetch(`/api/admin/products?limit=100&status=active`);
    const json = await res.json();
    setAvailable(json.data ?? []);
  }

  useEffect(() => { loadAssigned(); loadAvailable(); }, [categoryId]);

  const assignedIds = new Set(assigned.map(a => a.products.id));
  const filtered = available.filter(p =>
    !assignedIds.has(p.id) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  async function addProduct(productId: string) {
    setLoading(true);
    await fetch(`/api/admin/categories/${categoryId}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, sort_order: assigned.length * 10 }),
    });
    await loadAssigned();
    setLoading(false);
  }

  async function removeProduct(productId: string) {
    setLoading(true);
    await fetch(`/api/admin/categories/${categoryId}/products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    await loadAssigned();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Assigned products */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-700">
            Assigned Products ({assigned.length})
          </span>
          <button
            type="button"
            onClick={() => setShowPicker(v => !v)}
            className="flex items-center gap-1 text-xs font-bold text-[#D81B60] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>

        {assigned.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-lg">
            No products assigned. Click "Add Product" to begin.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {assigned.map(({ products: p }) => (
              <div key={p.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5">
                {p.primary_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.primary_image_url} alt={p.name} className="w-8 h-8 rounded object-cover shrink-0" />
                )}
                <span className="flex-1 text-xs font-medium text-gray-800 line-clamp-1">{p.name}</span>
                <span className="text-xs text-gray-400">₹{p.base_price}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(p.id)}
                  disabled={loading}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product picker */}
      {showPicker && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none text-gray-700"
            />
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                {available.length === 0 ? "No active products in database yet." : "No results."}
              </p>
            ) : filtered.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => { addProduct(p.id); setSearch(""); }}
                disabled={loading}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-pink-50 transition-colors text-left disabled:opacity-50"
              >
                {p.primary_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.primary_image_url} alt={p.name} className="w-7 h-7 rounded object-cover shrink-0" />
                )}
                <span className="flex-1 text-xs text-gray-800 line-clamp-1">{p.name}</span>
                <span className="text-xs text-gray-400 shrink-0">₹{p.base_price}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
