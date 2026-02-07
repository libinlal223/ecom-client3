-- Enable UUID extension first
create extension if not exists "uuid-ossp";

-- 1. Categories Table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Subcategories Table
create table if not exists sub_categories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products Table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric,
  features text, -- Stored as JSON string
  sub_category_id uuid references sub_categories(id) on delete set null,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Product Images Table
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Storage Bucket (Idempotent)
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 6. Row Level Security Policies (Open access for simplicity as requested)
-- Enable RLS
alter table categories enable row level security;
alter table sub_categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;

-- Create policies (Check if they exist first or drop them to be safe, but simple Create is fine for fresh run)
-- Note: 'do nothing' on conflict not available for policies, so we wrap in a block or just error out if exists.
-- For this script, we assume fresh or simple "create if not exists" style via specific names.

drop policy if exists "Enable read access for all users" on categories;
create policy "Enable read access for all users" on categories for select using (true);
drop policy if exists "Enable insert for all users" on categories;
create policy "Enable insert for all users" on categories for insert with check (true);
drop policy if exists "Enable delete for all users" on categories;
create policy "Enable delete for all users" on categories for delete using (true);

drop policy if exists "Enable read access for all users" on sub_categories;
create policy "Enable read access for all users" on sub_categories for select using (true);
drop policy if exists "Enable insert for all users" on sub_categories;
create policy "Enable insert for all users" on sub_categories for insert with check (true);
drop policy if exists "Enable delete for all users" on sub_categories;
create policy "Enable delete for all users" on sub_categories for delete using (true);

drop policy if exists "Enable read access for all users" on products;
create policy "Enable read access for all users" on products for select using (true);
drop policy if exists "Enable insert for all users" on products;
create policy "Enable insert for all users" on products for insert with check (true);
drop policy if exists "Enable update for all users" on products;
create policy "Enable update for all users" on products for update using (true);
drop policy if exists "Enable delete for all users" on products;
create policy "Enable delete for all users" on products for delete using (true);

drop policy if exists "Enable read access for all users" on product_images;
create policy "Enable read access for all users" on product_images for select using (true);
drop policy if exists "Enable insert for all users" on product_images;
create policy "Enable insert for all users" on product_images for insert with check (true);
drop policy if exists "Enable delete for all users" on product_images;
create policy "Enable delete for all users" on product_images for delete using (true);

-- Storage Policies
drop policy if exists "Give public access to images" on storage.objects;
create policy "Give public access to images" on storage.objects for select using ( bucket_id = 'product-images' );

drop policy if exists "Enable upload for all users" on storage.objects;
create policy "Enable upload for all users" on storage.objects for insert with check ( bucket_id = 'product-images' );

drop policy if exists "Enable delete for all users" on storage.objects;
create policy "Enable delete for all users" on storage.objects for delete using ( bucket_id = 'product-images' );
