-- Moves the About terminal, hero role/tagline and tech stack out of src/i18n.js.

create table if not exists public.about_sections (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9_-]{1,24}$'),
  sort_order   integer not null default 0,
  published    boolean not null default true,
  image_path   text,
  image_alt_en text not null default '',
  image_alt_ar text not null default '',
  -- One rendered line per newline. The ">slug" prompt line is drawn by the frontend.
  body_en      text not null check (length(trim(body_en)) > 0),
  body_ar      text not null check (length(trim(body_ar)) > 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists about_sections_published_sort_idx
  on public.about_sections (sort_order)
  where published;

create trigger about_sections_touch_updated_at
  before update on public.about_sections
  for each row execute function private.touch_updated_at();

alter table public.about_sections enable row level security;

create policy about_sections_anon_read_published on public.about_sections
  for select to anon
  using (published);

create policy about_sections_auth_read on public.about_sections
  for select to authenticated
  using (published or (select private.is_admin()));

create policy about_sections_admin_insert on public.about_sections
  for insert to authenticated
  with check ((select private.is_admin()));

create policy about_sections_admin_update on public.about_sections
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy about_sections_admin_delete on public.about_sections
  for delete to authenticated
  using ((select private.is_admin()));

alter table public.site_settings
  add column if not exists stack_items     text[] not null default '{}',
  add column if not exists hero_role_en    text not null default '',
  add column if not exists hero_role_ar    text not null default '',
  add column if not exists hero_tagline_en text not null default '',
  add column if not exists hero_tagline_ar text not null default '';

-- Seed: today's content with mechanical fixes only (year, degree name, typos,
-- Arabic punctuation, the missing Arabic "currently" line). Rewording is left to
-- the owner via /admin.
insert into public.about_sections (slug, sort_order, image_path, image_alt_en, image_alt_ar, body_en, body_ar)
values
  ('whoami', 10, '/about-whoami.webp', 'Kinan Maarrawi portrait', 'صورة لكنان المعراوي',
   E'I’m a Computer Science student who likes building things that feel useful, not just impressive in a demo.\nI care about the parts people do not always see: how systems are designed, how they fail, how they stay secure, and how they become something real people can actually use.\nMEng Computer Science with Software Engineering (Year 3) @ University of Birmingham Dubai',
   E'أنا طالب علوم حاسوب، بحب برمج وإشتغل ع مشاريع مو بس شكل، من المهم عندي تكون المشاريع فعلاً مفيدة.\nبهتم بالتفاصيل اللي الناس غالباً ما بتشوفها: كيف النظام بينبنى، وين ممكن يوقع، كيف منخليه آمن، وكيف منصممه ليصير شي حقيقي الناس تقدر تستخدمه بسهولة.\nحالياً، عم أدرس MEng علوم حاسوب مع هندسة برمجيات - السنة الثالثة بجامعة برمنغهام دبي'),
  ('origin', 20, '/about-origin.webp', 'Kinan Maarrawi outdoors', 'كنان المعراوي في الخارج',
   E'From Damascus, Syria\nRaised in Dubai\nI’m Syrian, and I grew up in Dubai, so a lot of who I am comes from both places. Syria is not just where my family is from, and Dubai is not just where I lived. Both shaped how I think: stay practical, adapt quickly, and build things that have real value instead of just looking good.',
   E'من دمشق، سوريا\nعشت وكبرت بدبي\nأنا سوري وكبرت بدبي، فطبيعي جزء كبير مني جاي من المكانين. سوريا بالنسبة إلي مو بس وطن، ودبي مو بس مدينة عشت فيها. التنين شكلوا طريقة تفكيري: كون عملي، أتأقلم بسرعة، وأبني شي له قيمة بدل ما يكون بس شكل.'),
  ('interests', 30, '/about-interests.webp', 'Kinan Maarrawi by a car', 'كنان المعراوي بجانب سيارة',
   E'Linux\nPC hardware + homelabbing\nOutside of tech, I''m into cars, fitness, music and history.',
   E'Linux\nالكمبيوترات والهاردوير\nوخارج عالم التكنولوجيا: بحب السيارات، الرياضة، الموسيقى، والتاريخ.'),
  ('currently', 40, '/about-currently.webp', 'Kinan Maarrawi in a city setting', 'كنان المعراوي في أجواء مدينة',
   E'Working through uni assignments\nBuilding projects that teach me something useful\nTrying to become a better software engineer while still having a life outside my computer screen',
   E'عم حاول خلّص شغل الجامعة\nبشتغل ع مشاريع بتعلمني شي مفيد لما يكون عندي وقت\nعم حاول صير مهندس برمجيات أحسن، بس من دون ما تكون كل حياتي قدام الشاشة')
on conflict (slug) do nothing;

update public.site_settings
set stack_items  = array['Java', 'Python', 'JavaScript', 'Kotlin', 'Haskell', 'C', 'SQL', 'React', 'Git', 'Linux'],
    hero_role_en = 'CS Student @ UoB Dubai',
    hero_role_ar = 'طالب علوم حاسوب @ جامعة برمنغهام دبي'
where id = 1 and stack_items = '{}';
