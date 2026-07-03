-- =============================================
-- 011_reviews_title_color.sql
-- Run in Supabase SQL Editor
-- =============================================

-- Color for the "What Our Customers Say" homepage heading
INSERT INTO public.site_settings (key, value) VALUES
  ('reviews_title_color', '#D81B60')
ON CONFLICT (key) DO NOTHING;
