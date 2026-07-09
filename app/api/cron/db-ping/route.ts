import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional security check: if CRON_SECRET is set, validate it
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[DB Ping API] Triggering keep-alive query at ${new Date().toISOString()}...`);
    
    // A simple query to wake up/keep database active
    const result = await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("[DB Ping API] Error pinging database:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database ping failed" },
      { status: 500 }
    );
  }
}
