# 11 — Vendor Panel

> **Purpose:** Complete design of the vendor portal — enabling flower shops, bakeries, gift vendors, and artisans to manage their products, fulfill orders, track earnings, and communicate with the Combovibes platform.

---

## Table of Contents

1. [Vendor Onboarding](#1-vendor-onboarding)
2. [Vendor Dashboard](#2-vendor-dashboard)
3. [Product Management (Vendor)](#3-product-management-vendor)
4. [Order Fulfillment](#4-order-fulfillment)
5. [Inventory Management](#5-inventory-management)
6. [Earnings & Payouts](#6-earnings--payouts)
7. [Vendor Profile Management](#7-vendor-profile-management)
8. [Reports & Analytics](#8-reports--analytics)
9. [Support & Communication](#9-support--communication)
10. [Vendor UX Patterns](#10-vendor-ux-patterns)
11. [Database Tables](#11-database-tables)
12. [Commission Structure](#12-commission-structure)

---

## 1. Vendor Onboarding

### Application Flow

```
1. Vendor visits /vendor/apply
2. Fills Application Form
3. Uploads KYC Documents
4. Submits Application
5. Admin reviews (1-3 business days)
6. Admin approves/rejects
7. If approved: Welcome email with login credentials
8. Vendor logs in → Completes Profile Setup Wizard
9. Adds first products
10. Products reviewed by admin
11. Products go live
12. First orders received
```

### Application Form

**Business Details**
```
Business Name*           [text]
Business Type*           [Flower Shop | Bakery | Gift Artisan | Fashion | Other]
Business Description     [textarea, 500 chars]
Website                  [URL, optional]
Instagram Profile        [URL, optional]
Years in Business        [integer]
Business Address*        [full address form]
Service Area*            [pincodes served — can add multiple]
```

**Contact Details**
```
Owner Name*              [text]
Owner Phone*             [mobile, +91]
Owner Email*             [email — becomes login]
WhatsApp Number          [mobile]
```

**Financial Details**
```
GST Number               [text — optional, but required for GST invoice]
PAN Number*              [text]
Bank Account Number*     [masked on save]
IFSC Code*               [text, validates bank]
Bank Name                [auto-filled from IFSC]
Account Holder Name*     [text]
```

**KYC Documents Upload**
```
PAN Card*                [PDF/JPG, max 5MB]
GST Certificate          [PDF/JPG, optional]
Bank Passbook/Statement* [PDF/JPG, max 5MB]
Business Registration    [PDF/JPG, optional]
Aadhaar Card*            [PDF/JPG, max 5MB]
Shop Photos              [JPG, up to 5 images]
```

**Terms & Acceptance**
```
☐ I agree to the Combovibes Vendor Agreement
☐ I confirm all information is accurate
[Submit Application]
```

### Profile Setup Wizard (Post-Approval)

```
Step 1: Logo & Cover Photo upload
Step 2: Operating Hours (weekday/weekend/holiday)
Step 3: Delivery Capabilities (same-day? midnight? express?)
Step 4: Add first product walkthrough
Step 5: Payout setup confirmation
[Go to Dashboard]
```

---

## 2. Vendor Dashboard

### URL: `/vendor/dashboard`

### KPI Cards (Row 1)

| Card | Metric | Period |
|---|---|---|
| Today's Orders | Order count | Today |
| Today's Revenue | Gross revenue | Today |
| Pending Fulfillment | Orders awaiting action | Current |
| This Month's Earnings | Net payout amount | This month |

### KPI Cards (Row 2)

| Card | Metric |
|---|---|
| Total Products | Active product count |
| Average Rating | Across all products |
| Fulfillment Rate | Orders fulfilled on time (%) |
| Low Stock Items | Products below threshold |

### Orders Requiring Action (Priority Section)

```
Alert card at top — only shown when there are orders needing attention

"⚠️ You have 3 orders to fulfill today!"

Order list:
  Order #CV-2024-001 | Delivery: Today, Morning | ₹499 | [View & Fulfill]
  Order #CV-2024-002 | Delivery: Today, Evening | ₹1,299 | [View & Fulfill]
```

### Revenue Chart

```
Type: Bar chart (last 30 days daily earnings)
Toggle: Revenue | Orders
Period selector: 7D | 30D | 3M
```

### Recent Orders Table

```
Columns: Order # | Date | Product | Amount | Delivery Date | Status | Action

Max 10 rows
[View All Orders]
```

### Top Products

```
Table: Product | Orders (30 days) | Revenue | Rating | Stock
Max 5 products
[View All Products]
```

### Performance Metrics Card

```
Metrics:
  On-Time Delivery:  94% (green)
  Order Acceptance:  98% (green)
  Return Rate:       2.1% (green)
  Customer Rating:   4.6 / 5.0 ★
```

---

## 3. Product Management (Vendor)

### Product List

```
URL: /vendor/products

Status Tabs: All | Active | Draft | Out of Stock | Archived

Search: Product name

Columns: Thumbnail | Name | Price | Stock | Status | Rating | Orders | Actions

Quick Actions (inline row):
  [Edit Stock] — quick stock update without full edit
  [Edit Price]
  [Toggle Status]

Row Actions:
  Edit | Duplicate | Archive | View on site
```

### Add/Edit Product Form

**Vendor product form is a simplified version of admin form:**

```
Basic Info:
  Product Name*
  Short Description*
  Description* [rich text]
  Category* [limited to vendor's approved categories]

Pricing:
  Our Price* (the vendor's selling price)
  [Note: MRP set by platform/admin in some cases]

Images:
  Primary Image* + Gallery (max 10)

Variants:
  [Same variant builder as admin, but limited to pre-approved variant types]

Inventory:
  Stock Quantity per variant

Product Features:
  Same Day Available [toggle — requires admin approval]
  Personalization [toggle + config — if approved by admin]

[Save Draft] [Submit for Review]
```

**Review Process:**
```
New Vendor Products:
  → status: 'pending_review'
  → Admin reviews (within 24 hours)
  → Approved → status: 'active'
  → Rejected → notification with reason

Existing Vendor Products (after trust earned):
  → Minor edits (price, stock) → instant
  → Major edits (description, images) → pending review
```

---

## 4. Order Fulfillment

### Orders List

```
URL: /vendor/orders

Priority Tabs:
  [🔴 Action Required (3)] | [🟡 In Progress] | [🟢 Completed] | All | Cancelled

Date Filter: Today | Tomorrow | This Week | Custom

Columns: Order # | Product | Recipient | Delivery Date/Slot | Special Notes | Status | Action
```

### Order Fulfillment Detail

```
URL: /vendor/orders/[id]

Header:
  Order #CV-2024-001234
  Delivery: Today, Morning (6 AM - 10 AM)
  Time remaining: 2h 30m [countdown timer if same-day]

Customer & Recipient Info:
  [For privacy: show recipient name + first 3 digits of phone only]
  Recipient: Priya Sharma (982****)
  City: Mumbai, Powai
  Delivery Note: Leave at door if not home

Product Details:
  Product: Red Roses Bouquet - 12 Stems
  Quantity: 1
  Personalization: [if any — text/image]
  Gift Message: "Happy Birthday! - With Love, Rahul"
  Add-ons: 1 × Greeting Card (Romantic), 1 × Chocolate Box

Actions by status:

PENDING → [Accept Order] or [Decline with reason]
CONFIRMED → [Mark as Prepared/Packed] [Add packing photo]
PACKED → [Mark as Handed to Agent] [Enter agent name]
```

### Fulfillment Actions

**Accept Order**
```
Vendor clicks "Accept Order"
  → order_items.status = 'confirmed'
  → Customer SMS: "Good news! Your order has been accepted."
  → Preparation deadline shown (X hours before slot)
```

**Decline Order**
```
Required: Reason for declining
  ○ Out of stock (item unavailable)
  ○ Cannot fulfill by required date
  ○ Product no longer available
  ○ Other

→ Admin notified immediately
→ Admin reassigns to another vendor or contacts customer
→ Vendor decline rate tracked (affects vendor score)
```

**Mark as Packed**
```
Optional: Upload packing photo (best practice)
→ Notification to admin
→ Delivery agent assignment begins
```

**Add Packing Photo**
```
Upload photo of prepared order
Stored in Supabase Storage
Visible to admin and customer (in tracking page)
```

---

## 5. Inventory Management

### Inventory Overview

```
URL: /vendor/inventory

View: Table with all products

Columns: Product | Variant | Current Stock | Reserved | Available | Low Stock Alert | Last Updated

Quick Edit: Click stock number → inline edit field

Bulk Stock Update: 
  Upload CSV: product_sku, variant_sku, quantity
  Or manually update each row
```

### Low Stock Alerts

```
Alert Panel (sidebar widget on dashboard):
  🔴 Red Rose Bouquet (12 stems) - Only 2 left
  🟡 Birthday Cake Vanilla 1kg - 5 remaining
  ⚠️ Photo Mug - 0 in stock (PAUSED)

Click → Quick restock modal
  Current Stock: 2
  Add Quantity: [  50  ]
  New Total: 52
  [Update Stock]
```

### Inventory History

```
Log of all stock changes:
  Date | Product | Change | Reason | Changed By (system/manual)
  
  Dec 25, 2024 | Red Roses 12 | -1 | Order #CV-001 | System
  Dec 25, 2024 | Red Roses 12 | +50 | Manual restock | Vendor
```

---

## 6. Earnings & Payouts

### Earnings Overview

```
URL: /vendor/earnings

Summary Cards:
  Total Earned (All Time): ₹1,24,500
  This Month:              ₹18,200
  Last Month:              ₹15,400
  Pending Payout:          ₹12,100
  Paid Out:                ₹1,12,400
```

### Earnings Breakdown

```
Commission Structure:
  Gross Revenue:        ₹18,200
  Platform Commission:  ₹3,640  (20%)
  Payment Gateway Fee:  ₹364    (2%)
  Net Earnings:         ₹14,196

[Commission breakdown tooltip: Hover to see calculation]
```

### Payout History Table

```
Columns: Period | Gross | Commission | Gateway Fee | Net | Status | Date Paid | Reference

Statuses:
  Pending     (gray) — not yet scheduled
  Processing  (blue) — transfer initiated
  Paid        (green) — money in bank
  Failed      (red) — retry required
```

### Payout Schedule

```
Payout Frequency: Weekly (every Monday)
Payout Cutoff:    Orders delivered by last Sunday
Bank Account:     SBI ****4321 [Change]
Minimum Payout:   ₹500 (else carries to next cycle)

Next Payout: Monday, Dec 30, 2024
Estimated Amount: ₹14,196
```

### Transaction-Level Earnings

```
Per-Order Revenue Log:
  Order # | Product | Date Delivered | Sale Price | Commission | Your Earning
  
  CV-001  | Red Roses | Dec 25 | ₹499 | ₹100 | ₹399
  CV-002  | Cake 1kg  | Dec 25 | ₹799 | ₹160 | ₹639
```

---

## 7. Vendor Profile Management

### Business Profile

```
URL: /vendor/profile

Editable fields:
  Business Name
  Description
  Logo (upload)
  Cover/Banner Image
  Social Links (Instagram, Facebook, Website)
  Operating Hours (per day)
  Service Pincodes (add/remove)
  Special Capabilities (same-day, midnight, custom orders)
```

### Bank Account Details

```
URL: /vendor/profile/bank

Current Account:
  Bank: State Bank of India
  Account: ****4321
  IFSC: SBIN0001234

[Change Bank Account] → requires admin verification before next payout
```

### KYC Documents

```
URL: /vendor/profile/documents

Document status table:
  PAN Card:            ✓ Verified
  Aadhaar Card:        ✓ Verified
  GST Certificate:     ⚠️ Pending verification
  Bank Statement:      ✓ Verified

[Upload New Document]
```

---

## 8. Reports & Analytics

### Sales Report

```
Period: Daily | Weekly | Monthly | Custom

Metrics:
  - Total Orders
  - Total Revenue
  - Net Earnings
  - Average Order Value
  - Top Selling Products
  - Top Occasions (Birthday, Anniversary, etc.)

Charts:
  - Revenue line chart
  - Orders by day of week (bar chart)
  - Revenue by product category (donut)

Export: CSV
```

### Performance Report

```
Metrics:
  - Order Acceptance Rate (%)
  - On-Time Fulfillment Rate (%)
  - Average Preparation Time
  - Return Rate (%)
  - Customer Rating (avg)
  - Review Count

Trend: Month-over-month comparison

[Download Performance Report PDF]
```

---

## 9. Support & Communication

### Support Tickets

```
URL: /vendor/support

Ticket List:
  #ID | Subject | Status | Priority | Last Updated

Ticket Categories:
  - Order issue
  - Payment/payout question
  - Product listing help
  - Technical issue
  - Policy question
  - Other

Create Ticket:
  Category*  [dropdown]
  Order ID   [optional — link to specific order]
  Subject*   [text]
  Message*   [textarea]
  Attachments [file upload]

Ticket Timeline:
  Thread-based conversation with admin support
  Status: Open | In Progress | Resolved
  Response SLA: 24 hours (displayed to vendor)
```

### Vendor Notifications

```
Notification Center:
  - New order received
  - Order deadline approaching (2 hours before)
  - Order cancelled
  - Payout processed
  - Product review received
  - Low stock alert
  - Admin message/announcement
  - KYC document status update

Notification Preferences:
  Each type: Email | SMS | In-app toggle
```

---

## 10. Vendor UX Patterns

### Mobile-First Vendor Panel

```
Vendors primarily use mobile to:
  - View and fulfill orders
  - Update inventory
  - Check earnings

Mobile patterns:
  - Bottom navigation: Dashboard | Orders | Products | Earnings | Profile
  - Swipe to reveal order actions
  - One-tap order acceptance
  - Camera integration for packing photos
```

### Order Urgency Indicators

```
Color coding for delivery urgency:
  🔴 Red:    < 1 hour until delivery slot starts
  🟠 Orange: 1-3 hours
  🟡 Yellow: 3-6 hours
  🟢 Green:  6+ hours or future date
```

### Vendor App Banner

```
Show native app promotion for vendors:
  "Get instant order alerts! Download the Combovibes Vendor App"
  [App Store] [Google Play]
```

---

## 11. Database Tables

### `vendor_notifications`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
vendor_id       uuid REFERENCES vendors(id)
type            text  -- 'new_order', 'order_cancelled', 'payout_processed', 'low_stock'
title           text
body            text
data            jsonb
is_read         boolean DEFAULT false
created_at      timestamptz DEFAULT now()
```

### `vendor_performance_metrics`

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
vendor_id       uuid REFERENCES vendors(id)
period_start    date
period_end      date
total_orders    integer DEFAULT 0
accepted_orders integer DEFAULT 0
fulfilled_orders integer DEFAULT 0
on_time_orders  integer DEFAULT 0
cancelled_orders integer DEFAULT 0
returned_orders  integer DEFAULT 0
total_revenue   numeric(12,2) DEFAULT 0
average_rating  numeric(3,2)
review_count    integer DEFAULT 0
calculated_at   timestamptz DEFAULT now()
```

### `vendor_product_reviews`

```sql
-- Allows admin to track per-vendor product quality issues
vendor_id       uuid REFERENCES vendors(id)
product_id      uuid REFERENCES products(id)
review_count    integer DEFAULT 0
average_rating  numeric(3,2)
updated_at      timestamptz DEFAULT now()
PRIMARY KEY (vendor_id, product_id)
```

---

## 12. Commission Structure

### Default Commission Rates

| Category | Commission |
|---|---|
| Flowers | 18% |
| Cakes | 20% |
| Plants | 15% |
| Chocolates | 22% |
| Personalized Gifts | 25% |
| Fashion | 20% |
| Electronics | 12% |
| Combos | 18% |

### Commission Rules

```
Payment gateway fee: 2% (deducted before vendor gets paid)
GST on commission: 18% (charged to vendor on commission amount)

Example calculation:
  Order Value:        ₹1,000
  Platform Commission (20%): ₹200
  GST on Commission (18%):   ₹36
  Payment Gateway (2%):      ₹20
  Net to Vendor:             ₹744

Vendor earns ₹744 on a ₹1,000 order (74.4% effective split)
```

### Commission Tiers (Loyalty)

| Tier | Monthly Revenue | Commission |
|---|---|---|
| Basic | < ₹50,000 | Standard |
| Silver | ₹50,000 – ₹2,00,000 | -1% |
| Gold | ₹2,00,000 – ₹10,00,000 | -2% |
| Platinum | > ₹10,00,000 | -3% + dedicated support |
