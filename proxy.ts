import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory cache for IP requests
// Map key: IP address
// Map value: Array of timestamps of requests
const ipCache = new Map<string, number[]>();

// Keep track of total requests to occasionally prune old cache entries
let totalRequests = 0;
const PRUNE_THRESHOLD = 200; // Prune every 200 requests

const pruneCache = (now: number, limitTime: number) => {
  for (const [ip, timestamps] of ipCache.entries()) {
    const valid = timestamps.filter((t) => t > limitTime);
    if (valid.length === 0) {
      ipCache.delete(ip);
    } else {
      ipCache.set(ip, valid);
    }
  }
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get client IP address
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute sliding window
  const limitTime = now - windowMs;

  // Periodic pruning to prevent memory leaks
  totalRequests++;
  if (totalRequests >= PRUNE_THRESHOLD) {
    totalRequests = 0;
    pruneCache(now, limitTime);
  }

  // Retrieve request history for this IP
  const timestamps = ipCache.get(ip) || [];
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
    console.warn(`[Rate Limit] Blocked request from IP ${ip} to ${pathname}`);
    
    // Calculate Retry-After time in seconds based on the oldest timestamp in the window
    const oldestTimestamp = validTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

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
          // CORS & Security Headers
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }

  // Record the request timestamp
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
