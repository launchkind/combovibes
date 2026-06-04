# 08 — Product Catalog System

> **Purpose:** Complete design of the product catalog supporting all gifting categories — flowers, cakes, chocolates, hampers, personalized gifts, plants, fashion, and electronics — with variants, inventory, search filters, and delivery metadata.

---

## Table of Contents

1. [Catalog Architecture Overview](#1-catalog-architecture-overview)
2. [Category Taxonomy](#2-category-taxonomy)
3. [Product Types & Schemas](#3-product-types--schemas)
4. [Variant System](#4-variant-system)
5. [Inventory Management](#5-inventory-management)
6. [Personalization System](#6-personalization-system)
7. [Search & Filter System](#7-search--filter-system)
8. [Delivery Configuration per Category](#8-delivery-configuration-per-category)
9. [Product Pricing Logic](#9-product-pricing-logic)
10. [Content & SEO System](#10-content--seo-system)
11. [Product Lifecycle & Workflows](#11-product-lifecycle--workflows)

---

## 1. Catalog Architecture Overview

```
Category (L1)
  └── Subcategory (L2)
       └── Product Group (L3, optional)
            └── Products
                 └── Variants
                      └── Inventory per Variant per Location
```

### Product Type Decision Tree

```
Is it a physical product?
  ├── Yes
  │    ├── Has variants? (size/weight/color)
  │    │    ├── Yes → type: 'variable'
  │    │    └── No  → type: 'simple'
  │    ├── Can be personalized?
  │    │    ├── Yes → type: 'personalized' (also can be variable)
  │    │    └── No  → (remains simple or variable)
  │    └── Is it a curated set?
  │         ├── Yes → type: 'bundle'
  │         └── No  → (remains simple or variable)
  └── No (future: digital gift cards) → type: 'digital'
```

---

## 2. Category Taxonomy

### Top-Level Categories (L1)

| ID | Name | Slug | Has Variants | Personalizable |
|---|---|---|---|---|
| 1 | Flowers | flowers | Yes (stem count, arrangement) | No |
| 2 | Cakes | cakes | Yes (weight, flavor, eggless) | Yes (name, photo) |
| 3 | Plants | plants | Yes (pot size, plant type) | No |
| 4 | Chocolates | chocolates | Yes (quantity, brand) | Partial |
| 5 | Personalized Gifts | personalized-gifts | Yes | Yes (always) |
| 6 | Combos & Hampers | combos-hampers | No (fixed bundles) | Partial |
| 7 | Fashion & Accessories | fashion-accessories | Yes (size, color) | No |
| 8 | Home & Décor | home-decor | Yes (color, material) | Partial |
| 9 | Electronics & Gadgets | electronics-gadgets | Yes (color, storage) | No |
| 10 | Soft Toys | soft-toys | Yes (size) | No |
| 11 | Gift Cards | gift-cards | No | No |

### Subcategory Tree

```
Flowers (L1)
├── Roses
│   ├── Red Roses
│   ├── Pink Roses
│   ├── Yellow Roses
│   └── Mixed Roses
├── Mixed Bouquets
├── Exotic Flowers
│   ├── Orchids
│   ├── Lilies
│   └── Anthurium
├── Flower Baskets
├── Flower Boxes
├── Single Stem
└── Seasonal

Cakes (L1)
├── Birthday Cakes
├── Anniversary Cakes
├── Designer Cakes
├── Photo Cakes
├── Cupcakes
├── Eggless Cakes
├── Vegan Cakes
├── Kids Cakes
├── Fondant Cakes
├── Cheesecakes
└── Cake Pops

Plants (L1)
├── Indoor Plants
│   ├── Air Purifying
│   ├── Low Maintenance
│   └── Flowering Indoor
├── Outdoor Plants
├── Succulents & Cactus
├── Bonsai
├── Bamboo
├── Terrariums
└── Planters & Pots

Chocolates (L1)
├── Chocolate Boxes
├── Ferrero Rocher Collection
├── Cadbury Gifts
├── Kinder Collection
├── Artisan Chocolates
├── Chocolate Hampers
└── Sugar-Free Chocolates

Personalized Gifts (L1)
├── Photo Products
│   ├── Photo Mugs
│   ├── Photo Frames
│   ├── Photo Cushions
│   ├── Photo Collages
│   └── Photo Canvas
├── Name & Text Gifts
│   ├── Name Lamps
│   ├── Engraved Keychains
│   ├── Name Necklaces
│   └── Personalized Diaries
├── Wearables
│   ├── Customized T-Shirts
│   ├── Customized Mugs
│   └── Personalized Caps
├── Tech Accessories
│   ├── Custom Phone Cases
│   └── Custom Mouse Pads
└── Caricature Gifts

Combos & Hampers (L1)
├── Flower + Cake Combos
├── Flower + Chocolate Combos
├── Gift Hampers
│   ├── Gourmet Hampers
│   ├── Spa & Wellness
│   ├── Chocolate Hampers
│   └── Snack Hampers
├── Festival Hampers
├── Corporate Hampers
└── Premium Gift Boxes

Fashion & Accessories (L1)
├── Jewellery
│   ├── Necklaces
│   ├── Earrings
│   ├── Bracelets
│   └── Rings
├── Watches
├── Handbags & Wallets
├── Perfumes & Fragrances
└── Scarves & Stoles

Home & Décor (L1)
├── Wall Art & Frames
├── Decorative Showpieces
├── Candles & Diffusers
├── Cushions & Throws
└── Clocks

Electronics & Gadgets (L1)
├── Wireless Earbuds
├── Smart Speakers
├── Fitness Bands
├── Power Banks
└── Desk Accessories
```

---

## 3. Product Types & Schemas

### Type: Simple Product

```typescript
interface SimpleProduct {
  id: string
  type: 'simple'
  name: string
  slug: string
  price: number
  mrp: number
  images: ProductImage[]
  category_id: string
  description: string
  weight_grams?: number
  delivery_lead_days: number
  is_in_stock: boolean
}
```

### Type: Variable Product

```typescript
interface VariableProduct extends SimpleProduct {
  type: 'variable'
  variant_types: VariantType[]  // ['weight', 'flavor']
  variants: ProductVariant[]
  // Price shown is "from" lowest variant price
}

interface VariantType {
  type: 'size' | 'weight' | 'color' | 'flavor' | 'count' | 'material'
  label: string   // "Weight", "Size", "Flavor"
  values: string[]
  is_required: boolean
}

interface ProductVariant {
  id: string
  product_id: string
  name: string          // "500g Vanilla"
  sku: string
  variant_type: string
  value: string         // "500"
  price: number
  mrp: number
  image_url?: string
  is_active: boolean
  inventory_quantity: number
}
```

### Type: Personalized Product

```typescript
interface PersonalizedProduct extends VariableProduct {
  type: 'personalized'
  personalization: PersonalizationConfig
  extra_lead_days: number   // Additional days for personalization
  is_returnable: false      // Always non-returnable
}

interface PersonalizationConfig {
  allows_text: boolean
  allows_image: boolean
  text_fields: PersonalizationTextField[]
  image_fields: PersonalizationImageField[]
  preview_template_url: string   // SVG/Canvas template
  font_options?: FontOption[]
  color_options?: string[]       // hex colors
}

interface PersonalizationTextField {
  id: string
  label: string         // "Enter name"
  placeholder: string
  max_chars: number
  required: boolean
  position: { x: number; y: number; width: number; height: number }
}

interface PersonalizationImageField {
  id: string
  label: string         // "Upload photo"
  required: boolean
  min_width: number     // pixels
  min_height: number
  max_file_size_mb: number
  position: { x: number; y: number; width: number; height: number }
}
```

### Type: Bundle Product

```typescript
interface BundleProduct {
  type: 'bundle'
  components: BundleComponent[]
  bundle_price: number    // Usually less than sum of components
  can_customize: boolean  // Can customer swap components?
}

interface BundleComponent {
  product_id: string
  variant_id?: string
  quantity: number
  is_optional: boolean
  alternatives?: string[]   // product IDs customer can choose from
}
```

---

## 4. Variant System

### Variant Types by Category

| Category | Variant Type | Example Values |
|---|---|---|
| Flowers | `count` | 6, 12, 24, 50, 100 stems |
| Flowers | `arrangement` | Bouquet, Basket, Vase, Box |
| Cakes | `weight` | 500g, 1kg, 1.5kg, 2kg |
| Cakes | `flavor` | Chocolate, Vanilla, Strawberry, Black Forest |
| Cakes | `type` | Regular, Eggless, Vegan |
| Plants | `size` | Small, Medium, Large |
| Plants | `pot_material` | Ceramic, Terracotta, Plastic |
| Chocolates | `count` | 9 pieces, 16 pieces, 24 pieces |
| Fashion | `size` | XS, S, M, L, XL, XXL |
| Fashion | `color` | Red, Blue, Black, White, Gold |
| Soft Toys | `size` | Small (30cm), Medium (50cm), Large (75cm) |
| Electronics | `color` | Black, White, Rose Gold |

### Variant Selection UI Mapping

| Variant Type | UI Component |
|---|---|
| `count` / `weight` / `size` | Pill chips (horizontal) |
| `color` | Color swatch circles |
| `flavor` | Pill chips with scroll |
| `arrangement` | Image card selector |

### Variant Availability Matrix

```
Product: Red Roses Bouquet
Variants:
  - 6 Roses:  ₹299 (in_stock: 45)
  - 12 Roses: ₹499 (in_stock: 32) ← default (most popular)
  - 24 Roses: ₹899 (in_stock: 12)
  - 50 Roses: ₹1,799 (in_stock: 0) → DISABLED in UI
```

---

## 5. Inventory Management

### Inventory Model

```
Total Stock = Physical Count
Reserved = Items in active carts (held for 30 minutes) + Pending Orders
Available = Total Stock - Reserved
Sold = Fulfilled Orders
```

### Stock Status Logic

```typescript
function getStockStatus(available: number, total: number): StockStatus {
  if (available <= 0) return 'out_of_stock'
  if (available <= 5) return 'low_stock'      // "Only 3 left!"
  if (available <= 20) return 'limited'        // "Limited stock"
  return 'in_stock'
}
```

### Inventory Reservation Flow

```
Customer adds to cart:
  → inventory.reserved += quantity (30 min hold)
  → cart_item created with expiry

Cart expires (no checkout in 30 min):
  → inventory.reserved -= quantity
  → cart_item deleted

Order placed:
  → order_item created
  → reservation converted to order hold (indefinite)

Order cancelled:
  → inventory.quantity stays same
  → inventory.reserved -= quantity
  → items returned to available pool

Order delivered:
  → inventory.quantity -= fulfilled_quantity
  → inventory.reserved -= quantity
```

### Low Stock Alerts

```sql
-- Trigger when available drops below threshold
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS trigger AS $$
BEGIN
  IF (NEW.quantity - NEW.reserved) <= NEW.low_stock_threshold THEN
    INSERT INTO notifications (user_id, type, title, body, channel)
    SELECT au.user_id, 'low_stock', 
           'Low Stock Alert',
           format('Product %s is running low (%s units remaining)', 
                  p.name, NEW.quantity - NEW.reserved),
           'in_app'
    FROM admin_users au, products p
    WHERE p.id = NEW.product_id AND au.is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Personalization System

### Personalization Workflow

```
1. Customer selects personalized product on PDP
2. PersonalizationPanel opens (inline or modal)
3. Customer provides inputs:
   a. Text fields (name, message, etc.)
   b. Image upload (photo, logo)
4. Real-time preview rendered (Canvas API)
5. Customer confirms preview
6. Personalization data saved to cart_items.personalization (JSONB)
7. On checkout: personalization_orders record created
8. Admin/vendor processes personalization:
   a. Prints/engraves/creates the product
   b. Marks personalization as 'ready'
9. Personalized item packed with order
```

### Personalization Data Structure (JSONB)

```json
{
  "text_fields": {
    "name": "Happy Birthday Priya",
    "message": "Wishing you a wonderful day!"
  },
  "image_fields": {
    "photo": "https://storage.supabase.co/personalization-uploads/user-123/abc.jpg"
  },
  "font": "Playfair Display",
  "color": "#C9936A",
  "preview_url": "https://storage.supabase.co/personalization-previews/order-item-456/preview.jpg"
}
```

### Preview Generation (Edge Function)

```typescript
// Use Canvas API (Deno) or Sharp library
// Alternative: Cloudinary transformations with text overlay

async function generatePersonalizationPreview(config: PersonalizationData): Promise<string> {
  // Fetch product template SVG
  const template = await fetch(config.template_url)
  
  // Overlay text using canvas
  const canvas = new OffscreenCanvas(800, 800)
  const ctx = canvas.getContext('2d')
  
  // Draw base product image
  // Overlay text at configured positions
  // Overlay uploaded image if provided
  
  // Convert to blob and upload to Supabase Storage
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 })
  const previewUrl = await uploadPreview(blob)
  
  return previewUrl
}
```

---

## 7. Search & Filter System

### Search Architecture

```
Next.js API Route → Supabase Full-Text Search (PostgreSQL FTS)
                  → Fallback: pg_trgm similarity search
                  → Future: Algolia / Typesense for advanced features
```

### PostgreSQL Full-Text Search

```sql
-- Create search index
CREATE INDEX idx_products_fts ON products 
  USING GIN(to_tsvector('english', 
    name || ' ' || 
    COALESCE(short_description, '') || ' ' || 
    COALESCE(array_to_string(tags, ' '), '')
  ));

-- Search function
CREATE OR REPLACE FUNCTION search_products(
  search_query text,
  category_slug text DEFAULT NULL,
  occasion_slug text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  delivery_type text DEFAULT NULL,
  sort_by text DEFAULT 'relevance',
  page_num integer DEFAULT 1,
  page_size integer DEFAULT 20
)
RETURNS TABLE(
  product_id uuid,
  name text,
  slug text,
  base_price numeric,
  rank real
) AS $$
DECLARE
  search_tsquery tsquery;
BEGIN
  search_tsquery := websearch_to_tsquery('english', search_query);
  
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.base_price,
    ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.short_description, '')), search_tsquery) AS rank
  FROM products p
  LEFT JOIN product_occasions po ON p.id = po.product_id
  LEFT JOIN occasions o ON po.occasion_id = o.id
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE 
    p.status = 'active'
    AND (search_query = '' OR to_tsvector('english', p.name || ' ' || COALESCE(p.short_description, '')) @@ search_tsquery)
    AND (category_slug IS NULL OR c.slug = category_slug)
    AND (occasion_slug IS NULL OR o.slug = occasion_slug)
    AND (min_price IS NULL OR p.base_price >= min_price)
    AND (max_price IS NULL OR p.base_price <= max_price)
    AND (delivery_type IS NULL OR 
         (delivery_type = 'same_day' AND p.supports_same_day = true) OR
         (delivery_type = 'midnight' AND p.supports_midnight = true) OR
         (delivery_type = 'express' AND p.supports_express = true))
  ORDER BY
    CASE WHEN sort_by = 'relevance' THEN rank END DESC,
    CASE WHEN sort_by = 'price_asc' THEN p.base_price END ASC,
    CASE WHEN sort_by = 'price_desc' THEN p.base_price END DESC,
    CASE WHEN sort_by = 'rating' THEN p.average_rating END DESC,
    CASE WHEN sort_by = 'newest' THEN p.created_at END DESC,
    CASE WHEN sort_by = 'bestseller' THEN p.order_count END DESC
  LIMIT page_size OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql STABLE;
```

### Filter Facets

```typescript
interface ProductFilters {
  // Range filters
  price_min?: number
  price_max?: number
  
  // Multi-select filters
  category?: string[]       // category slugs
  occasion?: string[]       // occasion slugs
  brand?: string[]          // brand slugs
  delivery_type?: ('same_day' | 'midnight' | 'express' | 'standard')[]
  rating?: number           // minimum rating (1-5)
  
  // Boolean filters
  in_stock_only?: boolean
  is_personalizable?: boolean
  is_eggless?: boolean      // cake-specific
  
  // Sort
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestseller'
  
  // Pagination
  page?: number
  limit?: number
}
```

### URL Filter Encoding

```
/category/cakes?weight=1kg&flavor=chocolate&sort=price_asc&min=500&max=2000

/search?q=birthday+flowers&delivery=same_day&min=299&max=999&sort=bestseller

/occasion/diwali?category=hampers&min=1000&sort=rating
```

---

## 8. Delivery Configuration per Category

| Category | Same Day | Midnight | Express | Lead Time | Special Notes |
|---|---|---|---|---|---|
| Flowers | ✓ | ✓ | ✓ (3hr) | 0 days | Fresh, temperature-sensitive |
| Cakes | ✓ | ✓ | ✓ | 0 days | Handle with care, perishable |
| Plants | ✗ | ✗ | ✗ | 1–2 days | Careful packaging, water |
| Chocolates | ✓ | ✓ | ✓ | 0 days | Keep cool in summer |
| Personalized | ✗ | ✗ | ✗ | 2–3 days | Processing time needed |
| Combos | Partial | Partial | ✗ | 0–1 days | Depends on components |
| Fashion | ✗ | ✗ | ✗ | 2–5 days | Size/availability dependent |
| Home & Décor | ✗ | ✗ | ✗ | 2–5 days | Fragile packaging |
| Electronics | ✗ | ✗ | ✗ | 3–7 days | Brand warranty |
| Soft Toys | ✓ | ✗ | ✗ | 0–1 days | Easy to ship |

---

## 9. Product Pricing Logic

### Price Calculation

```typescript
function calculateProductPrice(
  product: Product,
  variant?: ProductVariant,
  quantity: number = 1,
  appliedCoupon?: Coupon
): PriceBreakdown {
  const basePrice = variant?.price ?? product.base_price
  const mrp = variant?.mrp ?? product.mrp ?? basePrice
  
  // Quantity pricing (future bulk discounts)
  const unitPrice = applyQuantityDiscount(basePrice, quantity)
  const subtotal = unitPrice * quantity
  
  // Coupon discount
  const discount = appliedCoupon 
    ? calculateCouponDiscount(subtotal, appliedCoupon)
    : 0
  
  // Delivery charge (calculated separately based on slot)
  
  // GST calculation
  const gstRate = getGSTRate(product.category_id)
  const gstAmount = ((subtotal - discount) * gstRate) / 100
  
  return {
    unit_price: unitPrice,
    mrp,
    subtotal,
    discount,
    gst_amount: gstAmount,
    gst_rate: gstRate,
    total: subtotal - discount + gstAmount
  }
}
```

### GST Rates by Category

| Category | GST Rate |
|---|---|
| Fresh Flowers | 0% |
| Plants | 0% |
| Cakes / Food items | 5% |
| Chocolates / Branded food | 18% |
| Personalized items | 18% |
| Fashion / Accessories | 12–18% |
| Electronics | 18% |
| Gift cards | 18% (on commission) |

### Display Price Rules

```typescript
// Always show inclusive price
// Show separate GST on invoice only (B2B requirement)

function formatPriceDisplay(price: number, mrp?: number): PriceDisplay {
  const showDiscount = mrp && mrp > price
  const discountPercent = showDiscount ? Math.round((mrp - price) / mrp * 100) : 0
  
  return {
    display_price: `₹${price.toFixed(0)}`,
    display_mrp: showDiscount ? `₹${mrp.toFixed(0)}` : null,
    discount_percent: discountPercent,
    savings: showDiscount ? `₹${(mrp - price).toFixed(0)}` : null
  }
}
```

---

## 10. Content & SEO System

### Product Content Schema

```
Product Name:         [Adjective] [Product Type] [Variant] for [Occasion]
                      e.g., "Premium Red Roses Bouquet - 24 Stems | Birthday Gift"

Short Description:    1-2 sentences, key USPs, occasion relevance

Description:          Rich text covering:
                      - Product details (materials, dimensions)
                      - Gifting occasion suitability
                      - Personalization options
                      - Care/usage instructions
                      - Delivery information

Meta Title:           [Product Name] | [Price] | Combovibes
Meta Description:     [Short description] Buy online with same-day delivery.

Structured Data:
  @type: Product
  name: [product name]
  image: [primary image]
  description: [short description]
  offers:
    @type: Offer
    price: [base_price]
    priceCurrency: INR
    availability: InStock/OutOfStock
  aggregateRating:
    ratingValue: [average_rating]
    reviewCount: [review_count]
```

### Auto-Generated SEO Titles

```typescript
function generateProductSEOTitle(product: Product, category: Category): string {
  const parts = [
    product.name,
    product.base_price ? `| ₹${product.base_price}` : '',
    'Buy Online',
    category.name === 'Flowers' ? '| Same Day Delivery' : '',
    '| Combovibes'
  ]
  return parts.filter(Boolean).join(' ').substring(0, 60)
}
```

---

## 11. Product Lifecycle & Workflows

### Product Status Transitions

```
draft → active → archived
draft → archived (skipped active)
active → out_of_stock (automatic, inventory-driven)
out_of_stock → active (restock triggers transition)
any → archived (manual admin action)
```

### Bulk Operations

```typescript
// Admin bulk actions on product list
type BulkAction = 
  | 'activate'           // draft → active
  | 'archive'            // any → archived
  | 'update_price'       // percentage increase/decrease
  | 'update_stock'       // set inventory quantity
  | 'apply_discount'     // apply % discount to selected
  | 'remove_discount'    // revert to MRP price
  | 'export_csv'         // download product data
  | 'duplicate'          // clone products
```

### New Product Checklist

```
□ Basic info (name, slug, description, category)
□ At least 3 product images
□ Price and MRP set
□ Variants configured (if applicable)
□ Inventory count entered
□ Delivery options configured
□ Occasion tags added (minimum 1)
□ Recipient tags added
□ Product tags for search
□ SEO meta title and description
□ Personalization config (if applicable)
□ GST category confirmed
□ Published (status = 'active')
```
