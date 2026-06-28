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

export async function GET(request: NextRequest) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page   = parseInt(searchParams.get("page")   ?? "1");
  const limit  = parseInt(searchParams.get("limit")  ?? "20");
  const status = searchParams.get("status") ?? "";
  const search = searchParams.get("search") ?? "";
  const offset = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("orders")
    .select(
      "id, order_number, sender_name, sender_email, recipient_name, delivery_city, delivery_date, delivery_slot, order_status, payment_status, total_amount, awb_code, courier_name, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("order_status", status);
  if (search) query = query.or(`order_number.ilike.%${search}%,sender_name.ilike.%${search}%,sender_email.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count, page, limit });
}
