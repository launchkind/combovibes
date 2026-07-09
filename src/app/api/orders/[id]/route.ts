import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/getSessionUser";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id }  = await params;
  const admin   = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .select("*, order_items(*), order_status_history(id, status, note, changed_by, created_at), shipments(id, vendor_name_snapshot, status, courier_name, awb_code, tracking_url)")
    .eq("id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true, referencedTable: "order_status_history" })
    .single();

  if (error || !order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: order });
}
