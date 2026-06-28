"use client";

import { useState } from "react";

type Props = { status: string; id: string };

const statusConfig = {
  active:   { label: "Active",   class: "bg-emerald-100 text-emerald-700" },
  draft:    { label: "Draft",    class: "bg-gray-100 text-gray-600" },
  archived: { label: "Archived", class: "bg-red-100 text-red-600" },
};

export default function ProductStatusBadge({ status: initial, id }: Props) {
  const [status, setStatus] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = status === "active" ? "draft" : "active";
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (res.ok) setStatus(next);
  }

  const config = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.draft;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-opacity ${config.class} ${loading ? "opacity-50" : "hover:opacity-80"}`}
      title="Click to toggle status"
    >
      {loading ? "..." : config.label}
    </button>
  );
}
