# WorkQuest AI - Interactive Demo Guide & Video Script

This runbook helps you execute the perfect live demo or record a flawless 3-minute video presentation.

---

## 📅 Pre-Demo Checklist (The "Last 10 Minutes" Check)

Ensure both frontend and backend servers are restarted and running locally:

### 1. Start the MongoDB Backend API Server:
```bash
cd backend
npm install
npm run seed  # Bootstraps database with initial employees, managers, tasks, and achievements
npm run dev   # Starts server at http://localhost:5000
```

### 2. Start the Next.js Frontend Server:
```bash
# In the root workspace:
npm install --legacy-peer-deps
npm run dev   # Starts server at http://localhost:3000
```

### 3. Open the App in Your Browser:
Visit [http://localhost:3000](http://localhost:3000) and turn on your device audio (to hear the premium synthesiser micro-feedback sound effects).

---

## 🎙️ 3-Minute Video Demo Script

### Phase 1: Intro & Employee Dashboard (0:00 - 0:40)
* **What to Show:** The landing page with the **Three.js WebGL canvas interactive background** (particles that follow the mouse) and the glassmorphic login interface.
* **Action:** Log in using **Employee** credentials:
  * **Email:** `employee1@workquest.ai`
  * **Password:** `Password123!`
* **Script:**
  > "Welcome to WorkQuest AI, the gamified productivity SaaS platform designed to solve the employee disengagement crisis.
  > Here, tasks are no longer chores—they are RPG quests!
  > I'm currently logged in as a Developer. I can see my level (Level 4 Champion), my XP progression bar, and my active streak multiplier.
  > Every UI interaction triggers synthesized auditory feedback powered by the Web Audio API."

### Phase 2: Starting & Completing Quests (0:40 - 1:15)
* **What to Show:** The "Quests Board" (Task Tracker), dragging/clicking a task, and completing it.
* **Action:** Select a task (e.g. "Optimize Global State"), mark it as Completed. You will see a `canvas-confetti` celebration. Navigate to the **Rewards Marketplace** and buy a "Coffee Voucher" or "Swag Hoodie".
* **Script:**
  > "Let's open our active Quests. I've finished the 'Optimize Global State' task. When I submit it for manager review, I immediately get audio feedback and a visual celebration.
  > Let's visit the Rewards Store. I've earned enough XP from my streaks to redeem a premium reward.
  > I'll buy this paid coffee coupon. The store validates my points, decrements my balance, and alerts the manager in real-time."

### Phase 3: Manager Approval & Real-Time Socket (1:15 - 1:50)
* **What to Show:** Log out, then log in as the **Manager**.
* **Action:** Log in with:
  * **Email:** `manager01@workquest.ai`
  * **Password:** `Password123!`
* **Action:** Go to the manager dashboard, click "Review Task", rate the task 10/10, and provide positive feedback.
* **Script:**
  > "Now, let's log in as a Manager. We immediately see a real-time notification via Socket.io that our developer completed their task.
  > As a manager, I don't just close tasks—I rate quality. Let's give this task a 10/10 quality score.
  > This provides the developer with bonus XP multipliers and logs their achievement on the live activity logs."

### Phase 4: CEO Portal & AI Assistant AI Executive Assistant (1:50 - 3:00)
* **What to Show:** Log out, then log in as the **Admin / CEO**.
* **Action:** Log in with:
  * **Email:** `admin01@workquest.ai`
  * **Password:** `Password123!`
* **Action:** Toggle AI Assistant by pressing **Ctrl + Space** or clicking the floating neon orb at the bottom right.
* **AI Assistant Demo Actions:**
  1. **Show Navigation Command**: Click the microphone icon or type *"Open projects"* -> AI Assistant navigates to the Client Projects tab automatically!
  2. **Ask for Proactive Insight**: Speak or type *"Who deserves promotion?"* -> AI Assistant audits XP/commits in real-time and streams the candidate's name.
  3. **Show Burnout Prevention**: Type *"Find employees at burnout risk"* -> AI Assistant identifies exhausted users.
  4. **Multi-Turn Action Command**: Type *"Create a new employee"* -> AI Assistant asks for details step-by-step: Name (type *"Rahul"*), Department (type *"Engineering"*), Role (type *"Frontend Developer"*). Once complete, AI Assistant triggers an API write to MongoDB, plays a success chime, fires confetti, and updates the dashboard staff list in real-time without page reload!
  5. **Safety Block Demonstration**: Type *"Reset database"* -> AI Assistant intercepts with a safe safeguard check: *"Are you sure you want to restore original seeds?"*
* **Script:**
  > "Finally, let's log in as the CEO. Here, the traditional dashboard is transformed into an AI-powered command center.
  > By pressing Ctrl+Space, I activate AI Assistant, my AI Chief of Staff.
  > AI Assistant understands natural language voice commands. I'll type 'open projects'—AI Assistant navigates my view instantly.
  > If I ask AI Assistant 'who deserves promotion?', it map-reduces user XP rankings and suggests Developer Engineer 01.
  > Let's deploy a new employee named Rahul. As I answer AI Assistant's questions, it registers the employee on MongoDB, issues a Socket.io broadcast, refreshes my employee count, and triggers a level-up chime—completely automatically.
  > Safety is also integrated; dangerous actions like resetting the database prompt an authentication safeguard.
  > WorkQuest AI bridges productivity, transparency, and fun. Thank you!"

---

## 📸 Recommended Screenshots for Presentation

To make your submission PPT stand out, take screenshots of these premium views:
1. **The Landing Page / Login Panel:** Captures the high-tech glassmorphism card over the glowing neon particles.
2. **Employee Dashboard with XP Progression:** Highlights the level badges, XP circles, and active task board.
3. **The Marketplace Storefront:** Displays items like "Premium Headphones" and "Swag Hoodie" with neon cost buttons.
4. **AI Assistant AI Assistant Panel (Expanded):** Capture the glowing glassmorphic terminal showing thinking logs like *"COMPUTING XP RANK INDEX..."* alongside the animated gradient orb.
5. **CEO Burnout Teleboard:** Demonstrates the data-driven analytics side of the platform with charts and risk warnings.

---

## 📴 Mobile Offline Sync Demo (Bonus)

If judges ask about mobile capabilities:
* **The Concept:** Employees completing tasks in areas with poor internet (e.g. subways).
* **The Flow:**
  1. Complete a task in the React Native simulation.
  2. The mobile SyncManager intercepts it and logs: `💾 Task [task-id] saved in local AsyncStorage queue`.
  3. Once the connection is simulated as restored, the client triggers `replayOfflineQueue()` executing: `🌐 POST /api/tasks/{id}/status`.
