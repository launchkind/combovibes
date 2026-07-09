-- ============================================================
-- Migration 016: Shipments (one row per order per vendor)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.shipments (
  id                        uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                  uuid          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  vendor_id                 uuid          REFERENCES public.vendors(id) ON DELETE SET NULL,

  -- Snapshot of vendor identity/address at the moment this shipment was (successfully) created,
  -- so a later vendor address edit doesn't rewrite history.
  vendor_name_snapshot      text          NOT NULL,
  pickup_location_snapshot  text          NOT NULL,
  vendor_address_snapshot   jsonb         NOT NULL,

  status                    text          NOT NULL DEFAULT 'pending'
                            CHECK (status IN (
                              'pending', 'blocked', 'processing', 'shipped',
                              'out_for_delivery', 'delivered', 'cancelled',
                              'returned', 'failed'
                            )),

  shiprocket_order_id       bigint,
  shiprocket_shipment_id    bigint,
  awb_code                  text,
  courier_name              text,
  tracking_url              text,
  last_error                text,
  shipped_at                timestamptz,
  delivered_at              timestamptz,

  created_at                timestamptz   NOT NULL DEFAULT now(),
  updated_at                timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Customers can see shipments belonging to their own orders (for the tracking page)
CREATE POLICY "shipments_user_select" ON public.shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = shipments.order_id
        AND orders.user_id = auth.uid()
    )
  );

DROP TRIGGER IF EXISTS trg_shipments_updated_at ON public.shipments;
CREATE TRIGGER trg_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- One shipment per (order, vendor) — retries UPDATE the same row, never insert a duplicate
CREATE UNIQUE INDEX IF NOT EXISTS uq_shipments_order_vendor ON public.shipments(order_id, vendor_id);

CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb_code  ON public.shipments(awb_code);
CREATE INDEX IF NOT EXISTS idx_shipments_status    ON public.shipments(status);
