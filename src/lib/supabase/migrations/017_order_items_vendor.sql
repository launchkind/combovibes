-- ============================================================
-- Migration 017: Order Items → Vendor snapshot
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL;

-- Backfill existing order_items: derive vendor from the linked product where possible,
-- otherwise fall back to the placeholder "Legacy / Unassigned" vendor (see 015_products_vendor.sql).
UPDATE public.order_items oi
SET vendor_id = p.vendor_id
FROM public.products p
WHERE oi.product_id = p.id
  AND oi.vendor_id IS NULL;

UPDATE public.order_items
SET vendor_id = (SELECT id FROM public.vendors WHERE name = 'Legacy / Unassigned')
WHERE vendor_id IS NULL;

ALTER TABLE public.order_items
  ALTER COLUMN vendor_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON public.order_items(vendor_id);
