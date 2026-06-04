# 04 — Screen Inventory

> **Purpose:** Complete inventory of every screen in the Combovibes platform, with components, API requirements, and permission levels for each.

**Auth Levels:** `public` | `guest` | `customer` | `vendor` | `admin` | `super_admin`

---

## Table of Contents

1. [Public / Marketing Screens](#1-public--marketing-screens)
2. [Product Discovery Screens](#2-product-discovery-screens)
3. [Product Screens](#3-product-screens)
4. [Cart & Checkout Screens](#4-cart--checkout-screens)
5. [Authentication Screens](#5-authentication-screens)
6. [Customer Account Screens](#6-customer-account-screens)
7. [Admin Panel Screens](#7-admin-panel-screens)
8. [Vendor Panel Screens](#8-vendor-panel-screens)
9. [Error & Utility Screens](#9-error--utility-screens)

---

## 1. Public / Marketing Screens

### 1.1 Homepage

| Attribute | Details |
|---|---|
| **URL** | `/` |
| **Auth** | public |
| **Purpose** | Primary discovery + conversion landing page |
| **Key Components** | `HeroCarousel`, `CategoryStrip`, `OccasionChips`, `DeliveryBanner`, `ProductCarousels`, `PersonalizationBanner`, `ReviewCarousel`, `AppDownloadBanner`, `Footer` |
| **API Requirements** | `GET /api/homepage` (banners, featured products, occasions), `GET /api/delivery/check?pincode=X`, `GET /api/products?featured=true&limit=12` |
| **State** | User location/pincode, active promotions |

### 1.2 Occasion Landing Page

| Attribute | Details |
|---|---|
| **URL** | `/occasion/[slug]` |
| **Auth** | public |
| **Purpose** | SEO-optimized occasion hub |
| **Key Components** | `OccasionHero`, `OccasionCategoryGrid`, `ProductCarousel`, `PriceRangeCards`, `ReviewHighlights`, `OccasionFAQ`, `SEOContent` |
| **API Requirements** | `GET /api/occasions/[slug]`, `GET /api/products?occasion=[slug]&limit=20` |

### 1.3 Collection Page

| Attribute | Details |
|---|---|
| **URL** | `/collection/[slug]` |
| **Auth** | public |
| **Purpose** | Editorially curated product collection |
| **Key Components** | `CollectionHero`, `CollectionProductGrid`, `SortBar` |
| **API Requirements** | `GET /api/collections/[slug]` |

### 1.4 Brand Landing Page

| Attribute | Details |
|---|---|
| **URL** | `/brands/[slug]` |
| **Auth** | public |
| **Purpose** | Brand-specific product showcase |
| **Key Components** | `BrandHero`, `BrandProductGrid`, `BrandStory` |
| **API Requirements** | `GET /api/brands/[slug]`, `GET /api/products?brand=[slug]` |

### 1.5 Gift Finder Wizard

| Attribute | Details |
|---|---|
| **URL** | `/gift-finder` |
| **Auth** | public |
| **Purpose** | Guide undecided users to the right gift |
| **Key Components** | `GiftFinderStepper`, `GiftFinderOptionCards`, `GiftFinderResults` |
| **API Requirements** | `GET /api/products?[filters from wizard]` |

### 1.6 Corporate Gifting Hub

| Attribute | Details |
|---|---|
| **URL** | `/corporate` |
| **Auth** | public |
| **Purpose** | B2B landing page, lead capture |
| **Key Components** | `CorporateHero`, `CorporateBenefitCards`, `CorporateProductGrid`, `CorporateEnquiryForm` |
| **API Requirements** | `POST /api/corporate/enquiry` |

### 1.7 International Delivery Page

| Attribute | Details |
|---|---|
| **URL** | `/international`, `/international/[country]` |
| **Auth** | public |
| **Purpose** | Cross-border gifting hub |
| **Key Components** | `CountrySelector`, `CountryProductGrid`, `DeliveryInfoBlock` |
| **API Requirements** | `GET /api/delivery/international`, `GET /api/products?country=[slug]` |

### 1.8 Blog / Gift Guides

| Attribute | Details |
|---|---|
| **URL** | `/blog`, `/blog/[slug]` |
| **Auth** | public |
| **Key Components** | `BlogPostCard`, `BlogPostContent`, `RelatedPosts`, `AuthorCard` |
| **API Requirements** | `GET /api/blog`, `GET /api/blog/[slug]` |

### 1.9 Static Pages

| Page | URL | Components |
|---|---|---|
| About Us | `/about` | `AboutHero`, `TeamSection`, `MilestoneTimeline` |
| Contact Us | `/contact` | `ContactForm`, `OfficeMap`, `SupportChannels` |
| FAQ | `/faq` | `FAQAccordion`, `FAQSearch` |
| Careers | `/careers` | `JobListings`, `CultureBlock` |
| Privacy Policy | `/privacy-policy` | `LegalContent` |
| Terms of Service | `/terms-of-service` | `LegalContent` |
| Refund Policy | `/refund-policy` | `LegalContent` |
| Shipping Policy | `/shipping-policy` | `LegalContent` |

---

## 2. Product Discovery Screens

### 2.1 Category Product Listing Page (PLP)

| Attribute | Details |
|---|---|
| **URL** | `/category/[slug]`, `/category/[parent]/[child]` |
| **Auth** | public |
| **Purpose** | Browse products within a category |
| **Key Components** | `Breadcrumb`, `CategoryHero`, `FilterSidebar`, `SortDropdown`, `ProductGrid`, `ProductCard`, `ActiveFilterPills`, `Pagination`, `EmptyState` |
| **API Requirements** | `GET /api/products?category=[slug]&sort=X&page=X&filters=X` |
| **Filter State** | URL query params (shareable) |

### 2.2 Search Results Page

| Attribute | Details |
|---|---|
| **URL** | `/search?q=[query]&[filters]` |
| **Auth** | public |
| **Purpose** | Display search results |
| **Key Components** | `SearchQuery`, `ResultCount`, `FilterSidebar`, `SortDropdown`, `ProductGrid`, `ZeroResultState`, `SearchSuggestions` |
| **API Requirements** | `GET /api/search?q=[query]&[filters]` |

### 2.3 Delivery-Type PLPs

| Screen | URL | Unique Component |
|---|---|---|
| Same Day Delivery | `/gifts/same-day-delivery` | `DeliveryCountdown` |
| Midnight Delivery | `/gifts/midnight-delivery` | `MidnightBadge` |
| Express Delivery | `/gifts/express-delivery` | `ExpressTimeBadge` |

### 2.4 Budget PLPs

| Screen | URL |
|---|---|
| Gifts Under ₹500 | `/gifts/under-500` |
| Gifts Under ₹1000 | `/gifts/under-1000` |
| Gifts Under ₹2500 | `/gifts/under-2500` |
| Gifts Under ₹5000 | `/gifts/under-5000` |

### 2.5 Recipient PLPs

| Screen | URL |
|---|---|
| Gifts for Her | `/gifts/for-her` |
| Gifts for Him | `/gifts/for-him` |
| Gifts for Parents | `/gifts/for-parents` |
| Gifts for Kids | `/gifts/for-kids` |
| Gifts for Colleagues | `/gifts/for-colleagues` |

---

## 3. Product Screens

### 3.1 Product Detail Page (PDP)

| Attribute | Details |
|---|---|
| **URL** | `/products/[slug]` |
| **Auth** | public |
| **Purpose** | Convert product interest to cart add |
| **Key Components** | `Breadcrumb`, `ProductGallery`, `ProductInfo`, `VariantSelector`, `DeliveryDatePicker`, `DeliveryTypeSelector`, `PincodeChecker`, `GiftMessageInput`, `AddOnSelector`, `QuantitySelector`, `AddToCartButton`, `BuyNowButton`, `WishlistButton`, `ProductDescriptionTabs`, `ReviewsSection`, `RelatedProductsCarousel`, `RecentlyViewedCarousel` |
| **API Requirements** | `GET /api/products/[slug]`, `GET /api/delivery/slots?pincode=X&product=X&date=X`, `GET /api/products/[slug]/reviews` |
| **State** | Selected variant, selected date, selected slot, pincode, personalization data |

### 3.2 Personalization Flow

| Attribute | Details |
|---|---|
| **URL** | `/products/[slug]/personalize` |
| **Auth** | public (save requires auth) |
| **Purpose** | Custom product creation interface |
| **Key Components** | `PersonalizationCanvas`, `ImageUploader`, `ImageCropTool`, `TextCustomizer`, `FontPicker`, `ColorPicker`, `PersonalizationPreview`, `PersonalizationConfirmDialog` |
| **API Requirements** | `POST /api/personalization/preview`, `POST /api/personalization/save` |

### 3.3 Product Personalization Hub

| Attribute | Details |
|---|---|
| **URL** | `/personalized-gifts` |
| **Auth** | public |
| **Purpose** | Discovery page for all personalizable products |
| **Key Components** | `PersonalizationHero`, `ProductTypeCards`, `PersonalizationExampleGrid` |
| **API Requirements** | `GET /api/products?personalizable=true` |

---

## 4. Cart & Checkout Screens

### 4.1 Cart Page

| Attribute | Details |
|---|---|
| **URL** | `/cart` |
| **Auth** | guest/customer |
| **Purpose** | Review cart, apply discounts, proceed to checkout |
| **Key Components** | `CartItemList`, `CartItem`, `CartItemAddOns`, `GiftMessagePreview`, `DeliveryDateChip`, `QuantityStepper`, `RemoveButton`, `SaveToWishlistButton`, `OrderSummary`, `PromoCodeInput`, `WalletToggle`, `LoyaltyPointsToggle`, `CheckoutButton`, `CartRecommendations`, `EmptyCartState` |
| **API Requirements** | `GET /api/cart`, `PATCH /api/cart/[item-id]`, `DELETE /api/cart/[item-id]`, `POST /api/cart/coupon`, `DELETE /api/cart/coupon` |

### 4.2 Mini Cart (Drawer)

| Attribute | Details |
|---|---|
| **Trigger** | Add to cart action, cart icon click |
| **Auth** | guest/customer |
| **Key Components** | `MiniCartDrawer`, `MiniCartItem`, `MiniCartSummary`, `ViewCartButton`, `CheckoutButton` |
| **API Requirements** | Same as Cart Page (subset) |

### 4.3 Checkout Page

| Attribute | Details |
|---|---|
| **URL** | `/checkout` |
| **Auth** | guest/customer |
| **Purpose** | Single-page progressive checkout |
| **Key Components** | `CheckoutProgressBar`, `LoginStep`, `RecipientDetailsForm`, `AddressAutocomplete`, `SavedAddressSelector`, `DeliveryDateCalendar`, `DeliverySlotGrid`, `GiftMessageStep`, `GreetingCardSelector`, `OrderReviewStep`, `PaymentStep`, `UPIPayment`, `CardPayment`, `NetBankingSelector`, `WalletPayment`, `CODOption`, `OrderSummarySticky` |
| **API Requirements** | `GET /api/delivery/slots`, `POST /api/orders`, `POST /api/payment/initiate`, `POST /api/payment/verify` |

### 4.4 Order Confirmation Screen

| Attribute | Details |
|---|---|
| **URL** | `/checkout/success?order_id=[id]` |
| **Auth** | guest/customer |
| **Purpose** | Post-purchase confirmation and delight |
| **Key Components** | `OrderSuccessAnimation`, `OrderIdDisplay`, `OrderSummaryCard`, `DeliveryDetailCard`, `GiftMessagePreview`, `NextStepsBlock`, `TrackOrderCTA`, `ShareOrderButton`, `CrossSellCarousel` |
| **API Requirements** | `GET /api/orders/[id]` |

### 4.5 Payment Failed Screen

| Attribute | Details |
|---|---|
| **URL** | `/checkout/failed?order_id=[id]` |
| **Key Components** | `PaymentFailedIllustration`, `ErrorMessage`, `RetryPaymentButton`, `ContactSupportBlock` |
| **API Requirements** | `GET /api/orders/[id]`, `POST /api/payment/retry` |

---

## 5. Authentication Screens

### 5.1 Login Page

| Attribute | Details |
|---|---|
| **URL** | `/auth/login` |
| **Auth** | public |
| **Key Components** | `LoginForm` (email+password), `OTPLoginTab`, `GoogleOAuthButton`, `ForgotPasswordLink`, `SignupRedirectLink` |
| **API Requirements** | `POST /api/auth/login`, `POST /api/auth/otp/send`, `POST /api/auth/otp/verify` |

### 5.2 Signup Page

| Attribute | Details |
|---|---|
| **URL** | `/auth/signup` |
| **Auth** | public |
| **Key Components** | `SignupForm`, `GoogleOAuthButton`, `TermsCheckbox`, `LoginRedirectLink` |
| **API Requirements** | `POST /api/auth/signup`, `POST /api/auth/verify-email` |

### 5.3 OTP Verification Screen

| Attribute | Details |
|---|---|
| **URL** | `/auth/verify-otp` |
| **Key Components** | `OTPInputGrid`, `ResendOTPButton`, `OTPTimer`, `BackButton` |
| **API Requirements** | `POST /api/auth/otp/verify`, `POST /api/auth/otp/resend` |

### 5.4 Forgot / Reset Password

| URLs | `/auth/forgot-password`, `/auth/reset-password?token=X` |
|---|---|
| **Key Components** | `EmailInput`, `NewPasswordForm`, `PasswordStrengthMeter` |
| **API Requirements** | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |

---

## 6. Customer Account Screens

### 6.1 Account Dashboard

| Attribute | Details |
|---|---|
| **URL** | `/account/dashboard` |
| **Auth** | customer |
| **Key Components** | `WelcomeBanner`, `QuickStats` (orders, wishlist, wallet), `RecentOrderCards`, `QuickLinks`, `NotificationBanner` |
| **API Requirements** | `GET /api/account/summary` |

### 6.2 Order History

| URL | `/account/orders` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `OrderFilterTabs`, `OrderCard`, `OrderStatusBadge`, `OrderSearchInput`, `Pagination` |
| **API Requirements** | `GET /api/account/orders?status=X&page=X` |

### 6.3 Order Detail / Tracking

| URL | `/account/orders/[id]` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `OrderTimeline`, `OrderItemList`, `DeliveryDetailCard`, `GiftMessageDisplay`, `CancellationBlock`, `ReturnBlock`, `DownloadInvoiceButton`, `ReorderButton`, `WriteReviewCTA` |
| **API Requirements** | `GET /api/orders/[id]`, `POST /api/orders/[id]/cancel`, `POST /api/orders/[id]/return` |

### 6.4 Public Order Tracking

| URL | `/track/[order-id]` | **Auth** | public |
|---|---|---|---|
| **Key Components** | `OrderTimeline`, `StatusBadge`, `DeliveryAgentCard`, `ProductSummary`, `SupportCTA` |
| **API Requirements** | `GET /api/orders/[id]/track` (limited public data) |

### 6.5 Wishlist

| URL | `/account/wishlist` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `WishlistProductGrid`, `WishlistProductCard`, `MoveToCartButton`, `RemoveFromWishlistButton`, `ShareWishlistButton`, `EmptyWishlistState` |
| **API Requirements** | `GET /api/wishlist`, `DELETE /api/wishlist/[id]`, `POST /api/cart` |

### 6.6 Address Book

| URL | `/account/addresses` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `AddressList`, `AddressCard`, `SetDefaultButton`, `EditAddressModal`, `DeleteAddressButton`, `AddNewAddressForm` |
| **API Requirements** | `GET /api/addresses`, `POST /api/addresses`, `PATCH /api/addresses/[id]`, `DELETE /api/addresses/[id]` |

### 6.7 Profile Settings

| URL | `/account/profile` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `AvatarUpload`, `ProfileForm`, `PhoneVerification`, `EmailChangeFlow`, `ChangePasswordForm` |
| **API Requirements** | `GET /api/account/profile`, `PATCH /api/account/profile`, `POST /api/auth/change-password` |

### 6.8 Write Review

| URL | `/account/reviews/[product-id]/write` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `StarRatingInput`, `ReviewTextarea`, `PhotoUploader`, `SubmitReviewButton` |
| **API Requirements** | `POST /api/reviews` |

### 6.9 Wallet & Credits

| URL | `/account/wallet` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `WalletBalanceCard`, `TransactionHistory`, `EarnMoreCTA` |
| **API Requirements** | `GET /api/account/wallet` |

### 6.10 Notification Preferences

| URL | `/account/notifications` | **Auth** | customer |
|---|---|---|---|
| **Key Components** | `NotificationToggleList` (email, SMS, push per event type) |
| **API Requirements** | `GET /api/account/notification-preferences`, `PATCH /api/account/notification-preferences` |

---

## 7. Admin Panel Screens

### 7.1 Admin Dashboard

| Attribute | Details |
|---|---|
| **URL** | `/admin/dashboard` |
| **Auth** | admin |
| **Key Components** | `KPIWidgetGrid`, `RevenueChart`, `OrderStatusChart`, `TopProductsTable`, `RecentOrdersTable`, `LowStockAlert`, `ConversionFunnelChart` |
| **API Requirements** | `GET /api/admin/dashboard` |

### 7.2 Product List (Admin)

| URL | `/admin/products` | **Auth** | admin/product_manager |
|---|---|---|---|
| **Key Components** | `DataTable`, `ProductStatusFilter`, `BulkActionBar`, `ProductSearchInput`, `ColumnSorting`, `Pagination` |
| **API Requirements** | `GET /api/admin/products?page=X&filter=X` |

### 7.3 Product Form (Add/Edit)

| URL | `/admin/products/new`, `/admin/products/[id]` | **Auth** | admin/product_manager |
|---|---|---|---|
| **Key Components** | `ProductBasicInfoForm`, `PricingForm`, `InventoryForm`, `MediaUploader`, `VariantBuilder`, `CategorySelector`, `OccasionMultiSelect`, `TagInput`, `PersonalizationConfig`, `SEOForm`, `PublishControls` |
| **API Requirements** | `POST /api/admin/products`, `PATCH /api/admin/products/[id]`, `POST /api/admin/products/[id]/images` |

### 7.4 Order Management (Admin)

| URL | `/admin/orders` | **Auth** | admin/order_manager |
|---|---|---|---|
| **Key Components** | `OrderDataTable`, `StatusFilterTabs`, `DateRangeFilter`, `OrderSearchInput`, `BulkStatusUpdate`, `ExportButton` |
| **API Requirements** | `GET /api/admin/orders?status=X&date=X&page=X` |

### 7.5 Order Detail (Admin)

| URL | `/admin/orders/[id]` | **Auth** | admin/order_manager |
|---|---|---|---|
| **Key Components** | `OrderInfoPanel`, `OrderItemsTable`, `OrderTimelineEditor`, `CustomerInfoCard`, `DeliveryInfoCard`, `PaymentInfoCard`, `RefundPanel`, `VendorAssignmentPanel`, `OrderNotes`, `AuditLog` |
| **API Requirements** | `GET /api/admin/orders/[id]`, `PATCH /api/admin/orders/[id]/status` |

### 7.6 Customer Management (Admin)

| URL | `/admin/customers` | **Auth** | admin/customer_support |
|---|---|---|---|
| **Key Components** | `CustomerDataTable`, `CustomerSearchInput`, `StatusFilter`, `CustomerDetailDrawer` |
| **API Requirements** | `GET /api/admin/customers` |

### 7.7 Coupon Management

| URL | `/admin/coupons` | **Auth** | admin/marketing_manager |
|---|---|---|---|
| **Key Components** | `CouponTable`, `CouponForm`, `CouponTypeSelector`, `DiscountRulesBuilder`, `UsageLimitForm`, `ValidityDatePicker` |
| **API Requirements** | `GET /api/admin/coupons`, `POST /api/admin/coupons`, `PATCH /api/admin/coupons/[id]` |

### 7.8 Review Moderation

| URL | `/admin/reviews` | **Auth** | admin |
|---|---|---|---|
| **Key Components** | `ReviewQueue`, `ReviewCard`, `ApproveButton`, `RejectButton`, `ReplyModal`, `HighlightToggle` |
| **API Requirements** | `GET /api/admin/reviews?status=pending`, `PATCH /api/admin/reviews/[id]` |

### 7.9 CMS Banner Manager

| URL | `/admin/cms/banners` | **Auth** | admin/marketing_manager |
|---|---|---|---|
| **Key Components** | `BannerList`, `BannerPreview`, `BannerUploadForm`, `BannerScheduler`, `DragToReorderList` |
| **API Requirements** | `GET /api/admin/cms/banners`, `POST /api/admin/cms/banners`, `PATCH /api/admin/cms/banners/order` |

### 7.10 Reports

| Screens | Components |
|---|---|
| Revenue Report | `DateRangePicker`, `RevenueLineChart`, `RevenueByCategory`, `ExportButton` |
| Order Report | `OrderVolumeChart`, `OrderStatusBreakdown`, `AOVTrend` |
| Product Report | `TopProductsTable`, `InventoryReport` |
| Customer Report | `NewVsReturning`, `CLTVChart`, `RetentionHeatmap` |

### 7.11 RBAC — Roles & Admin Users

| URL | `/admin/access/roles`, `/admin/access/users` | **Auth** | super_admin |
|---|---|---|---|
| **Key Components** | `RoleList`, `PermissionMatrix`, `AdminUserForm`, `RoleAssignmentDropdown` |
| **API Requirements** | `GET/POST/PATCH /api/admin/roles`, `GET/POST/PATCH /api/admin/admin-users` |

### 7.12 Audit Log Viewer

| URL | `/admin/audit-logs` | **Auth** | super_admin |
|---|---|---|---|
| **Key Components** | `AuditLogTable`, `ActorFilter`, `ActionTypeFilter`, `DateRangeFilter`, `DiffViewer` |
| **API Requirements** | `GET /api/admin/audit-logs?actor=X&action=X&date=X` |

---

## 8. Vendor Panel Screens

### 8.1 Vendor Dashboard

| URL | `/vendor/dashboard` | **Auth** | vendor |
|---|---|---|---|
| **Key Components** | `SalesKPICards`, `OrdersToFulfillAlert`, `RecentOrdersTable`, `TopProductsChart`, `EarningsCard` |
| **API Requirements** | `GET /api/vendor/dashboard` |

### 8.2 Vendor Products

| URL | `/vendor/products` | **Auth** | vendor |
|---|---|---|---|
| **Key Components** | `ProductTable`, `PublishStatusToggle`, `InventoryQuickEdit`, `AddProductButton` |
| **API Requirements** | `GET /api/vendor/products`, `PATCH /api/vendor/products/[id]/inventory` |

### 8.3 Vendor Orders

| URL | `/vendor/orders` | **Auth** | vendor |
|---|---|---|---|
| **Key Components** | `OrderTable`, `FulfillmentStatusBadge`, `PackedButton`, `ShippedButton`, `OrderDetailDrawer` |
| **API Requirements** | `GET /api/vendor/orders`, `PATCH /api/vendor/orders/[id]/status` |

### 8.4 Vendor Earnings

| URL | `/vendor/earnings` | **Auth** | vendor |
|---|---|---|---|
| **Key Components** | `EarningsSummaryCard`, `PayoutHistoryTable`, `CommissionBreakdown`, `BankDetailsForm` |
| **API Requirements** | `GET /api/vendor/earnings`, `GET /api/vendor/payouts` |

### 8.5 Vendor Application

| URL | `/vendor/apply` | **Auth** | public |
|---|---|---|---|
| **Key Components** | `VendorApplicationForm`, `DocumentUpload`, `BusinessDetailsForm`, `BankDetailsForm`, `TermsAcceptance` |
| **API Requirements** | `POST /api/vendor/apply` |

---

## 9. Error & Utility Screens

| Screen | URL | Components |
|---|---|---|
| **404 Not Found** | `*` | `NotFoundIllustration`, `SearchBar`, `HomeButton`, `SuggestedLinks` |
| **500 Server Error** | — | `ErrorIllustration`, `RetryButton`, `SupportLink` |
| **Maintenance** | — | `MaintenanceIllustration`, `EstimatedRestoreTime` |
| **Offline (PWA)** | — | `OfflineIllustration`, `CachedContentList` |
| **Payment Pending** | `/checkout/pending` | `LoadingAnimation`, `PaymentStatusPoller` |
| **Location Selector Modal** | overlay | `PincodeInput`, `LocationSearchInput`, `DetectLocationButton`, `PopularCitiesGrid` |
| **Auth Required Modal** | overlay | `LoginForm`, `SignupLink`, `GuestContinueButton` |
