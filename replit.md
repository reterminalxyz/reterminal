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
1. **СВОБОДА**: ПРАВО (correct) vs СЕРВИС → 5%
2. **СОБСТВЕННОСТЬ**: БАНК vs Я (correct) → 10%
3. **СУВЕРЕНИТЕТ**: ИНСТРУМЕНТ (correct) vs РИСК → 15%
4. **КОНТРОЛЬ**: СИСТЕМА vs ТЫ (correct) → 20%

Progressive biometric-style circuit reveal:
- Question 1 (5%): Circuit lines from TOP (25% revealed)
- Question 2 (10%): Circuit lines from RIGHT (50% revealed)
- Question 3 (15%): Circuit lines from BOTTOM (75% revealed)
- Question 4 (20%): Circuit lines from LEFT + central chip (100% revealed)

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
Mesmerizing animated background:
- Aluminum gradient base
- intensity="high": Large animated copper orbs, flowing light beams, pulsing corner accents
- intensity="low": Subtle orbs only
- Orbs move slowly with scale/opacity animation
- Light beams flow horizontally and vertically
- Corner brackets pulse

### BiometricCircuit.tsx
PCB-style circuit assembly with geometric components:
- **Straight traces with 90° angles only** (L-shapes, T-junctions) - no curves
- **SMD components**: Small rectangles with terminal pads
- **Resistors**: Rectangles with color bands
- **Capacitors**: Two parallel lines with lead wires
- **Vias**: Concentric circles (outer ring + inner dot)

Progressive reveal after EACH correct answer:
- Q1 (25%): 4 traces + 4 components in TOP margin (y < 100)
- Q2 (50%): 4 traces + 4 components in RIGHT margin (x > 330)
- Q3 (75%): 4 traces + 4 components in BOTTOM margin (y > 340)
- Q4 (100%): 4 traces + 4 components in LEFT margin (x < 70) + central chip

**SAFE ZONE**: x=70-330, y=100-340 - NO elements overlap content
Central chip has pins on all 4 sides, connecting traces from margins

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
Phase 2 chat interface (final screen, no completion page):
- Dark pixel theme (#0D0D0D background with scanlines)
- Header: "TERMINAL://SATOSHI" with ENCRYPTED label (no close button)
- Initial message: "Привет, я Сатоши." with typewriter effect (30ms per char)
- User messages in green (#4ADE80), Satoshi messages in copper (#B87333)
- Pixelated send icon (SVG with pixel art style)
- Fixed text input at absolute bottom of screen
- 8 dialogue blocks that increase independence: 20→31→43→54→66→77→89→100%
- isLockedRef + isProcessing dual lock prevents double-sends
- Auto-scroll to latest messages

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
- Phase 1: 150 SATS (20% independence after 4 questions, each gives 5%)
- Phase 2: 350 SATS (80% independence through dialogue)
- Total: 500 SATS (100% independence)

## Recent Changes (Feb 2026)
- Teenage Engineering-inspired background (aluminum + copper, animated accents)
- Biometric-style circuit reveal (lines from 4 directions converging to chip)
- 4 questions now (each gives 5% independence: 5→10→15→20%)
- Circuit reveal: Q1=25%, Q2=50%, Q3=75%, Q4=100% + central chip
- Central chip becomes clickable CTA (like a lock opening Satoshi dialogue)
- Vertical transition (top-down panels sliding apart)
- Text input field added to chat interface
- Close button in chat header for navigation back
- Back button fixed positioning (no mobile overlaps)
- Progress dots REMOVED from questions
- Independence bar: ONLY shows current % (no 0% or 100% labels)
- Independence bar: metallic styling with pulsing effect
- Independence bar stays at 20% during Phase 2 (doesn't increase per dialogue)
- Toast notification "+150 SATS" REMOVED (was blocking screen)
- Mobile-first design (400px viewport optimized)
- "DIGITAL RESISTANCE" branding throughout
