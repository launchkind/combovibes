"use client";

import { useState } from "react";
import { PackageCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterShiprocketButton({ vendorId }: { vendorId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister() {
    setLoading(true);
    setError("");

    const res  = await fetch(`/api/admin/vendors/${vendorId}/register-shiprocket`, { method: "POST" });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to register pickup location");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleRegister}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-[#D81B60] hover:bg-[#C2185B] disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
        {loading ? "Registering…" : "Register with Shiprocket"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
