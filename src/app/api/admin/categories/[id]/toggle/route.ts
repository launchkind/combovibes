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

const ALLOWED_FIELDS = ["show_on_homepage", "show_in_navbar", "show_after_hero", "show_in_occasions", "is_active"] as const;
type ToggleField = typeof ALLOWED_FIELDS[number];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { field, value } = await request.json() as { field: ToggleField; value: boolean };

  if (!ALLOWED_FIELDS.includes(field) || typeof value !== "boolean") {
    return NextResponse.json({ error: "Invalid toggle field" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("categories")
    .update({ [field]: value })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
