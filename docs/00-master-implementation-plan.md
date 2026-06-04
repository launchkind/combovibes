# 00 — Master Implementation Plan

> **Decision document.** This is HOW we build Combovibes, in what exact order, and why. Every decision is made here so we never debate order during development.

---

## Current State Assessment

The existing codebase is a basic fashion template (MAMRON) with:
- Next.js 14 (we will upgrade to 15)
- Redux Toolkit (we will migrate to Zustand + TanStack Query)
- No Supabase
- No auth
- Static hardcoded data
- Basic layout shell (TopBanner, Navbar, Footer)
- No gifting features whatsoever

**Approach:** We will do a **clean architectural rebuild** on top of the existing repo, replacing everything systematically. We keep the repo, delete the old template code, and build fresh.

---

## The Build Order Philosophy

We build in **vertical slices** — each sprint delivers a working, testable, deployable feature. We never build half a feature.

```
Rule 1: Database first, then API, then UI
Rule 2: Happy path first, edge cases after feature is working
Rule 3: Mobile-first for every UI component
Rule 4: Every sprint ends with something you can click through in a browser
Rule 5: No feature is "done" until it works on mobile at 375px width
```

---

## Sprint Map (15 Sprints Total)

```
SPRINT 01 — Foundation & Design System        (Week 1)
SPRINT 02 — Database & Supabase Setup         (Week 1-2)
SPRINT 03 — Layout & Navigation               (Week 2)
SPRINT 04 — Homepage                          (Week 3)
SPRINT 05 — Authentication                    (Week 3-4)
SPRINT 06 — Product Catalog & PLP             (Week 4-5)
SPRINT 07 — Product Detail Page (PDP)         (Week 5)
SPRINT 08 — Search & Discovery                (Week 6)
SPRINT 09 — Cart & Gift Features              (Week 6-7)
SPRINT 10 — Checkout & Delivery               (Week 7-8)
SPRINT 11 — Payment (Razorpay)                (Week 8)
SPRINT 12 — Orders, Tracking & Account        (Week 9)
SPRINT 13 — Admin Panel                       (Week 10-11)
SPRINT 14 — Vendor Panel                      (Week 11-12)
SPRINT 15 — SEO, Performance & Launch Prep    (Week 13)
```

---

## SPRINT 01 — Foundation & Design System

**Goal:** A running Next.js 15 app with the complete design system installed, zero functional features but perfect visual foundation.

### Step 1.1 — Upgrade & Clean Dependencies

```
Actions:
  1. Upgrade Next.js 14 → 15
  2. Remove Redux Toolkit, redux-persist, react-redux
  3. Add: zustand, @tanstack/react-query, @tanstack/react-table
  4. Add: @supabase/supabase-js, @supabase/ssr
  5. Add: react-hook-form, @hookform/resolvers, zod
  6. Add: razorpay (types only on client)
  7. Add: resend (server-only)
  8. Add: date-fns (date utilities)
  9. Add: sharp (image optimization, server)
  10. Keep: framer-motion, lucide-react, embla-carousel-react
  11. Keep: tailwind-merge, clsx, class-variance-authority
  12. Add: sonner (toast notifications — replaces custom)
  13. Add: recharts (charts for admin)
  14. Add: react-dropzone (file uploads)
  15. Add: @tiptap/react, @tiptap/starter-kit (rich text for admin)
  16. Keep all existing shadcn/radix-ui packages
```

### Step 1.2 — Project Structure Setup

```
Actions:
  1. Create: src/features/ directory
  2. Create: src/services/ directory
  3. Create: src/store/ directory
  4. Create: src/supabase/ directory
  5. Rename: src/types/* → keep, update type definitions
  6. Create: src/lib/utils.ts (cn helper)
  7. Create: src/lib/constants.ts
  8. Create: src/lib/formatters.ts (price, date, phone)
  9. Create: src/lib/validations/ (Zod schemas)
  10. Update: tsconfig.json paths (@ alias)
  11. Create: .env.local from .env.example
  12. Create: .env.example with all required variables
```

### Step 1.3 — Design System Tokens

```
Actions:
  1. Update tailwind.config.ts:
     - Custom colors (primary rose-gold, cream bg, charcoal)
     - Custom font families (Playfair Display + Inter)
     - Custom shadows (shadow-card, shadow-warm)
     - Custom border-radius extensions
  2. Update src/styles/globals.css:
     - CSS custom properties for all design tokens
     - Base body styles (bg-cream, font-inter)
     - Scrollbar styling
     - Selection color
  3. Update src/styles/fonts.ts:
     - Remove Satoshi
     - Add Playfair Display (Google Fonts via next/font)
     - Add Inter (Google Fonts via next/font)
  4. Install additional shadcn components:
     - calendar, slider, command, popover, tooltip
     - progress, scroll-area, collapsible
     - skeleton, separator, badge
```

### Step 1.4 — Root Layout Rebuild

```
Actions:
  1. Rewrite src/app/layout.tsx:
     - New fonts
     - Sonner <Toaster> provider
     - TanStack Query provider wrapper
     - Zustand hydration setup
     - Correct metadata (Combovibes branding)
  2. Create src/app/providers.tsx:
     - QueryClientProvider
     - Auth session provider
  3. Delete old page.tsx content (keep file, clear it)
```

**Sprint 01 Deliverable:** `npm run dev` shows a blank page with correct fonts, no errors, all packages installed.

---

## SPRINT 02 — Database & Supabase Setup

**Goal:** Complete Supabase database schema live, Supabase client working, types generated.

### Step 2.1 — Supabase Project Init

```
Actions:
  1. Create Supabase project at supabase.com
  2. Install Supabase CLI: npm install -g supabase
  3. supabase init (creates supabase/ folder)
  4. supabase login
  5. Link to project: supabase link --project-ref [ref]
  6. Create supabase/config.toml
```

### Step 2.2 — Database Migrations (in order)

```
Migration files to create and run (supabase/migrations/):

001_extensions.sql
  - Enable: uuid-ossp, pgcrypto, pg_trgm, unaccent

002_users_profiles.sql
  - profiles table
  - addresses table
  - notification_preferences table
  - handle_new_user() trigger
  - on_auth_user_created trigger

003_catalog.sql
  - categories table (self-referential parent_id)
  - occasions table
  - collections table
  - brands table
  - products table (full schema)
  - product_images table
  - product_variants table
  - product_occasions junction
  - product_collections junction
  - personalization_config table

004_inventory.sql
  - inventory table
  - reserve_inventory() function
  - release_inventory() function

005_shopping.sql
  - wishlists table
  - cart_items table
  - greeting_cards table

006_orders.sql
  - orders table
  - order_items table
  - order_status_history table
  - generate_order_number() function + sequence
  - slot_bookings table

007_delivery.sql
  - delivery_zones table
  - delivery_slots table
  - pincode_serviceability table

008_payments.sql
  - payments table
  - refunds table
  - gift_cards table
  - gift_card_transactions table
  - wallet_transactions table
  - loyalty_transactions table

009_reviews.sql
  - reviews table
  - review_helpful_votes table

010_gifting.sql
  - gift_messages table
  - personalization_orders table

011_marketing.sql
  - coupons table
  - coupon_usage table
  - campaigns table

012_vendors.sql
  - vendors table
  - vendor_payouts table

013_cms.sql
  - banners table
  - cms_pages table
  - blog_posts table

014_admin_rbac.sql
  - admin_roles table
  - admin_users table
  - admin_permissions table
  - Seed 9 default roles with permissions JSON

015_audit_notifications.sql
  - audit_logs table
  - notifications table
  - notification_preferences (already in 002, skip)

016_rls_policies.sql
  - Enable RLS on all tables
  - All SELECT, INSERT, UPDATE, DELETE policies
  - Helper functions: is_admin(), get_vendor_id(), is_vendor()

017_triggers.sql
  - update_product_rating() trigger
  - award_loyalty_points() trigger
  - check_low_stock() trigger
  - log_product_changes() audit trigger
  - log_order_changes() audit trigger

018_indexes.sql
  - All performance indexes from doc 06

Run: supabase db push (for each migration)
```

