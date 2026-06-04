# 05 — UI Replication Plan

> **Purpose:** Document every UI section's layout, component breakdown, design system decisions, and reusable component strategy for the Combovibes premium gifting platform. Designed to surpass FNP in visual quality while replicating all business capabilities.

---

## Design Philosophy

**Premium. Modern. Warm.**

- **Color Palette**: Deep rose gold (#C9936A), warm cream (#FAF6F1), rich charcoal (#1A1A2E), accent gold (#D4AF37)
- **Typography**: Display — `Playfair Display` (serif, luxury feel). Body — `Inter` (clean, readable). Accents — `Cormorant Garamond`
- **Spacing**: 8px base grid. Generous whitespace. Cards with subtle shadows.
- **Imagery**: Full-bleed photography, editorial style. No cheap stock photos.
- **Motion**: Subtle Framer Motion animations — fade-in, slide-up, hover lifts.
- **Icons**: Lucide React (consistent, clean line icons)

---

## Table of Contents

1. [Design System & Tokens](#1-design-system--tokens)
2. [Global Layout Components](#2-global-layout-components)
3. [Homepage Sections](#3-homepage-sections)
4. [Product Listing Page (PLP)](#4-product-listing-page-plp)
5. [Product Detail Page (PDP)](#5-product-detail-page-pdp)
6. [Cart UI](#6-cart-ui)
7. [Checkout UI](#7-checkout-ui)
8. [Account Pages UI](#8-account-pages-ui)
9. [Admin Panel UI](#9-admin-panel-ui)
10. [Reusable Component Catalog](#10-reusable-component-catalog)
11. [Animation Strategy](#11-animation-strategy)
12. [Responsive Breakpoints](#12-responsive-breakpoints)

---

## 1. Design System & Tokens

### Color Tokens

```css
/* Brand Colors */
--color-primary: #C9936A;       /* Rose gold - CTAs, accents */
--color-primary-dark: #A8734A;  /* Hover state */
--color-primary-light: #E8C4A0; /* Light accent */
--color-secondary: #D4AF37;     /* Gold - premium badges */
--color-accent: #8B1A4A;        /* Deep rose - highlights */

/* Neutrals */
--color-bg: #FAF6F1;            /* Warm cream background */
--color-surface: #FFFFFF;       /* Card backgrounds */
--color-surface-muted: #F5F0EB; /* Muted section backgrounds */
--color-border: #E8DED4;        /* Warm border color */
--color-text-primary: #1A1A2E;  /* Rich charcoal */
--color-text-secondary: #6B6678;/* Muted text */
--color-text-muted: #9E9AAA;    /* Placeholder, captions */

/* Status Colors */
--color-success: #22C55E;
--color-error: #EF4444;
--color-warning: #F59E0B;
--color-info: #3B82F6;
```

### Typography Scale

```
Display XL:  Playfair Display, 56px, weight 700
Display L:   Playfair Display, 44px, weight 700
H1:          Playfair Display, 36px, weight 600
H2:          Playfair Display, 28px, weight 600
H3:          Inter, 22px, weight 600
H4:          Inter, 18px, weight 600
Body L:      Inter, 18px, weight 400
Body:        Inter, 16px, weight 400
Body S:      Inter, 14px, weight 400
Caption:     Inter, 12px, weight 400
Label:       Inter, 12px, weight 600, UPPERCASE, letter-spacing 0.08em
```

### Spacing Scale

```
4px / 8px / 12px / 16px / 20px / 24px / 32px / 40px / 48px / 64px / 80px / 96px / 128px
```

### Border Radius

```
sm: 4px
md: 8px
lg: 12px
xl: 16px
2xl: 24px
full: 9999px
```

### Shadow Scale

```
shadow-sm:  0 1px 3px rgba(0,0,0,0.06)
shadow-md:  0 4px 12px rgba(0,0,0,0.08)
shadow-lg:  0 8px 24px rgba(0,0,0,0.10)
shadow-xl:  0 16px 48px rgba(0,0,0,0.12)
shadow-card: 0 2px 8px rgba(201,147,106,0.12)
```

---

## 2. Global Layout Components

### TopBanner

```
Layout: full-width sticky bar, 36px height
Content: Scrolling marquee of promo text
Style: bg-primary text-white, Label typography
Behavior: Closes on X click, remembers in sessionStorage
```

### TopNavbar

```
Layout: sticky, 72px height (reduces to 56px on scroll)
Left:   Logo (SVG, 140px wide)
Center: Search bar (expands on focus, 480px max-width)
Right:  LocationSelector | WishlistIcon | CartIcon | LoginButton
Style:  bg-white border-b border-border shadow-sm
```

### CategoryNavbar

```
Layout: Horizontal scrollable tab row, 44px height
Items:  Category name + optional icon
Hover:  Triggers MegaMenu
Mobile: Hidden (hamburger instead)
Style:  bg-white border-b, text-text-secondary
Active: text-primary border-b-2 border-primary
```

### MegaMenu

```
Layout:  Full-width dropdown, 400px height max
Columns: Left (subcategories) | Center (featured) | Right (promo)
Left:    List items with H4 headers + Body S links
Center:  2-3 editorial cards (image + title)
Right:   Single large promo card (image + CTA button)
Motion:  Fade in + slide down (200ms ease)
```

### Footer

```
Layout: 5-column grid on desktop, single column on mobile
Col 1:  Logo + tagline + social links
Col 2:  Quick Links (About, Careers, Blog, Contact)
Col 3:  Help (FAQ, Track Order, Refund Policy, Terms)
Col 4:  Categories (Flowers, Cakes, Plants, Personalized)
Col 5:  App download badges + payment logos
Bottom: Copyright + trust badges (SSL, payment security)
```

### MobileBottomNav

```
Layout: Fixed bottom bar, 56px height, 5 items
Items:  Home | Categories | Search | Wishlist | Account
Style:  bg-white border-t shadow-lg
Active: text-primary with filled icon variant
```

### MobileHamburgerDrawer

```
Layout:  Full-height left side drawer (90% width)
Content: Logo | Close Button | Accordion categories
Footer:  Login/Account | Language | Help
Motion:  Slide in from left (300ms ease-out)
```

---

## 3. Homepage Sections

### 3.1 HeroCarousel

```
Layout:   Full viewport width, 580px height (desktop), 380px (mobile)
Content:  Image + gradient overlay + text block + CTA button
Autoplay: 4 seconds, pause on hover
Controls: Dot indicators, prev/next arrows (desktop only)
Mobile:   Touch swipe enabled
Motion:   Ken Burns effect on images
Style:    Text: white, Display L typography
CTA:      Filled primary button with arrow icon
```

### 3.2 QuickCategoryStrip

```
Layout:   Horizontal scroll, 120px card width
Cards:    Rounded square icon (48px) + label below
Icons:    Custom SVG illustrations per category
Mobile:   Touch scroll, no scrollbar visible
Hover:    Scale 1.05, shadow lift
Style:    bg-surface-muted, 16px padding
```

### 3.3 OccasionChipsRow

```
Layout:   Wrapping chip row on desktop, scroll on mobile
Chips:    Pill shape (border-radius: full)
Style:    border border-border, hover: bg-primary text-white
Icons:    Emoji or small SVG per occasion
Examples: 🎂 Birthday | 💍 Anniversary | 💝 Valentine's | 🪔 Diwali
```

### 3.4 DeliveryCountdownBanner

```
Layout:   Full-width banner, 64px height, centered content
Content:  Icon + "Order in [X]h [Y]m for Same Day Delivery" + CTA link
Timer:    Live countdown, updates every second
Style:    bg-accent text-white (when < 2h remaining → bg-error flash)
Mobile:   Same, slightly taller (72px)
```

### 3.5 FeaturedProductCarousel

```
Layout:   Section with SectionHeader + horizontal scroll grid
Cards:    ProductCard component (see Reusable Components)
Controls: Prev/next arrows on desktop
Mobile:   Touch scroll
Title:    H2 Playfair + "View All" link (right aligned)
```

### 3.6 PersonalizationBanner

```
Layout:   Two-column split (50/50): text left, product showcase right
Left:     H1 + Body + CTA button
Right:    3-4 personalization product thumbnails in masonry
Style:    bg-primary-light, rounded-2xl, 80px padding
CTA:      "Personalize Now" → /personalized-gifts
```

### 3.7 OccasionCollectionsGrid

```
Layout:   4-column grid on desktop, 2-column on mobile
Cards:    Large cards (aspect 4:3), image + overlay text + CTA
Examples: "Birthday Collection" | "Anniversary Picks" | "Diwali Hampers"
Hover:    Image scale 1.03, overlay opacity changes
Style:    rounded-xl overflow-hidden, shadow-card
```

### 3.8 BestSellersSection

```
Layout:   Tabbed section: All | Flowers | Cakes | Plants | Chocolates
Grid:     4 cards per row (desktop), 2 (tablet), 1.5 scroll (mobile)
Behavior: Tab switches product set without page load
```

### 3.9 ReviewCarousel

```
Layout:   3-card visible on desktop, 1 on mobile
Card:     Stars + quote + reviewer name + product bought + date
Motion:   Auto-advance 5 seconds, swipe on mobile
Style:    bg-surface, shadow-sm, border-border
```

### 3.10 AppDownloadBanner

```
Layout:   Full-width section, two-column
Left:     Phone mockup image (PNG)
Right:    H2 "Gift on the go" + store badges (App Store + Google Play)
Style:    bg-surface-muted
```

### 3.11 BrandStrip

```
Layout:   Horizontal scrolling logo strip
Logos:    Grayscale, 120px × 40px, on hover → full color
Partners: Cadbury, Ferrero Rocher, Kinder, Kit Kat, Haldiram's
```

---

## 4. Product Listing Page (PLP)

### FilterSidebar

```
Position: Sticky left column, 260px wide, desktop only
Sections: Collapsible accordion per filter type
Types:    PriceRangeSlider | CheckboxGroup | RatingFilter
Footer:   "Clear All Filters" button
Mobile:   Bottom sheet drawer with "Apply" button
```

### ProductGrid

```
Layout:   3-column grid (desktop) | 2-column (tablet) | 2-column (mobile)
Loading:  Skeleton cards during fetch
Empty:    EmptyState illustration + search tips
Infinite: "Load More" button at bottom (not true infinite scroll)
```

### ProductCard

```
Layout:   Vertical card, aspect-ratio thumbnail
Elements:
  - Image: aspect-4/3, hover shows secondary image
  - WishlistToggle: top-right, heart icon
  - BadgeGroup: top-left (Bestseller / New / Sale / Express)
  - ProductName: 2 lines, font-medium, text-text-primary
  - PriceRow: Sale price + strikethrough MRP + % off badge
  - RatingRow: Stars (filled) + review count
  - DeliveryBadge: "Today" / "Tomorrow" / "Midnight" chip
  - PersonalizableBadge: shown if product supports it
  - AddToCartButton: on hover, slides up from bottom
Shadow: shadow-card, hover: shadow-lg
Motion: hover translateY(-4px) ease 200ms
```

### ActiveFilterPills

```
Layout:   Horizontal row below page title
Pills:    "[Filter]: [Value] ×" chips
Clear All: Text button at right
Mobile:   Horizontally scrollable
```

### SortDropdown

```
Style:    Select or custom dropdown
Options:  Relevance | Price: Low to High | Price: High to Low | Newest | Bestseller | Top Rated
Position: Right-aligned above product grid
```

---

## 5. Product Detail Page (PDP)

### ProductGallery

```
Desktop:
  - Main image: 480px × 480px, zoom on hover
  - Thumbnail strip: vertical, 4 visible, scroll
  - Video thumbnail opens modal

Mobile:
  - Full-width swipeable carousel
  - Dot indicators below
```

### ProductInfoPanel

```
Sticky: Yes (on desktop, scrolls with page past gallery)
Sections:
  1. BreadcrumbNav
  2. ProductName (H1 Playfair)
  3. SKU + RatingRow
  4. PriceBlock (sale price, MRP, discount badge, inclusive of taxes note)
  5. VariantSelector (size/weight/color as clickable chips)
  6. InventoryStatus ("Only 3 left!" warning)
  7. Divider
  8. PincodeInput + CheckDeliveryButton
  9. DeliveryOptions (radio group with slot details)
  10. DeliveryDateCalendar (mini calendar)
  11. DeliverySlotSelector (chip grid)
  12. Divider
  13. GiftMessageTextarea
  14. AddOnCheckboxes (card, wrapping, chocolate, balloon)
  15. Divider
  16. QuantityStepper
  17. ActionButtons (AddToCart + BuyNow + Wishlist)
  18. TrustBadges (100% Fresh | Secure Payment | On-time Delivery)
```

### ProductDescriptionTabs

```
Tabs:    Description | Care Instructions | Delivery Info | Reviews
Content: Rich text (Description), Accordion (Care), Info blocks (Delivery), ReviewSection
```

### ReviewsSection

```
Layout:  2-column: left summary, right review list
Summary: Overall rating (large) + distribution bars
List:    ReviewCard × paginated
Card:    Avatar + Name + Date + Stars + Text + Photos + Helpful
Filter:  Star rating filter above list
```

---

## 6. Cart UI

### CartPage Layout

```
Desktop: 2/3 (items) + 1/3 (summary) grid
Mobile:  Single column, summary at bottom

CartItem:
  - Thumbnail (80px)
  - Name + Variant
  - DeliveryInfo (date + slot)
  - GiftMessageChip (click to edit)
  - GreetingCardChip (if added)
  - PriceRow
  - QuantityStepper
  - ActionLinks (Remove | Save to Wishlist)

OrderSummary:
  - Subtotal
  - Delivery Charge(s)
  - Discount (if coupon applied)
  - Tax (GST)
  - Total (large, bold)
  - PromoCodeInput
  - LoyaltyToggle
  - WalletToggle
  - ProceedToCheckout (full-width primary button)
  - AcceptedPaymentsStrip (card logos)
```

### MiniCartDrawer

```
Position:  Right-side overlay drawer
Width:     380px (desktop), full-width (mobile)
Motion:    Slide from right (300ms)
Backdrop:  Semi-transparent overlay
Content:   CartItemList (compact) + OrderSummary + CTAs
```

---

## 7. Checkout UI

### CheckoutLayout

```
Single page, progressive accordion sections
Left:  Main form (70%)
Right: Sticky OrderSummary (30%)
Mobile: Stacked, summary collapses at top

Steps (collapsible accordions):
  1. ▼ Delivery Details    [Expanded by default]
  2. ▷ Delivery Date & Slot [Locks until step 1 complete]
  3. ▷ Gift Message        [Optional, expands on click]
  4. ▷ Review Order        [Shows on completion of steps 1-3]
  5. ▷ Payment             [Expands on Review confirmation]
```

### DeliverySlotGrid

```
Layout:   4-column chip grid
Slots:    Morning (6-10 AM) | Afternoon (12-4 PM) | Evening (6-9 PM) | Midnight (11:30 PM)
Status:   Available (outlined) | Selected (filled primary) | Almost Full (warning) | Unavailable (disabled, strikethrough)
Price:    Delivery charge shown below slot name
```

### PaymentSection

```
Tabs:     UPI | Cards | Net Banking | Wallets | COD
UPI:      QR code + UPI ID input + popular UPI app buttons (GPay, PhonePe, Paytm)
Cards:    Card number / expiry / CVV / name + 3D Secure note
Wallets:  List of wallet options with balance if connected
COD:      Availability check + COD fee notice
Security: Lock icon + "100% Secure Payment" text
```

### OrderConfirmation

```
Motion:   Confetti animation on load (Framer Motion)
Content:
  - Success illustration (animated checkmark)
  - "Order Placed Successfully!" (H1)
  - Order ID (copyable chip)
  - What Happens Next (3 steps timeline)
  - DeliveryDetailCard
  - GiftMessagePreview
  - "Track Order" CTA (primary button)
  - "Continue Shopping" CTA (text link)
  - CrossSellCarousel: "Others also ordered..."
```

---

## 8. Account Pages UI

### Account Layout (Desktop)

```
Left Sidebar (240px):
  - UserAvatar + Name
  - Navigation links (vertical)
  - Loyalty tier badge

Main Content Area:
  - Page title + actions
  - Content
```

### Account Layout (Mobile)

```
Tab bar or hamburger menu for account nav
Full-width content
```

### OrderCard (in list)

```
Layout:   Row card
Left:     Product thumbnail (first item)
Center:   Order ID | Date | Items count | Total | Status badge
Right:    Track Order | Reorder | View Details buttons
```

### OrderTimeline (tracking)

```
Vertical stepper, 5 states:
  ● Placed → ● Confirmed → ● Packed → ● Dispatched → ● Delivered
Active:   Filled circle, bold text, green checkmark for completed
Pending:  Empty circle, muted text
Current:  Pulsing animation on current step
```

---

## 9. Admin Panel UI

### Admin Layout

```
Left sidebar (240px, collapsible to 64px icon-only)
  - Platform logo
  - Navigation groups:
    - Dashboard
    - Catalog (Products, Categories, Collections)
    - Orders
    - Customers
    - Vendors
    - Marketing (Coupons, CMS, Campaigns)
    - Reports
    - Settings
    - Access Control

Top bar:
  - Breadcrumb
  - Global search
  - Notifications bell
  - Admin profile dropdown

Main area:
  - Page header + action buttons
  - Content (tables, forms, charts)
```

### DataTable Component

```
Features:
  - Column sorting (click header)
  - Row checkbox selection
  - Bulk actions bar
  - Column visibility toggle
  - Export button
  - Row action dropdown menu
  - Pagination with page size selector
  - Search/filter row at top
Style: Clean, minimal, shadcn/ui Table
```

### KPI Widget

```
Layout:   Card with icon + metric + trend
Elements: Icon (colored bg) | Label | Value (large) | Trend (% ± vs last period)
Colors:   Green trend up / Red trend down
```

### Form Standards

```
Labels:     Above input, small, semibold
Inputs:     Rounded-md, border, focus ring
Validation: Inline error below input
Selects:    Custom styled shadcn Select
Textareas:  Auto-resize with char count
File Upload: Dropzone with preview
Rich Text:  TipTap editor for descriptions
```

---

## 10. Reusable Component Catalog

### Primitives (shadcn/ui based)

| Component | Usage |
|---|---|
| `Button` | Primary / Secondary / Ghost / Destructive variants |
| `Input` | Text, email, phone, password inputs |
| `Select` | Dropdown select |
| `Checkbox` | Boolean toggles |
| `RadioGroup` | Variant/option selection |
| `Switch` | Toggle for settings |
| `Textarea` | Multi-line text |
| `Dialog` | Modal dialogs |
| `Sheet` | Side drawer (mobile filters, mini cart) |
| `Accordion` | Collapsible sections |
| `Tabs` | Content switching |
| `Badge` | Status badges, product tags |
| `Card` | Container card |
| `Separator` | Horizontal dividers |
| `Avatar` | User profile pictures |
| `Skeleton` | Loading placeholder |
| `Toast` | Success/error notifications |
| `Calendar` | Date picker |
| `Slider` | Price range filter |
| `Progress` | Upload progress, checkout steps |

### Domain-Specific Components

| Component | Props / Details |
|---|---|
| `ProductCard` | `product`, `showWishlist`, `showDeliveryBadge` |
| `ProductCarousel` | `products`, `title`, `viewAllLink` |
| `PriceDisplay` | `price`, `mrp`, `showDiscount` |
| `RatingStars` | `rating`, `count`, `size` |
| `DeliveryBadge` | `type: 'today' | 'tomorrow' | 'midnight'` |
| `WishlistButton` | `productId`, `isWishlisted` |
| `AddToCartButton` | `productId`, `variant`, `quantity` |
| `QuantityStepper` | `value`, `min`, `max`, `onChange` |
| `PincodeInput` | `onValidate`, `onSuccess` |
| `DeliverySlotPicker` | `slots`, `selected`, `onSelect` |
| `GiftMessageInput` | `value`, `maxLength`, `onChange` |
| `ImageGallery` | `images`, `videos`, `enableZoom` |
| `VariantSelector` | `variants`, `type`, `selected`, `onSelect` |
| `ReviewCard` | `review` object |
| `ReviewSummary` | `averageRating`, `distribution` |
| `OrderTimeline` | `status`, `steps` |
| `CountdownTimer` | `targetTime`, `onExpire` |
| `LocationSelector` | `onLocationChange` |
| `SectionHeader` | `title`, `viewAllLink`, `subtitle` |
| `FilterPill` | `label`, `onRemove` |
| `EmptyState` | `title`, `description`, `cta`, `illustration` |
| `PersonalizationCanvas` | `product`, `text`, `image`, `onPreview` |

---

## 11. Animation Strategy

### Framer Motion Patterns

```typescript
// Page entry animation
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

// Stagger children (product grids, card lists)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}

// Card hover lift
const cardHover = {
  y: -4,
  shadow: '0 8px 24px rgba(0,0,0,0.12)',
  transition: { duration: 0.2 }
}

// Drawer slide-in
const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
}
```

### Reduced Motion

```typescript
// Always respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

---

## 12. Responsive Breakpoints

```
xs:  < 480px   (small phones)
sm:  480–639px (large phones)
md:  640–767px (tablet portrait)
lg:  768–1023px (tablet landscape)
xl:  1024–1279px (small desktop)
2xl: 1280px+   (large desktop)
```

### Layout Grid

| Breakpoint | Columns | Gutter |
|---|---|---|
| xs / sm | 4 | 16px |
| md | 8 | 24px |
| lg | 12 | 24px |
| xl / 2xl | 12 | 32px |

### Product Grid Columns

| Breakpoint | Cards per Row |
|---|---|
| xs | 2 |
| sm | 2 |
| md | 3 |
| lg | 3 |
| xl | 4 |
| 2xl | 5 |
