-- Vendor profiles
create table public.vendors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  business_name text not null,
  gst_number text,
  pan_number text,
  bank_account_number text,
  bank_ifsc text,
  bank_name text,
  status text default 'pending' check (status in ('pending', 'active', 'suspended')),
  commission_percent numeric(5,2) default 10,
  created_at timestamptz default now() not null
);

-- Vendor order assignments
create table public.vendor_order_items (
  id uuid default gen_random_uuid() primary key,
  vendor_id uuid references public.vendors(id) not null,
  order_item_id uuid references public.order_items(id) on delete cascade not null,
  status text default 'assigned'
    check (status in ('assigned', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  assigned_at timestamptz default now() not null,
  accepted_at timestamptz,
  ready_at timestamptz,
  notes text
);

alter table public.vendors enable row level security;
alter table public.vendor_order_items enable row level security;

create policy "Vendors view own profile" on public.vendors for select using (auth.uid() = user_id);
create policy "Vendors update own profile" on public.vendors for update using (auth.uid() = user_id);
create policy "Vendors view own order items" on public.vendor_order_items for select
  using (exists (select 1 from public.vendors where vendors.id = vendor_order_items.vendor_id and vendors.user_id = auth.uid()));
