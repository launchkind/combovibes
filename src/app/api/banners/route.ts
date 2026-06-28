import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placement = searchParams.get("placement") ?? "hero";

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("banners")
    .select("id, title, image_url, mobile_image_url, link_url, link_target, alt_text, cta_text, sort_order")
    .eq("placement", placement)
    .eq("is_active", true)
    .or("valid_from.is.null,valid_from.lte." + new Date().toISOString())
    .or("valid_until.is.null,valid_until.gte." + new Date().toISOString())
    .order("sort_order")
    .limit(10);

  if (error) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: data ?? [] });
}
