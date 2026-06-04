# 06 — Database Design

> **Purpose:** Complete relational database schema for Combovibes using Supabase (PostgreSQL). Covers all tables, columns, types, constraints, relationships, and indexes.

---

## Table of Contents

1. [Entity Relationship Overview](#1-entity-relationship-overview)
2. [User & Auth Tables](#2-user--auth-tables)
3. [Product Catalog Tables](#3-product-catalog-tables)
4. [Inventory & Pricing Tables](#4-inventory--pricing-tables)
5. [Shopping Tables](#5-shopping-tables)
6. [Order Tables](#6-order-tables)
7. [Delivery Tables](#7-delivery-tables)
8. [Payment Tables](#8-payment-tables)
9. [Reviews & Ratings Tables](#9-reviews--ratings-tables)
10. [Gifting Tables](#10-gifting-tables)
11. [Marketing Tables](#11-marketing-tables)
12. [Vendor Tables](#12-vendor-tables)
13. [CMS Tables](#13-cms-tables)
14. [Admin & RBAC Tables](#14-admin--rbac-tables)
15. [Audit & Notification Tables](#15-audit--notification-tables)
16. [Index Strategy](#16-index-strategy)

---

## 1. Entity Relationship Overview

```
users ──────────────── profiles
  │                        │
  ├── addresses             ├── wishlists ─── products
  ├── cart_items            ├── orders ──── order_items ─── products
  ├── reviews               │                │
  └── notifications         │                ├── delivery_slots
                            │                ├── gift_messages
                            │                └── payments
products ──── categories
  │       └── subcategories
  ├── product_images
  ├── product_variants ─── inventory
  ├── product_occasions
  └── product_tags

vendors ──── vendor_products ─── products
  └── payouts

coupons ──── coupon_usage
```

---

## 2. User & Auth Tables

### `users` (managed by Supabase Auth)

```sql
-- Supabase auth.users table (built-in, extended via profiles)
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
email           text UNIQUE
phone           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
last_sign_in_at timestamptz
```

### `profiles`

```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
full_name       text NOT NULL
display_name    text
avatar_url      text
phone           text
date_of_birth   date
gender          text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'))
referral_code   text UNIQUE DEFAULT substr(md5(random()::text), 1, 8)
referred_by     uuid REFERENCES profiles(id)
wallet_balance  numeric(10,2) DEFAULT 0.00
loyalty_points  integer DEFAULT 0
tier            text DEFAULT 'silver' CHECK (tier IN ('silver', 'gold', 'platinum'))
is_verified     boolean DEFAULT false
is_suspended    boolean DEFAULT false
preferences     jsonb DEFAULT '{}'
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `addresses`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
label           text NOT NULL DEFAULT 'Home' -- Home, Work, Other
full_name       text NOT NULL
phone           text NOT NULL
address_line_1  text NOT NULL
address_line_2  text
landmark        text
city            text NOT NULL
state           text NOT NULL
pincode         text NOT NULL
country         text NOT NULL DEFAULT 'IN'
is_default      boolean DEFAULT false
latitude        numeric(10,7)
longitude       numeric(10,7)
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()

CONSTRAINT valid_pincode CHECK (pincode ~ '^\d{6}$')
```

---

## 3. Product Catalog Tables

### `categories`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text NOT NULL UNIQUE
description     text
image_url       text
icon_url        text
parent_id       uuid REFERENCES categories(id)
sort_order      integer DEFAULT 0
is_active       boolean DEFAULT true
meta_title      text
meta_description text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `occasions`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text NOT NULL UNIQUE
description     text
image_url       text
banner_url      text
icon            text
sort_order      integer DEFAULT 0
is_active       boolean DEFAULT true
is_seasonal     boolean DEFAULT false
season_start    date
season_end      date
meta_title      text
meta_description text
created_at      timestamptz DEFAULT now()
```

### `collections`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text NOT NULL UNIQUE
description     text
image_url       text
banner_url      text
is_active       boolean DEFAULT true
sort_order      integer DEFAULT 0
featured        boolean DEFAULT false
meta_title      text
meta_description text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `brands`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text NOT NULL UNIQUE
description     text
logo_url        text
banner_url      text
is_active       boolean DEFAULT true
sort_order      integer DEFAULT 0
created_at      timestamptz DEFAULT now()
```

### `products`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text NOT NULL UNIQUE
sku             text UNIQUE
description     text
short_description text
category_id     uuid REFERENCES categories(id)
brand_id        uuid REFERENCES brands(id)
vendor_id       uuid REFERENCES vendors(id)
status          text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'out_of_stock'))
type            text DEFAULT 'simple' CHECK (type IN ('simple', 'variable', 'bundle', 'personalized'))
is_personalizable boolean DEFAULT false
is_featured     boolean DEFAULT false
is_bestseller   boolean DEFAULT false
is_new          boolean DEFAULT false

-- Pricing (base, variants override)
base_price      numeric(10,2) NOT NULL
mrp             numeric(10,2)
cost_price      numeric(10,2)
discount_percent numeric(5,2) GENERATED ALWAYS AS (
  CASE WHEN mrp > base_price THEN ((mrp - base_price) / mrp * 100) ELSE 0 END
) STORED

-- Delivery
delivery_lead_days integer DEFAULT 1
supports_same_day  boolean DEFAULT false
supports_midnight  boolean DEFAULT false
supports_express   boolean DEFAULT false
weight_grams    integer
length_cm       numeric(6,2)
width_cm        numeric(6,2)
height_cm       numeric(6,2)

-- SEO
meta_title      text
meta_description text
tags            text[] DEFAULT '{}'

-- Stats
view_count      integer DEFAULT 0
order_count     integer DEFAULT 0
average_rating  numeric(3,2) DEFAULT 0
review_count    integer DEFAULT 0

sort_order      integer DEFAULT 0
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `product_images`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE
url             text NOT NULL
alt_text        text
sort_order      integer DEFAULT 0
is_primary      boolean DEFAULT false
type            text DEFAULT 'image' CHECK (type IN ('image', 'video'))
created_at      timestamptz DEFAULT now()
```

### `product_variants`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE
name            text NOT NULL   -- e.g., "500g", "Red", "Small"
sku             text UNIQUE
variant_type    text NOT NULL   -- 'size', 'weight', 'color', 'flavor', 'count'
value           text NOT NULL   -- e.g., "500", "red", "small"
price           numeric(10,2) NOT NULL
mrp             numeric(10,2)
cost_price      numeric(10,2)
image_url       text
sort_order      integer DEFAULT 0
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
```

### `product_occasions` (junction table)

```sql
product_id      uuid REFERENCES products(id) ON DELETE CASCADE
occasion_id     uuid REFERENCES occasions(id) ON DELETE CASCADE
sort_order      integer DEFAULT 0
PRIMARY KEY (product_id, occasion_id)
```

### `product_collections` (junction table)

```sql
product_id      uuid REFERENCES products(id) ON DELETE CASCADE
collection_id   uuid REFERENCES collections(id) ON DELETE CASCADE
sort_order      integer DEFAULT 0
PRIMARY KEY (product_id, collection_id)
```

### `personalization_config`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE
allows_text     boolean DEFAULT false
allows_image    boolean DEFAULT false
text_label      text    -- e.g., "Enter name for the cake"
text_max_chars  integer
image_label     text    -- e.g., "Upload your photo"
max_images      integer DEFAULT 1
min_image_width integer -- pixels
min_image_height integer
font_options    text[]  -- array of allowed font names
color_options   text[]  -- array of hex colors
extra_lead_days integer DEFAULT 1
created_at      timestamptz DEFAULT now()
```

---

## 4. Inventory & Pricing Tables

### `inventory`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id      uuid REFERENCES products(id) ON DELETE CASCADE
variant_id      uuid REFERENCES product_variants(id) ON DELETE CASCADE
quantity        integer NOT NULL DEFAULT 0
reserved        integer NOT NULL DEFAULT 0  -- items in active carts/orders
available       integer GENERATED ALWAYS AS (quantity - reserved) STORED
low_stock_threshold integer DEFAULT 10
warehouse_id    uuid   -- future multi-warehouse support
updated_at      timestamptz DEFAULT now()

CONSTRAINT inventory_unique UNIQUE (product_id, variant_id)
CONSTRAINT non_negative_qty CHECK (quantity >= 0)
```

### `product_pricing_rules`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id      uuid REFERENCES products(id) ON DELETE CASCADE
variant_id      uuid REFERENCES product_variants(id)
rule_type       text CHECK (rule_type IN ('sale', 'bulk', 'seasonal', 'member'))
discount_type   text CHECK (discount_type IN ('percent', 'fixed'))
discount_value  numeric(10,2) NOT NULL
min_quantity    integer DEFAULT 1
valid_from      timestamptz
valid_until     timestamptz
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
```

---

## 5. Shopping Tables

### `wishlists`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE
variant_id      uuid REFERENCES product_variants(id)
created_at      timestamptz DEFAULT now()

CONSTRAINT wishlist_unique UNIQUE (user_id, product_id, variant_id)
```

### `cart_items`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE  -- null for guest
session_id      text   -- for guest carts
product_id      uuid NOT NULL REFERENCES products(id)
variant_id      uuid REFERENCES product_variants(id)
quantity        integer NOT NULL DEFAULT 1
unit_price      numeric(10,2) NOT NULL  -- price at time of add
personalization jsonb  -- { text: "Happy Birthday", image_url: "..." }
gift_message    text
greeting_card_id uuid REFERENCES greeting_cards(id)
addons          jsonb  -- [{ type: 'chocolate', price: 199 }, ...]
delivery_date   date
delivery_slot_id uuid REFERENCES delivery_slots(id)
recipient_name  text
recipient_phone text
recipient_address jsonb  -- full address snapshot
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()

CONSTRAINT qty_positive CHECK (quantity > 0)
```

---

## 6. Order Tables

### `orders`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_number    text NOT NULL UNIQUE  -- human-readable: CV-2024-00001
user_id         uuid REFERENCES profiles(id)
guest_email     text   -- for guest orders
guest_phone     text

status          text NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'payment_pending', 'confirmed', 'processing', 
                    'packed', 'shipped', 'out_for_delivery', 'delivered', 
                    'cancelled', 'refund_requested', 'refunded', 'failed'))

-- Financials
subtotal        numeric(10,2) NOT NULL
delivery_charge numeric(10,2) DEFAULT 0
discount_amount numeric(10,2) DEFAULT 0
tax_amount      numeric(10,2) DEFAULT 0
total_amount    numeric(10,2) NOT NULL

coupon_id       uuid REFERENCES coupons(id)
coupon_code     text
wallet_used     numeric(10,2) DEFAULT 0
points_used     integer DEFAULT 0
gift_card_used  numeric(10,2) DEFAULT 0

-- Notes
customer_note   text
admin_note      text
internal_note   text

-- Metadata
ip_address      inet
user_agent      text
utm_source      text
utm_medium      text
utm_campaign    text

created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
confirmed_at    timestamptz
cancelled_at    timestamptz
delivered_at    timestamptz
```

### `order_items`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE
product_id      uuid NOT NULL REFERENCES products(id)
variant_id      uuid REFERENCES product_variants(id)
vendor_id       uuid REFERENCES vendors(id)
quantity        integer NOT NULL
unit_price      numeric(10,2) NOT NULL
total_price     numeric(10,2) NOT NULL  -- unit_price * quantity

-- Snapshot at time of order
product_name    text NOT NULL
product_sku     text
product_image   text
variant_name    text

-- Gift options
personalization jsonb
gift_message    text
greeting_card_id uuid REFERENCES greeting_cards(id)
addons          jsonb

-- Delivery
recipient_name  text NOT NULL
recipient_phone text NOT NULL
delivery_address jsonb NOT NULL  -- full address snapshot
delivery_date   date NOT NULL
delivery_slot_id uuid REFERENCES delivery_slots(id)
delivery_type   text  -- 'standard', 'same_day', 'midnight', 'express'
delivery_charge numeric(10,2) DEFAULT 0

-- Fulfillment
status          text DEFAULT 'pending'
  CHECK (status IN ('pending', 'confirmed', 'packed', 'shipped', 
                    'out_for_delivery', 'delivered', 'cancelled', 'returned'))
tracking_number text
dispatched_at   timestamptz
delivered_at    timestamptz

created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `order_status_history`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE
order_item_id   uuid REFERENCES order_items(id)
status          text NOT NULL
changed_by      uuid  -- admin/vendor user id, null = system
note            text
created_at      timestamptz DEFAULT now()
```

---

## 7. Delivery Tables

### `delivery_zones`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL   -- e.g., "Mumbai - Zone A"
city            text NOT NULL
state           text NOT NULL
country         text DEFAULT 'IN'
pincodes        text[]   -- array of 6-digit pincodes
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
```

### `delivery_slots`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
zone_id         uuid REFERENCES delivery_zones(id)
name            text NOT NULL  -- "Morning (6 AM - 10 AM)"
slot_type       text NOT NULL CHECK (slot_type IN ('standard', 'same_day', 'midnight', 'express', 'fixed'))
start_time      time NOT NULL
end_time        time NOT NULL
cutoff_time     time   -- order must be placed before this time for same-day
max_capacity    integer NOT NULL DEFAULT 50
available_days  text[]  -- ['mon','tue','wed','thu','fri','sat','sun']
surcharge       numeric(8,2) DEFAULT 0
is_active       boolean DEFAULT true
created_at      timestamptz DEFAULT now()
```

### `slot_bookings`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
slot_id         uuid NOT NULL REFERENCES delivery_slots(id)
booking_date    date NOT NULL
order_item_id   uuid REFERENCES order_items(id)
created_at      timestamptz DEFAULT now()
```

### `pincode_serviceability`

```sql
pincode         text PRIMARY KEY
city            text NOT NULL
state           text NOT NULL
zone_id         uuid REFERENCES delivery_zones(id)
is_serviceable  boolean DEFAULT true
supports_same_day boolean DEFAULT false
supports_midnight boolean DEFAULT false
supports_express boolean DEFAULT false
cod_available   boolean DEFAULT false
standard_lead_days integer DEFAULT 2
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

---

## 8. Payment Tables

### `payments`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id        uuid NOT NULL REFERENCES orders(id)
payment_method  text NOT NULL CHECK (payment_method IN (
                  'upi', 'credit_card', 'debit_card', 'net_banking', 
                  'wallet', 'emi', 'cod', 'gift_card', 'loyalty_points', 'platform_wallet'))
gateway         text   -- 'razorpay', 'payU', 'stripe'
gateway_order_id text   -- gateway's order ID
gateway_payment_id text -- gateway's payment ID
gateway_signature text  -- for verification
amount          numeric(10,2) NOT NULL
currency        text DEFAULT 'INR'
status          text DEFAULT 'initiated' CHECK (status IN (
                  'initiated', 'pending', 'success', 'failed', 'refunded', 'partially_refunded'))
failure_reason  text
metadata        jsonb  -- gateway response
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `refunds`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id        uuid NOT NULL REFERENCES orders(id)
order_item_id   uuid REFERENCES order_items(id)
payment_id      uuid REFERENCES payments(id)
amount          numeric(10,2) NOT NULL
reason          text
method          text   -- same as original payment or wallet/points
gateway_refund_id text
status          text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
initiated_by    uuid  -- admin or customer
processed_at    timestamptz
created_at      timestamptz DEFAULT now()
```

### `gift_cards`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
code            text NOT NULL UNIQUE
amount          numeric(10,2) NOT NULL
balance         numeric(10,2) NOT NULL
purchased_by    uuid REFERENCES profiles(id)
assigned_to_email text
message         text
is_active       boolean DEFAULT true
expires_at      date
created_at      timestamptz DEFAULT now()
```

### `gift_card_transactions`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
gift_card_id    uuid NOT NULL REFERENCES gift_cards(id)
order_id        uuid REFERENCES orders(id)
amount          numeric(10,2) NOT NULL
type            text CHECK (type IN ('credit', 'debit'))
created_at      timestamptz DEFAULT now()
```

### `wallet_transactions`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES profiles(id)
order_id        uuid REFERENCES orders(id)
amount          numeric(10,2) NOT NULL
type            text CHECK (type IN ('credit', 'debit'))
reason          text   -- 'refund', 'cashback', 'referral', 'manual_credit'
reference_id    text
created_at      timestamptz DEFAULT now()
```

### `loyalty_transactions`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES profiles(id)
order_id        uuid REFERENCES orders(id)
points          integer NOT NULL
type            text CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus'))
reason          text
expires_at      date
created_at      timestamptz DEFAULT now()
```

---

## 9. Reviews & Ratings Tables

### `reviews`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE
user_id         uuid NOT NULL REFERENCES profiles(id)
order_item_id   uuid REFERENCES order_items(id)
rating          integer NOT NULL CHECK (rating BETWEEN 1 AND 5)
title           text
body            text
images          text[]
status          text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
is_highlighted  boolean DEFAULT false
helpful_count   integer DEFAULT 0
vendor_reply    text
vendor_replied_at timestamptz
rejection_reason text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()

CONSTRAINT one_review_per_order UNIQUE (user_id, order_item_id)
```

### `review_helpful_votes`

```sql
review_id       uuid REFERENCES reviews(id) ON DELETE CASCADE
user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE
created_at      timestamptz DEFAULT now()
PRIMARY KEY (review_id, user_id)
```

---

## 10. Gifting Tables

### `gift_messages`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_item_id   uuid REFERENCES order_items(id)
message         text
from_name       text
to_name         text
is_anonymous    boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

### `greeting_cards`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
category        text  -- 'birthday', 'anniversary', 'general'
image_url       text NOT NULL
thumbnail_url   text
price           numeric(8,2) DEFAULT 0
is_free         boolean DEFAULT true
is_active       boolean DEFAULT true
sort_order      integer DEFAULT 0
created_at      timestamptz DEFAULT now()
```

### `personalization_orders`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_item_id   uuid NOT NULL REFERENCES order_items(id)
product_id      uuid NOT NULL REFERENCES products(id)
text_content    text
image_url       text
preview_url     text   -- generated preview image
font            text
color           text
status          text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed'))
created_at      timestamptz DEFAULT now()
```

---

## 11. Marketing Tables

### `coupons`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
code            text NOT NULL UNIQUE
name            text NOT NULL
description     text
type            text NOT NULL CHECK (type IN ('percent', 'fixed', 'free_shipping', 'buy_x_get_y'))
discount_value  numeric(10,2) NOT NULL
max_discount    numeric(10,2)   -- cap for percentage discounts
min_order_value numeric(10,2) DEFAULT 0
applicable_to   text DEFAULT 'all' CHECK (applicable_to IN ('all', 'category', 'product', 'brand'))
applicable_ids  uuid[]  -- product/category/brand IDs
excluded_ids    uuid[]
usage_limit_total integer
usage_limit_per_user integer DEFAULT 1
usage_count     integer DEFAULT 0
is_active       boolean DEFAULT true
valid_from      timestamptz
valid_until     timestamptz
first_order_only boolean DEFAULT false
new_user_only   boolean DEFAULT false
created_by      uuid
created_at      timestamptz DEFAULT now()
```

### `coupon_usage`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
coupon_id       uuid NOT NULL REFERENCES coupons(id)
user_id         uuid REFERENCES profiles(id)
order_id        uuid NOT NULL REFERENCES orders(id)
discount_applied numeric(10,2) NOT NULL
created_at      timestamptz DEFAULT now()
```

### `campaigns`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
type            text CHECK (type IN ('email', 'sms', 'push', 'whatsapp'))
status          text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled'))
subject         text
content         text
template_id     text
target_segment  jsonb  -- filter rules for recipient selection
recipient_count integer
sent_count      integer DEFAULT 0
opened_count    integer DEFAULT 0
clicked_count   integer DEFAULT 0
scheduled_at    timestamptz
sent_at         timestamptz
created_by      uuid
created_at      timestamptz DEFAULT now()
```

---

## 12. Vendor Tables

### `vendors`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES auth.users(id)
business_name   text NOT NULL
slug            text UNIQUE
description     text
logo_url        text
phone           text
email           text UNIQUE
gst_number      text
pan_number      text
address         jsonb
bank_account    jsonb   -- account_no, ifsc, bank_name (encrypted)
status          text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected'))
commission_rate numeric(5,2) DEFAULT 20.00   -- platform commission %
rating          numeric(3,2) DEFAULT 0
total_orders    integer DEFAULT 0
total_revenue   numeric(12,2) DEFAULT 0
rejection_reason text
approved_by     uuid
approved_at     timestamptz
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `vendor_payouts`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
vendor_id       uuid NOT NULL REFERENCES vendors(id)
amount          numeric(10,2) NOT NULL
commission      numeric(10,2) NOT NULL
net_amount      numeric(10,2) NOT NULL  -- amount - commission
period_start    date NOT NULL
period_end      date NOT NULL
status          text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed'))
payment_method  text  -- 'bank_transfer', 'upi'
transaction_id  text
paid_at         timestamptz
created_at      timestamptz DEFAULT now()
```

---

## 13. CMS Tables

### `banners`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
title           text NOT NULL
image_url       text NOT NULL
mobile_image_url text
link_url        text
link_target     text DEFAULT '_self'
placement       text NOT NULL CHECK (placement IN ('hero', 'category', 'occasion', 'sidebar', 'popup', 'announcement'))
sort_order      integer DEFAULT 0
is_active       boolean DEFAULT true
valid_from      timestamptz
valid_until     timestamptz
created_by      uuid
created_at      timestamptz DEFAULT now()
```

### `cms_pages`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
title           text NOT NULL
slug            text NOT NULL UNIQUE
content         jsonb   -- structured content blocks
meta_title      text
meta_description text
status          text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
published_at    timestamptz
created_by      uuid
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `blog_posts`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
title           text NOT NULL
slug            text NOT NULL UNIQUE
excerpt         text
content         text   -- rich text HTML
cover_image     text
author_id       uuid REFERENCES profiles(id)
category        text
tags            text[]
status          text DEFAULT 'draft'
published_at    timestamptz
meta_title      text
meta_description text
read_time_minutes integer
view_count      integer DEFAULT 0
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

---

## 14. Admin & RBAC Tables

### `admin_users`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES auth.users(id)
full_name       text NOT NULL
email           text NOT NULL UNIQUE
role_id         uuid REFERENCES admin_roles(id)
is_active       boolean DEFAULT true
last_login_at   timestamptz
created_by      uuid
created_at      timestamptz DEFAULT now()
```

### `admin_roles`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL UNIQUE  -- 'super_admin', 'admin', 'product_manager', ...
description     text
permissions     jsonb NOT NULL DEFAULT '{}'   -- { "products.create": true, "orders.view": true }
is_system       boolean DEFAULT false   -- system roles cannot be deleted
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `admin_permissions`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
key             text NOT NULL UNIQUE   -- 'products.create', 'orders.cancel', 'users.suspend'
name            text NOT NULL
module          text NOT NULL   -- 'products', 'orders', 'customers', ...
description     text
created_at      timestamptz DEFAULT now()
```

---

## 15. Audit & Notification Tables

### `audit_logs`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
actor_id        uuid   -- admin or vendor user
actor_type      text CHECK (actor_type IN ('admin', 'vendor', 'customer', 'system'))
action          text NOT NULL   -- 'product.updated', 'order.cancelled', 'user.suspended'
entity_type     text NOT NULL   -- 'product', 'order', 'user', ...
entity_id       uuid
old_data        jsonb
new_data        jsonb
ip_address      inet
user_agent      text
created_at      timestamptz DEFAULT now()
```

### `notifications`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
type            text NOT NULL   -- 'order_confirmed', 'order_delivered', 'price_drop', ...
title           text NOT NULL
body            text NOT NULL
data            jsonb   -- contextual data (order_id, product_id, etc.)
is_read         boolean DEFAULT false
read_at         timestamptz
channel         text CHECK (channel IN ('in_app', 'email', 'sms', 'push', 'whatsapp'))
created_at      timestamptz DEFAULT now()
```

### `notification_preferences`

```sql
user_id         uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE
order_updates_email boolean DEFAULT true
order_updates_sms   boolean DEFAULT true
order_updates_push  boolean DEFAULT true
order_updates_whatsapp boolean DEFAULT true
promotions_email    boolean DEFAULT true
promotions_sms      boolean DEFAULT false
promotions_push     boolean DEFAULT true
price_alerts_email  boolean DEFAULT true
price_alerts_push   boolean DEFAULT true
festival_reminders_email boolean DEFAULT true
festival_reminders_push  boolean DEFAULT true
updated_at      timestamptz DEFAULT now()
```

---

## 16. Index Strategy

```sql
-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Product variants & inventory
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_variant ON inventory(variant_id);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_vendor ON order_items(vendor_id);
CREATE INDEX idx_order_items_delivery_date ON order_items(delivery_date);

-- Cart
CREATE INDEX idx_cart_user ON cart_items(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_cart_session ON cart_items(session_id) WHERE session_id IS NOT NULL;

-- Wishlist
CREATE INDEX idx_wishlist_user ON wishlists(user_id);

-- Reviews
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- Delivery
CREATE INDEX idx_pincode ON pincode_serviceability(pincode);
CREATE INDEX idx_slot_bookings_date ON slot_bookings(booking_date, slot_id);

-- Audit logs
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Coupons
CREATE INDEX idx_coupon_code ON coupons(code);
CREATE INDEX idx_coupon_active ON coupons(is_active) WHERE is_active = true;

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
```
