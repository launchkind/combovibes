-- =============================================
-- 006_reviews.sql
-- Run in Supabase SQL Editor
-- =============================================

-- Site-wide testimonial reviews (shown on homepage carousel)
CREATE TABLE IF NOT EXISTS public.site_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name   text NOT NULL,
  content     text NOT NULL,
  rating      integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review_date date,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_reviews_public_read" ON public.site_reviews
  FOR SELECT USING (is_active = true);

-- Seed with existing testimonials
INSERT INTO public.site_reviews (user_name, content, rating, review_date, sort_order) VALUES
  ('Priya Sharma',  'Bahut hi beautiful products! Quality superb hai aur packaging bhi amazing.',                                               5, '2026-03-12', 10),
  ('Rohan Verma',   'Best gift combos! Maine apni girlfriend ke liye order kiya, she loved it.',                                              5, '2026-02-14', 20),
  ('Ananya Dutta',  'Fast delivery and premium quality. Combo Vibes is my go-to shopping store now!',                                        5, '2026-04-03', 30),
  ('Rohit Kumar',   'Ordered the men''s combo for my brother''s birthday. Delivery was super fast and packaging was very nice!',              5, '2026-01-07', 40),
  ('Neha Singh',    'The jewellery combo I ordered was exactly as shown. Very beautiful quality and affordable price. Highly recommend!',     5, '2026-05-22', 50),
  ('Arjun Mehta',   'Excellent products at the best price. The combo gifts are perfect for any occasion. Will order again!',                  5, '2026-04-18', 60)
ON CONFLICT DO NOTHING;

-- Site settings table (TopBanner, contact info, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key   text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read" ON public.site_settings
  FOR SELECT USING (true);

INSERT INTO public.site_settings (key, value) VALUES
  ('banner_text',    'Welcome to Combo Vibes – Style Meets Gifting ✨'),
  ('address',        'Islampur, West Bengal'),
  ('phone',          '9608217057'),
  ('whatsapp',       '919608217057'),
  ('email',          'bussniseatau1@gmail.com')
ON CONFLICT (key) DO NOTHING;
