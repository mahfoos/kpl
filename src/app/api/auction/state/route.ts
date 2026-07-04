import { readSnapshot } from "@/lib/auction-snapshot";
import { fetchPlayers } from "@/lib/players-db";
import { withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Cap the invocation: if the DB is saturated, fail fast instead of holding a
// pooler connection for the full 300s (which is what caused the death spiral).
export const maxDuration = 12;

/** Reject if the DB read doesn't come back quickly, so we never hang. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`DB timeout after ${ms}ms`)), ms),
    ),
  ]);
}

export async function GET() {
  try {
    const roster = await withTimeout(fetchPlayers(), 8000);
    const snapshot = await withTimeout(readSnapshot(roster), 8000);
    return Response.json(snapshot, withCors());
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    // 503 → transient; the client just retries on its next poll/refresh.
    return Response.json({ error: message }, withCors({ status: 503 }));
  }
}
