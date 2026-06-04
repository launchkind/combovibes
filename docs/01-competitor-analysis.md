# 01 — Competitor Analysis: FNP (Ferns N Petals)

> **Purpose:** Deep-dive reverse engineering of fnp.com to extract every page pattern, UX decision, business logic, and feature that must be replicated or improved in Combovibes.

---

## Table of Contents

1. [Homepage](#1-homepage)
2. [Header & Navigation](#2-header--navigation)
3. [Mega Menus](#3-mega-menus)
4. [Search Experience](#4-search-experience)
5. [Product Listing Pages (PLP)](#5-product-listing-pages-plp)
6. [Product Detail Pages (PDP)](#6-product-detail-pages-pdp)
7. [Gift Finder](#7-gift-finder)
8. [Occasion Pages](#8-occasion-pages)
9. [Personalization Pages](#9-personalization-pages)
10. [Cart](#10-cart)
11. [Checkout](#11-checkout)
12. [Order Tracking](#12-order-tracking)
13. [User Account](#13-user-account)
14. [Delivery Experience](#14-delivery-experience)
15. [Mobile Experience](#15-mobile-experience)
16. [Improvement Opportunities](#16-improvement-opportunities)

---

## 1. Homepage

### Purpose
The homepage acts as the primary discovery engine — driving users toward occasion-based gifting, trending products, and same-day delivery urgency.

### Key Sections

| Section | Description |
|---|---|
| **Hero Carousel** | Full-width rotating banners for festivals, occasions, promotions. Auto-plays every 3–5s. Includes CTA buttons. |
| **Quick Category Strip** | Horizontal scroll of top categories (Flowers, Cakes, Plants, Combos, Personalized). Icons + labels. |
| **Occasion Rows** | Grid of occasion chips: Birthday, Anniversary, Wedding, Valentine's, etc. |
| **Same-Day Delivery Banner** | Urgency block showing "Order before X PM" countdown. Location-aware. |
| **Best Sellers** | Horizontal product carousel — 4-6 cards visible, swipeable. |
| **Personalized Gifts** | Dedicated section showcasing customization options. |
| **Featured Collections** | Curated editorial collections (e.g., "Luxury Hampers", "Office Gifting"). |
| **City-Based Delivery** | "Deliver to [City]" widget that adapts content by pin-code. |
| **Trending / New Arrivals** | Tabbed section: Trending | New | Top Rated. |
| **Brand Logos Strip** | Partner brands (Cadbury, Ferrero, etc.). |
| **Customer Reviews Carousel** | Social proof block with star ratings and testimonials. |
| **Footer** | Links, social icons, app download badges, payment icons, trust badges. |

### Components
- `HeroCarousel` — full-width with overlay CTA
- `CategoryStrip` — icon + label horizontal scroll
- `OccasionChips` — tag-style clickable chips
- `DeliveryCountdownBanner` — real-time urgency
- `ProductCarousel` — swipeable card grid
- `SectionHeader` — title + "View All" link
- `ReviewCarousel` — testimonial slider
- `BrandStrip` — partner logos

### UX Patterns
- **Above-the-fold urgency**: Delivery countdown is always visible.
- **Location personalization**: City/pincode detection changes product availability and delivery messaging.
- **Horizontal scroll**: Used extensively to show many options without cluttering vertical space.
- **Tab switching**: Avoids multiple sections by grouping related content (Trending/New/Top Rated).
- **Sticky offer bar**: Top banner shows active promo codes.

### Business Logic
- Homepage content is CMS-driven (banners, featured collections).
- Product carousels are algorithm-driven (bestsellers by region/season).
- Occasion chips are dynamically weighted by upcoming festival calendar.
- Delivery messaging is pincode-aware (if no pincode set, defaults to Mumbai).

---

## 2. Header & Navigation

### Purpose
Persistent navigation providing access to all major site sections, cart, wishlist, account, and location selector.

### Structure

```
[Top Offer Bar]         — Scrolling promotional text
[Logo] [Location]  [Search Bar]  [Wishlist] [Cart] [Login]
[Category Nav Bar]  — Mega menu triggers
```

### Components

| Component | Details |
|---|---|
| **Top Offer Bar** | Scrolling marquee of active promotions, free shipping threshold |
| **Logo** | Left-aligned, links to home |
| **Location Selector** | "Deliver to: [City]" — opens pincode modal |
| **Search Bar** | Prominent, full-width on mobile — see Section 4 |
| **Wishlist Icon** | Heart icon + count badge |
| **Cart Icon** | Bag icon + item count badge |
| **Login/Account** | "Login" text or avatar dropdown if authenticated |
| **Category Nav** | Horizontal scrollable category tabs triggering mega menus |

### UX Patterns
- Header is **sticky** on scroll (reduces in height).
- On mobile, category nav collapses into hamburger.
- Cart and wishlist counts update in real time.
- Location selector is prominent — drives delivery-aware experience.

### Business Logic
- Login state persists via JWT/session.
- Cart count fetches from server on load, then updates optimistically.
- Location stored in cookie/localStorage — persists across sessions.

---

## 3. Mega Menus

### Purpose
Reveal full product taxonomy on hover (desktop) or tap (mobile) without requiring navigation to a separate page.

### Structure

```
[Category Tab: Flowers]
  Left Column: Subcategories    Center: Featured Collections    Right: Promo Banner
  - Roses                       - Valentine's Special           [Image + CTA]
  - Mixed Bouquets              - Exotic Arrangements
  - Single Stem                 - Premium Blooms
  - Seasonal                    - Bestsellers
```

### Components
- `MegaMenuWrapper` — full-width dropdown panel
- `MegaMenuColumn` — subcategory link list
- `MegaMenuFeatured` — image + title + link cards
- `MegaMenuBanner` — promotional image CTA

### UX Patterns
- **Hover intent**: 200ms delay before opening to prevent accidental triggers.
- **Visual hierarchy**: Bold subcategory headers with indented children.
- **Promotional real estate**: Right column always has an image/offer — drives impulse clicks.
- **Mobile adaptation**: Accordion-style inside drawer.

### Business Logic
- Mega menu data is CMS-driven and can be updated without code deploy.
- Categories are sorted by popularity/season.
- "New" badges applied dynamically for recently added subcategories.

---

## 4. Search Experience

### Purpose
Primary product discovery mechanism for users with intent. Must handle product names, occasions, recipients, and categories.

### Features

| Feature | Details |
|---|---|
| **Instant Suggestions** | Real-time dropdown as user types (debounced 300ms) |
| **Recent Searches** | Stored in localStorage, shown on focus |
| **Trending Searches** | Curated list shown on empty focus |
| **Category Suggestions** | "In Flowers" / "In Cakes" scoped search |
| **Product Suggestions** | Product cards with image + price in dropdown |
| **Occasion Suggestions** | "Birthday Gifts", "Anniversary Gifts" quick links |
| **No Results State** | Curated fallback — "You might also like" |
| **Search Results Page** | Full PLP with filters applied from query |

### Search Result Ranking Logic
1. Exact name match
2. Partial name match
3. Category/tag match
4. Occasion match
5. Popularity/sales rank

### UX Patterns
- Search bar **expands** on focus with overlay backdrop.
- Voice search icon (mobile).
- "Search by occasion" is a prominent suggestion category.
- Autocomplete shows product thumbnail + price inline.

### Business Logic
- Search powered by Elasticsearch/Algolia equivalent.
- Zero-result queries are logged for merchandising review.
- Promoted search results exist (paid product placements).
- Personalized suggestions based on browse/order history.

---

## 5. Product Listing Pages (PLP)

### Purpose
Display filtered, sorted product grids for a given category, occasion, or search query.

### URL Patterns
```
/gifts/birthday-gifts
/gifts/flowers/roses
/gifts/same-day-delivery
/search?q=anniversary+gifts
/occasion/mothers-day
```

### Layout

```
[Breadcrumb]
[Page Title + Result Count]
[Filter Sidebar]  |  [Sort Dropdown]  [Product Grid]
                  |  [Product Cards]  [Product Cards]
                  |  [Pagination / Infinite Scroll]
```

### Filter System

| Filter Type | Options |
|---|---|
| **Price Range** | Slider: ₹0 – ₹10,000+ |
| **Delivery Type** | Same Day, Midnight, Fixed Time, Express |
| **Occasion** | Birthday, Anniversary, Wedding… |
| **Category** | Flowers, Cakes, Chocolates, Plants… |
| **Rating** | 4★+, 3★+, etc. |
| **Sort** | Relevance, Price Low-High, Price High-Low, Newest, Top Rated, Bestseller |
| **Availability** | In Stock Only |
| **Location** | Pincode-aware availability |

### Product Card Components

| Element | Details |
|---|---|
| Product Image | Primary + hover secondary image |
| Product Name | 2-line truncated |
| Price | Sale price + crossed MRP + discount % badge |
| Rating | Star rating + review count |
| Delivery Badge | "Today", "Tomorrow", "Midnight" chip |
| Wishlist Toggle | Heart icon, saves to wishlist |
| Quick Add | "Add to Cart" hover action |
| Personalization Badge | "Personalizable" tag if applicable |
| Express Badge | "Express Delivery" tag |

### UX Patterns
- **Sticky filter sidebar** on desktop.
- **Filter pill summary** at top — shows active filters with X to remove.
- **Infinite scroll** or "Load More" button.
- **Skeleton loading** for cards during fetch.
- **Grid/List toggle** on desktop.
- **Mobile**: Bottom sheet for filters.

### Business Logic
- Filter combinations produce URL query params (shareable/indexable).
- Out-of-stock products shown last with "Out of Stock" overlay.
- Price includes all add-ons (delivery, wrapping) or clearly excludes them.
- Delivery availability checked per pincode.

---

## 6. Product Detail Pages (PDP)

### Purpose
Convert product interest into purchase. Must handle variants, personalization, delivery slot selection, and gifting options.

### Layout

```
[Breadcrumb]
[Image Gallery]  |  [Product Info Panel]
                 |  - Name
                 |  - SKU / Rating
                 |  - Price + Discount
                 |  - Variant Selector
                 |  - Delivery Date Picker
                 |  - Delivery Type Selector
                 |  - Pincode Checker
                 |  - Gift Message
                 |  - Add-ons (Greeting Card, Wrapping)
                 |  - Quantity
                 |  - Add to Cart / Buy Now
                 |  - Wishlist
[Product Description Tabs]
[Reviews Section]
[Related Products Carousel]
[Recently Viewed]
```

### Image Gallery
- Main image + thumbnail strip
- Zoom on hover (desktop)
- Swipe on mobile
- Video support
- 360° view (premium products)

### Variant System

| Variant Type | Examples |
|---|---|
| Size | Small, Medium, Large, XL |
| Weight | 500g, 1kg, 2kg (cakes) |
| Color | Red, Pink, Mixed (flowers) |
| Flavor | Chocolate, Vanilla, Strawberry |
| Count | 6 roses, 12 roses, 24 roses |

### Delivery Options
- **Standard Delivery**: Select date from calendar
- **Same Day Delivery**: Order before cutoff time
- **Midnight Delivery**: 11:30 PM – 12:30 AM
- **Fixed Time Slots**: Morning / Afternoon / Evening
- **Express**: 3-hour delivery

### Personalization Flow
- Text input for custom message on product
- Image upload for photo-printed gifts
- Preview panel showing result in real time
- Character limits per field
- Font/color selection (premium personalization)

### Add-ons System
- Greeting card (with message)
- Premium gift wrapping
- Candles
- Balloon bouquet
- Chocolate box
- Personalized ribbon

### Business Logic
- Variant selection changes price, images, and availability.
- Delivery slots shown based on pincode + variant lead time.
- Personalized items non-returnable — displayed as disclaimer.
- Add-ons priced individually, shown in cart.
- "Notify Me" if out of stock.

### Reviews Section
- Average rating widget
- Rating distribution bars
- Review cards: reviewer name, date, rating, text, images
- Helpful votes
- Vendor reply (if applicable)
- Filter by rating

---

## 7. Gift Finder

### Purpose
Interactive questionnaire to help undecided users find the right gift. Reduces decision paralysis.

### Flow

```
Step 1: Who is this for?
  [Him] [Her] [Parents] [Kids] [Colleagues] [Friends]

Step 2: What's the occasion?
  [Birthday] [Anniversary] [Thank You] [Congratulations] [Just Because]

Step 3: What's your budget?
  [Under ₹500] [₹500-1000] [₹1000-2500] [₹2500-5000] [₹5000+]

Step 4: Delivery when?
  [Today] [Tomorrow] [This Weekend] [I'll Decide Later]

→ Results Page (filtered PLP)
```

### Components
- `GiftFinderWizard` — multi-step form
- `GiftFinderStep` — single step with options
- `GiftFinderOption` — selectable card (icon + label)
- `GiftFinderProgress` — step indicator
- `GiftFinderResults` — filtered product grid

### UX Patterns
- Visual, card-based option selection (not dropdowns).
- Back button to change answers.
- Results load progressively as filters apply.
- "Start Over" option.

### Business Logic
- Each step applies a filter dimension.
- Step 4 checks real-time delivery availability.
- Results personalized if user is logged in.

---

## 8. Occasion Pages

### Purpose
SEO-optimized landing pages for gift occasions. Drive organic traffic and provide curated shopping experiences.

### Page Structure

```
[Hero Banner with Occasion Imagery]
[Occasion Title + Description]
[Top Gift Categories for Occasion]
[Bestsellers for This Occasion]
[Price Range Collections]
[Personalized Options for Occasion]
[Same-Day Delivery for Occasion]
[Tips Section (blog-like content)]
[Customer Reviews for Occasion Products]
[FAQ Section]
```

### Example Pages
- `/occasion/birthday`
- `/occasion/anniversary`
- `/occasion/mothers-day`
- `/occasion/raksha-bandhan`
- `/occasion/diwali`
- `/occasion/valentines-day`
- `/occasion/wedding`

### Components
- `OccasionHero` — full-width editorial banner
- `OccasionCategoryGrid` — category cards specific to occasion
- `OccasionProductCarousel` — curated products
- `OccasionPriceRangeCards` — ₹500, ₹1000, ₹2500, ₹5000+
- `OccasionFAQ` — accordion
- `OccasionSEOContent` — editorial text block

### Business Logic
- Festival pages activate seasonally (Diwali content shows October–November).
- Pricing tiers are curated by merchandising team.
- SEO content updated annually.

---

## 9. Personalization Pages

### Purpose
Dedicated flow for creating customized gifts — photo frames, mugs, cushions, T-shirts, cakes with names.

### Product Types

| Product | Personalization Type |
|---|---|
| Photo Mugs | Image upload |
| Photo Frames | Image upload + text |
| Name Cakes | Text (name) + flavor selection |
| Cushions | Image upload |
| T-Shirts | Text + color |
| Phone Cases | Image upload |
| LED Name Lamps | Text |
| Caricature Gifts | Reference image upload |

### Personalization Flow

```
1. Select Product
2. Upload Image / Enter Text
3. Preview (real-time canvas render)
4. Adjust (crop, position, font, color)
5. Confirm
6. Add to Cart
```

### Components
- `PersonalizationCanvas` — real-time preview renderer
- `ImageUploader` — drag-drop with crop tool
- `TextCustomizer` — font, size, color picker
- `PersonalizationPreview` — final render display
- `PersonalizationConfirm` — disclaimer + confirm CTA

### Business Logic
- Images validated: min resolution 300 DPI, max 10MB.
- Text limited per product spec.
- Custom items have +1–2 day lead time.
- Non-returnable policy shown as disclaimer.

---

## 10. Cart

### Purpose
Review selected items, add-ons, gift options, and proceed to checkout.

### Layout

```
[Cart Title + Item Count]
[Cart Items List]           |  [Order Summary]
  - Image                   |  - Subtotal
  - Name + Variant          |  - Delivery Charge
  - Delivery Date/Type      |  - Coupon Discount
  - Quantity Controls       |  - Total
  - Gift Message Preview    |  - Promo Code Input
  - Edit / Remove           |  - Proceed to Checkout
[Continue Shopping link]    |  [Accepted Payments]
[Recommended Add-ons]
[You May Also Like]
```

### Cart Item Details
- Product thumbnail
- Product name + variant
- Delivery date + time slot
- Recipient address snippet
- Gift message (collapsible preview)
- Greeting card add-on status
- Quantity stepper (min 1)
- Remove button
- Save to Wishlist option

### Promo Code System
- Input field + Apply button
- Shows applied discount line item
- Error messages for invalid/expired codes
- Stacking rules (usually only one active)

### UX Patterns
- **Mini cart** (sidebar drawer) on add-to-cart action.
- **Cart persistence**: Saved to account if logged in; localStorage if guest.
- **Out-of-stock detection**: Flags items that became unavailable.
- **Delivery conflict detection**: Warns if multiple items have conflicting delivery dates.

### Business Logic
- Cart recalculates on every change.
- Delivery charges computed per item (may vary by delivery type).
- Coupon validation happens server-side on apply.
- GST shown separately or included (based on product type).

---

## 11. Checkout

### Purpose
Collect recipient details, delivery preferences, payment — convert cart to order.

### Checkout Steps

```
Step 1: Login / Guest
Step 2: Recipient Details (Name, Phone, Address)
Step 3: Delivery Date & Time Slot
Step 4: Gift Message & Add-ons
Step 5: Review Order
Step 6: Payment
Step 7: Confirmation
```

### Step 2: Recipient Details

| Field | Validation |
|---|---|
| Recipient Name | Required, 2–50 chars |
| Mobile Number | Required, 10-digit Indian |
| Address Line 1 | Required |
| Address Line 2 | Optional |
| Landmark | Optional |
| City | Required |
| State | Required |
| Pincode | Required, validates delivery availability |
| Saved Addresses | Dropdown to select saved address |

### Step 3: Delivery Date & Time Slot
- Calendar widget (blocks unavailable dates)
- Time slot grid: Morning / Afternoon / Evening / Fixed / Midnight
- Slot capacity indicator (Almost Full / Available)
- Delivery charge per slot type

### Step 4: Gift Message
- Textarea (max 150 chars)
- Message templates (quick fill)
- Greeting card selection (add-on)
- Sender name (for card)

### Step 5: Order Review
- All items with delivery details
- Full price breakdown
- Editable (links back to previous steps)

### Step 6: Payment Options

| Method | Provider |
|---|---|
| UPI | GPay, PhonePe, Paytm, BHIM |
| Net Banking | All major banks |
| Credit / Debit Card | Visa, Mastercard, Rupay |
| EMI | Credit card EMI |
| Wallets | Paytm Wallet, Mobikwik |
| COD | Select pincodes only |
| Gift Cards | FNP gift cards |

### Business Logic
- Guest checkout allowed but account creation encouraged post-order.
- Multiple recipients per order (separate items → separate delivery addresses).
- Pincode validates in real time before allowing slot selection.
- Payment gateway: Razorpay / PayU equivalent.
- Order created in `pending` state; confirmed on payment webhook.

---

## 12. Order Tracking

### Purpose
Allow customers and recipients to track order status in real time.

### Tracking States

```
Order Placed → Payment Confirmed → Processing → Packed → Shipped → Out For Delivery → Delivered
```

### Tracking Page Layout

```
[Order ID + Date]
[Tracking Timeline (vertical stepper)]
[Current Status Badge]
[Estimated Delivery Time]
[Delivery Agent Details (name, phone)]
[Map View (if available)]
[Product Summary]
[Support CTA]
```

### Components
- `OrderTimeline` — vertical step tracker
- `DeliveryAgentCard` — agent info + call button
- `OrderTrackingMap` — live map embed
- `OrderStatusBadge` — colored status pill
- `SupportContactBlock` — WhatsApp / Call / Email CTAs

### Business Logic
- Tracking link sent via SMS + Email after dispatch.
- Real-time updates via webhooks from delivery partner.
- Delivery agent location from logistics API.
- Review prompt triggered 24h post-delivery.

---

## 13. User Account

### Purpose
Central hub for order history, saved preferences, addresses, and account settings.

### Account Sections

| Section | Features |
|---|---|
| **Dashboard** | Welcome message, recent orders, quick links |
| **My Orders** | Full order history, filter by status, reorder |
| **Track Order** | Quick tracking lookup |
| **Wishlist** | Saved products, move to cart |
| **Saved Addresses** | CRUD address book |
| **Profile Settings** | Name, email, phone, avatar |
| **Change Password** | Secure password update |
| **Notifications** | Email/SMS/push preferences |
| **My Reviews** | Reviews written, pending reviews |
| **Referrals** | Referral code + earnings |
| **Gift Cards** | Check balance, purchase |
| **Wallet** | FNP credits/cashback |

### UX Patterns
- Sidebar navigation on desktop, tab-based on mobile.
- Breadcrumb within account section.
- Empty states with CTA (e.g., "No orders yet → Shop Now").

---

## 14. Delivery Experience

### Purpose
The core differentiator for a gifting platform — delivery types, timing, and special handling.

### Delivery Types

| Type | Details | Availability |
|---|---|---|
| **Standard Delivery** | Next day or scheduled date | Pan-India |
| **Same Day Delivery** | Order before 3 PM | Metro cities |
| **Midnight Delivery** | 11:30 PM – 12:30 AM | Select cities |
| **Fixed Time Slots** | Morning / Afternoon / Evening | Metro + Tier 1 |
| **Express (3-hour)** | Within 3 hours of ordering | Major metros |
| **International** | 3–7 days | Select countries |

### Delivery Messaging System
- "Order in next **2h 15m** for Same Day Delivery"
- Countdown timer on PDP + cart
- Slot availability indicators
- Dynamic delivery date computation by pincode

### Pincode System
- Database of serviceable pincodes
- Per-pincode: available delivery types, lead time, charges
- Pincode auto-detect via browser geolocation
- Manual pincode entry with save option

### Special Handling
- Fresh flowers: Temperature-controlled packaging note
- Cakes: Handle with care stickers
- Fragile items: Special packaging add-on

---

## 15. Mobile Experience

### Purpose
Mobile-first design — majority of gifting purchases happen on phones (65%+ traffic).

### Mobile-Specific Patterns

| Pattern | Implementation |
|---|---|
| **Bottom Navigation Bar** | Home, Categories, Search, Wishlist, Account |
| **Hamburger Drawer** | Category mega menu in accordion |
| **Bottom Sheet** | Filters, delivery slots, gift messages |
| **Swipe Gestures** | Product image gallery, carousels |
| **Sticky CTA** | "Add to Cart" fixed at bottom of PDP |
| **Tap to Expand** | Product description sections |
| **App Banner** | Smart banner promoting native app |
| **Click-to-Call** | Delivery agent phone number |

### Performance Patterns
- Image lazy loading with blur placeholder
- Skeleton screens instead of spinners
- Reduced animation on slow connections
- PWA offline fallback page

### App Store Links
- Android (Google Play)
- iOS (App Store)
- Smart app banner on mobile browsers

---

## 16. Improvement Opportunities

Where Combovibes should **exceed** FNP:

| Area | FNP Weakness | Combovibes Improvement |
|---|---|---|
| **UI Design** | Cluttered, dated visual design | Premium luxury aesthetic, ample whitespace |
| **Personalization Preview** | Basic text preview | Real-time canvas renderer with professional output |
| **Search** | Basic keyword search | AI-powered semantic search (occasion → products) |
| **Gifting AI** | No recommendation AI | "AI Gift Advisor" chatbot with occasion understanding |
| **Delivery Transparency** | Vague delivery estimates | Live slot availability with capacity indicators |
| **Reviews** | Limited review media | Video reviews, verified purchase badges |
| **Subscription Gifting** | Not available | Monthly flower/gift subscriptions |
| **Corporate Gifting** | Separate site | Integrated corporate portal with bulk ordering |
| **Gift Registry** | Not available | Wedding/birthday gift registry feature |
| **Loyalty Program** | Basic points | Tiered loyalty with experiential rewards |
| **Notifications** | Email only | WhatsApp, push, email + delivery real-time updates |
| **Performance** | Slow load times | Sub-2s LCP with Next.js 15 streaming + ISR |
| **Accessibility** | Poor a11y | WCAG 2.1 AA compliant from day one |
| **Checkout** | Multi-page, high drop-off | Single-page progressive checkout |
| **Order Gifting UX** | Basic gift message box | Animated digital card + QR code for recipient |
