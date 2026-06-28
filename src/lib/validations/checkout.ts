import { z } from "zod";

export const pincodeSchema = z.object({
  pincode: z
    .string()
    .length(6, "Pincode must be 6 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers"),
});

export const recipientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .length(10, "Phone must be 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  address: z.string().min(10, "Please enter a complete address"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  deliveryDate: z.date({ error: "Delivery date is required" }),
  deliverySlot: z.enum(["morning", "evening", "midnight"] as const, {
    error: "Please select a delivery slot",
  }),
  giftMessage: z.string().max(150, "Gift message must be under 150 characters").optional(),
});

export const guestCheckoutSchema = z.object({
  senderName: z.string().min(2, "Your name is required"),
  senderEmail: z.string().email("Please enter a valid email"),
  senderPhone: z.string().length(10, "Phone must be 10 digits"),
  recipient: recipientSchema,
});

export type PincodeInput = z.infer<typeof pincodeSchema>;
export type RecipientInput = z.infer<typeof recipientSchema>;
export type GuestCheckoutInput = z.infer<typeof guestCheckoutSchema>;

// ── API-layer schemas (used by /api/checkout and /api/addresses) ──────────────

export const checkoutItemSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1).max(99),
  giftMessage: z.string().max(150).optional(),
  greetingCard: z.string().max(100).optional(),
  selectedColor: z.string().max(50).optional(),
  selectedSize: z.string().max(50).optional(),
});

export const checkoutRequestSchema = z.object({
  sender_name:  z.string().min(2, "Your name must be at least 2 characters"),
  sender_email: z.string().email("Valid email required"),
  sender_phone: z.string().length(10, "Phone must be 10 digits").regex(/^\d+$/, "Digits only"),
  recipient_name:   z.string().min(2, "Recipient name required"),
  recipient_phone:  z.string().length(10, "Phone must be 10 digits").regex(/^\d+$/),
  delivery_line1:   z.string().min(5, "Enter a full address"),
  delivery_line2:   z.string().max(200).optional(),
  delivery_city:    z.string().min(2, "City required"),
  delivery_state:   z.string().min(2, "State required"),
  delivery_pincode: z.string().length(6, "6-digit pincode required").regex(/^\d+$/),
  delivery_date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  delivery_slot:    z.enum(["morning", "evening", "midnight"] as const),
  gift_message:         z.string().max(150).optional(),
  special_instructions: z.string().max(300).optional(),
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
});

export const addressSchema = z.object({
  label:          z.string().max(50).optional(),
  recipient_name: z.string().min(2, "Recipient name required"),
  phone:          z.string().length(10, "Phone must be 10 digits").regex(/^\d+$/),
  line1:          z.string().min(5, "Enter a full address"),
  line2:          z.string().max(200).optional(),
  city:           z.string().min(2, "City required"),
  state:          z.string().min(2, "State required"),
  pincode:        z.string().length(6, "6-digit pincode required").regex(/^\d+$/),
  is_default:     z.boolean().optional().default(false),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export type CheckoutItem    = z.infer<typeof checkoutItemSchema>;
export type AddressInput    = z.infer<typeof addressSchema>;
