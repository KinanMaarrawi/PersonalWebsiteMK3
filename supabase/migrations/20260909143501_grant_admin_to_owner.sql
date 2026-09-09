-- Grants write access to the site owner's GitHub account. Looked up by GitHub login
-- rather than a hardcoded uuid so this migration is reproducible on a fresh project.
insert into public.admins (user_id)
select id from auth.users
where raw_user_meta_data->>'user_name' = 'KinanMaarrawi'
on conflict (user_id) do nothing;
