import { readSnapshot } from "@/lib/auction-snapshot";
import { withCors } from "@/lib/cors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json(await readSnapshot(), withCors());
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return Response.json({ error: message }, withCors({ status: 500 }));
  }
}
