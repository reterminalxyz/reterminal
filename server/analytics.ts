import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "analytics.db");

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function trackEvent(sessionId: string, eventName: string): void {
  const stmt = db.prepare("INSERT INTO events (session_id, event_name) VALUES (?, ?)");
  stmt.run(sessionId, eventName);
}

export function getStats(): { event_name: string; count: number }[] {
  const stmt = db.prepare("SELECT event_name, COUNT(*) as count FROM events GROUP BY event_name ORDER BY count DESC");
  return stmt.all() as { event_name: string; count: number }[];
}
