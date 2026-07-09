import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory sliding-window counters, keyed by client IP.
//
// NOTE: this is per-instance state. On a multi-instance or serverless
// deployment each instance keeps its own window, so the effective limit is
// (limit x instances). It is a speed bump, not a guarantee — the authoritative
// controls are the per-account lockout and OTP throttle in lib/auth.ts.
const ipCache = new Map<string, number[]>();

const WINDOW_MS = 60 * 1000; // 1 minute sliding window
const MAX_TRACKED_IPS = 10_000; // hard ceiling so the map cannot grow without bound
const PRUNE_INTERVAL_MS = 30 * 1000;

let lastPruneAt = 0;

const pruneCache = (limitTime: number) => {
  for (const [ip, timestamps] of ipCache.entries()) {
    const valid = timestamps.filter((t) => t > limitTime);
    if (valid.length === 0) {
      ipCache.delete(ip);
    } else {
      ipCache.set(ip, valid);
    }
  }
};

/**
 * Resolve the client IP.
 *
 * `x-forwarded-for` is attacker-controlled unless a trusted proxy overwrites it,
 * and a spoofed value would let a caller mint a fresh rate-limit bucket per
 * request. Prefer the headers that hosting platforms set themselves, and only
 * then fall back to the left-most forwarded hop.
 */
const getClientIp = (request: NextRequest): string => {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "127.0.0.1";
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);
  const now = Date.now();
  const limitTime = now - WINDOW_MS;

  // Time-based pruning, plus a hard ceiling to bound memory under IP churn.
  if (now - lastPruneAt >= PRUNE_INTERVAL_MS || ipCache.size > MAX_TRACKED_IPS) {
    lastPruneAt = now;
    pruneCache(limitTime);
    if (ipCache.size > MAX_TRACKED_IPS) ipCache.clear();
  }

  const timestamps = ipCache.get(ip) ?? [];
  const validTimestamps = timestamps.filter((t) => t > limitTime);

  // Rate limits configuration:
  // - High-risk authentication routes (login, otp, change-password): max 15 requests per minute
  // - Standard admin and auth routes (fetching data, updating, uploading): max 100 requests per minute
  const isHighRisk =
    pathname.includes("/login") ||
    pathname.includes("/otp") ||
    pathname.includes("/change-password");

  const limit = isHighRisk ? 15 : 100;

  if (validTimestamps.length >= limit) {
    // Persist the trimmed window so the entry still expires on schedule.
    ipCache.set(ip, validTimestamps);

    // Oldest timestamp in the window determines when a slot frees up.
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((validTimestamps[0] + WINDOW_MS - now) / 1000)
    );

    return new NextResponse(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSeconds),
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  validTimestamps.push(now);
  ipCache.set(ip, validTimestamps);

  return NextResponse.next();
}

// Match all admin and authentication API routes
export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/auth/:path*",
  ],
};
