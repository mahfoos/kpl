"use client";

import { teams } from "@/data/teams";
import { TEAM_BUDGET, formatAmount } from "@/lib/auction-config";
import type { AuctionState, Team } from "@/types";

/**
 * Big-screen team purse board that continuously slides like the LED ribbon.
 * Cards are duplicated so the -50% marquee translate loops seamlessly.
 */
export function TeamPurseStrip({
  state,
  highlightTeamId,
}: {
  state: AuctionState | null;
  highlightTeamId?: string | null;
}) {
  const doubled = [...teams, ...teams];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex w-max animate-marquee gap-4 will-change-transform"
        style={{ animationDuration: "48s" }}
      >
        {doubled.map((team, i) => (
          <PurseCard
            key={`${team.id}-${i}`}
            team={team}
            state={state}
            leading={highlightTeamId === team.id}
          />
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

function PurseCard({
  team,
  state,
  leading,
}: {
  team: Team;
  state: AuctionState | null;
  leading: boolean;
}) {
  const ts = state?.teams[team.id];
  const spent = ts?.spent ?? 0;
  const left = TEAM_BUDGET - spent;
  const count = ts?.playerIds.length ?? 0;
  const pctLeft = Math.max(0, Math.round((left / TEAM_BUDGET) * 100));

  return (
    <div
      className={`relative w-[320px] shrink-0 overflow-hidden rounded-[2rem] border transition-all duration-300 ${
        leading
          ? "border-gold shadow-[0_0_50px_-8px_rgba(245,183,0,0.7)]"
          : "border-white/10"
      }`}
    >
      {/* Colored banner with crest */}
      <div className="relative h-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(130% 130% at 50% 0%, ${team.primary}55 0%, ${team.secondary}ee 55%, #0b1220 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 14px)",
          }}
        />
        {/* Crest "logo" */}
        <div className="absolute inset-0 flex items-center justify-center">
          <TeamCrest team={team} />
        </div>
        {leading && (
          <span className="absolute right-3 top-3 animate-pulse-fast rounded-full bg-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-navy">
            Leading Bid
          </span>
        )}
      </div>

      {/* Body */}
      <div className="bg-navy-light/60 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          {team.city}
        </p>
        <h3 className="font-display text-2xl font-extrabold leading-tight text-white">
          {team.name}
        </h3>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Purse Left
            </p>
            <p className="text-gradient-gold font-display text-4xl font-black tabular-nums">
              {formatAmount(left)}
            </p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            {count} {count === 1 ? "player" : "players"}
          </span>
        </div>

        {/* Purse meter */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
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
      </div>
    </div>
  );
}

/** Club-style circular crest built from the team's colours + initials. */
function TeamCrest({ team }: { team: Team }) {
  return (
    <div
      className="grid size-20 place-items-center rounded-full border-[3px] shadow-lg"
      style={{
        borderColor: team.primary,
        background: `radial-gradient(circle at 50% 35%, ${team.secondary}, #0b1220)`,
      }}
    >
      <span
        className="font-display text-2xl font-black tracking-tight drop-shadow"
        style={{ color: team.primary }}
      >
        {team.initials}
      </span>
    </div>
  );
}
