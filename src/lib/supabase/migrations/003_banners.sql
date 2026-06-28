-- Migration 003: Banners (CMS)
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS banners (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  image_url        text NOT NULL,
  mobile_image_url text,
  link_url         text,
  link_target      text NOT NULL DEFAULT '_self'
                   CHECK (link_target IN ('_self', '_blank')),
  placement        text NOT NULL
                   CHECK (placement IN ('hero', 'category', 'occasion', 'sidebar', 'popup', 'announcement')),
  alt_text         text,
  cta_text         text,
  sort_order       integer NOT NULL DEFAULT 0,
  is_active        boolean NOT NULL DEFAULT true,
  valid_from       timestamptz,
  valid_until      timestamptz,
  created_by       uuid REFERENCES auth.users(id),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active banners"
  ON banners FOR SELECT
  USING (
    is_active = true
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until >= now())
  );

CREATE POLICY "Admins full access to banners"
  ON banners FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for banner images
-- Run in Supabase dashboard: Storage → New bucket → "banner-images" → Public
