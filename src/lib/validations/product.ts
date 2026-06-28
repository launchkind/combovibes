import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  short_description: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  base_price: z.number().positive("Price must be greater than 0"),
  mrp: z.number().positive("MRP must be greater than 0").optional().nullable(),
  status: z.enum(["draft", "active", "archived"]),
  is_featured: z.boolean(),
  is_bestseller: z.boolean(),
  is_new: z.boolean(),
  stock_quantity: z.number().int().min(0),
  track_inventory: z.boolean(),
  supports_same_day: z.boolean(),
  primary_image_url: z.string().optional().nullable(),
  badge: z.enum(["best-seller", "new"]).optional().nullable(),
}).refine(
  (data) => !data.mrp || data.mrp >= data.base_price,
  { message: "MRP must be greater than or equal to the sale price", path: ["mrp"] }
);

export type ProductFormValues = z.infer<typeof productSchema>;
