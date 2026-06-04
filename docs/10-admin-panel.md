# 10 — Admin Panel

> **Purpose:** Design of the standard admin panel modules — dashboard, product management, order management, coupons, users, reports, and analytics. The enterprise-grade extension is in `/docs/16-enterprise-admin-panel.md`.

---

## Table of Contents

1. [Admin Dashboard](#1-admin-dashboard)
2. [Product Management Module](#2-product-management-module)
3. [Category Management Module](#3-category-management-module)
4. [Order Management Module](#4-order-management-module)
5. [Customer Management Module](#5-customer-management-module)
6. [Coupon Management Module](#6-coupon-management-module)
7. [Delivery Management Module](#7-delivery-management-module)
8. [Review Management Module](#8-review-management-module)
9. [Reports Module](#9-reports-module)
10. [Settings Module](#10-settings-module)
11. [Admin UX Patterns](#11-admin-ux-patterns)

---

## 1. Admin Dashboard

### KPI Widget Grid (Row 1)

| Widget | Metric | Comparison |
|---|---|---|
| Total Revenue | Today's gross revenue | vs yesterday |
| Orders Today | Count of orders placed today | vs yesterday |
| Avg Order Value | AOV today | vs last 7 days AOV |
| Conversion Rate | Cart → Order % | vs last week |
| Active Users | Users online now | — |
| New Signups | Today's registrations | vs yesterday |

### KPI Widget Grid (Row 2)

| Widget | Metric |
|---|---|
| Pending Orders | Orders awaiting vendor action |
| Processing Orders | Orders being prepared |
| Out for Delivery | Orders with agents |
| Low Stock Products | Products below threshold |
| Pending Reviews | Reviews awaiting moderation |
| Refund Requests | Open refund requests |

### Revenue Chart

```
Type:     Line chart (daily revenue over last 30 days)
Options:  7D | 30D | 90D | 12M | Custom
Y-axis:   Revenue in ₹ (lakhs)
Overlays: Previous period comparison line
Tooltip:  Date, Revenue, Orders, AOV
Library:  Recharts
```

### Order Status Distribution

```
Type:    Donut chart
Segments: Pending | Confirmed | Processing | Packed | Shipped | Delivered | Cancelled
Colors:   Distinct per status
Tooltip:  Status name + count + percentage
```

### Top 10 Selling Products (Today)

```
Table columns: Rank | Product Image | Name | Orders | Revenue | Stock
Sortable
Clickable → Product edit page
```

### Recent Orders Feed

```
Live-updating table (Realtime subscription)
Columns: Order # | Customer | Amount | Status | Time | Actions
Actions: View | Quick Status Update
Max 10 rows, "View All" link to orders page
```

### Geographic Revenue Map (India)

```
SVG/Mapbox India map
Heat map by state revenue
Tooltip: State name, revenue, order count
```

---

## 2. Product Management Module

### Product List View

```
URL: /admin/products

Filters:
  - Status: All | Active | Draft | Archived | Out of Stock
  - Category: dropdown
  - Vendor: dropdown
  - Personalizable: toggle
  - Date Range: created_at

Search: Product name, SKU

Sort: Name | Price | Stock | Orders | Created Date | Updated Date

Table Columns:
  ☐ | Thumbnail | Name + SKU | Category | Price | Stock | Status | Vendor | Actions

Bulk Actions:
  - Activate selected
  - Archive selected
  - Delete selected (soft delete)
  - Export to CSV

Row Actions (dropdown):
  - Edit
  - Duplicate
  - View on site
  - Archive / Restore
  - Delete
```

### Product Form — Add/Edit

**Tab 1: Basic Information**
```
Product Name*        [text input, 200 chars max]
Slug*               [auto-generated from name, editable]
SKU                 [text, auto-generated or custom]
Short Description   [textarea, 500 chars]
Description         [TipTap rich text editor]
  - Bold, italic, headings, lists, links, images
Status              [Draft | Active | Archived]
```

**Tab 2: Pricing**
```
Sale Price (MRP)*   [number input, ₹]
Our Price*          [number input, ₹ — must be ≤ MRP]
Cost Price          [number input, ₹ — internal use]
Discount %          [auto-calculated, display only]
GST Category        [dropdown — 0% / 5% / 12% / 18%]
```

**Tab 3: Inventory**
```
Product Type        [Simple | Variable | Personalized | Bundle]
Track Inventory     [toggle]
Stock Quantity      [integer — if Simple]
Low Stock Alert     [integer threshold]
Delivery Lead Days  [integer]
Supports Same Day   [toggle]
Supports Midnight   [toggle]
Supports Express    [toggle]

If Variable:
  Variant Type      [Weight | Size | Color | Flavor | Count]
  [+ Add Variant]
  Variant table:
    Name | SKU | Price | Stock | Image | Active | Actions
```

**Tab 4: Media**
```
Primary Image*      [dropzone, single image]
Gallery Images      [multi-dropzone, drag to reorder]
Product Video       [URL input or upload]
Alt Text            [text per image]
```

**Tab 5: Classification**
```
Category*           [hierarchical dropdown]
Brand               [dropdown, searchable]
Occasions           [multi-select chips]
Recipient Tags      [multi-select: him/her/parents/kids/colleagues]
Product Tags        [tag input with suggestions]
Collections         [multi-select]
Is Featured         [toggle]
Is Bestseller       [toggle]
Is New              [toggle — auto-removes after 30 days]
```

**Tab 6: Personalization** (shown if type = 'personalized')
```
Allows Text Input   [toggle]
  Text Field Label  [text]
  Max Characters    [integer]
Allows Image Upload [toggle]
  Image Field Label [text]
  Min Width (px)    [integer]
  Min Height (px)   [integer]
Font Options        [multi-select fonts]
Color Options       [color picker multi-select]
Preview Template    [image upload — the template SVG/PNG]
Extra Lead Days     [integer]
```

**Tab 7: SEO**
```
Meta Title          [text, 60 chars, auto-filled from name]
Meta Description    [textarea, 160 chars]
Keywords            [tag input]
Preview             [Google SERP preview widget]
```

**Sidebar: Publish Controls**
```
Status Toggle       [Draft / Active]
Visibility          [Public / Hidden / Password Protected]
Publish Date        [datetime — schedule publish]
Vendor              [dropdown — who fulfills this]
[Save Draft] [Publish] [View on Site]
```

---

## 3. Category Management Module

### Category Tree View

```
URL: /admin/categories

Visual: Drag-drop sortable tree
Expand/collapse subcategories
Inline edit: Name, Status toggle

Category Card shows:
  - Name + icon
  - Slug
  - Product count
  - Status badge
  - Edit | Add subcategory | Delete actions
```

### Category Form

```
Name*           [text]
Slug*           [auto or custom]
Parent          [dropdown — select parent category or "Root"]
Description     [textarea]
Image           [image upload]
Icon            [icon picker or SVG upload]
Sort Order      [integer]
Meta Title      [text]
Meta Description [text]
Is Active       [toggle]
```

### Occasion Management

```
Same tree-view interface
Additional fields:
  Is Seasonal     [toggle]
  Season Start    [date picker]
  Season End      [date picker]
  Banner Image    [upload]
  Hero Image      [upload]
```

---

## 4. Order Management Module

### Orders List

```
URL: /admin/orders

Status Filter Tabs:
  All | Pending | Confirmed | Processing | Packed | Shipped | Delivered | Cancelled | Refund Requests

Additional Filters:
  Date Range    | Vendor | Delivery Type | Payment Method | City | Amount Range

Search:
  Order Number | Customer Name | Customer Phone | Product Name

Sort:
  Created Date ↓ (default) | Amount | Status

Columns:
  Order # | Date | Customer | Items | Total | Delivery Date | Status | Vendor | Actions

Export: CSV | Excel (filtered results)
```

### Order Detail Page

**Order Header**
```
Order #CV-2024-001234    [Status Badge]    [Print] [Export PDF]
Placed: Dec 25, 2024 at 2:30 PM
```

**Order Timeline** (editable by admin)
```
● Order Placed       Dec 25, 2024 2:30 PM
● Payment Confirmed  Dec 25, 2024 2:31 PM
○ Processing         [Mark as Processing] ← action button
○ Packed
○ Shipped
○ Out for Delivery
○ Delivered
```

**Order Items Table**
```
Image | Product | Variant | Qty | Unit Price | Total | Delivery Details | Status | Actions
                                                       Recipient: [name]
                                                       Date: Dec 26
                                                       Slot: Morning
                                                       Address: [...]
```

**Customer Info Panel**
```
Name:    Priya Sharma
Email:   priya@gmail.com
Phone:   +91 98765 43210
Orders:  12 total | ₹14,500 LTV
[View Customer Profile]
```

**Payment Info Panel**
```
Payment Method: UPI (GPay)
Amount:         ₹1,499
Gateway ID:     pay_xyz123
Status:         Success
Coupon:         FLAT100 (-₹100)
Loyalty Used:   50 points (-₹50)
```

**Admin Actions**
```
[Change Status]              → Status dropdown + optional note
[Assign Vendor]              → Vendor dropdown
[Initiate Refund]            → Amount input + reason
[Add Internal Note]          → Textarea (not visible to customer)
[Cancel Order]               → Reason + confirmation
[Resend Confirmation Email]
```

---

## 5. Customer Management Module

### Customer List

```
Columns: Avatar | Name | Email | Phone | Orders | LTV | Joined | Status | Actions

Filters:
  Status: All | Active | Suspended | Banned
  Date: Registration date range
  LTV: Min/max lifetime value
  Orders: Min/max order count

Search: Name, Email, Phone
```

### Customer Detail Page

```
Header:
  Avatar | Name | Email | Status | [Suspend] [Ban] [Reset Password]

Tabs:
  Overview | Orders | Reviews | Addresses | Wishlist | Wallet

Overview:
  - Stats: Total Orders, LTV, AOV, Last Order Date
  - Loyalty: Points, Tier, History
  - Wallet: Balance, Transactions

Orders tab:
  - Full order history (same as order list, filtered to customer)

Notes:
  - Admin can add private notes to customer profile
```

---

## 6. Coupon Management Module

### Coupon List

```
Columns: Code | Name | Type | Value | Used/Limit | Status | Valid Until | Actions

Filter: Active | Inactive | Expired
```

### Coupon Form

```
Code*              [text, UPPERCASE, no spaces — auto-generate option]
Name*              [internal name for reference]
Description        [optional public-facing description]

Discount Type*:
  ○ Percentage Off
  ○ Fixed Amount Off
  ○ Free Shipping
  ○ Buy X Get Y

Discount Value*    [number — % or ₹ based on type]
Maximum Discount   [cap — for percentage coupons, e.g., max ₹500 off]
Minimum Order      [minimum cart value to apply]

Applicability:
  ○ All products
  ○ Specific categories  [multi-select]
  ○ Specific products    [product search]
  ○ Specific brands      [multi-select]

Exclude:
  Excluded categories  [multi-select]
  Excluded products    [product search]

Usage Limits:
  Total Uses          [integer or unlimited]
  Per User Limit      [integer, default 1]

User Restrictions:
  ☐ First order only
  ☐ New users only
  ☐ Specific user emails [textarea]

Validity:
  Valid From*  [datetime]
  Valid Until  [datetime or no expiry]

[Save] [Preview Coupon]
```

---

## 7. Delivery Management Module

### Delivery Zones

```
Zone List:
  Zone Name | Cities | Pincode Count | Status | Actions

Zone Form:
  Name*          [text]
  Cities         [multi-tag input]
  Pincodes       [bulk paste textarea — one per line or CSV]
  [Import CSV]   [for bulk pincode upload]
```

### Delivery Slots Configuration

```
Slot List (per zone):
  Slot Name | Type | Hours | Capacity | Surcharge | Days | Status

Slot Form:
  Zone*           [dropdown]
  Slot Name*      [e.g., "Morning (6 AM - 10 AM)"]
  Slot Type*      [Standard | Same Day | Midnight | Express]
  Start Time*     [time picker]
  End Time*       [time picker]
  Cutoff Time     [time — order cutoff for same-day]
  Max Capacity*   [integer]
  Available Days  [checkboxes: Mon Tue Wed Thu Fri Sat Sun]
  Surcharge       [₹ amount]
  Is Active       [toggle]
```

### Pincode Bulk Management

```
Upload CSV: pincode, city, state, is_serviceable, same_day, midnight, express, cod, lead_days
Download Template CSV
View/Edit individual pincodes
```

---

## 8. Review Management Module

### Review Queue

```
Status Tabs: Pending (badge count) | Approved | Rejected

Columns: Product | Customer | Rating | Review Text | Photos | Date | Actions

Pending Review Card:
  [Product thumbnail + name]
  ★★★★☆ 4.0
  "Great quality flowers! Fresh and beautiful arrangement. Delivered on time."
  📷 2 photos
  By: Priya S. | Verified Purchase | Dec 25, 2024
  
  [Approve] [Reject] [Highlight] [View Product]

Reject Flow:
  Required: Select rejection reason
  Options: Spam | Inappropriate content | Not about product | Fake review
  Optional: Note to reviewer
```

---

## 9. Reports Module

### Revenue Report

```
Date Range: Custom | Today | Week | Month | Quarter | Year

Metrics:
  - Gross Revenue
  - Net Revenue (after refunds)
  - Average Order Value
  - Order Count
  - Refund Amount
  - Refund Rate

Charts:
  - Revenue line chart over time
  - Revenue by category (bar chart)
  - Revenue by payment method (donut)
  - Revenue by delivery type

Export: CSV | Excel | PDF
```

### Order Report

```
Metrics:
  - Total Orders
  - Orders by status
  - Cancellation rate
  - Average fulfillment time
  - Delivery on-time rate

Filters: Date, Status, Vendor, Category, City
```

### Product Report

```
Top Performers:
  - By Revenue | By Orders | By Views | By Conversion Rate

Low Performers:
  - Zero orders in 30 days
  - Low rating (<3.0)

Inventory Report:
  - Out of stock products
  - Low stock (< threshold)
  - Overstock (>500 units, no orders)
```

### Customer Report

```
Metrics:
  - Total Customers
  - New vs Returning
  - Customer Lifetime Value (CLV) distribution
  - Churn rate (no order in 90 days)
  - Geographic distribution
  
Cohort Analysis:
  - Monthly cohorts
  - Retention by cohort
```

---

## 10. Settings Module

### General Settings

```
Company Name       [text]
Tagline            [text]
Contact Email      [email]
Support Phone      [phone]
Address            [textarea]
GST Number         [text]
Currency           [INR — locked]
Timezone           [Asia/Kolkata — locked]
Logo               [image upload]
Favicon            [image upload]
```

### Payment Settings

```
Razorpay:
  Key ID*          [text — from Razorpay dashboard]
  Key Secret*      [masked text]
  Webhook Secret*  [masked text]
  Test Mode        [toggle — switches between test/live keys]

COD Settings:
  Enable COD       [toggle]
  COD Fee          [₹ amount]
  COD Pincodes     [comma-separated or CSV upload]
  COD Max Order    [₹ limit for COD]
```

### Email Settings (SMTP)

```
Provider           [Resend | SendGrid | SMTP Custom]
From Email*        [email]
From Name*         [text]
API Key*           [masked]
[Send Test Email]
```

### SMS Settings

```
Provider           [Twilio | MSG91 | TextLocal]
Account SID*       [masked]
Auth Token*        [masked]
From Number*       [text]
[Send Test SMS]
```

### Notification Templates

```
List of templates:
  - Order Confirmation (Email + SMS)
  - Order Dispatched (Email + SMS)
  - Order Delivered (Email + SMS + WhatsApp)
  - Review Request (Email)
  - Password Reset (Email)
  - OTP (SMS)
  - Abandoned Cart (Email)

Template Editor:
  Subject*      [text with variables: {{customer_name}}, {{order_number}}]
  Body*         [rich text with HTML variables]
  Preview       [rendered preview with sample data]
```

---

## 11. Admin UX Patterns

### Table Standards

```
- Minimum 8 rows visible without scroll
- Sticky header on scroll
- Column resize on drag
- Column visibility toggle
- Persistent filter state (URL params)
- Keyboard navigation (Tab through rows)
- Row click → Detail view OR inline expand
```

### Form Standards

```
- Validation on blur (individual fields)
- Full validation on submit
- Auto-save draft every 60 seconds
- Unsaved changes warning on navigate away
- Success toast on save
- Error inline + toast on failure
```

### Confirmation Dialogs

```
For destructive actions:
  - Title: "Delete [Item Name]?"
  - Body: Consequence explanation
  - Type confirmation text for high-risk actions
  - Cancel (default focus) / Confirm (destructive styling)
```

### Admin Notifications

```
Real-time notification bell (top bar):
  - New order placed
  - Vendor application submitted
  - Low stock alert
  - Refund request
  - Review to moderate

Notification dropdown:
  - Latest 10 notifications
  - "Mark all read" action
  - "View All" → /admin/notifications
```