### Step 2.3 — Supabase Client Setup

```
Files to create:
  src/lib/supabase/client.ts     → browser client (createBrowserClient)
  src/lib/supabase/server.ts     → RSC server client (createServerClient)
  src/lib/supabase/middleware.ts → middleware client
  src/lib/supabase/admin.ts      → service role client (server-only)

Generate types:
  supabase gen types typescript --local > src/types/supabase.ts
```

### Step 2.4 — Storage Buckets

```
Create via Supabase dashboard or CLI:
  - product-images (public)
  - category-images (public)
  - banners (public)
  - personalization-uploads (private)
  - personalization-previews (public)
  - review-images (public)
  - user-avatars (public)
  - greeting-cards (public)
  - vendor-documents (private)
  - invoices (private)

Apply storage policies (SQL migration 019_storage_policies.sql)
```

### Step 2.5 — Middleware Setup

```
Create src/middleware.ts:
  - Session refresh on every request
  - Protect /account/* routes
  - Protect /admin/* routes
  - Protect /vendor/* routes
  - Redirect to login with ?redirect= param
```

### Step 2.6 — Seed Data

```
Create supabase/seed.sql:
  - 8 root categories with icons
  - 40 subcategories
  - 10 occasions
  - 5 collections
  - 3 brands
  - 50 pincode records (Mumbai + Delhi serviceable pincodes)
  - 5 delivery zones (Mumbai-South, Mumbai-West, Delhi-Central, etc.)
  - 12 delivery slots (per zone: morning, afternoon, evening, midnight)
  - 10 greeting card templates
  - 9 admin roles (seeded from 014 migration)
  - 1 super admin user (manual creation via Supabase Auth)
  - 20 sample products with images

Run: supabase db seed
```

**Sprint 02 Deliverable:** Supabase dashboard shows all tables, supabase.ts types file generated, can query products from the browser console.

---

## SPRINT 03 — Layout & Navigation

**Goal:** Complete, pixel-perfect header, footer, mobile nav — identical on every page.

### Step 3.1 — Global Stores (Zustand)

```
Files to create:
  src/store/locationStore.ts   → pincode, city, serviceability
  src/store/cartStore.ts       → cart item count (client-side cache)
  src/store/uiStore.ts         → drawer open/close, modals, active menu
  src/store/authStore.ts       → user session cache
```

### Step 3.2 — Top Banner

```
File: src/components/layout/header/TopBanner.tsx
  - Fetch active announcements from Supabase (banners table, placement='announcement')
  - Scrolling marquee with framer-motion
  - Dismissible (sessionStorage)
  - X close button
  - ISR: revalidate every 1 hour
```

### Step 3.3 — Top Navbar (Desktop)

```
File: src/components/layout/header/TopNavbar.tsx
  - Logo (SVG, links to /)
  - LocationSelector button (shows city or "Select City")
  - SearchBar (not functional yet — just shell)
  - WishlistIcon (heart + count badge, links to /account/wishlist)
  - CartIcon (bag + count badge from cartStore)
  - LoginButton / UserDropdown (if logged in)
  - Sticky on scroll (reduces to 56px from 72px using scroll position)
  - Mobile: hide location + auth buttons, keep search + cart + hamburger
```

### Step 3.4 — Location Selector Modal

```
File: src/components/delivery/LocationSelectorModal.tsx
  - PincodeInput (6-digit, validates on enter)
  - "Detect my location" button (browser geolocation → reverse geocode)
  - Popular cities grid (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata)
  - On select: API call to /api/delivery/check, saves to locationStore
  - Shown as Dialog (shadcn)
```

### Step 3.5 — Category Navbar

```
File: src/components/layout/header/CategoryNavbar.tsx
  - Fetch categories from Supabase (8 top-level)
  - Horizontal scroll on overflow
  - Each tab triggers MegaMenu on hover (desktop) / tap (mobile)
  - Active state for current category page
  - "More" dropdown for remaining categories
```

### Step 3.6 — Mega Menu

```
File: src/components/layout/header/MegaMenu.tsx
  - 3-column layout: Subcategories | Featured Collections | Promo Banner
  - Opens on hover with 150ms intent delay
  - Closes on mouse leave (200ms delay)
  - Animated: fade + slide down (Framer Motion)
  - Data: subcategories fetched per category (cached by React Query)
  - Mobile: NOT shown (hamburger drawer instead)
```

### Step 3.7 — Mobile Hamburger Drawer

```
File: src/components/layout/mobile/MobileHamburgerDrawer.tsx
  - Full-height left side drawer (Sheet from shadcn)
  - Accordion for category → subcategory
  - Login/Account link at bottom
  - WhatsApp support link
  - Social links
  - Framer Motion slide-in
```

### Step 3.8 — Mobile Bottom Navigation

```
File: src/components/layout/mobile/MobileBottomNav.tsx
  - Fixed bottom bar, 5 items
  - Home | Categories | Search | Wishlist | Account
  - Active state with filled icon variant
  - Cart count badge on Wishlist for now (move to cart icon in future)
  - Only shown on mobile (hidden md:hidden)
```

### Step 3.9 — Footer

```
File: src/components/layout/footer/Footer.tsx
  - 5-column grid (desktop), accordion on mobile
  - Logo + tagline + social links (col 1)
  - Quick Links (col 2)
  - Help & Support (col 3)
  - Gift Categories (col 4)
  - App download + payment logos (col 5)
  - Bottom strip: copyright + trust badges
  - Static data (no API needed)
```

### Step 3.10 — Route Group Layouts

```
Files to create:
  src/app/(marketing)/layout.tsx     → full header + footer
  src/app/(shop)/layout.tsx          → full header + footer + location context
  src/app/(auth)/layout.tsx          → minimal header only
  src/app/(customer)/layout.tsx      → full header + account sidebar
  src/app/(admin)/layout.tsx         → admin sidebar + topbar (no public nav)
  src/app/(vendor)/layout.tsx        → vendor sidebar + topbar

Update root src/app/layout.tsx:
  - Remove TopBanner, TopNavbar, Footer (moved to route group layouts)
  - Keep providers only
```

**Sprint 03 Deliverable:** Navigate to `/` — see complete header, mobile nav, footer. No errors. All links present (even if 404 for now).

---

## SPRINT 04 — Homepage

**Goal:** Fully dynamic, data-driven homepage that looks premium and production-ready.

### Step 4.1 — Homepage API Route

```
File: src/app/api/homepage/route.ts
  - Single endpoint returns all homepage sections
  - Uses Supabase server client
  - Fetches: active banners, top categories, occasions,
             featured products, bestsellers, new arrivals
  - Cache: Next.js fetch cache, revalidate 300 seconds
  - Response shape typed with TypeScript
```

### Step 4.2 — Hero Carousel

```
File: src/components/homepage/HeroCarousel.tsx
  - Embla Carousel (already in project)
  - Full-width, 580px desktop / 380px mobile
  - Autoplay 4 seconds
  - Dot indicators + prev/next arrows
  - Each slide: image + gradient overlay + heading + subtext + CTA button
  - Data from banners table (placement='hero')
  - Ken Burns motion effect (CSS animation)
  - Skeleton during load
```

### Step 4.3 — Category Strip

```
File: src/components/homepage/CategoryStrip.tsx
  - Horizontal scroll, 8 category cards
  - Card: icon (SVG) + category name
  - Hover: scale 1.05 + shadow
  - Links to /category/[slug]
  - Mobile: touch scroll, no visible scrollbar
  - Data from categories table (top-level, is_active=true)
```

### Step 4.4 — Occasion Chips

```
File: src/components/homepage/OccasionChips.tsx
  - Wrapping chips row
  - Pill shape: icon/emoji + occasion name
  - Hover: bg-primary text-white
  - Links to /occasion/[slug]
  - Data from occasions table, ordered by sort_order
```

### Step 4.5 — Delivery Countdown Banner

```
File: src/components/homepage/DeliveryCountdownBanner.tsx
  - "Order in [X]h [Y]m for Same Day Delivery to [City]"
  - Live countdown timer (useInterval, updates every second)
  - Cutoff time: 3 PM IST daily
  - After cutoff: "Order now for Tomorrow's Delivery"
  - City from locationStore
  - CTA: "Shop Same Day →" links to /gifts/same-day-delivery
  - Background: primary rose-gold
```

