"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorSchema, VendorFormValues } from "@/lib/validations/vendor";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterShiprocketButton from "./RegisterShiprocketButton";

type Props = {
  defaultValues?: Partial<VendorFormValues>;
  vendorId?: string;
  shiprocketStatus?: {
    registered:   boolean;
    locationName: string | null;
    registeredAt: string | null;
    lastError:    string | null;
  };
};

export default function VendorForm({ defaultValues, vendorId, shiprocketStatus }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const isEditing = !!vendorId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      country: "India",
      is_active: true,
      ...defaultValues,
    },
  });

  async function onSubmit(values: VendorFormValues) {
    setSaving(true);
    setServerError("");

    const url    = isEditing ? `/api/admin/vendors/${vendorId}` : "/api/admin/vendors";
    const method = isEditing ? "PUT" : "POST";

    const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setServerError(typeof json.error === "string" ? json.error : "Something went wrong. Please try again.");
      return;
    }

    router.push("/admin/vendors");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Vendor Details</h3>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Shop Name *</label>
          <input
            {...register("name")}
            placeholder="e.g. Rosewood Gifts"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Name *</label>
            <input
              {...register("contact_name")}
              placeholder="Owner / manager name"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
            {errors.contact_name && <p className="text-xs text-red-500 mt-1">{errors.contact_name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="10-digit mobile"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
          <input
            {...register("email")}
            type="email"
            placeholder="vendor@example.com"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 1 *</label>
          <input
            {...register("address_line1")}
            placeholder="Shop/building no., street"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
          />
          {errors.address_line1 && <p className="text-xs text-red-500 mt-1">{errors.address_line1.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 2</label>
          <input
            {...register("address_line2")}
            placeholder="Landmark, area (optional)"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
            <input
              {...register("city")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
            <input
              {...register("state")}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
            <input
              {...register("pincode")}
              maxLength={6}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
            {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-1">
          <input type="checkbox" {...register("is_active")} className="w-4 h-4 accent-[#D81B60]" />
          <span className="text-sm text-gray-700">Active (can be assigned to products)</span>
        </label>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-[#D81B60] hover:bg-[#C2185B] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEditing ? "Update Vendor" : "Create Vendor"}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Shiprocket Pickup Location</h3>
          {shiprocketStatus?.registered ? (
            <div className="space-y-1">
              <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Registered</span>
              <p className="text-sm text-gray-700">Pickup location: <strong>{shiprocketStatus.locationName}</strong></p>
              {shiprocketStatus.registeredAt && (
                <p className="text-xs text-gray-400">Registered {new Date(shiprocketStatus.registeredAt).toLocaleString("en-IN")}</p>
              )}
            </div>
          ) : (
            <>
              <span className="inline-block text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Not registered</span>
              {shiprocketStatus?.lastError && (
                <p className="text-xs text-red-500">{shiprocketStatus.lastError}</p>
              )}
              <RegisterShiprocketButton vendorId={vendorId!} />
            </>
          )}
        </div>
      )}
    </form>
  );
}
