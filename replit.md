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
Three quick questions with NFC circuit assembly animation:
1. **СВОБОДА**: ПРАВО (correct) vs СЕРВИС
2. **СОБСТВЕННОСТЬ**: БАНК vs Я (correct)
3. **СУВЕРЕНИТЕТ**: ИНСТРУМЕНТ (correct) vs РИСК

After correct answers, NFC antenna loops and chip elements appear:
- Question 1: Outer antenna loops
- Question 2: Connection traces + central chip frame
- Question 3: Chip pins + internal circuitry + pulse effect

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
Animated grid pattern for Phase 1:
- SVG grid lines with copper color
- Horizontal and vertical scan line animations
- Corner accent decorations
- Data stream dots

### CircuitBoard.tsx
NFC-style antenna circuit:
- 3 concentric rounded rectangles (antenna loops)
- Connection traces from loops to central chip
- Central chip with pins and internal circuitry
- Chip becomes clickable CTA when complete
- `completedLayers` prop controls visibility (0-3)
- `onChipClick` callback when chip is ready

### IndependenceBar.tsx
Bottom-fixed progress indicator:
- Horizontal bar with copper gradient fill
- Animated shimmer effect
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
- Phase 1: 150 SATS (20% independence)
- Phase 2: 350 SATS (80% independence)
- Total: 500 SATS

## Recent Changes (Feb 2026)
- Grid background with animated scan lines (digital resistance vibe)
- NFC-style circuit animation matching physical card design
- Central chip becomes clickable CTA after all correct answers
- Vertical transition (top-down panels sliding apart)
- Text input field added to chat interface
- Back button on all screens (except first question)
- Independence bar fills 20% after Phase 1 (not 30%)
- User messages displayed in green
- System initialization message in chat
- "DIGITAL RESISTANCE" branding throughout
