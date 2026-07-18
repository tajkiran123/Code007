# WorkQuest AI - Gamified Productivity Platform

WorkQuest AI is a futuristic SaaS platform designed to gamify employee productivity. It transforms standard task-tracking (like Jira or ClickUp) into an engaging, gamified experience where employees earn XP based on task difficulties, completion times, quality score ratings, and consistency streaks. Points can be exchanged in an e-commerce style store for company rewards (like headphones, hoodies, coffee coupons, or paid leave).

---

## 🎯 The Problem: The Enterprise Engagement Crisis

Modern workplaces suffer from a severe productivity and motivation deficit, driven by:
* **The "Quiet Quitting" Epidemic:** Over **70% of employees** report feeling disengaged, viewing daily work as transactional rather than developmental.
* **The Chore-Board Syndrome:** Legacy task-tracking suites (like Jira, Trello, and ClickUp) feel like monotonous databases and chore lists, failing to offer any emotional reward or intrinsic motivation for completing tasks.
* **Invisible Burnout:** Managers lack active, real-time indicators to monitor developer fatigue, only discovering burnout after a key engineer leaves or experiences severe performance drops.
* **Lack of Real-time Recognition:** High-performing employees lack immediate positive feedback loops, leaving critical contributions unnoticed or delayed until yearly review cycles.

---

## 🚀 The Solution: WorkQuest AI

**WorkQuest AI** is a futuristic gamified productivity ecosystem that turns standard task execution into an engaging, high-fidelity Role-Playing Game (RPG) journey. By bridging the gap between game mechanics and enterprise task management, we solve the engagement crisis through:
* **RPG Progression System:** Standard tasks are transformed into *Quests*. Completing tasks earns experience points (XP) based on difficulty and speed, helping users level up their profiles and unlock performance badges.
* **Craftsmanship-First Quality Feedback:** Managers review and approve tasks, awarding custom quality scores (1–10) that act as XP multipliers, incentivizing high-quality work and attention to detail.
* **E-Commerce Rewards Shop:** Employees can spend earned XP in a marketplace to buy tangible corporate incentives (e.g. coffee vouchers, tech gear, paid leaves).
* **AI Chief of Staff & Burnout Telemetry:** AI Assistant (our built-in executive bot) proactively tracks work velocity, alerts CEOs of burnout risks, evaluates promotion readiness, and executes voice/text administrative tasks hands-free.

---

This project contains:
1. **Responsive Web Application** (Next.js 16, React 19, Tailwind CSS v4, Framer Motion)
2. **Backend API Blueprint Server** (Node.js, Express, Mongoose ORM, MongoDB, Socket.io, JWT Authentication)
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
│   ├── db.ts              # MongoDB Mongoose database connection client
│   ├── models/            # Mongoose Schema Definitions (User, Task, Achievement, etc.)
│   ├── routes/            # Express REST Routers (auth, tasks, rewards, AI, analytics, etc.)
│   ├── scripts/
│   │   └── seed.ts        # Seed script for bootstrapping MongoDB collections
│   ├── package.json       # Backend dependencies and run scripts
│   └── server.ts          # Express + Socket.io API Server entrypoint
├── mobile/
│   ├── screens/
│   │   ├── DashboardScreen.tsx # Mobile profile XP dashboard & sprint tracker
│   │   └── QRScannerScreen.tsx # QR viewfinder scanner simulator for offline checks
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
* **Database mapping:** Mongoose ORM for MongoDB databases containing schemas for Users, Tasks, Achievements, Marketplace, and XPHistory.
* **Real-time Engine:** Socket.io for immediate task notifications and leaderboard state changes.

### Mobile Client
* **Core:** React Native + Expo.
* **Offline Sync:** Custom AsyncStorage queue manager that caches offline task completions and replays them automatically upon connection restoration.

---

## Getting Started

Follow these steps to set up and run the backend server and frontend application.

---

### Prerequisites & Troubleshooting
Before starting, ensure you have **Node.js (v18 or newer)** installed on your machine.

