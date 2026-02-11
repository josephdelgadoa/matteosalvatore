-- Create a new private bucket 'products'
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- Policy to allow public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy to allow authenticated uploads
create policy "Authenticated Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Policy to allow authenticated deletes
create policy "Authenticated Deletes"
  on storage.objects for delete
  using ( bucket_id = 'products' and auth.role() = 'authenticated' );
