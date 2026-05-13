import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("CRITICAL: DATABASE_URL is missing from environment variables!");
}

console.log(`Database URL detected: ${connectionString.substring(0, 20)}...`);

const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Slightly longer for stability
  allowExitOnIdle: true,
});

const adapter = new PrismaPg(pool);

export const db = globalThis.prisma ?? new PrismaClient({ 
  adapter,
  log: ["error"],
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// Basic health check for development
if (process.env.NODE_ENV === "development") {
  db.$connect()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err.message));
}
