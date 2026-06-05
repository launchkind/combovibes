-- Categories (self-referential for sub-categories)
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories(id),
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- Occasions (Birthday, Anniversary, etc.)
create table public.occasions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon_url text,
  display_order int default 0,
  is_active boolean default true
);

-- Collections (New Arrivals, Best Sellers, etc.)
create table public.collections (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  banner_url text,
  display_order int default 0,
  is_active boolean default true
);

-- Brands / vendors
create table public.brands (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  logo_url text,
  description text,
  is_active boolean default true
);

-- Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  category_id uuid references public.categories(id),
  brand_id uuid references public.brands(id),
  base_price numeric(10,2) not null,
  sale_price numeric(10,2),
  cost_price numeric(10,2),
  sku text unique,
  weight_grams int,
  is_active boolean default true,
  is_featured boolean default false,
  is_personalisable boolean default false,
  delivery_time_days int default 1,
  meta_title text,
  meta_description text,
  rating_average numeric(3,2) default 0,
  rating_count int default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Product images
create table public.product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  alt_text text,
  display_order int default 0,
  is_primary boolean default false
);

-- Product variants (size, weight, etc.)
create table public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  name text not null,
  sku text unique,
  price_modifier numeric(10,2) default 0,
  is_active boolean default true,
  display_order int default 0
);

-- Product <-> Occasions junction
create table public.product_occasions (
  product_id uuid references public.products(id) on delete cascade,
  occasion_id uuid references public.occasions(id) on delete cascade,
  primary key (product_id, occasion_id)
);

-- Product <-> Collections junction
create table public.product_collections (
  product_id uuid references public.products(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- Personalization config
create table public.personalization_config (
  product_id uuid references public.products(id) on delete cascade primary key,
  max_chars int,
  prompt_text text,
  allowed_types text[] default array['text']
);

-- Indexes for performance
create index on public.products(category_id);
create index on public.products(is_active, is_featured);
create index on public.products(slug);
create index on public.products using gin(name gin_trgm_ops);

-- RLS
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.occasions enable row level security;
alter table public.collections enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;

create policy "Public read products" on public.products for select using (is_active = true);
create policy "Public read categories" on public.categories for select using (is_active = true);
create policy "Public read occasions" on public.occasions for select using (is_active = true);
create policy "Public read collections" on public.collections for select using (is_active = true);
create policy "Public read product images" on public.product_images for select using (true);
create policy "Public read product variants" on public.product_variants for select using (is_active = true);
