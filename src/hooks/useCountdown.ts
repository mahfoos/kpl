"use client";

import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function getTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isComplete: false,
  };
}

/**
 * Live countdown to an ISO date string. Returns null until mounted to avoid
 * any server/client hydration mismatch (the target is time-dependent).
 */
export function useCountdown(targetIso: string): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return timeLeft;
}
