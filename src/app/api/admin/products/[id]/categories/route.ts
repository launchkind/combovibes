import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
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

// GET — return category IDs this product belongs to
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("product_categories")
    .select("category_id")
    .eq("product_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map((r) => r.category_id) });
}

// POST — sync categories (delete all existing, insert new set)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { category_ids }: { category_ids: string[] } = await request.json();

  const admin = createAdminClient();

  // Delete existing assignments
  const { error: delError } = await admin.from("product_categories").delete().eq("product_id", id);
  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });

  // Insert new assignments
  if (category_ids && category_ids.length > 0) {
    const rows = category_ids.map((category_id, i) => ({ product_id: id, category_id, sort_order: i * 10 }));
    const { error: insError } = await admin.from("product_categories").insert(rows);
    if (insError) return NextResponse.json({ error: insError.message }, { status: 500 });
  }

  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  return NextResponse.json({ success: true });
}