> [!IMPORTANT]
> If the frontend server fails to start with the error `Couldn't find any pages or app directory`, it means the frontend files were deleted or not staged in your Git repository. 
> To resolve this, run the following command in the project root:
> ```bash
> git restore app
> ```

> [!CAUTION]
> If you get `MongooseServerSelectionError` or `buffering timed out after 10000ms` during database seeding or server startup, it means Mongoose cannot connect to your MongoDB database.
>
> **To fix this, do one of the following:**
> * **If using MongoDB Atlas:** Go to your Atlas Dashboard -> **Network Access** -> **IP Access List** and click **Add IP Address**. Add your current IP address (or `0.0.0.0/0` to allow access from anywhere for development purposes).
> * **If running MongoDB locally:** 
>   1. Start a local MongoDB instance (e.g. via Mongo Community Server or Docker).
>   2. Open `backend/.env` and update the URI to:
>      ```env
>      MONGODB_URI=mongodb://127.0.0.1:27017/workquest
>      ```

---

### Step 1: Set Up the Backend Database & Environment
The backend API requires a **MongoDB** database to store users, tasks, and achievements.

1. **Navigate to the Backend Directory:**
   ```bash
   cd backend
   ```

2. **Configure Environment Variables:**
   > [!WARNING]
   > If `.env` already exists in the `backend/` directory, **do NOT copy or overwrite it** with `.env.example`. Overwriting it will remove your pre-configured MongoDB Atlas connection details.
   
   - If `.env` does not exist, copy or rename `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Open `.env` and verify the values (make sure `MONGODB_URI` points to your MongoDB Atlas connection string or local MongoDB instance).

3. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

4. **Seed the Database with Mock Data:**
   Run the seeding script to set up test users, roles, tasks, and initial departments:
   ```bash
   npm run seed
   ```

---

### Step 2: Start the Backend API Server
Once the environment is configured and the database is seeded, start the development backend server:
```bash
# From the backend directory:
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000). You should see:
```text
🚀 WorkQuest AI Backend Running on port 5000
🔌 Connected to MongoDB Atlas via Mongoose successfully.
```

---

### Step 3: Set Up and Start the Web Frontend
1. **Navigate to the Root Directory (`code007`):**
   *(If you are in the backend directory, run `cd ..`)*

2. **Install Frontend Dependencies:**
   Install the required Next.js, React, and UI libraries using peer dependency fallback:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the Next.js Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### Step 4: Accessing the Application
You can use the seeded credentials to log in and test different dashboard interfaces:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin01@workquest.ai` | `Password123!` |
| **Manager** | `manager01@workquest.ai` | `Password123!` |
| **Employee** | `employee1@workquest.ai` | `Password123!` |

---

### Step 5: (Optional) Running the Mobile Client
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

---

## Hackathon Project Information

### Team Roles & Contributions
* **Lead Full-Stack Engineer / Architect:** Designed the end-to-end microservices, API architecture, Express state machines, and real-time Socket.io channels.
* **Frontend UI/UX Specialist:** Crafted the premium glassmorphic client interface, WebGL mouse-tilt dynamics, canvas-confetti interactions, and auditory micro-feedback using Next.js 16 and Framer Motion.
* **Mobile & Offline Sync Engineer:** Created the React Native / Expo screen blueprints and SyncManager caching queue using AsyncStorage.

### Future Scope
1. **Predictive Analytics Engine:** Integration of a machine learning model to detect early signs of employee burnout based on streak decays and activity levels.
2. **Enterprise Integrations:** One-click integration slack/teams bots that assign XP rewards automatically when a pull request is merged in GitHub or a Jira issue is completed.
3. **Web3 Rewards Ledger:** Tokenization of points into corporate stablecoins or tokens on a secure private chain for distributed reward redemptions.
4. **Hardware Integrations:** QR / NFC office gate check-in systems to award streaks directly when users enter the workspace in real-life.

### Contact Details
For any questions regarding the WorkQuest AI project submission, reach out via:
* **Email:** support@workquest.ai
* **GitHub Repository:** [WorkQuest-AI Repository](https://github.com/tajkiran123/WorkQuest-AI)

