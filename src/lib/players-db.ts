import { getSql } from "@/lib/db";
import { players as staticPlayers } from "@/data/players";
import type { Player, PlayerRole } from "@/types";

/**
 * Roster source of truth. Players live in the Supabase `players` table; this
 * reads them server-side. If the DB isn't configured (no DATABASE_URL) or a
 * query fails, it falls back to the static roster in `@/data/players` so the
 * app keeps working.
 */

interface PlayerRow {
  id: string;
  name: string;
  role: string;
  batting_style: string;
  bowling_style: string | null;
  base_price: string;
  base_price_value: number | null;
  status: string;
  image: string | null;
  club: string | null;
}

function toPlayer(r: PlayerRow): Player {
  return {
    id: r.id,
    name: r.name,
    role: r.role as PlayerRole,
    battingStyle: r.batting_style,
    bowlingStyle: r.bowling_style ?? undefined,
    basePrice: r.base_price,
    basePriceValue: r.base_price_value ?? undefined,
    status: r.status,
    image: r.image ?? undefined,
    club: r.club ?? undefined,
  };
}

// The roster changes rarely (seed script), but `/api/auction/state` is polled
// once a second per screen. Cache it per instance for a few seconds so each poll
// only runs the live-snapshot query, not a full roster scan — this cuts DB load
// (and pooler connections) in half.
let cache: { at: number; players: Player[] } | null = null;
const ROSTER_TTL_MS = 5000;

export async function fetchPlayers(): Promise<Player[]> {
  const now = Date.now();
  if (cache && now - cache.at < ROSTER_TTL_MS) return cache.players;

  const sql = getSql();
  if (!sql) return staticPlayers;
  try {
    const rows = await sql<PlayerRow[]>`
      select id, name, role, batting_style, bowling_style,
             base_price, base_price_value, status, image, club
      from public.players
      order by sort_order, name
    `;
    const players = rows.length ? rows.map(toPlayer) : staticPlayers;
    cache = { at: now, players };
    return players;
  } catch (err) {
    console.error("[players-db] falling back to static roster:", err);
    return staticPlayers;
  }
}
