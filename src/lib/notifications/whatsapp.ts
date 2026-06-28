const MSG91_FLOW_URL = "https://api.msg91.com/api/v5/flow/";

interface FlowPayload {
  flow_id: string;
  sender:  string;
  mobiles: string;
  [key: string]: string;
}

async function sendFlow(payload: FlowPayload): Promise<void> {
  try {
    const res = await fetch(MSG91_FLOW_URL, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: process.env.MSG91_AUTH_KEY!,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[whatsapp] MSG91 flow failed:", res.status, text);
    }
  } catch (err) {
    console.error("[whatsapp] sendFlow error:", err);
  }
}

export async function sendOrderConfirmationWhatsApp(params: {
  phone:        string;
  orderNumber:  string;
  senderName:   string;
  deliveryDate: string;
  totalAmount:  number;
}): Promise<void> {
  const flowId = process.env.MSG91_ORDER_CONFIRM_FLOW_ID;
  if (!flowId) {
    console.warn("[whatsapp] MSG91_ORDER_CONFIRM_FLOW_ID not set — skipping WhatsApp notification");
    return;
  }
  await sendFlow({
    flow_id: flowId,
    sender:  process.env.MSG91_SENDER_ID ?? "COMBVB",
    mobiles: `91${params.phone}`,
    VAR1:    params.senderName,
    VAR2:    params.orderNumber,
    VAR3:    params.deliveryDate,
    VAR4:    `₹${params.totalAmount.toLocaleString("en-IN")}`,
  });
}

export async function sendShippedWhatsApp(params: {
  phone:       string;
  orderNumber: string;
  awbCode:     string;
  courierName: string;
  trackingUrl: string;
}): Promise<void> {
  const flowId = process.env.MSG91_SHIPPED_FLOW_ID;
  if (!flowId) {
    console.warn("[whatsapp] MSG91_SHIPPED_FLOW_ID not set — skipping WhatsApp notification");
    return;
  }
  await sendFlow({
    flow_id: flowId,
    sender:  process.env.MSG91_SENDER_ID ?? "COMBVB",
    mobiles: `91${params.phone}`,
    VAR1:    params.orderNumber,
    VAR2:    params.courierName,
    VAR3:    params.awbCode,
    VAR4:    params.trackingUrl,
  });
}
