-- Udhar (Credit) Management
create table if not exists public.udhar_records (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  phone text,
  amount decimal not null,
  description text,
  is_paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stock/Inventory Management
create table if not exists public.stock_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  quantity decimal not null default 0,
  unit text not null, -- kg, liters, pcs, etc.
  min_threshold decimal default 5, -- for low stock warning
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.udhar_records enable row level security;
alter table public.stock_items enable row level security;

-- Policies (Admin only for both)
create policy "Admins can manage udhar" on public.udhar_records for all using (auth.role() = 'authenticated');
create policy "Admins can manage stock" on public.stock_items for all using (auth.role() = 'authenticated');
