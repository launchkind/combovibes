import { createAdminClient } from "@/lib/supabase/admin";
import { createCashfreeOrder, getCashfreeEnv } from "@/lib/cashfree";
import { checkoutRequestSchema } from "@/lib/validations/checkout";
import { getSessionUser } from "@/lib/supabase/getSessionUser";
import { NextRequest, NextResponse } from "next/server";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import { hasShippingColumns, SHIPPING_COLUMNS } from "@/lib/shipping-columns";
import type { ShippingDims } from "@/lib/shipping-columns";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const data  = parsed.data;
  const user  = await getSessionUser();
  const admin = createAdminClient();

  // Parcel dimensions are only available once migration 018 has been applied.
  const withDims = await hasShippingColumns(admin);

  // Re-validate product prices + stock from DB
  const productIds = data.items.map((i) => i.id);
  const baseCols = "id, name, base_price, stock_quantity, track_inventory, primary_image_url, status, vendor_id";

  // The select list is built at runtime, so Supabase can't infer the row shape
  // from a string literal — declare it instead.
  type ProductRow = {
    id:                string;
    name:              string;
    base_price:        number;
    stock_quantity:    number;
    track_inventory:   boolean;
    primary_image_url: string | null;
    status:            string;
    vendor_id:         string | null;
  } & Partial<ShippingDims>;

  const { data: dbProducts, error: dbErr } = await admin
    .from("products")
    .select(withDims ? `${baseCols}, ${SHIPPING_COLUMNS.join(", ")}` : baseCols)
    .in("id", productIds)
    .eq("status", "active")
    .returns<ProductRow[]>();

  if (dbErr || !dbProducts) {
    return NextResponse.json({ error: "Failed to verify products" }, { status: 500 });
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  type OrderItemInsert = {
    product_id: string;
    vendor_id: string | null;
    product_name: string;
    product_image: string | null;
    unit_price: number;
    quantity: number;
    gift_message?: string;
    greeting_card?: string;
    selected_color?: string;
    selected_size?: string;
  } & Partial<ShippingDims>;

  const orderItems: OrderItemInsert[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.id);
    if (!product) {
      return NextResponse.json(
        { error: `Product not found or unavailable`, productId: item.id },
        { status: 422 }
      );
    }
    if (product.track_inventory && product.stock_quantity < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for "${product.name}"`, productId: item.id },
        { status: 422 }
      );
    }
    orderItems.push({
      product_id:    item.id,
      vendor_id:     product.vendor_id,
      product_name:  product.name,
      product_image: product.primary_image_url ?? null,
      unit_price:    Number(product.base_price),
      quantity:      item.quantity,
      gift_message:  item.giftMessage,
      greeting_card: item.greetingCard,
      selected_color: item.selectedColor,
      selected_size:  item.selectedSize,
      // Only snapshot dimensions when the columns exist on both tables.
      ...(withDims
        ? {
            weight_kg:  product.weight_kg  ?? null,
            length_cm:  product.length_cm  ?? null,
            breadth_cm: product.breadth_cm ?? null,
            height_cm:  product.height_cm  ?? null,
          }
        : {}),
    });
  }

  const subtotal    = orderItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD
    ? 0
    : Number(process.env.NEXT_PUBLIC_DELIVERY_FEE ?? 0);
  const totalAmount = subtotal + deliveryFee;

  // Create the order record
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      user_id:              user?.id ?? null,
      sender_name:          data.sender_name,
      sender_email:         data.sender_email,
      sender_phone:         data.sender_phone,
      recipient_name:       data.recipient_name,
      recipient_phone:      data.recipient_phone,
      delivery_line1:       data.delivery_line1,
      delivery_line2:       data.delivery_line2 ?? null,
      delivery_city:        data.delivery_city,
      delivery_state:       data.delivery_state,
      delivery_pincode:     data.delivery_pincode,
      delivery_date:        data.delivery_date,
      delivery_slot:        data.delivery_slot,
      gift_message:         data.gift_message ?? null,
      special_instructions: data.special_instructions ?? null,
      subtotal,
      delivery_fee:         deliveryFee,
      total_amount:         totalAmount,
      payment_status:       "pending",
      order_status:         "pending",
    })
    .select("id, order_number")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  // Insert order items
  const { error: itemsErr } = await admin
    .from("order_items")
    .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

  if (itemsErr) {
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
  }

  // Insert initial status history
  await admin.from("order_status_history").insert({
    order_id:   order.id,
    status:     "pending",
    note:       "Order created",
    changed_by: "system",
  });

  // Create Cashfree payment session
  const siteUrl   = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const returnUrl = `${siteUrl}/checkout/success?order_id=${order.id}`;

  // Cashfree rejects a notify_url it can't reach from the public internet, which
  // would fail order creation outright during local testing. Omit it there — the
  // return-URL verification path confirms the payment instead.
  const isLocal   = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(siteUrl);
  const notifyUrl = isLocal ? undefined : `${siteUrl}/api/webhook/cashfree`;

  let paymentSessionId: string;
  let cfOrderId: string;

  try {
    const cf = await createCashfreeOrder({
      orderId:       order.id,
      orderAmount:   totalAmount,
      customerName:  data.sender_name,
      customerEmail: data.sender_email,
      customerPhone: data.sender_phone,
      returnUrl,
      notifyUrl,
    });
    paymentSessionId = cf.payment_session_id;
    cfOrderId        = cf.cf_order_id;
  } catch (err) {
    await admin.from("orders").delete().eq("id", order.id);
    console.error("[checkout] Cashfree order creation failed:", err);
    return NextResponse.json(
      {
        error: "Payment session could not be created",
        // Surfaced in dev only so a bad key/mode is obvious instead of silent.
        ...(process.env.NODE_ENV !== "production"
          ? { detail: err instanceof Error ? err.message : String(err) }
          : {}),
      },
      { status: 502 }
    );
  }

  await admin
    .from("orders")
    .update({ cashfree_order_id: cfOrderId })
    .eq("id", order.id);

  return NextResponse.json(
    {
      orderId:     order.id,
      orderNumber: order.order_number,
      paymentSessionId,
      totalAmount,
      // Authoritative SDK mode — NEXT_PUBLIC_CASHFREE_ENV may hold a value the
      // browser SDK doesn't accept (e.g. "development"), so normalise it here.
      cashfreeMode: getCashfreeEnv(),
    },
    { status: 201 }
  );
}
