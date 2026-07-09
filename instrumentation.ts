export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically import prisma to avoid edge execution issues if next/server runs edge runtime somewhere
    const { prisma } = await import("@/lib/prisma");
    
    const pingDatabase = async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (error) {
        console.error("[DB Ping] Database ping failed:", error);
      }
    };

    // Run first ping immediately on startup
    pingDatabase();
    
    // Schedule ping every 12 hours (12 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    setInterval(pingDatabase, TWELVE_HOURS);
  }
}
