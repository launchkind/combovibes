-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- User addresses
create table public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text default 'Home',
  name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now() not null
);

-- Notification preferences
create table public.notification_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  order_updates boolean default true,
  promotions boolean default true,
  reminders boolean default true,
  sms_enabled boolean default true,
  email_enabled boolean default true
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  insert into public.notification_preferences (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.notification_preferences enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can manage own addresses" on public.addresses for all using (auth.uid() = user_id);
create policy "Users can manage own notification prefs" on public.notification_preferences for all using (auth.uid() = user_id);
