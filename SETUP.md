# KPL Auction — Setup (Supabase + Vercel)

Two apps:

- **`kpl`** — big screen + auction API (this folder)
- **`kpl-admin`** — auctioneer control panel (`../kpl-admin`)

**Teams** are static in the code. **Players** live in the Supabase `players`
table (so they can be added/edited without a redeploy). The **live auction
state** (current bid, leading team, sold prices, team purses) is one JSON row in
the `auction_snapshot` table, pushed to every screen over Supabase Realtime —
this is what makes it work on Vercel (serverless can't hold live state in memory).

The server reads/writes Supabase over the **direct Postgres connection**
(`DATABASE_URL`); the browser only needs the **anon key** for Realtime.

## 1. Create a Supabase project

1. Go to https://supabase.com → New project (free tier is fine).
2. Project Settings → **API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Create the table

Supabase dashboard → **SQL Editor** → New query → paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql) → **Run**.

## 3. Local environment

**`kpl/.env.local`** — `DATABASE_URL`/`DIRECT_URL` come from Supabase → Project
Settings → **Database** → Connection string (use the **pooler** strings;
URL-encode the password). The anon key is only for Realtime.

```
DATABASE_URL="postgresql://postgres.PROJECT:PASSWORD@...pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT:PASSWORD@...pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**`kpl-admin/.env.local`**

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# URL of the screen app's API (where auctioneer actions are POSTed):
NEXT_PUBLIC_AUCTION_API=http://localhost:3000
```

> The **service-role key goes ONLY in `kpl`** (server-side). Never put it in
> `kpl-admin` or any `NEXT_PUBLIC_*` variable.

## 4. Run locally

```bash
# terminal 1
cd kpl && npm install && npm run dev          # → http://localhost:3000  (big screen)

# terminal 2
cd kpl-admin && npm install && npm run dev     # → http://localhost:3001  (auctioneer)
```

## 5. Deploy on Vercel

Deploy each folder as its **own Vercel project** (set the Root Directory to
`kpl` for one, `kpl-admin` for the other).

Set the same env vars in each project's **Settings → Environment Variables**:

- `kpl`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `kpl-admin`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
  `NEXT_PUBLIC_AUCTION_API` = the deployed `kpl` URL (e.g. `https://kpl-screen.vercel.app`).

That's it — both apps read live state straight from Supabase, so the auction
stays in sync across every device.

## Adding players

Players live in the `players` table. Drop the photo in `kpl/public/auction/`
and insert a row (SQL Editor or psql via `DIRECT_URL`):

```sql
insert into public.players
  (id, name, role, batting_style, bowling_style, base_price, base_price_value, image, sort_order)
values
  ('p-ahmed', 'Ahmed', 'Bowler', 'Right-hand bat', 'Right-arm fast',
   'Base 2,000 LKR', 2000, '/auction/ahmed.jpg', 1);
```

`role` must be one of `Batsman`, `Bowler`, `All-Rounder`, `Wicket Keeper`.
Players without an `image` show a placeholder automatically. The new player
appears in the auctioneer roster on its next load — no redeploy needed.
