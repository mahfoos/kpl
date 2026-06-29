"use client";

/**
 * Stadium-style LED ribbon that scrolls across the top of the big screen.
 * The text is duplicated so the -50% marquee translate loops seamlessly.
 */
export function LedTicker({ items }: { items: string[] }) {
  const sequence = items.length ? items : ["KINNIYA PREMIER LEAGUE"];
  const doubled = [...sequence, ...sequence];

  return (
    <div className="relative overflow-hidden border-y border-gold/30 bg-gradient-to-r from-gold/10 via-electric/10 to-gold/10 py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        {doubled.map((text, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-8 font-display text-lg font-extrabold uppercase tracking-[0.35em] text-gold sm:text-2xl"
          >
            {text}
            <span className="text-electric">●</span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
