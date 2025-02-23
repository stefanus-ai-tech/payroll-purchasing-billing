-- Create storage policies for purchase-requests bucket
begin;
  -- Create bucket if it doesn't exist
  insert into storage.buckets (id, name)
  values ('purchase-requests', 'purchase-requests')
  on conflict do nothing;

  -- Enable RLS on the bucket
  alter table storage.objects enable row level security;

  -- Allow all users to upload files
  create policy "Allow all uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'purchase-requests'
  );

  -- Allow authenticated users to read files
  create policy "Allow authenticated downloads"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'purchase-requests');

  -- Allow authenticated users to update their own files
  create policy "Allow authenticated updates"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'purchase-requests' and auth.uid() = owner);

  -- Allow authenticated users to delete their own files
  create policy "Allow authenticated deletes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'purchase-requests' and auth.uid() = owner);
commit;
