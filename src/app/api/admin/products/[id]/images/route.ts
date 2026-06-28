import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
  const { data, error } = await admin
    .from("product_images")
    .select("id, url, alt_text, sort_order, is_primary")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// POST body: { urls: string[] }
// Replaces all images for the product, syncs primary_image_url on products table
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const urls: string[] = Array.isArray(body.urls) ? body.urls : [];

  const admin = createAdminClient();

  // Delete all existing images for this product
  await admin.from("product_images").delete().eq("product_id", id);

  // Insert new images
  if (urls.length > 0) {
    const rows = urls.map((url, i) => ({
      product_id: id,
      url,
      sort_order: i,
      is_primary: i === 0,
    }));
    const { error: insertError } = await admin.from("product_images").insert(rows);
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Keep primary_image_url in sync with the first image
  const primaryUrl = urls[0] ?? null;
  await admin.from("products").update({ primary_image_url: primaryUrl }).eq("id", id);

  return NextResponse.json({ success: true });
}
