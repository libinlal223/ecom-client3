-- Update RLS policies to restrict write access to authenticated users

-- 1. Categories Table
alter table categories enable row level security;

drop policy if exists "Enable read access for all users" on categories;
create policy "Enable read access for all users" on categories for select using (true);

drop policy if exists "Enable insert for all users" on categories;
create policy "Enable insert for authenticated users only" on categories for insert to authenticated with check (true);

drop policy if exists "Enable update for all users" on categories;
create policy "Enable update for authenticated users only" on categories for update to authenticated using (true);

drop policy if exists "Enable delete for all users" on categories;
create policy "Enable delete for authenticated users only" on categories for delete to authenticated using (true);

-- 2. Subcategories Table
alter table sub_categories enable row level security;

drop policy if exists "Enable read access for all users" on sub_categories;
create policy "Enable read access for all users" on sub_categories for select using (true);

drop policy if exists "Enable insert for all users" on sub_categories;
create policy "Enable insert for authenticated users only" on sub_categories for insert to authenticated with check (true);

drop policy if exists "Enable update for all users" on sub_categories;
create policy "Enable update for authenticated users only" on sub_categories for update to authenticated using (true);

drop policy if exists "Enable delete for all users" on sub_categories;
create policy "Enable delete for authenticated users only" on sub_categories for delete to authenticated using (true);

-- 3. Products Table
alter table products enable row level security;

drop policy if exists "Enable read access for all users" on products;
create policy "Enable read access for all users" on products for select using (true);

drop policy if exists "Enable insert for all users" on products;
create policy "Enable insert for authenticated users only" on products for insert to authenticated with check (true);

drop policy if exists "Enable update for all users" on products;
create policy "Enable update for authenticated users only" on products for update to authenticated using (true);

drop policy if exists "Enable delete for all users" on products;
create policy "Enable delete for authenticated users only" on products for delete to authenticated using (true);

-- 4. Product Images Table
alter table product_images enable row level security;

drop policy if exists "Enable read access for all users" on product_images;
create policy "Enable read access for all users" on product_images for select using (true);

drop policy if exists "Enable insert for all users" on product_images;
create policy "Enable insert for authenticated users only" on product_images for insert to authenticated with check (true);

drop policy if exists "Enable update for all users" on product_images;
create policy "Enable update for authenticated users only" on product_images for update to authenticated using (true);

drop policy if exists "Enable delete for all users" on product_images;
create policy "Enable delete for authenticated users only" on product_images for delete to authenticated using (true);

-- 5. Storage Policies (Updated for security)
-- Ensure storage bucket exists
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Give public access to images" on storage.objects;
create policy "Give public access to images" on storage.objects for select using ( bucket_id = 'product-images' );

drop policy if exists "Enable upload for all users" on storage.objects;
create policy "Enable upload for authenticated users only" on storage.objects for insert to authenticated with check ( bucket_id = 'product-images' );

drop policy if exists "Enable delete for all users" on storage.objects;
create policy "Enable delete for authenticated users only" on storage.objects for delete to authenticated using ( bucket_id = 'product-images' );

drop policy if exists "Enable update for all users" on storage.objects;
create policy "Enable update for authenticated users only" on storage.objects for update to authenticated using ( bucket_id = 'product-images' );
