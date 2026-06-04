# Combovibes — Premium Gift Delivery Platform

A production-grade gift e-commerce platform for India, inspired by FNP (Ferns N Petals) but built with a premium, modern design and enterprise-level architecture.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Email, OTP, Google OAuth)
- **State:** Zustand + TanStack Query
- **Animation:** Framer Motion
- **Payment:** Razorpay

## Features

- Browse gifts by category, occasion, recipient, and budget
- Same-day, midnight, and express delivery with slot selection
- Gift messages, greeting cards, and personalized gifts
- Full checkout with Razorpay (UPI, cards, net banking, COD)
- Order tracking (real-time)
- Customer accounts, wishlist, loyalty points, wallet
- Admin panel (products, orders, customers, vendors, coupons, CMS, reports)
- Vendor portal (onboarding, fulfillment, earnings)
- Enterprise RBAC with audit logs

## Project Documentation

All planning and architecture documents are in `/docs`:

| # | Document |
|---|---|
| 00 | [Master Implementation Plan](./docs/00-master-implementation-plan.md) |
| 01 | [Competitor Analysis](./docs/01-competitor-analysis.md) |
| 02 | [Feature Inventory](./docs/02-feature-inventory.md) |
| 03 | [Information Architecture](./docs/03-information-architecture.md) |
| 04 | [Screen Inventory](./docs/04-screen-inventory.md) |
| 05 | [UI Replication Plan](./docs/05-ui-replication-plan.md) |
| 06 | [Database Design](./docs/06-database-design.md) |
| 07 | [Supabase Architecture](./docs/07-supabase-architecture.md) |
| 08 | [Product Catalog System](./docs/08-product-catalog-system.md) |
| 09 | [Order Flow](./docs/09-order-flow.md) |
| 10 | [Admin Panel](./docs/10-admin-panel.md) |
| 11 | [Vendor Panel](./docs/11-vendor-panel.md) |
| 12 | [API Architecture](./docs/12-api-architecture.md) |
| 13 | [Project Structure](./docs/13-project-structure.md) |
| 14 | [Implementation Roadmap](./docs/14-implementation-roadmap.md) |
| 15 | [MVP Plan](./docs/15-mvp-plan.md) |
| 16 | [Enterprise Admin Panel](./docs/16-enterprise-admin-panel.md) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```
