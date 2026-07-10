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
  // Setup standard PostgreSQL connection pool with limits to prevent EMAXCONNSESSION
  const pool = new pg.Pool({
    connectionString,
    max: 2, // Cap pool size per process to stay safely below Supabase's limit of 15 (7 workers * 2 = 14)
    idleTimeoutMillis: 10000, // Free up idle connections after 10 seconds
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