### Step 4.6 — Section Header Component

```
File: src/components/common/SectionHeader.tsx
  - Props: title, subtitle?, viewAllLink?, viewAllText?
  - Title: Playfair Display, H2
  - View All: text link with arrow icon, right-aligned
  - Reused on every product section
```

### Step 4.7 — Product Card

```
File: src/components/product/ProductCard.tsx
  - This is the MOST REUSED component in the app. Build it perfectly.
  - Props: product, showWishlistButton?, showDeliveryBadge?, size?
  - Image: Next.js Image, aspect-4/3, hover shows secondary image (CSS transition)
  - WishlistButton: top-right, heart icon, optimistic toggle
  - Badges: Bestseller | New | Sale | Express | Personalizable (top-left stack)
  - Product name: 2-line clamp
  - PriceDisplay: sale price + strikethrough MRP + discount %
  - RatingStars: filled stars + count
  - DeliveryBadge: "Today" / "Tomorrow" / "Midnight" chip
  - "Add to Cart" button: slides up on hover (desktop) / always visible (mobile)
  - Card hover: translateY(-4px) shadow lift (Framer Motion)
  - Link: wraps entire card, links to /products/[slug]
  - Skeleton variant for loading state
```

### Step 4.8 — Product Carousel

```
File: src/components/homepage/ProductCarousel.tsx
  - Props: title, viewAllLink, products, isLoading
  - Embla Carousel horizontal scroll
  - 5 cards visible desktop, 3 tablet, 1.5 mobile
  - Prev/Next arrows (desktop)
  - TanStack Query for data fetching
  - ProductCard skeleton × 5 during loading
  - Sections: New Arrivals | Bestsellers | Trending (tabbed)
```

### Step 4.9 — Occasion Collections Grid

```
File: src/components/homepage/OccasionCollectionsGrid.tsx
  - 4-col grid desktop, 2-col mobile
  - Large editorial cards (aspect 4:3)
  - Image + gradient overlay + title + CTA
  - Hover: image scale 1.03
  - Data: top 4 active occasions or curated collections
```

### Step 4.10 — Personalization Banner

```
File: src/components/homepage/PersonalizationBanner.tsx
  - Split 2-column (50/50) on desktop, stacked on mobile
  - Left: headline "Make It Uniquely Theirs" + subtext + CTA button
  - Right: 4-image grid of personalized product examples
  - Background: primary-light (warm cream)
  - CTA → /personalized-gifts
```

### Step 4.11 — Review Carousel

```
File: src/components/homepage/ReviewCarousel.tsx
  - Embla carousel, 3 cards visible desktop, 1 mobile
  - Card: stars + quote text + reviewer name + product bought
  - Data: static (curated testimonials hardcoded initially)
  - Replace with real reviews post-launch
```

### Step 4.12 — App Download Banner

```
File: src/components/homepage/AppDownloadBanner.tsx
  - 2-column: phone mockup image + download CTAs
  - App Store + Google Play badges
  - Static component (no data)
  - Hidden for MVP until app is ready
```

### Step 4.13 — Wire Everything into Homepage

```
File: src/app/(marketing)/page.tsx (new)
  OR: src/app/page.tsx (update)
  
  Structure:
    <HeroCarousel banners={data.banners} />
    <CategoryStrip categories={data.categories} />
    <OccasionChips occasions={data.occasions} />
    <DeliveryCountdownBanner />
    <ProductCarousel title="New Arrivals" products={data.newArrivals} />
    <OccasionCollectionsGrid />
    <ProductCarousel title="Bestsellers" products={data.bestsellers} />
    <PersonalizationBanner />
    <ProductCarousel title="Trending" products={data.trending} />
    <ReviewCarousel />
    [AppDownloadBanner — hidden for now]
    
  Fetching strategy:
    - Server Component fetches data via /api/homepage
    - Suspense boundaries per section
    - Skeleton fallbacks
```

**Sprint 04 Deliverable:** A beautiful, fully animated homepage with real data from Supabase. Looks premium. Mobile-perfect.

---

## SPRINT 05 — Authentication

**Goal:** Complete auth system — login, signup, OTP, Google OAuth, session management, middleware.

### Step 5.1 — Auth Route Group Layout

```
File: src/app/(auth)/layout.tsx
  - Minimal header (logo only)
  - Centered card container
  - Background: warm cream with subtle pattern
```

### Step 5.2 — Login Page

```
File: src/app/(auth)/auth/login/page.tsx

Tabs: [Email & Password] [Mobile OTP]

Email tab:
  - Email input + Password input
  - "Remember me" checkbox
  - Forgot password link
  - Submit → POST /api/auth/login

OTP tab:
  - Phone input (+91 prefix)
  - "Send OTP" → POST /api/auth/otp/send
  - OTP input (6 boxes, auto-advance, paste support)
  - Resend OTP button (with 60s countdown)
  - Submit → POST /api/auth/otp/verify

Both tabs:
  - Google OAuth button
  - "New here? Create account" link
  - Error messages inline
  - Loading states on buttons
  - Redirect: ?redirect= param or /account/dashboard
```

### Step 5.3 — Signup Page

```
File: src/app/(auth)/auth/signup/page.tsx
  - Full name, email, password, confirm password
  - Phone (optional)
  - Terms + Privacy checkbox (required)
  - Google OAuth option
  - "Already have account? Login" link
  - POST /api/auth/signup
  - On success: show "Check email" message
```

### Step 5.4 — OTP Verification Page

```
File: src/app/(auth)/auth/verify-otp/page.tsx
  - 6-box OTP input (auto-focus, auto-submit on complete)
  - Resend with countdown timer
  - Back link (to re-enter phone)
```

### Step 5.5 — Forgot / Reset Password

```
Files:
  src/app/(auth)/auth/forgot-password/page.tsx
  src/app/(auth)/auth/reset-password/page.tsx
  - Standard flows
  - Password strength meter on reset
```

### Step 5.6 — Auth Callback Route

```
File: src/app/(auth)/auth/callback/route.ts
  - Handle OAuth callback code exchange
  - Redirect to ?redirect= or /account/dashboard
  - Handle errors gracefully
```

### Step 5.7 — API Routes

```
Files:
  src/app/api/auth/login/route.ts
  src/app/api/auth/signup/route.ts
  src/app/api/auth/logout/route.ts
  src/app/api/auth/otp/send/route.ts
  src/app/api/auth/otp/verify/route.ts
  src/app/api/auth/forgot-password/route.ts
  src/app/api/auth/reset-password/route.ts
  
All with:
  - Zod validation
  - Proper error codes
  - Rate limiting headers
```

### Step 5.8 — Auth Zustand Store + Hooks

```
File: src/store/authStore.ts
  - user: User | null
  - profile: Profile | null
  - isLoading: boolean
  - setUser(), clearUser()

File: src/features/auth/hooks/useAuth.ts
  - useSession() — get current session
  - useUser() — get user + profile
  - useLogout() — logout + clear stores + redirect

File: src/features/auth/hooks/useOTP.ts
  - sendOTP(), verifyOTP()
  - countdown timer state
  - error states
```

### Step 5.9 — User Account Menu

```
Update TopNavbar.tsx:
  If logged out: "Login" button → /auth/login
  If logged in: Avatar dropdown
    - "Hi, [Name]"
    - Account Dashboard
    - My Orders
    - Wishlist
    - Logout
```

**Sprint 05 Deliverable:** Can register, login (email + OTP + Google), stay logged in across refreshes, logout cleanly.

---

## SPRINT 06 — Product Catalog & PLP

**Goal:** All category, occasion, and filtered product listing pages working with real Supabase data.

### Step 6.1 — Category & Product APIs

