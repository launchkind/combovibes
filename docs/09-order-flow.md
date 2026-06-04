# 09 — Order Flow

> **Purpose:** Complete documentation of the order lifecycle from product discovery to post-delivery, including sequence diagrams, state machines, error handling, and edge cases.

---

## Table of Contents

1. [Order Lifecycle Overview](#1-order-lifecycle-overview)
2. [Browse to Cart Flow](#2-browse-to-cart-flow)
3. [Checkout Flow](#3-checkout-flow)
4. [Payment Flow](#4-payment-flow)
5. [Order Processing Flow](#5-order-processing-flow)
6. [Delivery Flow](#6-delivery-flow)
7. [Post-Delivery Flow](#7-post-delivery-flow)
8. [Cancellation & Refund Flow](#8-cancellation--refund-flow)
9. [Error Handling & Edge Cases](#9-error-handling--edge-cases)
10. [Order State Machine](#10-order-state-machine)
11. [Sequence Diagrams](#11-sequence-diagrams)

---

## 1. Order Lifecycle Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   BROWSE    │───▶│    CART     │───▶│  CHECKOUT   │───▶│   PAYMENT   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                   │
                                                                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DELIVERED  │◀───│  SHIPPING   │◀───│  PROCESSING │◀───│  CONFIRMED  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────┐
│  REVIEWED   │
└─────────────┘
```

---

## 2. Browse to Cart Flow

### Product Discovery → Add to Cart

```
Customer Action          System Response
─────────────────────────────────────────────────────────────
1. Browse category/search
2. View product PDP       → Fetch product + variants
                          → Check pincode serviceability
                          → Load delivery slot availability
3. Select variant         → Update price, images, stock status
4. Enter pincode          → API: GET /delivery/check?pincode=X
                          → Return available delivery types + dates
5. Select delivery date   → API: GET /delivery/slots?date=X&pincode=X
                          → Return available time slots
6. Select time slot       → Display slot surcharge if any
7. Add gift message       → Store in component state
8. Select add-ons         → Update cart total in summary
9. Select quantity        → Validate against available stock
10. Click "Add to Cart"   → API: POST /cart
                          → Reserve inventory (30 min hold)
                          → Open mini-cart drawer
                          → Show success toast
```

### Cart API: POST /api/cart

```typescript
// Request
interface AddToCartRequest {
  product_id: string
  variant_id?: string
  quantity: number
  personalization?: {
    text_fields: Record<string, string>
    image_urls?: Record<string, string>
  }
  gift_message?: string
  greeting_card_id?: string
  addons?: Array<{ type: string; price: number }>
  delivery_date?: string    // ISO date
  delivery_slot_id?: string
  recipient_name?: string
  recipient_phone?: string
  recipient_address?: AddressInput
}

// Response
interface AddToCartResponse {
  cart_item_id: string
  cart_total: number
  cart_item_count: number
  reservation_expires_at: string
}

// Errors
// 409: Out of stock
// 422: Invalid variant
// 400: Invalid personalization data
```

---

## 3. Checkout Flow

### Single-Page Progressive Checkout

```
Step 1: Authentication Check
  ├── Logged in?
  │   └── Proceed to Step 2
  └── Not logged in?
      ├── Show "Login or Continue as Guest"
      ├── Login → Cart merged → Proceed to Step 2
      └── Guest → Enter email → Proceed to Step 2

Step 2: Recipient Details
  Form fields:
    - Full Name (required)
    - Mobile Number (required, +91 format)
    - Address Line 1 (required)
    - Address Line 2 (optional)
    - Landmark (optional)
    - City (required)
    - State (required)
    - Pincode (required, validates delivery on blur)
  
  OR
    - Select from saved addresses (accordion at top)
  
  On pincode validation:
    - API: GET /delivery/check?pincode=X
    - If not serviceable → Show error, suggest alternate pincode
    - If serviceable → Proceed, update delivery options

Step 3: Delivery Date & Slot
  - Calendar: next 30 days, grays out unavailable dates
  - On date selection: API fetch available slots
  - Slot grid: show capacity, price, estimated time
  - Pre-populated from cart_item.delivery_date if set

Step 4: Gift Message (optional, expandable)
  - Textarea (150 chars)
  - Sender name
  - Quick template chips: "Happy Birthday!", "With Love", "Congratulations!"
  - Greeting card selector (thumbnail grid)
  - Preview of message as it will appear

Step 5: Order Review
  - Full item list with delivery details
  - Price breakdown
  - Edit link for each section

Step 6: Payment
  - Promo code input (with real-time validation)
  - Wallet balance toggle (if available)
  - Loyalty points toggle (if sufficient)
  - Payment method selection + form
  - "Place Order" CTA
```

### Checkout API Sequence

```
POST /api/checkout/validate      → Validate cart items still in stock
POST /api/checkout/apply-coupon  → Validate + apply coupon
POST /api/orders                 → Create order (status: 'pending')
POST /api/payment/initiate       → Create payment intent with gateway
→ Redirect to payment / display UPI QR
POST /api/payment/verify         → Verify payment signature
PATCH /api/orders/{id}/confirm   → Confirm order (status: 'confirmed')
```

---

## 4. Payment Flow

### Razorpay Integration Flow

```
1. Customer clicks "Place Order"
2. Client: POST /api/orders → Order created (status: payment_pending)
3. Client: POST /api/payment/initiate
   → Server creates Razorpay order: razorpay.orders.create({ amount, currency, receipt: order_id })
   → Returns: razorpay_order_id
4. Client: Opens Razorpay checkout modal with options:
   - razorpay_key: PUBLIC_KEY
   - order_id: razorpay_order_id
   - amount, currency, name, description
   - prefill: customer email/phone
   - theme: { color: '#C9936A' }
5. Customer completes payment
6. Razorpay sends to handler:
   - razorpay_payment_id
   - razorpay_order_id
   - razorpay_signature
7. Client: POST /api/payment/verify
   → Server verifies signature: sha256(order_id + '|' + payment_id, secret)
   → Update payments table: status = 'success'
   → Update orders table: status = 'confirmed'
   → Trigger order confirmation notifications
   → Release inventory reservation → Convert to confirmed hold
8. Client: Redirect to /checkout/success?order_id=X
```

### Payment Failure Handling

```
Payment failed / cancelled:
→ POST /api/payment/failed
→ orders.status = 'payment_pending' (keep open for retry)
→ Do NOT mark as 'failed' yet
→ Client: Show PaymentFailed page with:
   - "Retry Payment" button → Re-initiate with same order
   - "Try Different Method" → New payment method
   - Error message from Razorpay

After 3 failed retries or 30 minutes:
→ Mark order as 'failed'
→ Release all inventory reservations
→ Notify customer via email
```

### UPI-Specific Flow

```
1. Customer selects UPI
2. Enter UPI ID (e.g., user@gpay) OR
   Show QR code for scanning
3. UPI app opens (if mobile, deep link)
4. Customer authorizes in UPI app
5. Razorpay callback with success/failure
6. Continue as standard payment flow
```

### COD Flow

```
1. Customer selects COD
2. COD availability checked for pincode
3. COD fee (₹30-50) added to total
4. Order placed immediately (no payment verification)
5. Status: 'confirmed' directly
6. Payment collected by delivery agent
7. Agent marks as collected in system
→ order.payment_status = 'collected'
```

---

## 5. Order Processing Flow

### Admin/Vendor Processing

```
Order Confirmed
    ↓
[Admin assigns to Vendor if not auto-assigned]
    ↓
Vendor Dashboard shows new order
    ↓
Vendor clicks "Accept Order"
    → order_items.status = 'confirmed'
    ↓
Vendor prepares order:
  - Arranges flowers
  - Bakes/sources cake
  - Processes personalization
  - Assembles bundle
    ↓
Vendor clicks "Mark as Packed"
    → order_items.status = 'packed'
    → Customer SMS: "Your order is being prepared!"
    ↓
Delivery agent assigned (manual or auto):
  - Name
  - Phone number
    ↓
Vendor/Admin clicks "Mark as Dispatched"
    → order_items.status = 'shipped'
    → Customer SMS: "Your order is on the way! Agent: [Name] [Phone]"
    ↓
Agent picks up order
    ↓
Agent marks "Out for Delivery" (via agent app/portal)
    → order_items.status = 'out_for_delivery'
    → Customer SMS: "Out for delivery! Arriving today."
```

### Personalization Processing

```
Order with personalization confirmed
    ↓
personalization_orders.status = 'pending'
    ↓
Admin/Vendor downloads personalization spec:
  - Text content
  - Image file
  - Font, color
  - Preview image for reference
    ↓
Physical creation:
  - Print on mug / frame / cushion
  - Engrave on keychain / jewellery
  - Write on cake
    ↓
Mark personalization as 'ready'
    ↓
Include with order packaging
```

---

## 6. Delivery Flow

### Delivery Agent Workflow

```
Agent Pickup:
  1. Agent app shows assigned deliveries for the day
  2. Agent confirms pickup from vendor
  3. Status: out_for_delivery

En Route:
  1. Agent navigates to recipient address
  2. Optional: Live location shared (if GPS integrated)
  3. Customer can call agent via click-to-call

Delivery Attempt:
  Success:
    1. Agent clicks "Delivered"
    2. Photo proof uploaded (optional)
    3. Order status: 'delivered'
    4. Delivery timestamp recorded
    5. Customer gets confirmation SMS/WhatsApp

  Failed (recipient not home):
    1. Agent clicks "Delivery Attempted"
    2. Agent leaves note
    3. Customer contacted via phone/SMS
    4. Rescheduled for same day (if time permits) or next available slot

  Failed (wrong address):
    1. Customer support contacted
    2. Address corrected
    3. Re-attempt scheduled
```

### Special Delivery Types

**Same Day Delivery:**
```
Customer places order (before 3 PM local time)
  → Vendor notified immediately
  → Preparation deadline: 1 hour before slot start
  → Delivery within same day slot
```

**Midnight Delivery:**
```
Customer places order (before 11 PM)
  → Delivery slot: 11:30 PM – 12:30 AM
  → Special delivery team
  → Recipient must be available (confirmed via SMS earlier in day)
  → Bell/knock confirmation required
```

**Express 3-Hour:**
```
Customer places order
  → Cutoff calculation: current time + 3 hours
  → Shows available time window
  → High-priority assignment to nearest vendor
  → Agent dispatched within 30 minutes of order
```

---

## 7. Post-Delivery Flow

```
Delivery Confirmed
    ↓
24 hours later: Review Request
  → Email: "How was your delivery?"
  → SMS/WhatsApp: "Rate your experience"
    ↓
Customer reviews product (optional)
    ↓
Loyalty points awarded:
  → floor(total_amount / 10) points
  → Notification: "You earned X points!"
    ↓
7 days later: Return window expires
  → order_items.is_returnable = false (if it was true)
    ↓
30 days later: Order archived
  → Moved to historical records
  → Still accessible in order history
```

---

## 8. Cancellation & Refund Flow

### Cancellation Rules

| Order Status | Can Cancel | Refund Method | Timeline |
|---|---|---|---|
| payment_pending | Yes | N/A (no payment) | Instant |
| confirmed | Yes | Original method | 5-7 business days |
| processing | Admin only | Original method | 5-7 business days |
| packed | Admin only (partial) | Platform wallet | 2-3 days |
| shipped | No | — | — |
| out_for_delivery | No | — | — |
| delivered | No (return process) | — | — |

### Cancellation Flow

```
Customer clicks "Cancel Order"
  ↓
Check cancellation eligibility
  ↓
If eligible:
  1. Reason selection (required):
     - Change of mind
     - Ordered by mistake
     - Delivery date not suitable
     - Found cheaper elsewhere
     - Other
  2. Confirmation dialog
  3. API: POST /orders/{id}/cancel { reason }
  4. Order status: 'cancelled'
  5. Inventory reserved → released
  6. Refund initiated:
     a. Online payment → Gateway refund (5-7 days)
     b. COD → Platform wallet credit (immediate)
  7. Confirmation email/SMS

If not eligible:
  → Show message: "This order cannot be cancelled as it's already [status]"
  → Offer: "Contact Support" for exceptions
```

### Refund Flow

```
Refund Initiated
  ↓
Gateway processes refund (Razorpay):
  → razorpay.refunds.create({ payment_id, amount })
  → Refund ID recorded
  ↓
Webhook: refund.processed
  ↓
refunds.status = 'completed'
  ↓
Customer notification:
  "Refund of ₹X initiated. Credit in 5-7 business days."
  ↓
Refund appears in customer bank account (3-7 days)
```

### Return Flow

```
Customer initiates return (within 7 days):
  → Only for non-personalized items
  → Select item(s) to return
  → Select reason: damaged, wrong item, quality issue
  → Upload photos (required for quality issues)
  ↓
Admin reviews return request
  ↓
If approved:
  → Pickup scheduled (reverse logistics)
  → Customer gets pickup date/time
  → Agent collects from customer
  → Item inspected at warehouse
  → Refund issued (5-7 days)

If rejected:
  → Admin provides rejection reason
  → Customer notified
  → Escalation option to support
```

---

## 9. Error Handling & Edge Cases

### Stock Exhaustion at Checkout

```
Scenario: Product goes out of stock between cart add and checkout

Detection:
  → POST /checkout/validate checks current availability
  → If stock < cart quantity:

Response:
  → Show inline error: "Sorry, [Product] is no longer available in this quantity"
  → Options:
    a. Reduce quantity to available (if > 0)
    b. Remove item from cart
    c. Save to wishlist + get notified
  → User must resolve before proceeding
```

### Delivery Slot Full at Checkout

```
Scenario: Selected slot fills up between step 3 and payment

Detection:
  → POST /orders final validation checks slot capacity
  → If slot is now full:

Response:
  → "Sorry, the selected time slot is now full"
  → Show alternative slots
  → User must select new slot
  → Order not created until resolved
```

### Payment Gateway Timeout

```
Scenario: Network issue during payment (unclear if payment completed)

Action:
  → Keep order in 'payment_pending' status
  → Show user: "We're checking your payment status..."
  → Poll payment status every 5 seconds (max 10 attempts)
  → If confirmed: proceed normally
  → If failed: show retry options
  → If unknown after 10 attempts: 
     "Payment status unclear. Check your bank. Contact support if deducted."
  → System: Verify with Razorpay payment inquiry API
```

### Pincode Changes Post-Order

```
Scenario: Customer changes delivery address to different pincode

Rules:
  - Allowed only if status = 'confirmed' or 'processing'
  - New pincode must be serviceable
  - If delivery type not available at new pincode → downgrade/warn
  - Delivery charge may change → notify customer
  - Slot may not be available → ask to re-select
```

### Multiple Delivery Addresses

```
Scenario: Cart has items to different cities/recipients

Flow:
  - Each cart item can have individual delivery address
  - Checkout shows per-item delivery section
  - Delivery charges calculated per item
  - Order creates single payment but multiple delivery records
  - Each recipient gets their own tracking
```

---

## 10. Order State Machine

```
                    ┌──────────────┐
                    │    pending   │ ← Order created, no payment
                    └──────┬───────┘
                           │ payment initiated
                    ┌──────▼───────┐
                    │   payment_   │ ← Waiting for payment
                    │   pending    │
                    └──────┬───────┘
              ┌────────────┴─────────────┐
              │ payment success          │ payment failed
       ┌──────▼───────┐          ┌───────▼──────┐
       │  confirmed   │          │    failed    │
       └──────┬───────┘          └──────────────┘
              │ vendor accepts
       ┌──────▼───────┐
       │  processing  │
       └──────┬───────┘
              │ vendor packs
       ┌──────▼───────┐
       │    packed    │
       └──────┬───────┘
              │ dispatched
       ┌──────▼───────┐
       │   shipped    │
       └──────┬───────┘
              │ agent starts delivery
       ┌──────▼───────┐
       │ out_for_     │
       │ delivery     │
       └──────┬───────┘
              │ delivered
       ┌──────▼───────┐     ┌──────────────┐     ┌──────────────┐
       │  delivered   │────▶│   refund_    │────▶│   refunded   │
       └──────────────┘     │   requested  │     └──────────────┘
                            └──────────────┘

Cancellation: Any status before 'shipped' → cancelled → refund process
```

---

## 11. Sequence Diagrams

### Standard Order Placement

```
Customer          Next.js App        Supabase DB       Razorpay
────────          ──────────         ───────────       ────────
    │                  │                  │                │
    │ Click Checkout   │                  │                │
    │─────────────────▶│                  │                │
    │                  │ POST /orders     │                │
    │                  │─────────────────▶│                │
    │                  │ order_id         │                │
    │                  │◀─────────────────│                │
    │                  │                  │                │
    │                  │ Create Razorpay Order             │
    │                  │────────────────────────────────▶ │
    │                  │ razorpay_order_id                 │
    │                  │◀──────────────────────────────── │
    │                  │                  │                │
    │  Open Payment Modal                 │                │
    │◀─────────────────│                  │                │
    │                  │                  │                │
    │ Complete Payment                                     │
    │─────────────────────────────────────────────────▶  │
    │                  │                  │ payment.captured│
    │                  │ Webhook POST ◀──────────────────  │
    │                  │                  │                │
    │                  │ Verify Signature │                │
    │                  │─────────────────▶│                │
    │                  │ Update order status               │
    │                  │─────────────────▶│                │
    │                  │ Send notifications│                │
    │                  │─────────────────▶│                │
    │                  │                  │                │
    │ Redirect to /checkout/success       │                │
    │◀─────────────────│                  │                │
```

### Delivery Slot Availability Check

```
Customer          Next.js               Supabase
────────          ──────                ────────
    │                │                     │
    │ Select date on calendar              │
    │───────────────▶│                     │
    │                │ GET /delivery/slots │
    │                │ ?date=X&pincode=Y   │
    │                │ &product_id=Z       │
    │                │────────────────────▶│
    │                │                     │ COUNT slot_bookings
    │                │                     │ JOIN delivery_slots
    │                │                     │ WHERE date=X AND slot active
    │                │ slots with capacity │
    │                │◀────────────────────│
    │ Display available slots              │
    │◀───────────────│                     │
    │                │                     │
    │ Subscribe to realtime slot updates   │
    │────────────────────────────────────▶│ (Realtime channel)
    │                │                     │
    │ [Another user books same slot]       │
    │                │ slot_bookings INSERT │
    │                │◀────────────────────│ (Realtime broadcast)
    │ Update slot availability in UI       │
    │◀───────────────│                     │
```
