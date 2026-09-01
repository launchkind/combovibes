-- ============================================================
-- Migration 018: Product shipping dimensions
-- Run this in Supabase Dashboard → SQL Editor
--
-- Shiprocket prices on the greater of actual and volumetric weight. Without
-- per-product values every parcel was declared as a hardcoded 0.5 kg /
-- 15x15x10 box, so couriers re-weigh on pickup and bill the difference back.
-- ============================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS weight_kg   numeric(6,3),
  ADD COLUMN IF NOT EXISTS length_cm   numeric(6,2),
  ADD COLUMN IF NOT EXISTS breadth_cm  numeric(6,2),
  ADD COLUMN IF NOT EXISTS height_cm   numeric(6,2);

COMMENT ON COLUMN public.products.weight_kg  IS 'Shipping weight in kg. NULL falls back to DEFAULT_PARCEL (0.5 kg).';
COMMENT ON COLUMN public.products.length_cm  IS 'Packed length in cm. NULL falls back to 15.';
COMMENT ON COLUMN public.products.breadth_cm IS 'Packed breadth in cm. NULL falls back to 15.';
COMMENT ON COLUMN public.products.height_cm  IS 'Packed height in cm. NULL falls back to 10.';

-- Values must be positive when supplied; NULL means "use the default".
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_shipping_dims_positive;
ALTER TABLE public.products
  ADD CONSTRAINT products_shipping_dims_positive CHECK (
    (weight_kg  IS NULL OR weight_kg  > 0) AND
    (length_cm  IS NULL OR length_cm  > 0) AND
    (breadth_cm IS NULL OR breadth_cm > 0) AND
    (height_cm  IS NULL OR height_cm  > 0)
  );

-- Snapshot the dimensions onto order_items so a later product edit cannot
-- change the parcel size of an order that has already shipped.
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS weight_kg   numeric(6,3),
  ADD COLUMN IF NOT EXISTS length_cm   numeric(6,2),
  ADD COLUMN IF NOT EXISTS breadth_cm  numeric(6,2),
  ADD COLUMN IF NOT EXISTS height_cm   numeric(6,2);

-- Backfill existing order_items from their products where still linked.
UPDATE public.order_items oi
SET weight_kg  = p.weight_kg,
    length_cm  = p.length_cm,
    breadth_cm = p.breadth_cm,
    height_cm  = p.height_cm
FROM public.products p
WHERE oi.product_id = p.id
  AND oi.weight_kg IS NULL;
