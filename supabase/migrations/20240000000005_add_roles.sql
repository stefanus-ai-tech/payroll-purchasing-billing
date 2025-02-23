begin;

  -- Create roles table
  create table roles (
    id text primary key,
    name text not null unique
  );

  -- Insert default roles
  insert into roles (id, name) values
    ('admin', 'Admin'),
    ('approval_leader', 'Approval Leader'),
    ('nom', 'NOM'),
    ('sm', 'SM');

  -- Create user_roles table
  create table user_roles (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    role_id text references roles(id) not null,
    unique (user_id, role_id)
  );
  
  -- Enable RLS for user_roles
  alter table user_roles enable row level security;

  -- Policies for user_roles table
    -- Admins can manage all user roles
  create policy "Admins can manage all user roles" on user_roles
    for all to authenticated using (
      exists (
        select 1
        from user_roles ur
        join roles r on ur.role_id = r.id
        where ur.user_id = auth.uid() and r.name = 'Admin'
      )
    );

    -- Users can see their own roles
    create policy "Users can see their own roles" on user_roles
      for select to authenticated using (auth.uid() = user_id);

commit;
