-- LOVBITES — production storage for orders, table bookings, cottage bookings
-- and catering leads. Used by src/lib/server/file-store.ts when SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY are set in Vercel.
--
-- Apply once in the Supabase SQL editor (or via the Supabase MCP / CLI).

create table if not exists public.lovbites_records (
  id          text primary key,
  collection  text not null check (collection in ('orders', 'table-bookings', 'cottage-bookings', 'catering-leads')),
  data        jsonb not null,
  created_at  timestamptz not null default now()
);

create index if not exists lovbites_records_collection_created_idx
  on public.lovbites_records (collection, created_at);

-- Database-level double-booking guard: one active booking per cottage/date/time,
-- even if two customers press "Confirm" at the same instant.
create unique index if not exists lovbites_cottage_slot_unique
  on public.lovbites_records ((data->>'cottageId'), (data->>'date'), (data->>'time'))
  where collection = 'cottage-bookings' and coalesce(data->>'status', '') <> 'CANCELLED';

-- Lock the table down: no access through the public anon/authenticated keys.
-- The website only talks to it from server-side API routes with the service-role key,
-- which bypasses RLS. Customer phone numbers are never exposed to browsers directly.
alter table public.lovbites_records enable row level security;
revoke all on public.lovbites_records from anon, authenticated;
