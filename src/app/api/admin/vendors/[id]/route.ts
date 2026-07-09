import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { vendorSchema } from "@/lib/validations/vendor";

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from("vendors").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = vendorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing } = await admin.from("vendors").select("is_active").eq("id", id).single();

  const { data, error } = await admin
    .from("vendors")
    .update(parsed.data) // shiprocket_* fields are not part of vendorSchema — never client-writable here
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-unpublish this vendor's active products when it's deactivated
  if (existing?.is_active && !parsed.data.is_active) {
    await admin
      .from("products")
      .update({ status: "draft" })
      .eq("vendor_id", id)
      .eq("status", "active");
  }

  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();

  const { count } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", id);

  if (count && count > 0) {
    return NextResponse.json(
      { error: "Vendor has products, cannot delete. Deactivate the vendor instead." },
      { status: 409 }
    );
  }

  const { error } = await admin.from("vendors").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