```
Files:
  src/app/api/categories/route.ts        → GET all categories tree
  src/app/api/occasions/route.ts         → GET all occasions
  src/app/api/occasions/[slug]/route.ts  → GET occasion + featured products
  src/app/api/products/route.ts          → GET products (full filter support)
  
Products API supports:
  - ?category=flowers
  - ?occasion=birthday
  - ?q=search+query
  - ?sort=price_asc|price_desc|rating|newest|bestseller
  - ?min_price=500&max_price=2000
  - ?delivery=same_day|midnight|express
  - ?personalizable=true
  - ?in_stock=true
  - ?page=1&limit=20
  - Returns: products[], filters (facets), meta (pagination)
```

### Step 6.2 — Filter System (Client)

```
Hook: src/features/catalog/hooks/useProductFilters.ts
  - Read filters from URL searchParams
  - Build filter object
  - Update URL on filter change (no page reload)
  - Sync with TanStack Query key

Utility: src/features/catalog/utils/buildFilterQuery.ts
  - Convert filter object → URL params
  - Convert URL params → filter object
```

### Step 6.3 — Filter Sidebar (Desktop)

```
File: src/components/plp/FilterSidebar.tsx
  - Sticky position
  - Sections (accordion):
    1. Price Range (Slider component)
    2. Delivery Type (checkboxes: Same Day / Midnight / Express)
    3. Category (nested checkboxes)
    4. Occasion (multi-select chips)
    5. Rating (star buttons: 4★+ | 3★+ | all)
    6. Features (Personalizable toggle)
  - "Clear All Filters" button (shown when filters active)
  - Filter count badge on closed accordion headers
```

### Step 6.4 — Filter Sheet (Mobile)

```
File: src/components/plp/FilterSheet.tsx
  - Bottom Sheet (Drawer from vaul — already in project)
  - Same filter content as sidebar
  - "Apply Filters" + "Clear All" buttons
  - Trigger: "Filter" button with active filter count
```

### Step 6.5 — Sort Dropdown

```
File: src/components/plp/SortDropdown.tsx
  - shadcn Select component
  - Options: Relevance | Price: Low → High | Price: High → Low | Newest | Bestseller | Top Rated
  - Updates URL ?sort= param
```

### Step 6.6 — Active Filter Pills

```
File: src/components/plp/ActiveFilters.tsx
  - Shows "[FilterType]: [Value] ×" chips for each active filter
  - Click × to remove individual filter
  - "Clear All" text button
  - Horizontally scrollable on mobile
```

### Step 6.7 — Product Grid

```
File: src/components/plp/ProductGrid.tsx
  - TanStack Query for fetching
  - 3-col desktop, 2-col tablet, 2-col mobile
  - ProductCard × N
  - ProductCardSkeleton × 8 during loading
  - Empty state with illustration + message
  - "Load More" button at bottom (appends next page)
  - Total results count shown
```

### Step 6.8 — Category PLP Page

```
File: src/app/(shop)/category/[slug]/page.tsx
  - generateStaticParams for ISR
  - Breadcrumb: Home > [Category]
  - Category hero (image + title from categories table)
  - FilterSidebar (desktop) + FilterSheet (mobile)
  - SortDropdown
  - ActiveFilters
  - ProductGrid
  - Pagination
  - Dynamic metadata (title, description from category)
  - Structured data: BreadcrumbList
```

### Step 6.9 — Occasion Page

```
File: src/app/(shop)/occasion/[slug]/page.tsx
  - Full editorial layout (hero banner from occasions table)
  - Featured categories for this occasion (grid)
  - Featured products carousel (curated)
  - Price range quick links
  - Product grid (filterable, occasion=slug)
  - SEO content block (from occasions.editorial_content)
  - FAQ accordion
  - ISR: revalidate 1 hour
```

### Step 6.10 — Delivery-Type & Budget PLPs

```
Files (all share same PLP template, different preset filters):
  src/app/(shop)/gifts/same-day-delivery/page.tsx  → ?delivery=same_day
  src/app/(shop)/gifts/midnight-delivery/page.tsx  → ?delivery=midnight
  src/app/(shop)/gifts/express-delivery/page.tsx   → ?delivery=express
  src/app/(shop)/gifts/under-500/page.tsx          → ?max_price=500
  src/app/(shop)/gifts/under-1000/page.tsx         → ?max_price=1000
  src/app/(shop)/gifts/for-her/page.tsx            → ?tags=her
  src/app/(shop)/gifts/for-him/page.tsx            → ?tags=him
  [etc.]
  
  Each page: custom hero banner + preset filter + product grid
```

**Sprint 06 Deliverable:** Can browse categories, filter by price/delivery/type, sort, paginate. URL-shareable filtered views.

---

## SPRINT 07 — Product Detail Page (PDP)

**Goal:** The most important conversion page — perfect on all devices.

### Step 7.1 — Product API (Single)

```
File: src/app/api/products/[slug]/route.ts
  - Full product data: images, variants, inventory, occasions, personalization config
  - Related products (same category, random 8)
  - ISR: revalidate 30 minutes
```

### Step 7.2 — Product Gallery

```
File: src/components/product/ProductGallery.tsx
  Desktop:
    - Main image (480×480, zoom on hover using CSS transform)
    - Thumbnail strip (vertical, 4 visible, scroll)
    - Click thumbnail → switch main image
    - Video thumbnail → opens in Dialog modal

  Mobile:
    - Embla Carousel full-width
    - Dot indicators
    - Swipe gesture native
```

### Step 7.3 — Variant Selector

```
File: src/components/product/VariantSelector.tsx
  - Props: variantType, variants, selectedVariant, onSelect
  - Rendering:
    weight/count/size: Pill chips (horizontal flex wrap)
    color:            Color swatch circles (border on selected)
    flavor:           Pill chips
  - Disabled styling for OOS variants
  - On select: update price, images, stock status
```

### Step 7.4 — Delivery Section on PDP

```
Files:
  src/components/delivery/PincodeInput.tsx
    - 6-digit input + "Check" button
    - Auto-check if locationStore has pincode
    - Shows: serviceable ✓ / not serviceable ✗
    - Shows available delivery types
    - Loading skeleton during check

  src/components/delivery/DeliveryDateCalendar.tsx
    - Mini calendar (shadcn Calendar)
    - Disables past dates
    - Disables dates with no slot availability
    - On select: triggers slot fetch

  src/components/delivery/DeliverySlotPicker.tsx
    - Grid of slot chips
    - Shows: slot name, time, charge, capacity status
    - Status variants: available / almost-full / unavailable
    - Selected state: filled primary
    - Loading state during slot fetch
```

### Step 7.5 — Gift Message Input

```
File: src/components/gifting/GiftMessageInput.tsx
  - Textarea (150 chars max, live counter)
  - Character counter below input
  - Quick template chips: "Happy Birthday! 🎂" | "With Love ❤️" | "Congratulations! 🎉"
  - Clicking chip fills textarea
```

### Step 7.6 — Add-On Selector

```
File: src/components/gifting/AddOnSelector.tsx
  - Card-based checkbox selector
  - Add-ons: Greeting Card (+₹49) | Gift Wrap (+₹79) | Chocolate Box (+₹199) | Balloon (+₹149)
  - Visual card: image + name + price + checkbox
  - Selected: card highlighted with primary border
  - Greeting card opens GreetingCardPicker if selected
```

### Step 7.7 — Greeting Card Picker

```
File: src/components/gifting/GreetingCardPicker.tsx
  - Dialog/Sheet
  - Grid of card templates (from greeting_cards table)
  - Card: thumbnail + name + price (Free or +₹X)
  - Selected: checkmark overlay
  - "Use this card" confirm button
```

### Step 7.8 — Product Info Assembly

```
File: src/components/product/ProductInfo.tsx
  Full sticky panel (desktop):
    1. Breadcrumb
    2. Product name (H1 Playfair)
    3. SKU + Rating row (stars + review count, click scrolls to reviews)
    4. PriceDisplay (sale price, MRP, discount %)
    5. Variant selector
    6. Inventory status ("Only X left!")
    7. Divider
    8. PincodeInput
    9. DeliveryDateCalendar
    10. DeliverySlotPicker
    11. Divider
    12. GiftMessageInput
    13. AddOnSelector
    14. Divider
    15. QuantityStepper (min 1, max stock)
    16. AddToCartButton (primary, full width)
    17. BuyNowButton (secondary)
    18. WishlistButton (ghost)
    19. Trust badges (Fresh / Secure / On-Time)
```

