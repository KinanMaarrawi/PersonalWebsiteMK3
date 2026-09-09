-- Replaces the SECURITY DEFINER RPC with a plain self-read policy. A signed-in user
-- can read their own admins row and nothing else, which is all the UI needed in order
-- to tell "signed in but not authorised" apart from "authorised".
--
-- This removes a SECURITY DEFINER function from the exposed API surface entirely.
-- private.is_admin() stays: policies still need it to consult admins without
-- recursing through this policy, and it lives outside the exposed schema.

drop function if exists public.is_current_user_admin();

create policy admins_read_self on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

comment on table public.admins is
  'Write access control list. A user may read only their own row; all writes are service-role only.';
