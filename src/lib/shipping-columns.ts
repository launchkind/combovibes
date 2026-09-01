import type { createAdminClient } from "@/lib/supabase/admin";

/**
 * Capability probe for migration 018 (per-product shipping dimensions).
 *
 * Migrations here are applied by hand in the Supabase SQL editor, so code and
 * schema drift apart between deploy and migration. Selecting or inserting a
 * column that doesn't exist yet is a hard PostgREST error — which would take
 * checkout down completely for the window in between. Probing once and
 * degrading to the default parcel keeps orders flowing either way, and starts
 * snapshotting real dimensions the moment the migration lands.
 */

let cached: boolean | null = null;

export const SHIPPING_COLUMNS = ["weight_kg", "length_cm", "breadth_cm", "height_cm"] as const;

export type ShippingDims = {
  weight_kg:  number | null;
  length_cm:  number | null;
  breadth_cm: number | null;
  height_cm:  number | null;
};

export const EMPTY_DIMS: ShippingDims = {
  weight_kg: null, length_cm: null, breadth_cm: null, height_cm: null,
};

export async function hasShippingColumns(
  admin: ReturnType<typeof createAdminClient>
): Promise<boolean> {
  if (cached !== null) return cached;

  const { error } = await admin.from("products").select("weight_kg").limit(1);
  cached = !error;

  if (error) {
    console.warn(
      "[shipping] products.weight_kg not found — run migration 018_product_shipping.sql " +
      "to enable per-product parcel sizes. Falling back to default dimensions."
    );
  }

  return cached;
}

/** Test seam / lets the app pick up the migration without a restart. */
export function resetShippingColumnsCache(): void {
  cached = null;
}
