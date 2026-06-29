"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/stats";
import { iconMap } from "@/lib/icons";
import { useCountUp } from "@/hooks/useCountUp";
import type { Stat } from "@/types";

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const Icon = iconMap[stat.icon];
  const { ref, value } = useCountUp(stat.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group glass relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:glow-gold sm:p-7"
    >
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gold/10 blur-2xl transition-opacity duration-300 group-hover:bg-gold/20" />
      <div className="relative flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-gold ring-1 ring-white/10">
          {Icon && <Icon className="size-5" />}
        </span>
      </div>
      <div className="relative mt-5">
        <span
          ref={ref}
          className="font-display text-4xl font-extrabold tabular-nums text-white sm:text-5xl"
        >
          {stat.comingSoon ? "Soon" : value.toLocaleString()}
          {stat.suffix}
        </span>
      </div>
      <p className="relative mt-2 font-display text-lg font-bold text-white">
        {stat.label}
      </p>
      <p className="relative mt-1 text-sm text-white/55">{stat.caption}</p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
