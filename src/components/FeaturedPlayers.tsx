"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { User, Activity, Sparkle, X, Tag, BadgeCheck } from "lucide-react";
import { players, playerRoles } from "@/data/players";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import type { Player } from "@/types";

function PlayerCard({
  player,
  onSelect,
}: {
  player: Player;
  onSelect: (p: Player) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35 }}
      onClick={() => onSelect(player)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-navy-light/40 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:glow-gold"
    >
      {/* Image / placeholder */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-b from-navy-light to-navy">
        {player.image ? (
          <Image
            src={player.image}
            alt={`${player.name} — ${player.role}`}
            width={1280}
            height={960}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_0%,rgba(245,183,0,0.18),transparent_60%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="size-24 text-white/10 transition-transform duration-500 group-hover:scale-110" />
            </div>
          </>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-electric/30 bg-electric/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-electric backdrop-blur-sm">
          <Sparkle className="size-3" />
          {player.role}
        </span>
        {!player.image && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-light to-transparent" />
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-white">
          {player.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/55">
          <span className="inline-flex items-center gap-1">
            <Activity className="size-3.5" />
            {player.battingStyle}
          </span>
          {player.bowlingStyle && (
            <>
              <span className="text-white/20">·</span>
              <span>{player.bowlingStyle}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="text-sm font-semibold text-white/70">
            {player.basePrice}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            <span className="size-1.5 animate-pulse rounded-full bg-gold" />
            {player.status}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function PlayerModal({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-4 backdrop-blur-md sm:p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong relative w-full max-w-4xl overflow-hidden rounded-[2rem]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-ink/50 text-white backdrop-blur transition-colors hover:bg-ink/80"
        >
          <X className="size-5" />
        </button>

        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          {/* Big image */}
          <div className="relative bg-gradient-to-b from-navy-light to-navy">
            {player.image ? (
              <Image
                src={player.image}
                alt={`${player.name} — ${player.role}`}
                width={1280}
                height={960}
                priority
                className="h-full max-h-[70vh] w-full object-contain"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center">
                <User className="size-40 text-white/10" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center gap-5 p-7 sm:p-9">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-electric">
              <Sparkle className="size-3.5" />
              {player.role}
            </span>

            <div>
              <h3 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {player.name}
              </h3>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Activity className="size-4 text-gold" />
                <dt className="text-white/45">Batting</dt>
                <dd className="ml-auto font-medium text-white">
                  {player.battingStyle}
                </dd>
              </div>
              {player.bowlingStyle && (
                <div className="flex items-center gap-3">
                  <Activity className="size-4 text-gold" />
                  <dt className="text-white/45">Bowling</dt>
                  <dd className="ml-auto font-medium text-white">
                    {player.bowlingStyle}
                  </dd>
                </div>
              )}
              <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                <Tag className="size-4 text-gold" />
                <dt className="text-white/45">Base Price</dt>
                <dd className="ml-auto font-semibold text-gold">
                  {player.basePrice}
                </dd>
              </div>
            </dl>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">
              <BadgeCheck className="size-4" />
              {player.status}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedPlayers() {
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Player | null>(null);

  const filtered =
    filter === "All" ? players : players.filter((p) => p.role === filter);

  return (
    <section id="players" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Talent Pool"
          title={
            <>
              Featured <span className="text-gradient-gold">Players</span>
            </>
          }
          description="208 registered players await the Mega Auction. Tap a player to view their card."
        />

        {/* Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {playerRoles.map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                filter === role
                  ? "border-transparent bg-gradient-to-r from-gold-soft to-gold text-navy shadow-[0_6px_24px_-8px_rgba(245,183,0,0.7)]"
                  : "border-white/10 bg-white/5 text-white/65 hover:border-white/25 hover:text-white"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onSelect={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <PlayerModal player={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
