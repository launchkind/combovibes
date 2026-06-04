# 02 — Full Feature Inventory

> **Purpose:** Exhaustive list of every feature required for a production-grade Indian gifting platform. Each feature includes priority, description, and implementation notes.

**Priority Legend:** P0 = Launch blocker | P1 = Core feature | P2 = Growth feature | P3 = Nice-to-have

---

## Table of Contents

1. [Authentication & Identity](#1-authentication--identity)
2. [Customer Features](#2-customer-features)
3. [Gift Features](#3-gift-features)
4. [Product Features](#4-product-features)
5. [Search & Discovery](#5-search--discovery)
6. [Cart & Wishlist](#6-cart--wishlist)
7. [Checkout Features](#7-checkout-features)
8. [Delivery Features](#8-delivery-features)
9. [Payment Features](#9-payment-features)
10. [Order Management (Customer)](#10-order-management-customer)
11. [Review & Rating Features](#11-review--rating-features)
12. [Notification Features](#12-notification-features)
13. [Loyalty & Rewards](#13-loyalty--rewards)
14. [Corporate & Bulk Gifting](#14-corporate--bulk-gifting)
15. [Subscription Gifting](#15-subscription-gifting)
16. [Admin Features](#16-admin-features)
17. [Vendor Features](#17-vendor-features)
18. [CMS Features](#18-cms-features)
19. [Marketing Features](#19-marketing-features)
20. [Analytics & Reporting](#20-analytics--reporting)
21. [SEO & Performance Features](#21-seo--performance-features)
22. [Internationalization](#22-internationalization)

---

## 1. Authentication & Identity

| Feature | Priority | Description |
|---|---|---|
| Email + Password Signup | P0 | Standard registration with email verification |
| OTP Login (Mobile) | P0 | 6-digit OTP via SMS — primary Indian login method |
| Google OAuth | P1 | One-click login via Google account |
| Facebook OAuth | P2 | Login via Facebook |
| Guest Checkout | P0 | Purchase without account creation |
| Account Merge | P1 | Merge guest cart into account on login |
| Forgot Password | P0 | Email-based password reset flow |
| Session Management | P0 | JWT + refresh token with 30-day remember-me |
| Account Deletion | P1 | GDPR/IT Act compliant account deletion |
| Two-Factor Authentication | P2 | Optional 2FA via TOTP or SMS |
| Profile Picture Upload | P2 | Avatar upload via Supabase Storage |
| Phone Number Verification | P1 | Verify phone for delivery notifications |

---

## 2. Customer Features

| Feature | Priority | Description |
|---|---|---|
| User Dashboard | P0 | Central account hub with quick stats |
| Order History | P0 | Full paginated order list with filters |
| Order Detail View | P0 | Complete order breakdown with tracking |
| Reorder | P1 | One-click reorder of previous purchase |
| Address Book | P0 | Save multiple delivery addresses (home, work, other) |
| Default Address | P0 | Set primary delivery address |
| Profile Management | P0 | Update name, email, phone, DOB |
| Notification Preferences | P1 | Toggle email, SMS, push per event type |
| My Reviews | P1 | View and manage submitted reviews |
| Referral Program | P2 | Unique referral link + reward tracking |
| Wallet / Credits | P1 | Platform credits earned via referrals/cashback |
| Gift Card Balance | P1 | Check and apply FNP-equivalent gift card |
| Saved Payment Methods | P2 | Tokenized card storage (PCI-compliant) |
| Recently Viewed | P1 | Last 20 viewed products |
| Browse History | P2 | Full browsing history for personalization |

---

## 3. Gift Features

| Feature | Priority | Description |
|---|---|---|
| Gift Message | P0 | Text message included with delivery (max 150 chars) |
| Digital Greeting Card | P1 | Animated e-card sent to recipient via WhatsApp/SMS |
| Physical Greeting Card | P0 | Printed card included in package with custom message |
| Personalized Text on Gift | P0 | Name/message printed/engraved on product |
| Photo Personalization | P0 | Upload image printed on mug, cushion, frame, etc. |
| Real-Time Preview | P0 | Canvas renderer showing personalization result |
| Font Selection | P1 | Choose font for text personalization |
| Color Selection | P1 | Choose text/accent color |
| Image Crop & Position | P0 | Adjust uploaded photo placement |
| Premium Gift Wrapping | P1 | Add elegant wrapping (priced add-on) |
| Gift Box Upgrade | P1 | Upgrade packaging to premium box |
| Balloon Add-on | P1 | Add balloon bouquet to delivery |
| Candle Add-on | P1 | Scented candles as add-on |
| Soft Toy Add-on | P1 | Teddy bear or plush toy as add-on |
| Chocolate Box Add-on | P0 | Chocolate selection as add-on |
| Combo Builder | P2 | Build custom gift combos from product catalog |
| Gift Registry | P3 | Wedding/birthday wish list shared with friends |
| Anonymous Gifting | P2 | Hide sender name (surprise gift mode) |
| Scheduled Send | P1 | Schedule digital card/notification for specific date |
| QR Gift Reveal | P2 | Recipient scans QR to reveal sender & message |
| Video Message | P2 | Short video message attached to order |

---

## 4. Product Features

| Feature | Priority | Description |
|---|---|---|
| Product Catalog | P0 | Full product database with images, descriptions |
| Product Variants | P0 | Size, weight, color, flavor, count variants |
| Variant Pricing | P0 | Different price per variant |
| Variant Images | P0 | Images change on variant selection |
| Product Badges | P0 | Bestseller, New, Sale, Express, Personalizable |
| Stock Management | P0 | Real-time inventory with low-stock alerts |
| Out of Stock Handling | P0 | OOS overlay + Notify Me button |
| Product Gallery | P0 | Multiple images + zoom + swipe |
| Product Video | P1 | Embedded product demo video |
| 360° View | P3 | Interactive 3D product view |
| Product Description | P0 | Rich text description with formatting |
| Care Instructions | P1 | Flower care, cake storage, etc. |
| Delivery Lead Time | P0 | Per-product delivery timing metadata |
| Weight & Dimensions | P1 | Shipping metadata |
| Product Tags | P0 | For search and filtering |
| Product SEO | P0 | Meta title, description, structured data |
| Related Products | P1 | Algorithm-driven related item suggestions |
| Frequently Bought Together | P1 | Bundle suggestion on PDP |
| Recently Viewed | P1 | Shown at bottom of PDP |
| Product Comparison | P3 | Compare up to 3 products |
| Product Q&A | P2 | Customer questions and merchant answers |
| Occasion Mapping | P0 | Link products to occasions |
| Recipient Mapping | P0 | Tag products by recipient (him/her/parents/kids) |

---

## 5. Search & Discovery

| Feature | Priority | Description |
|---|---|---|
| Full-Text Search | P0 | Search by product name, description, tags |
| Instant Suggestions | P0 | Debounced autocomplete dropdown |
| Trending Searches | P1 | Curated popular search terms on focus |
| Recent Searches | P1 | LocalStorage-persisted search history |
| Category Scoping | P1 | Search within a specific category |
| Occasion-Based Search | P0 | "Birthday gifts", "anniversary gifts" intent |
| Zero-Results Fallback | P0 | Curated "You might like" section |
| Search Analytics | P1 | Track queries, click-throughs, conversions |
| Filter System | P0 | Price, delivery type, occasion, rating, category |
| Sort Options | P0 | Relevance, price, rating, newest, bestseller |
| Faceted Search | P1 | Multi-filter combination with URL persistence |
| AI Semantic Search | P2 | NLP-based search understanding intent |
| Voice Search | P2 | Mobile voice input for search |
| Visual Search | P3 | Search by uploading a product image |
| Gift Finder Wizard | P1 | Multi-step questionnaire → filtered results |
| Personalized Results | P1 | Ranking adjusted by user browse/purchase history |
| Promoted Listings | P2 | Vendor-paid product placement in search |

---

## 6. Cart & Wishlist

| Feature | Priority | Description |
|---|---|---|
| Add to Cart | P0 | From PDP, PLP (quick add), and recommendations |
| Cart Persistence | P0 | Saved to server (logged-in) or localStorage (guest) |
| Cart Merge on Login | P0 | Merge guest cart into account cart |
| Quantity Update | P0 | Stepper controls in cart |
| Remove from Cart | P0 | Delete item from cart |
| Save to Wishlist from Cart | P1 | Move item to wishlist |
| Cart Add-ons | P0 | Greeting card, wrapping, extras per item |
| Gift Message per Item | P0 | Individual message for each cart item |
| Delivery Date per Item | P0 | Each item can have different delivery date |
| Cart Price Breakdown | P0 | Subtotal, delivery, discount, GST, total |
| Mini Cart Drawer | P1 | Slide-in cart preview on add-to-cart |
| Multiple Recipients | P1 | Different delivery addresses per cart item |
| Cart Recommendations | P1 | "You might also like" section |
| Wishlist | P0 | Save products for later |
| Wishlist Sharing | P2 | Share wishlist URL with others |
| Move to Cart from Wishlist | P0 | One-click add to cart |
| Wishlist Price Alerts | P2 | Notify when wishlist item goes on sale |
| Out-of-Stock Warning | P0 | Flag unavailable items in cart |
| Delivery Conflict Warning | P0 | Alert if items have conflicting delivery requirements |

---

## 7. Checkout Features

| Feature | Priority | Description |
|---|---|---|
| Single-Page Checkout | P0 | Progressive disclosure on one page |
| Guest Checkout | P0 | No forced account creation |
| Login During Checkout | P0 | Auth modal without losing cart state |
| Address Autocomplete | P1 | Google Places API for address entry |
| Saved Address Selection | P0 | Pick from address book |
| Pincode Validation | P0 | Real-time delivery availability check |
| Delivery Date Picker | P0 | Calendar with available dates |
| Delivery Time Slot | P0 | Morning / Afternoon / Evening / Midnight |
| Slot Availability | P0 | Show remaining capacity per slot |
| Gift Message in Checkout | P0 | Edit/add gift message |
| Greeting Card Selection | P0 | Choose from templates |
| Order Review Step | P0 | Final summary before payment |
| Promo Code Application | P0 | Input + apply + validate coupon |
| Loyalty Points Redemption | P1 | Apply earned points to reduce total |
| Wallet Balance Application | P1 | Use platform credits |
| Gift Card Application | P1 | Apply gift card balance |
| Order Notes | P1 | Special instructions for delivery |
| Checkout Progress Bar | P0 | Visual step indicator |
| Auto-Save Progress | P1 | Resume abandoned checkout |
| Checkout Analytics | P1 | Track drop-off at each step |

---

## 8. Delivery Features

| Feature | Priority | Description |
|---|---|---|
| Same Day Delivery | P0 | Order before cutoff → delivered today |
| Standard Delivery | P0 | Scheduled date delivery |
| Midnight Delivery | P0 | 11:30 PM – 12:30 AM slot |
| Fixed Time Slots | P0 | Morning / Afternoon / Evening windows |
| Express 3-Hour Delivery | P1 | Ultra-fast local delivery |
| Pincode Serviceability | P0 | Database of serviceable pincodes |
| Delivery Charge Calculation | P0 | Variable by type, distance, product |
| Free Delivery Threshold | P1 | Free delivery above ₹X order value |
| Delivery Countdown Timer | P0 | "Order in X hours for same-day" |
| Geolocation Detection | P1 | Auto-detect user city |
| Multi-City Order | P1 | Send gifts to multiple cities in one order |
| International Delivery | P2 | Delivery to select countries |
| Track Delivery Agent | P2 | Live GPS location of agent |
| Delivery Rescheduling | P1 | Change delivery date after order placed |
| Leave at Door Option | P1 | Contactless delivery instruction |
| Recipient Availability Check | P2 | Optional: confirm recipient availability via SMS |

---

## 9. Payment Features

| Feature | Priority | Description |
|---|---|---|
| UPI Payment | P0 | GPay, PhonePe, Paytm, BHIM, generic UPI |
| Credit Card | P0 | Visa, Mastercard, Amex, Rupay |
| Debit Card | P0 | All major bank debit cards |
| Net Banking | P0 | All major Indian banks |
| Wallets | P1 | Paytm, Mobikwik, Amazon Pay |
| EMI | P1 | Credit card EMI (3/6/12 months) |
| Buy Now Pay Later | P2 | Simpl, LazyPay, ZestMoney |
| Cash on Delivery | P1 | Select pincodes with COD surcharge |
| Gift Cards | P1 | Platform-issued gift cards |
| Loyalty Points | P1 | Redeem points at checkout |
| Wallet Credits | P1 | Platform cashback credits |
| Payment Retry | P0 | Re-attempt failed payment without re-entering details |
| Payment Receipt | P0 | Email + downloadable PDF invoice |
| Refund Processing | P0 | Automated refund to original payment method |
| GST Invoice | P0 | GST-compliant tax invoice for B2B |
| PCI Compliance | P0 | Payment data handled by gateway, not stored |
| 3D Secure | P0 | OTP verification for card payments |

---

## 10. Order Management (Customer)

| Feature | Priority | Description |
|---|---|---|
| Order Confirmation | P0 | Immediate email + SMS post-payment |
| Order Tracking Page | P0 | Public tracking via order ID |
| Order Status Timeline | P0 | Visual step-by-step progress |
| Order Cancellation | P0 | Cancel before processing with refund |
| Order Modification | P1 | Change address/date before dispatch |
| Partial Order Cancellation | P1 | Cancel individual items in multi-item order |
| Return Request | P1 | Initiate return (non-personalized items) |
| Refund Status | P0 | Track refund progress |
| Delivery Agent Details | P1 | Name + phone number of agent |
| Review Prompt | P1 | Post-delivery review request |
| Download Invoice | P1 | PDF invoice download |
| Reorder | P1 | One-click reorder |
| Share Order Status | P2 | Share tracking link with gift recipient |

---

## 11. Review & Rating Features

| Feature | Priority | Description |
|---|---|---|
| Star Rating | P0 | 1–5 star rating per product |
| Written Review | P0 | Text review with character limits |
| Photo Review | P1 | Upload delivery photos with review |
| Video Review | P2 | Short video review upload |
| Review Moderation | P0 | Admin approval before publishing |
| Verified Purchase Badge | P0 | Only buyers can review |
| Helpful Votes | P1 | "Was this helpful?" on reviews |
| Review Sorting | P1 | Most Recent, Most Helpful, Top Rated |
| Review Filtering | P1 | Filter by star rating |
| Vendor Reply | P1 | Vendor/admin response to reviews |
| Review Summary | P0 | Average rating + distribution bars |
| Review Incentive | P2 | Loyalty points for submitting reviews |
| Review Highlights | P1 | AI-extracted key phrases from reviews |

---

## 12. Notification Features

| Feature | Priority | Description |
|---|---|---|
| Order Confirmation Email | P0 | Full order details |
| Order Confirmation SMS | P0 | Brief confirmation with order ID |
| Dispatch Notification | P0 | "Your order has been dispatched" |
| Out for Delivery SMS | P0 | "Arriving today" notification |
| Delivered Confirmation | P0 | Delivery success notification |
| WhatsApp Notifications | P1 | Rich notifications via WhatsApp Business API |
| Push Notifications (Web) | P1 | Browser push via Firebase |
| Push Notifications (App) | P2 | Native app push |
| Wishlist Price Alert | P2 | Item price drop notification |
| Back in Stock Alert | P1 | OOS product restocked notification |
| Festival Reminders | P1 | "Mother's Day is in 3 days" nudge |
| Abandoned Cart Reminder | P1 | Recovery email/SMS after 1 hour |
| Review Request | P1 | Post-delivery review prompt (24h after) |
| Promotional Emails | P1 | Festival offers, new collections |
| Unsubscribe Management | P0 | One-click unsubscribe (legal requirement) |

---

## 13. Loyalty & Rewards

| Feature | Priority | Description |
|---|---|---|
| Points Earning | P1 | Earn points on purchases (1 point = ₹1 spend) |
| Points Redemption | P1 | Apply points at checkout |
| Tier System | P2 | Silver / Gold / Platinum tiers |
| Tier Benefits | P2 | Free delivery, priority support, exclusive access |
| Referral Rewards | P1 | Points for referring new customers |
| Review Rewards | P2 | Points for submitting reviews |
| Birthday Bonus | P2 | Extra points on user's birthday |
| Cashback Offers | P1 | % cashback to wallet on specific purchases |
| Points Expiry | P1 | Points expire after 12 months |
| Points History | P1 | Transaction log of earned/redeemed points |
| Gamification | P3 | Badges, streaks, milestone rewards |

---

## 14. Corporate & Bulk Gifting

| Feature | Priority | Description |
|---|---|---|
| Corporate Account | P2 | Separate corporate login with GST billing |
| Bulk Order Pricing | P2 | Tiered discounts for volume orders |
| Custom Branding | P2 | Company logo on packaging/cards |
| Employee Gift Management | P2 | Upload employee list, send gifts in bulk |
| Corporate Catalog | P2 | Curated products suitable for corporate gifting |
| GST Invoice | P0 | Mandatory for corporate purchases |
| Payment Terms | P3 | Net 30 invoicing for large accounts |
| Dedicated Account Manager | P3 | Human support for enterprise clients |
| Gift Voucher Bulk Purchase | P2 | Buy gift cards in bulk |
| Reporting | P2 | Order and spend reports for corporate |

---

## 15. Subscription Gifting

| Feature | Priority | Description |
|---|---|---|
| Monthly Flower Subscription | P2 | Fresh flowers delivered monthly |
| Subscription Plans | P2 | Weekly, fortnightly, monthly |
| Subscription Management | P2 | Pause, skip, cancel subscription |
| Subscription Billing | P2 | Auto-charge on renewal date |
| Customization per Delivery | P2 | Change product/message each cycle |
| Gift a Subscription | P2 | Purchase subscription as gift for someone else |
| Subscription Analytics | P2 | Retention, churn, revenue reporting |

---

## 16. Admin Features

| Feature | Priority | Description |
|---|---|---|
| Admin Dashboard | P0 | KPI widgets, revenue charts, recent orders |
| Product Management | P0 | Full CRUD for products, variants, images |
| Category Management | P0 | Manage categories, subcategories, occasions |
| Order Management | P0 | View, process, update, cancel orders |
| Customer Management | P1 | View, edit, suspend customers |
| Vendor Management | P1 | Approve, manage, pay vendors |
| Coupon Management | P0 | Create, edit, disable coupons |
| Delivery Slot Management | P0 | Configure slots, capacity, charges |
| CMS Management | P0 | Edit banners, homepages, landing pages |
| Review Moderation | P0 | Approve/reject product reviews |
| Inventory Management | P0 | Stock levels, alerts, restock |
| Reports & Analytics | P0 | Revenue, orders, products, customers |
| Role-Based Access Control | P0 | Granular permissions per admin role |
| Audit Logs | P1 | Track all admin actions |
| Email/SMS Templates | P1 | Edit notification templates |
| SEO Management | P1 | Meta tags, sitemaps, redirects |
| Payment Settings | P0 | Gateway configuration |
| Tax/GST Configuration | P0 | GST rates per category |
| Shipping Configuration | P0 | Delivery partners, charges |

---

## 17. Vendor Features

| Feature | Priority | Description |
|---|---|---|
| Vendor Registration | P1 | Apply to become a vendor |
| Vendor Dashboard | P1 | Sales, orders, earnings summary |
| Product Upload | P1 | Add products with images and details |
| Inventory Management | P1 | Update stock levels |
| Order Fulfillment | P1 | Accept, process, mark orders as packed |
| Order History | P1 | View vendor's order history |
| Earnings Reports | P1 | Revenue, commission, payout reports |
| Payout Management | P1 | Bank details, payout schedule |
| Vendor Profile | P1 | Business details, logo, contact |
| Commission Structure | P1 | Platform fee per category |
| Performance Metrics | P2 | Rating, fulfillment rate, return rate |
| Support Tickets | P2 | Raise issues with admin |

---

## 18. CMS Features

| Feature | Priority | Description |
|---|---|---|
| Homepage Banner Management | P0 | Add/edit/reorder hero banners |
| Featured Collections | P0 | Curate product collections for homepage |
| Occasion Page Builder | P1 | Build custom content for festival pages |
| Blog/Editorial | P2 | Gifting guides, flower care tips |
| FAQ Management | P1 | Dynamic FAQ builder |
| SEO Page Builder | P2 | Landing pages for SEO keywords |
| Pop-up Management | P1 | Promotional pop-ups with scheduling |
| Announcement Bar | P0 | Edit the top promotional bar |
| Redirect Management | P1 | 301/302 URL redirects |
| Media Library | P0 | Centralized image/video asset management |

---

## 19. Marketing Features

| Feature | Priority | Description |
|---|---|---|
| Email Campaign Manager | P1 | Create and send marketing emails |
| SMS Campaigns | P1 | Bulk SMS for promotions |
| WhatsApp Campaigns | P2 | WhatsApp Business API marketing |
| Push Notification Campaigns | P2 | Web push marketing |
| Coupon Engine | P0 | Discount codes with complex rules |
| Flash Sales | P1 | Time-limited price reductions |
| Abandoned Cart Recovery | P1 | Automated multi-step recovery |
| Wishlist Retargeting | P2 | Remind users of wishlisted items |
| Festival Campaign Calendar | P1 | Plan campaigns around Indian festivals |
| Referral Program | P1 | Customer referral with tracking |
| Affiliate Program | P3 | External affiliate link tracking |
| Google Shopping Feed | P1 | Product feed for Google Shopping ads |
| Facebook Pixel | P1 | Conversion tracking for Meta ads |
| UTM Tracking | P0 | Campaign attribution |

---

## 20. Analytics & Reporting

| Feature | Priority | Description |
|---|---|---|
| Revenue Dashboard | P0 | Daily/weekly/monthly revenue |
| Order Analytics | P0 | Order volume, AOV, conversion rate |
| Product Analytics | P0 | Top sellers, low performers, views |
| Category Analytics | P1 | Category revenue and trends |
| Customer Analytics | P1 | LTV, acquisition, retention, churn |
| Search Analytics | P1 | Search queries, zero results, conversions |
| Funnel Analytics | P1 | Drop-off at each checkout step |
| Delivery Analytics | P1 | On-time rate, delivery failures |
| Vendor Analytics | P2 | Vendor performance comparison |
| Coupon Analytics | P1 | Redemption rate, revenue impact |
| Marketing ROI | P2 | Campaign attribution and return |
| Export Reports | P1 | CSV/Excel/PDF export |
| Custom Date Ranges | P0 | Flexible date filtering |
| Real-time Dashboard | P1 | Live order and revenue monitoring |
| Google Analytics 4 | P0 | GA4 integration for web analytics |
| Mixpanel / Amplitude | P2 | Advanced behavioral analytics |

---

## 21. SEO & Performance Features

| Feature | Priority | Description |
|---|---|---|
| Dynamic Sitemap | P0 | Auto-generated XML sitemap |
| Robots.txt | P0 | Crawl configuration |
| Structured Data | P0 | Product, Review, BreadcrumbList schemas |
| Open Graph Tags | P0 | Social sharing meta tags |
| Canonical URLs | P0 | Prevent duplicate content |
| ISR (Incremental Static Regen) | P0 | Next.js ISR for product/category pages |
| Image Optimization | P0 | Next.js Image with WebP, AVIF |
| Core Web Vitals | P0 | Target LCP < 2.5s, CLS < 0.1, FID < 100ms |
| URL Structure | P0 | Clean, keyword-rich URLs |
| Pagination SEO | P1 | rel="next/prev" or separate URLs |
| Breadcrumb Schema | P0 | Structured breadcrumb data |
| Local SEO | P1 | City-specific pages (e.g., /flowers-in-mumbai) |
| Page Speed | P0 | 90+ Lighthouse score |
| CDN | P0 | Static assets on CDN (Vercel/CloudFront) |
| Lazy Loading | P0 | Images and components lazy loaded |

---

## 22. Internationalization

| Feature | Priority | Description |
|---|---|---|
| Hindi Language Support | P2 | Basic Hindi UI translations |
| Currency Display | P0 | INR formatting throughout |
| International Delivery | P2 | USD/GBP pricing for international orders |
| International Payment | P2 | Stripe for international cards |
| Time Zone Handling | P0 | IST for all delivery slots |
| Phone Format Validation | P0 | +91 Indian format |
| Address Format | P0 | Indian address format (pincode, state) |
| GST Compliance | P0 | Correct GST rates by product category |
