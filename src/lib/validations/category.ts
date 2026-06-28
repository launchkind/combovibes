import { z } from "zod";

export const categorySchema = z.object({
  name:          z.string().min(2).max(100),
  slug:          z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens only"),
  description:   z.string().max(500).optional().nullable(),
  image_url:     z.string().optional().nullable(),
  icon:          z.string().max(50).optional().nullable(),
  color:         z.string().max(20).optional().nullable(),

  show_on_homepage:  z.boolean(),
  show_in_navbar:    z.boolean(),
  show_after_hero:   z.boolean(),
  show_in_occasions: z.boolean(),

  sort_order: z.number().int().min(0),
  is_active:  z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
