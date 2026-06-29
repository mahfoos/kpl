"use client";

import { Wifi, WifiOff } from "lucide-react";
import { LedTicker } from "@/components/auction/LedTicker";
import { TopBillboard } from "@/components/auction/TopBillboard";
import { LiveStage } from "@/components/auction/LiveStage";
import { TeamPurseStrip } from "@/components/auction/TeamPurseStrip";
import { useAuctionState } from "@/hooks/useAuctionState";

export default function LiveScreen() {
  const { state, connected } = useAuctionState();

  const tickerItems = [
    "KINNIYA PREMIER LEAGUE",
    "SEASON 1 · 2026",
    "MEGA AUCTION LIVE",
    state?.lastEvent ?? "208 PLAYERS · 8 TEAMS · ONE CHAMPION",
  ];

  return (
    <main className="flex min-h-[100svh] flex-col bg-ink">
      <LedTicker items={tickerItems} />
      <TopBillboard />

      {/* Connection status */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4 py-3 sm:px-6">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
            connected
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {connected ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
          {connected ? "Live" : "Reconnecting…"}
        </span>
      </div>

      {/* Stage */}
      <section className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-6 sm:px-6">
        <div className="w-full">
          <LiveStage state={state} />
        </div>
      </section>

      {/* Team purse board — sliding strip of crest cards */}
      <section className="w-full pb-8">
        <p className="mx-auto mb-3 max-w-7xl px-4 text-xs font-bold uppercase tracking-[0.3em] text-white/40 sm:px-6">
          Team Purses · 75,000 each
        </p>
        <TeamPurseStrip
          state={state}
          highlightTeamId={state?.current?.leadingTeamId}
        />
      </section>
    </main>
  );
}
