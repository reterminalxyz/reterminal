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
- **Phase 2 Background**: Dark terminal (#2A2A2A)
- **Primary Accent**: Copper (#B87333)
- **Text Light**: E-ink dark brown (#3E3129)
- **Text Dark**: Light aluminum (#E8E8E8)
- **Success Text**: Green (#4ADE80) for user messages

### Visual Elements
- **Grid Background**: Animated grid pattern with scan lines (digital resistance vibe)
- **NFC Circuit**: Antenna loops that connect to central chip (like physical card)
- **Vertical Transition**: Top/bottom panels slide apart to reveal Phase 2
- **Typewriter Effect**: Character-by-character text reveal (25ms/char)

## App Flow (Two-Phase Structure)

### Phase 1: СБОРКА ПРОТОКОЛА (20% independence)
Four quick questions with biometric circuit reveal:
1. **СВОБОДА**: ПРАВО (correct) vs СЕРВИС → 7%
2. **СОБСТВЕННОСТЬ**: БАНК vs Я (correct) → 14%
3. **СУВЕРЕНИТЕТ**: ИНСТРУМЕНТ (correct) vs РИСК → 21%
4. **КОНТРОЛЬ**: СИСТЕМА vs ТЫ (correct) → 28%

Progressive biometric-style circuit reveal:
- Question 1 (7%): Circuit lines from TOP (25% revealed)
- Question 2 (14%): Circuit lines from RIGHT (50% revealed)
- Question 3 (21%): Circuit lines from BOTTOM (75% revealed)
- Question 4 (28%): Circuit lines from LEFT + central chip (100% revealed)

The chip becomes a clickable CTA button when all answers are correct.
Reward: 150 SATS

### Transition: Vertical Split
- Top and bottom aluminum panels slide apart (up/down)
- Center flash effect with "ПОДКЛЮЧЕНИЕ К САТОШИ..."
- Reveals dark terminal interface
- Duration: 1.5 seconds

### Phase 2: ДИАЛОГ С САТОШИ (80% independence)
Terminal-style chat interface:
- Dark background (#2A2A2A)
- "TERMINAL://SATOSHI_PROTOCOL" header with ENCRYPTED label
- Typewriter effect for Satoshi messages (copper text)
- User messages in green (#4ADE80)
- Text input field with send button
- Branching dialogue with user choices (equal-size buttons 160px x 56px)
- 7 dialogue blocks with 50 SATS each (350 SATS total)

### Completion Screen
- "ПРОТОКОЛ ЗАВЕРШЁН. ТЫ АКТИВИРОВАН."
- Total SATS display with pulse/glow animation
- Final independence score (100%)
- Dark grid background

## Components

### GridBackground.tsx
Teenage Engineering-inspired background:
- Aluminum gradient with brushed metal texture
- Animated floating copper accent lines
- Subtle pulsing dots (digital resistance vibe)
- Corner marks (TE style)

### BiometricCircuit.tsx
Large-scale biometric fingerprint scanning style:
- Lines converge from all 4 directions to center
- Progressive reveal: 25% → 50% → 75% → 100%
- Connection nodes at line endpoints
- Central chip appears at 100% with pulsing effect

### Microchip.tsx
Microchip assembly animation:
- 12 circuit elements total (4 per question)
- Q1: elements appear from TOP
- Q2: elements appear from SIDES
- Q3: elements appear from BOTTOM
- Central chip appears after Q2, becomes clickable after Q3
- `completedLayers` prop (0-3)
- `onChipClick` callback when ready
- `showOnly` prop for minimal display on completion screen

### IndependenceBar.tsx
Bottom-fixed progress indicator:
- Metallic gradient bar with shimmer effect
- Only shows current percentage (no 0%/100% labels)
- Pulsing effect during Phase 2
- `progress` prop (0-100 percentage)
- `phase` prop for styling adaptation

### TerminalChat.tsx
Phase 2 chat interface:
- Typewriter effect for Satoshi messages
- Text input field with send button
- Branching dialogue logic
- User choice buttons (equal size)

### BackButton.tsx
Navigation button:
- "НАЗАД" label with chevron icon
- `isDark` prop for light/dark mode
- Appears on all screens except first question

## API Endpoints
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session state
- `POST /api/sessions/:id/action` - Update session with action

## Reward Distribution
- Phase 1: 150 SATS (28% independence after 4 questions, each gives 7%)
- Phase 2: 350 SATS (72% independence through dialogue)
- Total: 500 SATS (100% independence)

## Recent Changes (Feb 2026)
- Teenage Engineering-inspired background (aluminum + copper, animated accents)
- Biometric-style circuit reveal (lines from 4 directions converging to chip)
- 4 questions now (each gives 7% independence: 7→14→21→28%)
- Circuit reveal: Q1=25%, Q2=50%, Q3=75%, Q4=100% + central chip
- Central chip becomes clickable CTA (like a lock opening Satoshi dialogue)
- Vertical transition (top-down panels sliding apart)
- Text input field added to chat interface
- Close button in chat header for navigation back
- Back button fixed positioning (no mobile overlaps)
- Progress dots REMOVED from questions
- Independence bar: ONLY shows current % (no 0% or 100% labels)
- Independence bar: metallic styling with pulsing effect
- Independence bar stays at 28% during Phase 2 (doesn't increase per dialogue)
- Toast notification "+150 SATS" REMOVED (was blocking screen)
- Mobile-first design (400px viewport optimized)
- "DIGITAL RESISTANCE" branding throughout
