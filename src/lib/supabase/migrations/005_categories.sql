-- =============================================
-- 005_categories.sql
-- Run in Supabase SQL Editor
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  image_url     text,                      -- used in after-hero boxes
  icon          text,                      -- lucide icon name, used in occasions tabs
  color         text DEFAULT '#D81B60',    -- hex color for after-hero box gradient

  -- Visibility toggles
  show_on_homepage  boolean NOT NULL DEFAULT false,  -- render as product list section on homepage
  show_in_navbar    boolean NOT NULL DEFAULT true,   -- appear in Shop dropdown
  show_after_hero   boolean NOT NULL DEFAULT false,  -- appear as quick-access box below hero
  show_in_occasions boolean NOT NULL DEFAULT false,  -- appear as tab in Tailored For Your Occasions

  -- Ordering & status
  sort_order    integer NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Product ↔ Category join table (many-to-many)
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id    uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id   uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order    integer NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, category_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_categories_show_on_homepage  ON public.categories(show_on_homepage)  WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_show_in_navbar    ON public.categories(show_in_navbar)    WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_show_after_hero   ON public.categories(show_after_hero)   WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_show_in_occasions ON public.categories(show_in_occasions) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_product_categories_category  ON public.product_categories(category_id, sort_order);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_categories_updated_at();

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Public: read active categories
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = true);

-- Public: read product_categories
CREATE POLICY "product_categories_public_read" ON public.product_categories
  FOR SELECT USING (true);

-- Admin (service role): full access — service role bypasses RLS automatically.
-- No explicit admin policy needed for service-role client.

-- ---- Seed data (safe to re-run, skips on conflict) ----

INSERT INTO public.categories (name, slug, description, show_on_homepage, show_in_navbar, show_after_hero, show_in_occasions, sort_order, icon, color)
VALUES
  ('New Arrivals',     'new-arrivals',     'Latest products just added',          true,  true,  true,  false, 10, 'Sparkles',     '#D81B60'),
  ('Best Sellers',     'best-sellers',     'Our most popular products',           true,  true,  false, false, 20, 'TrendingUp',   '#880E4F'),
  ('Women Accessories','women-accessories','Jewellery & accessories for women',   false, true,  true,  false, 30, 'Gem',          '#9C27B0'),
  ('Men Accessories',  'men-accessories',  'Stylish accessories for men',         false, true,  false, false, 40, 'Watch',        '#1565C0'),
  ('Gift Combos',      'gift-combos',      'Curated gift combo sets',             false, true,  true,  false, 50, 'Gift',         '#E65100'),
  ('Birthday',         'birthday',         'Birthday celebration gifts',          false, false, false, true,  60, 'Gift',         '#D81B60'),
  ('Anniversary',      'anniversary',      'Anniversary gifts for couples',       false, false, false, true,  70, 'Heart',        '#880E4F'),
  ('Love N Romance',   'love-romance',     'Romantic gifts for special moments',  false, false, false, true,  80, 'Gem',          '#C2185B'),
  ('Wedding',          'wedding',          'Premium wedding gift collections',    false, false, false, true,  90, 'Star',         '#6A1B9A'),
  ('Congratulations',  'congratulations',  'Gifts to celebrate achievements',     false, false, false, true, 100, 'PartyPopper',  '#1B5E20'),
  ('Thank You',        'thank-you',        'Thoughtful thank-you gifts',          false, false, false, true, 110, 'ThumbsUp',     '#0D47A1')
ON CONFLICT (slug) DO NOTHING;
