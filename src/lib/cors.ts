/**
 * The auctioneer runs as a separate Next.js app on another origin (often a
 * different machine on the LAN), so the auction API must allow cross-origin
 * reads, the SSE stream, and POSTed actions.
 */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function withCors(init: ResponseInit = {}): ResponseInit {
  return { ...init, headers: { ...CORS_HEADERS, ...(init.headers ?? {}) } };
}
