import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Constant-time comparison so the secret cannot be recovered byte-by-byte
 * from response timing.
 */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  // Fail closed: an unset CRON_SECRET must not leave the endpoint open.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[DB Ping API] CRON_SECRET is not configured; refusing the request.");
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const authHeader = request.headers.get("authorization") ?? "";
  if (!secretMatches(authHeader, `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // A simple query to wake up/keep database active
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log the detail server-side; never return driver/DB internals to the caller.
    console.error("[DB Ping API] Error pinging database:", error);
    return NextResponse.json({ success: false, error: "Database ping failed" }, { status: 500 });
  }
}
