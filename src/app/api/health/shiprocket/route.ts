import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getShiprocketCredentials,
  listPickupLocations,
  resetShiprocketToken,
} from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

/**
 * Diagnostic for the Shiprocket integration.
 *
 * Shipment failures surface late and vaguely (an order is paid, then a shipment
 * row quietly flips to "blocked"), so this answers the three questions that
 * actually matter up front: do the credentials work, do the vendors' pickup
 * locations exist on the Shiprocket side, and is the webhook wired up.
 *
 * Open in development; admin-only in production. Never returns the password.
 */

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes((user.email ?? "").toLowerCase());
}

export async function GET() {
  if (process.env.NODE_ENV === "production" && !(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(siteUrl);

  const base = {
    webhookTokenConfigured: Boolean(process.env.SHIPROCKET_WEBHOOK_TOKEN?.trim()),
    webhookUrl:             `${siteUrl}/api/webhook/shiprocket`,
    webhookReachable:       !isLocal,
    notes: isLocal
      ? "Site URL is local: Shiprocket cannot deliver tracking webhooks here. Shipment status will not auto-update until deployed."
      : "Register the webhook URL in Shiprocket → Settings → API → Webhooks with the same token as SHIPROCKET_WEBHOOK_TOKEN.",
  };

  let email: string;
  try {
    ({ email } = getShiprocketCredentials());
  } catch (err) {
    return NextResponse.json({
      ...base,
      credentialsPresent: false,
      authenticated:      false,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }

  // Force a real login rather than trusting a cached token.
  resetShiprocketToken();

  let pickupLocations: string[];
  try {
    pickupLocations = (await listPickupLocations()).map((p) => p.pickup_location);
  } catch (err) {
    return NextResponse.json({
      ...base,
      credentialsPresent: true,
      email,
      authenticated:      false,
      error: err instanceof Error ? err.message : String(err),
      hint:
        "Check SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD. Note Shiprocket requires an " +
        "API user created under Settings → API → Configure, not your dashboard login.",
    }, { status: 502 });
  }

  // Cross-check what the app thinks is registered against what Shiprocket has.
  const admin = createAdminClient();
  const { data: vendors } = await admin
    .from("vendors")
    .select("name, pincode, shiprocket_registered, shiprocket_pickup_location_name, shiprocket_last_error")
    .eq("is_active", true);

  const known = new Set(pickupLocations);
  const vendorReport = (vendors ?? []).map((v) => {
    const nickname = v.shiprocket_pickup_location_name;
    const existsUpstream = nickname ? known.has(nickname) : false;
    return {
      vendor:          v.name,
      pincode:         v.pincode,
      pickupLocation:  nickname,
      markedRegistered: v.shiprocket_registered,
      existsInShiprocket: existsUpstream,
      // The failure mode that silently blocks every shipment for this vendor.
      ok: Boolean(v.shiprocket_registered && nickname && existsUpstream),
      ...(v.shiprocket_last_error ? { lastError: v.shiprocket_last_error } : {}),
    };
  });

  // Products that can never ship, because nothing can pick them up.
  const { count: orphanProducts } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .is("vendor_id", null)
    .eq("status", "active");

  const readyVendors = vendorReport.filter((v) => v.ok).length;

  return NextResponse.json({
    ...base,
    credentialsPresent: true,
    email,
    authenticated:      true,
    pickupLocationsInShiprocket: pickupLocations,
    vendors: vendorReport,
    summary: {
      vendorsReady:       readyVendors,
      vendorsTotal:       vendorReport.length,
      activeProductsWithoutVendor: orphanProducts ?? 0,
    },
    ...(readyVendors === 0
      ? { warning: "No vendor is shippable yet. Register a vendor from Admin → Vendors before taking orders." }
      : {}),
    ...(orphanProducts
      ? { warning_products: `${orphanProducts} active product(s) have no vendor and cannot be shipped.` }
      : {}),
  });
}
