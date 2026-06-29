-- KPL live auction — Supabase schema
-- Run this once in your Supabase project (SQL Editor → New query → paste → Run).

-- The entire auction state lives in ONE row as JSON. The screen app writes it
-- (via the service-role key); every screen reads it live over Realtime.
create table if not exists public.auction_snapshot (
  id         int primary key default 1,
  state      jsonb not null,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Seed the single row if it isn't there yet (the app also self-heals this).
insert into public.auction_snapshot (id, state)
values (1, '{"version":0,"current":null,"teams":{},"players":{},"lastEvent":null}'::jsonb)
on conflict (id) do nothing;

-- Push row changes to subscribed browsers in real time.
alter publication supabase_realtime add table public.auction_snapshot;

-- Row Level Security: anyone may READ the snapshot; nobody may write with the
-- public (anon) key. All writes go through the screen app using the service-role
-- key, which bypasses RLS.
alter table public.auction_snapshot enable row level security;

drop policy if exists "anon read snapshot" on public.auction_snapshot;
create policy "anon read snapshot"
  on public.auction_snapshot
  for select
  to anon, authenticated
  using (true);
