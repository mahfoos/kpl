import { readSnapshot } from "@/lib/auction-snapshot";
import { fetchPlayers } from "@/lib/players-db";
import { withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const roster = await fetchPlayers();
    return Response.json(await readSnapshot(roster), withCors());
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return Response.json({ error: message }, withCors({ status: 500 }));
  }
}
