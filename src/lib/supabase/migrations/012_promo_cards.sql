-- =============================================
-- 012_promo_cards.sql
-- Run in Supabase SQL Editor
-- =============================================

-- Allow a new "promo_cards" placement for the 3-card promo row
-- shown right after the homepage category sections.
DO $$
DECLARE
  con text;
BEGIN
  SELECT conname INTO con
  FROM pg_constraint
  WHERE conrelid = 'public.banners'::regclass
    AND pg_get_constraintdef(oid) LIKE '%placement%'
    AND contype = 'c';

  IF con IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.banners DROP CONSTRAINT %I', con);
  END IF;
END $$;

ALTER TABLE public.banners ADD CONSTRAINT banners_placement_check
  CHECK (placement IN ('hero', 'promo_cards', 'category', 'occasion', 'sidebar', 'popup', 'announcement'));

-- Card background color (promo cards render a solid/gradient color card,
-- not a full-bleed background image like the hero banner).
ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS bg_color text DEFAULT '#C2185B';