### Step 7.9 — Add To Cart Logic

```
File: src/features/cart/hooks/useCartActions.ts
  addToCart():
    - Collect: product_id, variant_id, quantity, personalization,
               gift_message, greeting_card_id, addons,
               delivery_date, delivery_slot_id
    - POST /api/cart
    - On success: optimistic cart count update in cartStore
    - On success: open MiniCartDrawer
    - On error: show toast with error message
    - Show loading state on button during request
    - Handle: OUT_OF_STOCK, SLOT_UNAVAILABLE errors inline
```

### Step 7.10 — Product Description Tabs

```
File: src/components/product/ProductTabs.tsx
  Tab 1: Description (rich text from product.description)
  Tab 2: Care Instructions (static or from product.metadata)
  Tab 3: Delivery Info (slot table, policies)
  Tab 4: Reviews (ReviewSection component)
```

### Step 7.11 — Reviews Section on PDP

```
File: src/components/reviews/ReviewsSection.tsx
  - Average rating large display (4.6)
  - Distribution bars (5★: 180, 4★: 45, etc.)
  - Filter by star (buttons)
  - Sort: Most Recent | Most Helpful
  - ReviewCard list (paginated, 5 per page)
  - ReviewCard: avatar, name, verified badge, date, stars, text, photos, helpful
  - "Write a Review" CTA (if user has delivered order for this product)
```

### Step 7.12 — PDP Page Assembly

```
File: src/app/(shop)/products/[slug]/page.tsx
  - generateStaticParams (top 100 products pre-rendered)
  - generateMetadata (dynamic title, description, OG)
  - JSON-LD structured data (Product schema)
  - Left: ProductGallery
  - Right: ProductInfo (sticky)
  - Below fold: ProductTabs
  - Below fold: RelatedProducts carousel
  - Suspense + skeleton for all async sections
```

**Sprint 07 Deliverable:** Can view a product, select variant, check delivery, see reviews, add to cart.

---

## SPRINT 08 — Search & Discovery

**Goal:** Fast, intelligent search with suggestions, filters, and gift finder.

### Step 8.1 — Search API

```
File: src/app/api/search/route.ts
  - PostgreSQL full-text search (websearch_to_tsquery)
  - Supports all filter params (same as /api/products)
  - Returns: products, categories (matching), occasions (matching), suggestions
  - Query logged to search_analytics table (new table)

File: src/app/api/search/suggestions/route.ts
  - Debounced autocomplete endpoint
  - Returns: product suggestions (with image+price), category links, occasion links, query suggestions
  - Cache: 5 minutes for popular queries
```

### Step 8.2 — Search Bar Expansion

```
Update: src/components/layout/header/SearchBar.tsx (or create new)
  - On focus: expands with overlay backdrop
  - Shows: recent searches (localStorage) + trending searches (API)
  - On type (debounced 300ms): fetches suggestions
  - Suggestion dropdown:
    - Products: thumbnail + name + price
    - Categories: "In [Category]" links
    - Occasions: "For [Occasion]" links
    - Query: search term with search icon
  - Keyboard: arrow keys navigate suggestions, Enter searches
  - Clear button (×) inside input
  - Mobile: full-screen search overlay (Sheet)
```

### Step 8.3 — Search Results Page

```
File: src/app/(shop)/search/page.tsx
  - URL: /search?q=[query]&[all filter params]
  - Shows: "X results for '[query]'"
  - "Did you mean: [suggestion]?" if low confidence
  - Full FilterSidebar + SortDropdown + ProductGrid
  - Zero results state: illustration + "Try [trending queries]"
  - Client-side, uses TanStack Query
```

### Step 8.4 — Gift Finder Wizard

```
File: src/app/(shop)/gift-finder/page.tsx
Files: src/components/gift-finder/
  - GiftFinderWizard.tsx (stepper wrapper)
  - GiftFinderStep.tsx (step container)
  - GiftFinderOptionCard.tsx (icon + label clickable card)
  - GiftFinderProgress.tsx (step dots)

Steps:
  1. "Who is this gift for?" → Him | Her | Parents | Kids | Friends | Colleagues
  2. "What's the occasion?" → Birthday | Anniversary | Wedding | Thank You | Just Because | Festival
  3. "What's your budget?" → Under ₹500 | ₹500-1000 | ₹1000-2500 | ₹2500-5000 | ₹5000+
  4. "When do you need it?" → Today | Tomorrow | This Weekend | Pick a Date

→ Results: PLP with applied filters from wizard answers
```

### Step 8.5 — Collection & Brand Pages

```
Files:
  src/app/(shop)/collection/[slug]/page.tsx
  src/app/(shop)/brands/[slug]/page.tsx
  - Simple: hero + product grid filtered by collection/brand
  - ISR
```

**Sprint 08 Deliverable:** Search fully working with suggestions. Gift finder wizard guides to results. All discovery paths work.

---

## SPRINT 09 — Cart & Gift Features

**Goal:** Complete cart with gift options, delivery slot selection, multi-recipient support.

### Step 9.1 — Cart APIs

```
Files:
  src/app/api/cart/route.ts         → GET + POST
  src/app/api/cart/[item-id]/route.ts → PATCH + DELETE
  src/app/api/cart/coupon/route.ts  → POST (apply) + DELETE (remove)
  
GET /api/cart:
  - Auth: cookie session (guest) or JWT (customer)
  - Join cart_items with products, variants, delivery_slots
  - Calculate: subtotal, delivery, discount, GST, total
  - Return: items[], summary, applied_coupon?

POST /api/cart:
  - Validate: product exists, in stock, slot available
  - Reserve inventory (30 min)
  - Create cart_item record
  - Return: cart_item + updated summary

POST /api/cart/coupon:
  - Validate coupon against all rules
  - Apply to session
  - Return updated summary or error
```

### Step 9.2 — Cart Zustand Store

```
File: src/store/cartStore.ts
  - itemCount: number (for badge display)
  - lastAddedItem: CartItem | null (for mini cart)
  - isMiniCartOpen: boolean
  - setItemCount()
  - openMiniCart()
  - closeMiniCart()
  
Note: Full cart data stays in TanStack Query cache (server truth)
      This store only holds UI state
```

### Step 9.3 — Mini Cart Drawer

```
File: src/components/cart/MiniCartDrawer.tsx
  - Right-side Sheet (shadcn)
  - Opens automatically on add-to-cart
  - Shows last 3 items (condensed)
  - Mini OrderSummary (subtotal + total)
  - "View Cart" + "Checkout" buttons
  - Empty state with "Start Shopping" CTA
  - Framer Motion slide-in from right
```

### Step 9.4 — Cart Page

```
File: src/app/(customer)/cart/page.tsx

Left column:
  - "Your Cart" title + item count
  - CartItem × N (see below)
  - Empty cart state
  - Cart recommendations (2 products)
  - Continue Shopping link

Right column (sticky):
  - Order Summary
  - Promo code input + Apply button
  - Subtotal, delivery, discount, GST, total
  - Proceed to Checkout button
  - Payment method logos

CartItem component:
  - Product thumbnail (80px)
  - Name + variant
  - Delivery date + slot chip (editable → opens date/slot picker)
  - Recipient name + address snippet
  - Gift message preview (click to edit inline)
  - Greeting card chip
  - Quantity stepper (validates against stock)
  - Remove button (with undo toast)
  - "Save to Wishlist" link
```

### Step 9.5 — Coupon System

```
PromoCodeInput component:
  - Input + "Apply" button
  - Shows applied coupon as chip (with × to remove)
  - Error messages: "Invalid code" | "Code expired" | "Min order ₹X required"
  - Success: green chip + discount shown in summary
  - Loading state on apply
```

### Step 9.6 — Wishlist

