export type VendorAddressSnapshot = {
  contact_name:  string;
  phone:         string;
  email:         string;
  address_line1: string;
  address_line2: string | null;
  city:          string;
  state:         string;
  pincode:       string;
  country:       string;
};

export type Vendor = {
  id:                              string;
  name:                            string;
  contact_name:                    string;
  phone:                           string;
  email:                           string;
  address_line1:                  string;
  address_line2:                  string | null;
  city:                            string;
  state:                           string;
  pincode:                         string;
  country:                         string;
  shiprocket_pickup_location_name: string | null;
  shiprocket_registered:           boolean;
  shiprocket_registered_at:       string | null;
  shiprocket_last_error:          string | null;
  is_active:                       boolean;
  created_at:                      string;
  updated_at:                      string;
};

export type ShipmentStatus =
  | "pending"
  | "blocked"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "failed";

export type Shipment = {
  id:                       string;
  order_id:                 string;
  vendor_id:                string | null;
  vendor_name_snapshot:     string;
  pickup_location_snapshot: string;
  vendor_address_snapshot:  VendorAddressSnapshot;
  status:                   ShipmentStatus;
  shiprocket_order_id:      number | null;
  shiprocket_shipment_id:   number | null;
  awb_code:                 string | null;
  courier_name:             string | null;
  tracking_url:             string | null;
  last_error:               string | null;
  shipped_at:               string | null;
  delivered_at:             string | null;
  created_at:               string;
  updated_at:               string;
  vendors?: { name: string; shiprocket_registered: boolean } | null;
};
