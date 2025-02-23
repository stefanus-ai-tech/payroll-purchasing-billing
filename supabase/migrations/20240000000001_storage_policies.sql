-- Create policies for purchase-requests storage bucket
begin;
  -- Allow authenticated users to upload files
  create policy "Allow authenticated uploads"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'purchase-requests' AND
    auth.uid() = auth.uid()
  );

  -- Allow authenticated users to update their own files
  create policy "Allow authenticated updates"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'purchase-requests' AND
    auth.uid() = owner
  );

  -- Allow public read access
  create policy "Allow public read"
  on storage.objects for select
  to public
  using (bucket_id = 'purchase-requests');
commit;
