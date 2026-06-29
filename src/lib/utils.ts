import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Central date for the KPL Mega Auction. Countdown timers reference this.
 * Update this single source of truth to shift every countdown on the site.
 */
export const MEGA_AUCTION_DATE = "2026-07-04T18:00:00+05:30";
