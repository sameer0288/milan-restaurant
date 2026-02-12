-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Table: Menu Items
create table public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal not null,
  category text not null,
  image_url text,
  is_veg boolean default true,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Menu Highlights
create table public.menu_highlights (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text not null,
  price text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Menu Scans
create table public.menu_scans (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Reviews
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  image_url text,
  is_approved boolean default false, -- Admin can approve reviews
  owner_response text, -- Admin response
  source text default 'Website', -- e.g., 'Google', 'Website'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Messages (Contact Form)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Settings (Global Config)
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Home Hero Images
create table public.hero_images (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Makrana Banner Images
create table public.makrana_images (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Staff Management
create table public.staff (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  phone text,
  email text,
  aadhar text, -- Unique ID
  date_of_joining text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.menu_items enable row level security;
alter table public.menu_highlights enable row level security;
alter table public.menu_scans enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;
alter table public.hero_images enable row level security;
alter table public.makrana_images enable row level security;
alter table public.staff enable row level security;

-- Policies: Public Read Access
create policy "Public items are viewable by everyone" on public.menu_items for select using (true);
create policy "Public highlights are viewable by everyone" on public.menu_highlights for select using (true);
create policy "Public scans are viewable by everyone" on public.menu_scans for select using (true);
create policy "Approved reviews are viewable by everyone" on public.reviews for select using (is_approved = true);
create policy "Public settings are viewable by everyone" on public.settings for select using (true);
create policy "Public hero images are viewable by everyone" on public.hero_images for select using (true);
create policy "Public makrana images are viewable by everyone" on public.makrana_images for select using (true);
create policy "Public staff are viewable by everyone" on public.staff for select using (true);

-- Policies: Admin Write Access (Assuming authenticated users are admins for simplicity in this setup, or specifically check role)
-- For now, allow authenticated users to perform all actions. In production, restrict this to specific user IDs or roles.
create policy "Admins can insert items" on public.menu_items for insert with check (auth.role() = 'authenticated');
create policy "Admins can update items" on public.menu_items for update using (auth.role() = 'authenticated');
create policy "Admins can delete items" on public.menu_items for delete using (auth.role() = 'authenticated');

-- Repeat for other tables... 
-- Reviews: Public can insert (with limited fields?), usually better to use Edge Function or allow insert with RLS constraint.
create policy "Anyone can insert reviews" on public.reviews for insert with check (true);
-- Reviews: Only admin can update (approve) or delete
create policy "Admins can update reviews" on public.reviews for update using (auth.role() = 'authenticated');
create policy "Admins can delete reviews" on public.reviews for delete using (auth.role() = 'authenticated');

-- Messages: Public can insert
create policy "Anyone can insert messages" on public.messages for insert with check (true);
-- Messages: Only admin can read/update/delete
create policy "Admins can view messages" on public.messages for select using (auth.role() = 'authenticated');
-- Note: Insert policy handles creation. Read policy restricts viewing.

-- Settings: Admin only write
create policy "Admins can update settings" on public.settings for update using (auth.role() = 'authenticated');
create policy "Admins can insert settings" on public.settings for insert with check (auth.role() = 'authenticated');

-- Highlights/Scans/Hero/Makrana/Staff: Admin write
create policy "Admins can manage highlights" on public.menu_highlights for all using (auth.role() = 'authenticated');
create policy "Admins can manage scans" on public.menu_scans for all using (auth.role() = 'authenticated');
create policy "Admins can manage hero images" on public.hero_images for all using (auth.role() = 'authenticated');
create policy "Admins can manage makrana images" on public.makrana_images for all using (auth.role() = 'authenticated');
create policy "Admins can manage staff" on public.staff for all using (auth.role() = 'authenticated');

-- Storage Buckets Setup (You must create 'images' bucket in Supabase Dashboard -> Storage)
-- Policy for Storage:
-- INSERT: Authenticated users (Admins) can upload. Public (Reviews) can upload?
-- SELECT: Public can download.
-- Table: Gallery
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  alt_text text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gallery enable row level security;
create table public.gallery enable row level security;
create policy "Public gallery viewable by everyone" on public.gallery for select using (true);
create policy "Admins can manage gallery" on public.gallery for all using (auth.role() = 'authenticated');
