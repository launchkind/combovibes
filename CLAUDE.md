# Combovibes — Developer Guide

## Project Overview
Premium gift delivery platform for India (like FNP.com). Next.js 15 + Supabase + Razorpay.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand (cart, auth, search stores in `src/store/`)
- **Data fetching**: TanStack Query
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Razorpay
- **Email**: Resend
- **Animations**: Framer Motion
- **Charts**: Recharts (admin panel)

## Key Commands
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Project Structure
```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin panel (/admin)
│   ├── api/              # API routes (payment/create-order, payment/verify)
│   ├── auth/             # Auth pages (login, register, forgot-password, callback)
│   ├── cart/             # Cart page
│   ├── category/[slug]/  # Category pages
│   ├── checkout/         # Multi-step checkout + success
│   ├── occasion/[slug]/  # Occasion pages
│   ├── orders/           # Order history + detail
│   ├── search/           # Search results
│   ├── shop/             # Product listing + PDP
│   ├── vendor/           # Vendor portal
│   └── (static pages: about, contact, faq, wishlist, account)
├── components/
│   ├── admin/            # Admin-specific components
│   ├── cart/             # CartDrawer
│   ├── checkout/         # Checkout step components
│   ├── homepage/         # Hero, categories, occasions, products, trust, CTA
│   ├── layout/           # TopBanner, Navbar, Footer
│   ├── product/          # ProductCard, ProductDetailClient, DeliveryDatePicker, GiftMessageInput
│   ├── search/           # SearchPalette, SearchResults
│   ├── shop/             # FilterSidebar, ProductGrid, SortSelect
│   ├── ui/               # shadcn/ui components
│   └── vendor/           # Vendor-specific components
├── lib/
│   ├── constants.ts      # Site-wide constants
│   ├── formatters.ts     # formatPrice(), formatDate(), formatPhone()
│   ├── mockData.ts       # 24 mock products + categories/sort options
│   ├── mockOrders.ts     # 2 mock orders with timelines
│   ├── mockVendorOrders.ts # 3 mock vendor orders
│   ├── utils.ts          # cn() helper
│   └── validations/      # Zod schemas (auth, checkout)
├── store/
│   ├── authStore.ts      # Zustand: user/session state
│   ├── cartStore.ts      # Zustand: cart items, coupons (persisted to localStorage)
│   └── searchStore.ts    # Zustand: search query/open state
├── styles/
│   ├── fonts.ts          # Playfair Display + Inter (next/font/google)
│   └── fonts/index.ts    # Legacy stub (integralCF/satoshi → inter)
├── supabase/
│   ├── client.ts         # Browser Supabase client
│   ├── middleware.ts      # Session refresh helper
│   ├── server.ts         # Server Supabase client
│   └── types.ts          # Full Database interface + row types
└── middleware.ts          # Next.js middleware (session refresh on all routes)
```

## Design System
- **Primary (rose-gold)**: `hsl(349 26% 57%)` — `text-primary`, `bg-primary`
- **Background (cream)**: `hsl(43 100% 98%)` — `bg-background`
- **Headings font**: Playfair Display — `font-playfair`
- **Body font**: Inter — `font-inter`
- **Shadows**: `shadow-card`, `shadow-card-hover`, `shadow-warm`
- **Custom colors**: `rose-gold-*`, `cream-*`, `charcoal-*`

## Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=        # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # From Supabase project settings
SUPABASE_SERVICE_ROLE_KEY=       # From Supabase project settings (server only)
NEXT_PUBLIC_RAZORPAY_KEY_ID=     # From Razorpay dashboard
RAZORPAY_KEY_SECRET=             # From Razorpay dashboard (server only)
RESEND_API_KEY=                  # From Resend dashboard
NEXT_PUBLIC_SITE_URL=https://combovibes.in
```

## Database Setup
1. Create a Supabase project at supabase.com
2. Run migrations in order: `supabase/migrations/001_*.sql` through `008_*.sql`
3. Generate fresh types: `npx supabase gen types typescript --project-id YOUR_REF > src/supabase/types.ts`

## Payment Setup (Razorpay)
1. Create account at razorpay.com
2. Get Key ID + Key Secret from Dashboard → Settings → API Keys
3. Add to `.env.local` — payment modal activates automatically
4. Without credentials, checkout runs in demo mode (simulated payment)

## Sprint History
All 15 sprints completed:
1. Foundation & Design System
2. Database & Supabase Setup
3. Layout & Navigation
4. Homepage
5. Authentication
6. Product Catalog & PLP
7. Product Detail Page
8. Search & Discovery
9. Cart & Gift Features
10. Checkout & Delivery
11. Razorpay Payment
12. Orders, Tracking & Account
13. Admin Panel
14. Vendor Panel
15. SEO, Performance & Launch Prep
