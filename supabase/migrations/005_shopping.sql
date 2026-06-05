-- Wishlists
create table public.wishlists (
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (user_id, product_id)
);

-- Cart items (persisted server-side)
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity int not null default 1 check (quantity > 0),
  gift_message text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, product_id, variant_id)
);

-- Greeting cards catalog
create table public.greeting_cards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  image_url text not null,
  category text,
  is_active boolean default true,
  display_order int default 0
);

alter table public.wishlists enable row level security;
alter table public.cart_items enable row level security;
alter table public.greeting_cards enable row level security;

create policy "Users manage own wishlist" on public.wishlists for all using (auth.uid() = user_id);
create policy "Users manage own cart" on public.cart_items for all using (auth.uid() = user_id);
create policy "Public read greeting cards" on public.greeting_cards for select using (is_active = true);
