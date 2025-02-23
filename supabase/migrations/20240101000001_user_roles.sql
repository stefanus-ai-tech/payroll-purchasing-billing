create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  role_id uuid not null,
  created_at timestamp with time zone default now(),
  foreign key (role_id) references public.roles(id)
);

create index if not exists user_roles_role_id_idx on public.user_roles(role_id);
create index if not exists user_roles_user_id_idx on public.user_roles(user_id);
