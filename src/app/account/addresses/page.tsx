import { Metadata } from "next";
import { MapPin, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Addresses</h1>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Address
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-black/20" />
        </div>
        <p className="text-sm font-medium text-black/60">No saved addresses</p>
        <p className="text-xs text-black/40 mt-1">
          Save addresses for faster checkout.
        </p>
      </div>
    </div>
  );
}
