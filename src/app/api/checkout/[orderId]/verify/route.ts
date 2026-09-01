import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPayment } from "@/lib/order-verification";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Reconciles an order against Cashfree and runs fulfillment if it has been paid.
 *
 * This is the return-URL confirmation path: the customer lands back on
 * /checkout/success, which polls here until the payment resolves. It is the
 * only confirmation path that works in sandbox/test mode, where Cashfree
 * cannot deliver a webhook to a local dev server.
 *
 * The order UUID acts as the capability token (it is unguessable and only ever
 * handed to the buyer), and the response carries payment status only — no
 * customer or address data — so no ownership check is required here.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  if (!UUID_RE.test(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const result = await verifyOrderPayment(orderId);

  if (result.error === "Order not found") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderId:       result.orderId,
    orderNumber:   result.orderNumber,
    paymentStatus: result.paymentStatus,
    orderStatus:   result.orderStatus,
    // Surfaced so the client can stop polling on a hard config error instead of
    // spinning for the full window.
    ...(result.error ? { warning: result.error } : {}),
  });
}

/** GET mirrors POST so the endpoint is easy to hit manually while testing. */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ orderId: string }> }
) {
  return POST(req, ctx);
}
