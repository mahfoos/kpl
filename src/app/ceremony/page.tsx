"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { teams } from "@/data/teams";
import { retainedByTeam, type RetainedPlayer } from "@/data/retained";
import { ownerByTeam, type TeamOwner } from "@/data/owners";
import { mediaTeam, type MediaMember } from "@/data/media-team";
import { ScreenScaleControl } from "@/components/auction/ScreenScaleControl";
import type { Team } from "@/types";

type Scene =
  | { type: "intro" }
  | {
      type: "title";
      eyebrow: string;
      title: string;
      subtitle?: string;
      note?: string;
      icon: ReactNode;
      image?: string;
    }
  | { type: "person"; eyebrow: string; name: string; role: string; image: string }
  | { type: "mediaTeam"; members: MediaMember[] }
  | { type: "teamLogo"; team: Team; index: number; total: number }
  | { type: "owner"; team: Team; owner: TeamOwner }
  | { type: "retained"; team: Team; players: RetainedPlayer[] }
  | { type: "closing" };

/** Build the running order of the opening ceremony. */
function buildScenes(): Scene[] {
  const scenes: Scene[] = [{ type: "intro" }];

  scenes.push({
    type: "title",
    eyebrow: "Welcome",
    title: "The KPL Committee",
    subtitle: "Kinniya Premier League — Organising Committee",
    note: "Send committee names / photos to fill this slide.",
    icon: <Users className="size-10" />,
  });
  scenes.push({
    type: "title",
    eyebrow: "Governing Body",
    title: "Kinniya Cricket Board",
    subtitle: "KCB",
    icon: <ShieldCheck className="size-10" />,
    image: "/kcb-logo.png",
  });
  scenes.push({
    type: "person",
    eyebrow: "Chief Guest & Main Sponsor",
    name: "Imran Maharoof",
    role: "Member of Parliament (MP)",
    image: "/imran-maharoof.jpg",
  });
  if (mediaTeam.length) scenes.push({ type: "mediaTeam", members: mediaTeam });

  scenes.push({
    type: "title",
    eyebrow: "The Franchises",
    title: "Eight Teams. One Crown.",
    icon: <Crown className="size-10" />,
  });

  teams.forEach((team, i) => {
    scenes.push({ type: "teamLogo", team, index: i, total: teams.length });
    const owner = ownerByTeam[team.id];
    if (owner) scenes.push({ type: "owner", team, owner });
    const players = retainedByTeam[team.id] ?? [];
    if (players.length) scenes.push({ type: "retained", team, players });
  });

  scenes.push({ type: "closing" });
  return scenes;
}

