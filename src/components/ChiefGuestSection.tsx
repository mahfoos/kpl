"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Radio, Star } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const eventDetails = [
  { icon: CalendarDays, label: "Date", value: "July 4, 2026" },
  { icon: Clock, label: "Time", value: "5:00 PM Onwards" },
  { icon: MapPin, label: "Venue", value: "Ezhil Arangu Ground, Kinniya" },
  { icon: Radio, label: "Broadcast", value: "Live on LIVE Network" },
];

export function ChiefGuestSection() {
  return (
    <section id="chief-guest" className="relative overflow-hidden py-20 sm:py-28">
      {/* Backdrop */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[40vh] w-[60vh] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Honoured Guest"
          title={
            <>
              Our <span className="text-gradient-gold">Chief Guest</span>
            </>
          }
          description="Gracing the KPL Mega Auction as the guest of honour."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-sm flex-col items-center text-center"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold/30 to-electric/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-gold/40 glow-gold">
                <Image
                  src="/imran-maharoof.jpg"
                  alt="Hon. Imran Maharoof (MP)"
                  width={276}
                  height={276}
                  priority
                  className="size-56 object-cover object-top sm:size-64"
                />
              </div>
            </div>

            <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
              <Star className="size-3.5" />
              Chief Guest
            </span>
            <h3 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
              Hon. Imran Maharoof
            </h3>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
              Member of Parliament
            </p>
          </motion.div>

          {/* Event details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="glass-strong rounded-[2rem] p-6 sm:p-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              KPL Mega Auction
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
              Where 8 owners build their dream squads from 208 players.
            </h3>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {eventDetails.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                    <d.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                      {d.label}
                    </p>
                    <p className="mt-0.5 font-medium text-white">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
