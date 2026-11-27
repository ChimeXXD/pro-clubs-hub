-- ProBuilds on Supabase (D-96, D-99 (2)): the shared builds behind probuilds.club/b/<id>.
-- For Chime to run once, in the Supabase dashboard's SQL editor, after creating the project (free tier).
-- Nothing here has been run; no project exists yet.
--
-- Then:
--   1. Cloudflare Pages → Settings → Environment variables, for Production and Preview:
--        NEXT_PUBLIC_SUPABASE_URL       = the project URL (https://<ref>.supabase.co)
--        NEXT_PUBLIC_SUPABASE_ANON_KEY  = the project's anon (public) key
--      Both are public by design; the anon key can only do what the functions below allow.
--      Never put the service_role key in the site or the repo.
--   2. Rename src/app/b/page.preview.tsx to page.tsx when Submit can share builds, so /b/<id> is on probuilds.club.
--
-- How it works: the table is closed to the anon key (row-level security on, no policies). Two functions are the only
-- way in: shared_build(share_id) reads one build by its id (so nobody can list every shared build), and
-- create_shared_build(build) stores one and returns its new id. The site validates every build it reads against
-- docs/FORMAT.md before showing it (CLAUDE.md rule 6, src/lib/shared-build.ts); the database only checks its shape
-- and size. Submit (a later unit) calls create_shared_build through src/lib/supabase/client.ts (rpc).
-- Other tables (submissions for listing, D-99 (1); face requests and votes, D-84, D-96) are added by those units.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.shared_builds (
  -- Six characters from a 32-symbol alphabet with no 0, 1, l or o (probuilds.club/b/k7x2m9).
  id text primary key check (id ~ '^[a-z0-9]{6}$'),
  -- A build document as docs/FORMAT.md §Build describes, "status": "draft", no "sample".
  build jsonb not null check (jsonb_typeof(build) = 'object' and pg_column_size(build) <= 65536),
  created_at timestamptz not null default now(),
  -- Takedown (CLAUDE.md rule 8, D-10): set this and the link stops working; the row stays for the record.
  removed_at timestamptz
);

alter table public.shared_builds enable row level security;
-- No policies on purpose: the anon and signed-in roles can't select, insert, update or delete rows directly.
revoke all on table public.shared_builds from anon, authenticated;

-- A new random id. Each byte picks one of 32 symbols (256 is a multiple of 32, so every symbol is equally likely).
create or replace function public.new_share_id()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'abcdefghijkmnpqrstuvwxyz23456789';
  bytes bytea := extensions.gen_random_bytes(6);
  result text := '';
begin
  for i in 0..5 loop
    result := result || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  return result;
end;
$$;

-- One shared build by its id, or null (no such id, or taken down). Read only, so the site calls it with GET.
create or replace function public.shared_build(share_id text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select build from public.shared_builds where id = share_id and removed_at is null;
$$;

-- Stores a shared build and returns its new id. Refuses anything that isn't a draft build document without sample
-- figures; the site validates the rest when the link is opened.
create or replace function public.create_shared_build(build jsonb)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  new_id text;
begin
  if jsonb_typeof(build) <> 'object' or coalesce(build ->> 'status', '') <> 'draft' or build ? 'sample' then
    raise exception 'not a shared build' using errcode = '22023';
  end if;
  loop
    new_id := public.new_share_id();
    begin
      insert into public.shared_builds (id, build) values (new_id, build);
      return new_id;
    exception when unique_violation then
      -- That id is taken: draw another.
    end;
  end loop;
end;
$$;

revoke all on function public.new_share_id() from public, anon, authenticated;
revoke all on function public.shared_build(text) from public;
revoke all on function public.create_shared_build(jsonb) from public;
grant execute on function public.shared_build(text) to anon, authenticated;
grant execute on function public.create_shared_build(jsonb) to anon, authenticated;

-- TODO(Chime): no rate limit yet. Anyone with the anon key can call create_shared_build as often as they like, up to
-- 64 KB a build. Before launch, consider a per-address limit (PostgREST passes the caller's address in
-- current_setting('request.headers')) or turning on Supabase's bot protection.
