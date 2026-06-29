"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Gavel, ShieldHalf, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { StadiumBackground } from "@/components/StadiumBackground";
import { MEGA_AUCTION_DATE } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const tagline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-28 pb-16"
    >
      <StadiumBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6"
      >
        <motion.div variants={item}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles className="size-3.5" />
            Season 1 · 2026
          </span>
        </motion.div>

        <motion.div variants={item} className="relative mt-6 w-full">
          <h1 className="sr-only">
            Kinniya Premier League — 208 Players, 8 Teams, One Champion
          </h1>
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[90px]" />
          <Image
            src="/kpl-logo.png"
            alt="Kinniya Premier League logo"
            width={1599}
            height={984}
            priority
            className="mx-auto h-auto w-full max-w-2xl drop-shadow-[0_10px_60px_rgba(245,183,0,0.25)]"
          />
        </motion.div>

        <motion.p
          variants={tagline}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-base font-medium text-white/80 sm:text-xl"
        >
          <motion.span variants={word}>208 Players</motion.span>
          <motion.span
            variants={word}
            className="text-gold"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            •
          </motion.span>
          <motion.span variants={word}>8 Teams</motion.span>
          <motion.span
            variants={word}
            className="text-electric"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          >
            •
          </motion.span>
          <motion.span variants={word}>One Dream</motion.span>
          <motion.span
            variants={word}
            className="text-gold"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
          >
            •
          </motion.span>
          <motion.span
            variants={word}
            className="text-gradient-electric font-bold"
          >
            One Champion
          </motion.span>
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg">
            <a href="#teams">
              <ShieldHalf className="size-5" />
              Explore Teams
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#auction">
              <Gavel className="size-5" />
              Mega Auction
            </a>
          </Button>
        </motion.div>

        <motion.div variants={item} className="mt-14 w-full">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Mega Auction Countdown
          </p>
          <div className="flex justify-center">
            <CountdownTimer targetIso={MEGA_AUCTION_DATE} />
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/40"
        aria-label="Scroll down"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="block"
        >
          <ChevronDown className="size-6" />
        </motion.span>
      </motion.a>
    </section>
  );
}