export default function CeremonyPage() {
  const scenes = useMemo(buildScenes, []);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const total = scenes.length;

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      setI((n) => Math.min(total - 1, Math.max(0, n + delta)));
    },
    [total],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const scene = scenes[i];

  return (
    <>
      <ScreenScaleControl targetId="ceremony-screen" />
      <main
        id="ceremony-screen"
        onClick={() => go(1)}
        className="relative flex min-h-[100svh] cursor-pointer select-none flex-col overflow-hidden bg-ink text-white"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[130px]" />

        {/* Scene */}
        <div className="relative flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={i}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d > 0 ? 70 : -70, scale: 0.98 }),
                center: { opacity: 1, x: 0, scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: d > 0 ? -70 : 70, scale: 0.98 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-6xl"
            >
              <SceneView scene={scene} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-between gap-4 px-6 pb-6 sm:px-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            disabled={i === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="size-4" /> Back
          </button>

          {/* Progress */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold to-electric"
                animate={{ width: `${((i + 1) / total) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
              {i + 1} / {total} · tap or press →
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            disabled={i === total - 1}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-4 py-2 text-sm font-bold text-gold transition-colors hover:bg-gold/25 disabled:opacity-30"
          >
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </main>
    </>
  );
}

function SceneView({ scene }: { scene: Scene }) {
  switch (scene.type) {
    case "intro":
      return <IntroScene />;
    case "title":
      return <TitleScene scene={scene} />;
    case "person":
      return <PersonScene scene={scene} />;
    case "mediaTeam":
      return <MediaTeamScene scene={scene} />;
    case "teamLogo":
      return <TeamLogoScene scene={scene} />;
    case "owner":
      return <OwnerScene scene={scene} />;
    case "retained":
      return <RetainedScene scene={scene} />;
    case "closing":
      return <ClosingScene />;
  }
}

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + d * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

function IntroScene() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src="/kpl-logo.png"
          alt="Kinniya Premier League"
          width={1599}
          height={984}
          priority
          className="h-auto w-full max-w-2xl drop-shadow-[0_10px_60px_rgba(245,183,0,0.3)]"
        />
      </motion.div>
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="mt-8 text-sm font-bold uppercase tracking-[0.5em] text-electric sm:text-base"
      >
        Mega Auction 2026
      </motion.p>
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="text-gradient-gold mt-3 font-display text-5xl font-black uppercase tracking-tight sm:text-7xl"
      >
        A New Era Begins
      </motion.h1>
    </div>
  );
}

function TitleScene({ scene }: { scene: Extract<Scene, { type: "title" }> }) {
  return (
    <div className="flex flex-col items-center text-center">
      {scene.image ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 170, damping: 15 }}
          className="relative size-56 overflow-hidden rounded-[2rem] border-4 border-electric/50 shadow-[0_0_70px_-10px_rgba(56,189,248,0.7)] sm:size-72"
        >
          <Image
            src={scene.image}
            alt={scene.title}
            fill
            sizes="18rem"
            className="object-cover"
            priority
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="grid size-24 place-items-center rounded-3xl border border-gold/30 bg-gold/10 text-gold"
        >
          {scene.icon}
        </motion.div>
      )}
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="mt-8 text-sm font-bold uppercase tracking-[0.5em] text-electric"
      >
        {scene.eyebrow}
      </motion.p>
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-3 font-display text-5xl font-black text-white sm:text-7xl"
      >
        {scene.title}
      </motion.h1>
      {scene.subtitle && (
        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-4 max-w-2xl text-lg text-white/60 sm:text-2xl"
        >
          {scene.subtitle}
        </motion.p>
      )}
      {scene.note && (
        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-6 rounded-full border border-dashed border-white/15 px-4 py-1.5 text-xs italic text-white/30"
        >
          {scene.note}
        </motion.p>
      )}
    </div>
  );
}

function PersonScene({ scene }: { scene: Extract<Scene, { type: "person" }> }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        className="mb-6 text-sm font-bold uppercase tracking-[0.5em] text-gold"
      >
        {scene.eyebrow}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.15 }}
        className="relative size-56 overflow-hidden rounded-full border-4 border-gold/60 shadow-2xl sm:size-72"
      >
        <Image
          src={scene.image}
          alt={scene.name}
          fill
          sizes="18rem"
          className="object-cover object-top"
          priority
        />
      </motion.div>
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-8 font-display text-5xl font-extrabold text-white sm:text-7xl"
      >
        {scene.name}
      </motion.h1>
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-3 text-lg font-semibold uppercase tracking-[0.25em] text-white/60"
      >
        {scene.role}
      </motion.p>
    </div>
  );
}

function TeamLogoScene({ scene }: { scene: Extract<Scene, { type: "teamLogo" }> }) {
  const { team, index, total } = scene;
  return (
    <div className="flex flex-col items-center text-center">
      {/* team-coloured glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: `${team.primary}44` }}
      />
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        className="mb-6 text-xs font-bold uppercase tracking-[0.5em] text-white/40"
      >
        Franchise {index + 1} of {total}
      </motion.p>
      {team.logo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 15, delay: 0.1 }}
          className="relative size-60 overflow-hidden rounded-[2rem] border-4 sm:size-80"
          style={{ borderColor: `${team.primary}aa`, boxShadow: `0 0 70px -10px ${team.primary}` }}
        >
          <Image
            src={team.logo}
            alt={team.name}
            fill
            sizes="20rem"
            className="object-cover"
            priority
          />
        </motion.div>
      )}
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-8 font-display text-5xl font-black uppercase tracking-tight sm:text-7xl"
        style={{ color: team.primary }}
      >
        {team.name}
      </motion.h1>
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-2 text-sm font-semibold uppercase tracking-[0.35em] text-white/50"
      >
        {team.city}
      </motion.p>
    </div>
  );
}

function MediaTeamScene({ scene }: { scene: Extract<Scene, { type: "mediaTeam" }> }) {
  const { members } = scene;
  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        className="mb-1 text-xs font-bold uppercase tracking-[0.5em] text-gold"
      >
        Committee Team
      </motion.p>
      <motion.h2
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="text-gradient-gold mb-8 font-display text-4xl font-black uppercase sm:text-6xl"
      >
        Media Team
      </motion.h2>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {members.map((m, idx) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 17,
              delay: 0.2 + idx * 0.15,
            }}
            className="overflow-hidden rounded-2xl border-2 border-gold/40 shadow-2xl"
          >
            <Image
              src={m.card}
              alt={`${m.name} — media team`}
              width={1024}
              height={1280}
              className="h-[56vh] max-h-[540px] w-auto object-contain"
              priority
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OwnerScene({ scene }: { scene: Extract<Scene, { type: "owner" }> }) {
  const { team, owner } = scene;
  return (
    <div className="flex flex-col items-center text-center">
      {/* team-coloured glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: `${team.primary}44` }}
      />
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        className="mb-1 text-xs font-bold uppercase tracking-[0.5em] text-gold"
      >
        Team Owner
      </motion.p>
      <motion.h2
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="mb-6 font-display text-3xl font-extrabold uppercase sm:text-5xl"
        style={{ color: team.primary }}
      >
        {team.name}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 16, delay: 0.15 }}
        className="overflow-hidden rounded-2xl border-2 shadow-2xl"
        style={{ borderColor: `${team.primary}88`, boxShadow: `0 0 70px -12px ${team.primary}` }}
      >
        <Image
          src={owner.card}
          alt={`${owner.name} — team owner`}
          width={1024}
          height={1280}
          className="h-[62vh] max-h-[620px] w-auto object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}

function RetainedScene({ scene }: { scene: Extract<Scene, { type: "retained" }> }) {
  const { team, players } = scene;
  return (
    <div className="flex flex-col items-center text-center">
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        className="mb-1 text-xs font-bold uppercase tracking-[0.5em] text-gold"
      >
        Retained Players
      </motion.p>
      <motion.h2
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="mb-8 font-display text-3xl font-extrabold uppercase sm:text-5xl"
        style={{ color: team.primary }}
      >
        {team.name}
      </motion.h2>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {players.map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 17,
              delay: 0.2 + idx * 0.15,
            }}
            className="overflow-hidden rounded-2xl border-2 shadow-2xl"
            style={{ borderColor: `${team.primary}88` }}
          >
            <Image
              src={p.card}
              alt={`${p.name} — retained`}
              width={520}
              height={728}
              className="h-[58vh] max-h-[560px] w-auto object-contain"
              priority
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClosingScene() {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="grid size-24 place-items-center rounded-3xl border-2 border-gold/50 bg-gold/15 text-gold shadow-[0_0_50px_rgba(245,183,0,0.4)]"
      >
        <Trophy className="size-12" />
      </motion.div>
      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
        className="mt-8 text-sm font-bold uppercase tracking-[0.5em] text-electric"
      >
        The Wait Is Over
      </motion.p>
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
        className="text-gradient-gold mt-3 font-display text-5xl font-black uppercase sm:text-8xl"
      >
        Let The Auction Begin
      </motion.h1>
      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-10"
      >
        <Link
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-lg font-black uppercase tracking-wide text-navy transition-transform hover:scale-105"
        >
          <Sparkles className="size-5" /> Open Auction Screen
          <ArrowRight className="size-5" />
        </Link>
      </motion.div>
    </div>
  );
}
