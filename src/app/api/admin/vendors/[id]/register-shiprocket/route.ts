import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { addPickupLocation } from "@/lib/shiprocket";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase());
  if (!adminEmails.includes((user.email ?? "").toLowerCase())) return null;
  return user;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin  = createAdminClient();

  const { data: vendor, error } = await admin.from("vendors").select("*").eq("id", id).single();
  if (error || !vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const pickupLocation = `${slugify(vendor.name)}-${vendor.id.slice(0, 6)}`.slice(0, 50);

  try {
    await addPickupLocation({
      pickup_location: pickupLocation,
      name:            vendor.contact_name,
      email:           vendor.email,
      phone:           vendor.phone,
      address:         vendor.address_line1,
      address_2:       vendor.address_line2 ?? undefined,
      city:            vendor.city,
      state:           vendor.state,
      country:         vendor.country,
      pin_code:        vendor.pincode,
    });

    const { data: updated } = await admin
      .from("vendors")
      .update({
        shiprocket_pickup_location_name: pickupLocation,
        shiprocket_registered:           true,
        shiprocket_registered_at:        new Date().toISOString(),
        shiprocket_last_error:           null,
      })
      .eq("id", id)
      .select()
      .single();

    return NextResponse.json({ data: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await admin.from("vendors").update({
      shiprocket_registered: false,
      shiprocket_last_error: msg,
    }).eq("id", id);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
