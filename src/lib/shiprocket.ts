const SR_BASE = "https://apiv2.shiprocket.in/v1/external";

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const res = await fetch(`${SR_BASE}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      email:    process.env.SHIPROCKET_EMAIL!,
      password: process.env.SHIPROCKET_PASSWORD!,
    }),
  });

  if (!res.ok) throw new Error(`Shiprocket auth failed: ${res.status}`);
  const data = await res.json() as { token: string };

  tokenCache = { token: data.token, expiresAt: Date.now() + 23 * 60 * 60 * 1000 };
  return data.token;
}

async function srFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getToken();
  return fetch(`${SR_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
}

export interface ShiprocketOrderPayload {
  order_id:               string;
  order_date:             string;
  pickup_location:        string;
  channel_id:             string;
  comment:                string;
  billing_customer_name:  string;
  billing_last_name:      string;
  billing_address:        string;
  billing_city:           string;
  billing_pincode:        string;
  billing_state:          string;
  billing_country:        string;
  billing_email:          string;
  billing_phone:          string;
  shipping_is_billing:    boolean;
  shipping_customer_name: string;
  shipping_last_name:     string;
  shipping_address:       string;
  shipping_city:          string;
  shipping_pincode:       string;
  shipping_country:       string;
  shipping_state:         string;
  shipping_email:         string;
  shipping_phone:         string;
  order_items: Array<{
    name:          string;
    sku:           string;
    units:         number;
    selling_price: string;
  }>;
  payment_method: "Prepaid";
  sub_total:      number;
  length:         number;
  breadth:        number;
  height:         number;
  weight:         number;
}

export interface ShiprocketOrderResult {
  order_id:     number;
  shipment_id:  number;
  status:       string;
  awb_code:     string;
  courier_name: string;
  label_url:    string;
}

export async function createShiprocketOrder(
  payload: ShiprocketOrderPayload
): Promise<ShiprocketOrderResult> {
  const res = await srFetch("/orders/create/adhoc", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Shiprocket order creation failed: ${JSON.stringify(err)}`);
  }
  return res.json() as Promise<ShiprocketOrderResult>;
}

export async function generateAWB(shipmentId: number, courierId?: number): Promise<unknown> {
  const res = await srFetch("/courier/assign/awb", {
    method: "POST",
    body:   JSON.stringify({
      shipment_id: String(shipmentId),
      ...(courierId ? { courier_id: courierId } : {}),
    }),
  });
  if (!res.ok) throw new Error("Shiprocket AWB assignment failed");
  return res.json();
}

export async function schedulePickup(shipmentIds: number[]): Promise<unknown> {
  const res = await srFetch("/courier/generate/pickup", {
    method: "POST",
    body:   JSON.stringify({ shipment_id: shipmentIds }),
  });
  if (!res.ok) throw new Error("Shiprocket pickup scheduling failed");
  return res.json();
}

export async function trackByAWB(awbCode: string): Promise<unknown> {
  const res = await srFetch(`/courier/track/awb/${awbCode}`);
  if (!res.ok) throw new Error("Shiprocket tracking failed");
  return res.json();
}

export function buildShiprocketPayload(order: {
  order_number: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  recipient_name: string;
  recipient_phone: string;
  delivery_line1: string;
  delivery_line2: string | null;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  gift_message: string | null;
  total_amount: number;
  order_items?: Array<{
    product_id: string | null;
    product_name: string;
    unit_price: number;
    quantity: number;
  }>;
}): ShiprocketOrderPayload {
  const senderFirst = order.sender_name.split(" ")[0];
  const senderLast  = order.sender_name.split(" ").slice(1).join(" ") || "-";
  const recipFirst  = order.recipient_name.split(" ")[0];
  const recipLast   = order.recipient_name.split(" ").slice(1).join(" ") || "-";
  const shipAddr    = order.delivery_line1 + (order.delivery_line2 ? " " + order.delivery_line2 : "");

  return {
    order_id:               order.order_number,
    order_date:             order.created_at,
    pickup_location:        process.env.SHIPROCKET_PICKUP_LOCATION_NAME ?? "Primary",
    channel_id:             "",
    comment:                order.gift_message ?? "",
    billing_customer_name:  senderFirst,
    billing_last_name:      senderLast,
    billing_address:        order.delivery_line1,
    billing_city:           order.delivery_city,
    billing_pincode:        order.delivery_pincode,
    billing_state:          order.delivery_state,
    billing_country:        "India",
    billing_email:          order.sender_email,
    billing_phone:          order.sender_phone,
    shipping_is_billing:    false,
    shipping_customer_name: recipFirst,
    shipping_last_name:     recipLast,
    shipping_address:       shipAddr,
    shipping_city:          order.delivery_city,
    shipping_pincode:       order.delivery_pincode,
    shipping_country:       "India",
    shipping_state:         order.delivery_state,
    shipping_email:         order.sender_email,
    shipping_phone:         order.recipient_phone,
    order_items: (order.order_items ?? []).map((i) => ({
      name:          i.product_name,
      sku:           i.product_id ?? i.product_name.toLowerCase().replace(/\s+/g, "-"),
      units:         i.quantity,
      selling_price: String(i.unit_price),
    })),
    payment_method: "Prepaid",
    sub_total:      order.total_amount,
    length:         15,
    breadth:        15,
    height:         10,
    weight:         0.5,
  };
}
