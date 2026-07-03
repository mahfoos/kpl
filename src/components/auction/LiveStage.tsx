"use client";

import { useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Gavel, Radio, Sparkles, Trophy, User } from "lucide-react";
import { players } from "@/data/players";
import { teams } from "@/data/teams";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DEFAULT_BASE_PRICE, formatAmount, formatMoney } from "@/lib/auction-config";
import { MEGA_AUCTION_DATE } from "@/lib/utils";
import type { AuctionState } from "@/types";

const playerById = new Map(players.map((p) => [p.id, p]));
const teamById = new Map(teams.map((t) => [t.id, t]));

/** The big-screen hero: whoever is on the auction block right now. */
export function LiveStage({ state }: { state: AuctionState | null }) {
  const current = state?.current ?? null;

  if (!current) return <IdleStage />;

  // Prefer the player details embedded in the live lot (sourced from the DB);
  // fall back to the static roster for older snapshots.
  const player = current.player ?? playerById.get(current.playerId);
  if (!player) return <IdleStage />;

  const leadTeam = current.leadingTeamId ? teamById.get(current.leadingTeamId) : null;
  const base = player.basePriceValue ?? DEFAULT_BASE_PRICE;
  const sold = current.status === "sold";
  const unsold = current.status === "unsold";

  return (
    <>
    <AnimatePresence>
      {sold && leadTeam && (
        <SoldCelebration
          key={`${player.id}-sold`}
          player={player}
          team={leadTeam}
          price={current.bid}
        />
      )}
    </AnimatePresence>

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
        {player.club && (
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gold/80">
            {player.club}
          </p>
        )}

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
              {leadTeam.logo ? (
                <Image
                  src={leadTeam.logo}
                  alt={leadTeam.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-xl object-cover ring-1 ring-white/20"
                />
              ) : (
                <span
                  className="grid size-11 place-items-center rounded-xl font-display text-base font-extrabold text-navy"
                  style={{ backgroundColor: leadTeam.primary }}
                >
                  {leadTeam.initials}
                </span>
              )}
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
    </>
  );
}

/**
 * Full-screen SOLD celebration: confetti, a springy stamp, the player blown up
 * big, and the winning team + price. Shown while the lot's status is "sold".
 */
function SoldCelebration({
  player,
  team,
  price,
}: {
  player: { name: string; image?: string; role: string };
  team: (typeof teams)[number];
  price: number;
}) {
  // Confetti pieces — generated once when the celebration mounts.
  const confetti = useMemo(() => {
    const colors = ["#F5B700", "#22c55e", "#ffffff", "#38bdf8", team.primary];
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 7 + Math.random() * 11,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 160,
      spin: 180 + Math.random() * 540,
      color: colors[i % colors.length],
    }));
  }, [team.primary]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dim + team-coloured glow */}
      <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" />
      <div
        className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ backgroundColor: `${team.primary}55` }}
      />

      {/* Confetti */}
      <div className="absolute inset-0">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            className="absolute top-0 block rounded-[2px]"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.55,
              backgroundColor: c.color,
            }}
            initial={{ y: "-12vh", x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: "112vh",
              x: c.drift,
              opacity: [0, 1, 1, 0.9, 0],
              rotate: c.spin,
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-5 px-6 text-center sm:gap-6">
        {/* SOLD stamp */}
        <motion.div
          initial={{ scale: 0, rotate: -24, opacity: 0 }}
          animate={{ scale: 1, rotate: -7, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
          className="flex items-center gap-3 rounded-2xl border-4 border-green-400 bg-green-400/15 px-7 py-2.5 shadow-[0_0_50px_rgba(74,222,128,0.5)]"
        >
          <Gavel className="size-8 text-green-400 sm:size-10" />
          <span className="font-display text-5xl font-black uppercase tracking-tight text-green-400 sm:text-7xl">
            Sold!
          </span>
        </motion.div>

        {/* Player card, popped big */}
        {player.image && (
          <motion.div
            initial={{ scale: 0.55, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.25 }}
            className="relative aspect-[3/2] w-full max-w-[34rem] overflow-hidden rounded-3xl border-4 shadow-2xl"
            style={{ borderColor: team.primary }}
          >
            <Image
              src={player.image}
              alt={player.name}
              fill
              sizes="(max-width: 640px) 90vw, 34rem"
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 font-display text-5xl font-extrabold text-white sm:text-7xl"
        >
          <Sparkles className="size-7 text-gold sm:size-9" />
          {player.name}
          <Sparkles className="size-7 text-gold sm:size-9" />
        </motion.h1>

        {/* Winning team */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.55 }}
          className="inline-flex items-center gap-3 rounded-2xl border-2 px-6 py-3"
          style={{
            borderColor: team.primary,
            backgroundColor: `${team.primary}22`,
          }}
        >
          {team.logo ? (
            <Image
              src={team.logo}
              alt={team.name}
              width={48}
              height={48}
              className="size-12 rounded-xl object-cover ring-2 ring-white/20"
            />
          ) : (
            <Trophy className="size-6" style={{ color: team.primary }} />
          )}
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Bought by
            </p>
            <p className="font-display text-2xl font-black text-white sm:text-3xl">
              {team.name}
            </p>
          </div>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.7 }}
          className="mt-1"
        >
          <p className="text-gradient-gold font-display text-6xl font-black tabular-nums sm:text-8xl">
            {formatAmount(price)}
          </p>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-white/50">
            LKR
          </p>
        </motion.div>
      </div>
    </motion.div>
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

      {/* Countdown to the mega auction */}
      <div className="flex flex-col items-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-gold">
          Auction Starts In
        </p>
        <CountdownTimer targetIso={MEGA_AUCTION_DATE} size="lg" className="mx-auto" />
      </div>

      {/* Chief guest strip */}
      <div className="glass flex items-center gap-4 rounded-2xl px-5 py-3">
        <Image
          src="/imran-maharoof.jpg"
          alt="Imran Maharoof"
          width={56}
          height={56}
          className="size-14 rounded-full object-cover object-top ring-2 ring-gold/50"
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
