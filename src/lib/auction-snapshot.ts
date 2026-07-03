import { getSql } from "@/lib/db";
import { initialState, normalize } from "@/lib/auction-reducer";
import type { AuctionState, Player } from "@/types";

/**
 * Server-side persistence for the single-row auction snapshot, stored in the
 * Supabase `auction_snapshot` table. Reads/writes go through the direct Postgres
 * connection (DATABASE_URL); Supabase Realtime then pushes row changes to every
 * connected screen.
 */

const ROW_ID = 1;

function requireSql() {
  const sql = getSql();
  if (!sql) {
    throw new Error("Database not configured: set DATABASE_URL");
  }
  return sql;
}

/** Read the current snapshot, seeding a fresh one if the row is missing/empty. */
export async function readSnapshot(roster: Player[]): Promise<AuctionState> {
  const sql = requireSql();
  const rows = await sql<{ state: AuctionState }[]>`
    select state from public.auction_snapshot where id = ${ROW_ID}
  `;
  const state = rows[0]?.state;
  if (!state) {
    const fresh = initialState(roster);
    await writeSnapshot(fresh);
    return fresh;
  }
  return normalize(state, roster);
}

/** Persist a new snapshot; Realtime then pushes it to every connected screen. */
export async function writeSnapshot(state: AuctionState): Promise<void> {
  const sql = requireSql();
  await sql`
    insert into public.auction_snapshot (id, state, updated_at)
    values (${ROW_ID}, ${sql.json(state as unknown as Parameters<typeof sql.json>[0])}, now())
    on conflict (id) do update
      set state = excluded.state, updated_at = excluded.updated_at
  `;
}
