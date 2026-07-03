import { reduce } from "@/lib/auction-reducer";
import { readSnapshot, writeSnapshot } from "@/lib/auction-snapshot";
import { fetchPlayers } from "@/lib/players-db";
import { CORS_HEADERS, withCors } from "@/lib/cors";
import type { AuctionAction } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: AuctionAction;
  try {
    body = (await request.json()) as AuctionAction;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, withCors({ status: 400 }));
  }

  try {
    const roster = await fetchPlayers();
    const current = await readSnapshot(roster);
    const result = reduce(current, body, roster);
    if (result.changed) await writeSnapshot(result.state);
    return Response.json(
      { ok: result.ok, error: result.error, state: result.state },
      withCors({ status: result.ok ? 200 : 409 }),
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return Response.json({ ok: false, error: message }, withCors({ status: 500 }));
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
