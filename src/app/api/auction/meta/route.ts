import { players } from "@/data/players";
import { teams } from "@/data/teams";
import { BID_STEPS, DEFAULT_BASE_PRICE, TEAM_BUDGET } from "@/lib/auction-config";
import { withCors } from "@/lib/cors";
import type { AuctionMeta } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Roster + tuning the standalone auctioneer app loads on startup. */
export async function GET() {
  const meta: AuctionMeta = {
    teams,
    players,
    budget: TEAM_BUDGET,
    baseDefault: DEFAULT_BASE_PRICE,
    steps: [...BID_STEPS],
  };
  return Response.json(meta, withCors());
}
