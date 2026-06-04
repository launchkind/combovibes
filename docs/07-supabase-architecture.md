# 07 — Supabase Architecture

> **Purpose:** Complete Supabase design including Auth configuration, Storage Buckets, Edge Functions, Row Level Security (RLS) policies, Realtime channels, and access patterns for all user roles.

---

## Table of Contents

1. [Supabase Project Configuration](#1-supabase-project-configuration)
2. [Authentication Architecture](#2-authentication-architecture)
3. [Storage Buckets](#3-storage-buckets)
4. [Row Level Security Policies](#4-row-level-security-policies)
5. [Edge Functions](#5-edge-functions)
6. [Realtime Architecture](#6-realtime-architecture)
7. [Database Functions & Triggers](#7-database-functions--triggers)
8. [Admin Access Patterns](#8-admin-access-patterns)
9. [Vendor Access Patterns](#9-vendor-access-patterns)
10. [Performance & Scaling](#10-performance--scaling)

---

## 1. Supabase Project Configuration

### Environment Setup

```
Production:   combovibes-prod   (Supabase project)
Staging:      combovibes-staging
Development:  combovibes-dev (local Supabase via CLI)
```

### Environment Variables

```env
# App
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # Server only, never client
SUPABASE_JWT_SECRET=your-jwt-secret

# Auth
NEXT_PUBLIC_SITE_URL=https://combovibes.in

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://xxx.supabase.co/storage/v1

# Edge Functions
SUPABASE_EDGE_FUNCTION_URL=https://xxx.supabase.co/functions/v1
```

### Client Initialization

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: cookieStore.get.bind(cookieStore) } }
  )
}

// lib/supabase/admin.ts  (server-only)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

---

## 2. Authentication Architecture

### Auth Providers Configuration

```
Enabled Providers:
  ✓ Email (with confirmation)
  ✓ Phone (OTP via SMS — Twilio)
  ✓ Google OAuth
  ✗ Facebook OAuth (Phase 2)

Email Settings:
  - Confirm email: true
  - Double confirm email changes: true
  - Secure email change: true

SMS Provider: Twilio
  - OTP expiry: 600 seconds
  - SMS template: "Your Combovibes OTP is: {{.Token}}. Valid for 10 minutes."

JWT Settings:
  - JWT Expiry: 3600 (1 hour)
  - Refresh Token Rotation: true
  - Reuse Interval: 10 seconds
```

### Auth Hooks

```sql
-- On user created: create profile record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Auth Flow — OTP Login

```
1. User enters phone number
2. POST /api/auth/otp → supabase.auth.signInWithOtp({ phone })
3. Supabase sends OTP via Twilio
4. User enters OTP
5. POST /api/auth/verify-otp → supabase.auth.verifyOtp({ phone, token, type: 'sms' })
6. Session created, profile synced
```

### Auth Flow — Google OAuth

```
1. User clicks "Continue with Google"
2. supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/auth/callback' })
3. Redirect to Google consent screen
4. Google redirects to /auth/callback
5. Exchange code for session
6. Profile synced from Google user metadata
```

### Middleware — Route Protection

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()
  
  const protectedRoutes = ['/account', '/checkout']
  const adminRoutes = ['/admin']
  const vendorRoutes = ['/vendor']
  
  if (protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL('/auth/login?redirect=' + request.nextUrl.pathname, request.url))
  }
  
  // Admin route — check admin_users table
  if (adminRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect(new URL('/admin/login', request.url))
    const isAdmin = await checkAdminAccess(session.user.id)
    if (!isAdmin) return NextResponse.redirect(new URL('/401', request.url))
  }
  
  return response
}
```

---

## 3. Storage Buckets

### Bucket Configuration

| Bucket | Access | Purpose | Max File Size |
|---|---|---|---|
| `product-images` | public | Product photos, gallery images | 10 MB |
| `category-images` | public | Category/occasion/brand images | 5 MB |
| `banners` | public | CMS banners and promotional images | 15 MB |
| `personalization-uploads` | private → public output | Customer-uploaded images for personalization | 10 MB |
| `personalization-previews` | public | Generated preview images | 5 MB |
| `review-images` | public | Customer review photos | 5 MB |
| `user-avatars` | public | User profile pictures | 2 MB |
| `greeting-cards` | public | Greeting card templates | 5 MB |
| `vendor-documents` | private | KYC documents (Aadhaar, PAN, GST) | 10 MB |
| `invoices` | private | Generated order invoice PDFs | 5 MB |
| `blog-images` | public | Blog post images | 10 MB |

### Storage Policies

```sql
-- product-images: anyone can read
CREATE POLICY "Public product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- product-images: only admins can write
CREATE POLICY "Admin product image upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );

-- user-avatars: users can manage their own
CREATE POLICY "User avatar upload" ON storage.objects
  FOR ALL USING (
    bucket_id = 'user-avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- personalization-uploads: authenticated users only
CREATE POLICY "Auth personalization upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'personalization-uploads' AND
    auth.role() = 'authenticated'
  );

-- review-images: authenticated users
CREATE POLICY "Auth review image upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'review-images' AND
    auth.role() = 'authenticated'
  );

-- vendor-documents: vendors can upload their own
CREATE POLICY "Vendor document upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vendor-documents' AND
    EXISTS (SELECT 1 FROM vendors WHERE user_id = auth.uid())
  );

-- invoices: users can read their own
CREATE POLICY "User invoice access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'invoices' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### File Naming Convention

```
product-images/    {product_id}/{uuid}-{index}.webp
category-images/   {category_slug}/{uuid}.webp
banners/           {placement}/{uuid}.webp
user-avatars/      {user_id}/avatar.webp
review-images/     {review_id}/{uuid}-{index}.webp
personalization/   uploads/{user_id}/{uuid}.jpg
personalization/   previews/{order_item_id}/{uuid}.jpg
vendor-documents/  {vendor_id}/{doc_type}/{uuid}.pdf
invoices/          {user_id}/{order_number}.pdf
```

---

## 4. Row Level Security Policies

### `profiles` Table

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admin read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
  );
```

### `addresses` Table

```sql
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own addresses" ON addresses
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admin read addresses" ON addresses
  FOR SELECT USING (is_admin(auth.uid()));
```

### `products` Table

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (status = 'active');

-- Admins can read all products
CREATE POLICY "Admin read all products" ON products
  FOR SELECT USING (is_admin(auth.uid()));

-- Admins can insert/update/delete products
CREATE POLICY "Admin manage products" ON products
  FOR ALL USING (is_admin(auth.uid()));

-- Vendors can read their own products
CREATE POLICY "Vendor read own products" ON products
  FOR SELECT USING (vendor_id = get_vendor_id(auth.uid()));

-- Vendors can update their own products (limited fields via function)
CREATE POLICY "Vendor update own products" ON products
  FOR UPDATE USING (vendor_id = get_vendor_id(auth.uid()));
```

### `orders` Table

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR guest_email = auth.email());

-- Users can insert orders (checkout)
CREATE POLICY "Users insert orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Admins can read/update all orders
CREATE POLICY "Admin manage orders" ON orders
  FOR ALL USING (is_admin(auth.uid()));
```

### `order_items` Table

```sql
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read items from their orders
CREATE POLICY "Users read own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Vendors can read items assigned to them
CREATE POLICY "Vendor read assigned items" ON order_items
  FOR SELECT USING (vendor_id = get_vendor_id(auth.uid()));

-- Vendors can update status of their items
CREATE POLICY "Vendor update item status" ON order_items
  FOR UPDATE USING (vendor_id = get_vendor_id(auth.uid()))
  WITH CHECK (vendor_id = get_vendor_id(auth.uid()));

-- Admins full access
CREATE POLICY "Admin manage order items" ON order_items
  FOR ALL USING (is_admin(auth.uid()));
```

### `cart_items` Table

```sql
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid() OR session_id = current_setting('app.session_id', true));
```

### `wishlists` Table

```sql
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wishlist" ON wishlists
  FOR ALL USING (user_id = auth.uid());
```

### `reviews` Table

```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- Users can read their own reviews
CREATE POLICY "Users read own reviews" ON reviews
  FOR SELECT USING (user_id = auth.uid());

-- Authenticated users can insert reviews
CREATE POLICY "Users insert reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid() AND auth.role() = 'authenticated');

-- Admins can manage all reviews
CREATE POLICY "Admin manage reviews" ON reviews
  FOR ALL USING (is_admin(auth.uid()));
```

### Helper Functions for RLS

```sql
-- Check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = uid AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get vendor ID for current user
CREATE OR REPLACE FUNCTION get_vendor_id(uid uuid)
RETURNS uuid AS $$
  SELECT id FROM vendors WHERE user_id = uid AND status = 'approved';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user is a vendor
CREATE OR REPLACE FUNCTION is_vendor(uid uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM vendors WHERE user_id = uid AND status = 'approved'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

## 5. Edge Functions

### Function Inventory

| Function | Trigger | Purpose |
|---|---|---|
| `payment-webhook` | HTTP POST | Handle Razorpay payment callbacks |
| `send-notification` | HTTP POST | Route notifications via email/SMS/WhatsApp |
| `order-confirmation` | Database trigger | Generate order confirmation communications |
| `generate-invoice` | HTTP POST | Create PDF invoice for order |
| `personalization-preview` | HTTP POST | Generate personalization preview image |
| `delivery-slot-availability` | HTTP GET | Real-time slot capacity check |
| `search-products` | HTTP GET | Full-text search with filters |
| `check-pincode` | HTTP GET | Validate pincode serviceability |
| `apply-coupon` | HTTP POST | Validate and apply coupon code |
| `loyalty-points-update` | Database trigger | Update loyalty points on order events |
| `vendor-payout-calculate` | Scheduled (weekly) | Calculate vendor payout amounts |
| `festival-reminders` | Scheduled (daily) | Send festival gift reminder notifications |
| `abandoned-cart-recovery` | Scheduled (hourly) | Detect and recover abandoned carts |
| `inventory-alert` | Database trigger | Alert when stock drops below threshold |

### Example Edge Function: Payment Webhook

```typescript
// supabase/functions/payment-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

serve(async (req) => {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')
  
  // Verify webhook signature
  const expectedSignature = await hmacSHA256(
    body,
    Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!
  )
  
  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 401 })
  }
  
  const event = JSON.parse(body)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  if (event.event === 'payment.captured') {
    const { order_id, payment_id } = event.payload.payment.entity
    
    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', event.payload.order.entity.receipt)
    
    // Update payment record
    await supabase
      .from('payments')
      .update({ 
        status: 'success',
        gateway_payment_id: payment_id 
      })
      .eq('gateway_order_id', order_id)
    
    // Trigger order confirmation notification
    await supabase.functions.invoke('send-notification', {
      body: { type: 'order_confirmed', order_id: event.payload.order.entity.receipt }
    })
  }
  
  return new Response('OK', { status: 200 })
})
```

### Example Edge Function: Check Pincode

```typescript
// supabase/functions/check-pincode/index.ts
serve(async (req) => {
  const url = new URL(req.url)
  const pincode = url.searchParams.get('pincode')
  
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return new Response(JSON.stringify({ error: 'Invalid pincode' }), { status: 400 })
  }
  
  const supabase = createClient(...)
  const { data } = await supabase
    .from('pincode_serviceability')
    .select('*')
    .eq('pincode', pincode)
    .single()
  
  if (!data || !data.is_serviceable) {
    return new Response(JSON.stringify({ 
      serviceable: false, 
      message: 'Sorry, we do not deliver to this pincode yet.' 
    }))
  }
  
  return new Response(JSON.stringify({
    serviceable: true,
    city: data.city,
    state: data.state,
    supports_same_day: data.supports_same_day,
    supports_midnight: data.supports_midnight,
    supports_express: data.supports_express,
    cod_available: data.cod_available,
    standard_lead_days: data.standard_lead_days
  }))
})
```

---

## 6. Realtime Architecture

### Realtime Channels

| Channel | Table | Events | Subscribers |
|---|---|---|---|
| `orders:{user_id}` | `orders` | UPDATE (status changes) | Customers |
| `order-items:{vendor_id}` | `order_items` | INSERT, UPDATE | Vendors |
| `inventory:{product_id}` | `inventory` | UPDATE (qty changes) | PDP pages |
| `slot-bookings:{slot_id}:{date}` | `slot_bookings` | INSERT | Checkout (slot availability) |
| `admin-orders` | `orders` | INSERT, UPDATE | Admin dashboard |
| `notifications:{user_id}` | `notifications` | INSERT | All authenticated users |

### Realtime Implementation

```typescript
// Order status tracking (customer)
const supabase = createClient()

const channel = supabase
  .channel(`orders:${userId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    updateOrderStatus(payload.new.status)
    showStatusNotification(payload.new.status)
  })
  .subscribe()

// Slot availability (checkout)
const slotChannel = supabase
  .channel(`slot-${slotId}-${date}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'slot_bookings',
    filter: `slot_id=eq.${slotId}`
  }, () => {
    refetchSlotAvailability()
  })
  .subscribe()
```

### Realtime RLS

```sql
-- Only subscribe to own orders
CREATE POLICY "Users realtime own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());
```

---

## 7. Database Functions & Triggers

### Order Number Generation

```sql
CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'CV-' || to_char(now(), 'YYYY') || '-' || 
         lpad(nextval('order_number_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Apply on orders insert
ALTER TABLE orders ALTER COLUMN order_number 
  SET DEFAULT generate_order_number();
```

### Update Product Rating on Review

```sql
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE products
  SET 
    average_rating = (
      SELECT AVG(rating)::numeric(3,2) FROM reviews 
      WHERE product_id = NEW.product_id AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*) FROM reviews 
      WHERE product_id = NEW.product_id AND status = 'approved'
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_approved
  AFTER INSERT OR UPDATE OF status ON reviews
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION update_product_rating();
```

### Inventory Reservation on Cart Add

```sql
CREATE OR REPLACE FUNCTION reserve_inventory()
RETURNS trigger AS $$
BEGIN
  UPDATE inventory
  SET reserved = reserved + NEW.quantity
  WHERE product_id = NEW.product_id 
    AND (variant_id = NEW.variant_id OR (variant_id IS NULL AND NEW.variant_id IS NULL));
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient inventory';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Loyalty Points on Order Delivery

```sql
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS trigger AS $$
DECLARE
  points_earned integer;
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' AND NEW.user_id IS NOT NULL THEN
    -- 1 point per ₹10 spent
    points_earned := FLOOR(NEW.total_amount / 10)::integer;
    
    INSERT INTO loyalty_transactions (user_id, order_id, points, type, reason)
    VALUES (NEW.user_id, NEW.id, points_earned, 'earned', 'order_delivered');
    
    UPDATE profiles
    SET loyalty_points = loyalty_points + points_earned
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_delivered
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION award_loyalty_points();
```

---

## 8. Admin Access Patterns

### Admin Supabase Client

```typescript
// Admin API routes use service role key (bypasses RLS)
// lib/supabase/admin.ts
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Permission Check in API Routes

```typescript
// app/api/admin/products/route.ts
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return new Response('Unauthorized', { status: 401 })
  
  // Check admin status and permission
  const { data: adminUser } = await supabaseAdmin
    .from('admin_users')
    .select('*, role:admin_roles(permissions)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()
  
  if (!adminUser) return new Response('Forbidden', { status: 403 })
  
  const permissions = adminUser.role.permissions
  if (!permissions['products.view']) return new Response('Forbidden', { status: 403 })
  
  // Proceed with admin operation using service role
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  return Response.json({ products })
}
```

---

## 9. Vendor Access Patterns

### Vendor Middleware

```typescript
async function requireVendor(userId: string) {
  const { data: vendor } = await supabaseAdmin
    .from('vendors')
    .select('id, status')
    .eq('user_id', userId)
    .single()
  
  if (!vendor || vendor.status !== 'approved') {
    throw new Error('Not an approved vendor')
  }
  
  return vendor.id
}
```

### Vendor-Scoped Queries

```typescript
// Vendor can only see their own products and orders
// This is enforced by RLS but also filtered in API for clarity
const vendorId = await requireVendor(user.id)

const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('vendor_id', vendorId)
```

---

## 10. Performance & Scaling

### Caching Strategy

```
Supabase PostgREST responses + Next.js caching:

Product pages:       ISR revalidate 1 hour
Category pages:      ISR revalidate 30 minutes
Homepage:            ISR revalidate 5 minutes (banners change)
Pincode check:       Server cache 24 hours
Delivery slots:      No cache (real-time capacity)
Cart:                No cache (user-specific)
Orders:              No cache + Realtime updates
```

### Connection Pooling

```
PgBouncer mode: Transaction (for serverless Next.js)
Pool size: 15 connections per region
Supabase connection string: postgresql://...@xxx.pooler.supabase.com:6543/postgres
```

### Read Replicas

```
Phase 1 (MVP):    Single Supabase instance
Phase 2 (Growth): Supabase read replica for analytics queries
Phase 3 (Scale):  Multiple regions with geo-routing
```

### Database Maintenance

```sql
-- Regular VACUUM for frequently updated tables
ALTER TABLE cart_items SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE slot_bookings SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE inventory SET (autovacuum_vacuum_scale_factor = 0.02);
```
