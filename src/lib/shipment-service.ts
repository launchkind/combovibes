import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildShiprocketPayload,
  checkServiceability,
  computeParcel,
  createShiprocketOrder,
  generateAWB,
  schedulePickup,
} from "@/lib/shiprocket";
import type { PickupResult } from "@/lib/shiprocket";
import { sendAdminShipmentAlertEmail } from "@/lib/notifications/email";
import type { Order, OrderItem } from "@/types/order.types";
import type { Vendor, VendorAddressSnapshot } from "@/types/vendor.types";

export interface VendorShipmentResult {
  vendor_id:   string | null;
  shipment_id: string;
  status:      "processing" | "blocked" | "failed";
  error?:      string;
}

export interface CreateShipmentsResult {
  results:      VendorShipmentResult[];
  anySucceeded: boolean;
  anyFailed:    boolean;
}

function vendorSnapshot(vendor: Vendor): VendorAddressSnapshot {
  return {
    contact_name:  vendor.contact_name,
    phone:         vendor.phone,
    email:         vendor.email,
    address_line1: vendor.address_line1,
    address_line2: vendor.address_line2,
    city:          vendor.city,
    state:         vendor.state,
    pincode:       vendor.pincode,
    country:       vendor.country,
  };
}

export async function createShipmentsForOrder(
  orderId: string,
  opts?: { onlyVendorId?: string | null; actor?: string }
): Promise<CreateShipmentsResult> {
  const admin = createAdminClient();
  const actor = opts?.actor ?? "system";

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (orderErr || !order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const items = (order.order_items ?? []) as OrderItem[];
  const groups = new Map<string, OrderItem[]>();
  for (const item of items) {
    const key = item.vendor_id ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  const results: VendorShipmentResult[] = [];

  for (const [vendorId, groupItems] of Array.from(groups)) {
    if (!vendorId) continue; // items with no vendor can't be shipped
    if (opts?.onlyVendorId && opts.onlyVendorId !== vendorId) continue;

    // Upsert the shipment row for (order_id, vendor_id)
    const { data: existing } = await admin
      .from("shipments")
      .select("*")
      .eq("order_id", orderId)
      .eq("vendor_id", vendorId)
      .maybeSingle();

    if (existing && existing.status === "processing") {
      results.push({ vendor_id: vendorId, shipment_id: existing.id, status: "processing" });
      continue; // already shipped — idempotent, don't re-create
    }

    const { data: vendor } = await admin
      .from("vendors")
      .select("*")
      .eq("id", vendorId)
      .single();

    let shipmentId = existing?.id;

    if (!vendor || !vendor.shiprocket_registered || !vendor.shiprocket_pickup_location_name) {
      const errorMsg = "Vendor not registered with Shiprocket";
      if (shipmentId) {
        await admin.from("shipments").update({ status: "blocked", last_error: errorMsg }).eq("id", shipmentId);
      } else {
        const { data: created } = await admin
          .from("shipments")
          .insert({
            order_id:                 orderId,
            vendor_id:                vendorId,
            vendor_name_snapshot:     vendor?.name ?? "Unknown vendor",
            pickup_location_snapshot: vendor?.shiprocket_pickup_location_name ?? "",
            vendor_address_snapshot:  vendor ? vendorSnapshot(vendor as Vendor) : {},
            status:                   "blocked",
            last_error:               errorMsg,
          })
          .select("id")
          .single();
        shipmentId = created?.id;
      }
      results.push({ vendor_id: vendorId, shipment_id: shipmentId!, status: "blocked", error: errorMsg });
      await sendAdminShipmentAlertEmail({
        orderNumber: order.order_number,
        vendorName:  vendor?.name ?? "Unknown vendor",
        status:      "blocked",
        error:       errorMsg,
      });
      continue;
    }

    const snapshot = vendorSnapshot(vendor as Vendor);

    if (shipmentId) {
      await admin.from("shipments").update({
        vendor_name_snapshot:     vendor.name,
        pickup_location_snapshot: vendor.shiprocket_pickup_location_name,
        vendor_address_snapshot:  snapshot,
        status:                   "pending",
        last_error:               null,
      }).eq("id", shipmentId);
    } else {
      const { data: created } = await admin
        .from("shipments")
        .insert({
          order_id:                 orderId,
          vendor_id:                vendorId,
          vendor_name_snapshot:     vendor.name,
          pickup_location_snapshot: vendor.shiprocket_pickup_location_name,
          vendor_address_snapshot:  snapshot,
          status:                   "pending",
        })
        .select("id")
        .single();
      shipmentId = created?.id;
    }

    try {
      const parcel = computeParcel(groupItems);

      // Fail fast on unserviceable routes. Shiprocket accepts the order first
      // and only rejects at AWB assignment, which would leave an orphaned
      // order sitting in their dashboard with no way to ship it.
      const couriers = await checkServiceability({
        pickupPincode:   vendor.pincode,
        deliveryPincode: order.delivery_pincode,
        weightKg:        parcel.weightKg,
      });
      if (couriers.length === 0) {
        throw new Error(
          `No courier serves ${vendor.pincode} -> ${order.delivery_pincode} at ${parcel.weightKg}kg`
        );
      }

      const payload = buildShiprocketPayload({
        order:                   order as Order,
        items:                   groupItems,
        pickupLocation:          vendor.shiprocket_pickup_location_name,
        shiprocketOrderIdSuffix: vendorId.slice(0, 6),
        parcel,
      });

      const srOrder = await createShiprocketOrder(payload);

      // The AWB exists only in this response — order creation never returns one.
      const awb = await generateAWB(srOrder.shipment_id);

      await admin.from("shipments").update({
        status:                 "processing",
        shiprocket_order_id:    srOrder.order_id,
        shiprocket_shipment_id: srOrder.shipment_id,
        awb_code:               awb.awb_code,
        courier_name:           awb.courier_name,
        tracking_url:           awb.tracking_url,
        last_error:             null,
      }).eq("id", shipmentId);

      // Best-effort: an AWB-assigned shipment is already valid, and many
      // couriers auto-schedule, so a failure here must not fail the shipment.
      const pickup = await schedulePickup([srOrder.shipment_id]).catch(
        (e): PickupResult => ({ scheduled: false, message: String(e) })
      );
      if (!pickup.scheduled) {
        console.warn("[shipment-service] pickup not scheduled:", pickup.message);
      }

      await admin.from("order_status_history").insert({
        order_id:   orderId,
        status:     "processing",
        note:       `Shipment created for vendor "${vendor.name}" via ${awb.courier_name}. ` +
                    `AWB: ${awb.awb_code}` +
                    (pickup.scheduled && pickup.date ? `. Pickup ${pickup.date}` : ""),
        changed_by: actor,
      });

      results.push({ vendor_id: vendorId, shipment_id: shipmentId!, status: "processing" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await admin.from("shipments").update({ status: "failed", last_error: msg }).eq("id", shipmentId);
      results.push({ vendor_id: vendorId, shipment_id: shipmentId!, status: "failed", error: msg });
      await sendAdminShipmentAlertEmail({
        orderNumber: order.order_number,
        vendorName:  vendor.name,
        status:      "failed",
        error:       msg,
      });
    }
  }

  // Mirror onto legacy `orders` columns when there's exactly one shipment total for this order
  const { data: allShipments } = await admin
    .from("shipments")
    .select("*")
    .eq("order_id", orderId);

  if (allShipments && allShipments.length === 1 && allShipments[0].status === "processing") {
    const s = allShipments[0];
    await admin.from("orders").update({
      shiprocket_order_id:    s.shiprocket_order_id,
      shiprocket_shipment_id: s.shiprocket_shipment_id,
      awb_code:               s.awb_code,
      courier_name:           s.courier_name,
      tracking_url:           s.tracking_url,
      order_status:           "processing",
    }).eq("id", orderId);
  } else if (allShipments && allShipments.length > 1) {
    const anyProcessingPlus = allShipments.some((s) =>
      ["processing", "shipped", "out_for_delivery", "delivered"].includes(s.status)
    );
    if (anyProcessingPlus) {
      await admin.from("orders").update({ order_status: "processing" }).eq("id", orderId);
    }
  }

  return {
    results,
    anySucceeded: results.some((r) => r.status === "processing"),
    anyFailed:    results.some((r) => r.status === "blocked" || r.status === "failed"),
  };
}
