import { z } from "zod";

export const vendorSchema = z.object({
  name:          z.string().min(2, "Name must be at least 2 characters").max(200),
  contact_name:  z.string().min(2, "Contact name required").max(200),
  phone:         z.string().min(6, "Phone number required").max(20),
  email:         z.string().email("Valid email required"),
  address_line1: z.string().min(3, "Address required").max(300),
  address_line2: z.string().max(300).optional().nullable(),
  city:          z.string().min(2, "City required").max(100),
  state:         z.string().min(2, "State required").max(100),
  pincode:       z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country:       z.string().min(2).max(100),
  is_active:     z.boolean(),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;
