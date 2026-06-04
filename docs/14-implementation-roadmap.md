# 14 — Implementation Roadmap

> **Purpose:** Phased development plan breaking the Combovibes platform into manageable milestones, with timelines, team requirements, deliverables, and success criteria.

---

## Table of Contents

1. [Roadmap Overview](#1-roadmap-overview)
2. [Phase 1: Foundation](#2-phase-1-foundation)
3. [Phase 2: Authentication](#3-phase-2-authentication)
4. [Phase 3: Product Catalog](#4-phase-3-product-catalog)
5. [Phase 4: Cart & Gifting](#5-phase-4-cart--gifting)
6. [Phase 5: Checkout & Payment](#6-phase-5-checkout--payment)
7. [Phase 6: Orders & Tracking](#7-phase-6-orders--tracking)
8. [Phase 7: Admin Panel](#8-phase-7-admin-panel)
9. [Phase 8: Vendor Panel](#9-phase-8-vendor-panel)
10. [Phase 9: Marketing & Growth](#10-phase-9-marketing--growth)
11. [Phase 10: Optimization & Scale](#11-phase-10-optimization--scale)
12. [Technology Decisions](#12-technology-decisions)
13. [Risk Register](#13-risk-register)

---

## 1. Roadmap Overview

```
Phase 1  Foundation          2 weeks    Infrastructure, design system, DB
Phase 2  Authentication      1 week     Login, signup, OTP, OAuth
Phase 3  Product Catalog     3 weeks    Categories, PLP, PDP, Search
Phase 4  Cart & Gifting      2 weeks    Cart, gift messages, personalization
Phase 5  Checkout & Payment  2 weeks    Checkout flow, Razorpay
Phase 6  Orders & Tracking   1.5 weeks  Order management, tracking, notifications
Phase 7  Admin Panel         3 weeks    Full admin panel
Phase 8  Vendor Panel        2 weeks    Vendor onboarding and management
Phase 9  Marketing & Growth  2 weeks    Coupons, loyalty, CMS, SEO
Phase 10 Optimization        Ongoing    Performance, analytics, A/B testing

Total to MVP: ~14 weeks (3.5 months) with a 2-developer team
```

---

## 2. Phase 1: Foundation

**Duration:** 2 weeks | **Priority:** P0

### Objectives

- Project scaffolding and tooling setup
- Design system implementation
- Database schema creation
- Supabase project configuration

### Week 1 Tasks

#### Project Setup
```
□ Initialize Next.js 15 with TypeScript
□ Configure Tailwind CSS with custom design tokens
□ Install and configure shadcn/ui
□ Set up ESLint, Prettier, Husky pre-commit hooks
□ Configure path aliases in tsconfig.json
□ Set up environment variables (.env.local, .env.example)
□ Initialize Git with branching strategy (main, develop, feature/*)
□ Set up Vercel project for deployment
```

#### Supabase Setup
```
□ Create Supabase project (prod + staging)
□ Install Supabase CLI for local development
□ Create all database migrations (Phase 1-3 tables)
□ Configure Auth providers (email, phone OTP, Google)
□ Set up Storage buckets
□ Generate TypeScript types from schema
□ Configure RLS policies (initial set)
□ Create database helper functions
```

#### Design System
```
□ Define color tokens in Tailwind config
□ Configure font families (Playfair Display + Inter via next/font)
□ Create global CSS variables
□ Build design token documentation
□ Set up Storybook (optional but recommended)
```

### Week 2 Tasks

#### Layout Components
```
□ Root layout (fonts, providers, metadata)
□ TopBanner component
□ TopNavbar (desktop)
□ CategoryNavbar (desktop)
□ MegaMenu (skeleton)
□ Footer
□ MobileBottomNav
□ MobileHamburgerDrawer
□ LocationSelector modal
□ TanStack Query provider
□ Zustand store scaffolding
```

#### Homepage Shell
```
□ Homepage route and layout
□ HeroCarousel (static data)
□ CategoryStrip (static data)
□ SectionHeader component
□ Basic homepage structure (no data)
```

### Deliverables
- Running Next.js app with design system
- All DB migrations applied to Supabase
- Deployed to Vercel (staging URL)
- Header, footer, and page shell complete

### Success Criteria
- Lighthouse Performance: > 85 on homepage shell
- TypeScript: 0 type errors
- Mobile layout: correct at all breakpoints

---

## 3. Phase 2: Authentication

**Duration:** 1 week | **Priority:** P0

### Tasks

```
□ Login page (email + password)
□ Signup page with form validation (Zod)
□ OTP login flow (phone → send OTP → verify → session)
□ Google OAuth flow
□ Forgot password email flow
□ Reset password page
□ Email verification page
□ Auth callback route handler
□ Middleware for route protection
□ useAuth hook
□ AuthProvider (session management)
□ Guest checkout support (cart without auth)
□ Cart merge on login
□ Auth store (Zustand)
□ Profile auto-creation trigger (Supabase)
□ Account dashboard shell (protected)
```

### API Endpoints Built
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/otp/send`
- `POST /api/auth/otp/verify`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Deliverables
- Full auth flow working (email + OTP + Google)
- Protected routes working
- Session persistence across page refreshes

---

## 4. Phase 3: Product Catalog

**Duration:** 3 weeks | **Priority:** P0

### Week 3: Categories & PLP

```
□ Category/subcategory tree (DB + API)
□ Occasion pages (DB + API)
□ GET /api/categories
□ GET /api/occasions
□ GET /api/products (with all filters)
□ Category PLP page with:
  □ Breadcrumb component
  □ Filter sidebar (desktop)
  □ Filter bottom sheet (mobile)
  □ Product grid
  □ ProductCard component (full)
  □ ProductCardSkeleton
  □ Sort dropdown
  □ Active filter pills
  □ Pagination / Load More
  □ Empty state
□ URL-based filter state
□ TanStack Query for products list
```

### Week 4: Product Detail Page

```
□ GET /api/products/[slug]
□ PDP route and page
□ ProductGallery (image zoom, swipe)
□ ProductInfo panel
□ VariantSelector (size, weight, color)
□ PriceDisplay component
□ RatingStars component
□ DeliveryBadge component
□ StockStatus component
□ WishlistButton (with optimistic update)
□ QuantityStepper
□ ProductTabs (Description, Care, Delivery)
□ Related products carousel
□ Recently viewed (localStorage + TanStack Query)
□ Structured data (JSON-LD)
□ Dynamic OG images
□ ISR configuration
```

### Week 5: Search & Homepage

```
□ GET /api/search
□ GET /api/search/suggestions
□ SearchBar (expand on focus, overlay)
□ SearchSuggestions dropdown
□   - Product suggestions
□   - Category/occasion suggestions
□   - Trending searches
□   - Recent searches
□ Search results page
□ Zero results state
□ GET /api/homepage
□ All homepage sections (with real data):
  □ HeroCarousel (CMS-driven)
  □ CategoryStrip
  □ OccasionChips
  □ DeliveryCountdownBanner
  □ ProductCarousels (bestsellers, new, trending)
  □ PersonalizationBanner
  □ OccasionCollectionsGrid
□ Occasion landing pages
□ Collection pages
□ Delivery-type PLPs (Same Day, Midnight, Express)
□ Budget PLPs (Under ₹500, ₹1000, etc.)
□ Wishlist page
□ Pincode serviceability API
```

### Deliverables
- Full browsing experience from homepage to PDP
- Search working
- Wishlist functional
- All PLPs working with real data

---

## 5. Phase 4: Cart & Gifting

**Duration:** 2 weeks | **Priority:** P0

### Week 6: Cart

```
□ Cart DB tables + RLS policies
□ GET/POST/PATCH/DELETE /api/cart
□ POST /api/cart/coupon
□ Cart page (full layout)
□ CartItem component
□ MiniCartDrawer
□ OrderSummary component
□ PromoCodeInput (with validation)
□ Cart persistence (localStorage for guest, Supabase for auth)
□ Cart merge on login
□ Cart Zustand store
□ Inventory reservation on add
□ Out-of-stock detection in cart
□ Quantity stepper with stock validation
□ Delivery charge calculation
□ Cart recommendations
```

### Week 7: Gift Features

```
□ GiftMessageInput component
□ GreetingCardPicker component
□ Greeting cards data + API
□ AddOnSelector (chocolate, balloon, wrapping)
□ Add-ons pricing display
□ Delivery date picker in cart
□ DeliverySlotPicker in cart
□ Multiple recipients per cart
□ Gift preview in cart item
□ Personalization flow (basic):
  □ PersonalizationPanel
  □ ImageUploader
  □ TextCustomizer
  □ PersonalizationPreview (static template)
  □ Save to cart_item.personalization
```

### Deliverables
- Full cart with all gift features
- Personalization working (text + image)
- Delivery slot selection working
- Promo code application working

---

## 6. Phase 5: Checkout & Payment

**Duration:** 2 weeks | **Priority:** P0

### Week 8: Checkout Flow

```
□ Checkout page (single-page progressive)
□ CheckoutProgress component
□ RecipientDetailsForm (with Zod validation)
□ AddressAutocomplete (Google Places)
□ SavedAddressSelector
□ Pincode validation (real-time)
□ DeliveryDateCalendar
□ DeliverySlotGrid
□ GiftMessageStep
□ GreetingCardSelector
□ OrderReviewStep
□ CheckoutOrderSummary (sticky)
□ Wallet/Points toggle at checkout
□ Gift card application
□ Checkout state (Zustand)
□ POST /api/orders
□ POST /api/checkout/validate
□ Address save flow
□ Guest checkout email capture
```

### Week 9: Payment

```
□ Razorpay SDK integration
□ POST /api/payment/initiate
□ POST /api/payment/verify
□ POST /api/payment/retry
□ POST /api/webhooks/razorpay
□ UPI payment UI
□ Card payment UI
□ Net banking selector
□ Wallet payment option
□ COD option (with availability check)
□ Payment failure handling
□ Payment retry flow
□ Order Confirmation page:
  □ Success animation (Framer Motion confetti)
  □ Order summary
  □ WhatsApp share button
  □ Cross-sell section
□ Payment Failed page
□ Email: order confirmation (via Resend/SendGrid)
□ SMS: order confirmation (via Twilio)
```

### Deliverables
- Complete checkout → payment → confirmation flow
- Razorpay integration tested with test mode
- Order confirmation emails/SMS working
- Guest checkout working

---

## 7. Phase 6: Orders & Tracking

**Duration:** 1.5 weeks | **Priority:** P0

### Tasks

```
□ Account orders list page
□ Order detail page
□ Order timeline component
□ Public tracking page (/track/[id])
□ GET /api/orders/[id]
□ GET /api/orders/[id]/track
□ POST /api/orders/[id]/cancel
□ Order cancellation flow (with refund initiation)
□ Refund API (Razorpay refund)
□ Order status realtime updates (Supabase Realtime)
□ Delivery agent info display
□ Download invoice (PDF generation)
□ Reorder functionality
□ Review prompt (24h after delivery)
□ Review submission form
□ GET/POST /api/reviews
□ Review moderation (pending status)
□ Notification system:
  □ Dispatch notification (email + SMS)
  □ Out-for-delivery SMS
  □ Delivered confirmation
□ Account dashboard (overview page)
□ Address book CRUD
□ Profile settings page
□ Notification preferences page
```

### Deliverables
- Complete post-order customer journey
- Order tracking working
- Reviews submittable
- Account pages all functional

---

## 8. Phase 7: Admin Panel

**Duration:** 3 weeks | **Priority:** P0

### Week 11: Admin Foundation + Products

```
□ Admin layout (sidebar + topbar)
□ Admin authentication + middleware
□ RBAC role check in all admin APIs
□ Admin dashboard KPIs
□ Revenue + order charts (Recharts)
□ Admin product list (DataTable)
□ Product add/edit form (all 7 tabs)
□ Media uploader
□ Variant builder
□ Product bulk actions
□ Category tree management
□ Occasion management
□ Collection management
□ Image upload to Supabase Storage
```

### Week 12: Orders + Customers + Coupons

```
□ Order list with all filters
□ Order detail page (admin view)
□ Order status update
□ Refund processing
□ Customer list
□ Customer detail page
□ Customer suspend/ban
□ Coupon list + create/edit form
□ Coupon validation rules builder
□ Review moderation queue
□ Review approve/reject/reply
```

### Week 13: Delivery + Settings + Reports

```
□ Delivery zone management
□ Slot configuration
□ Pincode CSV import/export
□ Admin settings (payment, email, SMS)
□ Notification template editor
□ Banner CMS management
□ Revenue report page
□ Order report page
□ Product report page
□ Customer report page
□ CSV/Excel export
□ Audit log viewer
□ Admin user management
□ Role permissions matrix
```

### Deliverables
- Full admin panel operational
- All CRUD operations working
- Reports generating correctly
- RBAC enforced on all admin routes

---

## 9. Phase 8: Vendor Panel

**Duration:** 2 weeks | **Priority:** P1

### Tasks

```
□ Vendor application form + flow
□ Vendor onboarding wizard
□ Vendor auth + middleware
□ Vendor dashboard
□ Vendor product management
□ Product submission for review
□ Admin review → approve/reject flow
□ Vendor order list
□ Order fulfillment actions (accept, pack, dispatch)
□ Packing photo upload
□ Vendor inventory management
□ Inventory low stock alerts
□ Vendor earnings dashboard
□ Commission calculation display
□ Payout history table
□ Vendor profile management
□ Bank account details (secure)
□ KYC document upload
□ Vendor notifications
□ Support ticket system
□ Vendor performance metrics
□ Admin vendor management:
  □ Vendor list + approval queue
  □ Vendor profile view
  □ Payout initiation
  □ Vendor suspension
```

### Deliverables
- Vendor can apply and get approved
- Vendor can add products
- Vendor can fulfill orders
- Earnings tracking working
- Admin can manage vendors

---

## 10. Phase 9: Marketing & Growth

**Duration:** 2 weeks | **Priority:** P1

### Tasks

```
□ Loyalty points system (earn + redeem)
□ Wallet system (credits + transactions)
□ Referral program
□ Gift cards (purchase + redemption)
□ Abandoned cart recovery (Supabase Edge Function)
□ Festival reminder notifications
□ Email marketing templates
□ Push notification setup (Firebase)
□ WhatsApp Business API integration (order updates)
□ Google Analytics 4 integration
□ Google Shopping product feed
□ Facebook Pixel integration
□ SEO: XML sitemap
□ SEO: Dynamic robots.txt
□ SEO: Structured data (Product, Review, BreadcrumbList)
□ Local SEO pages (flowers-in-mumbai etc.)
□ Blog CMS + content
□ Gift Finder Wizard
□ Personalization improvements:
  □ Real-time Canvas preview
  □ Advanced font/color options
  □ Preview generation Edge Function
□ Subscription gifting (basic)
```

### Deliverables
- Loyalty + wallet system live
- Abandoned cart recovery sending
- Full SEO implementation
- Analytics tracking working

---

## 11. Phase 10: Optimization & Scale

**Duration:** Ongoing

### Performance

```
□ Core Web Vitals audit and fixes
□ Next.js ISR for all category + product pages
□ Image optimization (WebP, AVIF, blur placeholders)
□ React Query prefetching on hover
□ Font subsetting
□ JavaScript bundle analysis + splitting
□ Database query optimization
□ Supabase connection pooling (PgBouncer)
□ CDN configuration for static assets
□ HTTP/2 push headers
□ Service Worker (PWA offline)
```

### Testing

```
□ Unit tests: Utility functions, validation schemas
□ Integration tests: API endpoints
□ E2E tests: Critical user journeys (Playwright)
  □ Homepage → PDP → Cart → Checkout → Confirmation
  □ Search → Filter → Add to Cart
  □ Login → Account → Order History
□ Accessibility audit (WCAG 2.1 AA)
□ Performance regression tests
□ Load testing (k6) for checkout flow
```

### Monitoring

```
□ Vercel Analytics
□ Sentry error monitoring
□ Custom admin dashboard metrics
□ Database performance monitoring
□ Uptime monitoring
□ Alert setup for P0 errors
```

---

## 12. Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 App Router | RSC, Streaming, ISR, optimal for SEO |
| **Styling** | Tailwind CSS 4 | Utility-first, highly customizable |
| **UI Components** | shadcn/ui | Unstyled radix primitives, fully owned |
| **Database** | Supabase (PostgreSQL) | Managed DB + Auth + Storage + Realtime |
| **State** | Zustand + TanStack Query | Client state + server state separation |
| **Payment** | Razorpay | India-first, all payment methods, webhooks |
| **Email** | Resend | Developer-friendly, React Email templates |
| **SMS** | Twilio / MSG91 | Reliable Indian SMS delivery |
| **Search** | PostgreSQL FTS | Start simple; migrate to Algolia at scale |
| **Animation** | Framer Motion | Declarative, React-native animations |
| **Forms** | React Hook Form + Zod | Performant forms + type-safe validation |
| **Charts** | Recharts | React-native, composable |
| **Images** | Next.js Image + Supabase | Automatic optimization + CDN |
| **Deployment** | Vercel | Zero-config Next.js hosting |

---

## 13. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Payment integration delays | Medium | High | Use Razorpay test mode early; start integration in Phase 5 |
| Delivery slot complexity | High | Medium | Build simple slot system first; add capacity limits later |
| Personalization preview performance | Medium | Medium | Use Edge Function or Cloudinary for image generation |
| SEO cannibalization (location pages) | Low | Medium | Proper canonical tags + unique content per location |
| Supabase RLS bugs | Medium | High | Thorough RLS testing with multiple user roles |
| Vendor onboarding bottleneck | Medium | Medium | Pre-approve 10+ vendors before launch |
| Inventory sync errors | Medium | High | Double-check reservation logic; add safety stock buffer |
| Mobile performance | Medium | High | Test on low-end Android devices throughout development |
| GST compliance complexity | Low | Medium | Consult CA; implement standard rates per category |
| Data security (KYC docs) | Low | Critical | Supabase Storage private bucket; admin-only access |
