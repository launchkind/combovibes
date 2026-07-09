import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import VendorForm from "../../components/VendorForm";
import type { Vendor } from "@/types/vendor.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Vendor" };

export default async function EditVendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("vendors").select("*").eq("id", id).single();

  if (error || !data) notFound();

  const v = data as Vendor;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Edit Vendor</h1>
        <p className="text-sm text-gray-500">{v.name}</p>
      </div>
      <VendorForm
        vendorId={id}
        defaultValues={{
          name:          v.name,
          contact_name:  v.contact_name,
          phone:         v.phone,
          email:         v.email,
          address_line1: v.address_line1,
          address_line2: v.address_line2 ?? undefined,
          city:          v.city,
          state:         v.state,
          pincode:       v.pincode,
          country:       v.country,
          is_active:     v.is_active,
        }}
        shiprocketStatus={{
          registered:   v.shiprocket_registered,
          locationName: v.shiprocket_pickup_location_name,
          registeredAt: v.shiprocket_registered_at,
          lastError:    v.shiprocket_last_error,
        }}
      />
    </div>
  );
}
