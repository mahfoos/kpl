"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (anon key, read-only via RLS). Used by the live
 * screen + admin to subscribe to auction state over Realtime.
 */
let client: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null; // not configured yet
  if (!client) {
    client = createClient(url, anon, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return client;
}
