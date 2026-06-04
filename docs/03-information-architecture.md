# 03 — Information Architecture

> **Purpose:** Complete sitemap, URL structure, navigation hierarchy, and content organization for the Combovibes platform.

---

## Table of Contents

1. [Global Navigation Structure](#1-global-navigation-structure)
2. [Public Pages Sitemap](#2-public-pages-sitemap)
3. [Customer Account Pages](#3-customer-account-pages)
4. [Admin Panel Pages](#4-admin-panel-pages)
5. [Vendor Panel Pages](#5-vendor-panel-pages)
6. [URL Naming Conventions](#6-url-naming-conventions)
7. [Navigation Hierarchy](#7-navigation-hierarchy)
8. [Content Taxonomy](#8-content-taxonomy)

---

## 1. Global Navigation Structure

### Primary Navigation (Header)

```
Logo
├── [Location Selector]
├── [Search Bar]
├── Categories (Mega Menu)
├── Occasions (Mega Menu)
├── Same Day Delivery
├── International
├── Corporate Gifting
├── [Wishlist Icon]
├── [Cart Icon]
└── [Login / Account]
```

### Category Mega Menu

```
Flowers
├── Roses
├── Mixed Bouquets
├── Exotic Flowers
├── Seasonal
├── Single Stem
└── Flower Baskets

Cakes
├── Birthday Cakes
├── Anniversary Cakes
├── Designer Cakes
├── Photo Cakes
├── Eggless Cakes
├── Cupcakes
└── By Weight (500g / 1kg / 2kg)

Plants
├── Indoor Plants
├── Outdoor Plants
├── Succulents
├── Bonsai
├── Bamboo
└── Plant + Pot Combos

Chocolates
├── Chocolate Boxes
├── Ferrero Rocher
├── Cadbury Hampers
├── Truffles
└── Custom Chocolates

Personalized Gifts
├── Photo Mugs
├── Photo Frames
├── Cushions
├── T-Shirts
├── LED Lamps
├── Phone Cases
└── Caricatures

Combos & Hampers
├── Flower + Cake
├── Flower + Chocolate
├── Gift Hampers
├── Festival Hampers
└── Corporate Hampers

Fashion & Accessories
├── Jewellery
├── Watches
├── Handbags
├── Scarves
└── Sunglasses

Home & Décor
├── Wall Art
├── Cushions
├── Candles
├── Photo Frames
└── Decorative Items
```

### Occasion Mega Menu

```
Personal Occasions
├── Birthday
├── Anniversary
├── Wedding
├── Baby Shower
├── Congratulations
├── Get Well Soon
├── Thank You
└── Just Because

Indian Festivals
├── Diwali
├── Raksha Bandhan
├── Holi
├── Eid
├── Christmas
├── Navratri
└── Pongal

Relationship-Based
├── For Her
├── For Him
├── For Parents
├── For Kids
├── For Friends
├── For Colleagues
└── For Boss

Calendar Occasions
├── Valentine's Day
├── Mother's Day
├── Father's Day
├── Teacher's Day
├── Friendship Day
└── New Year
```

### Bottom Navigation (Mobile)

```
Home | Categories | Search | Wishlist | Account
```

---

## 2. Public Pages Sitemap

```
/ (Homepage)

/products
  /products/[slug]                      — Product Detail Page
  /products/[slug]/personalize          — Personalization Flow

/category
  /category/[slug]                      — Category PLP (e.g., /category/flowers)
  /category/[parent]/[child]            — Subcategory PLP (e.g., /category/flowers/roses)

/occasion
  /occasion/[slug]                      — Occasion Landing Page
  /occasion/birthday
  /occasion/anniversary
  /occasion/mothers-day
  /occasion/raksha-bandhan
  /occasion/diwali
  /occasion/valentines-day
  /occasion/wedding
  /occasion/christmas
  /occasion/new-year
  /occasion/holi
  /occasion/eid

/collection
  /collection/[slug]                    — Curated Collection Page
  /collection/luxury-hampers
  /collection/office-gifting
  /collection/premium-flowers

/gifts
  /gifts/same-day-delivery              — Same Day Delivery PLP
  /gifts/midnight-delivery              — Midnight Delivery PLP
  /gifts/express-delivery               — Express Delivery PLP
  /gifts/under-500                      — Budget PLPs
  /gifts/under-1000
  /gifts/under-2500
  /gifts/for-her                        — Recipient PLPs
  /gifts/for-him
  /gifts/for-parents
  /gifts/for-kids
  /gifts/for-colleagues

/search
  /search?q=[query]                     — Search Results Page
  /search?occasion=birthday&budget=1000

/gift-finder                            — Gift Finder Wizard

/personalized-gifts                     — Personalization Hub

/brands
  /brands/[slug]                        — Brand Landing Page
  /brands/cadbury
  /brands/ferrero

/international                          — International Delivery Hub
  /international/[country-slug]

/corporate                              — Corporate Gifting Hub

/blog                                   — Gift Guides & Content
  /blog/[slug]

/about                                  — About Us
/careers                                — Careers Page
/contact                                — Contact Us
/faq                                    — FAQ
/sitemap                                — HTML Sitemap
/privacy-policy
/terms-of-service
/refund-policy
/shipping-policy
/cookie-policy
```

### Location-Based SEO Pages

```
/flowers-in-[city]                      — e.g., /flowers-in-mumbai
/cakes-in-[city]                        — e.g., /cakes-in-delhi
/gifts-in-[city]                        — e.g., /gifts-in-bangalore
/same-day-delivery-in-[city]
```

---

## 3. Customer Account Pages

```
/auth
  /auth/login                           — Login Page
  /auth/signup                          — Signup Page
  /auth/forgot-password
  /auth/reset-password?token=[token]
  /auth/verify-email?token=[token]
  /auth/verify-otp                      — OTP Verification

/account
  /account                              — Account Dashboard (redirect)
  /account/dashboard                    — Overview + Quick Stats
  /account/orders                       — Order History List
  /account/orders/[order-id]            — Order Detail + Tracking
  /account/orders/[order-id]/track      — Live Tracking
  /account/orders/[order-id]/invoice    — Download Invoice PDF
  /account/orders/[order-id]/return     — Return Request
  /account/wishlist                     — Wishlist
  /account/addresses                    — Address Book
  /account/addresses/new
  /account/addresses/[id]/edit
  /account/profile                      — Profile Settings
  /account/profile/change-password
  /account/notifications                — Notification Preferences
  /account/reviews                      — My Reviews
  /account/reviews/[product-id]/write   — Write a Review
  /account/wallet                       — Wallet & Credits
  /account/gift-cards                   — Gift Cards
  /account/referrals                    — Referral Program
  /account/subscriptions                — Subscription Management
  /account/subscriptions/[id]
```

### Cart & Checkout

```
/cart                                   — Cart Page
/checkout                               — Checkout (single page)
/checkout/success?order_id=[id]         — Order Confirmation
/checkout/failed?order_id=[id]          — Payment Failed
/track/[order-id]                       — Public Tracking (no auth)
```

---

## 4. Admin Panel Pages

```
/admin                                  — Redirect to dashboard

/admin/login                            — Admin Login

/admin/dashboard                        — Main Dashboard

/admin/products
  /admin/products                       — Products List
  /admin/products/new                   — Add Product
  /admin/products/[id]                  — Edit Product
  /admin/products/[id]/images           — Manage Images
  /admin/products/[id]/variants         — Manage Variants
  /admin/products/[id]/inventory        — Inventory Management
  /admin/products/[id]/seo              — SEO Settings

/admin/categories
  /admin/categories                     — Category Tree
  /admin/categories/new
  /admin/categories/[id]/edit
  /admin/categories/[id]/subcategories

/admin/collections
  /admin/collections
  /admin/collections/new
  /admin/collections/[id]/edit

/admin/occasions
  /admin/occasions
  /admin/occasions/new
  /admin/occasions/[id]/edit

/admin/orders
  /admin/orders                         — Orders List
  /admin/orders/[id]                    — Order Detail
  /admin/orders/[id]/edit               — Edit Order
  /admin/orders/[id]/refund             — Process Refund
  /admin/orders/[id]/assign             — Assign Vendor

/admin/customers
  /admin/customers                      — Customer List
  /admin/customers/[id]                 — Customer Profile
  /admin/customers/[id]/orders          — Customer Orders
  /admin/customers/[id]/edit

/admin/vendors
  /admin/vendors                        — Vendor List
  /admin/vendors/[id]                   — Vendor Profile
  /admin/vendors/[id]/products          — Vendor Products
  /admin/vendors/[id]/orders            — Vendor Orders
  /admin/vendors/[id]/payouts           — Payout History
  /admin/vendors/applications           — New Vendor Applications

/admin/coupons
  /admin/coupons
  /admin/coupons/new
  /admin/coupons/[id]/edit

/admin/delivery
  /admin/delivery/slots                 — Slot Configuration
  /admin/delivery/zones                 — Delivery Zones + Pincodes
  /admin/delivery/charges               — Delivery Charge Rules
  /admin/delivery/partners              — Logistics Partners

/admin/cms
  /admin/cms/banners                    — Banner Management
  /admin/cms/homepage                   — Homepage Section Editor
  /admin/cms/pages                      — Landing Pages
  /admin/cms/blog                       — Blog Management
  /admin/cms/blog/new
  /admin/cms/blog/[id]/edit
  /admin/cms/popups                     — Pop-up Manager
  /admin/cms/announcements              — Top Bar Announcements

/admin/marketing
  /admin/marketing/emails               — Email Campaign Manager
  /admin/marketing/sms                  — SMS Campaigns
  /admin/marketing/push                 — Push Notification Campaigns
  /admin/marketing/campaigns            — Campaign Calendar

/admin/reviews
  /admin/reviews                        — Review Queue
  /admin/reviews/[id]                   — Review Detail

/admin/reports
  /admin/reports/revenue
  /admin/reports/orders
  /admin/reports/products
  /admin/reports/customers
  /admin/reports/vendors
  /admin/reports/delivery

/admin/settings
  /admin/settings/general               — Company Info
  /admin/settings/payment               — Payment Gateway
  /admin/settings/tax                   — GST Configuration
  /admin/settings/shipping              — Shipping Settings
  /admin/settings/email                 — Email Config (SMTP)
  /admin/settings/sms                   — SMS Provider Config
  /admin/settings/notifications         — Notification Templates

/admin/access
  /admin/access/roles                   — Role Management
  /admin/access/roles/new
  /admin/access/roles/[id]/edit
  /admin/access/users                   — Admin Users
  /admin/access/users/new
  /admin/access/users/[id]/edit

/admin/audit-logs                       — Audit Log Viewer
```

---

## 5. Vendor Panel Pages

```
/vendor/login                           — Vendor Login
/vendor/apply                           — Vendor Application Form

/vendor/dashboard                       — Overview Dashboard

/vendor/products
  /vendor/products                      — My Products
  /vendor/products/new                  — Add Product
  /vendor/products/[id]/edit
  /vendor/products/[id]/images
  /vendor/products/[id]/inventory

/vendor/orders
  /vendor/orders                        — Incoming Orders
  /vendor/orders/[id]                   — Order Detail
  /vendor/orders/[id]/fulfill           — Mark as Packed/Shipped

/vendor/inventory
  /vendor/inventory                     — Inventory Overview
  /vendor/inventory/alerts              — Low Stock Alerts

/vendor/reports
  /vendor/reports/sales
  /vendor/reports/earnings

/vendor/earnings
  /vendor/earnings                      — Earnings Summary
  /vendor/earnings/payouts              — Payout History

/vendor/profile
  /vendor/profile                       — Business Profile
  /vendor/profile/bank                  — Bank Account Details
  /vendor/profile/documents            — KYC Documents

/vendor/support
  /vendor/support                       — Support Tickets
  /vendor/support/new
```

---

## 6. URL Naming Conventions

| Rule | Example |
|---|---|
| All lowercase | `/gifts/birthday-gifts` |
| Hyphens for spaces | `/occasion/mothers-day` |
| No trailing slashes | `/category/flowers` |
| Descriptive slugs | `/products/red-roses-bouquet-12` |
| ID + slug for products | `/products/abc123-red-roses` |
| Query params for filters | `/category/flowers?sort=price_asc&min=500` |
| Locale prefix (future) | `/en/category/flowers` |

---

## 7. Navigation Hierarchy

### Depth Limits

| Section | Max Depth |
|---|---|
| Product Categories | 3 levels (Category → Subcategory → Product) |
| Account Pages | 2 levels |
| Admin Pages | 3 levels |
| Vendor Pages | 2 levels |
| Public Content | 2 levels |

### Breadcrumb Structure

```
Homepage > Category > Subcategory > Product
Home > Occasions > Birthday > Red Roses Birthday Bouquet

Homepage > Account > Orders > Order #12345
Home > My Account > Orders > Order #CV-2024-12345
```

---

## 8. Content Taxonomy

### Product Taxonomy

```
Level 1: Category
  Level 2: Subcategory
    Level 3: Product Group
      - Products
        - Variants

Example:
Flowers (L1)
  └── Roses (L2)
       └── Red Roses (L3)
            ├── Red Rose Bouquet - 12 Stems
            ├── Red Rose Bouquet - 24 Stems
            └── Red Rose Basket - 30 Stems
```

### Occasion Taxonomy

```
Occasion Type
  └── Occasion
       └── Products tagged with this occasion

Personal (Type)
  └── Birthday (Occasion)
       └── [All products tagged #birthday]
```

### Collection Taxonomy

```
Collection (editorially curated, not hierarchical)
  └── Collection Products (ordered by merchandiser)

Examples:
- "Under ₹500 Birthday Gifts"
- "Premium Anniversary Collection"
- "Office Gifting Essentials"
- "Festival Hamper Picks"
```

### Tag Taxonomy

Tags are flat and multi-dimensional:

| Tag Type | Examples |
|---|---|
| Occasion | birthday, anniversary, wedding, diwali |
| Recipient | her, him, parents, kids, colleagues, boss |
| Delivery | same-day, midnight, express |
| Price Tier | budget, mid-range, premium, luxury |
| Product Type | flowers, cakes, plants, personalized |
| Mood | romantic, fun, formal, heartfelt |
| Feature | personalizable, eggless, vegan, organic |