```
Files:
  src/app/(customer)/account/wishlist/page.tsx
  src/app/api/wishlist/route.ts (GET + POST)
  src/app/api/wishlist/[id]/route.ts (DELETE)
  
  Page: Grid of WishlistProductCard
  WishlistProductCard: Product card + "Move to Cart" + "Remove" buttons
  
  useWishlist hook:
    - Cached in TanStack Query
    - Optimistic toggle (add/remove)
    - Works for guest (localStorage) + auth (Supabase)
    - WishlistButton on ProductCard calls this hook
```

**Sprint 09 Deliverable:** Cart fully functional. Add items, update quantities, apply coupons, wishlist works.

---

## SPRINT 10 — Checkout & Delivery

**Goal:** Complete single-page checkout flow with delivery slot selection.

### Step 10.1 — Checkout Page Architecture

```
File: src/app/(customer)/checkout/page.tsx
  
  Approach: Single page, progressive accordion sections
  State: useCheckoutStore (Zustand)
  
  Layout:
    Left (70%): Accordion steps
    Right (30%): Sticky OrderSummary
    Mobile: Stacked, summary at top (collapsed)
```

### Step 10.2 — Checkout Store

```
File: src/store/checkoutStore.ts
  State:
    - currentStep: 1 | 2 | 3 | 4 | 5
    - completedSteps: Set<number>
    - recipientForm: RecipientFormData
    - selectedDate: Date | null
    - selectedSlot: DeliverySlot | null
    - giftMessage: string
    - selectedGreetingCard: GreetingCard | null
    - orderNotes: string
    
  Actions:
    - setStep(), completeStep()
    - setRecipient(), setDate(), setSlot()
    - setGiftMessage(), setGreetingCard()
    - resetCheckout()
```

### Step 10.3 — Checkout Steps

```
Step 1: Delivery Details (RecipientDetailsForm)
  Zod schema for all fields
  Saved addresses dropdown at top
  Address autocomplete (basic — no Google Places yet)
  Pincode validation on blur (API call)
  Shows delivery type availability after pincode validates
  "Save address" checkbox

Step 2: Delivery Date & Slot
  Calendar (shadcn Calendar, highlights available dates)
  Slot grid (fetched per date + pincode)
  Slot card: name, time window, price, capacity indicator
  
Step 3: Gift Options (expandable, not required)
  GiftMessageTextarea
  GreetingCardSelector
  Order notes for delivery agent

Step 4: Order Review
  All cart items with delivery details
  Full price breakdown
  Edit links for each section (scroll back)

Step 5: Payment (see Sprint 11)
```

### Step 10.4 — Delivery Slot APIs

```
Files:
  src/app/api/delivery/check/route.ts
  src/app/api/delivery/slots/route.ts
  
check endpoint:
  - Query pincode_serviceability table
  - Return: serviceable, delivery types available, COD available
  
slots endpoint:
  - Query delivery_slots JOIN slot_bookings for date
  - Calculate available capacity
  - Return slots with is_available + is_almost_full
  - Add to Supabase Realtime subscription hint
```

### Step 10.5 — Checkout Validation API

```
File: src/app/api/checkout/validate/route.ts
  - Re-check all cart items: stock, slot capacity, pincode serviceability
  - Returns: is_valid, issues[] with resolution suggestions
  - Called before moving to payment step
```

### Step 10.6 — Order Confirmation Page

```
File: src/app/(customer)/checkout/success/page.tsx
  - Confetti animation (Framer Motion + canvas)
  - Animated checkmark
  - Order number (click to copy)
  - Delivery summary card
  - Gift message preview
  - "Track Order" button
  - "Continue Shopping" link
  - Cross-sell: "Customers also ordered..."
  - Clear checkout store on load
```

**Sprint 10 Deliverable:** Can go from cart → fill recipient details → pick date/slot → review order. Stops at payment step (next sprint).

---

## SPRINT 11 — Payment (Razorpay)

**Goal:** Full payment flow — all methods, webhook handling, failure recovery.

### Step 11.1 — Razorpay Setup

```
Install: npm install razorpay
Create: src/lib/razorpay.ts (server-only)
  - Initialize Razorpay client with key_id + key_secret
  
Environment variables:
  RAZORPAY_KEY_ID=rzp_test_xxx
  RAZORPAY_KEY_SECRET=xxx
  RAZORPAY_WEBHOOK_SECRET=xxx
  NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx (client-safe)
```

### Step 11.2 — Payment APIs

```
Files:
  src/app/api/orders/route.ts           → POST: create order from cart
  src/app/api/payment/initiate/route.ts → POST: create Razorpay order
  src/app/api/payment/verify/route.ts   → POST: verify signature + confirm
  src/app/api/payment/retry/route.ts    → POST: retry failed payment
  src/app/api/webhooks/razorpay/route.ts → POST: Razorpay event handler
```

### Step 11.3 — Order Creation Logic

```
POST /api/orders:
  1. Load cart from Supabase
  2. Run checkout/validate check
  3. Begin DB transaction:
     a. Create order record (status: 'payment_pending')
     b. Create order_item records (snapshot product data)
     c. Create slot_booking records
     d. Apply coupon (increment usage_count)
     e. Deduct wallet balance if used
     f. Deduct loyalty points if used
  4. Return: order_id, order_number, total_amount
```

### Step 11.4 — Razorpay Payment Initiation

```
POST /api/payment/initiate:
  1. Load order from DB
  2. Create Razorpay order:
     razorpay.orders.create({
       amount: total_amount * 100,  // in paise
       currency: 'INR',
       receipt: order_id
     })
  3. Save Razorpay order ID to payments table
  4. Return: razorpay_order_id, amount, key_id, prefill data
```

### Step 11.5 — Payment UI Step

```
File: src/components/checkout/PaymentStep.tsx

Tabs: [UPI] [Cards] [Net Banking] [Wallets] [COD]

UPI tab:
  - UPI ID input ("Enter UPI ID e.g., user@gpay")
  - OR QR code display (for mobile scanning)
  - Popular UPI app buttons: GPay | PhonePe | Paytm
    → Deep links that open app directly

Cards tab:
  - Card number (masked, formatted)
  - Expiry month/year
  - CVV
  - Cardholder name
  - "Save card" checkbox (future use)

Net Banking:
  - Select bank from list (all major banks)
  - Redirect to bank after pay button

COD:
  - Availability check shown
  - COD fee added to total
  - "Place Order" button (no Razorpay needed)

All tabs:
  - "Total to pay: ₹X" displayed
  - "Place Order & Pay ₹X" primary button
  - "100% Secure Payment" with lock icon + card logos
```

### Step 11.6 — Payment Execution

```
On "Place Order & Pay":
  1. Call /api/orders → get order_id
  2. Call /api/payment/initiate → get razorpay_order_id
  3. Open Razorpay checkout:
     const rzp = new window.Razorpay({
       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
       order_id: razorpay_order_id,
       amount: amount,
       currency: 'INR',
       name: 'Combovibes',
       description: 'Gift Order ' + order_number,
       image: '/images/logo.png',
       prefill: { name, email, contact },
       theme: { color: '#C9936A' },
       handler: async function(response) {
         // Verify on server
         await verifyPayment(response)
         router.push('/checkout/success?order_id=' + order_id)
       },
       modal: {
         ondismiss: () => {
           // Don't navigate — show "Payment cancelled" toast
         }
       }
     })
     rzp.open()
```

### Step 11.7 — Webhook Handler

```
File: src/app/api/webhooks/razorpay/route.ts
  - Verify X-Razorpay-Signature header (HMAC SHA256)
  - Handle events:
    payment.captured → 
      update orders.status = 'confirmed'
      update payments.status = 'success'
      clear cart (delete cart_items for user)
      award loyalty points reservation
      trigger order confirmation email + SMS
    
    payment.failed →
      update payments.status = 'failed'
      keep order in 'payment_pending' for retry
    
    refund.processed →
      update refunds.status = 'completed'
      notify customer
```

### Step 11.8 — Post-Payment Notifications

```
File: src/lib/resend.ts (email client)
File: src/lib/sms.ts (Twilio/MSG91 client)

Order confirmation email:
  - Template: order summary, delivery details, gift message, tracking link
  - Sent to: order.guest_email OR user.email
  - Via Resend API
  
Order confirmation SMS:
  - Message: "Order #CV-XXXX confirmed! Deliver by [date]. Track: [url]"
  - To: recipient phone number
  - Via Twilio API
```

