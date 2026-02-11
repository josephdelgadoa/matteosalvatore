-- 1. Create bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- 2. Drop existing policies to allow updates
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Uploads" on storage.objects;
drop policy if exists "Authenticated Updates" on storage.objects;
drop policy if exists "Authenticated Deletes" on storage.objects;

-- 3. Re-create policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy to allow authenticated uploads (Explicitly to authenticated role)
create policy "Authenticated Uploads"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'products' );

-- Policy to allow authenticated updates
create policy "Authenticated Updates"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'products' );

-- Policy to allow authenticated deletes
create policy "Authenticated Deletes"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'products' );
