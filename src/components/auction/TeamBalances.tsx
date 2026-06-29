"use client";

import { teams } from "@/data/teams";
import { TEAM_BUDGET, formatAmount } from "@/lib/auction-config";
import type { AuctionState } from "@/types";

/**
 * Live purse board for all eight franchises. `highlightTeamId` glows the team
 * currently leading the bid so it pops on the big screen.
 */
export function TeamBalances({
  state,
  highlightTeamId,
  compact = false,
}: {
  state: AuctionState | null;
  highlightTeamId?: string | null;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-2 sm:grid-cols-4"
          : "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
      }
    >
      {teams.map((team) => {
        const ts = state?.teams[team.id];
        const spent = ts?.spent ?? 0;
        const left = TEAM_BUDGET - spent;
        const count = ts?.playerIds.length ?? 0;
        const isLeading = highlightTeamId === team.id;
        const pctLeft = Math.max(0, Math.round((left / TEAM_BUDGET) * 100));

        return (
          <div
            key={team.id}
            className={`relative overflow-hidden rounded-2xl border p-3 transition-all duration-300 ${
              isLeading
                ? "border-gold bg-gold/10 shadow-[0_0_30px_-6px_rgba(245,183,0,0.6)]"
                : "border-white/10 bg-navy-light/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-display text-lg font-extrabold leading-none"
                style={{ color: team.primary }}
              >
                {team.initials}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                {count} {count === 1 ? "player" : "players"}
              </span>
            </div>

            <p className="mt-2 truncate text-[11px] font-semibold uppercase tracking-wide text-white/50">
              {team.shortName}
            </p>

            <p className="mt-1 font-display text-xl font-extrabold text-white tabular-nums">
              {formatAmount(left)}
            </p>
            <p className="text-[10px] font-medium text-white/40">purse left</p>

            {/* purse meter */}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pctLeft}%`,
                  background:
                    pctLeft > 30
                      ? `linear-gradient(90deg, ${team.primary}, ${team.secondary})`
                      : "linear-gradient(90deg,#ef4444,#b91c1c)",
                }}
              />
            </div>

            {isLeading && (
              <span className="absolute right-2 top-2 animate-pulse-fast rounded-full bg-gold px-2 py-0.5 text-[9px] font-black uppercase text-navy">
                Leading
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
