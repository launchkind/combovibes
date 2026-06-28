import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "bestseller" | "new" | null
  const limit = parseInt(searchParams.get("limit") ?? "8");

  const admin = createAdminClient();
  let query = admin
    .from("products")
    .select("id, name, slug, base_price, mrp, discount_percent, primary_image_url, badge, is_bestseller, is_new, is_featured, average_rating, review_count, stock_quantity")
    .eq("status", "active")
    .order("sort_order")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (type === "bestseller") query = query.eq("is_bestseller", true);
  if (type === "new") query = query.eq("is_new", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
