export type VendorOrderItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  items: { name: string; emoji: string; quantity: number }[];
  deliveryDate: string;
  deliverySlot: string;
  address: string;
  status: "assigned" | "accepted" | "preparing" | "ready" | "picked_up" | "delivered";
  earnings: number;
};

export const mockVendorOrders: VendorOrderItem[] = [
  {
    id: "vord-1",
    orderNumber: "CV-A1B2C3D4",
    customerName: "Priya Sharma",
    items: [{ name: "Red Roses Bouquet", emoji: "🌹", quantity: 1 }, { name: "Chocolate Cake", emoji: "🎂", quantity: 1 }],
    deliveryDate: "Today",
    deliverySlot: "Evening (4–8 PM)",
    address: "Flat 4B, MG Road, Bengaluru 560001",
    status: "preparing",
    earnings: 720,
  },
  {
    id: "vord-2",
    orderNumber: "CV-E5F6G7H8",
    customerName: "Rahul Mehta",
    items: [{ name: "Premium Gift Hamper", emoji: "📦", quantity: 1 }],
    deliveryDate: "Tomorrow",
    deliverySlot: "Morning (8 AM–12 PM)",
    address: "12, Park Street, Mumbai 400001",
    status: "accepted",
    earnings: 2249,
  },
  {
    id: "vord-3",
    orderNumber: "CV-I9J0K1L2",
    customerName: "Ananya Singh",
    items: [{ name: "Flower & Chocolate Combo", emoji: "🎁", quantity: 2 }],
    deliveryDate: "Dec 20",
    deliverySlot: "Afternoon (12–4 PM)",
    address: "88, Civil Lines, Delhi 110001",
    status: "assigned",
    earnings: 1170,
  },
];

export const statusFlow: Record<string, string> = {
  assigned: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "picked_up",
  picked_up: "delivered",
};

export const statusLabels: Record<string, string> = {
  assigned: "Assigned",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  picked_up: "Picked Up",
  delivered: "Delivered",
};
