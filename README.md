# WorkQuest AI - Gamified Productivity Platform

WorkQuest AI is a futuristic SaaS platform designed to gamify employee productivity. It transforms standard task-tracking (like Jira or ClickUp) into an engaging, gamified experience where employees earn XP based on task difficulties, completion times, quality score ratings, and consistency streaks. Points can be exchanged in an e-commerce style store for company rewards (like headphones, hoodies, coffee coupons, or paid leave).

This project contains:
1. **Responsive Web Application** (Next.js 16, React 19, Tailwind CSS v4, Framer Motion)
2. **Backend API Blueprint Server** (Node.js, Express, Prisma ORM, Socket.io, JWT Authentication)
3. **Android & iOS Mobile Application** (React Native/Expo Blueprint with Offline Sync support)

---

## Directory Structure

```text
├── app/
│   ├── layout.tsx         # Next.js 16 Root Layout & Google Font Loaders
│   ├── globals.css        # Premium style utility layers, keyframes, glassmorphism
│   ├── page.tsx           # WorkQuest AI Web Single-page dashboard application
│   ├── types.ts           # Types for Users, Tasks, Rewards, Badges, and Logs
│   ├── mockData.ts        # Stateful mock data for frontend demo
│   └── audio.ts           # Web Audio API Synthesizer (auditory micro-feedback)
├── backend/
│   ├── routes/
│   │   ├── auth.ts        # Express Authentication Router (Bcrypt, JWT)
│   │   ├── tasks.ts       # Express Tasks State Machine & Socket broadcasters
│   │   └── rewards.ts     # Express Reward store inventory management
│   ├── prisma/
│   │   └── schema.prisma  # PostgreSQL Prisma Database Schema definitions
│   ├── package.json       # Backend Dependencies & Start scripts
│   └── server.ts          # Socket.io & HTTP server listener initialization
├── mobile/
│   ├── screens/
│   │   ├── DashboardScreen.tsx # Mobile profile XP dashboard & sprint tracker
│   │   └── QRScannerScreen.tsx  # QR viewfinder scanner simulator for offline checks
│   ├── utils/
│   │   └── SyncManager.ts      # Expo AsyncStorage caching queue for offline sync
│   └── App.tsx                 # Mobile Navigation entry
├── Dockerfile             # Multi-stage production container configuration
└── README.md              # Documentation
```

---

## Technical Stack Highlights

### Web Frontend
* **Core:** Next.js 16 (App Router) + React 19 + TypeScript.
* **Design & Animations:** Tailwind CSS v4, custom glassmorphism layers, Framer Motion, and synthesized audio cues powered by the HTML5 Web Audio API.
* **Celebrations:** `canvas-confetti` animation explosions on Level Ups, task approvals, and reward store purchases.

### Backend Services
* **Core:** Node.js + TypeScript + Express.
* **Database mapping:** Prisma ORM for PostgreSQL schemas containing models for Users, Tasks, Streaks, and Redemptions.
* **Real-time Engine:** Socket.io for immediate task notifications and leaderboard state changes.

### Mobile Client
* **Core:** React Native + Expo.
* **Offline Sync:** Custom AsyncStorage queue manager that caches offline task completions and replays them automatically upon connection restoration.

---

## Getting Started

### 1. Web Frontend Client
From the root directory:
```bash
# Install packages
npm install --legacy-peer-deps

# Run the Next.js dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the landing page, login page (supports both Employee and Manager views), Kanban Sprint board, Leaderboard rosters, Reward shop, and the AI coach chatbot.

### 2. Express Backend Server
From the `backend/` directory:
```bash
cd backend
npm install
npm run dev
```

### 3. Mobile Client
Drop the files under `mobile/` directly inside an Expo CLI project or React Native directory to run inside your emulator or device:
```bash
# Inside your React Native Expo directory:
npx expo start
```

---

## Enterprise Deployment

A complete production deployment setup is included via `Dockerfile`:
```bash
# Build multi-stage Docker image
docker build -t workquest-ai:latest .

# Run the container
docker run -p 3000:3000 -p 5000:5000 workquest-ai:latest
```
This builds both the frontend static assets and node binaries, starting the unified production runner.
