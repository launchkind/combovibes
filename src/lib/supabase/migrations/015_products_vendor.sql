-- ============================================================
-- Migration 015: Products → Vendor FK
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Placeholder vendor for existing products that predate the vendor system.
-- Update this row's address in /admin/vendors and reassign real products to
-- their actual vendors whenever convenient — this is just an unblocking default.
INSERT INTO public.vendors (name, contact_name, phone, email, address_line1, city, state, pincode, country, is_active)
SELECT 'Legacy / Unassigned', 'TBD', '0000000000', 'unassigned@combovibes.com', 'TBD', 'TBD', 'TBD', '000000', 'India', true
WHERE NOT EXISTS (SELECT 1 FROM public.vendors WHERE name = 'Legacy / Unassigned');

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES public.vendors(id) ON DELETE RESTRICT;

-- Backfill any existing products with no vendor onto the placeholder
UPDATE public.products
SET vendor_id = (SELECT id FROM public.vendors WHERE name = 'Legacy / Unassigned')
WHERE vendor_id IS NULL;

ALTER TABLE public.products
  ALTER COLUMN vendor_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
