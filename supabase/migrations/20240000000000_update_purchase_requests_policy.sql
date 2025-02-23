-- Drop existing policies if any
drop policy if exists "Enable insert for authenticated users only" on "public"."purchase_requests";

-- Create new policy that allows authenticated users to insert
create policy "Enable insert for authenticated users only"
on "public"."purchase_requests"
for insert
to authenticated
with check (true);
