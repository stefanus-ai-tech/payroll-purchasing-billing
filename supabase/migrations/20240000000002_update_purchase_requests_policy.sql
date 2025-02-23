-- Drop existing policies
drop policy if exists "Enable insert for authenticated users only" on "public"."purchase_requests";

-- Create comprehensive policies
begin;
  -- Allow insert for authenticated users
  create policy "Enable insert for all users"
  on "public"."purchase_requests"
  for insert
  using (true);

  -- Allow read access for all authenticated users
  create policy "Enable read access for authenticated users"
  on "public"."purchase_requests"
  for select to authenticated
  using (true);

  -- Allow update for authenticated users
  create policy "Enable update for authenticated users"
  on "public"."purchase_requests"
  for update to authenticated
  using (auth.uid() IS NOT NULL);

  -- Allow delete for authenticated users
  create policy "Enable delete for authenticated users"
  on "public"."purchase_requests"
  for delete to authenticated
  using (auth.uid() IS NOT NULL);
commit;
