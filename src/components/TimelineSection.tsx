"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { timeline } from "@/data/timeline";
import { iconMap } from "@/lib/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/types";

function statusStyles(status: TimelineStep["status"]) {
  switch (status) {
    case "completed":
      return {
        node: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_0_24px_-4px_rgba(16,185,129,0.7)]",
        badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        label: "Completed",
      };
    case "final":
      return {
        node: "bg-gradient-to-br from-gold-soft to-gold text-navy shadow-[0_0_28px_-2px_rgba(245,183,0,0.8)]",
        badge: "border-gold/30 bg-gold/10 text-gold",
        label: "Grand Finale",
      };
    default:
      return {
        node: "bg-white/5 text-white/50 ring-1 ring-white/15",
        badge: "border-white/10 bg-white/5 text-white/50",
        label: "Upcoming",
      };
  }
}

export function TimelineSection() {
  return (
    <section id="roadmap" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Road to KPL"
          variant="electric"
          title={
            <>
              The Journey to <span className="text-gradient-electric">Glory</span>
            </>
          }
          description="Every milestone on the path from registration to the grand final."
        />

        <div className="relative mt-16">
          {/* Vertical track */}
          <div className="absolute left-[27px] top-2 h-full w-0.5 bg-white/10 sm:left-1/2 sm:-translate-x-1/2" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute left-[27px] top-2 w-0.5 origin-top bg-gradient-to-b from-emerald-400 via-gold to-transparent sm:left-1/2 sm:-translate-x-1/2"
            style={{ height: "42%" }}
          />

          <ul className="space-y-7">
            {timeline.map((step, i) => {
              const Icon = iconMap[step.icon];
              const s = statusStyles(step.status);
              const isLeft = i % 2 === 0;

              return (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={cn(
                    "relative flex items-start gap-5 sm:w-1/2",
                    isLeft
                      ? "sm:ml-0 sm:flex-row-reverse sm:pr-12 sm:text-right"
                      : "sm:ml-auto sm:pl-12"
                  )}
                >
                  {/* Node */}
                  <span
                    className={cn(
                      "relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl sm:absolute sm:top-1",
                      isLeft ? "sm:-right-7" : "sm:-left-7",
                      s.node
                    )}
                  >
                    {step.status === "completed" ? (
                      <Check className="size-6" />
                    ) : (
                      Icon && <Icon className="size-6" />
                    )}
                  </span>

                  {/* Card */}
                  <div className="glass flex-1 rounded-2xl p-5">
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        isLeft && "sm:justify-end"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          s.badge
                        )}
                      >
                        {s.label}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                        {step.date}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
