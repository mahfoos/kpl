import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { initialState, normalize } from "@/lib/auction-reducer";
import type { AuctionState } from "@/types";

/**
 * Server-side persistence for the single-row auction snapshot. Uses the
 * service-role key (bypasses RLS) so only the screen app's server can write.
 */

const TABLE = "auction_snapshot";
const ROW_ID = 1;

let admin: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  if (!admin) {
    admin = createClient(url, key, { auth: { persistSession: false } });
  }
  return admin;
}

/** Read the current snapshot, seeding a fresh one if the row is missing/empty. */
export async function readSnapshot(): Promise<AuctionState> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("state")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) throw new Error(`readSnapshot: ${error.message}`);

  if (!data?.state) {
    const fresh = initialState();
    await writeSnapshot(fresh);
    return fresh;
  }
  return normalize(data.state as AuctionState);
}

/** Persist a new snapshot; Realtime then pushes it to every connected screen. */
export async function writeSnapshot(state: AuctionState): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, state, updated_at: new Date().toISOString() });
  if (error) throw new Error(`writeSnapshot: ${error.message}`);
}
