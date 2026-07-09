-- ============================================================
-- Migration 014: Vendors (Shiprocket Pickup Locations)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vendors (
  id                              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                            text        NOT NULL,
  contact_name                    text        NOT NULL,
  phone                           text        NOT NULL,
  email                           text        NOT NULL,
  address_line1                   text        NOT NULL,
  address_line2                   text,
  city                            text        NOT NULL,
  state                           text        NOT NULL,
  pincode                         text        NOT NULL,
  country                         text        NOT NULL DEFAULT 'India',

  -- Shiprocket registration
  shiprocket_pickup_location_name text        UNIQUE, -- nickname sent to/used by Shiprocket
  shiprocket_registered           boolean     NOT NULL DEFAULT false,
  shiprocket_registered_at        timestamptz,
  shiprocket_last_error           text,

  is_active                       boolean     NOT NULL DEFAULT true,

  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
-- Vendors are admin-only — no public read policy. Service role (admin client) bypasses RLS.

DROP TRIGGER IF EXISTS trg_vendors_updated_at ON public.vendors;
CREATE TRIGGER trg_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_vendors_active ON public.vendors(is_active);
