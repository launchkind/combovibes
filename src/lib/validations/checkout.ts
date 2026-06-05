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
  deliveryDate: z.date({ required_error: "Delivery date is required" }),
  deliverySlot: z.enum(["morning", "evening", "midnight"], {
    required_error: "Please select a delivery slot",
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
