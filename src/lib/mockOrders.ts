export type MockOrder = {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  deliveryDate: string;
  deliverySlot: string;
  items: { name: string; emoji: string; quantity: number; price: number }[];
  address: { name: string; line1: string; city: string; state: string; pincode: string; phone: string };
  timeline: { status: string; label: string; time: string; done: boolean }[];
};

export const mockOrders: MockOrder[] = [
  {
    id: "ord-1",
    orderNumber: "CV-A1B2C3D4",
    status: "out_for_delivery",
    total: 1298,
    createdAt: "2024-12-15T10:30:00Z",
    deliveryDate: "2024-12-16",
    deliverySlot: "Evening (4–8 PM)",
    items: [
      { name: "Red Roses Bouquet", emoji: "🌹", quantity: 1, price: 799 },
      { name: "Chocolate Truffle Cake", emoji: "🎂", quantity: 1, price: 499 },
    ],
    address: { name: "Priya Sharma", line1: "Flat 4B, Sunshine Apartments, MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "9876543210" },
    timeline: [
      { status: "confirmed", label: "Order Confirmed", time: "Dec 15, 10:32 AM", done: true },
      { status: "processing", label: "Being Prepared", time: "Dec 15, 2:00 PM", done: true },
      { status: "shipped", label: "Picked Up", time: "Dec 16, 11:00 AM", done: true },
      { status: "out_for_delivery", label: "Out for Delivery", time: "Dec 16, 3:15 PM", done: true },
      { status: "delivered", label: "Delivered", time: "Expected by 8 PM", done: false },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "CV-E5F6G7H8",
    status: "delivered",
    total: 2499,
    createdAt: "2024-12-10T14:00:00Z",
    deliveryDate: "2024-12-11",
    deliverySlot: "Morning (8 AM–12 PM)",
    items: [
      { name: "Premium Gift Hamper", emoji: "📦", quantity: 1, price: 2499 },
    ],
    address: { name: "Rahul Mehta", line1: "12, Park Street", city: "Mumbai", state: "Maharashtra", pincode: "400001", phone: "9123456780" },
    timeline: [
      { status: "confirmed", label: "Order Confirmed", time: "Dec 10, 2:05 PM", done: true },
      { status: "processing", label: "Being Prepared", time: "Dec 10, 6:00 PM", done: true },
      { status: "shipped", label: "Picked Up", time: "Dec 11, 7:30 AM", done: true },
      { status: "out_for_delivery", label: "Out for Delivery", time: "Dec 11, 9:00 AM", done: true },
      { status: "delivered", label: "Delivered", time: "Dec 11, 11:45 AM", done: true },
    ],
  },
];
