import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createShiprocketOrder, generateAWB, buildShiprocketPayload } from "@/lib/shiprocket";
import type { Order } from "@/types/order.types";

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

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id }  = await params;
  const admin   = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.payment_status !== "paid") {
    return NextResponse.json({ error: "Order has not been paid" }, { status: 400 });
  }

  if (order.shiprocket_order_id) {
    return NextResponse.json({ error: "Shipment already created" }, { status: 409 });
  }

  try {
    const payload  = buildShiprocketPayload(order as Order);
    const srOrder  = await createShiprocketOrder(payload);
    const awbResult = await generateAWB(srOrder.shipment_id);
    console.log("[ship] AWB assigned:", awbResult);

    const awbCode    = srOrder.awb_code;
    const trackingUrl = awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null;

    const { data: updated } = await admin
      .from("orders")
      .update({
        shiprocket_order_id:    srOrder.order_id,
        shiprocket_shipment_id: srOrder.shipment_id,
        awb_code:               awbCode,
        courier_name:           srOrder.courier_name,
        tracking_url:           trackingUrl,
        order_status:           "processing",
      })
      .eq("id", id)
      .select()
      .single();

    await admin.from("order_status_history").insert({
      order_id:   id,
      status:     "processing",
      note:       `Shipment created via ${srOrder.courier_name}. AWB: ${awbCode}`,
      changed_by: `admin:${user.email}`,
    });

    return NextResponse.json({ data: updated, shiprocket: srOrder });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
