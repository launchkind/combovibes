-- =============================================
-- 006_category_colors.sql
-- Run in Supabase SQL Editor
-- =============================================

-- Per-category color overrides for homepage product sections
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS title_color  text DEFAULT '#D81B60',  -- homepage section heading + heart/line accent color
  ADD COLUMN IF NOT EXISTS button_color text DEFAULT '#D81B60';  -- "Add to Cart" button color for products in this section
