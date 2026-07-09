import { NextResponse } from "next/server";

/**
 * Applies defence-in-depth headers to an API (JSON) response.
 *
 * Page responses get their headers from `headers()` in next.config.ts — this
 * helper only covers route handlers, whose responses bypass that config.
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  // Authenticated JSON must never be stored by shared caches.
  response.headers.set("Cache-Control", "no-store");
  return response;
}
