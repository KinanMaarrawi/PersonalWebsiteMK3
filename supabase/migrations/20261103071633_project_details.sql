-- Project popups: a stable slug for deep links (#project/<slug>) plus optional
-- detail fields. Every new field is optional; the popup falls back to the card's
-- short description when the long one is empty.
alter table public.projects
  add column if not exists slug                text,
  add column if not exists period              text not null default '',
  add column if not exists live_url            text check (live_url is null or live_url ~ '^https://'),
  add column if not exists long_description_en text not null default '',
  add column if not exists long_description_ar text not null default '',
  add column if not exists highlights_en       text[] not null default '{}',
  add column if not exists highlights_ar       text[] not null default '{}';

update public.projects set slug = case title
    when 'Säbener' then 'sabener'
    when 'Dorz ''Book a Ride''' then 'dorz'
    else trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
  end
where slug is null;

alter table public.projects
  alter column slug set not null,
  add constraint projects_slug_format check (slug ~ '^[a-z0-9-]{1,48}$'),
  add constraint projects_slug_key unique (slug);

-- Fill in a slug from the title when an insert leaves it out, so older admin builds
-- (and quick inserts) keep working.
create or replace function private.projects_default_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.slug is null or length(trim(new.slug)) = 0 then
    new.slug := left(trim(both '-' from regexp_replace(lower(new.title), '[^a-z0-9]+', '-', 'g')), 40)
      || '-' || substr(md5(random()::text), 1, 6);
  end if;
  return new;
end;
$$;

create trigger projects_default_slug
  before insert on public.projects
  for each row execute function private.projects_default_slug();
