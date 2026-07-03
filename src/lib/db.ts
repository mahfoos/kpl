import postgres, { type Sql } from "postgres";

/**
 * Server-side Postgres connection to Supabase, shared across requests.
 *
 * Uses the transaction-mode pooler (DATABASE_URL, port 6543) which is what
 * serverless/Next.js should talk to — so `prepare: false` is required (pgbouncer
 * transaction pooling doesn't support prepared statements). Returns null when
 * DATABASE_URL isn't set, so callers can fall back to the static roster.
 */
let sql: Sql | null = null;

export function getSql(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) {
    sql = postgres(url, {
      prepare: false,
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return sql;
}
