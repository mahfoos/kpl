"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import type { AuctionState } from "@/types";

interface UseAuctionState {
  state: AuctionState | null;
  connected: boolean;
}

/**
 * Live auction snapshot for the big screen.
 *
 * Initial state always comes from the app's own API (`/api/auction/state`,
 * server-side Postgres) so it works even before the Supabase anon key is set.
 * If the anon key IS configured, we also subscribe to Supabase Realtime for
 * instant pushes; otherwise we fall back to polling the API once a second.
 */
export function useAuctionState(): UseAuctionState {
  const [state, setState] = useState<AuctionState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchState(trackConnection = false) {
      try {
        const res = await fetch("/api/auction/state", { cache: "no-store" });
        if (!res.ok) {
          if (trackConnection) setConnected(false);
          return;
        }
        const data = (await res.json()) as AuctionState;
        if (active && data && typeof data.version === "number") {
          setState(data);
          if (trackConnection) setConnected(true);
        }
      } catch {
        if (trackConnection) setConnected(false);
      }
    }

    const supabase = getBrowserSupabase();

    // No anon key → poll the API so the screen still updates live-ish.
    if (!supabase) {
      fetchState(true);
      const id = setInterval(() => fetchState(true), 1000);
      return () => {
        active = false;
        clearInterval(id);
      };
    }

    // Anon key present → load once, then push updates instantly over Realtime.
    fetchState();
    const channel = supabase
      .channel("auction-snapshot")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auction_snapshot", filter: "id=eq.1" },
        (payload) => {
          const row = payload.new as { state?: AuctionState };
          if (active && row?.state) setState(row.state);
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
