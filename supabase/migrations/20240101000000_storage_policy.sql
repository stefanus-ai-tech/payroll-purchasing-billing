create policy "Allow authenticated users to upload files"
on storage.objects for insert
to authenticated
using (
  bucket_id = 'purchase-requests' AND
  auth.uid() = auth.uid()
);

create policy "Allow authenticated users to read files"
on storage.objects for select
to authenticated
using (bucket_id = 'purchase-requests');
