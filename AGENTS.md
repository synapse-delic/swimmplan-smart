# 🤖 AGENTS.md — Guidelines for AI Collaborators (SwimmPlan Smart)

This document outlines the rules, architecture constraints, and workflows for AI agents (like Antigravity) developing or refactoring the **SwimmPlan Smart** codebase.

---

## ⚙️ Technical Environment & Stack

* **Core**: React 19 (compiled with TypeScript)
* **Styling**: Tailwind CSS v4 (using the `@tailwindcss/vite` integration)
* **Drag-and-Drop**: `@dnd-kit` (configured with touch-delays for mobile scrolling compatibility)
* **Local Development**: Runs on port **3000** (`npm run dev`)
* **Deployment**: Deploys directly to Google Cloud Run via `./deploy_gcp.sh`

---

## 📌 Development Guidelines for Agents

### 1. English-Only UI
- The application is optimized for an international alpha launch (e.g., Reddit). 
- All buttons, inputs, form placeholders, metrics labels, default templates, search parameters, modal screens, and toast notifications **must remain strictly in English**.

### 2. PWA & Offline Capability (Pool-Deck ready)
- Swimming pools are concrete bunkers with poor internet connection. The app is a Progressive Web App (PWA).
- **Service Worker**: Cache strategies are defined in `public/sw.js` (Stale-While-Revalidate). Any script/asset additions must not disrupt service worker performance.
- **Brand Assets**: The corporate brand icon is saved at `public/icon.svg`. **Do not overwrite, delete, or replace this file** with placeholder images.
- **Manifest**: Configuration lies in `public/manifest.json`.

### 3. Serverless Plan Sharing (URL Hash & Local Club Hub)
- There is no central database backend. Sharing is achieved through:
  - **Base64 URL Hash**: Workouts are serialized to JSON, Base64-encoded, and shared via `window.location.hash = '#share=...'`. The loading is handled in a `useEffect` inside `src/App.tsx`.
  - **Local Club Registry**: The **Club Hub** (`src/components/CommunityModal.tsx`) uses local storage (`swim_club_community_plans`) to let coaches save and load workouts on the active browser profile.
- When changing the timeline schema in `src/types.ts`, ensure compatibility with the encoding/decoding methods in `src/App.tsx` and `src/components/CommunityModal.tsx`.

### 4. Excel Export Format
- Excel CSV exports are implemented in `src/App.tsx` using native Blob downloads.
- To guarantee Excel opens the files natively on both English and localized (e.g., German/European) Excel installations:
  - Keep the UTF-8 BOM (`\uFEFF`) prefix.
  - Keep the `sep=,` separator indicator on the very first row.
  - Wrap all output fields in double quotes to prevent break-ups on commas inside text fields.

### 5. Mobile Layout & Compactness Constraints
- Swim coaches need to see their plan at a glance on mobile devices.
- Do not add macOS window control buttons (colored dots) in the exercise selector sheet.
- Keep components compact (tight paddings, small inline descriptions, conditional dropzones).
- Verify that at least **4 timeline blocks** remain visible on a standard 375px wide mobile device without vertical page scrolling.

---

## 🚀 Deployment Workflow
- Test and verify the app compiles cleanly before every push/deployment:
  ```bash
  npm run build
  ```
- Deploy to Google Cloud Run by executing:
  ```bash
  ./deploy_gcp.sh
  ```
