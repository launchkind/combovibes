-- Product reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  images text[],
  is_verified_purchase boolean default false,
  is_approved boolean default false,
  created_at timestamptz default now() not null,
  unique(product_id, user_id, order_id)
);

-- Update product rating on review change
create or replace function public.update_product_rating()
returns trigger language plpgsql as $$
begin
  update public.products
  set
    rating_average = (
      select round(avg(rating)::numeric, 2)
      from public.reviews
      where product_id = coalesce(new.product_id, old.product_id)
        and is_approved = true
    ),
    rating_count = (
      select count(*)
      from public.reviews
      where product_id = coalesce(new.product_id, old.product_id)
        and is_approved = true
    )
  where id = coalesce(new.product_id, old.product_id);
  return coalesce(new, old);
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_product_rating();

alter table public.reviews enable row level security;

create policy "Public read approved reviews" on public.reviews for select using (is_approved = true);
create policy "Users create reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users update own reviews" on public.reviews for update using (auth.uid() = user_id);
