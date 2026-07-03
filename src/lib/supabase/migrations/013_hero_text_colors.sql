-- Add per-text color columns for hero banner text (tagline, subtitle, italic tagline)
ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS tagline_color text DEFAULT 'rgba(255,255,255,0.85)',
  ADD COLUMN IF NOT EXISTS subtitle_color text DEFAULT 'rgba(255,255,255,0.85)',
  ADD COLUMN IF NOT EXISTS cta_text_color text DEFAULT '#ffc2d4';