**Sprint 11 Deliverable:** Full checkout → payment → confirmation works. Payments hit Razorpay test mode. Emails send.

---

## SPRINT 12 — Orders, Tracking & Account

**Goal:** Complete post-purchase customer experience.

### Step 12.1 — Order APIs

```
Files:
  src/app/api/account/orders/route.ts         → GET paginated order list
  src/app/api/orders/[id]/route.ts            → GET order detail (owner only)
  src/app/api/orders/[id]/track/route.ts      → GET public tracking (limited)
  src/app/api/orders/[id]/cancel/route.ts     → POST cancel order
```

### Step 12.2 — Account Dashboard

```
File: src/app/(customer)/account/dashboard/page.tsx
  - Welcome: "Hi [Name]!"
  - Quick stats: X orders | X loyalty points | ₹X wallet
  - Recent orders (last 3)
  - Wishlist preview (3 items)
  - Upcoming delivery alert (if any today/tomorrow)
  - "Add to WishList" if wishlist is empty
```

### Step 12.3 — Account Layout

```
File: src/app/(customer)/layout.tsx
  Desktop: Left sidebar navigation (240px) + main content
  Mobile:  Top horizontal tabs (icons)
  
  Sidebar links:
    Dashboard | Orders | Wishlist | Addresses | Profile | Notifications | Wallet | Logout
```

### Step 12.4 — Orders History Page

```
File: src/app/(customer)/account/orders/page.tsx
  - Filter tabs: All | Pending | Processing | Delivered | Cancelled
  - OrderCard per row:
    Thumbnail | Order # | Date | N items | Total | Status badge | [Track] [View]
  - Pagination
  - Empty state per tab
```

### Step 12.5 — Order Detail Page

```
File: src/app/(customer)/account/orders/[id]/page.tsx
  - OrderTimeline (vertical stepper)
  - Item list with gift details
  - Delivery address + slot
  - Payment summary
  - Cancel button (if eligible)
  - Download invoice (future — link for now)
  - Reorder button
  - Write Review CTA (if delivered)
```

### Step 12.6 — Public Tracking Page

```
File: src/app/track/[order-id]/page.tsx
  - No auth required
  - Order # input (redirect if different from URL)
  - OrderTimeline (public-safe data only)
  - Estimated delivery time
  - Delivery agent card (name + masked phone)
  - Product summary (name + image only)
  - "Need Help?" → WhatsApp link
```

### Step 12.7 — Profile & Address Pages

```
Files:
  src/app/(customer)/account/profile/page.tsx
    - Avatar upload (Supabase Storage)
    - Name, email, phone, DOB, gender
    - PATCH /api/account/profile
    
  src/app/(customer)/account/addresses/page.tsx
    - Address list (AddressCard × N)
    - "Set as Default" button
    - Edit / Delete per address
    - "Add New Address" form
    - CRUD via /api/addresses
```

### Step 12.8 — Review Flow

```
Files:
  src/app/(customer)/account/reviews/[product-id]/write/page.tsx
    - Star rating input (click to set)
    - Title input
    - Review textarea
    - Photo upload (up to 3 images)
    - Submit → POST /api/reviews
    - Pending moderation message on success

  File: src/app/api/reviews/route.ts
    - Verify user has delivered order for this product
    - Create review with status='pending'
```

### Step 12.9 — Notification Preferences

```
File: src/app/(customer)/account/notifications/page.tsx
  - Toggle list per event type per channel
  - PATCH /api/account/notification-preferences
```

**Sprint 12 Deliverable:** Complete post-order account experience. Can track orders, cancel, view history, manage profile.

---

## SPRINT 13 — Admin Panel

**Goal:** Fully operational admin panel for managing the entire business.

### Step 13.1 — Admin Layout & Auth

```
Files:
  src/app/(admin)/layout.tsx           → Admin shell layout
  src/app/(admin)/admin/login/page.tsx → Admin login (separate from customer)
  src/middleware.ts                    → Update to protect /admin/* with admin check
  
  AdminSidebar: collapsible, icon+text, permission-filtered links
  AdminTopbar: breadcrumb, search, notifications bell, profile menu
```

### Step 13.2 — Admin Dashboard

```
File: src/app/(admin)/admin/dashboard/page.tsx
  - KPI widgets (3 rows)
  - RevenueChart (Recharts LineChart)
  - OrderStatusDonut (Recharts PieChart)
  - Top Products table (TanStack Table)
  - Recent Orders feed (auto-refresh every 30s)
  - All data from /api/admin/dashboard
```

### Step 13.3 — Product Management (Admin)

```
Files:
  src/app/(admin)/admin/products/page.tsx          → DataTable
  src/app/(admin)/admin/products/new/page.tsx      → ProductForm
  src/app/(admin)/admin/products/[id]/page.tsx     → ProductForm (edit)
  
  DataTable: @tanstack/react-table with all features
  ProductForm: 7-tab form with all fields
  MediaUploader: react-dropzone + Supabase Storage upload
  VariantBuilder: dynamic row builder
  RichTextEditor: TipTap
  CategorySelector: hierarchical dropdown
```

### Step 13.4 — Category Management (Admin)

```
Files:
  src/app/(admin)/admin/categories/page.tsx  → Tree view
  src/components/admin/CategoryTree.tsx      → Drag-drop tree (DnD Kit)
  CategoryForm: inline slide-in panel
```

### Step 13.5 — Order Management (Admin)

```
Files:
  src/app/(admin)/admin/orders/page.tsx       → DataTable (all features)
  src/app/(admin)/admin/orders/[id]/page.tsx  → Full order detail
  
  Order detail:
    - Interactive timeline editor (click to advance status)
    - Full order items with personalization
    - Customer info + order history sidebar
    - Payment info
    - Refund modal
    - Vendor assignment dropdown
    - Internal notes thread
```

### Step 13.6 — Customer Management (Admin)

```
Files:
  src/app/(admin)/admin/customers/page.tsx     → DataTable
  src/app/(admin)/admin/customers/[id]/page.tsx → Full profile
  - Tabs: Overview, Orders, Reviews, Addresses, Wallet
  - Actions: Suspend, Ban, Reset Password, Add Note
```

### Step 13.7 — Coupon Management (Admin)

```
Files:
  src/app/(admin)/admin/coupons/page.tsx     → Table
  src/app/(admin)/admin/coupons/new/page.tsx → CouponBuilder
  src/components/admin/CouponForm.tsx        → Full 5-section form
```

### Step 13.8 — Delivery Management (Admin)

```
Files:
  src/app/(admin)/admin/delivery/zones/page.tsx  → Zone list + pincode manager
  src/app/(admin)/admin/delivery/slots/page.tsx  → Slot calendar view
  CSV import for pincodes: Papa Parse
```

### Step 13.9 — CMS Management (Admin)

```
Files:
  src/app/(admin)/admin/cms/banners/page.tsx    → BannerManager
  src/app/(admin)/admin/cms/homepage/page.tsx   → HomepageBuilder (section ordering)
  BannerForm: upload + scheduling
```

### Step 13.10 — Review Moderation (Admin)

```
File: src/app/(admin)/admin/reviews/page.tsx
  - Pending queue as cards
  - Approve / Reject / Highlight / Reply actions
  - Status tabs with counts
```

### Step 13.11 — Reports (Admin)

```
Files:
  src/app/(admin)/admin/reports/revenue/page.tsx
  src/app/(admin)/admin/reports/orders/page.tsx
  src/app/(admin)/admin/reports/products/page.tsx
  src/app/(admin)/admin/reports/customers/page.tsx
  
  Each: DateRangePicker + Charts + Export button (CSV via xlsx)
```

### Step 13.12 — Settings & RBAC (Admin)

```
Files:
  src/app/(admin)/admin/settings/general/page.tsx
  src/app/(admin)/admin/settings/payment/page.tsx
  src/app/(admin)/admin/access/roles/page.tsx     → Permission matrix
  src/app/(admin)/admin/access/users/page.tsx     → Admin users
  src/app/(admin)/admin/audit-logs/page.tsx       → Log viewer
```

