-- Migration 002: Products & Product Images
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  sku             text UNIQUE,
  short_description text,
  description     text,
  base_price      numeric(10,2) NOT NULL,
  mrp             numeric(10,2),
  discount_percent numeric(5,2) GENERATED ALWAYS AS (
    CASE WHEN mrp IS NOT NULL AND mrp > base_price
         THEN ROUND(((mrp - base_price) / mrp * 100)::numeric, 2)
         ELSE 0
    END
  ) STORED,
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'active', 'archived')),
  is_featured     boolean NOT NULL DEFAULT false,
  is_bestseller   boolean NOT NULL DEFAULT false,
  is_new          boolean NOT NULL DEFAULT false,
  stock_quantity  integer NOT NULL DEFAULT 0,
  track_inventory boolean NOT NULL DEFAULT true,
  supports_same_day boolean NOT NULL DEFAULT false,
  primary_image_url text,
  badge           text CHECK (badge IN ('best-seller', 'new')),
  average_rating  numeric(3,2) NOT NULL DEFAULT 0,
  review_count    integer NOT NULL DEFAULT 0,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         text NOT NULL,
  alt_text    text,
  sort_order  integer NOT NULL DEFAULT 0,
  is_primary  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins full access to products"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins full access to product_images"
  ON product_images FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for product images
-- Run in Supabase dashboard: Storage → New bucket → "product-images" → Public
