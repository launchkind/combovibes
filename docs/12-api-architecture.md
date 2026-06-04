# 12 — API Architecture

> **Purpose:** Complete API design for Combovibes — all endpoints, request/response schemas, validation rules, authentication requirements, and error conventions. Built as Next.js 15 Route Handlers backed by Supabase.

---

## Table of Contents

1. [API Design Principles](#1-api-design-principles)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Error Response Standards](#3-error-response-standards)
4. [Rate Limiting](#4-rate-limiting)
5. [Auth APIs](#5-auth-apis)
6. [Product APIs](#6-product-apis)
7. [Category & Discovery APIs](#7-category--discovery-apis)
8. [Search APIs](#8-search-apis)
9. [Cart APIs](#9-cart-apis)
10. [Checkout & Order APIs](#10-checkout--order-apis)
11. [Payment APIs](#11-payment-apis)
12. [Delivery APIs](#12-delivery-apis)
13. [Account APIs](#13-account-apis)
14. [Review APIs](#14-review-apis)
15. [Admin APIs](#15-admin-apis)
16. [Vendor APIs](#16-vendor-apis)
17. [Webhook APIs](#17-webhook-apis)

---

## 1. API Design Principles

```
Base URL:        /api/v1/
Format:          JSON
Authentication:  Bearer token (Supabase JWT)
Versioning:      URL-based (/api/v1/)
Pagination:      Cursor-based for large lists, offset for admin
Filtering:       Query parameters
Sorting:         ?sort=field&order=asc|desc
Date Format:     ISO 8601 (2024-12-25T14:30:00Z)
Currency:        INR, amounts in paise (integer) for internal, ₹ display
```

### Response Envelope

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product could not be found.",
    "details": {}
  }
}
```

---

## 2. Authentication & Authorization

### Auth Header

```
Authorization: Bearer {supabase_jwt_token}
```

### Route Protection Levels

| Level | Middleware |
|---|---|
| `public` | No auth required |
| `authenticated` | Valid JWT required |
| `customer` | JWT + profile exists |
| `vendor` | JWT + vendor status = approved |
| `admin` | JWT + admin_users record exists |
| `super_admin` | JWT + admin with super_admin role |

### Auth in Route Handlers

```typescript
// app/api/account/profile/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return Response.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Please login to continue.' } }, { status: 401 })
  }
  
  // Proceed with authenticated request
}
```

---

## 3. Error Response Standards

### HTTP Status Codes

| Code | Meaning | When Used |
|---|---|---|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation failure |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Valid auth, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource, inventory conflict |
| 422 | Unprocessable | Valid format, fails business rules |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |

### Error Codes

```typescript
type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'OUT_OF_STOCK'
  | 'SLOT_UNAVAILABLE'
  | 'PINCODE_NOT_SERVICEABLE'
  | 'COUPON_INVALID'
  | 'COUPON_EXPIRED'
  | 'COUPON_USAGE_EXCEEDED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_VERIFICATION_FAILED'
  | 'ORDER_CANNOT_BE_CANCELLED'
  | 'INSUFFICIENT_WALLET_BALANCE'
  | 'INSUFFICIENT_LOYALTY_POINTS'
  | 'VENDOR_NOT_APPROVED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR'
```

---

## 4. Rate Limiting

| Route Group | Limit |
|---|---|
| Auth endpoints | 10 req/min per IP |
| Search | 60 req/min per IP |
| Product reads | 200 req/min per IP |
| Cart operations | 30 req/min per user |
| Checkout/Order | 10 req/min per user |
| Payment | 5 req/min per user |
| Admin APIs | 500 req/min per admin |

---

## 5. Auth APIs

### `POST /api/auth/signup`

```typescript
// Request
{
  email: string       // valid email
  password: string    // min 8 chars, 1 uppercase, 1 number
  full_name: string   // 2-50 chars
  phone?: string      // +91XXXXXXXXXX format
}

// Response 201
{
  success: true,
  data: {
    user_id: string,
    message: "Please check your email to verify your account."
  }
}

// Errors: 400 (validation), 409 (email already exists)
```

### `POST /api/auth/login`

```typescript
// Request
{
  email: string
  password: string
  remember_me?: boolean   // extends token expiry to 30 days
}

// Response 200
{
  success: true,
  data: {
    access_token: string,
    refresh_token: string,
    expires_at: number,
    user: { id, email, full_name, avatar_url }
  }
}
```

### `POST /api/auth/otp/send`

```typescript
// Request
{ phone: string }  // +91XXXXXXXXXX

// Response 200
{ success: true, data: { expires_at: string } }
```

### `POST /api/auth/otp/verify`

```typescript
// Request
{ phone: string, otp: string }

// Response 200
{ success: true, data: { access_token, user } }
```

### `POST /api/auth/logout`

```typescript
// Auth: required
// Response 204
```

### `POST /api/auth/forgot-password`

```typescript
// Request
{ email: string }

// Response 200 (always, to prevent email enumeration)
{ success: true, data: { message: "If this email exists, a reset link has been sent." } }
```

---

## 6. Product APIs

### `GET /api/products`

```typescript
// Query params
{
  category?: string         // category slug
  occasion?: string         // occasion slug
  brand?: string            // brand slug
  collection?: string       // collection slug
  q?: string                // search query
  min_price?: number
  max_price?: number
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestseller'
  delivery?: 'same_day' | 'midnight' | 'express'
  rating?: number           // min rating
  personalizable?: boolean
  in_stock?: boolean
  page?: number             // default 1
  limit?: number            // default 20, max 100
}

// Response 200
{
  success: true,
  data: {
    products: Product[],
    filters: {              // available filter values for sidebar
      price_range: { min: 99, max: 15000 },
      categories: [{ id, name, slug, count }],
      occasions: [{ id, name, slug, count }],
      brands: [{ id, name, slug, count }],
      delivery_types: ['same_day', 'midnight', 'express']
    }
  },
  meta: { page, per_page, total, total_pages }
}
```

### `GET /api/products/[slug]`

```typescript
// Response 200
{
  success: true,
  data: {
    product: {
      id, name, slug, sku,
      description, short_description,
      base_price, mrp, discount_percent,
      status, type,
      is_personalizable, is_featured, is_bestseller,
      supports_same_day, supports_midnight, supports_express,
      delivery_lead_days,
      category: { id, name, slug },
      brand: { id, name, slug, logo_url },
      images: [{ url, alt_text, is_primary, sort_order }],
      variants: [{ id, name, variant_type, value, price, mrp, image_url, inventory_available }],
      occasions: [{ id, name, slug }],
      tags: string[],
      average_rating, review_count,
      personalization_config?: PersonalizationConfig,
      addons: Addon[],    // available add-ons for this product
      seo: { meta_title, meta_description },
      related_products: Product[]
    }
  }
}

// Error 404: Product not found or not active
```

### `GET /api/products/[slug]/reviews`

```typescript
// Query: page, limit, rating (filter), sort (newest|helpful)

// Response 200
{
  success: true,
  data: {
    summary: {
      average_rating: 4.6,
      total_reviews: 248,
      distribution: { 5: 180, 4: 45, 3: 15, 2: 5, 1: 3 }
    },
    reviews: Review[]
  },
  meta: { page, per_page, total }
}
```

---

## 7. Category & Discovery APIs

### `GET /api/categories`

```typescript
// Response: Full category tree
{
  success: true,
  data: {
    categories: [
      {
        id, name, slug, image_url, icon_url,
        subcategories: [{ id, name, slug, image_url }]
      }
    ]
  }
}
```

### `GET /api/occasions`

```typescript
// Response: All active occasions
{
  success: true,
  data: {
    occasions: [{ id, name, slug, image_url, banner_url, icon }]
  }
}
```

### `GET /api/occasions/[slug]`

```typescript
// Response: Occasion detail with curated products
{
  success: true,
  data: {
    occasion: { id, name, slug, description, banner_url },
    featured_products: Product[],
    categories: Category[],   // categories relevant to this occasion
    price_ranges: [
      { label: "Under ₹500", url_param: "max_price=500", products_count: 45 }
    ]
  }
}
```

### `GET /api/homepage`

```typescript
// Response: All homepage section data
{
  success: true,
  data: {
    banners: Banner[],
    top_categories: Category[],
    occasions: Occasion[],
    delivery_countdown: { message, deadline_time, deadline_city },
    featured_collections: Collection[],
    bestsellers: Product[],
    personalized_products: Product[],
    trending: Product[],
    new_arrivals: Product[],
    reviews: Review[],
    brands: Brand[]
  }
}
```

---

## 8. Search APIs

### `GET /api/search`

```typescript
// Query params
{
  q: string             // required
  category?: string
  occasion?: string
  min_price?: number
  max_price?: number
  delivery?: string
  sort?: string
  page?: number
  limit?: number
}

// Response 200
{
  success: true,
  data: {
    query: string,
    products: Product[],
    categories: Category[],   // matching categories
    occasions: Occasion[],    // matching occasions
    suggestions: string[],    // autocomplete for 'did you mean'
    filters: FilterFacets
  },
  meta: { page, per_page, total }
}
```

### `GET /api/search/suggestions`

```typescript
// Query: ?q=red+ro (autocomplete)
// Debounced on client (300ms)

// Response 200
{
  success: true,
  data: {
    suggestions: [
      { type: 'product', id, name, slug, image, price },
      { type: 'category', id, name, slug },
      { type: 'occasion', id, name, slug },
      { type: 'query', text: "red roses bouquet" }
    ],
    trending: ['birthday flowers', 'anniversary cake', 'diwali hamper']
  }
}
```

---

## 9. Cart APIs

### `GET /api/cart`

```typescript
// Auth: guest (session cookie) or customer (JWT)

// Response 200
{
  success: true,
  data: {
    items: CartItem[],
    summary: {
      subtotal: number,
      delivery_total: number,
      discount: number,
      tax: number,
      total: number,
      item_count: number
    },
    applied_coupon?: Coupon,
    wallet_applied: number,
    points_applied: number
  }
}
```

### `POST /api/cart`

```typescript
// Request
{
  product_id: string,
  variant_id?: string,
  quantity: number,              // 1-99
  personalization?: {
    text_fields: Record<string, string>,
    image_urls?: Record<string, string>
  },
  gift_message?: string,         // max 150 chars
  greeting_card_id?: string,
  addons?: Array<{ type: string, product_id?: string }>,
  delivery_date?: string,        // YYYY-MM-DD
  delivery_slot_id?: string,
  recipient_name?: string,       // max 50 chars
  recipient_phone?: string,      // +91XXXXXXXXXX
  recipient_address?: {
    full_name: string,
    phone: string,
    address_line_1: string,
    address_line_2?: string,
    city: string,
    state: string,
    pincode: string
  }
}

// Response 201
{
  success: true,
  data: {
    cart_item: CartItem,
    cart_summary: CartSummary,
    reservation_expires_at: string
  }
}

// Errors
// 409: OUT_OF_STOCK
// 422: SLOT_UNAVAILABLE | PINCODE_NOT_SERVICEABLE
```

### `PATCH /api/cart/[item-id]`

```typescript
// Partial update — any cart item field
// Request: same fields as POST (partial)

// Response 200
{ success: true, data: { cart_item, cart_summary } }
```

### `DELETE /api/cart/[item-id]`

```typescript
// Response 200
{ success: true, data: { cart_summary } }
```

### `POST /api/cart/coupon`

```typescript
// Request
{ code: string }

// Response 200
{
  success: true,
  data: {
    coupon: { code, description, discount_amount },
    cart_summary: CartSummary
  }
}

// Errors
// 422: COUPON_INVALID | COUPON_EXPIRED | COUPON_USAGE_EXCEEDED
//       MINIMUM_ORDER_NOT_MET | FIRST_ORDER_ONLY | NEW_USER_ONLY
```

---

## 10. Checkout & Order APIs

### `POST /api/checkout/validate`

```typescript
// Validates cart before proceeding to payment
// Auth: authenticated

// Response 200
{
  success: true,
  data: {
    is_valid: boolean,
    issues: [
      { 
        cart_item_id: string,
        issue: 'out_of_stock' | 'slot_full' | 'delivery_unavailable',
        message: string
      }
    ]
  }
}
```

### `POST /api/orders`

```typescript
// Create order from cart
// Auth: authenticated or guest (with email)

// Request
{
  guest_email?: string,     // if not logged in
  note?: string,
  utm?: { source, medium, campaign }
}

// Response 201
{
  success: true,
  data: {
    order_id: string,
    order_number: string,
    total_amount: number,
    status: 'pending'
  }
}
```

### `GET /api/orders/[id]`

```typescript
// Auth: owner or admin

// Response 200
{
  success: true,
  data: {
    order: {
      id, order_number, status, created_at,
      subtotal, delivery_charge, discount, tax, total,
      items: OrderItem[],
      payment: { method, status, amount },
      coupon_code?,
      customer: { name, email, phone }
    }
  }
}
```

### `GET /api/orders/[id]/track`

```typescript
// Public tracking endpoint — no auth required
// Limited data for privacy

// Response 200
{
  success: true,
  data: {
    order_number: string,
    status: string,
    status_label: string,
    timeline: [
      { status, label, timestamp, is_completed }
    ],
    estimated_delivery: string,
    delivery_agent?: { name, phone_masked }  // only when out_for_delivery
  }
}
```

### `POST /api/orders/[id]/cancel`

```typescript
// Auth: owner
// Request
{ reason: string }

// Response 200
{
  success: true,
  data: {
    order: { id, status: 'cancelled' },
    refund: { amount, method, estimated_days }
  }
}

// Errors
// 422: ORDER_CANNOT_BE_CANCELLED (already shipped etc.)
```

---

## 11. Payment APIs

### `POST /api/payment/initiate`

```typescript
// Request
{
  order_id: string,
  payment_method: 'upi' | 'card' | 'net_banking' | 'wallet' | 'cod',
  wallet_amount?: number,
  loyalty_points?: number,
  gift_card_code?: string
}

// Response 200
{
  success: true,
  data: {
    razorpay_order_id: string,
    amount: number,          // in paise
    currency: 'INR',
    key_id: string,          // Razorpay public key
    prefill: {
      name: string,
      email: string,
      contact: string
    }
  }
}
```

### `POST /api/payment/verify`

```typescript
// Called after Razorpay payment handler callback

// Request
{
  order_id: string,               // our order ID
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}

// Response 200
{
  success: true,
  data: {
    order: { id, order_number, status: 'confirmed' }
  }
}

// Errors
// 400: PAYMENT_VERIFICATION_FAILED
```

### `POST /api/payment/retry`

```typescript
// Re-initiate payment for failed order

// Request
{ order_id: string }

// Response: same as /payment/initiate
```

---

## 12. Delivery APIs

### `GET /api/delivery/check`

```typescript
// Check pincode serviceability

// Query: ?pincode=400001

// Response 200
{
  success: true,
  data: {
    serviceable: boolean,
    city: string,
    state: string,
    supports_same_day: boolean,
    supports_midnight: boolean,
    supports_express: boolean,
    cod_available: boolean,
    standard_lead_days: number
  }
}
```

### `GET /api/delivery/slots`

```typescript
// Get available delivery slots for a date + pincode

// Query
{
  date: string,           // YYYY-MM-DD
  pincode: string,
  product_id?: string     // checks product-specific lead time
}

// Response 200
{
  success: true,
  data: {
    slots: [
      {
        id: string,
        name: string,
        type: string,
        start_time: string,
        end_time: string,
        surcharge: number,
        available_capacity: number,
        total_capacity: number,
        is_available: boolean,
        is_almost_full: boolean   // < 20% capacity remaining
      }
    ]
  }
}
```

---

## 13. Account APIs

### `GET /api/account/profile`

```typescript
// Auth: customer

// Response 200
{
  success: true,
  data: {
    profile: {
      id, full_name, display_name, email, phone,
      avatar_url, date_of_birth, gender,
      wallet_balance, loyalty_points, tier,
      referral_code
    }
  }
}
```

### `PATCH /api/account/profile`

```typescript
// Request (partial)
{
  full_name?: string,
  display_name?: string,
  phone?: string,
  date_of_birth?: string,
  gender?: string
}
```

### `GET /api/account/orders`

```typescript
// Query: status?, page?, limit?

// Response 200
{
  success: true,
  data: {
    orders: [
      {
        id, order_number, status, total, created_at,
        items_count, first_item_image, first_item_name,
        delivery_date
      }
    ]
  },
  meta: { page, per_page, total }
}
```

### `GET /api/addresses`

```typescript
// Response 200
{
  success: true,
  data: { addresses: Address[] }
}
```

### `POST /api/addresses`

```typescript
// Request
{
  label: string,
  full_name: string,
  phone: string,
  address_line_1: string,
  address_line_2?: string,
  landmark?: string,
  city: string,
  state: string,
  pincode: string,
  is_default?: boolean
}
```

### `GET /api/wishlist`

```typescript
// Response
{
  success: true,
  data: {
    items: [
      { id, product: Product, variant_id?, added_at }
    ]
  }
}
```

### `POST /api/wishlist`

```typescript
// Request
{ product_id: string, variant_id?: string }

// Response 201 or 200 (if already exists)
```

### `DELETE /api/wishlist/[id]`

```typescript
// Response 204
```

---

## 14. Review APIs

### `POST /api/reviews`

```typescript
// Auth: customer, must have delivered order for this product

// Request
{
  product_id: string,
  order_item_id: string,
  rating: number,          // 1-5
  title?: string,          // max 100 chars
  body?: string,           // max 1000 chars
  images?: string[]        // URLs of uploaded review images
}

// Response 201
{
  success: true,
  data: {
    review: { id, status: 'pending', message: 'Review submitted for moderation.' }
  }
}
```

### `POST /api/reviews/[id]/helpful`

```typescript
// Mark review as helpful
// Auth: customer

// Response 200
{ success: true, data: { helpful_count: number } }
```

---

## 15. Admin APIs

All admin APIs require `Authorization: Bearer {admin_jwt}` with appropriate role permissions.

### `GET /api/admin/dashboard`

```typescript
// Response: All dashboard KPIs
{
  success: true,
  data: {
    revenue: { today, week, month, year },
    orders: { today, pending, processing, delivered, cancelled },
    customers: { total, new_today },
    products: { total, active, low_stock, out_of_stock },
    vendors: { total, pending_approval },
    reviews: { pending_moderation }
  }
}
```

### `GET /api/admin/products`

```typescript
// Query: all filter options from Product List spec
// Auth: admin or product_manager role

// Response: Paginated product list with full data
```

### `POST /api/admin/products`

```typescript
// Full product creation
// Request: all product fields
// Response 201: Created product
```

### `PATCH /api/admin/products/[id]`

```typescript
// Partial update
// Response 200: Updated product
```

### `GET /api/admin/orders`

```typescript
// Query: status, date_from, date_to, vendor_id, page, limit
// Response: Paginated order list with full customer/payment data
```

### `PATCH /api/admin/orders/[id]/status`

```typescript
// Request
{
  status: OrderStatus,
  note?: string
}
// Response 200
```

### `POST /api/admin/orders/[id]/refund`

```typescript
// Request
{
  amount: number,
  reason: string,
  refund_to: 'original_method' | 'wallet' | 'gift_card'
}
// Response 200
```

### `GET /api/admin/reports/revenue`

```typescript
// Query: date_from, date_to, group_by (day|week|month)
// Response: Revenue data for charts + export
```

---

## 16. Vendor APIs

All vendor APIs require approved vendor JWT.

### `GET /api/vendor/dashboard`

```typescript
// Response: Vendor KPIs, pending orders, top products
```

### `GET /api/vendor/orders`

```typescript
// Query: status, date_from, date_to, page
// Response: Orders assigned to this vendor
```

### `PATCH /api/vendor/orders/[id]/status`

```typescript
// Request
{
  status: 'accepted' | 'packed' | 'handed_to_agent',
  note?: string,
  packing_photo_url?: string
}
```

### `POST /api/vendor/products`

```typescript
// Create product (goes to pending_review)
// Request: product fields (subset)
// Response 201: Product with status: pending_review
```

### `GET /api/vendor/earnings`

```typescript
// Response: Earnings summary + transaction list
```

---

## 17. Webhook APIs

### `POST /api/webhooks/razorpay`

```typescript
// Called by Razorpay for payment events
// Verified via HMAC signature in header

// Events handled:
// payment.captured → confirm order
// payment.failed → mark payment failed
// refund.processed → mark refund complete

// Response: 200 OK (always, to acknowledge receipt)
```

### `POST /api/webhooks/delivery`

```typescript
// Called by delivery partner for status updates
// Header: X-Webhook-Secret

// Events: 
// out_for_delivery → update order status
// delivered → confirm delivery, trigger review prompt
// delivery_failed → notify customer support
```
