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

export const ANALYTICS_PASSWORD = "1209";

export function trackEvent(sessionId: string, eventName: string): void {
  const stmt = db.prepare("INSERT INTO events (session_id, event_name) VALUES (?, ?)");
  stmt.run(sessionId, eventName);
}

export function resetEvents(): void {
  db.exec("DELETE FROM events");
}

export function getStats(): { event_name: string; count: number }[] {
  const stmt = db.prepare("SELECT event_name, COUNT(*) as count FROM events GROUP BY event_name ORDER BY count DESC");
  return stmt.all() as { event_name: string; count: number }[];
}

export function getFunnelStats(): { event_name: string; unique_users: number }[] {
  const stmt = db.prepare("SELECT event_name, COUNT(DISTINCT session_id) as unique_users FROM events GROUP BY event_name");
  return stmt.all() as { event_name: string; unique_users: number }[];
}

export function getTotalUniqueUsers(): number {
  const stmt = db.prepare("SELECT COUNT(DISTINCT session_id) as total FROM events");
  const row = stmt.get() as { total: number };
  return row.total;
}

export function getAvgSessionDuration(): string {
  const stmt = db.prepare(`
    SELECT AVG(duration) as avg_sec FROM (
      SELECT session_id,
        (julianday(MAX(timestamp)) - julianday(MIN(timestamp))) * 86400 as duration
      FROM events
      GROUP BY session_id
      HAVING COUNT(*) > 1
    )
  `);
  const row = stmt.get() as { avg_sec: number | null };
  if (!row || row.avg_sec === null || row.avg_sec === 0) return "\u2014";
  const sec = Math.round(row.avg_sec);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  return `${min}m ${remSec}s`;
}

export function getSessionDurations(): { session_id: string; duration_sec: number; events_count: number; first_event: string; last_event: string }[] {
  const stmt = db.prepare(`
    SELECT session_id,
      CAST((julianday(MAX(timestamp)) - julianday(MIN(timestamp))) * 86400 AS INTEGER) as duration_sec,
      COUNT(*) as events_count,
      MIN(timestamp) as first_event,
      MAX(timestamp) as last_event
    FROM events
    GROUP BY session_id
    HAVING COUNT(*) > 1
    ORDER BY first_event DESC
    LIMIT 50
  `);
  return stmt.all() as any[];
}

const FUNNEL_ORDER = [
  { key: "page_view", label: "Page View" },
  { key: "q1_passed", label: "Phase 1 \u2014 Q1" },
  { key: "q2_passed", label: "Phase 1 \u2014 Q2" },
  { key: "q3_passed", label: "Phase 1 \u2014 Q3" },
  { key: "q4_passed", label: "Phase 1 \u2014 Q4" },
  { key: "phase_2_started", label: "Phase 2 Started" },
  { key: "block_1_completed", label: "Block 1" },
  { key: "block_2_completed", label: "Block 2" },
  { key: "block_3_completed", label: "Block 3" },
  { key: "block_4_completed", label: "Block 4" },
  { key: "block_5_completed", label: "Block 5" },
  { key: "block_6_completed", label: "Block 6" },
  { key: "block_7_completed", label: "Block 7" },
  { key: "block_8_completed", label: "Block 8" },
  { key: "wallet_started", label: "Wallet Created" },
];

