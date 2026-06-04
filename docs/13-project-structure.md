# 13 — Next.js Project Structure

> **Purpose:** Complete folder structure for the Combovibes Next.js 15 (App Router) project, including naming conventions, file organization, and architectural patterns.

---

## Table of Contents

1. [Root Structure](#1-root-structure)
2. [App Directory (Routes)](#2-app-directory-routes)
3. [Components Directory](#3-components-directory)
4. [Features Directory](#4-features-directory)
5. [Lib Directory](#5-lib-directory)
6. [Hooks Directory](#6-hooks-directory)
7. [Store Directory (Zustand)](#7-store-directory-zustand)
8. [Services Directory](#8-services-directory)
9. [Types Directory](#9-types-directory)
10. [Supabase Directory](#10-supabase-directory)
11. [Public Directory](#11-public-directory)
12. [Configuration Files](#12-configuration-files)
13. [Naming Conventions](#13-naming-conventions)
14. [Import Aliases](#14-import-aliases)

---

## 1. Root Structure

```
combovibes/
├── .claude/                    # Claude Code config
├── .env.local                  # Local environment variables
├── .env.example                # Environment variable template
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── components.json             # shadcn/ui config
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── supabase/                   # Supabase local dev config
│   ├── config.toml
│   ├── seed.sql
│   ├── migrations/
│   └── functions/              # Edge functions
├── docs/                       # Project documentation (these files)
├── public/                     # Static assets
└── src/                        # Source code
    ├── app/                    # Next.js App Router
    ├── components/             # Shared UI components
    ├── features/               # Feature-scoped modules
    ├── hooks/                  # Custom React hooks
    ├── lib/                    # Utility libraries
    ├── services/               # API service functions
    ├── store/                  # Zustand state stores
    ├── supabase/               # Supabase client & types
    └── types/                  # TypeScript type definitions
```

---

## 2. App Directory (Routes)

```
src/app/
│
├── (marketing)/                # Marketing layout group (header + footer)
│   ├── layout.tsx              # Public layout
│   ├── page.tsx                # Homepage: /
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog list: /blog
│   │   └── [slug]/
│   │       └── page.tsx        # Blog post: /blog/[slug]
│   ├── contact/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── careers/
│   │   └── page.tsx
│   ├── corporate/
│   │   └── page.tsx
│   └── international/
│       ├── page.tsx
│       └── [country]/
│           └── page.tsx
│
├── (shop)/                     # Shop layout group
│   ├── layout.tsx              # Shop layout (with location/delivery context)
│   ├── category/
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Category PLP
│   │   └── [parent]/
│   │       └── [child]/
│   │           └── page.tsx    # Subcategory PLP
│   ├── occasion/
│   │   └── [slug]/
│   │       └── page.tsx        # Occasion page
│   ├── collection/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── brands/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── products/
│   │   └── [slug]/
│   │       ├── page.tsx        # Product Detail Page
│   │       └── personalize/
│   │           └── page.tsx    # Personalization flow
│   ├── gifts/
│   │   ├── same-day-delivery/
│   │   │   └── page.tsx
│   │   ├── midnight-delivery/
│   │   │   └── page.tsx
│   │   ├── express-delivery/
│   │   │   └── page.tsx
│   │   ├── under-500/
│   │   │   └── page.tsx
│   │   ├── for-her/
│   │   │   └── page.tsx
│   │   └── [...]
│   ├── search/
│   │   └── page.tsx            # Search results
│   ├── gift-finder/
│   │   └── page.tsx
│   └── personalized-gifts/
│       └── page.tsx
│
├── (auth)/                     # Auth layout group (minimal header)
│   ├── layout.tsx
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   ├── verify-otp/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts        # OAuth callback handler
│
├── (customer)/                 # Authenticated customer area
│   ├── layout.tsx              # Account layout with sidebar
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── success/
│   │   │   └── page.tsx
│   │   └── failed/
│   │       └── page.tsx
│   └── account/
│       ├── dashboard/
│       │   └── page.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       ├── page.tsx
│       │       ├── track/
│       │       │   └── page.tsx
│       │       └── invoice/
│       │           └── route.ts  # PDF generation
│       ├── wishlist/
│       │   └── page.tsx
│       ├── addresses/
│       │   ├── page.tsx
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx
│       ├── profile/
│       │   └── page.tsx
│       ├── notifications/
│       │   └── page.tsx
│       ├── reviews/
│       │   ├── page.tsx
│       │   └── [product-id]/
│       │       └── write/
│       │           └── page.tsx
│       ├── wallet/
│       │   └── page.tsx
│       ├── referrals/
│       │   └── page.tsx
│       └── subscriptions/
│           └── page.tsx
│
├── track/                      # Public order tracking (no auth)
│   └── [order-id]/
│       └── page.tsx
│
├── (admin)/                    # Admin panel
│   ├── layout.tsx              # Admin layout (sidebar + topbar)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── [tab]/
│   │   │           └── page.tsx
│   │   ├── categories/
│   │   ├── collections/
│   │   ├── occasions/
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── vendors/
│   │   ├── coupons/
│   │   ├── delivery/
│   │   ├── cms/
│   │   ├── reviews/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── access/
│   │   └── audit-logs/
│
├── (vendor)/                   # Vendor portal
│   ├── layout.tsx
│   ├── vendor/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── apply/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── earnings/
│   │   ├── profile/
│   │   ├── reports/
│   │   └── support/
│
├── api/                        # API Route Handlers
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── signup/route.ts
│   │   ├── logout/route.ts
│   │   ├── forgot-password/route.ts
│   │   ├── reset-password/route.ts
│   │   └── otp/
│   │       ├── send/route.ts
│   │       └── verify/route.ts
│   ├── products/
│   │   ├── route.ts
│   │   └── [slug]/
│   │       ├── route.ts
│   │       └── reviews/route.ts
│   ├── categories/route.ts
│   ├── occasions/
│   │   ├── route.ts
│   │   └── [slug]/route.ts
│   ├── search/
│   │   ├── route.ts
│   │   └── suggestions/route.ts
│   ├── homepage/route.ts
│   ├── cart/
│   │   ├── route.ts
│   │   ├── [item-id]/route.ts
│   │   └── coupon/route.ts
│   ├── checkout/
│   │   └── validate/route.ts
│   ├── orders/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       ├── track/route.ts
│   │       └── cancel/route.ts
│   ├── payment/
│   │   ├── initiate/route.ts
│   │   ├── verify/route.ts
│   │   └── retry/route.ts
│   ├── delivery/
│   │   ├── check/route.ts
│   │   └── slots/route.ts
│   ├── account/
│   │   ├── profile/route.ts
│   │   ├── orders/route.ts
│   │   └── summary/route.ts
│   ├── addresses/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── wishlist/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── reviews/
│   │   └── route.ts
│   ├── admin/
│   │   ├── dashboard/route.ts
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       ├── status/route.ts
│   │   │       └── refund/route.ts
│   │   ├── customers/route.ts
│   │   ├── vendors/route.ts
│   │   ├── coupons/route.ts
│   │   ├── reports/
│   │   │   ├── revenue/route.ts
│   │   │   ├── orders/route.ts
│   │   │   └── products/route.ts
│   │   ├── cms/
│   │   │   └── banners/route.ts
│   │   └── roles/route.ts
│   ├── vendor/
│   │   ├── dashboard/route.ts
│   │   ├── products/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── status/route.ts
│   │   ├── inventory/route.ts
│   │   └── earnings/route.ts
│   └── webhooks/
│       ├── razorpay/route.ts
│       └── delivery/route.ts
│
├── sitemap.ts                  # Dynamic sitemap generator
├── robots.ts                   # Robots.txt generator
├── manifest.ts                 # PWA manifest
├── not-found.tsx               # Global 404 page
├── error.tsx                   # Global error boundary
├── loading.tsx                 # Global loading skeleton
└── layout.tsx                  # Root layout (fonts, providers)
```

---

## 3. Components Directory

```
src/components/

├── ui/                         # shadcn/ui base components (DO NOT MODIFY)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio-group.tsx
│   ├── switch.tsx
│   ├── textarea.tsx
│   ├── badge.tsx
│   ├── card.tsx
│   ├── avatar.tsx
│   ├── skeleton.tsx
│   ├── toast.tsx
│   ├── calendar.tsx
│   ├── slider.tsx
│   ├── progress.tsx
│   ├── accordion.tsx
│   ├── tabs.tsx
│   ├── separator.tsx
│   ├── table.tsx
│   ├── dropdown-menu.tsx
│   ├── command.tsx
│   ├── popover.tsx
│   └── tooltip.tsx
│
├── layout/                     # Global layout components
│   ├── header/
│   │   ├── TopBanner.tsx
│   │   ├── TopNavbar.tsx
│   │   ├── CategoryNavbar.tsx
│   │   ├── MegaMenu.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CartIcon.tsx
│   │   ├── WishlistIcon.tsx
│   │   └── LocationSelector.tsx
│   ├── footer/
│   │   ├── Footer.tsx
│   │   ├── FooterLinks.tsx
│   │   ├── FooterSocial.tsx
│   │   └── FooterPayments.tsx
│   ├── mobile/
│   │   ├── MobileBottomNav.tsx
│   │   ├── MobileHamburgerDrawer.tsx
│   │   └── MobileSearch.tsx
│   └── providers/
│       ├── QueryProvider.tsx   # TanStack Query
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
│
├── homepage/                   # Homepage-specific components
│   ├── HeroCarousel.tsx
│   ├── CategoryStrip.tsx
│   ├── OccasionChips.tsx
│   ├── DeliveryCountdownBanner.tsx
│   ├── SectionHeader.tsx
│   ├── ProductCarousel.tsx
│   ├── PersonalizationBanner.tsx
│   ├── OccasionCollectionsGrid.tsx
│   ├── ReviewCarousel.tsx
│   ├── AppDownloadBanner.tsx
│   └── BrandStrip.tsx
│
├── product/                    # Product-related components
│   ├── ProductCard.tsx
│   ├── ProductCardSkeleton.tsx
│   ├── ProductGrid.tsx
│   ├── ProductGallery.tsx
│   ├── ProductInfo.tsx
│   ├── VariantSelector.tsx
│   ├── PriceDisplay.tsx
│   ├── RatingStars.tsx
│   ├── DeliveryBadge.tsx
│   ├── StockStatus.tsx
│   ├── AddToCartButton.tsx
│   ├── WishlistButton.tsx
│   ├── QuantityStepper.tsx
│   ├── ProductTabs.tsx
│   ├── ProductDescription.tsx
│   ├── RelatedProducts.tsx
│   ├── RecentlyViewed.tsx
│   └── FrequentlyBoughtTogether.tsx
│
├── plp/                        # Product listing page components
│   ├── FilterSidebar.tsx
│   ├── FilterSheet.tsx         # Mobile bottom sheet
│   ├── FilterPill.tsx
│   ├── ActiveFilters.tsx
│   ├── SortDropdown.tsx
│   ├── PLPHeader.tsx
│   ├── Breadcrumb.tsx
│   └── EmptyState.tsx
│
├── delivery/                   # Delivery-related components
│   ├── PincodeInput.tsx
│   ├── DeliverySlotPicker.tsx
│   ├── DeliveryDateCalendar.tsx
│   ├── DeliveryTypeSelector.tsx
│   ├── DeliveryCountdownTimer.tsx
│   └── LocationSelectorModal.tsx
│
├── cart/                       # Cart components
│   ├── CartItem.tsx
│   ├── CartItemAddOns.tsx
│   ├── MiniCartDrawer.tsx
│   ├── OrderSummary.tsx
│   ├── PromoCodeInput.tsx
│   ├── GiftMessagePreview.tsx
│   └── CartRecommendations.tsx
│
├── checkout/                   # Checkout components
│   ├── CheckoutProgress.tsx
│   ├── RecipientDetailsForm.tsx
│   ├── AddressAutocomplete.tsx
│   ├── SavedAddressSelector.tsx
│   ├── GiftMessageStep.tsx
│   ├── GreetingCardSelector.tsx
│   ├── OrderReviewStep.tsx
│   ├── PaymentStep.tsx
│   ├── UPIPayment.tsx
│   ├── CardPayment.tsx
│   ├── NetBankingSelector.tsx
│   └── CheckoutOrderSummary.tsx
│
├── personalization/            # Personalization components
│   ├── PersonalizationPanel.tsx
│   ├── PersonalizationCanvas.tsx
│   ├── ImageUploader.tsx
│   ├── ImageCropTool.tsx
│   ├── TextCustomizer.tsx
│   ├── FontPicker.tsx
│   ├── ColorPicker.tsx
│   └── PersonalizationPreview.tsx
│
├── gifting/                    # Gift-specific components
│   ├── GiftMessageInput.tsx
│   ├── AddOnSelector.tsx
│   ├── GreetingCardPicker.tsx
│   └── GiftWrapSelector.tsx
│
├── account/                    # Customer account components
│   ├── AccountSidebar.tsx
│   ├── OrderCard.tsx
│   ├── OrderTimeline.tsx
│   ├── DeliveryAgentCard.tsx
│   ├── AddressCard.tsx
│   ├── WishlistProductCard.tsx
│   ├── ReviewCard.tsx
│   ├── WalletBalance.tsx
│   └── LoyaltyPoints.tsx
│
├── search/                     # Search components
│   ├── SearchModal.tsx
│   ├── SearchSuggestions.tsx
│   ├── RecentSearches.tsx
│   └── ZeroResultsState.tsx
│
├── reviews/                    # Review components
│   ├── ReviewSummary.tsx
│   ├── ReviewCard.tsx
│   ├── ReviewForm.tsx
│   ├── ReviewPhotoUpload.tsx
│   └── ReviewHelpfulButton.tsx
│
├── gift-finder/                # Gift Finder Wizard
│   ├── GiftFinderWizard.tsx
│   ├── GiftFinderStep.tsx
│   ├── GiftFinderOptionCard.tsx
│   └── GiftFinderProgress.tsx
│
├── admin/                      # Admin-specific components
│   ├── layout/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminTopbar.tsx
│   │   └── AdminBreadcrumb.tsx
│   ├── DataTable.tsx
│   ├── KPIWidget.tsx
│   ├── RevenueChart.tsx
│   ├── ProductForm.tsx
│   ├── VariantBuilder.tsx
│   ├── MediaUploader.tsx
│   ├── OrderDetail.tsx
│   ├── OrderTimeline.tsx
│   ├── CouponForm.tsx
│   ├── ReviewModeration.tsx
│   └── AuditLogTable.tsx
│
├── vendor/                     # Vendor panel components
│   ├── VendorSidebar.tsx
│   ├── OrderFulfillment.tsx
│   ├── InventoryTable.tsx
│   └── EarningsChart.tsx
│
└── common/                     # Truly shared primitives
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    ├── ImageWithFallback.tsx
    ├── CopyButton.tsx
    ├── CountdownTimer.tsx
    ├── RatingDisplay.tsx
    └── Pagination.tsx
```

---

## 4. Features Directory

```
src/features/                   # Feature-scoped business logic + components

├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── OTPForm.tsx
│   │   └── SocialAuthButtons.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useOTP.ts
│   └── utils/
│       └── validation.ts

├── catalog/
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useProduct.ts
│   │   ├── useCategories.ts
│   │   └── useProductFilters.ts
│   └── utils/
│       ├── buildFilterQuery.ts
│       └── formatProductData.ts

├── cart/
│   ├── hooks/
│   │   ├── useCart.ts
│   │   └── useCartActions.ts
│   └── utils/
│       └── cartCalculations.ts

├── checkout/
│   ├── hooks/
│   │   ├── useCheckout.ts
│   │   ├── useDeliverySlots.ts
│   │   └── usePayment.ts
│   └── utils/
│       ├── validateCheckoutForm.ts
│       └── calculateDeliveryCharge.ts

├── delivery/
│   ├── hooks/
│   │   ├── usePincodeCheck.ts
│   │   └── useDeliverySlots.ts
│   └── utils/
│       └── deliveryDateUtils.ts

├── personalization/
│   ├── hooks/
│   │   └── usePersonalizationCanvas.ts
│   └── utils/
│       ├── canvasRenderer.ts
│       └── imageProcessor.ts

├── search/
│   ├── hooks/
│   │   ├── useSearch.ts
│   │   └── useSearchSuggestions.ts
│   └── utils/
│       └── buildSearchQuery.ts

├── wishlist/
│   └── hooks/
│       └── useWishlist.ts

└── reviews/
    └── hooks/
        └── useReviews.ts
```

---

## 5. Lib Directory

```
src/lib/

├── supabase/
│   ├── client.ts               # Browser client
│   ├── server.ts               # Server client (RSC)
│   ├── middleware.ts            # Middleware client
│   └── admin.ts                # Service role client (server only)
│
├── validations/                # Zod validation schemas
│   ├── auth.ts
│   ├── product.ts
│   ├── checkout.ts
│   ├── address.ts
│   ├── review.ts
│   └── coupon.ts
│
├── utils/
│   ├── formatters.ts           # Price, date, phone formatters
│   ├── cn.ts                   # clsx + tailwind-merge
│   ├── slugify.ts
│   ├── generateOrderNumber.ts
│   └── generateReferralCode.ts
│
├── razorpay.ts                 # Razorpay initialization
├── twilio.ts                   # SMS client (server only)
├── resend.ts                   # Email client (server only)
├── constants.ts                # App-wide constants
└── seo.ts                      # SEO utility functions
```

---

## 6. Hooks Directory

```
src/hooks/                      # Global custom hooks

├── useMediaQuery.ts            # Responsive breakpoint detection
├── useLocalStorage.ts          # Type-safe localStorage
├── useSessionStorage.ts
├── useDebounce.ts              # Debounce hook for search
├── useScrollPosition.ts        # Scroll-aware header
├── useClickOutside.ts          # Close dropdown on outside click
├── useIntersectionObserver.ts  # Lazy load trigger
├── useGeolocation.ts           # Browser geolocation
├── useCopyToClipboard.ts
├── useWindowSize.ts
└── useRealtimeSubscription.ts  # Supabase Realtime wrapper
```

---

## 7. Store Directory (Zustand)

```
src/store/

├── authStore.ts                # User session, profile
├── cartStore.ts                # Cart state (client-side optimistic)
├── wishlistStore.ts            # Wishlist state
├── locationStore.ts            # Pincode, city, delivery context
├── searchStore.ts              # Search state (query, history)
├── checkoutStore.ts            # Checkout form state, step management
└── uiStore.ts                  # UI state (drawers, modals, toast)
```

### Store Example

```typescript
// store/locationStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationState {
  pincode: string | null
  city: string | null
  state: string | null
  serviceability: {
    same_day: boolean
    midnight: boolean
    express: boolean
    cod: boolean
  } | null
  setPincode: (pincode: string, data: PincodeData) => void
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      pincode: null,
      city: null,
      state: null,
      serviceability: null,
      setPincode: (pincode, data) => set({
        pincode,
        city: data.city,
        state: data.state,
        serviceability: {
          same_day: data.supports_same_day,
          midnight: data.supports_midnight,
          express: data.supports_express,
          cod: data.cod_available
        }
      }),
      clearLocation: () => set({ pincode: null, city: null, state: null, serviceability: null })
    }),
    { name: 'combovibes-location' }
  )
)
```

---

## 8. Services Directory

```
src/services/                   # API call functions (used by TanStack Query)

├── auth.service.ts
├── products.service.ts
├── categories.service.ts
├── occasions.service.ts
├── search.service.ts
├── cart.service.ts
├── checkout.service.ts
├── orders.service.ts
├── payment.service.ts
├── delivery.service.ts
├── account.service.ts
├── addresses.service.ts
├── wishlist.service.ts
├── reviews.service.ts
├── homepage.service.ts
├── admin/
│   ├── products.service.ts
│   ├── orders.service.ts
│   ├── customers.service.ts
│   ├── vendors.service.ts
│   ├── coupons.service.ts
│   ├── reports.service.ts
│   └── cms.service.ts
└── vendor/
    ├── products.service.ts
    ├── orders.service.ts
    └── earnings.service.ts
```

### Service Example

```typescript
// services/products.service.ts
import { ProductFilters, ProductsResponse } from '@/types/product'

export const productsService = {
  async getProducts(filters: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    
    const response = await fetch(`/api/products?${params}`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },
  
  async getProduct(slug: string) {
    const response = await fetch(`/api/products/${slug}`)
    if (!response.ok) throw new Error('Product not found')
    return response.json()
  }
}
```

---

## 9. Types Directory

```
src/types/

├── supabase.ts                 # Auto-generated from Supabase (supabase gen types)
├── api.ts                      # API request/response types
├── product.ts                  # Product domain types
├── category.ts
├── order.ts
├── cart.ts
├── delivery.ts
├── payment.ts
├── user.ts
├── vendor.ts
├── review.ts
├── coupon.ts
├── cms.ts
└── index.ts                    # Re-export all types
```

---

## 10. Supabase Directory

```
supabase/

├── config.toml                 # Local Supabase config
├── seed.sql                    # Development seed data
│
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_products_catalog.sql
│   ├── 003_orders.sql
│   ├── 004_delivery.sql
│   ├── 005_payments.sql
│   ├── 006_reviews.sql
│   ├── 007_gifting.sql
│   ├── 008_marketing.sql
│   ├── 009_vendors.sql
│   ├── 010_cms.sql
│   ├── 011_admin_rbac.sql
│   ├── 012_audit_notifications.sql
│   ├── 013_rls_policies.sql
│   ├── 014_functions_triggers.sql
│   └── 015_indexes.sql
│
└── functions/
    ├── payment-webhook/
    │   └── index.ts
    ├── send-notification/
    │   └── index.ts
    ├── order-confirmation/
    │   └── index.ts
    ├── generate-invoice/
    │   └── index.ts
    ├── personalization-preview/
    │   └── index.ts
    ├── check-pincode/
    │   └── index.ts
    ├── apply-coupon/
    │   └── index.ts
    ├── delivery-slot-availability/
    │   └── index.ts
    ├── abandoned-cart-recovery/
    │   └── index.ts
    ├── festival-reminders/
    │   └── index.ts
    └── vendor-payout-calculate/
        └── index.ts
```

---

## 11. Public Directory

```
public/

├── images/
│   ├── logo.svg
│   ├── logo-dark.svg
│   ├── favicon.ico
│   ├── og-image.jpg           # Default Open Graph image
│   ├── illustrations/         # Empty state, error illustrations
│   │   ├── empty-cart.svg
│   │   ├── empty-wishlist.svg
│   │   ├── order-success.svg
│   │   ├── 404.svg
│   │   └── maintenance.svg
│   └── icons/                 # Category icons
│       ├── flowers.svg
│       ├── cakes.svg
│       └── [...]
│
├── fonts/                     # Self-hosted fonts (optional)
├── manifest.json              # PWA manifest
└── sw.js                      # Service worker (optional)
```

---

## 12. Configuration Files

### `next.config.mjs`

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    ppr: true,                  // Partial Prerendering
    serverActions: { allowedOrigins: ['localhost:3000'] }
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' }
      ]
    }
  ]
}
```

### `tailwind.config.ts`

```typescript
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C9936A', dark: '#A8734A', light: '#E8C4A0' },
        secondary: '#D4AF37',
        accent: '#8B1A4A',
        brand: {
          cream: '#FAF6F1',
          charcoal: '#1A1A2E'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif']
      }
    }
  }
}
```

---

## 13. Naming Conventions

| Type | Convention | Example |
|---|---|---|
| **Components** | PascalCase | `ProductCard.tsx`, `HeroCarousel.tsx` |
| **Pages** | `page.tsx` | `app/products/[slug]/page.tsx` |
| **API Routes** | `route.ts` | `app/api/products/route.ts` |
| **Hooks** | `useXxx.ts` | `useCart.ts`, `useProducts.ts` |
| **Stores** | `xxxStore.ts` | `cartStore.ts`, `authStore.ts` |
| **Services** | `xxx.service.ts` | `products.service.ts` |
| **Utils** | `camelCase.ts` | `formatters.ts`, `slugify.ts` |
| **Types** | `xxx.ts` | `product.ts`, `order.ts` |
| **Constants** | `SCREAMING_SNAKE` | `MAX_CART_ITEMS = 20` |

---

## 14. Import Aliases

```typescript
// tsconfig.json paths
"@/*": ["./src/*"]

// Usage
import { ProductCard } from '@/components/product/ProductCard'
import { useCart } from '@/features/cart/hooks/useCart'
import { productsService } from '@/services/products.service'
import { formatPrice } from '@/lib/utils/formatters'
import { Product } from '@/types/product'
import { createClient } from '@/lib/supabase/client'
```
