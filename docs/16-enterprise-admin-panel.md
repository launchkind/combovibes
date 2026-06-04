# 16 — Enterprise Admin Panel

> **Purpose:** Complete enterprise-grade administration system design for Combovibes — capable of managing the entire gifting business at scale (1M+ orders/year) from a single command center.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Admin Dashboard](#2-admin-dashboard)
3. [Product Management](#3-product-management)
4. [Category & Taxonomy Management](#4-category--taxonomy-management)
5. [Order Management](#5-order-management)
6. [Customer Management](#6-customer-management)
7. [Coupon & Promotion Management](#7-coupon--promotion-management)
8. [Delivery Management](#8-delivery-management)
9. [Vendor Management](#9-vendor-management)
10. [Content Management System (CMS)](#10-content-management-system-cms)
11. [Marketing Module](#11-marketing-module)
12. [Review Management](#12-review-management)
13. [Reports & Analytics](#13-reports--analytics)
14. [Settings & Configuration](#14-settings--configuration)
15. [Role-Based Access Control (RBAC)](#15-role-based-access-control-rbac)
16. [Audit Log System](#16-audit-log-system)
17. [Supabase Integration](#17-supabase-integration)
18. [Screen Inventory](#18-screen-inventory)
19. [Component Inventory](#19-component-inventory)
20. [Future Scalability Strategy](#20-future-scalability-strategy)

---

## 1. Architecture Overview

### Admin Panel Stack

```
Frontend:  Next.js 15 App Router (route group: (admin))
UI:        shadcn/ui + Tailwind CSS + Recharts
Auth:      Supabase Auth + custom admin_users table
API:       Next.js Route Handlers + Supabase service role client
State:     TanStack Query (server state) + Zustand (UI state)
Tables:    @tanstack/react-table (TanStack Table v8)
Forms:     React Hook Form + Zod
Exports:   xlsx (Excel), jsPDF (PDF), Papa Parse (CSV)
Charts:    Recharts
Rich Text: TipTap
```

### Security Architecture

```
1. Supabase Auth session verification on every request
2. admin_users table check (is this user an admin?)
3. Role-permission matrix check (does this role have this permission?)
4. Supabase service role used only in API routes (never client-side)
5. All admin actions logged to audit_logs table
6. 2FA enforced for Super Admin accounts
7. IP allowlist option for admin routes (Vercel Middleware)
8. Rate limiting on admin API routes
9. CSRF protection via Next.js built-in
10. Sensitive data masking (phone, bank account display)
```

### Admin URL Namespace

```
/admin/*     → Admin Panel (protected by middleware)
/api/admin/* → Admin API (protected by auth + RBAC middleware)
```

---

## 2. Admin Dashboard

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR  │           MAIN CONTENT AREA                 │
│           │                                             │
│ [Logo]    │  [Breadcrumb] [Page Title] [Actions]        │
│           │  ─────────────────────────────────────      │
│ Dashboard │  [KPI Row 1: Revenue | Orders | Users | ...] │
│ ▸ Catalog │  [KPI Row 2: Pending | Processing | ...    ] │
│ ▸ Orders  │  ─────────────────────────────────────      │
│ ▸ Customers│ [Revenue Chart (line, 30 days)]            │
│ ▸ Vendors │  [Order Distribution (donut)]               │
│ ▸ Marketing│ ─────────────────────────────────────      │
│ ▸ Reports │  [Top Products] │ [Recent Orders Feed]      │
│ ▸ CMS     │  ─────────────────────────────────────      │
│ ▸ Settings│  [Geographic Map] │ [Real-time Activity]    │
│ ▸ Access  │                                             │
│ ▸ Audit   │                                             │
└─────────────────────────────────────────────────────────┘
```

### KPI Widgets — Row 1 (Revenue)

| Widget | Metric | Breakdown |
|---|---|---|
| Today's Revenue | ₹X | Orders count |
| Weekly Revenue | ₹X | % change vs last week |
| Monthly Revenue | ₹X | % change vs last month |
| Annual Revenue | ₹X | % change vs last year |

### KPI Widgets — Row 2 (Orders)

| Widget | Count | Color |
|---|---|---|
| Total Orders (Today) | X | Neutral |
| Pending Confirmation | X | Orange |
| Processing | X | Blue |
| Out for Delivery | X | Teal |
| Delivered Today | X | Green |
| Cancelled Today | X | Red |
| Refund Requests | X | Red badge |

### KPI Widgets — Row 3 (Business Health)

| Widget | Metric |
|---|---|
| Active Users (last 7 days) | X users |
| New Users (Today) | X signups |
| Active Products | X products |
| Low Stock Alerts | X products |
| Active Vendors | X vendors |
| Pending Vendor Applications | X |
| Reviews Pending Moderation | X |
| Conversion Rate | X% |

### Revenue Analytics Section

```
Component: RevenueChart
Type:       Multi-line chart
Lines:      Revenue | Orders | AOV
Period:     7D | 30D | 90D | 12M | Custom
Comparison: Toggle prior period overlay

Component: RevenueByCategory
Type:       Horizontal bar chart
X-axis:     Revenue (₹)
Y-axis:     Category names
Period:     Selectable

Component: RevenueByCity
Type:       India map heatmap (SVG-based)
Tooltip:    City | Revenue | Orders
```

### Order Analytics Section

```
Component: OrderStatusDistribution
Type:       Donut chart
Segments:   All order statuses
Inner text: Total orders count

Component: OrderFulfillmentRate
Type:       Gauge chart
Metric:     % orders fulfilled on time
Threshold:  90% = green, 70-90% = yellow, <70% = red

Component: AverageOrderValue
Type:       Bar chart over time
```

### Real-Time Activity Feed

```
Component: ActivityFeed
Updates:   Supabase Realtime subscription
Shows:
  - New order placed: "Order #CV-001 placed | ₹799 | Mumbai"
  - Payment failed: "Payment failed for #CV-002"
  - Vendor accepted: "Vendor FlowerHub accepted Order #CV-003"
  - Review submitted: "New review for Red Roses Bouquet ★★★★★"
  
Update frequency: Real-time (Realtime channel)
Max items: 20 (FIFO)
```

### Top Selling Products Widget

```
Table:
  Rank | Thumbnail | Product Name | Orders Today | Revenue | Stock | Trend
  
Stock column:
  Green: >50 units
  Yellow: 10-50 units
  Red: <10 units
  
Trend: sparkline (mini 7-day orders chart)
```

---

## 3. Product Management

### Product List Features

```
Advanced Filtering:
  Status:          All | Active | Draft | Archived | Out of Stock | Pending Review
  Category:        Multi-level dropdown tree
  Brand:           Dropdown
  Vendor:          Dropdown
  Occasion:        Multi-select
  Delivery Types:  Checkboxes (same_day, midnight, express)
  Price Range:     Dual slider
  Stock Range:     Min/Max input
  Rating:          Min rating filter
  Flags:           Personalizable | Bestseller | Featured | New
  Date:            Created / Updated date range

Columns (configurable visibility):
  ☐ Thumbnail
  ☐ Name + SKU
  ☐ Category
  ☐ Vendor
  ☐ Sale Price
  ☐ MRP
  ☐ Discount %
  ☐ Stock (Available)
  ☐ Reserved
  ☐ Status
  ☐ Orders (30 days)
  ☐ Rating
  ☐ Created Date
  ☐ Actions

Bulk Operations:
  ✓ Activate (draft → active)
  ✓ Deactivate (active → draft)
  ✓ Archive
  ✓ Delete (soft delete, requires confirmation)
  ✓ Assign to Category
  ✓ Apply Discount (% input → apply to selected)
  ✓ Remove Discount (restore to MRP price)
  ✓ Update Stock (+ or - fixed amount)
  ✓ Assign Vendor
  ✓ Export to CSV/Excel
  ✓ Duplicate (creates draft copies)

Row Context Menu:
  Edit | Duplicate | View on Site | Preview | Archive | Delete

Inline Edits:
  - Stock: Click to edit
  - Price: Click to edit
  - Status: Toggle switch
```

### Product Form — Full Enterprise Version

```
Tab 1: Basic Info
  Product Name*              [text, 200 chars, real-time slug preview]
  Slug*                      [auto-generated, manually editable]
  SKU*                       [unique, auto-generated option]
  Short Description*         [textarea, 500 chars, char counter]
  Long Description*          [TipTap rich text editor]
    ─ Toolbar: Bold | Italic | H2/H3 | Lists | Links | Images | Tables | Code | Clear
  Status                     [Draft | Active | Archived]
  Visibility                 [Public | Hidden (no-index) | Password]
  Featured                   [toggle]
  Bestseller                 [toggle]
  New Product                [toggle + auto-expire date]

Tab 2: Pricing & Tax
  Sale Price (MRP)*          [₹ — displayed to customer as original price]
  Our Price*                 [₹ — must be ≤ MRP]
  Cost Price                 [₹ — internal, for margin calculation]
  Margin                     [auto-calculated: (Our Price - Cost) / Our Price × 100]
  Discount %                 [auto-calculated and displayed]
  GST Category*              [0% | 5% | 12% | 18% dropdown]
  Price Type                 [Inclusive of GST | Exclusive (B2B)]
  
  Pricing Rules:
    [+ Add Rule]
    Rule: [Seasonal] [Percentage] [15]% OFF — Valid [Dec 1] to [Jan 5]

Tab 3: Inventory & Shipping
  Product Type*              [Simple | Variable | Personalized | Bundle]
  Track Inventory            [toggle]
  
  If Simple:
    Stock Quantity*          [integer]
    Low Stock Threshold      [integer, triggers alert]
    Allow Backorders         [toggle]
  
  If Variable:
    Variant Attribute*       [Weight | Size | Color | Flavor | Count | Material]
    [Variant Builder Table]
      Name | SKU | Price | MRP | Stock | Low Stock | Image | Active | Delete
    [+ Add Variant]
    
  Shipping:
    Weight (grams)*          [integer]
    Dimensions (cm)          [L × W × H]
    Is Fragile               [toggle → special packaging flag]
    
  Delivery Options:
    Lead Time (days)*        [integer]
    Same Day Delivery        [toggle]
    Midnight Delivery        [toggle]
    Express (3-hour)         [toggle]
    Delivery Cutoff Time     [time picker — for same-day]
    
  Personalization:
    Is Personalizable        [toggle → reveals personalization config]
    [See Personalization Tab]

Tab 4: Media
  Primary Image*             [Dropzone: JPG/PNG/WebP, max 10MB]
    → Auto-converts to WebP on upload
    → Thumbnail generated at 400×400
    → Full at 1200×1200
    
  Gallery Images             [Multi-dropzone, drag to reorder, max 20]
  Product Video URL          [YouTube/Vimeo embed or upload]
  360° Images                [future — image sequence upload]
  
  Per-image:
    Alt Text                 [text, for SEO + accessibility]
    Caption                  [optional]
    Variant Link             [link image to specific variant]

Tab 5: Classification
  Category*                  [hierarchical dropdown, search-enabled]
  Subcategory                [auto-filtered by category selection]
  Brand                      [dropdown, searchable + "Add New" quick-action]
  Vendor*                    [dropdown of approved vendors]
  
  Occasions                  [multi-select chips]
    Searchable list of all occasions
    
  Recipient Tags             [multi-select]
    ☐ For Her | ☐ For Him | ☐ For Parents | ☐ For Kids | ☐ For Colleagues | ☐ For Boss
    
  Mood Tags                  [multi-select]
    ☐ Romantic | ☐ Fun | ☐ Formal | ☐ Heartfelt | ☐ Playful | ☐ Elegant
    
  Collections                [multi-select searchable]
  
  Product Tags               [tag input with suggestions from existing tags]

Tab 6: Personalization (if personalizable)
  Allow Text Input           [toggle]
    Field Label*             [e.g., "Enter name for the cake"]
    Placeholder              [e.g., "e.g., Happy Birthday Priya!"]
    Max Characters*          [integer]
    Required                 [toggle]
    Position on Product      [x, y, width, height — pixel coordinates]
    
  Allow Image Upload         [toggle]
    Field Label*             [e.g., "Upload your photo"]
    Max Images               [integer, default 1]
    Min Width (px)           [integer]
    Min Height (px)          [integer]
    Max File Size (MB)       [integer]
    
  Font Options               [multi-select from Google Fonts list]
  Color Options              [color picker, add multiple]
  Preview Template           [upload: SVG/PNG with placeholder zones marked]
  Extra Processing Days      [integer added to lead time]

Tab 7: SEO
  Meta Title*                [text, 60 char limit, preview]
  Meta Description*          [textarea, 160 char limit, preview]
  Keywords                   [tag input]
  Canonical URL              [text — for duplicates]
  No-Index                   [toggle — removes from search]
  
  Google SERP Preview:
    [████████████████████████████]
    combovibes.in › products › product-slug
    Meta Title Here (60 chars max)
    Meta description text here, max 160 characters…
    
  Open Graph:
    OG Title                 [defaults to meta title]
    OG Description           [defaults to meta description]
    OG Image                 [defaults to primary product image]

Sidebar Panel:
  Publish Status             [Draft / Published]
  Visibility                 [Public / Hidden]
  Schedule Publish           [datetime picker]
  Vendor                     [reassign dropdown]
  [Save Draft] [Publish] [View on Site] [Duplicate]
  
  Product Performance (read-only):
    Total Orders:   X
    Views (30d):    X
    Conversion:     X%
    Rating:         X ★ (X reviews)
    Revenue (30d):  ₹X
```

---

## 4. Category & Taxonomy Management

### Category Tree Manager

```
Component: DraggableCategoryTree

Features:
  - Drag-and-drop to reorder within level
  - Drag to change parent (reparent)
  - Expand/collapse tree nodes
  - Inline rename on double-click
  - Color-coded by active/inactive status
  - Quick actions on hover: Edit | Add Child | Toggle | Delete

Category Card (compact):
  [Icon] Category Name       [Products: 245]  [●Active] [⋮]
    ├── Subcategory 1        [Products: 120]  [●Active] [⋮]
    ├── Subcategory 2        [Products: 89]   [●Active] [⋮]
    └── Subcategory 3        [Products: 36]   [○Draft]  [⋮]
```

### Category Form

```
Name*                        [text]
Slug*                        [auto + editable]
Parent Category              [dropdown — or "Root Level"]
Description                  [textarea]
Display Icon                 [SVG upload or icon picker (Lucide)]
Category Image               [image upload, shown on PLP header]
Banner Image                 [wide image for occasion/festival pages]
Sort Order                   [integer — manual ordering]
Is Active                    [toggle]
Show in Mega Menu            [toggle]
Mega Menu Priority           [1-5 ordering in menu]

SEO:
  Meta Title                 [text]
  Meta Description           [textarea]
  
Content (for occasion/festival categories):
  Hero Heading               [text]
  Hero Subheading            [text]
  Editorial Content          [TipTap — shown on category landing page]
  FAQ                        [repeater field: Question + Answer]

Seasonal Settings:
  Is Seasonal                [toggle]
  Active From                [date]
  Active Until               [date]
  Auto-hide after season     [toggle]
```

---

## 5. Order Management

### Orders — Enterprise List View

```
Status Tabs with counts:
  All | Pending (12) | Payment Pending (3) | Confirmed (45) | Processing (32) |
  Packed (18) | Shipped (24) | Out for Delivery (28) | Delivered (1,247) |
  Cancelled (34) | Refund Requested (8) | Refunded (21) | Failed (5)

Advanced Filters:
  Date Range              [preset: Today | Yesterday | Week | Month | Custom]
  Delivery Date           [date range]
  Delivery Type           [same_day | midnight | express | standard]
  Payment Method          [UPI | Card | COD | Wallet | etc.]
  Payment Status          [success | pending | failed]
  Vendor                  [dropdown]
  City                    [text search]
  Pincode                 [text]
  Amount Range            [₹min to ₹max]
  Has Personalization     [toggle]
  Has Gift Message        [toggle]
  Customer Tier           [Silver | Gold | Platinum]

Columns (configurable):
  ☐ Order # (link)
  ☐ Date + Time
  ☐ Customer Name + Phone
  ☐ First Product (thumb + name)
  ☐ Item Count
  ☐ Total Amount
  ☐ Delivery Date + Slot
  ☐ Delivery City
  ☐ Payment Method
  ☐ Status Badge
  ☐ Vendor
  ☐ Actions

Bulk Actions:
  ✓ Update Status (with bulk status change modal)
  ✓ Assign Vendor
  ✓ Export to CSV/Excel
  ✓ Print Packing Slips (PDF, multiple)
  ✓ Send Customer Notification (select message template)
  ✓ Mark as Refunded (batch)

Real-time Updates:
  → New orders appear at top without refresh (Supabase Realtime)
  → Status changes reflect immediately
  → Count badges in tabs update in real-time
```

### Order Detail — Enterprise View

```
Header:
  Order #CV-2024-001234   ●Confirmed   [⎙ Print] [↓ PDF] [⋯ More Actions]
  Placed: Dec 25, 2024 at 2:30:15 PM IST

Section 1: Order Timeline (Interactive)
  ● Order Placed          Dec 25, 2:30 PM
  ● Payment Confirmed     Dec 25, 2:31 PM  → Payment ID: pay_xyz123
  ○ Processing            [Mark Processing ▼]
  ○ Packed
  ○ Shipped
  ○ Out for Delivery
  ○ Delivered
  
  → Each completed step shows timestamp + who triggered it
  → Click step to add note or see audit entry

Section 2: Order Items
  [Detailed table]
  Product | Variant | Qty | Price | Delivery Details | Gift Details | Status | Actions
  
  Row expansion shows:
    - Personalization data (text + image preview)
    - Gift message
    - Greeting card preview
    - Add-ons list
    - Recipient full address
    - Delivery slot details

Section 3: Two-column layout
  Left: Customer & Recipient Info
    Customer:     Rahul Sharma
    Email:        rahul@gmail.com
    Phone:        +91 98765 43210
    Tier:         Gold Member
    LTV:          ₹24,500 (32 orders)
    [View Full Profile →]
    
    Recipient:    Priya Sharma
    Phone:        +91 98765 XXXXX [reveal button]
    Address:      B-404, Sunshine Apartments,
                  Powai, Mumbai - 400076
    Landmark:     Near Hiranandani Hospital
    
  Right: Payment & Financial Info
    Payment:      UPI (GPay)
    Gateway ID:   pay_xyz123
    Razorpay ID:  order_abc456
    
    Subtotal:     ₹1,299
    Delivery:     ₹0 (Free)
    Coupon:       FLAT100 → -₹100
    GST (18%):    ₹215
    Total:        ₹1,414
    
    Wallet Used:  ₹0
    Points Used:  0

Section 4: Vendor Assignment
  Current Vendor: FlowerHub Mumbai
  Assigned At:    Dec 25, 2:35 PM
  [Reassign Vendor ▼]
    → Opens vendor search dropdown
    → Auto-notifies new vendor + old vendor
  
  Vendor Notes:  [textarea for admin → vendor comm]

Section 5: Internal Admin Notes
  [Chronological note thread]
  Dec 25 3:00 PM — Support Agent: Customer called, verified address
  Dec 25 3:15 PM — Priya: Escalated to senior for special handling
  [+ Add Note]

Section 6: Admin Actions (right sidebar)
  [Change Order Status]
    → Modal: Select new status + required note
    
  [Process Refund]
    → Modal:
      Refund Amount:    [₹X — pre-filled with order total]
      Refund To:        ○ Original Method  ○ Platform Wallet  ○ Bank Transfer
      Reason:           [dropdown + text]
      [Initiate Refund]
      
  [Cancel Order]
    → Requires reason + confirmation
    
  [Resend Confirmation Email]
  [Send Custom SMS]
  [View Audit Trail]
```

### Order Batch Operations

```
Print Packing Slips:
  → Select orders → [Print Packing Slips]
  → PDF with: Order # | Product | Recipient | Address | Gift Message | Special Notes

Export:
  Format: CSV | Excel | PDF summary
  Columns: Configurable
  Date range + status filters applied
```

---

## 6. Customer Management

### Customer List — Enterprise View

```
Columns:
  Avatar | Name | Email | Phone | City | Tier | Orders | LTV | Last Order | Status | Actions

Advanced Filters:
  Status:       Active | Suspended | Banned
  Tier:         Silver | Gold | Platinum
  Orders:       Min/Max count
  LTV:          Min/Max lifetime value
  Registered:   Date range
  Last Order:   Date range
  City:         Text search

Segments (quick filters):
  [At-Risk (no order 60+ days)]
  [VIP (LTV > ₹25,000)]
  [New (registered < 30 days)]
  [Churned (no order 180+ days)]
  
Bulk Actions:
  ✓ Export contact list (GDPR-compliant)
  ✓ Add to email campaign
  ✓ Apply loyalty bonus points
  ✓ Send notification
```

### Customer Detail — Enterprise View

```
Header:
  [Avatar] Priya Sharma    ●Active    [Edit] [Suspend] [Ban] [Reset Password]
  priya@gmail.com  |  +91 98765 43210  |  Mumbai, Maharashtra
  Joined: Dec 1, 2023  |  Gold Member  |  42 Points  |  ₹320 Wallet

Stat Cards:
  Total Orders: 28 | Total Spent: ₹34,200 | AOV: ₹1,221 | Last Order: Dec 22

Tabs:
  Overview | Orders | Reviews | Addresses | Wishlist | Wallet | Activity

Overview Tab:
  Purchase History Chart (monthly spending bars)
  Favorite Categories (pie)
  Frequently Gifted Occasions (tags)
  Cohort Info

Orders Tab:
  Full order history (same as main order list, filtered)
  
Activity Tab:
  Login history with IP + device
  Key events (signup, first order, last login, suspension events)
  
Admin Notes:
  Sticky note field for CS team observations
```

---

## 7. Coupon & Promotion Management

### Coupon List

```
Columns:
  Code | Name | Type | Value | Used/Limit | Min Order | Status | Expiry | Revenue Impact | Actions

Analytics per coupon:
  Total Used | Revenue Generated | Avg Discount | Top Product

Filters:
  Status: Active | Inactive | Expired | Scheduled
  Type:   Percentage | Fixed | Free Shipping | BOGO
```

### Advanced Coupon Builder

```
Step 1: Basics
  Coupon Code*           [text, UPPERCASE — or [Generate Random]]
  Internal Name*         [for team reference]
  Description            [shown to customer on apply]
  Campaign Tag           [group by marketing campaign for reporting]

Step 2: Discount Rules
  Type:
    ○ Percentage Off      → Value: [X]%  Max Discount: ₹[Y]
    ○ Fixed Amount Off    → Value: ₹[X]
    ○ Free Shipping       → Apply to: [All | Order over ₹X]
    ○ Buy X Get Y         → Buy [X] get [Y]% off next item
    ○ Tiered Discount     → Spend ₹500 → 10% | ₹1000 → 15% | ₹2000 → 20%
    
  Min Order Value:       ₹[X]  (0 = no minimum)
  
  Applicable To:
    ○ All Products
    ○ Specific Categories  [multi-select + search]
    ○ Specific Products    [product search picker]
    ○ Specific Brands      [multi-select]
    ○ Specific Occasions   [multi-select]
    
  Excluded:
    Excluded Categories    [multi-select]
    Excluded Products      [product search]

Step 3: Audience & Restrictions
  User Restrictions:
    ○ All users
    ○ New users only (first order)
    ○ Returning users (2+ orders)
    ○ Specific tier (Gold+, Platinum)
    ○ Specific users      [upload email list CSV]
    ○ Referral users only
    
  Usage Limits:
    Total uses:            [integer or ∞ unlimited]
    Per user:              [integer, default 1]
    Per day:               [integer or ∞]
    
  Stackable:              [toggle — can combine with other coupons?]

Step 4: Validity
  Valid From*:            [datetime picker]
  Valid Until:            [datetime or no expiry]
  Active:                 [toggle — can manually disable]

Step 5: Preview & Launch
  Preview:
    "Apply code DIWALI20 to get 20% off on all hampers (max ₹500 discount)"
    "Min order: ₹999 | Valid until: Nov 15, 2024"
    
  [Save as Draft] [Activate] [Schedule]
```

---

## 8. Delivery Management

### Delivery Zones Manager

```
Zone Map View (Leaflet/Mapbox):
  - Visual pincode mapping on India map
  - Click zone to see pincodes
  - Color-coded by delivery capability (same_day / standard only)

Zone List View:
  Zone Name | Cities | Pincodes | Same Day | Midnight | Express | Status

Pincode Management:
  - Add single pincode: Form input
  - Bulk import: CSV upload (pincode, city, state, capabilities)
  - Download current as CSV
  - Search pincode (real-time)
  - Per-pincode edit: city, state, delivery capabilities, COD
```

### Delivery Slot Dashboard

```
Slot Calendar View (like a booking calendar):
  Days as columns, slots as rows
  Color fill = % capacity used
  
  [Mon Dec 25]  [Tue Dec 26]  [Wed Dec 27]
  Morning 6-10  ████░░░░ 60%  ███░░░░░ 40%  ██████░░ 80%
  Evening 6-9   ██░░░░░░ 25%  ████████ 100% ██░░░░░░ 30%
  Midnight      ████████ 100% ██░░░░░░ 30%  ████░░░░ 50%
  
Click cell → see booked orders for that slot
Manually block slots (e.g., holiday)
Increase/decrease capacity per slot per date
```

### Delivery Partner Integration

```
Partners:
  - Shadowfax
  - Dunzo
  - Borzo (WeFast)
  - Own delivery team

Per partner:
  API credentials
  Serviceable zones
  Delivery types (same_day only, etc.)
  Auto-assignment rules
  Webhook URL for status updates

Assignment Rules:
  Priority order: [Vendor's own team] → [Borzo] → [Shadowfax]
  Based on: Zone | Order type | Time of day
```

---

## 9. Vendor Management

### Vendor List

```
Columns:
  Logo | Name | Type | City | Products | Orders | Rating | Revenue | Status | Actions

Status Filter Tabs:
  All | Active | Pending Approval | Suspended | Rejected

Quick Actions:
  Approve | Reject | Suspend | View Profile
```

### Vendor Application Review

```
Application Detail Page:
  Business Info          [all submitted details]
  Documents              [inline PDF/image viewer]
    PAN Card:            [View] [✓ Verified] [✗ Reject]
    Aadhaar:             [View] [✓ Verified] [✗ Reject]
    Bank Statement:      [View] [✓ Verified] [✗ Reject]
  
  Decision:
    [Approve Application]  → Sends welcome email + creates vendor login
    [Request More Info]    → Email with specific questions
    [Reject Application]   → Select reason + custom message
  
  Admin Notes:           [textarea]
```

### Vendor Performance Dashboard

```
Per-vendor metrics:
  Total Orders:         1,234
  Fulfillment Rate:     96%
  On-Time Rate:         92%
  Customer Rating:      4.7 ★
  Return Rate:          1.8%
  Cancel Rate:          0.5%
  Avg Prep Time:        45 minutes
  
Performance Chart:
  Monthly fulfillment rate trend
  
Comparison:
  vs Platform Average | vs Similar Vendors
```

### Vendor Payout Management

```
Payout Dashboard:
  Vendors Due for Payout (this cycle)
  Total Payout Amount This Cycle
  
  Per-vendor payout:
    Vendor | Period | Gross | Commission | Gateway Fee | Net | Status | [Process]
  
  Bulk Payout:
    [Initiate All Pending Payouts]
    → Downloads NEFT/RTGS file for bank
    → Or integrates with RazorpayX for automated transfer
    
  Payout History:
    Full transaction log
```

---

## 10. Content Management System (CMS)

### Homepage Section Manager

```
Visual Page Builder (drag-and-drop section ordering):

  ┌─────────────────────────────────────────────────┐
  │ ⠿ [1] Hero Carousel          [Edit] [Toggle]    │
  │ ⠿ [2] Quick Categories       [Edit] [Toggle]    │
  │ ⠿ [3] Occasion Chips         [Edit] [Toggle]    │
  │ ⠿ [4] Delivery Countdown     [Edit] [Toggle]    │
  │ ⠿ [5] Featured Collection 1  [Edit] [Toggle]    │
  │ ⠿ [6] Best Sellers           [Edit] [Toggle]    │
  │ ⠿ [7] Personalization Banner [Edit] [Toggle]    │
  │ ⠿ [8] Review Carousel        [Edit] [Toggle]    │
  └─────────────────────────────────────────────────┘
  
  [+ Add Section]
```

### Banner Manager

```
Banners List:
  Thumbnail | Title | Placement | Status | Valid From | Valid Until | Clicks | Actions

Add Banner:
  Title*                  [text, internal name]
  Placement*              [Hero | Category | Occasion | Popup | Announcement | Sidebar]
  Desktop Image*          [upload, recommended size shown]
  Mobile Image            [upload — different crop for mobile]
  Link URL                [text]
  Link Target             [Same Page | New Tab]
  Alt Text*               [for accessibility]
  CTA Button Text         [optional overlay text]
  Validity:
    Show From             [datetime]
    Hide After            [datetime]
  Sort Order              [integer]
  Active                  [toggle]
  
  Analytics:
    Views: X | Clicks: X | CTR: X%
```

### Landing Page Builder

```
Pages:
  Festival pages (Diwali, Christmas, Eid, etc.)
  Occasion pages (Birthday, Anniversary, etc.)
  SEO landing pages (flowers-in-mumbai, etc.)
  
Page Builder:
  Block Types:
    Hero Banner
    Product Grid (linked query)
    Text Content
    Image + Text
    FAQ Accordion
    Testimonials
    CTA Banner
    Video Embed
    Custom HTML
  
  Each block: Visual preview + settings panel
```

### Announcement Bar Manager

```
Active Announcements:
  [Text] | [Start] | [End] | [Priority] | [Link] | [Active] | [Actions]

Announcement Form:
  Text*                   [text, supports emoji and HTML links]
  Background Color        [color picker]
  Text Color              [color picker]
  Link URL                [optional — whole bar becomes clickable]
  Is Dismissible          [toggle]
  Valid From              [datetime]
  Valid Until             [datetime]
  Priority                [1 = highest — only top priority shown]
```

---

## 11. Marketing Module

### Email Campaign Manager

```
Campaigns List:
  Name | Type | Status | Recipients | Sent | Open Rate | Click Rate | Date

Create Campaign:
  Step 1: Template
    [Select Template] or [Design from Scratch (drag-drop)]
    
  Step 2: Content
    Subject Line*         [text + A/B variant option]
    Preview Text*         [50 chars shown in email client]
    Email Body*           [Visual email builder (Unlayer/Stripo-style)]
    
  Step 3: Recipients
    Segment:
      ○ All Customers
      ○ Customers who haven't ordered in 30 days
      ○ Gold/Platinum tier members
      ○ Customers interested in [Occasion]
      ○ Customers from [City]
      ○ Custom upload (CSV of emails)
      
    Exclusions:
      ☐ Exclude unsubscribed
      ☐ Exclude customers with order in last 7 days
      
    Estimated recipients: X
    
  Step 4: Schedule
    ○ Send now
    ○ Schedule for: [datetime]
    ○ Send at best time (based on engagement data)
    
  Preview & Test:
    [Send Test to: your@email.com]
    [Preview as Email Client]

Campaign Analytics:
  Delivered | Opened | Clicked | Bounced | Unsubscribed
  Link click heatmap
  Top performing subject line (A/B)
```

### SMS Campaigns

```
Similar structure to email
Character counter (160 chars for 1 SMS)
DLT template management (TRAI compliance)
Sender ID configuration
Opt-out management
```

### Push Notification Campaigns

```
Browser push via Firebase Cloud Messaging
Segment targeting (same as email)
Rich notifications (icon + image + action buttons)
A/B testing on title/body
Scheduling
```

### Campaign Calendar

```
Monthly calendar view
Color-coded by campaign type (email/SMS/push)
Festival dates auto-marked (Diwali, Christmas, etc.)
Recommended campaign dates from analytics
```

---

## 12. Review Management

### Review Queue — Enterprise

```
Queue Dashboard:
  Pending: 24 | Approved Today: 156 | Rejected Today: 8

Pending Review Card (full width):
  ┌────────────────────────────────────────────────────┐
  │ ★★★★★ 5.0                              Verified ✓  │
  │ "Absolutely beautiful roses! Fresh, fragrant, and  │
  │ delivered on time. Packaging was premium quality." │
  │                                                    │
  │ 📷 3 photos attached                               │
  │                                                    │
  │ By: Priya S.  |  Dec 25, 2024  |  Order #CV-1234  │
  │ Product: Red Roses Bouquet - 24 Stems              │
  │                                                    │
  │ [Approve ✓] [Reject ✗] [Highlight ★] [View Photos]│
  └────────────────────────────────────────────────────┘

Reject Modal:
  Reason: [dropdown]
    ○ Spam / Irrelevant content
    ○ Inappropriate language
    ○ Personal information included
    ○ Not about product
    ○ Fake/suspicious review
    ○ Competitor mention
  Custom Message to reviewer: [optional textarea]

Reply to Review:
  [Vendor/Admin Reply textarea]
  Shown publicly below review
  Character limit: 500

Review Analytics:
  Average rating by category
  Rating distribution over time
  Review velocity (reviews per day)
  Most reviewed products
  Products with declining ratings (alert)
```

---

## 13. Reports & Analytics

### Revenue Report

```
Metrics:
  Gross Revenue    | Net Revenue  | Refund Amount  | Refund Rate
  Total Orders     | AOV          | Orders/Day avg
  
Visualizations:
  Revenue vs Target line chart
  Revenue by category stacked bar
  Revenue by city/state map
  Revenue by payment method
  Revenue by delivery type
  
Comparison:
  Current period vs previous period
  Current period vs same period last year
  
Export: CSV | Excel | PDF (with charts)
```

### Order Report

```
Metrics:
  Order Volume by status
  Fulfillment rate
  On-time delivery rate
  Cancellation analysis (reasons breakdown)
  Average time: Order → Confirmed → Packed → Delivered
  
Charts:
  Order funnel (placed → paid → confirmed → delivered → reviewed)
  Orders by time of day (heatmap)
  Orders by day of week
  Orders by occasion
```

### Product Report

```
Top 100 products by: Revenue | Orders | Views | Conversion | Rating

Underperforming:
  Zero orders (30 days) with reason suggestions
  High bounce from PDP (< 5% add-to-cart)
  Low rating (< 3.5 stars) with review sentiment

Category performance:
  Revenue per category
  AOV per category
  Growth rate per category
  
Inventory insights:
  Stockout frequency per product
  Days out of stock (lost revenue calculation)
  Over-stocked products (tied-up capital)
```

### Customer Report

```
Acquisition:
  New customers per channel (organic, paid, referral, social)
  Cost per acquisition (if ad spend data linked)
  First purchase occasion distribution
  
Retention:
  Repeat purchase rate (% who order 2+ times)
  Cohort retention (monthly cohorts, 3/6/12 month retention)
  Churn rate by tier
  Days between orders (purchase frequency)
  
Value:
  LTV distribution (histogram)
  LTV by acquisition channel
  LTV by first purchase category
  Top 100 customers by LTV
  
Geographic:
  Revenue by city
  Customer density map
  Growth cities (fastest growing markets)
```

### Custom Report Builder

```
Build reports with:
  Metrics: [dropdown — any tracked metric]
  Dimensions: [Group by: date | category | city | vendor | channel | ...]
  Filters: [Any field filter]
  Visualizations: [Table | Line | Bar | Pie | Map]
  Date Range: [Custom]
  
Save as: named report
Schedule: Email on [Daily | Weekly | Monthly]
```

---

## 14. Settings & Configuration

### Company Settings

```
Company Name, Tagline, About Text
Logo (light + dark variants)
Favicon
Office Address(es)
Contact Email (support, billing, legal)
Support Phone, WhatsApp Number
Social Media URLs (Instagram, Facebook, Twitter, YouTube, Pinterest)
```

### Payment Gateway Settings

```
Razorpay:
  Key ID (public)
  Key Secret (masked, stored encrypted)
  Webhook Secret
  Test Mode toggle
  Supported methods: [toggles per method]
  
COD Configuration:
  Enable COD globally [toggle]
  COD surcharge: ₹[X]
  COD pincodes: [CSV upload or list]
  COD max order value: ₹[X]
  COD min order value: ₹[X]
  
Refund Settings:
  Auto-refund on cancellation: [toggle]
  Refund method preference: [original | wallet]
  Wallet refund bonus %: [X% extra for choosing wallet refund]
```

### Tax & GST Settings

```
GST Configuration:
  GSTIN: [text]
  Invoice format: [B2C (simplified) | B2B (full)]
  Invoice prefix: [CV-INV-]
  
Tax Categories:
  Category Name | GST Rate | HSN Code | Edit
  Fresh Flowers  | 0%       | 0603     | [Edit]
  Food/Cakes     | 5%       | 1905     | [Edit]
  Electronics    | 18%      | 8517     | [Edit]
  [+ Add Category]
```

### Notification Templates

```
Template List:
  Event | Channel | Subject | Last Updated | Status | Edit

Template Editor:
  Event: Order Confirmed
  Channel: Email
  
  From Name: Combovibes
  Subject: Order Confirmed — {{order_number}} | Combovibes
  
  [Visual email editor]
  Available variables:
    {{customer_name}}
    {{order_number}}
    {{order_total}}
    {{delivery_date}}
    {{delivery_slot}}
    {{recipient_name}}
    {{tracking_url}}
    {{support_phone}}
    
  [Send Test]  [Save]
```

### SEO & Sitemap Settings

```
Default Meta Title:    [text + site name]
Default Meta Desc:     [textarea]
Google Verification:   [meta tag value]
Bing Verification:     [meta tag value]

Sitemap:
  Auto-generate:       [toggle — regenerates on content change]
  Include:             [categories | products | occasions | collections | blog]
  Excluded URLs:       [pattern list]
  Last run:            Dec 25, 2024 2:00 AM
  [Regenerate Now]
```

---

## 15. Role-Based Access Control (RBAC)

### Roles

| Role | Description |
|---|---|
| **Super Admin** | Full system access. Manages other admins. Cannot be restricted. |
| **Admin** | Full access except: cannot manage other admins or delete core data |
| **Product Manager** | Manage products, categories, brands, collections, inventory |
| **Order Manager** | View and process orders, manage refunds, assign vendors |
| **Customer Support** | View customers, orders (read-only). Add notes. Handle complaints. |
| **Marketing Manager** | Manage coupons, CMS, banners, campaigns, reviews |
| **Vendor Manager** | Approve/manage vendors, view vendor orders and payouts |
| **Finance Manager** | View all reports, process payouts, manage financial settings |
| **Content Manager** | Manage CMS pages, banners, blog posts |

### Permission Matrix

```
Permission                    Super  Admin  ProdMgr  OrdMgr  Support  Marketing  VendorMgr  Finance  Content
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
Dashboard: View               ✓      ✓      ✓        ✓       ✓        ✓          ✓          ✓        ✓
Dashboard: Full Analytics     ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✓        ✗

Products: View                ✓      ✓      ✓        ✓       ✓        ✗          ✓          ✗        ✗
Products: Create              ✓      ✓      ✓        ✗       ✗        ✗          ✗          ✗        ✗
Products: Edit                ✓      ✓      ✓        ✗       ✗        ✗          ✗          ✗        ✗
Products: Delete              ✓      ✓      ✗        ✗       ✗        ✗          ✗          ✗        ✗
Products: Pricing             ✓      ✓      ✓        ✗       ✗        ✓          ✗          ✓        ✗

Orders: View                  ✓      ✓      ✗        ✓       ✓        ✗          ✓          ✓        ✗
Orders: Update Status         ✓      ✓      ✗        ✓       ✗        ✗          ✓          ✗        ✗
Orders: Cancel                ✓      ✓      ✗        ✓       ✗        ✗          ✗          ✗        ✗
Orders: Refund                ✓      ✓      ✗        ✓       ✗        ✗          ✗          ✓        ✗
Orders: Assign Vendor         ✓      ✓      ✗        ✓       ✗        ✗          ✓          ✗        ✗

Customers: View               ✓      ✓      ✗        ✓       ✓        ✓          ✗          ✓        ✗
Customers: Edit               ✓      ✓      ✗        ✗       ✓        ✗          ✗          ✗        ✗
Customers: Suspend/Ban        ✓      ✓      ✗        ✗       ✗        ✗          ✗          ✗        ✗

Vendors: View                 ✓      ✓      ✗        ✓       ✗        ✗          ✓          ✓        ✗
Vendors: Approve/Reject       ✓      ✓      ✗        ✗       ✗        ✗          ✓          ✗        ✗
Vendors: Payouts              ✓      ✓      ✗        ✗       ✗        ✗          ✗          ✓        ✗

Coupons: View                 ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✓        ✗
Coupons: Create/Edit          ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✗        ✗

CMS: Banners                  ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✗        ✓
CMS: Pages                    ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✗        ✓
CMS: Blog                     ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✗        ✓

Reviews: Moderate             ✓      ✓      ✗        ✗       ✗        ✓          ✗          ✗        ✗

Reports: View                 ✓      ✓      ✓        ✓       ✗        ✓          ✓          ✓        ✗
Reports: Export               ✓      ✓      ✓        ✓       ✗        ✓          ✓          ✓        ✗

Settings: General             ✓      ✓      ✗        ✗       ✗        ✗          ✗          ✗        ✗
Settings: Payment             ✓      ✗      ✗        ✗       ✗        ✗          ✗          ✓        ✗
Settings: Tax                 ✓      ✗      ✗        ✗       ✗        ✗          ✗          ✓        ✗

Access: Manage Roles          ✓      ✗      ✗        ✗       ✗        ✗          ✗          ✗        ✗
Access: Manage Admin Users    ✓      ✗      ✗        ✗       ✗        ✗          ✗          ✗        ✗

Audit Logs: View              ✓      ✓      ✗        ✗       ✗        ✗          ✗          ✗        ✗
```

### Permission Implementation

```typescript
// Middleware checks on every admin API route
async function checkPermission(userId: string, permission: string): Promise<boolean> {
  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('role:admin_roles(permissions)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()
  
  if (!adminUser) return false
  
  const permissions = adminUser.role.permissions as Record<string, boolean>
  return permissions[permission] === true
}

// Usage in route handler
if (!await checkPermission(user.id, 'orders.refund')) {
  return Response.json({ error: 'Insufficient permissions' }, { status: 403 })
}
```

---

## 16. Audit Log System

### What is Logged

| Module | Actions Tracked |
|---|---|
| Products | create, update (all field changes), delete, status_change, price_change |
| Categories | create, update, delete, reorder |
| Orders | status_change, refund_initiated, refund_completed, cancel, assign_vendor, note_added |
| Customers | profile_update, suspend, ban, unsuspend, unban, password_reset, role_change |
| Vendors | apply, approve, reject, suspend, payout_initiated, payout_completed |
| Coupons | create, update, deactivate, delete |
| Settings | any setting change (payment, tax, email, sms) |
| Admin Users | create, update_role, deactivate, login, failed_login |
| CMS | banner_create, banner_update, page_publish, announcement_change |

### Audit Log Entry Structure

```json
{
  "id": "uuid",
  "timestamp": "2024-12-25T14:30:00Z",
  "actor": {
    "id": "uuid",
    "type": "admin",
    "name": "Priya Admin",
    "email": "priya@combovibes.in",
    "role": "Order Manager",
    "ip": "103.x.x.x",
    "user_agent": "Mozilla/5.0..."
  },
  "action": "order.status_changed",
  "entity": {
    "type": "order",
    "id": "uuid",
    "identifier": "CV-2024-001234"
  },
  "changes": {
    "status": {
      "from": "confirmed",
      "to": "processing"
    },
    "note": "Vendor accepted and started preparation"
  },
  "metadata": {
    "source": "admin_panel",
    "request_id": "req_xyz"
  }
}
```

### Audit Log Viewer

```
Filters:
  Actor:        [Admin user dropdown]
  Action Type:  [Module dropdown + action type]
  Entity:       [Product ID | Order ID | Customer ID]
  Date Range:   [Date picker]
  IP Address:   [text filter]

Table:
  Timestamp | Actor | Action | Entity | Changes (truncated) | IP | [Details]

Details Modal:
  Full before/after JSON diff view
  Syntax-highlighted JSON
  Side-by-side comparison for large objects

Export:
  CSV/Excel of filtered audit entries
```

---

## 17. Supabase Integration

### Admin Tables

```sql
-- Admin users table (separate from customer profiles)
CREATE TABLE admin_users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id),
  full_name   text NOT NULL,
  email       text NOT NULL UNIQUE,
  role_id     uuid REFERENCES admin_roles(id),
  is_active   boolean DEFAULT true,
  is_2fa_enabled boolean DEFAULT false,
  last_login_at  timestamptz,
  created_by  uuid REFERENCES admin_users(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Admin roles with JSON permission map
CREATE TABLE admin_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  is_system   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Seed system roles
INSERT INTO admin_roles (name, description, is_system, permissions) VALUES
('super_admin', 'Full system access', true, '{"*": true}'),
('admin', 'Full access excluding admin management', true, '{...}'),
('product_manager', 'Manage product catalog', true, '{...}'),
('order_manager', 'Process and manage orders', true, '{...}');
```

### Admin RLS Policies

```sql
-- Admin users can read their own record
CREATE POLICY "Admin read own record" ON admin_users
  FOR SELECT USING (user_id = auth.uid());

-- Super admin can read all admin users
CREATE POLICY "Super admin manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid() 
        AND au.is_active = true
        AND (ar.permissions->>'*' = 'true' OR ar.name = 'super_admin')
    )
  );
```

### Admin Audit Triggers

```sql
-- Auto-log product changes
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (actor_id, actor_type, action, entity_type, entity_id, old_data, new_data)
    VALUES (
      current_setting('app.admin_user_id', true)::uuid,
      'admin',
      'product.' || CASE WHEN NEW.status != OLD.status THEN 'status_changed' ELSE 'updated' END,
      'product',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (actor_id, actor_type, action, entity_type, entity_id, new_data)
    VALUES (
      current_setting('app.admin_user_id', true)::uuid,
      'admin',
      'product.created',
      'product',
      NEW.id,
      to_jsonb(NEW)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER products_audit
  AFTER INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION log_product_changes();
```

---

## 18. Screen Inventory

| Screen | URL | Auth | Key Workflow |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | admin | KPIs + real-time feed |
| Product List | `/admin/products` | admin/product_manager | Browse + bulk actions |
| Product Add | `/admin/products/new` | admin/product_manager | Multi-tab product form |
| Product Edit | `/admin/products/[id]` | admin/product_manager | Edit + revision history |
| Category Tree | `/admin/categories` | admin/product_manager | Drag-drop tree |
| Order List | `/admin/orders` | admin/order_manager | Multi-filter list + bulk |
| Order Detail | `/admin/orders/[id]` | admin/order_manager | Full order management |
| Customer List | `/admin/customers` | admin/customer_support | Search + filter + segments |
| Customer Detail | `/admin/customers/[id]` | admin/customer_support | Full profile + history |
| Coupon List | `/admin/coupons` | admin/marketing_manager | CRUD + analytics |
| Coupon Builder | `/admin/coupons/new` | admin/marketing_manager | 5-step builder |
| Delivery Zones | `/admin/delivery/zones` | admin | Zone map + pincode mgmt |
| Delivery Slots | `/admin/delivery/slots` | admin | Calendar slot view |
| Vendor List | `/admin/vendors` | admin/vendor_manager | Approval queue + search |
| Vendor Detail | `/admin/vendors/[id]` | admin/vendor_manager | Profile + performance |
| Vendor Payouts | `/admin/vendors/payouts` | admin/finance_manager | Batch payout processing |
| Banner Manager | `/admin/cms/banners` | admin/marketing_manager | Upload + schedule |
| Homepage Builder | `/admin/cms/homepage` | admin/content_manager | Drag-drop sections |
| Landing Pages | `/admin/cms/pages` | admin/content_manager | Page builder |
| Email Campaigns | `/admin/marketing/emails` | admin/marketing_manager | Campaign creator |
| Review Queue | `/admin/reviews` | admin/marketing_manager | Approve/reject/reply |
| Revenue Report | `/admin/reports/revenue` | admin/finance_manager | Charts + export |
| Order Report | `/admin/reports/orders` | admin | Charts + export |
| Product Report | `/admin/reports/products` | admin/product_manager | Performance + inventory |
| Customer Report | `/admin/reports/customers` | admin/finance_manager | Cohort + LTV |
| General Settings | `/admin/settings/general` | admin | Company info |
| Payment Settings | `/admin/settings/payment` | admin/finance_manager | Razorpay config |
| Role Manager | `/admin/access/roles` | super_admin | Permission matrix |
| Admin Users | `/admin/access/users` | super_admin | User CRUD |
| Audit Logs | `/admin/audit-logs` | super_admin | Search + filter |

---

## 19. Component Inventory

### Admin-Specific Components

| Component | Purpose |
|---|---|
| `AdminSidebar` | Collapsible navigation with permission-filtered links |
| `AdminTopbar` | Breadcrumb, search, notifications, profile |
| `DataTable` | Full-featured table with sort, filter, bulk, export |
| `KPIWidget` | Metric card with trend indicator |
| `RevenueChart` | Multi-line revenue analytics |
| `OrderStatusDonut` | Order distribution visualization |
| `ActivityFeed` | Real-time event stream |
| `ProductForm` | 7-tab product creation/editing form |
| `VariantBuilder` | Dynamic variant rows with drag-to-reorder |
| `MediaUploader` | Dropzone with gallery management |
| `CategoryTree` | Drag-drop sortable hierarchy |
| `CouponBuilder` | Multi-step coupon creation wizard |
| `DeliveryCalendar` | Slot booking calendar view |
| `VendorApplicationReview` | Document viewer + decision panel |
| `PayoutTable` | Vendor earnings + initiate payout |
| `HomepageBuilder` | Drag-drop section editor |
| `BannerScheduler` | Upload + date-range scheduling |
| `EmailCampaignEditor` | Visual email builder |
| `ReviewCard` | Approve/reject/reply widget |
| `AuditLogTable` | Filterable log viewer with diff modal |
| `PermissionMatrix` | Role × permission checkbox grid |
| `AdminUserForm` | Create/edit admin user + assign role |
| `ReportChart` | Configurable Recharts wrapper |
| `ExportButton` | CSV/Excel/PDF export trigger |
| `SegmentBuilder` | Visual customer segment creator |
| `BulkActionBar` | Selected row count + action dropdown |
| `NotificationBell` | Real-time alert dropdown |
| `ConfirmDialog` | Destructive action confirmation |
| `DiffViewer` | Before/after JSON comparison |

---

## 20. Future Scalability Strategy

### Architecture for 1M+ Users

```
Phase 1 (MVP → 10K orders/month):
  Single Supabase instance
  Vercel Edge Functions
  Simple caching (Next.js ISR)

Phase 2 (10K → 100K orders/month):
  Supabase read replica for analytics
  Redis (Upstash) for:
    - Cart sessions
    - Rate limiting
    - Slot capacity tracking
    - Search query caching
  Algolia for search (replaces PostgreSQL FTS)
  Cloudinary for image transformation (CDN)

Phase 3 (100K+ orders/month):
  Database sharding strategy (by region/city)
  Separate analytics database (ClickHouse or BigQuery)
  Message queue (BullMQ / Inngest) for:
    - Notification processing
    - Report generation
    - Payout batch processing
  Dedicated microservices:
    - Notification service
    - Search service
    - Inventory service
  Multi-region deployment (Vercel Regions)
  CDN for all media (CloudFront or Cloudflare)
  
Phase 4 (1M+ orders/month):
  Full microservices architecture
  Event sourcing for order lifecycle
  CQRS pattern for admin reads
  Kafka for event streaming
  Dedicated data warehouse (Snowflake)
  ML-powered recommendation engine
  Real-time fraud detection
```

### Admin Panel Scalability

```
Large Dataset Handling:
  - Cursor-based pagination for orders (not offset)
  - Virtual scrolling for very long lists
  - Async export (background job + download link)
  - Aggregation queries on read replicas

Report Performance:
  - Pre-computed daily/weekly/monthly aggregates (cron)
  - Materialized views for common metrics
  - Report caching (regenerate on schedule or trigger)
  - Streaming CSV exports (no memory buffering)

Real-time at Scale:
  - Supabase Realtime → Scale to Ably or Pusher if needed
  - Selective subscriptions (admin subscribes only to relevant city/vendor)
  - Rate-limit real-time event broadcasts
```
