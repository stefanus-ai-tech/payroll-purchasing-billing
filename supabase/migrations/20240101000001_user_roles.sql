create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

alter table if exists public.user_roles
add column if not exists role_id text references public.roles(id);

create index if not exists user_roles_role_id_idx on public.user_roles(role_id);
