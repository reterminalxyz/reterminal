# RE_CHAIN Onboarding App

## Overview
A state-machine driven onboarding flow for a Bitcoin Lightning Network card product. Built in the style of Teenage Engineering industrial minimalism with a light aluminum and copper aesthetic, featuring physical tactile button mechanics and e-ink text display style.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Animations**: Framer Motion
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query

## Design System (Feb 2026 Update)

### Color Palette
- **Background**: Light aluminum (#F5F5F7) - Apple-inspired matte finish
- **Primary Accent**: Copper (#B87333) - warm metallic tones
- **Text**: E-ink dark brown (#3E3129) - high clarity, screen-like
- **Light Copper**: #D4956A
- **Dark Copper**: #8B5A2B

### Visual Elements
- **Blueprint Grid**: Very subtle copper grid at 0.05 opacity
- **Glass Panels**: Maximum transparency with `backdrop-filter: blur(30px)`
- **Borders**: 0.5px copper lines for thin metallic frame look
- **Shadows**: Long, soft floating shadows for depth (floating-shadow class)

### Button Mechanics
- Physical tactile buttons with inset shadow press effect
- Buttons "sink" when pressed using transform + inset shadows
- Primary buttons use copper gradient
- Secondary buttons use light aluminum gradient

### Typography
- Font: IBM Plex Mono
- E-ink text style class: `.eink-text`
- Tracking: 0.02em for body, 0.25em for labels

## App Flow (State Machine)
1. **Step 0 - NFC Scan**: Vertical copper light scan revealing antenna schematic
2. **Step 1 - Freedom Question**: "What is freedom to you?" with two choices
3. **Step 2 - Money Reality**: Question about bank money ownership + reveal truth
4. **Step 3 - Satoshi Protocol**: Manifest text with avatar
5. **Step 4 - Node Activation**: Activate lightning node + receive 500 sats reward

## Key Features
- Back button navigation (appears after step 0)
- Independence Score tracker (0-35 points)
- Session persistence via backend API
- Light scan animation for NFC step (vertical copper beam)
- Animated oscilloscope and network node visualizations
- Typewriter effect for technical readouts

## API Endpoints
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session state
- `POST /api/sessions/:id/action` - Update session with action

## CSS Classes Reference
- `.glass-panel` - Frosted glass with blur(30px) and copper border
- `.btn-physical` - Light aluminum button with press mechanics
- `.btn-physical-primary` - Copper gradient button
- `.floating-shadow` - Long soft shadows for layered depth
- `.eink-text` - E-ink display text style
- `.blueprint-grid` - Copper grid background pattern
- `.tech-readout` - Small technical label style
- `.pulse-copper` - Pulsing copper indicator animation
- `.float` - Subtle floating animation
- `.breathe` - Breathing opacity animation

## Recent Changes (Feb 2026)
- Complete visual overhaul: dark theme → light aluminum aesthetic
- New copper (#B87333) accent replacing orange (#FF5722)
- Added physical button mechanics with inset shadows on press
- Implemented vertical light scan animation for NFC step
- Added antenna schematic SVG revealed by scan
- E-ink text style for all content
- Blueprint grid overlay at 0.05 opacity
- Long floating shadows for depth effect
- Thin 0.5px copper borders for metallic frame look
