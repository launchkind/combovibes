"use client";

import { useState } from "react";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  orderId:     string;
  disabled:    boolean;
  disabledMsg: string;
}

export default function ShipButton({ orderId, disabled, disabledMsg }: Props) {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const router = useRouter();

  async function handleShip() {
    if (!confirm("Create a Shiprocket shipment for this order?")) return;
    setLoading(true);
    setError("");

    const res  = await fetch(`/api/admin/orders/${orderId}/ship`, { method: "POST" });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to create shipment");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  if (disabled) {
    return (
      <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
        <Truck className="w-4 h-4" /> Create Shipment
        <span className="text-xs ml-1">({disabledMsg})</span>
      </button>
    );
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg">
        <CheckCircle2 className="w-4 h-4" /> Shipment Created!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleShip}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
        {loading ? "Creating Shipment…" : "Create Shiprocket Shipment"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
