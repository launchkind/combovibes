import crypto from "crypto";

const CASHFREE_BASE =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const CF_HEADERS = {
  "x-client-id":     process.env.CASHFREE_APP_ID!,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
  "x-api-version":   "2023-08-01",
  "Content-Type":    "application/json",


  
};

export interface CashfreeOrder {
  cf_order_id:        string;
  order_id:           string;
  payment_session_id: string;
  order_status:       string;
}

export async function createCashfreeOrder(params: {
  orderId:       string;
  orderAmount:   number;
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  returnUrl:     string;
}): Promise<CashfreeOrder> {
  const body = {
    order_id:       params.orderId,
    order_amount:   params.orderAmount,
    order_currency: "INR",
    customer_details: {
      customer_id:    params.orderId,
      customer_name:  params.customerName,
      customer_email: params.customerEmail,
      customer_phone: `91${params.customerPhone}`,
    },
    order_meta: {
      return_url:  params.returnUrl,
      notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/cashfree`,
    },
  };

  const res = await fetch(`${CASHFREE_BASE}/orders`, {
    method:  "POST",
    headers: CF_HEADERS,
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Cashfree order creation failed (${res.status}): ${(err as { message?: string }).message ?? JSON.stringify(err)}`
    );
  }

  return res.json() as Promise<CashfreeOrder>;
}

export function verifyCashfreeWebhookSignature(
  rawBody:   string,
  signature: string,
  timestamp: string,
  secret:    string = process.env.CASHFREE_WEBHOOK_SECRET!,
): boolean {
  if (!secret) throw new Error("CASHFREE_WEBHOOK_SECRET is not set");
  const payload  = timestamp + rawBody;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function getCashfreeOrder(cfOrderId: string): Promise<{ order_status: string }> {
  const res = await fetch(`${CASHFREE_BASE}/orders/${cfOrderId}`, {
    headers: CF_HEADERS,
  });
  if (!res.ok) throw new Error("Could not fetch Cashfree order status");
  return res.json() as Promise<{ order_status: string }>;
}
