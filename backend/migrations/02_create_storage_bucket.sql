-- Create a new private bucket 'products'
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- Policy to allow public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- Policy to allow authenticated uploads (Explicitly to authenticated role)
create policy "Authenticated Uploads"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'products' );

-- Policy to allow authenticated deletes (Explicitly to authenticated role)
create policy "Authenticated Updates"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'products' );

create policy "Authenticated Deletes"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'products' );
