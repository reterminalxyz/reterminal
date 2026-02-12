import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export let dbReady = false;
export let dbError: string | null = null;

let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (!process.env.DATABASE_URL) {
  console.error("========================================");
  console.error("WARNING: DATABASE_URL is not set!");
  console.error("The server will start but database features will not work.");
  console.error("For Railway: Add a PostgreSQL plugin or set DATABASE_URL manually.");
  console.error("========================================");
  dbError = "DATABASE_URL is not set";
} else {
  try {
    const url = process.env.DATABASE_URL;
    const hostMatch = url.match(/@([^:/]+)/);
    const portMatch = url.match(/:(\d+)\//);
    const dbMatch = url.match(/\/([^?]+)(\?|$)/);
    console.log(`[db] Connecting to PostgreSQL at ${hostMatch?.[1] || "unknown"}:${portMatch?.[1] || "5432"}/${dbMatch?.[1] || "unknown"}`);

    pool = new Pool({
      connectionString: url,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 10,
    });

    pool.on("error", (err) => {
      console.error("[db] Unexpected pool error:", err.message);
      dbReady = false;
      dbError = err.message;
    });

    db = drizzle(pool, { schema });

    pool.connect()
      .then((client) => {
        console.log("[db] Successfully connected to PostgreSQL");
        dbReady = true;
        dbError = null;
        client.release();
      })
      .catch((err) => {
        console.error("========================================");
        console.error("[db] Failed to connect to PostgreSQL!");
        console.error("[db] Error:", err.message);
        console.error("[db] Check that DATABASE_URL is correct and the database is accessible.");
        console.error("========================================");
        dbReady = false;
        dbError = err.message;
      });
  } catch (err: any) {
    console.error("[db] Error initializing database:", err.message);
    dbError = err.message;
  }
}

export { pool, db };
