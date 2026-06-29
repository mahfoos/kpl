/**
 * Central tuning for the live KPL auction.
 * Every team starts with the same purse; the auctioneer raises bids in these steps.
 */
export const TEAM_BUDGET = 75_000;

/** Fallback base price when a player has no explicit `basePriceValue`. */
export const DEFAULT_BASE_PRICE = 2_000;

/** Quick-tap increments shown to the auctioneer (in LKR). */
export const BID_STEPS = [500, 1_000, 2_000, 5_000] as const;

export const CURRENCY = "LKR";

/** Format a whole-rupee amount as "LKR 12,500". */
export function formatMoney(amount: number): string {
  return `${CURRENCY} ${amount.toLocaleString("en-LK")}`;
}

/** Short form for tight spaces, e.g. "12,500". */
export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-LK");
}
