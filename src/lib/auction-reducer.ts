import { players } from "@/data/players";
import { teams } from "@/data/teams";
import { DEFAULT_BASE_PRICE, TEAM_BUDGET } from "@/lib/auction-config";
import type {
  AuctionAction,
  AuctionPlayerState,
  AuctionState,
  AuctionTeamState,
  CurrentLot,
} from "@/types";

/**
 * Pure auction logic. Takes the current state + an action and returns the next
 * state — no I/O. Persistence (Supabase) and transport (Realtime) live elsewhere,
 * so the same rules run identically on the server and in tests.
 */

const playerById = new Map(players.map((p) => [p.id, p]));
const teamById = new Map(teams.map((t) => [t.id, t]));

function basePriceOf(playerId: string): number {
  return playerById.get(playerId)?.basePriceValue ?? DEFAULT_BASE_PRICE;
}

/** A clean snapshot with every team at full purse and every player available. */
export function initialState(): AuctionState {
  const teamStates: Record<string, AuctionTeamState> = {};
  for (const t of teams) teamStates[t.id] = { spent: 0, playerIds: [] };

  const playerStates: Record<string, AuctionPlayerState> = {};
  for (const p of players) playerStates[p.id] = { status: "available" };

  return {
    version: 0,
    current: null,
    teams: teamStates,
    players: playerStates,
    lastEvent: null,
  };
}

/**
 * Heal a snapshot read from the DB: ensure every roster team/player has an entry
 * even if the roster grew since the row was written.
 */
export function normalize(state: AuctionState): AuctionState {
  const next: AuctionState = {
    version: state.version ?? 0,
    current: state.current ?? null,
    teams: { ...state.teams },
    players: { ...state.players },
    lastEvent: state.lastEvent ?? null,
  };
  for (const t of teams) {
    if (!next.teams[t.id]) next.teams[t.id] = { spent: 0, playerIds: [] };
  }
  for (const p of players) {
    if (!next.players[p.id]) next.players[p.id] = { status: "available" };
  }
  return next;
}

export function remaining(state: AuctionState, teamId: string): number {
  return TEAM_BUDGET - (state.teams[teamId]?.spent ?? 0);
}

export interface ReduceResult {
  ok: boolean;
  error?: string;
  /** Next state when ok; the unchanged input state when not. */
  state: AuctionState;
  /** True when `state` differs and should be persisted. */
  changed: boolean;
}

function bump(state: AuctionState, event: string | null): AuctionState {
  return { ...state, version: state.version + 1, lastEvent: event };
}

/** Apply one auctioneer action. Returns the next state (or the same on no-op/error). */
export function reduce(input: AuctionState, action: AuctionAction): ReduceResult {
  const state = normalize(input);

  switch (action.type) {
    case "SELECT_PLAYER": {
      const { playerId } = action;
      if (!playerId || !playerById.has(playerId)) {
        return { ok: false, error: "Unknown player", state, changed: false };
      }
      const player = playerById.get(playerId)!;
      const lot: CurrentLot = {
        playerId,
        bid: basePriceOf(playerId),
        leadingTeamId: null,
        status: "live",
        raises: [],
      };
      return {
        ok: true,
        changed: true,
        state: bump({ ...state, current: lot }, `${player.name} is on the block`),
      };
    }

    case "RAISE": {
      const { current } = state;
      const { teamId, amount } = action;
      if (!current || current.status !== "live") {
        return { ok: false, error: "No live lot", state, changed: false };
      }
      if (!teamId || !teamById.has(teamId)) {
        return { ok: false, error: "Unknown team", state, changed: false };
      }
      const nextBid =
        current.leadingTeamId === null ? current.bid : current.bid + (amount ?? 0);

      if (nextBid > remaining(state, teamId)) {
        const team = teamById.get(teamId)!;
        return {
          ok: false,
          error: `${team.shortName} can't afford that bid`,
          state,
          changed: false,
        };
      }

      const lot: CurrentLot = {
        ...current,
        raises: [
          ...current.raises,
          { bid: current.bid, leadingTeamId: current.leadingTeamId },
        ],
        bid: nextBid,
        leadingTeamId: teamId,
      };
      const team = teamById.get(teamId)!;
      return {
        ok: true,
        changed: true,
        state: bump(
          { ...state, current: lot },
          `${team.shortName} bid ${nextBid.toLocaleString("en-LK")}`,
        ),
      };
    }

    case "UNDO": {
      const { current } = state;
      if (!current || current.status !== "live" || current.raises.length === 0) {
        return { ok: false, error: "Nothing to undo", state, changed: false };
      }
      const raises = [...current.raises];
      const prev = raises.pop()!;
      const lot: CurrentLot = {
        ...current,
        bid: prev.bid,
        leadingTeamId: prev.leadingTeamId,
        raises,
      };
      return {
        ok: true,
        changed: true,
        state: bump({ ...state, current: lot }, "Bid undone"),
      };
    }

    case "SOLD": {
      const { current } = state;
      if (!current || current.status !== "live") {
        return { ok: false, error: "No live lot", state, changed: false };
      }
      if (!current.leadingTeamId) {
        return { ok: false, error: "No bid yet — mark unsold instead", state, changed: false };
      }
      const teamId = current.leadingTeamId;
      const price = current.bid;
      const player = playerById.get(current.playerId)!;
      const team = teamById.get(teamId)!;

      const teamState: AuctionTeamState = {
        spent: state.teams[teamId].spent + price,
        playerIds: [...state.teams[teamId].playerIds, current.playerId],
      };
      const playerState: AuctionPlayerState = {
        status: "sold",
        soldToTeamId: teamId,
        soldPrice: price,
      };
      return {
        ok: true,
        changed: true,
        state: bump(
          {
            ...state,
            current: { ...current, status: "sold" },
            teams: { ...state.teams, [teamId]: teamState },
            players: { ...state.players, [current.playerId]: playerState },
          },
          `SOLD! ${player.name} → ${team.name} for ${price.toLocaleString("en-LK")}`,
        ),
      };
    }

    case "UNSOLD": {
      const { current } = state;
      if (!current || current.status !== "live") {
        return { ok: false, error: "No live lot", state, changed: false };
      }
      const player = playerById.get(current.playerId)!;
      const playerState: AuctionPlayerState = { status: "unsold" };
      return {
        ok: true,
        changed: true,
        state: bump(
          {
            ...state,
            current: { ...current, status: "unsold" },
            players: { ...state.players, [current.playerId]: playerState },
          },
          `${player.name} goes UNSOLD`,
        ),
      };
    }

    case "CLEAR": {
      return {
        ok: true,
        changed: true,
        state: bump({ ...state, current: null }, null),
      };
    }

    case "RESET_ALL": {
      return { ok: true, changed: true, state: initialState() };
    }

    default:
      return { ok: false, error: "Unknown action", state, changed: false };
  }
}
