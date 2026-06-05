-- Inventory tracking per product variant
create table public.inventory (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity int not null default 0,
  reserved_quantity int not null default 0,
  low_stock_threshold int default 10,
  updated_at timestamptz default now() not null,
  unique(product_id, variant_id)
);

-- Reserve inventory (called at checkout)
create or replace function public.reserve_inventory(
  p_product_id uuid,
  p_variant_id uuid,
  p_quantity int
) returns boolean language plpgsql security definer as $$
declare
  v_available int;
begin
  select (quantity - reserved_quantity) into v_available
  from public.inventory
  where product_id = p_product_id
    and (variant_id = p_variant_id or (variant_id is null and p_variant_id is null));

  if v_available < p_quantity then
    return false;
  end if;

  update public.inventory
  set reserved_quantity = reserved_quantity + p_quantity,
      updated_at = now()
  where product_id = p_product_id
    and (variant_id = p_variant_id or (variant_id is null and p_variant_id is null));

  return true;
end;
$$;

-- Release reservation (on cancellation / expiry)
create or replace function public.release_inventory(
  p_product_id uuid,
  p_variant_id uuid,
  p_quantity int
) returns void language plpgsql security definer as $$
begin
  update public.inventory
  set reserved_quantity = greatest(0, reserved_quantity - p_quantity),
      updated_at = now()
  where product_id = p_product_id
    and (variant_id = p_variant_id or (variant_id is null and p_variant_id is null));
end;
$$;

alter table public.inventory enable row level security;
create policy "Public read inventory" on public.inventory for select using (true);
