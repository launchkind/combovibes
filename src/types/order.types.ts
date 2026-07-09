export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type DeliverySlot = "morning" | "evening" | "midnight";

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  vendor_id: string | null;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  gift_message: string | null;
  greeting_card: string | null;
  selected_color: string | null;
  selected_size: string | null;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  changed_by: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
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
  delivery_date: string;
  delivery_slot: DeliverySlot;
  gift_message: string | null;
  special_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_status: PaymentStatus;
  cashfree_order_id: string | null;
  cashfree_payment_id: string | null;
  payment_method: string | null;
  paid_at: string | null;
  order_status: OrderStatus;
  shiprocket_order_id: number | null;
  shiprocket_shipment_id: number | null;
  awb_code: string | null;
  courier_name: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  order_status_history?: OrderStatusHistory[];
  shipments?: import("./vendor.types").Shipment[];
}
