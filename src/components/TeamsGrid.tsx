"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { teams } from "@/data/teams";
import { SectionHeading } from "@/components/SectionHeading";
import type { Team } from "@/types";

function TeamCard({ team, index }: { team: Team; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-navy-light/40 transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgba(245,183,0,0.45)]"
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, ${team.primary}40 0%, ${team.secondary}cc 60%, #0b1220 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 12px)",
          }}
        />
        {/* Crest */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-5xl font-extrabold tracking-tight drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
            style={{ color: team.primary }}
          >
            {team.initials}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {team.city}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold leading-tight text-white transition-colors group-hover:text-gold">
          {team.name}
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
            <Lock className="size-3" />
            {team.squadStatus}
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            {team.auctionStatus}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
            View Franchise
          </span>
          <span
            className="grid size-8 place-items-center rounded-full transition-all duration-300 group-hover:rotate-45"
            style={{ backgroundColor: `${team.primary}22`, color: team.primary }}
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>

      {/* Glow ring on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-inset transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${team.primary}55` }}
      />
    </motion.article>
  );
}

export function TeamsGrid() {
  return (
    <section id="teams" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Franchises"
          title={
            <>
              Eight Teams. <span className="text-gradient-gold">One Crown.</span>
            </>
          }
          description="Meet the franchises set to battle across Kinniya for the inaugural KPL title. Squads will be built from scratch at the Mega Auction."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((team, i) => (
            <TeamCard key={team.id} team={team} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
