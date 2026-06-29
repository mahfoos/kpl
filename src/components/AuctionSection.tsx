"use client";

import { motion } from "framer-motion";
import { Gavel, Users, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MEGA_AUCTION_DATE } from "@/lib/utils";

const facts = [
  { icon: Users, label: "Total Players", value: "208" },
  { icon: Shield, label: "Teams", value: "8" },
  { icon: Clock, label: "Auction Status", value: "Coming Soon" },
];

function AuctionHammer() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative grid place-items-center"
    >
      {/* Glow rings */}
      <div className="absolute size-56 rounded-full bg-gold/20 blur-3xl animate-glow sm:size-72" />
      <div className="absolute size-44 rounded-full border border-gold/20 sm:size-56" />
      <div className="absolute size-60 rounded-full border border-gold/10 sm:size-80" />

      {/* Sound block */}
      <div className="absolute bottom-10 h-3 w-28 rounded-full bg-gradient-to-r from-gold/40 to-gold/10 blur-[2px]" />

      {/* Swinging hammer */}
      <motion.div
        animate={{ rotate: [0, -22, -22, 0, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.3, 0.4, 0.6, 1],
        }}
        style={{ transformOrigin: "70% 80%" }}
        className="relative z-10"
      >
        <Gavel className="size-32 text-gold drop-shadow-[0_8px_30px_rgba(245,183,0,0.6)] sm:size-40" />
      </motion.div>

      {/* Impact sparks */}
      <motion.div
        className="absolute bottom-12 size-2 rounded-full bg-gold"
        animate={{ scale: [0, 2.5, 0], opacity: [0, 1, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0.38, 0.42, 0.5],
        }}
      />
    </motion.div>
  );
}

export function AuctionSection() {
  return (
    <section id="auction" className="relative overflow-hidden py-20 sm:py-28">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/0 via-navy-light/30 to-navy/0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-strong overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <Badge>The Main Event</Badge>
              <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                The Biggest Cricket{" "}
                <span className="text-gradient-gold">Auction</span> in Kinniya
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
                208 players. 8 hungry franchises. One war room. The Mega Auction
                decides who builds the squad of champions.
              </p>

              {/* Facts */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
                  >
                    <f.icon className="mx-auto size-5 text-gold" />
                    <p className="mt-2 font-display text-lg font-bold text-white">
                      {f.value}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                  Auction Goes Live In
                </p>
                <CountdownTimer targetIso={MEGA_AUCTION_DATE} size="lg" />
              </div>
            </div>

            {/* Hammer */}
            <div className="flex justify-center py-8 lg:py-0">
              <AuctionHammer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
