-- Optional git ref label shown next to a commit's hash, e.g. "tag: year-1".
alter table public.experience
  add column if not exists ref text not null default '' check (length(ref) <= 40);
