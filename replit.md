# RE_CHAIN Onboarding App

## Overview
A state-machine driven onboarding flow for a Bitcoin Lightning Network card product. Features a two-phase structure: Phase 1 is a quick 3-question test (20% of independence), Phase 2 is an interactive chat with Satoshi (80% of independence). The experience is designed as a continuation of scanning the physical NFC card.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with custom effects
- **Animations**: Framer Motion
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query

## Design System (Feb 2026)

### Color Palette
- **Phase 1 Background**: Light aluminum (#F5F5F5)
- **Phase 2 Background**: Dark terminal (#0A0A0A)
- **Primary Accent**: Copper (#B87333)
- **Text Light**: E-ink dark brown (#3E3129)
- **Text Dark**: Light aluminum (#E8E8E8)
- **Success Text**: Green (#4ADE80) for user messages
- **Notification Gold**: (#FFD700) for SATS toast

### Visual Elements
- **Grid Background**: Animated grid pattern with scan lines (digital resistance vibe)
- **NFC Circuit**: Antenna loops that connect to central chip (like physical card)
- **Vertical Transition**: Top/bottom panels slide apart to reveal Phase 2
- **Typewriter Effect**: Character-by-character text reveal (20ms/char)

## App Flow (Two-Phase Structure)

### Phase 1: СБОРКА ПРОТОКОЛА (20% independence)
Four yes/no questions with biometric circuit reveal:
1. "Хочешь стать свободнее?" → ДА/НЕТ → 5%
2. "Как думаешь, государства и корпорации хотят забрать свободу людей?" → ДА/НЕТ → 10%
3. "Можно ли с этим что-то сделать?" → ДА/НЕТ → 15%
4. "Готов что-то делать с этим?" → ДА/ПОКА НЕТ → 20%

Progressive biometric-style circuit reveal (4 stages):
- Question 1 (5%): Circuit traces wave 1 (25% revealed)
- Question 2 (10%): Circuit traces wave 2 (50% revealed)
- Question 3 (15%): Circuit traces wave 3 (75% revealed)
- Question 4 (20%): Circuit traces wave 4 + central chip (100% revealed)

Each correct answer: +50 SATS (not visible until terminal) + 5% independence
The chip becomes a clickable CTA ("Жми на чип") when all answers are correct.
Chip click: +100 SATS

### Transition: Vertical Split
- Top and bottom aluminum panels slide apart (up/down)
- Center flash effect with "ПОДКЛЮЧЕНИЕ К САТОШИ..."
- Reveals dark terminal interface
- Duration: 1.5 seconds

### Phase 2: ДИАЛОГ С САТОШИ
Terminal-style chat interface:
- Dark background (#0A0A0A with scanlines)
- "TERMINAL://" header with dynamic SATS counter
- Typewriter effect for Satoshi messages (20ms/char, copper text)
- User messages in green (#4ADE80)
- Text input + send button (arrow up icon)
- Option buttons for choices — primary interaction via buttons
- 8 learning blocks + 1 finale, sequential progression
- Block 2 has intermediate_question (mid-speech question then speech_continued)
- Actions: next_block, restart, go_back, show_conditional_text, create_wallet, initialize_wallet
- Toast notifications: "+100 SATS" pixelated gold, animates from header down over text area with glow
- Independence updates: each block +1% (21→22→23→24→25→26→27→28)
- Block indicator "1/7 ФИНАНСОВАЯ СВОБОДА" at TOP (below header, above messages), static
- isLockedRef prevents double-clicks during transitions
- Props: onBack, onProgressUpdate, onSatsUpdate, totalSats, skipFirstTypewriter

### Completion Screen
- "ПРОТОКОЛ ЗАВЕРШЁН. ТЫ АКТИВИРОВАН."
- Total SATS display with pulse/glow animation
- Final independence score (100%)
- Dark grid background

## Components

### GridBackground.tsx
Mesmerizing animated background:
- Aluminum gradient base
- intensity="high": Large animated copper orbs, flowing light beams, pulsing corner accents
- intensity="low": Subtle orbs only

### BiometricCircuit.tsx
PCB-style circuit assembly with geometric components:
- **Straight traces with 90° angles only** (L-shapes, T-junctions) - no curves
- **SMD components**: Small rectangles with terminal pads
- **Vias**: Concentric circles (outer ring + inner dot)

Progressive reveal with 4-stage thresholds:
- revealProgress >= 25: Wave 1 traces
- revealProgress >= 50: Wave 2 traces
- revealProgress >= 75: Wave 3 traces
- revealProgress >= 100: Wave 4 traces + central chip

**SAFE ZONE**: x=70-330, y=100-340 - NO elements overlap content

### IndependenceBar.tsx
Bottom-fixed progress indicator:
- Metallic gradient bar with shimmer effect
- Only shows current percentage (no 0%/100% labels)
- Pulsing effect during Phase 2
- `progress` prop (0-100 percentage)
- `phase` prop for styling adaptation

### TerminalChat.tsx
Phase 2 block-based learning interface:
- Dark pixel theme (#0A0A0A background with scanlines)
- Header: "TERMINAL://" with enlarged SATS counter (14px count, 10px label, 22x22 coin)
- Block indicator: static "1/7 ФИНАНСОВАЯ СВОБОДА" (never changes)
- PixelCoin: brighter glow (1.2s cycle), stronger shimmer, scale pulse animation
- PixelSendIcon: arrow pointing UP (pixelated)
- 8 learning blocks + Phase 3 wallet setup (6 steps), sequential progression
- Block 7 final option: "Хорошо, готов забрать SATS"
- Phase 3: Wallet setup steps (step_1 through step_5 + step_3a branch)
  - Triggered by "Давай создадим кошелек" (create_wallet action)
  - Button types: "external" (green, opens URL), "deeplink" (gold, opens Lightning), "next" (copper, advances step)
  - Step branching: step_3 → step_3a (temporary save warning) → step_4
  - Step_5 is final (no buttons)
- Toast notification: pixelated gold text, slides from header area down over messages, glow/shine, 1.8s duration
- Text input enabled: responds with "сначала пройди первый блок, все вопросы потом"
- Custom dark scrollbar (4px, copper-tinted, transparent track)
- User can scroll during typewriter animation (auto-scroll pauses on user scroll)
- No flicker on typing completion (requestAnimationFrame transition)
- Max SATS: 1000, Max independence: 27%
- Back from terminal resets SATS to 200, progress to 20%

### BackButton.tsx
Large prominent navigation button:
- "НАЗАД" label with ArrowLeft icon
- Large size: px-5 py-3, border-2, font-bold
- Fixed position: top-20 left-4, z-50
- `isDark` prop for light/dark mode
- Appears on all screens except first question

## API Endpoints
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session state
- `POST /api/sessions/:id/action` - Update session with action

## Reward Distribution
- Phase 1: 200 SATS (4 questions x 50 SATS each, not visible until terminal)
- Chip click: sets SATS to 200 (entering terminal: exactly 200 SATS)
- Phase 2: 800 SATS (blocks 1-6: 100 each, block 7: 200, block 8: 0), +1% independence per block
- Total: 1000 SATS max (27% independence at terminal end)
- After "Хорошо, готов забрать SATS" (block 7) = exactly 1000 SATS
- SATS cap: 1000, Independence cap: 27%

## Sound Effects (Web Audio API)
- `client/src/lib/sounds.ts` - Mechanical/spaceship-style sounds, no external files
- `playClick()` - Mechanical relay click (low sine thud 100→55Hz + metallic ping 2400→1600Hz)
- `playTypeTick()` - Warm typing tick (sine wave 340→180Hz with lowpass filter, soft)
- `playSatsChime()` - SATS reward (ascending sine notes 523→1047Hz)
- `playTransition()` - Block transition (sine sweep 80→400→120Hz + metallic overtone)
- `playError()` - Mechanical warning buzz (two sawtooth tones at 120Hz)
- `playPhaseComplete()` - System activation (ascending sine notes 200→800Hz, spaceship-like)

## Terminal Block Content Summary
1. Disclaimer: Alpha test intro, no registration needed, earn SATS
2. Banking slavery: "Who owns your money?" intermediate question, bank control explanation
3. Bitcoin: Mathematical gold, 17 years running, 21M limit
4. Keys: Seed phrase, personal ownership, no intermediaries
5. Privacy: System surveillance, Bitcoin anonymity, basic digital hygiene
6. Lightning: SATS explained (100M per BTC), instant global payments
7. Card/Club: Digital resistance club, 7 modules upcoming, "Передай карту тому, кто поймёт"
8. Final choice: 1000 SATS ≈ 6 euros, create wallet prompt
9. Finale: Wallet creation instructions

## Recent Changes (Feb 2026)
- Phase 1 restored to 4 questions: Q1 "Хочешь стать свободнее?", then 3 new questions about freedom/corporations
- Each Phase 1 correct answer: +50 SATS (hidden until terminal) + 5% independence
- BiometricCircuit: 4-stage thresholds (25/50/75/100)
- Independence percentages: 5→10→15→20
- Question titles: text-[14px], tracking-[2px], centered, max-w-[340px] for mobile fit
- "Жми на чип" instead of "НАЖМИТЕ НА ЧИП" (casual tone)
- All 8 block texts rewritten with updated content
- Block 1: starts "Слушай внимательно", removed "Для начала" and "Меня зовут Сатоши"
- Block 2: branching speech_continued ("Мне" → "На самом деле нет...", "Банку" → "Верно...")
- Block 3: "Это Bitcoin!" (with !), "17 лет", simplified gold analogy
- Block 4: simplified key explanation, no Coinbase/Binance mention
- Block 5: shortened privacy text, removed "Ты можешь быть тенью"
- Block 6: "биткоинами можно оплачивать", "100 миллионов" per BTC, "SATS" capitalized
- Block 7: "клуб цифрового сопротивления авторитаризму", 7 modules (not 8), final option "Хорошо, готов забрать SATS"
- Block 8: "1000 SATS это примерно 6 евро", shorter/more direct
- Terminal header: "TERMINAL://" (removed "SATOSHI")
- Block indicator "1/7 ФИНАНСОВАЯ СВОБОДА" static at top (below header, above messages)
- Phase 2: each block gives +1% independence (21→28) instead of larger jumps
- Send button arrow points UP instead of right
- SATS field enlarged: 14px count, 10px label, 22x22 pixel coin
- PixelCoin: brighter glow (1.2s cycle), scale pulse, stronger shimmer
- Notification: pixelated gold toast, animates from header down, glow/shine effect, 1.8s duration
- Sounds: mechanical/spaceship-like for Phase 1 (sine-based click, sawtooth error)
- Typing sound: warm sine wave (340→180Hz) with lowpass filter instead of noise burst
- SATS always reset to 200 on terminal entry (absolute value, no accumulation)
- PWA: manifest.json (Liberta Terminal, standalone, black theme), service-worker.js (NetworkFirst strategy)
- PWA icons: generated copper circuit chip on black background (192x192, 512x512)
- iOS install prompt: Gnosis Pay style dark overlay, shows on iOS Safari only, lucide-react icons
- Native feel CSS: overscroll-behavior-y:none, tap-highlight:transparent, user-select:none on interactive elements only
- Typewriter speed: 12ms per character (was 20ms)
- Removed Lvl/XP overlay from all screens (stealth UI)
- Stealth profile avatar: pixel person icon in TerminalChat header (40% opacity), navigates to /profile (Dossier Mode)
- Profile page (/profile): Dossier Mode with AvatarDisplay (CSS layer system), SkillCards grid
  - AvatarDisplay: base voxel image + 3 conditional layers (visor/TRUTH_SEEKER, hand item/HARD_MONEY, aura/GRID_RUNNER)
  - SkillCards: locked (grey, lock icon, blur "???") / unlocked (copper glow, description, date)
  - Skills: TRUTH_SEEKER (block 2), HARD_MONEY (block 3), GRID_RUNNER (block 6)
- Skill system: user_skills table (id, user_id, skill_key, granted_at)
- API: GET /api/skills/:token, POST /api/skills/grant (validates against SKILL_KEYS)
- useGrantSkill hook: calls API, shows LevelUpPopup overlay on terminal
- LevelUpPopup: animated overlay with "НАВЫК ОТКРЫТ" + skill name + "АВАТАР ОБНОВЛЁН"
- Skills granted automatically when completing learning blocks with grantSkillKey field
- Progress persistence: auto-saves block index, SATS, independence to localStorage + PostgreSQL on every block/wallet transition
- API: POST /api/save-progress (token, currentModuleId, currentStepIndex, totalSats, independenceProgress)
- API: POST /api/sync-user now returns all progress fields for restore
- Restore logic: localStorage first (instant), API fallback if localStorage empty (e.g. new device)
- localStorage key for token: "liberta_token" (unified across all components)
- localStorage key for terminal progress: "liberta_terminal_progress"
- Users table columns: id, token, xp, level, current_module_id, current_step_index, total_sats, independence_progress
