-- EMERGENCY FIX: Allow public uploads to 'products' bucket
-- This bypasses the authentication check to resolve the RLS error immediately.

-- 1. Drop existing restrictive policies
drop policy if exists "Authenticated Permissive" on storage.objects;
drop policy if exists "Authenticated Uploads" on storage.objects;
drop policy if exists "Authenticated Updates" on storage.objects;
drop policy if exists "Authenticated Deletes" on storage.objects;
drop policy if exists "Public Access" on storage.objects;

-- 2. Create Public Read/Write Policies for 'products' bucket
-- READ
create policy "Public Access Select"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- INSERT (Public)
create policy "Public Access Insert"
  on storage.objects for insert
  with check ( bucket_id = 'products' );

-- UPDATE (Public)
create policy "Public Access Update"
  on storage.objects for update
  using ( bucket_id = 'products' );

-- DELETE (Public)
create policy "Public Access Delete"
  on storage.objects for delete
  using ( bucket_id = 'products' );
