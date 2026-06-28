"use client";

import { useState } from "react";

export default function BannerToggle({ id, isActive: initial }: { id: string; isActive: boolean }) {
  const [isActive, setIsActive] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    setLoading(true);
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive }),
    });
    setLoading(false);
    if (res.ok) setIsActive(!isActive);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={isActive ? "Click to deactivate" : "Click to activate"}
      className={`px-2 py-0.5 rounded text-[10px] font-bold shadow transition-colors ${
        isActive ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
      } ${loading ? "opacity-50" : "hover:opacity-90"}`}
    >
      {loading ? "…" : isActive ? "Live" : "Off"}
    </button>
  );
}
