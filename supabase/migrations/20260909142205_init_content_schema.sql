-- Portfolio content backend: projects, site settings, and admin-gated writes.
create schema if not exists private;

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  sort_order     integer not null default 0,
  published      boolean not null default true,
  title          text not null check (length(trim(title)) > 0),
  github_url     text not null check (github_url ~ '^https://'),
  tech           text not null check (length(trim(tech)) > 0),
  image_path     text,
  description_en text not null check (length(trim(description_en)) > 0),
  description_ar text not null check (length(trim(description_ar)) > 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists projects_published_sort_idx
  on public.projects (sort_order)
  where published;

create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function private.touch_updated_at();

alter table public.projects enable row level security;

create policy projects_anon_read_published on public.projects
  for select to anon
  using (published);

create policy projects_auth_read on public.projects
  for select to authenticated
  using (published or (select private.is_admin()));

create policy projects_admin_insert on public.projects
  for insert to authenticated
  with check ((select private.is_admin()));

create policy projects_admin_update on public.projects
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy projects_admin_delete on public.projects
  for delete to authenticated
  using ((select private.is_admin()));

create table if not exists public.site_settings (
  id            integer primary key default 1 check (id = 1),
  email         text not null,
  linkedin_url  text not null,
  github_url    text not null,
  cv_updated_at timestamptz,
  updated_at    timestamptz not null default now()
);

create trigger site_settings_touch_updated_at
  before update on public.site_settings
  for each row execute function private.touch_updated_at();

alter table public.site_settings enable row level security;

create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated
  using (true);

create policy site_settings_admin_update on public.site_settings
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

create policy public_assets_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'public-assets');

create policy public_assets_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'public-assets' and (select private.is_admin()));

create policy public_assets_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'public-assets' and (select private.is_admin()))
  with check (bucket_id = 'public-assets' and (select private.is_admin()));

create policy public_assets_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'public-assets' and (select private.is_admin()));
