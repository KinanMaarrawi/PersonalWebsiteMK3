-- Experience, rendered as `git log --graph`: the degree is `main`, each role is a
-- branch that forks at its start date and merges back at its end date (or stays
-- open while ongoing). Milestones are extra commits on main. Order comes from the
-- dates, so there is no sort_order.
create table if not exists public.experience (
  id          uuid primary key default gen_random_uuid(),
  published   boolean not null default true,
  kind        text not null check (kind in ('degree', 'milestone', 'role')),
  branch      text not null default '' check (branch ~ '^[a-z0-9/_.-]{0,40}$'),
  title_en    text not null check (length(trim(title_en)) > 0),
  title_ar    text not null check (length(trim(title_ar)) > 0),
  org_en      text not null default '',
  org_ar      text not null default '',
  start_date  date not null,
  end_date    date check (end_date is null or end_date >= start_date),
  summary_en  text not null default '',
  summary_ar  text not null default '',
  did_en      text[] not null default '{}',
  did_ar      text[] not null default '{}',
  learned_en  text[] not null default '{}',
  learned_ar  text[] not null default '{}',
  tech        text[] not null default '{}',
  project_id  uuid references public.projects (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists experience_published_start_idx
  on public.experience (start_date desc)
  where published;

create index if not exists experience_project_id_idx
  on public.experience (project_id);

create trigger experience_touch_updated_at
  before update on public.experience
  for each row execute function private.touch_updated_at();

alter table public.experience enable row level security;

create policy experience_anon_read_published on public.experience
  for select to anon
  using (published);

create policy experience_auth_read on public.experience
  for select to authenticated
  using (published or (select private.is_admin()));

create policy experience_admin_insert on public.experience
  for insert to authenticated
  with check ((select private.is_admin()));

create policy experience_admin_update on public.experience
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy experience_admin_delete on public.experience
  for delete to authenticated
  using ((select private.is_admin()));

-- Seed. The degree and the Birmingham year are known. The three roles are added
-- unpublished with placeholder dates, to be corrected and published from /admin.
insert into public.experience
  (kind, branch, published, title_en, title_ar, org_en, org_ar, start_date, end_date, summary_en, summary_ar)
values
  ('degree', 'main', true,
   'MEng Computer Science with Software Engineering', 'MEng علوم حاسوب مع هندسة برمجيات',
   'University of Birmingham Dubai', 'جامعة برمنغهام دبي',
   '2023-09-01', '2028-06-30',
   'Integrated master''s. Studying in Dubai, with the final MEng year at the Birmingham campus in the UK.',
   'ماجستير متكامل. عم أدرس بدبي، والسنة الأخيرة من الـMEng رح تكون بحرم برمنغهام ببريطانيا.'),
  ('milestone', 'main', true,
   'Final MEng year at the Birmingham campus', 'السنة الأخيرة من الـMEng بحرم برمنغهام',
   'University of Birmingham', 'جامعة برمنغهام',
   '2027-09-01', null, '', '');

insert into public.experience
  (kind, branch, published, title_en, title_ar, org_en, org_ar, start_date, project_id)
select 'role', 'internship/dorz', false, 'Software Engineering Intern', 'متدرب هندسة برمجيات', 'DORZ', 'DORZ',
       '2025-01-01', (select id from public.projects where slug = 'dorz');

insert into public.experience
  (kind, branch, published, title_en, title_ar, org_en, org_ar, start_date)
values
  ('role', 'club/sea', false, 'Head of Volunteers', 'مسؤول المتطوعين', 'SEA', 'SEA', '2025-01-01'),
  ('role', 'club/180dc', false, 'Consultant', 'مستشار', '180 Degrees Consulting UoBD', '180 Degrees Consulting UoBD', '2025-01-01');
