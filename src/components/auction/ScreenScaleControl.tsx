"use client";

import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, RotateCcw, Scaling } from "lucide-react";

const KEY = "kpl-screen-scale";
const MIN = 0.6;
const MAX = 3;
const STEP = 0.1;

/** Sensible starting zoom for the viewport we happen to be on. */
function autoScale(): number {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w >= 3000) return 1.6;
  if (w >= 2200) return 1.3;
  if (w >= 1800) return 1.15;
  return 1;
}

const clamp = (n: number) =>
  Math.min(MAX, Math.max(MIN, Math.round(n * 10) / 10));

/**
 * Big-screen zoom control. Scales the element with `targetId` via CSS `zoom`
 * so the whole auction UI can be sized up to fill a large display. The chosen
 * scale is remembered in localStorage; keyboard +/-/0 also work.
 */
export function ScreenScaleControl({ targetId }: { targetId: string }) {
  const [scale, setScale] = useState<number | null>(null);

  // Initialise from a saved preference, else auto-size for this viewport.
  useEffect(() => {
    const saved = Number(localStorage.getItem(KEY));
    setScale(saved && saved > 0 ? clamp(saved) : autoScale());
  }, []);

  // Apply the zoom to the target and persist.
  useEffect(() => {
    if (scale === null) return;
    const el = document.getElementById(targetId);
    if (el) el.style.setProperty("zoom", String(scale));
    localStorage.setItem(KEY, String(scale));
  }, [scale, targetId]);

  const bump = useCallback((delta: number) => {
    setScale((s) => clamp((s ?? 1) + delta));
  }, []);
  const reset = useCallback(() => setScale(autoScale()), []);

  // Keyboard shortcuts: + / - / 0
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "+" || e.key === "=") bump(STEP);
      else if (e.key === "-" || e.key === "_") bump(-STEP);
      else if (e.key === "0") reset();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bump, reset]);

  if (scale === null) return null;

  return (
    <div className="fixed bottom-3 right-3 z-[60] flex items-center gap-1 rounded-full border border-white/10 bg-ink/80 px-1.5 py-1 text-white/70 opacity-40 shadow-lg backdrop-blur-md transition-opacity hover:opacity-100">
      <Scaling className="ml-1 size-3.5 text-white/40" />
      <button
        onClick={() => bump(-STEP)}
        aria-label="Zoom out"
        className="grid size-7 place-items-center rounded-full hover:bg-white/10"
      >
        <Minus className="size-3.5" />
      </button>
      <button
        onClick={reset}
        title="Reset zoom (0)"
        className="min-w-[3ch] rounded-full px-1 text-center text-xs font-bold tabular-nums text-white/80 hover:text-white"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        onClick={() => bump(STEP)}
        aria-label="Zoom in"
        className="grid size-7 place-items-center rounded-full hover:bg-white/10"
      >
        <Plus className="size-3.5" />
      </button>
      <button
        onClick={reset}
        aria-label="Reset zoom"
        className="grid size-7 place-items-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
      >
        <RotateCcw className="size-3" />
      </button>
    </div>
  );
}
