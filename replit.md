# RE_CHAIN Onboarding App

## Overview
A state-machine driven onboarding flow for a Bitcoin Lightning Network card product. Features a two-phase structure: Phase 1 is a quick 3-question test (30% of rewards), Phase 2 is an interactive chat with Satoshi (70% of rewards).

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
- **Aluminum**: #E8E8E8

### Visual Elements
- **Circuit Board**: SVG animation with 3 progressive layers
- **Glass Panels**: Frosted glass with blur effects
- **Horizontal Split**: Mechanical doors transition animation
- **Typewriter Effect**: Character-by-character text reveal

## App Flow (Two-Phase Structure)

### Phase 1: СБОРКА ПРОТОКОЛА (30% = 150 SATS)
Three quick questions with circuit assembly animation:
1. **СВОБОДА**: ПРАВО vs СЕРВИС (+10 score for correct)
2. **СОБСТВЕННОСТЬ**: БАНК vs Я (+10 score for correct)
3. **СУВЕРЕНИТЕТ**: ИНСТРУМЕНТ vs РИСК (+10 score for correct)

After each answer, circuit board elements appear on background:
- Question 1: Horizontal traces on left
- Question 2: Vertical connections in center + chip
- Question 3: Complete connections on right + pulse effect

Completion screen shows "ПРОТОКОЛ СОБРАН" + "АКТИВИРОВАТЬ СУВЕРЕНИТЕТ" button

### Transition: Horizontal Split
- Light aluminum panels slide left/right like mechanical doors
- Reveals dark terminal interface underneath
- Duration: 1.2 seconds

### Phase 2: ДИАЛОГ С САТОШИ (70% = 350 SATS)
Terminal-style chat interface:
- Dark background (#2A2A2A)
- Typewriter effect for Satoshi messages (25ms/char)
- Copper text for Satoshi, light text for user
- Branching dialogue with user choices
- 7 main dialogue blocks with 50 SATS each

### Completion Screen
- "ПРОТОКОЛ ЗАВЕРШЁН. ТЫ АКТИВИРОВАН."
- Total SATS display with pulse animation
- Final independence score

## Components

### CircuitBoard.tsx
SVG component with 3 animated layers:
- `completedLayers` prop controls visibility (0-3)
- Uses Framer Motion for path animations
- Copper color (#B87333) at 60-80% opacity

### IndependenceBar.tsx
Bottom-fixed progress indicator:
- Horizontal bar with copper gradient fill
- "НЕЗАВИСИМОСТЬ" label above
- Percentage display (0-100%)

### TerminalChat.tsx
Phase 2 chat interface:
- Typewriter effect for messages
- Handles branching dialogue logic
- User choice buttons appear after relevant messages

## API Endpoints
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session state
- `POST /api/sessions/:id/action` - Update session with action

## Reward Distribution
- Phase 1: 150 SATS (30%)
- Phase 2: 350 SATS (70%)
- Total: 500 SATS

## Recent Changes (Feb 2026)
- Complete app rebuild with two-phase structure
- Phase 1: 3 questions with circuit assembly animation
- Horizontal split transition (mechanical doors effect)
- Phase 2: Terminal chat with typewriter effect
- Bottom independence bar (horizontal, copper)
- Branching dialogue with user choices
- Equal-size choice buttons (160px x 56px)
