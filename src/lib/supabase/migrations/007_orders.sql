-- ============================================================
-- Migration 007: Order System
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Sequence for order numbers: CV-YYYYMMDD-01001
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1001 INCREMENT 1;

-- 2. Saved delivery addresses (logged-in users only)
CREATE TABLE IF NOT EXISTS public.addresses (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label          text,
  recipient_name text        NOT NULL,
  phone          text        NOT NULL,
  line1          text        NOT NULL,
  line2          text,
  city           text        NOT NULL,
  state          text        NOT NULL,
  pincode        text        NOT NULL,
  is_default     boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_user_select" ON public.addresses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "addresses_user_insert" ON public.addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_user_update" ON public.addresses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_user_delete" ON public.addresses
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id                     uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number           text          NOT NULL UNIQUE
                         DEFAULT ('CV-' || to_char(now(), 'YYYYMMDD') || '-' ||
                                  lpad(nextval('public.order_number_seq')::text, 5, '0')),
  user_id                uuid          REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Buyer (sender) info
  sender_name            text          NOT NULL,
  sender_email           text          NOT NULL,
  sender_phone           text          NOT NULL,

  -- Recipient & delivery address
  recipient_name         text          NOT NULL,
  recipient_phone        text          NOT NULL,
  delivery_line1         text          NOT NULL,
  delivery_line2         text,
  delivery_city          text          NOT NULL,
  delivery_state         text          NOT NULL,
  delivery_pincode       text          NOT NULL,
  delivery_date          date          NOT NULL,
  delivery_slot          text          NOT NULL
                         CHECK (delivery_slot IN ('morning', 'evening', 'midnight')),

  -- Gift details
  gift_message           text,
  special_instructions   text,

  -- Financials
  subtotal               numeric(10,2) NOT NULL,
  delivery_fee           numeric(10,2) NOT NULL DEFAULT 0,
  total_amount           numeric(10,2) NOT NULL,

  -- Payment (Cashfree)
  payment_status         text          NOT NULL DEFAULT 'pending'
                         CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  cashfree_order_id      text,
  cashfree_payment_id    text,
  payment_method         text,
  paid_at                timestamptz,

  -- Fulfillment (Shiprocket)
  order_status           text          NOT NULL DEFAULT 'pending'
                         CHECK (order_status IN (
                           'pending', 'confirmed', 'processing',
                           'shipped', 'out_for_delivery', 'delivered',
                           'cancelled', 'returned'
                         )),
  shiprocket_order_id    bigint,
  shiprocket_shipment_id bigint,
  awb_code               text,
  courier_name           text,
  tracking_url           text,
  shipped_at             timestamptz,
  delivered_at           timestamptz,

  created_at             timestamptz   NOT NULL DEFAULT now(),
  updated_at             timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Logged-in users see only their own orders
CREATE POLICY "orders_user_select" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Service-role (admin client) bypasses RLS automatically

-- 4. Order items
CREATE TABLE IF NOT EXISTS public.order_items (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      uuid          REFERENCES public.products(id) ON DELETE SET NULL,
  product_name    text          NOT NULL,
  product_image   text,
  unit_price      numeric(10,2) NOT NULL,
  quantity        integer       NOT NULL CHECK (quantity > 0),
  line_total      numeric(10,2) NOT NULL
                  GENERATED ALWAYS AS (unit_price * quantity) STORED,
  gift_message    text,
  greeting_card   text,
  selected_color  text,
  selected_size   text,
  created_at      timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_user_select" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- 5. Order status history (audit trail → powers tracking timeline)
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status      text        NOT NULL,
  note        text,
  changed_by  text        NOT NULL DEFAULT 'system',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_history_user_select" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_status_history.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- 6. Stock decrement RPC (called after payment confirmed)
CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id uuid, p_quantity integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = GREATEST(stock_quantity - p_quantity, 0)
  WHERE id = p_product_id AND track_inventory = true;
END;
$$;

-- 7. Auto-update triggers (reuse set_updated_at from migration 001)
-- Note: if set_updated_at doesn't exist, use update_updated_at (defined in 002)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_addresses_updated_at ON public.addresses;
CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_cashfree_oid   ON public.orders(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_awb_code       ON public.orders(awb_code);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id  ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order   ON public.order_status_history(order_id, created_at);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id     ON public.addresses(user_id);
