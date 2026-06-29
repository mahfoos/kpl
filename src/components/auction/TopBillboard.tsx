"use client";

import Image from "next/image";
import { sponsors } from "@/data/sponsors";

/**
 * Wide sliding billboard at the top of the big screen: the Chief Guest (with
 * photo) and the KPL sponsors, in large text. Duplicated for a seamless loop.
 */
export function TopBillboard() {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-navy-light/60 to-ink py-5">
      <div
        className="flex w-max animate-marquee items-center gap-16 will-change-transform"
        style={{ animationDuration: "38s" }}
      >
        <Segment />
        <Segment />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

function Segment() {
  return (
    <div className="flex items-center gap-16">
      {/* Chief guest */}
      <div className="flex items-center gap-5">
        <Image
          src="/imran-maharoof.jpg"
          alt="Imran Maharoof"
          width={88}
          height={88}
          className="size-[88px] shrink-0 rounded-full object-cover ring-4 ring-gold/60"
        />
        <div className="whitespace-nowrap">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-electric">
            Chief Guest &amp; Sponsor of KPL
          </p>
          <p className="text-gradient-gold font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Imran Maharoof
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
            Member of Parliament (MP)
          </p>
        </div>
      </div>

      <Dot />

      {/* Partners */}
      <p className="font-display text-3xl font-black uppercase tracking-widest text-white/70 sm:text-4xl">
        Partners
      </p>
      {sponsors.map((s) => (
        <div key={s.id} className="flex items-center gap-16 whitespace-nowrap">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold/80">
              {s.tier}
            </p>
            <p className="font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
              {s.name}
            </p>
          </div>
          <Dot />
        </div>
      ))}
    </div>
  );
}

function Dot() {
  return <span className="text-2xl text-gold">●</span>;
}