**Sprint 13 Deliverable:** Admin can manage products, orders, customers, coupons, delivery, CMS, and reports.

---

## SPRINT 14 — Vendor Panel

**Goal:** Complete vendor portal from onboarding to payout tracking.

### Step 14.1 — Vendor Onboarding

```
Files:
  src/app/(vendor)/vendor/apply/page.tsx  → Application form (5 sections)
  src/app/api/vendor/apply/route.ts       → Save application + documents
  
  Admin approval screen (Sprint 13.12 area):
    src/app/(admin)/admin/vendors/applications/page.tsx
    src/app/(admin)/admin/vendors/[id]/page.tsx → Review + approve/reject
```

### Step 14.2 — Vendor Dashboard & Layout

```
Files:
  src/app/(vendor)/layout.tsx              → Vendor sidebar + topbar
  src/app/(vendor)/vendor/dashboard/page.tsx
  - KPI cards (orders today, revenue, pending)
  - "Orders needing action" priority list
  - Revenue chart
  - Low stock alerts
```

### Step 14.3 — Vendor Order Fulfillment

```
Files:
  src/app/(vendor)/vendor/orders/page.tsx     → Priority-sorted order list
  src/app/(vendor)/vendor/orders/[id]/page.tsx → Fulfillment interface
  
  Fulfillment interface:
    - Order details + recipient (privacy-masked)
    - Gift message + personalization details
    - "Accept Order" → "Mark Packed" → "Hand to Agent" flow
    - Packing photo upload
    - Urgency countdown timer
```

### Step 14.4 — Vendor Product Management

```
Files:
  src/app/(vendor)/vendor/products/page.tsx     → Product list (simplified)
  src/app/(vendor)/vendor/products/new/page.tsx → Product form (vendor-scoped)
  
  Vendor product form: subset of admin form
  Products go to 'pending_review' → admin approves
```

### Step 14.5 — Vendor Inventory & Earnings

```
Files:
  src/app/(vendor)/vendor/inventory/page.tsx  → Stock table + quick edit
  src/app/(vendor)/vendor/earnings/page.tsx   → Earnings dashboard
  - Commission breakdown
  - Payout history
  - Bank account setup
```

**Sprint 14 Deliverable:** Vendor can receive approval, add products, fulfill orders, track earnings.

---

## SPRINT 15 — SEO, Performance & Launch Prep

**Goal:** Production-ready. Fast, indexed, monitored.

### Step 15.1 — SEO Implementation

```
Files:
  src/app/sitemap.ts           → Dynamic sitemap (products, categories, occasions)
  src/app/robots.ts            → Robots.txt
  
Per-page metadata:
  - generateMetadata() on all public pages
  - Dynamic OG images (Next.js ImageResponse)
  
Structured Data (JSON-LD):
  - Product schema on PDP
  - BreadcrumbList on all pages
  - Organization schema on homepage
  - AggregateRating on PDP
  - FAQPage on occasion pages

Local SEO:
  src/app/(shop)/flowers-in-[city]/page.tsx → generateStaticParams for 20 cities
```

### Step 15.2 — Performance Optimization

```
ISR Configuration:
  Homepage:       revalidate: 300 (5 min)
  Category PLP:   revalidate: 3600 (1 hour)
  PDP:            revalidate: 1800 (30 min)
  Occasion page:  revalidate: 3600

Image Optimization:
  - All ProductCard images: sizes="(max-width: 768px) 50vw, 25vw"
  - Hero images: priority={true}
  - Blur placeholder: blurDataURL on all product images

Bundle Optimization:
  - next/dynamic for: MegaMenu, PersonalizationCanvas, AdminCharts
  - Analyze bundle: npm run build -- --analyze (add @next/bundle-analyzer)

Database:
  - Verify all indexes in 018_indexes.sql are applied
  - Add query plan analysis for slow queries
```

### Step 15.3 — Error Monitoring

```
Install: @sentry/nextjs
Configure: sentry.client.config.ts + sentry.server.config.ts
Capture: API errors, client React errors, payment failures
Set up: Sentry alerts for P0 errors
```

### Step 15.4 — Analytics

```
Google Analytics 4:
  Install: @next/third-parties/google (GoogleAnalytics component)
  Events: page_view, add_to_cart, begin_checkout, purchase, search
  
Facebook Pixel:
  Custom Script component in layout
  Events: AddToCart, InitiateCheckout, Purchase
  
Vercel Analytics:
  Install: @vercel/analytics
```

### Step 15.5 — Launch Checklist Execution

```
Content:
  □ Upload 100+ products with real images to Supabase
  □ Configure 50+ Mumbai + Delhi pincodes
  □ Set up delivery slots for launch city
  □ Upload 5+ hero banners
  □ Add all occasion pages content
  □ Create first coupon: WELCOME10 (10% off, first order)

Legal:
  □ Privacy Policy page content
  □ Terms of Service page content
  □ Refund Policy page content

Testing:
  □ Full E2E test: Browse → Cart → Checkout → Pay → Confirm
  □ Test on iPhone (Safari) + Android Chrome
  □ Test payment in Razorpay test mode (all methods)
  □ Test email delivery
  □ Test SMS delivery
  □ Admin: create product, manage order
  □ Vendor: accept order, mark fulfilled

Deployment:
  □ Vercel production deployment configured
  □ Environment variables set in Vercel dashboard
  □ Custom domain configured
  □ SSL active
  □ Edge middleware deployed
  □ Supabase production project linked (not local)
```

**Sprint 15 Deliverable:** Production-deployed Combovibes. All pages indexed. Payments live. Monitoring active.

---

## Key Architectural Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| **State management** | Zustand (UI) + TanStack Query (server data) | Redux is overkill; TQ handles caching/sync perfectly |
| **Cart persistence** | Supabase for auth users, localStorage for guests | No Redis needed at this scale |
| **Search** | PostgreSQL FTS (pg_trgm) | Start simple; migrate to Algolia at 50K+ products |
| **Payment** | Razorpay only | India-first, all payment methods, excellent webhooks |
| **Email** | Resend | Developer-friendly, React Email templates |
| **SMS** | MSG91 (India-first) or Twilio | MSG91 cheaper for India, better DLT support |
| **Personalization preview** | Client-side Canvas API (Phase 1) | Supabase Edge Function for server-side (Phase 2) |
| **Admin charts** | Recharts | React-native, no external CDN dependency |
| **Rich text** | TipTap | Best React integration, extensible |
| **File uploads** | react-dropzone + Supabase Storage | Simple, reliable, built-in CDN |
| **Date utilities** | date-fns | Tree-shakeable, IST timezone support |
| **Table (admin)** | TanStack Table v8 | Headless, fully customizable |
| **Forms** | React Hook Form + Zod | Performance + type safety |
| **Deployment** | Vercel | Zero-config Next.js, Edge runtime, ISR |

---

## File Deletion Plan (Existing Template Cleanup)

```
Delete these existing files/folders (template cleanup):
  src/app/page.tsx              → replace with new homepage
  src/app/cart/                 → move to src/app/(customer)/cart/
  src/app/shop/                 → replace with new category structure
  src/components/cart-page/     → replace
  src/components/homepage/Header/  → replace with HeroCarousel
  src/components/homepage/Brands/  → replace with BrandStrip
  src/components/homepage/DressStyle/ → replace with OccasionGrid
  src/components/homepage/Reviews/  → replace with ReviewCarousel
  src/components/layout/Banner/TopBanner.tsx → replace
  src/components/layout/Navbar/    → replace
  src/components/layout/Footer.tsx → replace
  src/styles/fonts.ts              → replace (remove Satoshi)
  src/types/product.types.ts       → replace with new types
  src/types/review.types.ts        → replace with new types

Keep (reuse):
  src/components/ui/               → all shadcn components
  src/lib/                         → add to, don't replace
  tailwind.config.ts               → update, don't replace
  next.config.mjs                  → update
  package.json                     → update
```

---

## When We Start Building

The order above is fixed. We go one sprint at a time. Each sprint is fully functional before moving on. We never skip ahead.

**Ready to begin Sprint 01?**
