# 15 — MVP Plan

> **Purpose:** Define the minimum viable product version of Combovibes that can launch quickly, validate the market, and start generating revenue — while leaving a clear path to the full platform.

---

## Table of Contents

1. [MVP Philosophy](#1-mvp-philosophy)
2. [MVP Scope](#2-mvp-scope)
3. [What's IN the MVP](#3-whats-in-the-mvp)
4. [What's OUT of the MVP](#4-whats-out-of-the-mvp)
5. [MVP Feature Breakdown](#5-mvp-feature-breakdown)
6. [MVP Tech Simplifications](#6-mvp-tech-simplifications)
7. [Launch Checklist](#7-launch-checklist)
8. [MVP Timeline](#8-mvp-timeline)
9. [MVP Success Metrics](#9-mvp-success-metrics)
10. [Post-MVP Priority Queue](#10-post-mvp-priority-queue)

---

## 1. MVP Philosophy

**The core question:** What is the *minimum* we need to take an order, fulfill it, deliver it, and get paid?

**MVP Principles:**
- **Revenue-first**: Every feature must contribute to conversion or order fulfillment
- **Manual-first**: If it can be done manually at low volume, don't build automation yet
- **One city first**: Launch in 1-2 cities with pre-approved vendors before going national
- **Curated catalog**: Launch with 100-200 hand-picked SKUs, not 10,000 products
- **Phone support**: Support via WhatsApp initially instead of building a full ticket system
- **Simple admin**: Spreadsheet-like admin, not enterprise dashboards yet

---

## 2. MVP Scope

### MVP In One Sentence

> A beautiful product catalog where Indian customers can browse gifts, select delivery date, add a personalized message, and pay — with an admin to manage orders and a vendor to fulfill them.

### Launch City Strategy

```
Phase A: 1 city (Mumbai or Delhi)
  → 3-5 pre-approved vendors
  → 100-200 curated products
  → Same-day + standard delivery
  
Phase B (month 2): 3-5 cities
Phase C (month 4): 15+ cities
```

---

## 3. What's IN the MVP

### Customer-Facing
- ✓ Homepage with hero, categories, occasion strips, product carousels
- ✓ Category PLP with basic filters (price, delivery type, occasion)
- ✓ Product Detail Page with variants, delivery date selection, pincode check
- ✓ Gift message input on PDP
- ✓ Greeting card selection (5-10 card options)
- ✓ Add to cart with delivery slot selection
- ✓ Cart page with order summary
- ✓ Basic coupon code input
- ✓ Checkout with recipient details form
- ✓ Razorpay payment (UPI, cards, net banking)
- ✓ Order confirmation page + email
- ✓ Order tracking page (public, by order ID)
- ✓ Basic order history in account
- ✓ Login (email + OTP)
- ✓ Guest checkout

### Admin
- ✓ Simple product CRUD (name, price, images, stock, delivery config)
- ✓ Order list with status update
- ✓ Customer list
- ✓ Basic coupon management
- ✓ Delivery pincode + slot configuration
- ✓ Banner management (hero slides)

### Vendor
- ✓ Vendor login
- ✓ Order list (vendor-specific)
- ✓ Mark order as packed
- ✓ Mark as handed to agent

---

## 4. What's OUT of the MVP

### Deferred to Post-MVP

| Feature | Reason for Deferral |
|---|---|
| Personalization (photo upload) | Complex, requires manual processing at scale |
| Gift Finder Wizard | Nice-to-have, not blocking revenue |
| Loyalty points system | Complexity without proven retention issue |
| Referral program | Launch with manual referral tracking |
| Wishlist | Not blocking purchase |
| Vendor application form | Manually onboard first 10 vendors |
| Vendor earnings/payout dashboard | Manual payout via bank transfer initially |
| Review system | Collect reviews on WhatsApp initially |
| Blog / content | Post-launch SEO play |
| Corporate gifting portal | Phase 2 |
| International delivery | Phase 2 |
| Subscription gifting | Phase 2 |
| Gift Registry | Phase 3 |
| Push notifications | Phase 2 |
| WhatsApp Business API | Phase 2 (use basic SMS initially) |
| Advanced analytics/reports | Phase 2 |
| Audit logs | Phase 2 |
| RBAC (role-based admin) | Single admin user initially |
| Vendor support tickets | WhatsApp-based support initially |
| AI Gift Advisor | Phase 3 |
| Video reviews | Phase 3 |
| 360° product view | Phase 3 |
| A/B testing | Phase 3 |
| Mobile app | Phase 3 |

---

## 5. MVP Feature Breakdown

### 5.1 Homepage (MVP)

```
✓ Hero carousel (2-3 banners, manually managed)
✓ Category strip (6-8 categories)
✓ Occasion chips (6-8 occasions)
✓ Delivery urgency banner ("Order before X PM for same-day")
✓ Featured products carousel (manually curated)
✓ Footer (links, payments, trust badges)

SKIP:
✗ Personalization showcase section
✗ Review carousel (no reviews at launch)
✗ App download banner
✗ Brand strip (add when brand partners signed)
```

### 5.2 Product Catalog (MVP)

```
✓ 3-level category hierarchy
✓ Product cards with image, price, delivery badge
✓ Basic filters: Price range, Delivery type, Category
✓ Sort: Relevance, Price (low/high), Newest
✓ Load More button (not infinite scroll)
✓ Out-of-stock overlay

SKIP:
✗ Advanced faceted search
✗ Rating filter (no reviews yet)
✗ View toggle (grid only)
✗ Product comparison
```

### 5.3 PDP (MVP)

```
✓ Image gallery (3-5 images, swipe on mobile)
✓ Variant selector (size/weight chips)
✓ Price display with discount %
✓ Pincode delivery check
✓ Delivery date picker (calendar)
✓ Delivery slot selector (Morning/Evening/Midnight)
✓ Gift message text input (150 chars)
✓ Greeting card selection (5 options)
✓ 2 add-ons max (chocolate + balloon)
✓ Add to cart
✓ Related products (4 static products)

SKIP:
✗ Photo personalization (text personalization only if simple)
✗ Product video
✗ 360° view
✗ Customer reviews section (show static testimonials)
✗ Recently viewed
✗ Q&A section
```

### 5.4 Cart (MVP)

```
✓ Cart item with image, name, price
✓ Delivery date/slot display
✓ Gift message preview
✓ Quantity controls
✓ Remove item
✓ Order summary (subtotal, delivery, total)
✓ Promo code input (basic)
✓ Proceed to checkout

SKIP:
✗ Mini cart drawer (link to cart page instead)
✗ Wishlist move
✗ Cart add-on recommendations
✗ Multiple recipients per cart (one recipient to start)
✗ Wallet/loyalty points redemption
```

### 5.5 Checkout (MVP)

```
✓ Login/guest prompt
✓ Single delivery address form
✓ Delivery slot confirmation
✓ Gift message review
✓ Order summary
✓ Razorpay payment (UPI + cards)
✓ Order confirmation page
✓ Confirmation email (Resend)
✓ Confirmation SMS (Twilio/MSG91)

SKIP:
✗ Saved addresses
✗ Google Places autocomplete
✗ Wallet/loyalty at checkout
✗ Gift card application
✗ Slot real-time capacity (static capacity, track manually)
```

### 5.6 Orders (MVP)

```
✓ Account login (email + OTP)
✓ Order history list
✓ Order detail page
✓ Order status timeline
✓ Public tracking (/track/[order-id])
✓ Order cancellation (before processing)
✓ Basic refund (manual process + email notification)

SKIP:
✗ Reorder
✗ Invoice PDF download
✗ Return request flow
✗ Delivery agent tracking
✗ Realtime order status updates (page refresh instead)
```

### 5.7 Admin Panel (MVP)

```
✓ Simple product list + add/edit form
✓ Order list with status change dropdown
✓ Customer list (view only)
✓ Basic coupon CRUD
✓ Delivery slot config
✓ Hero banner upload
✓ Pincode serviceability CSV import

SKIP:
✗ Dashboard analytics charts (basic count tiles only)
✗ Category visual tree (form-based only)
✗ Vendor application workflow (manual)
✗ Review moderation
✗ Report pages
✗ Audit logs
✗ RBAC (single admin user)
```

### 5.8 Vendor Panel (MVP)

```
✓ Vendor login (manually created accounts)
✓ Assigned order list
✓ Mark as packed
✓ Mark as dispatched (enter agent name)
✓ View product inventory (simple table)
✓ Quick stock update

SKIP:
✗ Vendor application form (manual onboarding)
✗ Vendor product upload (admin adds products for vendor)
✗ Earnings dashboard
✗ Reports
✗ Support tickets
```

---

## 6. MVP Tech Simplifications

| Full Build | MVP Simplification |
|---|---|
| Redis for cart sessions | localStorage for guest cart |
| Algolia search | PostgreSQL full-text search |
| Real-time slot capacity | Static slot capacity (reset daily) |
| Dynamic personalization Canvas | Text-only personalization (stored as JSON) |
| PDF invoice generation | Email with order summary only |
| Automated refund | Manual refund with email notification |
| Email marketing platform | Simple Resend for transactional only |
| WhatsApp Business API | Regular SMS via Twilio |
| Push notifications | Email only |
| Supabase Realtime | Page refresh for order status |
| Google Places autocomplete | Manual address form |
| Vendor payout automation | Manual bank transfer + WhatsApp |

---

## 7. Launch Checklist

### Legal & Business
```
□ Company registered (PVT LTD or OPC)
□ GST registration complete
□ Bank account for business open
□ Razorpay account activated + KYC complete
□ Privacy Policy published
□ Terms of Service published
□ Refund Policy published
□ Shipping Policy published
□ Domain purchased and configured
□ SSL certificate active (auto via Vercel)
```

### Platform
```
□ All P0 features tested end-to-end
□ Mobile tested on iPhone + Android (Chrome)
□ Payment tested in test mode (all methods)
□ Payment activated in live mode
□ Order confirmation email delivering
□ Order confirmation SMS delivering
□ Pincode database populated (launch city)
□ Delivery slots configured for launch city
□ 100+ products live with images
□ All product prices finalized
□ Delivery charges configured
□ At least 1 active coupon for launch (e.g., WELCOME10)
□ Homepage banners uploaded
```

### Vendors
```
□ Minimum 3 vendors onboarded and trained
□ Vendor login credentials distributed
□ Vendor WhatsApp group created for support
□ Vendor fulfillment workflow tested end-to-end
□ At least 1 midnight delivery vendor confirmed
□ Delivery agent contact numbers collected
```

### Operations
```
□ Customer support WhatsApp number active
□ Support response process documented
□ Order processing SOP documented
□ Refund process SOP documented
□ Escalation contact list created
□ Emergency admin contact list
```

### Marketing
```
□ Google Analytics 4 installed
□ Facebook Pixel installed
□ Meta Business Manager set up
□ Google Ads account ready
□ Instagram page active (with launch content)
□ Soft launch to 50-100 beta users
□ Launch day promotional post scheduled
```

---

## 8. MVP Timeline

```
Week 1-2:    Foundation (Next.js setup, DB schema, design system, layout)
Week 3:      Authentication + Account basics
Week 4-5:    Product catalog (categories, PLP, PDP, search)
Week 6:      Cart + Gift features (message, card, add-ons, slots)
Week 7:      Checkout + Payment (Razorpay integration)
Week 8:      Orders + Tracking + Account
Week 9:      Admin panel (products, orders, customers, coupons)
Week 10:     Vendor panel (order fulfillment, inventory)
Week 11:     Testing + Bug fixes + Content entry (products, banners)
Week 12:     Soft launch (beta users) + fixes
Week 13:     Public launch
```

**Total: ~13 weeks (3 months) for 1-2 developers**

---

## 9. MVP Success Metrics

### Month 1 (Soft Launch)
```
Target: 50 orders
AOV: ₹600
Revenue: ₹30,000
On-time delivery: 90%+
Checkout conversion: 30%+
```

### Month 2
```
Target: 200 orders
Revenue: ₹1,20,000
New cities: 2-3
Vendors: 8-10
```

### Month 3
```
Target: 500 orders/month
Revenue: ₹3,00,000+
Cities: 5+
Repeat customers: 20%+
```

### Month 6 (Post-MVP)
```
Target: 2,000 orders/month
Revenue: ₹12,00,000+
Cities: 15+
Mobile app: In progress
```

---

## 10. Post-MVP Priority Queue

After launch, features should be added in this order based on business impact:

### Month 2 Priorities
1. **Review system** (social proof → conversion uplift)
2. **Wishlist** (retention + email retargeting)
3. **Saved addresses** (UX improvement, reduces checkout friction)
4. **Mini cart drawer** (reduces friction to view cart)
5. **Photo personalization** (premium segment, higher AOV)

### Month 3 Priorities
6. **Vendor application form** (scale vendor base without manual work)
7. **Vendor earnings dashboard** (vendor retention)
8. **Push notifications** (order updates)
9. **WhatsApp order notifications** (India-first comms)
10. **Loyalty points** (reduce churn)

### Month 4-6 Priorities
11. **Mobile app (React Native or PWA)** (65%+ traffic is mobile)
12. **Referral program** (organic growth)
13. **Advanced analytics dashboard**
14. **Corporate gifting portal**
15. **International delivery**
16. **AI Gift Finder / Recommendation engine**
17. **Subscription gifting**
18. **Gift Registry**
