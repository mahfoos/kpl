"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import type { AuctionState } from "@/types";

interface UseAuctionState {
  state: AuctionState | null;
  connected: boolean;
}

/**
 * Subscribes to the live auction snapshot over Supabase Realtime. The initial
 * row is fetched once, then every change is pushed to the screen instantly.
 */
export function useAuctionState(): UseAuctionState {
  const [state, setState] = useState<AuctionState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setConnected(false);
      return;
    }

    let active = true;

    supabase
      .from("auction_snapshot")
      .select("state")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.state) setState(data.state as AuctionState);
      });

    const channel = supabase
      .channel("auction-snapshot")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_snapshot", filter: "id=eq.1" },
        (payload) => {
          const row = payload.new as { state?: AuctionState };
          if (row?.state) setState(row.state);
        },
      )
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { state, connected };
}
