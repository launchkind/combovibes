"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteVendorButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/vendors/${id}`, { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to delete vendor");
      setConfirming(false);
      return;
    }

    router.refresh();
  }

  if (error) {
    return <p className="text-[11px] text-red-500 max-w-[160px]">{error}</p>;
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 text-[11px] bg-red-500 text-white rounded font-bold disabled:opacity-50"
        >
          {loading ? "…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-[11px] bg-gray-100 text-gray-600 rounded"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      title={`Delete ${name}`}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
