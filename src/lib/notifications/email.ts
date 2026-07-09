import { Resend } from "resend";
import type { Order } from "@/types/order.types";

const FROM = process.env.FROM_EMAIL ?? "noreply@combovibes.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const SLOT_LABELS: Record<string, string> = {
  morning:  "8 AM – 12 PM",
  evening:  "4 PM – 8 PM",
  midnight: "10 PM – 12 AM",
};

function buildConfirmationHtml(order: Order): string {
  const itemRows = (order.order_items ?? [])
    .map(
      (i) =>
        `<tr>
           <td style="padding:8px 0;border-bottom:1px solid #f3f3f3;font-size:14px">${i.product_name}</td>
           <td style="text-align:center;padding:8px;font-size:14px">×${i.quantity}</td>
           <td style="text-align:right;padding:8px;font-size:14px">₹${(i.unit_price * i.quantity).toLocaleString("en-IN")}</td>
         </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:#D81B60;padding:28px 24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900">Order Confirmed! 🎁</h1>
        <p style="color:#fce7f3;margin:8px 0 0;font-size:14px">${order.order_number}</p>
      </div>

      <div style="padding:24px">
        <p style="font-size:16px">Hi <strong>${order.sender_name}</strong>,</p>
        <p style="color:#4b5563;font-size:14px">Your gift order has been placed successfully and is being prepared.</p>

        <div style="background:#fdf2f8;border-radius:8px;padding:16px;margin:20px 0">
          <h3 style="margin:0 0 10px;font-size:14px;color:#D81B60;text-transform:uppercase;letter-spacing:0.05em">Delivery Details</h3>
          <p style="margin:4px 0;font-size:14px"><strong>To:</strong> ${order.recipient_name} (${order.recipient_phone})</p>
          <p style="margin:4px 0;font-size:14px"><strong>Address:</strong> ${order.delivery_line1}${order.delivery_line2 ? ", " + order.delivery_line2 : ""}, ${order.delivery_city}, ${order.delivery_state} – ${order.delivery_pincode}</p>
          <p style="margin:4px 0;font-size:14px"><strong>Date:</strong> ${order.delivery_date} &nbsp;|&nbsp; ${SLOT_LABELS[order.delivery_slot] ?? order.delivery_slot}</p>
          ${order.gift_message ? `<p style="margin:8px 0 0;font-size:13px;color:#6b7280;font-style:italic">Gift message: "${order.gift_message}"</p>` : ""}
        </div>

        <h3 style="font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.05em">Items Ordered</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb">
              <th style="text-align:left;padding:8px;font-size:12px;color:#6b7280">ITEM</th>
              <th style="text-align:center;padding:8px;font-size:12px;color:#6b7280">QTY</th>
              <th style="text-align:right;padding:8px;font-size:12px;color:#6b7280">PRICE</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="margin-top:12px;padding-top:12px;border-top:2px solid #1a1a1a;text-align:right">
          ${order.delivery_fee > 0 ? `<p style="margin:2px 0;font-size:13px;color:#6b7280">Delivery fee: ₹${order.delivery_fee.toLocaleString("en-IN")}</p>` : ""}
          <p style="margin:4px 0;font-size:16px;font-weight:900">Total: ₹${order.total_amount.toLocaleString("en-IN")}</p>
        </div>

        <p style="margin-top:24px;font-size:13px;color:#6b7280">
          You'll receive another message when your order is shipped.
          Questions? WhatsApp us or reply to this email.
        </p>
      </div>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  try {
    await getResend().emails.send({
      from:    FROM,
      to:      order.sender_email,
      subject: `Order Confirmed ✅ – ${order.order_number} | Combovibes`,
      html:    buildConfirmationHtml(order),
    });
  } catch (err) {
    console.error("[email] sendOrderConfirmationEmail failed:", err);
  }
}

export async function sendAdminShipmentAlertEmail(params: {
  orderNumber: string;
  vendorName:  string;
  status:      "blocked" | "failed";
  error:       string;
}): Promise<void> {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  if (adminEmails.length === 0) return;

  try {
    await getResend().emails.send({
      from:    FROM,
      to:      adminEmails,
      subject: `⚠️ Shipment ${params.status} — ${params.orderNumber} (${params.vendorName})`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <p>Order <strong>${params.orderNumber}</strong>'s shipment from vendor <strong>${params.vendorName}</strong> is <strong>${params.status}</strong>.</p>
          <p style="color:#4b5563;font-size:14px">${params.error}</p>
          <p style="font-size:13px;color:#6b7280">Check the order in the admin panel to retry.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] sendAdminShipmentAlertEmail failed:", err);
  }
}

export async function sendShippedEmail(order: Order): Promise<void> {
  try {
    const trackingSection = order.tracking_url
      ? `<p style="font-size:14px">Track your package: <a href="${order.tracking_url}" style="color:#D81B60">${order.courier_name}</a> — AWB: <strong>${order.awb_code}</strong></p>`
      : `<p style="font-size:14px">AWB code: <strong>${order.awb_code}</strong> via ${order.courier_name}</p>`;

    await getResend().emails.send({
      from:    FROM,
      to:      order.sender_email,
      subject: `Your gift is on the way! 🚀 – ${order.order_number} | Combovibes`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:#D81B60;padding:28px 24px;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900">Your gift is on the way! 🚀</h1>
          </div>
          <div style="padding:24px">
            <p>Hi <strong>${order.sender_name}</strong>,</p>
            <p style="font-size:14px;color:#4b5563">Order <strong>${order.order_number}</strong> has been shipped and is heading to <strong>${order.recipient_name}</strong>.</p>
            ${trackingSection}
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[email] sendShippedEmail failed:", err);
  }
}
