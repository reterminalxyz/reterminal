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
      .then(async (client) => {
        console.log("[db] Successfully connected to PostgreSQL");
        try {
          await client.query(`
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              token TEXT NOT NULL UNIQUE,
              xp INTEGER NOT NULL DEFAULT 0,
              level INTEGER NOT NULL DEFAULT 1,
              current_module_id TEXT,
              current_step_index INTEGER NOT NULL DEFAULT 0,
              total_sats INTEGER NOT NULL DEFAULT 0,
              independence_progress INTEGER NOT NULL DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS sessions (
              id SERIAL PRIMARY KEY,
              node_id TEXT NOT NULL,
              independence_score INTEGER NOT NULL DEFAULT 0,
              current_step_id TEXT NOT NULL,
              history JSONB DEFAULT '[]',
              created_at TIMESTAMP DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS user_skills (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL,
              skill_key TEXT NOT NULL,
              granted_at TIMESTAMP DEFAULT NOW()
            );
            CREATE TABLE IF NOT EXISTS analytics_events (
              id SERIAL PRIMARY KEY,
              session_id TEXT NOT NULL,
              event_name TEXT NOT NULL,
              source TEXT NOT NULL DEFAULT 'web',
              timestamp TIMESTAMP DEFAULT NOW()
            );
          `);
          console.log("[db] Tables verified/created successfully");
        } catch (migErr: any) {
          console.error("[db] Table creation error:", migErr.message);
        }
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
