-- Add title_color column to banners table
ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS title_color text DEFAULT '#D81B60';
