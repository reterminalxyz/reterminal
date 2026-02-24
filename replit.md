# RE_CHAIN Onboarding App

## Overview
This project is an onboarding application for a Bitcoin Lightning Network NFC card product. It guides users through a two-phase, state-machine driven flow to educate them on Bitcoin and activate their card. The application aims to provide a unique and engaging user experience, leveraging a narrative with "Satoshi" to foster understanding and independence in the context of financial freedom and digital resistance. The ultimate goal is to onboard users to the Lightning Network and encourage the adoption of self-custody solutions.

## User Preferences
- I prefer clear, concise explanations.
- I like to follow an iterative development process.
- Please ask for confirmation before implementing major architectural changes.
- Ensure all communications are respectful and professional.
- Prioritize efficient and well-structured code.

## System Architecture

### UI/UX Decisions
The application features a distinct two-phase visual design:
- **Phase 1 (СБОРКА ПРОТОКОЛА):** Light aluminum background, biometric circuit reveal, and a progressive question flow building independence.
- **Phase 2 (ДИАЛОГ С САТОШИ):** Dark terminal interface with scanlines, copper-accented text for Satoshi's messages, and green for user input.
- **Transitions:** A vertical split animation with a "ПОДКЛЮЧЕНИЕ К САТОШИ..." message separates the phases.
- **Interactive Elements:** Typewriter effect for text, clickable chip, and option buttons for chat interactions.
- **Thematic Design:** Utilizes a "digital resistance" aesthetic with elements like grid backgrounds, circuit board visuals, and a terminal-style chat.
- **PWA Features:** Manifest and service worker for installability and offline capabilities, with custom icons for a native feel.
- **Stealth UI:** Features like an Independence Bar, SATS counter, and a "Dossier Mode" overlay (Profile overlay) are integrated subtly. The Dossier Mode presents a 2D CSS/SVG pixel schematic device with skill segments that unlock progressively.

### Technical Implementations
- **Frontend:** React with Vite and TypeScript for a modern and performant user interface.
- **Styling:** Tailwind CSS is used for utility-first styling, complemented by custom effects.
- **Animations:** Framer Motion provides declarative and fluid animations throughout the application.
- **State Management:** TanStack Query is employed for efficient data fetching, caching, and state synchronization.
- **Sound Effects:** Custom, generative sound effects are implemented using the Web Audio API to enhance the user experience with mechanical and spaceship-like audio cues.
- **Persistence:** User progress (block index, SATS, independence) is persisted using both `localStorage` for instant retrieval and a PostgreSQL database as a fallback and for long-term storage.

### Feature Specifications
- **Two-Phase Onboarding:**
    - **Phase 1:** Four yes/no questions progressively reveal a biometric circuit, increasing user independence and awarding hidden SATS.
    - **Phase 2:** An interactive, block-based chat with "Satoshi" in a terminal-like environment. This phase covers 8 learning blocks and a wallet setup finale, gradually increasing user independence and awarding SATS.
- **Reward System:** Users earn SATS (Satoshis) throughout both phases, culminating in a total of 1000 SATS upon completion.
- **Independence Score:** A visual progress bar and percentage display track the user's growing "independence."
- **Wallet Creation Flow:** Integrated steps within Phase 2 guide users through creating a Lightning Network wallet with external links and deep links.
- **Skill System:** Certain learning blocks grant specific "skills" (e.g., WILL_TO_FREEDOM, HARD_MONEY) which are visually represented in the Dossier Mode and persisted.
- **Responsive Design:** Optimized for mobile experiences, including specific styling for text and interactive elements.

### System Design Choices
- **State Machine Driven:** The onboarding flow is designed as a clear state machine, ensuring sequential progression and controlled transitions between phases and learning blocks.
- **Modular Components:** The application is built with reusable components like `GridBackground`, `BiometricCircuit`, `IndependenceBar`, and `TerminalChat` to maintain a clean and scalable codebase.
- **API-driven Interactions:** User actions and progress updates are communicated with a backend API for session management and persistence.

## External Dependencies
- **Backend:** Express.js for handling API requests and serving the application.
- **Database:** PostgreSQL for persistent storage of user sessions, progress, and skills, managed with Drizzle ORM.
- **Third-party Libraries:**
    - React, Vite, TypeScript
    - Tailwind CSS
    - Framer Motion
    - TanStack Query
    - `lucide-react` for icons
- **External Services/APIs:**
    - NFC card integration (implied by product description)
    - Lightning Network wallet deep links and external URLs for wallet creation.

## Implementation Details
- Stealth dosier icon: Lucide EyeOff icon in TerminalChat header (50% opacity, 22x22), opens Profile overlay
  - Anti-surveillance themed (crossed-out eye = anti-tracking)
- Profile overlay (inside TerminalChat, NOT separate route): "НАБОР НАВЫКОВ" overlay, pure 2D CSS/SVG
  - Opens with scale-from-point animation (from icon center → fullscreen)
  - No ScanLine animation (removed)
  - Dark background (#0a0a0a) with CSS grid overlay
  - Pixel schematic device: SVG device divided into 3 segments
  - Segment 1 (ПРОТОКОЛ ВОЛИ): WILL_TO_FREEDOM, cyan (#00e5ff)
  - Segment 2 (МОДУЛЬ ЗНАНИЯ): TRUTH_SEEKER + HARD_MONEY, orange (#ffaa00)
  - Segment 3 (СЕТЕВОЙ ПРИВОД): GRID_RUNNER, copper (#b87333)
  - Skills hidden by default, only granted skills shown (with pixel checkmark)
  - Empty state shows "НАВЫКИ НЕ ОБНАРУЖЕНЫ"
  - Skills: WILL_TO_FREEDOM (block 1), TRUTH_SEEKER (block 2), HARD_MONEY (block 3), GRID_RUNNER (block 6)
- Skill system: user_skills table (id, user_id, skill_key, granted_at)
- SKILL_KEYS: WILL_TO_FREEDOM, TRUTH_SEEKER, HARD_MONEY, GRID_RUNNER (4 skills total)
- API: GET /api/skills/:token, POST /api/skills/grant (validates against SKILL_KEYS)
- SkillNotificationBanner: copper/gold styled (same as SATS toast), cyan EyeOff icon, text "+СКИЛЛ" (no skill name), 1.5s visible
  - Exit animation: flies into skills icon position, then icon blinks cyan 4x over 2.4s
- Skill granted immediately on answer (no delay), notification appears naturally after API response
- Skills granted automatically when completing learning blocks with grantSkillKey field
- Progress persistence: auto-saves block index, SATS, independence to localStorage + PostgreSQL
- API: POST /api/save-progress, POST /api/sync-user
- localStorage keys: "liberta_token", "liberta_terminal_progress", "liberta_boot_dismissed"
- Users table columns: id, token, xp, level, current_module_id, current_step_index, total_sats, independence_progress
- Loading screen (LoadingScreen.tsx): 3-phase hypnotic animation (data cascade → INITIALIZING FREEDOM → RE_TERMINAL blink), 3s total, white bg, black monospace text
- App flow: Loading Screen (3s) → Boot Screen (browser/app choice) → Phase 1 → Phase 2
- Phase 1 "No" answer: shows "наверное это не для тебя" (notForYou) message, then redirects to Boot Screen after 2s
- PWA install: shared global module (client/src/lib/pwa-install.ts) captures beforeinstallprompt early, used by both BootScreen and TerminalChat
- Analytics dashboard: shows last 20 sessions (LIMIT 20), password "2222"