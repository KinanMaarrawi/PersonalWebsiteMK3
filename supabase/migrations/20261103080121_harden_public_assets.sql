-- Public buckets serve files by URL without any SELECT policy. The old anon/auth
-- SELECT policy only added the ability to *list* every object in the bucket, so
-- listing is now admin-only (admins still need SELECT for upserts like the CV).
drop policy if exists public_assets_read on storage.objects;

create policy public_assets_admin_read on storage.objects
  for select to authenticated
  using (bucket_id = 'public-assets' and (select private.is_admin()));

-- Only what the admin actually uploads: images and the CV, 10 MB at most.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/webp', 'image/png', 'image/jpeg', 'image/avif', 'image/gif', 'application/pdf']
where id = 'public-assets';
