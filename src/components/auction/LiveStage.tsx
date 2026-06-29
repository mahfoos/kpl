"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Gavel, Radio, User } from "lucide-react";
import { players } from "@/data/players";
import { teams } from "@/data/teams";
import { DEFAULT_BASE_PRICE, formatAmount, formatMoney } from "@/lib/auction-config";
import type { AuctionState } from "@/types";

const playerById = new Map(players.map((p) => [p.id, p]));
const teamById = new Map(teams.map((t) => [t.id, t]));

/** The big-screen hero: whoever is on the auction block right now. */
export function LiveStage({ state }: { state: AuctionState | null }) {
  const current = state?.current ?? null;

  if (!current) return <IdleStage />;

  const player = playerById.get(current.playerId);
  if (!player) return <IdleStage />;

  const leadTeam = current.leadingTeamId ? teamById.get(current.leadingTeamId) : null;
  const base = player.basePriceValue ?? DEFAULT_BASE_PRICE;
  const sold = current.status === "sold";
  const unsold = current.status === "unsold";

  return (
    <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* Player portrait */}
      <motion.div
        key={player.id}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-lg"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-black/50">
          {player.image ? (
            <Image
              src={player.image}
              alt={player.name}
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-contain"
              priority
            />
          ) : (
            <>
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-light to-ink">
                <User className="size-40 text-white/15" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
            </>
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-black uppercase tracking-wide text-navy">
            {player.role}
          </span>
        </div>
      </motion.div>

      {/* Bid info */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center gap-2 lg:justify-start">
          {sold ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-green-400">
              <Gavel className="size-4" /> Sold
            </span>
          ) : unsold ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-red-400">
              Unsold
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-red-400">
              <Radio className="size-4 animate-pulse-fast" /> Live Now
            </span>
          )}
        </div>

        <h1 className="mt-4 font-display text-5xl font-extrabold leading-none text-white sm:text-7xl">
          {player.name}
        </h1>
        <p className="mt-3 text-base text-white/60 sm:text-lg">
          {player.battingStyle}
          {player.bowlingStyle ? ` · ${player.bowlingStyle}` : ""}
          <span className="mx-2 text-white/30">|</span>
          Base {formatMoney(base)}
        </p>

        {/* Current bid */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/40">
            {sold ? "Sold For" : current.leadingTeamId ? "Current Bid" : "Opening Price"}
          </p>
          <AnimatePresence mode="popLayout">
            <motion.p
              key={current.bid}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-gradient-gold font-display text-6xl font-black tabular-nums sm:text-8xl"
            >
              {formatAmount(current.bid)}
            </motion.p>
          </AnimatePresence>
          <p className="text-sm font-semibold text-white/40">LKR</p>
        </div>

        {/* Leading / winning team */}
        <div className="mt-8 flex justify-center lg:justify-start">
          {leadTeam ? (
            <motion.div
              key={leadTeam.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 rounded-2xl border px-5 py-3"
              style={{
                borderColor: `${leadTeam.primary}66`,
                backgroundColor: `${leadTeam.primary}1a`,
              }}
            >
              <span
                className="grid size-11 place-items-center rounded-xl font-display text-base font-extrabold text-navy"
                style={{ backgroundColor: leadTeam.primary }}
              >
                {leadTeam.initials}
              </span>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {sold ? "Bought by" : "Leading bidder"}
                </p>
                <p className="font-display text-lg font-bold text-white">
                  {leadTeam.name}
                </p>
              </div>
            </motion.div>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/50">
              Awaiting first bid…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shown before any player is put on the block. */
function IdleStage() {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-[34rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[90px]" />
        <Image
          src="/kpl-logo.png"
          alt="Kinniya Premier League"
          width={1599}
          height={984}
          priority
          className="mx-auto h-auto w-full max-w-xl drop-shadow-[0_10px_60px_rgba(245,183,0,0.25)]"
        />
      </motion.div>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-electric">
          Mega Auction
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-6xl">
          Get Ready — Bidding Starts Soon
        </h1>
        <p className="mt-4 text-white/50">
          208 Players · 8 Teams · 75,000 purse each
        </p>
      </div>

      {/* Chief guest strip */}
      <div className="glass flex items-center gap-4 rounded-2xl px-5 py-3">
        <Image
          src="/imran-maharoof.jpg"
          alt="Imran Maharoof"
          width={56}
          height={56}
          className="size-14 rounded-full object-cover ring-2 ring-gold/50"
        />
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Chief Guest
          </p>
          <p className="font-display text-lg font-bold text-white">Imran Maharoof</p>
        </div>
      </div>
    </div>
  );
}
