"use client";

import { motion } from "framer-motion";
import { sponsors } from "@/data/sponsors";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

const tierStyles: Record<string, string> = {
  "Title Sponsor": "from-gold-soft/20 to-gold/5 text-gold border-gold/30",
  "Gold Sponsor": "from-gold/10 to-transparent text-gold/90 border-gold/20",
  "Silver Sponsor": "from-white/10 to-transparent text-white/80 border-white/15",
  "Media Partner":
    "from-electric/10 to-transparent text-electric border-electric/25",
};

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Powered By"
          title={
            <>
              Our <span className="text-gradient-gold">Partners</span>
            </>
          }
          description="The brands backing the inaugural Kinniya Premier League."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((sponsor, i) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
              className={cn(
                "group flex flex-col items-center justify-center gap-3 rounded-3xl border bg-gradient-to-b p-6 text-center transition-all duration-300 hover:-translate-y-1",
                tierStyles[sponsor.tier]
              )}
            >
              <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/5 font-display text-xl font-extrabold text-white/80 transition-transform duration-300 group-hover:scale-110">
                {sponsor.initials}
              </div>
              <div>
                <p className="font-semibold text-white">{sponsor.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-80">
                  {sponsor.tier}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
