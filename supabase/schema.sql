-- Create Products Table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name_en text not null,
  name_es text not null,
  description_en text,
  description_es text,
  price numeric(10, 2) not null, -- Price in PEN
  category text not null, -- 'pants', 'shirts', 'hoodies', 'shoes'
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Stock Table (managing inventory by size/color)
create table public.stock (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  size text not null, -- 'S', 'M', 'L', 'XL' or shoe size
  color text not null,
  quantity integer default 0 not null,
  unique(product_id, size, color)
);

-- Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_email text not null, -- Guest checkout possible, so email is key
  shipping_address jsonb not null,
  status text default 'pending' not null, -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
  total_amount numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  size text not null,
  color text not null,
  quantity integer default 1 not null,
  unit_price numeric(10, 2) not null -- Price at time of purchase
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.stock enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies (Public Read for Products)
create policy "Allow public read access" on public.products for select using (true);
create policy "Allow public read access" on public.stock for select using (true);

-- Policies (Users can read their own orders - simplified for now)
-- In a real app, we'd check auth.uid(), but for guest checkout we might need a secure token or cookie.
-- For now, allowing insert for public (creation) and select if email matches (needs auth).
create policy "Allow public insert" on public.orders for insert with check (true);
create policy "Allow public insert" on public.order_items for insert with check (true);
