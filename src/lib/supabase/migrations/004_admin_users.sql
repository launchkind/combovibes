-- Migration 004: Admin Users
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admin_users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  role        text NOT NULL DEFAULT 'admin'
              CHECK (role IN ('super_admin', 'admin', 'product_manager', 'content_manager')),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- NOTE: Admin auth in this project uses email allowlist (ADMIN_EMAILS env var).
-- This table is for future RBAC expansion. No RLS needed — accessed via service role only.

-- ================================================================
-- SEED: Insert yourself as super_admin
-- Replace the VALUES with your actual Supabase auth user ID and email.
-- To find your user ID: Supabase Dashboard → Authentication → Users
-- ================================================================
--
-- INSERT INTO admin_users (user_id, full_name, email, role)
-- VALUES (
--   'YOUR-SUPABASE-AUTH-USER-ID-HERE',
--   'Admin',
--   'bijoyjogi9564482@gmail.com',
--   'super_admin'
-- )
-- ON CONFLICT (email) DO NOTHING;
