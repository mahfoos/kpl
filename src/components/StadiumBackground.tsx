"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Deterministic pseudo-random so server and client render identically.
function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Round to fixed precision so SSR and client serialize styles identically.
const r = (n: number, d = 2) => Number(n.toFixed(d));

export function StadiumBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: r(seeded(i + 1) * 100, 3),
        size: r(1.5 + seeded(i + 7) * 3),
        duration: r(8 + seeded(i + 3) * 12),
        delay: r(seeded(i + 5) * 8),
        drift: r((seeded(i + 9) - 0.5) * 60),
        gold: seeded(i + 11) > 0.5,
      })),
    []
  );

  // Particles animate with framer-motion and would mismatch on hydration,
  // so render them only after mount (purely decorative).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base radial glows */}
      <div className="absolute -top-1/3 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />
      <div className="absolute -bottom-1/4 -left-1/4 h-[60vh] w-[60vh] rounded-full bg-electric/15 blur-[120px]" />
      <div className="absolute -right-1/4 top-1/4 h-[50vh] w-[50vh] rounded-full bg-gold/10 blur-[120px]" />

      {/* Stadium floodlight beams */}
      <div className="absolute inset-0 opacity-60">
        {[20, 50, 80].map((x, i) => (
          <motion.div
            key={x}
            className="absolute top-0 origin-top"
            style={{
              left: `${x}%`,
              width: "2px",
              height: "70%",
              background:
                "linear-gradient(to bottom, rgba(245,183,0,0.35), transparent)",
              filter: "blur(2px)",
            }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Floodlight lamp dots at top */}
      <div className="absolute left-0 right-0 top-6 flex justify-around px-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-gold-soft shadow-[0_0_14px_4px_rgba(245,183,0,0.6)]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {mounted &&
        particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.gold ? "#f5b700" : "#00c2ff",
            boxShadow: `0 0 ${r(p.size * 3)}px ${p.gold ? "#f5b700" : "#00c2ff"}`,
          }}
          animate={{
            y: ["10vh", "-90vh"],
            x: [0, p.drift],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Grid texture + vignette */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
    </div>
  );
}
