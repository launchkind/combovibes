import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  image_url: z.string().min(1, "Desktop image is required"),
  mobile_image_url: z.string().optional().nullable(),
  link_url: z.string().optional().nullable(),
  link_target: z.enum(["_self", "_blank"]),
  placement: z.enum(["hero", "promo_cards", "category", "occasion", "sidebar", "popup", "announcement"]),
  alt_text: z.string().max(200).optional().nullable(),
  cta_text: z.string().max(100).optional().nullable(),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
  valid_from: z.string().optional().nullable(),
  valid_until: z.string().optional().nullable(),
  title_color: z.string().optional().nullable(),
  title_text: z.string().max(100).optional().nullable(),
  bg_color: z.string().optional().nullable(),
  tagline_color: z.string().optional().nullable(),
  subtitle_color: z.string().optional().nullable(),
  cta_text_color: z.string().optional().nullable(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
