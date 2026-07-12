import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
  // DATABASE_URL must point at Supabase's transaction-mode pooler (port 6543).
  // Session mode (5432) hands every client its own Postgres connection out of a
  // 15-connection budget, and serverless instances scale independently — there is
  // no per-process cap that keeps their combined pools under that ceiling, so it
  // fails with EMAXCONNSESSION under load. Transaction mode multiplexes instead.
  const pool = new pg.Pool({
    connectionString,
    max: 2, // Small per-instance pool: a request only needs one connection at a time.
    idleTimeoutMillis: 10000, // Free up idle connections after 10 seconds
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