export function renderLoginHTML(error?: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RE_CHAIN Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .login-box {
      background: #111;
      border: 1px solid #222;
      padding: 32px;
      border-radius: 4px;
      text-align: center;
      min-width: 280px;
    }
    h1 {
      color: #b87333;
      font-size: 16px;
      letter-spacing: 2px;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    input {
      background: #0a0a0a;
      border: 1px solid #333;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      font-size: 18px;
      padding: 10px 16px;
      text-align: center;
      letter-spacing: 4px;
      width: 100%;
      border-radius: 2px;
      margin-bottom: 16px;
    }
    input:focus { outline: none; border-color: #b87333; }
    button {
      background: #b87333;
      color: #0a0a0a;
      border: none;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      padding: 10px 24px;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 2px;
      width: 100%;
    }
    button:hover { background: #d4943d; }
    .error { color: #ff4444; font-size: 12px; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>Analytics Access</h1>
    <form method="POST" action="/api/stats/login">
      <input type="password" name="pwd" placeholder="****" maxlength="10" autofocus />
      <button type="submit">Enter</button>
    </form>
    ${error ? '<div class="error">Wrong password</div>' : ''}
  </div>
</body>
</html>`;
}

export function renderDashboardHTML(): string {
  const funnel = getFunnelStats();
  const funnelMap = new Map(funnel.map(f => [f.event_name, f.unique_users]));
  const totalUsers = getTotalUniqueUsers();
  const avgTime = getAvgSessionDuration();
  const sessions = getSessionDurations();

  const rows = FUNNEL_ORDER.map((step, i) => {
    const users = funnelMap.get(step.key) || 0;
    const prevUsers = i === 0 ? totalUsers : (funnelMap.get(FUNNEL_ORDER[i - 1].key) || 0);
    const dropoff = prevUsers > 0 ? prevUsers - users : 0;
    const pctOfTotal = totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0;
    const pctFromPrev = prevUsers > 0 ? Math.round((users / prevUsers) * 100) : 0;

    const isPhaseHeader = step.key === "page_view" || step.key === "phase_2_started";
    const barColor = step.key.startsWith("q") ? "#00e5ff" : step.key.startsWith("block") ? "#ffaa00" : step.key === "wallet_started" ? "#FFD700" : "#b87333";

    return `
      <tr class="${isPhaseHeader ? 'phase-header' : ''}">
        <td class="step-name">${step.label}</td>
        <td class="num">${users}</td>
        <td class="num">${pctOfTotal}%</td>
        <td class="num ${dropoff > 0 && i > 0 ? 'drop' : ''}">${i === 0 ? '\u2014' : (dropoff > 0 ? `\u2212${dropoff}` : '0')}</td>
        <td class="num">${i === 0 ? '\u2014' : `${pctFromPrev}%`}</td>
        <td class="bar-cell">
          <div class="bar" style="width: ${pctOfTotal}%; background: ${barColor};"></div>
        </td>
      </tr>`;
  }).join("\n");

  const sessionRows = sessions.map(s => {
    const dur = s.duration_sec;
    const durStr = dur < 60 ? `${dur}s` : `${Math.floor(dur / 60)}m ${dur % 60}s`;
    const shortId = s.session_id.substring(0, 8);
    return `
      <tr>
        <td style="color:#666">${shortId}...</td>
        <td class="num">${durStr}</td>
        <td class="num">${s.events_count}</td>
        <td style="color:#666;font-size:11px">${s.first_event}</td>
      </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RE_CHAIN Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      padding: 24px;
      min-height: 100vh;
    }
    h1 {
      color: #b87333;
      font-size: 20px;
      letter-spacing: 2px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    h2 {
      color: #b87333;
      font-size: 14px;
      letter-spacing: 1px;
      margin: 32px 0 12px;
      text-transform: uppercase;
    }
    .subtitle {
      color: #666;
      font-size: 12px;
      margin-bottom: 24px;
    }
    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .stat-card {
      background: #111;
      border: 1px solid #222;
      padding: 16px 24px;
      border-radius: 4px;
      min-width: 140px;
    }
    .stat-card .label {
      color: #666;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .stat-card .value {
      color: #FFD700;
      font-size: 28px;
      font-weight: bold;
      margin-top: 4px;
    }
    .stat-card .value.time {
      font-size: 22px;
      color: #00e5ff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      text-align: left;
      color: #666;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 8px 12px;
      border-bottom: 1px solid #222;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #1a1a1a;
    }
    tr:hover { background: #111; }
    tr.phase-header td {
      color: #b87333;
      font-weight: bold;
      border-top: 1px solid #333;
      padding-top: 16px;
    }
    .step-name { color: #ccc; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .drop { color: #ff4444; }
    .bar-cell { width: 30%; }
    .bar {
      height: 14px;
      border-radius: 2px;
      min-width: 2px;
      opacity: 0.8;
    }
    .reset-btn {
      background: #1a1a1a;
      color: #ff4444;
      border: 1px solid #333;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      padding: 6px 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 2px;
      margin-left: 16px;
    }
    .reset-btn:hover { background: #ff4444; color: #0a0a0a; border-color: #ff4444; }
    .footer {
      margin-top: 32px;
      color: #333;
      font-size: 11px;
    }
    .footer a { color: #666; }
    .header-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .logout-btn {
      background: none;
      color: #666;
      border: 1px solid #333;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      padding: 4px 10px;
      cursor: pointer;
      border-radius: 2px;
      letter-spacing: 1px;
    }
    .logout-btn:hover { color: #e0e0e0; border-color: #666; }
    @media (max-width: 600px) {
      body { padding: 12px; }
      .stat-card { min-width: 100px; padding: 12px 14px; }
      .stat-card .value { font-size: 22px; }
      .stat-card .value.time { font-size: 18px; }
      table { font-size: 11px; }
      td, th { padding: 6px 8px; }
      .bar-cell { display: none; }
    }
  </style>
</head>
<body>
  <div class="header-row">
    <h1>RE_CHAIN Analytics</h1>
    <a href="/api/stats/logout" class="logout-btn">Logout</a>
  </div>
  <div class="subtitle">Funnel Dashboard \u2014 Unique users per step</div>

  <div class="stats-row">
    <div class="stat-card">
      <div class="label">Total unique users</div>
      <div class="value">${totalUsers}</div>
    </div>
    <div class="stat-card">
      <div class="label">Reached Phase 2</div>
      <div class="value">${funnelMap.get("phase_2_started") || 0}</div>
    </div>
    <div class="stat-card">
      <div class="label">Wallet Created</div>
      <div class="value">${funnelMap.get("wallet_started") || 0}</div>
    </div>
    <div class="stat-card">
      <div class="label">Avg. Time on Site</div>
      <div class="value time">${avgTime}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Step</th>
        <th style="text-align:right">Users</th>
        <th style="text-align:right">% of Total</th>
        <th style="text-align:right">Drop-off</th>
        <th style="text-align:right">Conversion</th>
        <th>Funnel</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  ${sessions.length > 0 ? `
  <h2>Recent Sessions</h2>
  <table>
    <thead>
      <tr>
        <th>Session</th>
        <th style="text-align:right">Duration</th>
        <th style="text-align:right">Events</th>
        <th>Started</th>
      </tr>
    </thead>
    <tbody>
      ${sessionRows}
    </tbody>
  </table>
  ` : ''}

  <div class="footer">
    <form method="POST" action="/api/stats/reset" style="display:inline" onsubmit="return confirm('Reset all analytics data?')">
      <button type="submit" class="reset-btn">Reset Data</button>
    </form>
  </div>
</body>
</html>`;
}
