-- ProBuilds on Supabase (D-96, D-99): the shared builds behind probuilds.club/b/<id> (D-99 (2)) and the builds sent
-- for listing from Submit a build (D-99 (1)).
-- For Chime to run once, in the Supabase dashboard's SQL editor, after creating the project (free tier).
-- Nothing here has been run; no project exists yet.
--
-- Then:
--   1. Cloudflare Pages → Settings → Environment variables, for Production and Preview:
--        NEXT_PUBLIC_SUPABASE_URL       = the project URL (https://<ref>.supabase.co)
--        NEXT_PUBLIC_SUPABASE_ANON_KEY  = the project's anon (public) key
--      Both are public by design; the anon key can only do what the functions below allow.
--      Never put the service_role key in the site or the repo.
--   2. Rename src/app/b/page.preview.tsx and src/app/submit/page.preview.tsx to page.tsx, so /b/<id> and /submit are on
--      probuilds.club (Submit also waits on the attribute prices, O-14, for its "AP left" counter).
--   3. Review builds sent for listing in Table Editor → submissions (status 'pending'); set status to 'listed' or
--      'rejected' once Chime has played it (D-30). Listing still means adding the build to content/builds/.
--
-- How it works: the table is closed to the anon key (row-level security on, no policies). Two functions are the only
-- way in: shared_build(share_id) reads one build by its id (so nobody can list every shared build), and
-- create_shared_build(build) stores one and returns its new id. The site validates every build it reads against
-- docs/FORMAT.md before showing it (CLAUDE.md rule 6, src/lib/shared-build.ts); the database only checks its shape
-- and size. Submit a build calls create_shared_build and submit_build through src/lib/supabase/client.ts (rpc,
-- src/lib/submit/send.ts). Face requests and votes (D-84, D-96) are further down.
--
-- Rate limits: each write counts the caller's recent writes by a hash of their address (client_hash below; the
-- address itself is never stored) and refuses past a limit, and every table has a ceiling for all callers together,
-- so a flood can't fill the free tier. Supabase's edge (Cloudflare) passes the caller's address in cf-connecting-ip,
-- which a caller can't set; the first address in x-forwarded-for is only a fallback, since a caller can put any
-- address there and so get a fresh hash on every call.
-- TODO(Chime): check in the dashboard which of the two headers carries the caller's address on your project (Logs →
-- API); if neither does, every caller shares one hash and only the overall ceilings apply.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.shared_builds (
  -- Six characters from a 32-symbol alphabet with no 0, 1, l or o (probuilds.club/b/k7x2m9).
  id text primary key check (id ~ '^[a-z0-9]{6}$'),
  -- A build document as docs/FORMAT.md §Build describes, "status": "draft", no "sample".
  build jsonb not null check (jsonb_typeof(build) = 'object' and pg_column_size(build) <= 65536),
  created_at timestamptz not null default now(),
  -- Takedown (CLAUDE.md rule 8, D-10): set this and the link stops working; the row stays for the record.
  removed_at timestamptz,
  -- client_hash() of whoever made it, for the rate limit.
  sender text not null default ''
);
alter table public.shared_builds add column if not exists sender text not null default '';
create index if not exists shared_builds_sender on public.shared_builds (sender, created_at);
-- For the all-callers ceiling, which counts the last hour's rows.
create index if not exists shared_builds_created on public.shared_builds (created_at);

alter table public.shared_builds enable row level security;
-- No policies on purpose: the anon and signed-in roles can't select, insert, update or delete rows directly.
revoke all on table public.shared_builds from anon, authenticated;

-- Who is calling, for the rate limits: a SHA-256 of cf-connecting-ip, else of the first address in x-forwarded-for,
-- else of "unknown". The address itself is never stored.
create or replace function public.client_hash()
returns text
language sql
stable
set search_path = ''
as $$
  select encode(
    extensions.digest(
      coalesce(
        nullif(trim((current_setting('request.headers', true))::json ->> 'cf-connecting-ip'), ''),
        nullif(trim(split_part((current_setting('request.headers', true))::json ->> 'x-forwarded-for', ',', 1)), ''),
        'unknown'
      ),
      'sha256'
    ),
    'hex'
  );
$$;

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
  who text := public.client_hash();
begin
  if jsonb_typeof(build) <> 'object' or coalesce(build ->> 'status', '') <> 'draft' or build ? 'sample' then
    raise exception 'not a shared build' using errcode = '22023';
  end if;
  -- 30 links an hour from one caller, 1,000 an hour from everyone.
  if (select count(*) from public.shared_builds where sender = who and created_at > now() - interval '1 hour') >= 30
     or (select count(*) from public.shared_builds where created_at > now() - interval '1 hour') >= 1000 then
    raise exception 'too many shared builds, try again later' using errcode = 'P0001';
  end if;
  loop
    new_id := public.new_share_id();
    begin
      insert into public.shared_builds (id, build, sender) values (new_id, build, who);
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

revoke all on function public.client_hash() from public, anon, authenticated;

-- Builds sent for listing (D-86, D-99 (1)): kept for Chime's review, listed on the site only after Chime plays one
-- match with it (D-30). Closed to the anon key like shared_builds; submit_build is the only way in, and nothing
-- reads them back from the site.
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  -- A build document as docs/FORMAT.md §Build describes, "status": "draft", no "sample"; checked again by Chime's
  -- content validator before it becomes a file in content/builds/.
  build jsonb not null check (jsonb_typeof(build) = 'object' and pg_column_size(build) <= 65536),
  status text not null default 'pending' check (status in ('pending', 'listed', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  sender text not null default ''
);
create index if not exists submissions_sender on public.submissions (sender, created_at);
create index if not exists submissions_status on public.submissions (status, created_at);
create index if not exists submissions_created on public.submissions (created_at);

alter table public.submissions enable row level security;
-- No policies on purpose: the anon and signed-in roles can't read or change submissions.
revoke all on table public.submissions from anon, authenticated;

-- Stores one build for review and returns its id. 10 an hour from one caller, 200 an hour from everyone.
create or replace function public.submit_build(build jsonb)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  who text := public.client_hash();
  new_id uuid;
begin
  if jsonb_typeof(build) <> 'object' or coalesce(build ->> 'status', '') <> 'draft' or build ? 'sample'
     or jsonb_typeof(build -> 'credits') <> 'array' then
    raise exception 'not a build document' using errcode = '22023';
  end if;
  if (select count(*) from public.submissions where sender = who and created_at > now() - interval '1 hour') >= 10
     or (select count(*) from public.submissions where created_at > now() - interval '1 hour') >= 200 then
    raise exception 'too many submissions, try again later' using errcode = 'P0001';
  end if;
  insert into public.submissions (build, sender) values (build, who) returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.submit_build(jsonb) from public;
grant execute on function public.submit_build(jsonb) to anon, authenticated;
