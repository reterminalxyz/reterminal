# RE_CHAIN Onboarding App

## Overview
A state-machine driven onboarding flow for a Bitcoin Lightning Network card product. Built in the style of Teenage Engineering industrial minimalism with glassmorphism and translucent design elements.

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Animations**: Framer Motion
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query

## Design System
- **Theme**: Teenage Engineering inspired - industrial minimalism with transparency
- **Background**: Gradient dark charcoal (#1e2128 to #252931)
- **Accent**: Orange (#FF5722)
- **Font**: IBM Plex Mono
- **Effects**: Glassmorphism panels, grid overlays, pulsing indicators

## App Flow (State Machine)
1. **Step 0 - NFC Scan**: Simulated NFC card scanning animation
2. **Step 1 - Freedom Question**: "What is freedom to you?" with two choices
3. **Step 2 - Money Reality**: Question about bank money ownership + reveal truth
4. **Step 3 - Satoshi Protocol**: Manifest text with avatar
5. **Step 4 - Node Activation**: Activate lightning node + receive 500 sats reward

## Key Features
- Back button navigation (appears after step 0)
- Independence Score tracker (0-35 points)
- Session persistence via backend API
- Animated oscilloscope and network node visualizations
- Typewriter effect for technical readouts

## API Endpoints
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session state
- `POST /api/sessions/:id/action` - Update session with action

## Recent Changes (Feb 2026)
- Redesigned with glassmorphism and translucent elements
- Added back button functionality
- Improved NetworkNodes animation (ripple effect)
- Enhanced oscilloscope with grid and multi-wave display
- Added micro-animations throughout (pulsing indicators, floating elements)
- Lighter color palette with gradient backgrounds
