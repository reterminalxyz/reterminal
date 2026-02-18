# re_terminal

re_terminal – a guerrilla-style gamified educational phygital terminal. It teaches users BTC and anti-authoritarian digital tools through interactive guides and tasks. 

People living under oppressive regimes face a critical gap: they understand their governments suppress freedom, but lack the practical tools to protect themselves digitally. Traditional financial systems are monitored, communications are surveilled, and information access is restricted. Meanwhile, BTC and privacy-preserving technologies remain inaccessible due to technical barriers and lack of localized, youth-friendly education.

The project is building on phygital principles (physical + digital). One of the entry points is a physical medium (NFC card). Users tap their phone → instant site access, can continue in the browser or download the app. The idea is to make a bridge between physical and digital activism. It enables grassroots distribution at conferences, meetups, and street-level engagement.


Month 0-1(done):

MVP launched, translation on 3 languages (EN/IT/RU), censorship-resistant mobile app, the prototype of educational module 1 (onboarding to financial freedom), fully functional BTC LN onboarding flow (10-15 minutes), live economic engine, analytics and statistics.


---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Routes & Pages](#routes--pages)
- [Onboarding Flow](#onboarding-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Internationalization (i18n)](#internationalization-i18n)
- [Skill System](#skill-system)
- [Sound System](#sound-system)
- [PWA Features](#pwa-features)
- [Design System](#design-system)
- [Persistence Strategy](#persistence-strategy)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Development](#development)

---

## Overview

Liberta Terminal guides users through a narrative-driven onboarding process for a Bitcoin Lightning Network NFC card. The experience is split into two phases:

1. **Phase 1 (Biometric Circuit)** - Light aluminum UI with progressive question flow
2. **Phase 2 (Dialogue with Satoshi)** - Dark terminal interface with 9 learning blocks (0-8) + wallet setup finale

Users earn SATS (satoshis) and unlock skills as they progress. Phase 1 awards 50 SATS per question (200 total), Phase 2 awards 100 SATS per learning block. The app features a "digital resistance" aesthetic inspired by Teenage Engineering hardware design.

---

## Architecture

```
Client (React + Vite)          Server (Express)          Database (PostgreSQL)
     |                              |                          |
     |--- /api/sync-user ---------> |--- users table --------> |
     |--- /api/save-progress -----> |--- users table --------> |
     |--- /api/skills/grant ------> |--- user_skills table --> |
     |--- /api/sessions ----------> |--- sessions table -----> |
     |                              |                          |
     localStorage (instant)         Drizzle ORM               Neon / Railway PG
```

Frontend and backend are served on the same port (5000) via Vite middleware in development and static file serving in production.

---

## Routes & Pages

| Path          | Component     | Description                                      |
|---------------|---------------|--------------------------------------------------|
| `/`           | `Landing.tsx`  | Fog canvas with manifesto typewriter effect       |
| `/activation` | `Home.tsx`     | Main onboarding app (Phase 1 + Phase 2)          |

---

## Onboarding Flow

### Phase 1: Biometric Circuit Reveal

```
Boot Screen -> Question 1 (25%) -> Question 2 (50%) -> Question 3 (75%) -> Question 4 (100%)
                                                                                |
                                                                          Chip appears
                                                                          User taps chip
                                                                                |
                                                                    Transition animation
                                                                    "CONNECTING TO SATOSHI..."
                                                                                |
                                                                          Phase 2
```

- 4 yes/no questions progressively reveal a copper circuit board SVG
- Independence increments per question: Q1=5%, Q2=10%, Q3=15%, Q4=20% (total 50% by end of Phase 1)
- Each question awards 50 SATS
- Light aluminum background (#F5F5F5) with copper (#B87333) accents
- BiometricCircuit component animates trace lines and via nodes per question group (Q1-Q4)
- At 100%, a clickable chip appears in the center

### Phase 2: Terminal Chat with Satoshi

```
Block 0 (skill) -> Block 1 (skill) -> Block 2 (skill) -> ... -> Block 5 (skill) -> Block 6 -> Block 7 -> Block 8
                                                                                                                                         |
                                                                                                                                   Wallet Setup
                                                                                                                                 (Phoenix Wallet)
```

- 9 learning blocks (index 0-8) covering Bitcoin fundamentals, Lightning Network, self-custody
- Each block awards 100 SATS and increments independence toward target values (progress_target per block)
- Dark terminal UI (#0A0A0A) with scanlines and copper text for Satoshi's messages
- Interactive chat with typewriter effect, option buttons
- Blocks grant skills and SATS incrementally
- Final block guides wallet creation with deep links to Phoenix Wallet

---

## Tech Stack

| Layer       | Technology                                     |
|-------------|------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite                     |
| Styling     | Tailwind CSS + custom CSS effects              |
| Animations  | Framer Motion                                  |
| State       | TanStack Query v5                              |
| Routing     | Wouter                                         |
| Sound       | Web Audio API (generative)                     |
| Backend     | Express 5                                      |
| ORM         | Drizzle ORM                                    |
| Database    | PostgreSQL (Neon / Railway)                    |
| Validation  | Zod + drizzle-zod                              |

---

## Project Structure

```
/
+-- client/
|   +-- public/
|   |   +-- manifest.json          # PWA manifest
|   |   +-- service-worker.js      # SW for offline/installability
|   |   +-- icons/                 # PWA icons (192, 512)
|   |   +-- favicon.png
|   +-- src/
|       +-- App.tsx                # Router setup (/ and /activation)
|       +-- pages/
|       |   +-- Landing.tsx        # Fog canvas + manifesto typewriter
|       |   +-- Home.tsx           # Main app: Phase 1 + Phase 2 orchestrator
|       |   +-- not-found.tsx      # 404 page
|       +-- components/
|       |   +-- BootScreen.tsx     # Initialization screen + LangToggle
|       |   +-- BiometricCircuit.tsx # SVG circuit reveal (Phase 1)
|       |   +-- GridBackground.tsx # Aluminum grid pattern
|       |   +-- IndependenceBar.tsx # Progress bar (copper fill)
|       |   +-- TerminalChat.tsx   # Chat interface (Phase 2)
|       |   +-- ProfileOverlay.tsx # Skill dossier overlay
|       |   +-- BackButton.tsx     # Navigation back button
|       |   +-- ui/               # Shadcn UI components
|       +-- hooks/
|       |   +-- use-sessions.ts    # Session API hooks
|       |   +-- use-skills.ts      # Skill grant logic (useGrantSkill)
|       |   +-- use-toast.ts       # Toast notifications
|       |   +-- use-mobile.tsx     # Mobile detection
|       +-- lib/
|           +-- queryClient.ts     # TanStack Query config
|           +-- terminal-i18n.ts   # Learning blocks, wallet steps, UI texts (IT/EN/RU)
|           +-- sounds.ts          # Web Audio API sound generators
|           +-- utils.ts           # Tailwind cn() helper
+-- server/
|   +-- index.ts                   # Express setup, startup diagnostics
|   +-- routes.ts                  # API route definitions
|   +-- storage.ts                 # DatabaseStorage class (IStorage interface)
|   +-- db.ts                      # PostgreSQL connection, auto-migration
|   +-- vite.ts                    # Vite dev middleware
+-- shared/
|   +-- schema.ts                  # Drizzle schema: users, sessions, user_skills
|   +-- routes.ts                  # Typed API route definitions
+-- replit.md                      # Project memory / preferences
```

---

## Database Schema

### `users`

| Column                | Type       | Default | Description                        |
|-----------------------|------------|---------|------------------------------------|
| `id`                  | SERIAL PK  | auto    | Primary key                        |
| `token`               | TEXT UNIQUE| -       | Client-generated UUID              |
| `xp`                  | INTEGER    | 0       | Experience points                  |
| `level`               | INTEGER    | 1       | User level                         |
| `current_module_id`   | TEXT       | null    | Current learning block ID          |
| `current_step_index`  | INTEGER    | 0       | Position within current block      |
| `total_sats`          | INTEGER    | 0       | Accumulated satoshis               |
| `independence_progress`| INTEGER   | 0       | Independence percentage (0-100)    |

### `sessions`

| Column              | Type         | Default | Description                        |
|---------------------|--------------|---------|------------------------------------|
| `id`                | SERIAL PK    | auto    | Primary key                        |
| `node_id`           | TEXT         | -       | Session identifier (e.g. #RE_CHAIN_A1B2) |
| `independence_score`| INTEGER      | 0       | Cumulative score                   |
| `current_step_id`   | TEXT         | -       | Current step in flow               |
| `history`           | JSONB        | []      | Array of completed action IDs      |
| `created_at`        | TIMESTAMP    | NOW()   | Creation timestamp                 |

### `user_skills`

| Column      | Type       | Default | Description                     |
|-------------|------------|---------|---------------------------------|
| `id`        | SERIAL PK  | auto    | Primary key                     |
| `user_id`   | INTEGER    | -       | References users.id             |
| `skill_key` | TEXT       | -       | One of the 4 SKILL_KEYS         |
| `granted_at`| TIMESTAMP  | NOW()   | When the skill was unlocked     |

Tables are auto-created on server startup via `CREATE TABLE IF NOT EXISTS` in `server/db.ts`.

---

## API Endpoints

### Health Check

```
GET /api/health
Response: { status: "ok" | "degraded", database: "connected" | "disconnected" }
```

### User Sync

```
POST /api/sync-user
Body: { token: string }
Response: { level, xp, currentModuleId, currentStepIndex, totalSats, independenceProgress }
```

Creates user if not exists, returns current state.

### Save Progress

```
POST /api/save-progress
Body: { token, currentModuleId, currentStepIndex, totalSats, independenceProgress }
Response: { ok: true }
```

### Sessions

```
POST /api/sessions              # Create session
GET  /api/sessions/:id          # Get session by ID
POST /api/sessions/:id/action   # Update session (actionId, scoreDelta, nextStepId)
```

### Skills

```
GET  /api/skills/:token         # Get user's granted skills
POST /api/skills/grant          # Grant a skill
     Body: { token, skillKey }
     Response: { granted: true, skill } | { granted: false, message }
```

---

## Internationalization (i18n)

Default language: **Italian (IT)**
Supported: IT, EN, RU

Language is selected on the boot screen via `LangToggle` and stored in `localStorage` as `liberta_lang`.

### Translated elements:
- Phase 1 questions (`Q_TRANSLATIONS` in Home.tsx)
- All Phase 2 learning blocks, wallet steps, Satoshi wisdom, UI texts (`terminal-i18n.ts`)
- IndependenceBar label (INDIPENDENZA / INDEPENDENCE / ...)
- ProfileOverlay skill names and descriptions
- BootScreen initialization text
- System messages and notifications

Translation source file: `client/src/lib/terminal-i18n.ts`

---

## Skill System

4 skills are granted automatically upon completing specific learning blocks:

| Skill Key         | Block | Layer      | Visual Color         |
|-------------------|-------|------------|----------------------|
| `WILL_TO_FREEDOM` | 1     | core       | Cyan (#00e5ff)       |
| `TRUTH_SEEKER`    | 2     | visor      | Orange (#ffaa00)     |
| `HARD_MONEY`      | 3     | hand_item  | Orange (#ffaa00)     |
| `GRID_RUNNER`     | 6     | aura       | Copper (#b87333)     |

### Notification flow:
1. Block completion triggers `onGrantSkill(skillKey)` in TerminalChat
2. `useGrantSkill` hook calls `POST /api/skills/grant`
3. If API returns `{ granted: true }`, notification banner appears
4. Client-side `grantedRef` prevents duplicate API calls within session
5. Banner flies into the dossier (EyeOff) icon, which blinks cyan 4x

### Dossier Mode (ProfileOverlay):
- Opened via EyeOff icon in TerminalChat header
- Shows a 2D CSS/SVG pixel schematic device with 3 skill segments
- Segment 1 (PROTOCOL): WILL_TO_FREEDOM
- Segment 2 (KNOWLEDGE): TRUTH_SEEKER + HARD_MONEY
- Segment 3 (NETWORK): GRID_RUNNER
- Empty state: "SKILLS NOT DETECTED"

---

## Sound System

Generative sound effects via Web Audio API (`client/src/lib/sounds.ts`):

- Mechanical clicks for button interactions
- Terminal typing sounds for typewriter effect
- Reward chimes for SATS earnings
- Skill unlock audio cues
- Circuit activation sounds for Phase 1

No audio files are loaded; all sounds are synthesized in real-time.

---

## PWA Features

- `manifest.json` with app name, icons (192x192, 512x512), standalone display
- `service-worker.js` for installability and basic offline capability
- Start URL: `/activation`
- Portrait orientation locked
- Theme color: #F5F5F5 (aluminum), Background: #000000

---

## Design System

### Colors

| Name      | Hex       | Usage                                    |
|-----------|-----------|------------------------------------------|
| Aluminum  | `#F5F5F5` | Phase 1 background                       |
| Copper    | `#B87333` | Accents, traces, progress bar, text      |
| Dark      | `#0A0A0A` | Phase 2 background                       |
| Cyan      | `#00e5ff` | Skill segment 1, icon blink              |
| Orange    | `#ffaa00` | Skill segment 2                          |
| Dark Copper | `#8B4513` | Copper gradient dark end               |
| Light Copper | `#D4956A` | Copper gradient mid tone              |

### Typography

- Monospace fonts throughout (terminal aesthetic)
- Tracking: 3px-5px for labels, 0.3em for percentages
- Typewriter effect for Satoshi's messages in Phase 2

### Visual Effects

- SVG circuit board with animated trace lines (Framer Motion pathLength)
- Scanline overlay in Phase 2 (CSS)
- Grid background pattern (Phase 1)
- Fog canvas with touch-to-reveal on landing page
- Copper metallic gradients on buttons and progress bar
- Pulse glow on progress changes

### Target Viewport

- Optimized for 400px mobile width
- Safe area inset handling for notched devices
- Responsive scaling via SVG viewBox

---

## Persistence Strategy

Dual persistence for resilience:

1. **localStorage** (instant, offline-capable)
   - `liberta_token` - User identity UUID
   - `liberta_terminal_progress` - Block index, SATS, independence
   - `liberta_boot_dismissed` - Skip boot screen on return
   - `liberta_lang` - Selected language

2. **PostgreSQL** (durable, cross-device)
   - User record synced on app init via `POST /api/sync-user`
   - Progress auto-saved on block completion via `POST /api/save-progress`
   - Skills permanently stored in `user_skills` table

On app load: localStorage is read first for instant state, then synced with server. If server is unreachable, localStorage state is used.

---

## Deployment

### Railway

The app is configured for Railway deployment:

1. Server binds to `process.env.PORT` (Railway provides this)
2. Database: Add PostgreSQL plugin in Railway dashboard or set `DATABASE_URL`
3. Tables auto-create on startup via `CREATE TABLE IF NOT EXISTS`
4. Build: `npm run build` (Vite frontend + esbuild backend)
5. Start: `npm run start`

### Startup Diagnostics

Server logs on startup:
- Node.js version
- NODE_ENV
- PORT
- DATABASE_URL presence (not the value)
- Database connection status
- Table creation results

---

## Environment Variables

| Variable       | Required | Description                                  |
|----------------|----------|----------------------------------------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string                 |
| `PORT`         | No       | Server port (default: 5000)                  |
| `NODE_ENV`     | No       | Environment (development / production)       |
| `SESSION_SECRET`| No      | Express session secret                       |

---

## Development

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Setup
```bash
npm install
```

### Run (development)
```bash
npm run dev
```
Starts Express + Vite on port 5000. Frontend hot-reloads, backend restarts on changes.

### Build (production)
```bash
npm run build
npm run start
```

### Database
Tables are auto-created on server startup. No manual migration step needed.
If using Drizzle Kit for schema changes:
```bash
npm run db:push
```
