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