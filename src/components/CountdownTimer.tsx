"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetIso: string;
  variant?: "gold" | "electric";
  size?: "default" | "lg";
  className?: string;
}

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

export function CountdownTimer({
  targetIso,
  variant = "gold",
  size = "default",
  className,
}: CountdownTimerProps) {
  const t = useCountdown(targetIso);

  const values = t
    ? [t.days, t.hours, t.minutes, t.seconds]
    : [null, null, null, null];

  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-2.5 sm:gap-4",
        size === "lg" ? "max-w-2xl" : "max-w-md",
        className
      )}
    >
      {UNITS.map((unit, i) => (
        <div
          key={unit}
          className="glass relative overflow-hidden rounded-2xl px-1 py-4 text-center sm:py-5"
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-px",
              variant === "gold"
                ? "bg-gradient-to-r from-transparent via-gold to-transparent"
                : "bg-gradient-to-r from-transparent via-electric to-transparent"
            )}
          />
          <div
            className={cn(
              "font-display font-bold tabular-nums",
              variant === "gold" ? "text-gradient-gold" : "text-gradient-electric",
              size === "lg" ? "text-4xl sm:text-6xl" : "text-3xl sm:text-4xl"
            )}
          >
            {values[i] === null ? (
              <span className="opacity-40">--</span>
            ) : (
              <motion.span
                key={values[i]}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {String(values[i]).padStart(2, "0")}
              </motion.span>
            )}
          </div>
          <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}
