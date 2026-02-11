-- 1. Ensure the bucket is public (Update instead of Insert to avoid duplicates)
update storage.buckets
set public = true
where id = 'products';

-- 2. Drop ALL existing policies for this bucket to start clean
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Uploads" on storage.objects;
drop policy if exists "Authenticated Updates" on storage.objects;
drop policy if exists "Authenticated Deletes" on storage.objects;
drop policy if exists "Authenticated Permissive" on storage.objects;

-- 3. Create a Single Permissive Policy for Authenticated Users (Insert, Update, Delete)
create policy "Authenticated Permissive"
  on storage.objects
  for all
  to authenticated
  using ( bucket_id = 'products' )
  with check ( bucket_id = 'products' );

-- 4. Re-create Public Read Access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );
