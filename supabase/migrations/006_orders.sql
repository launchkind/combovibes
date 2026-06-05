-- Coupons
create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'flat')),
  discount_value numeric(10,2) not null,
  min_order_value numeric(10,2) default 0,
  max_discount_amount numeric(10,2),
  usage_limit int,
  used_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true
);

-- Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text not null unique default 'CV-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  coupon_id uuid references public.coupons(id),
  coupon_code text,
  delivery_address jsonb not null,
  delivery_date date,
  delivery_slot text,
  gift_message text,
  greeting_card_id uuid references public.greeting_cards(id),
  special_instructions text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Order line items
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  product_image text,
  unit_price numeric(10,2) not null,
  quantity int not null,
  total_price numeric(10,2) not null,
  personalization_text text
);

-- Order status history
create table public.order_status_history (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  status text not null,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

create index on public.orders(user_id);
create index on public.orders(status);
create index on public.orders(created_at desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.coupons enable row level security;

create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users view own order items" on public.order_items for select
  using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Public read active coupons" on public.coupons for select using (is_active = true);
