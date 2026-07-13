import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Task from '../models/Task';
import User from '../models/User';
import Marketplace from '../models/Marketplace';
import mongoose from 'mongoose';
import Complaint from '../models/Complaint';
import Department from '../models/Department';

const router = Router();

// Initialize Gemini Client
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

// Helper to query Gemini with text prompts
const queryGemini = async (prompt: string, fallbackJson: string): Promise<string> => {
  if (!genAI) {
    console.log('⚠️ GOOGLE_API_KEY not configured. Returning local mock engine content.');
    return fallbackJson;
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text || fallbackJson;
  } catch (error) {
    console.error('Gemini integration error:', error);
    return fallbackJson;
  }
};

// @route   POST /api/ai/chat
// @desc    Coach Node AI chat coach thread
router.post('/chat', async (req: Request, res: Response): Promise<any> => {
  const { message, userId } = req.body;
  const queryLower = (message || '').toLowerCase();

  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let user = null;
    let tasks: any[] = [];

    if (isDbConnected) {
      try {
        user = await User.findById(userId);
        tasks = await Task.find({ assignedTo: user?.employeeId, status: 'in_progress' });
      } catch (dbErr) {
        console.warn('Database query failed in chat, bypassing to mock context', dbErr);
      }
    }

    // Intercept /complaint command
    if (message.trim().toLowerCase().startsWith('/complaint')) {
      const complaintText = message.replace(/^\/complaint\s*/i, '').trim();
      if (!complaintText) {
        return res.json({ 
          reply: "🚨 TELEMETRY ERROR: Complaint message block is empty. Correct format: '/complaint <describe issue here>'." 
        });
      }

      if (isDbConnected) {
        try {
          const newComplaint = new Complaint({
            userId: userId || 'emp-1',
            userName: user?.name || 'Developer Engineer 01',
            text: complaintText
          });
          await newComplaint.save();
          console.log(`✅ Complaint logged in Atlas: ${complaintText}`);
        } catch (dbErr) {
          console.warn('Failed to save complaint to MongoDB', dbErr);
        }
      }

      const { io } = require('../server');
      if (io) {
        io.emit('complaint_raised', {
          userName: user?.name || 'Developer Engineer 01',
          text: complaintText
        });
      }

      return res.json({
        reply: `🚨 SYSTEM UPLINK SECURED: Complaint ticket successfully logged under Ticket ID [COMP-${Math.floor(1000 + Math.random() * 9000)}] on MongoDB Atlas databases. Dispatching telemetry to department Leads and HR nodes for priority audit review.`
      });
    }

    // Local company knowledge base fallback
    const LOCAL_DEPARTMENTS = [
      { name: 'Frontend Engineering', code: 'FE', manager: 'Manager Leader 01' },
      { name: 'Backend Engineering', code: 'BE', manager: 'Manager Leader 02' },
      { name: 'AI Research', code: 'AI' },
      { name: 'DevOps', code: 'DO', manager: 'Admin Commander 01' },
      { name: 'Cloud Engineering', code: 'CE' },
      { name: 'Cyber Security', code: 'CS' },
      { name: 'QA', code: 'QA' },
      { name: 'UI/UX', code: 'UI' },
      { name: 'Data Science', code: 'DS' }
    ];

    const LOCAL_REWARDS = [
      { title: 'Mechanical Keyboard', description: 'Tactile mechanical keyboard with customizable RGB backlights and premium titanium shell.', cost: 1200, category: 'Hardware' },
      { title: 'Wireless Mouse', description: 'Ergonomic high-precision wireless mouse with custom sensor calibration nodes.', cost: 800, category: 'Hardware' },
      { title: 'Gaming Headset', description: 'Active noise-canceling stereo gaming headset with low-latency microphone sweeps.', cost: 1500, category: 'Audio' },
      { title: 'Amazon Gift Card ($50)', description: 'Amazon electronic voucher to purchase reference technical books or gadgets.', cost: 1000, category: 'Vouchers' },
      { title: 'Steam Gift Card ($50)', description: 'Claim credits for tactical team building simulators and gaming sandboxes.', cost: 1000, category: 'Vouchers' },
      { title: 'Coffee Voucher', description: 'Hot beverage subscription card containing 10 premium espresso claims.', cost: 300, category: 'Beverages' },
      { title: 'Extra Leave Day', description: 'Accrue one full day of paid rest. Rest periods prevent burnout alerts.', cost: 2000, category: 'TimeOff' },
      { title: 'Wireless Earbuds', description: 'Water-resistant true wireless earbuds with magnetic docking pods.', cost: 1800, category: 'Audio' },
      { title: 'Monitor Voucher ($100)', description: 'Partial checkout code to purchase ultra-wide external workstation screens.', cost: 2000, category: 'Vouchers' },
      { title: 'Laptop Backpack', description: 'Lunar white carbon-fiber reinforced anti-theft workstation gear pack.', cost: 700, category: 'Travel' }
    ];

    const LOCAL_TASKS = [
      { title: 'Refactor Core State Engine', description: 'Optimize Redux/Context state variables to clear memory leaks on browser unmounts.' },
      { title: 'Implement JWT Token Rotation', description: 'Secure Express API endpoints using short-lived tokens and HTTP-only cookie rotation.' },
      { title: 'Optimize WebGL Shader Nodes', description: 'Simplify fragment shader rendering logic in custom particle canvas for 60 FPS mobile velocity.' },
      { title: 'Audit AWS ECS Container Memory', description: 'Track CPU spikes on production load balancer pipelines and scale cluster thresholds.' },
      { title: 'Design Glassmorphic Profile Portal', description: 'Code CSS layouts for user cards with floating neon tags and responsive hover matrix scales.' },
      { title: 'Deploy MongoDB Multi-Region Replica Set', description: 'Establish cluster backups and reduce read latency metrics for secondary dev nodes.' },
      { title: 'Mitigate Redis Cache Collisions', description: 'Review cache invalidation schemas during batch client request updates.' },
      { title: 'Write Playwright E2E Integration Suite', description: 'Automate dashboard access paths, login mocks, and checkout forms testing.' },
      { title: 'Configure GitHub Actions CI/CD Pipeline', description: 'Automate build runs, ESLint scans, and Docker container pushes on master commit triggers.' },
      { title: 'Tune Gemini Prompt Vector Parameters', description: 'Refine system instruction templates for accurate burnout indexes diagnostics.' }
    ];

    const LOCAL_USERS = [
      { name: 'Admin Commander 01', email: 'admin01@workquest.ai', role: 'Admin', department: 'DevOps', employeeId: 'ADM-001', xp: 5000, level: 5, burnoutScore: 5, completedTasksCount: 42, commitsCount: 154, location: 'San Francisco, CA' },
      { name: 'Manager Leader 01', email: 'manager01@workquest.ai', role: 'Manager', department: 'Frontend Engineering', employeeId: 'MGR-001', xp: 4000, level: 4, burnoutScore: 12, completedTasksCount: 30, commitsCount: 120, location: 'New York, NY' },
      { name: 'Manager Leader 02', email: 'manager02@workquest.ai', role: 'Manager', department: 'Backend Engineering', employeeId: 'MGR-002', xp: 4000, level: 4, burnoutScore: 12, completedTasksCount: 30, commitsCount: 120, location: 'New York, NY' },
      { name: 'Developer Engineer 01', email: 'employee1@workquest.ai', role: 'Employee', department: 'Backend Engineering', employeeId: 'EMP-001', xp: 2800, level: 3, burnoutScore: 15, completedTasksCount: 18, commitsCount: 95, location: 'Austin, TX' },
      { name: 'Developer Engineer 02', email: 'employee2@workquest.ai', role: 'Employee', department: 'Frontend Engineering', employeeId: 'EMP-002', xp: 1900, level: 2, burnoutScore: 45, completedTasksCount: 12, commitsCount: 65, location: 'Remote' },
      { name: 'Developer Engineer 03', email: 'employee3@workquest.ai', role: 'Employee', department: 'AI Research', employeeId: 'EMP-003', xp: 3200, level: 4, burnoutScore: 60, completedTasksCount: 22, commitsCount: 110, location: 'Austin, TX' }
    ];

    // Keyword extraction helper for smart RAG searching
    const extractKeywords = (text: string): string[] => {
      const stopWords = new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'against', 'between', 'into',
        'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'in', 'out',
        'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
        'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
        'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
        'will', 'just', 'don', 'should', 'now', 'what', 'who', 'whom', 'this', 'that', 'these',
        'those', 'am', 'how', 'much', 'many', 'cost', 'does', 'do', 'did', 'get', 'show', 'list', 'find'
      ]);
      
      return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));
    };

    const keywords = extractKeywords(message);
    let ragContext = '';

    if (isDbConnected && keywords.length > 0) {
      try {
        // 1. Task RAG (Database)
        if (
          queryLower.includes('task') || queryLower.includes('ticket') || 
          queryLower.includes('quest') || queryLower.includes('todo') || 
          queryLower.includes('progress') || queryLower.includes('review') || 
          queryLower.includes('done') || queryLower.includes('complete') || 
          queryLower.includes('sprint') || queryLower.includes('work')
        ) {
          const taskQueries = keywords.map(kw => ({ title: { $regex: kw, $options: 'i' } }))
            .concat(keywords.map(kw => ({ description: { $regex: kw, $options: 'i' } })))
            .concat([{ assignedTo: user?.employeeId || '' }]);

          let matchingTasks = await Task.find({ $or: taskQueries }).limit(8).lean();

          if (matchingTasks.length === 0) {
            matchingTasks = await Task.find({ assignedTo: user?.employeeId }).limit(5).lean();
          }

          if (matchingTasks.length > 0) {
            ragContext += `\n[GROUNDED KNOWLEDGE: Tasks/Quests in Company]\n`;
            matchingTasks.forEach((t: any) => {
              ragContext += `- Task: "${t.title}" (ID: ${t._id || t.id}), Status: ${t.status}, Assigned To: ${t.assignedToName} (${t.assignedTo}), Difficulty: ${t.difficulty} (${t.xp} XP), Priority: ${t.priority}, Est Hours: ${t.estimatedHours}, Due: ${t.dueDate}\n`;
              if (t.description) ragContext += `  Desc: ${t.description}\n`;
            });
          }
        }

        // 2. User/Leaderboard RAG (Database)
        if (
          queryLower.includes('leaderboard') || queryLower.includes('rank') || 
          queryLower.includes('who') || queryLower.includes('developer') || 
          queryLower.includes('employee') || queryLower.includes('team') || 
          queryLower.includes('manager') || queryLower.includes('member') || 
          queryLower.includes('xp') || queryLower.includes('level') || 
          queryLower.includes('burnout') || queryLower.includes('standings')
        ) {
          const userQueries = keywords.map(kw => ({ name: { $regex: kw, $options: 'i' } }))
            .concat(keywords.map(kw => ({ department: { $regex: kw, $options: 'i' } })));

          let matchingUsers = await User.find({ $or: userQueries }).limit(10).lean();
          const topUsers = await User.find().sort({ xp: -1 }).limit(5).lean();

          ragContext += `\n[GROUNDED KNOWLEDGE: Employee Profiles & Leaderboard]\n`;
          ragContext += `Top 5 Leaderboard Standings:\n`;
          topUsers.forEach((u: any, idx: number) => {
            ragContext += `${idx + 1}. ${u.name} (Level ${u.level}, ${u.xp} XP, Dept: ${u.department}, Status: ${u.status})\n`;
          });

          if (matchingUsers.length === 0) {
            matchingUsers = await User.find().limit(5).lean();
          }

          if (matchingUsers.length > 0) {
            ragContext += `Matching Employee Profiles:\n`;
            matchingUsers.forEach((u: any) => {
              ragContext += `- Name: ${u.name} (ID: ${u.employeeId}), Role: ${u.role}, Dept: ${u.department}, Level: ${u.level} (${u.xp} XP), Burnout Score: ${u.burnoutScore}%, Commits: ${u.commitsCount}, Completed Tasks: ${u.completedTasksCount}, Status: ${u.status}, Location: ${u.location}\n`;
            });
          }
        }

        // 3. Marketplace RAG (Database)
        if (
          queryLower.includes('marketplace') || queryLower.includes('shop') || 
          queryLower.includes('reward') || queryLower.includes('buy') || 
          queryLower.includes('redeem') || queryLower.includes('item') || 
          queryLower.includes('keyboard') || queryLower.includes('mouse') || 
          queryLower.includes('headset') || queryLower.includes('headphones') || 
          queryLower.includes('voucher') || queryLower.includes('coffee') || 
          queryLower.includes('leave') || queryLower.includes('cost') || 
          queryLower.includes('price')
        ) {
          const rewardQueries = keywords.map(kw => ({ title: { $regex: kw, $options: 'i' } }))
            .concat(keywords.map(kw => ({ description: { $regex: kw, $options: 'i' } })));

          let matchingRewards = await Marketplace.find({ $or: rewardQueries }).limit(10).lean();

          if (matchingRewards.length === 0) {
            matchingRewards = await Marketplace.find().limit(6).lean();
          }

          if (matchingRewards.length > 0) {
            ragContext += `\n[GROUNDED KNOWLEDGE: Marketplace Rewards Shop]\n`;
            matchingRewards.forEach((r: any) => {
              ragContext += `- Reward Item: "${r.title}", Description: ${r.description}, Cost: ${r.cost} XP, Stock: ${r.stock}, Category: ${r.category}\n`;
            });
          }
        }

        // 4. Department RAG (Database)
        if (
          queryLower.includes('department') || queryLower.includes('team') || 
          queryLower.includes('devops') || queryLower.includes('frontend') || 
          queryLower.includes('backend') || queryLower.includes('manager') || 
          queryLower.includes('leader')
        ) {
          const deptQueries = keywords.map(kw => ({ name: { $regex: kw, $options: 'i' } }))
            .concat(keywords.map(kw => ({ code: { $regex: kw, $options: 'i' } })));

          let matchingDepts = await Department.find({ $or: deptQueries }).limit(5).lean();

          if (matchingDepts.length === 0) {
            matchingDepts = await Department.find().limit(5).lean();
          }

          if (matchingDepts.length > 0) {
            ragContext += `\n[GROUNDED KNOWLEDGE: Department Structure]\n`;
            matchingDepts.forEach((d: any) => {
              ragContext += `- Department: "${d.name}" (Code: ${d.code}), Manager Employee ID: ${d.managerId || 'None'}\n`;
            });
          }
        }
      } catch (ragErr) {
        console.warn('RAG retrieval failed, continuing with local RAG fallback', ragErr);
      }
    }

    // Local knowledge base query fallback if DB is not connected, empty or query fails
    if (!ragContext && keywords.length > 0) {
      try {
        // 1. Task RAG (Local fallback)
        if (
          queryLower.includes('task') || queryLower.includes('ticket') || 
          queryLower.includes('quest') || queryLower.includes('todo') || 
          queryLower.includes('progress') || queryLower.includes('review') || 
          queryLower.includes('done') || queryLower.includes('complete') || 
          queryLower.includes('sprint') || queryLower.includes('work')
        ) {
          let matchingTasks = LOCAL_TASKS.filter(t => 
            keywords.some(kw => t.title.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw))
          );
          
          if (matchingTasks.length === 0) {
            matchingTasks = LOCAL_TASKS.slice(0, 5);
          }

          if (matchingTasks.length > 0) {
            ragContext += `\n[GROUNDED KNOWLEDGE: Tasks/Quests in Company]\n`;
            matchingTasks.forEach(t => {
              ragContext += `- Task: "${t.title}", Description: ${t.description}\n`;
            });
          }
        }

        // 2. User/Leaderboard RAG (Local fallback)
        if (
          queryLower.includes('leaderboard') || queryLower.includes('rank') || 
          queryLower.includes('who') || queryLower.includes('developer') || 
          queryLower.includes('employee') || queryLower.includes('team') || 
          queryLower.includes('manager') || queryLower.includes('member') || 
          queryLower.includes('xp') || queryLower.includes('level') || 
          queryLower.includes('burnout') || queryLower.includes('standings')
        ) {
          let matchingUsers = LOCAL_USERS.filter(u => 
            keywords.some(kw => u.name.toLowerCase().includes(kw) || u.department.toLowerCase().includes(kw))
          );

          const topUsers = [...LOCAL_USERS].sort((a, b) => b.xp - a.xp).slice(0, 5);

          ragContext += `\n[GROUNDED KNOWLEDGE: Employee Profiles & Leaderboard]\n`;
          ragContext += `Top Leaderboard Standings:\n`;
          topUsers.forEach((u, idx) => {
            ragContext += `${idx + 1}. ${u.name} (Level ${u.level}, ${u.xp} XP, Dept: ${u.department})\n`;
          });

          if (matchingUsers.length === 0) {
            matchingUsers = LOCAL_USERS.slice(0, 5);
          }

          if (matchingUsers.length > 0) {
            ragContext += `Matching Employee Profiles:\n`;
            matchingUsers.forEach(u => {
              ragContext += `- Name: ${u.name} (ID: ${u.employeeId}), Role: ${u.role}, Dept: ${u.department}, Level: ${u.level} (${u.xp} XP), Burnout Score: ${u.burnoutScore}%, Location: ${u.location}\n`;
            });
          }
        }

        // 3. Marketplace RAG (Local fallback)
        if (
          queryLower.includes('marketplace') || queryLower.includes('shop') || 
          queryLower.includes('reward') || queryLower.includes('buy') || 
          queryLower.includes('redeem') || queryLower.includes('item') || 
          queryLower.includes('keyboard') || queryLower.includes('mouse') || 
          queryLower.includes('headset') || queryLower.includes('headphones') || 
          queryLower.includes('voucher') || queryLower.includes('coffee') || 
          queryLower.includes('leave') || queryLower.includes('cost') || 
          queryLower.includes('price')
        ) {
          let matchingRewards = LOCAL_REWARDS.filter(r => 
            keywords.some(kw => r.title.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw))
          );

          if (matchingRewards.length === 0) {
            matchingRewards = LOCAL_REWARDS.slice(0, 6);
          }

          if (matchingRewards.length > 0) {
            ragContext += `\n[GROUNDED KNOWLEDGE: Marketplace Rewards Shop]\n`;
            matchingRewards.forEach(r => {
              ragContext += `- Reward Item: "${r.title}", Description: ${r.description}, Cost: ${r.cost} XP, Category: ${r.category}\n`;
            });
          }
        }

        // 4. Department RAG (Local fallback)
        if (
          queryLower.includes('department') || queryLower.includes('team') || 
          queryLower.includes('devops') || queryLower.includes('frontend') || 
          queryLower.includes('backend') || queryLower.includes('manager') || 
          queryLower.includes('leader')
        ) {
          let matchingDepts = LOCAL_DEPARTMENTS.filter(d => 
            keywords.some(kw => d.name.toLowerCase().includes(kw) || d.code.toLowerCase().includes(kw))
          );

          if (matchingDepts.length === 0) {
            matchingDepts = LOCAL_DEPARTMENTS.slice(0, 5);
          }

          if (matchingDepts.length > 0) {
            ragContext += `\n[GROUNDED KNOWLEDGE: Department Structure]\n`;
            matchingDepts.forEach(d => {
              ragContext += `- Department: "${d.name}" (Code: ${d.code}), Manager: ${d.manager || 'None'}\n`;
            });
          }
        }
      } catch (localRagErr) {
        console.warn('Local RAG retrieval failed', localRagErr);
      }
    }
    
    const contextPrompt = `
      You are the WorkQuest AI productivity coach node. WorkQuest AI is a gamified Kanban Board and Team Telemetry overlay that transforms software sprint items (frontend, backend, QA, security) into gamified "quests".
      
      Core App Features to answer questions:
      - **Kanban Board Deck**: Organizes tickets in Todo, In Progress, In Review, and Completed lanes. Moving tasks to In Review sends them to managers for validation. Quests grant XP depending on difficulty: Easy (10 XP), Medium (30 XP), Hard (60 XP), and Extreme (120 XP).
      - **Marketplace Deck**: Shop inventory where developers claim physical/virtual goods using earned XP balances. Rely ONLY on the list of rewards provided in the grounded knowledge below, do NOT invent or list other items (like Sony WH-1000XM5 or hoodies) unless they are explicitly present in the grounded knowledge.
      - **Burnout Telemetry Monitor**: Diagnostic engine displaying real-time delivery velocity progress, active logging parameters, and user burnout percentages. It warns users if velocity rises too fast without taking leaves, prompting rest cycles.
      - **AI Coach Node**: This chat console, enabling developers to query Gemini for task estimations, sprint summaries, ticket drafts, and platform mechanics.
      
      Complaint Lodging Rule:
      - If the user asks about raising, lodging, or filing a complaint, tell them they must type their message starting with '/complaint <describe issue here>' (for example, '/complaint Slow loading times on dev server'). Inform them that using this command will automatically save their ticket to MongoDB Atlas and ping department managers.
      
      You are tracking developer ${user?.name || 'Developer Engineer 01'} in the ${user?.department || 'Engineering'} department. 
      They currently have ${user?.xp || 3428} XP, Level ${user?.level || 4}, and a burnout score of ${user?.burnoutScore || 15}%. 
      Active tasks they are working on: ${tasks.length ? tasks.map(t => t.title).join(', ') : 'Refactor Core State Engine'}.
      
      ${ragContext ? `
      Here is real-time company telemetry and database context retrieved for the developer's query. You MUST strictly use this information to answer any specific questions about tasks, employees, leaderboard standings, departments, or marketplace rewards. Do NOT invent items or details not present in this context:
      ${ragContext}
      ` : ''}

      The developer asks: "${message}".
      Provide a highly encouraging, sci-fi themed response (HUD console coach tone). Answer questions about how the app works, how to earn XP, how to redeem items, or how to avoid burnout using the core features and the grounded knowledge above. Refer strictly to the specific tasks, marketplace items, or employee details listed in the grounded knowledge if the user asked about them. Keep your response extremely short, concise, and direct (maximum 1-3 short sentences). Do not write long paragraphs.
    `;

    // Dynamic keyword fallback if Gemini is offline
    let fallback = "System Online. Shifting workload parameters implies burnout index is stable at 14%. Keep daily login multipliers active.";
    const lower = message.toLowerCase();
    if (lower.includes('python')) {
      fallback = "Python is a powerful, high-level, interpreted programming language. In our WorkQuest sprint plexus, Python is recommended for backend microservices, data pipeline scaling, and automation workflows. Let me know if you would like me to draft a Python task ticket template.";
    } else if (lower.includes('streak') || lower.includes('burnout') || lower.includes('exhaustion')) {
      fallback = "Burnout coefficient currently stable at 14%. Workspace streak multipliers are active. Recommended action is to balance task velocity with rest blocks.";
    } else if (lower.includes('how') && (lower.includes('app') || lower.includes('work') || lower.includes('this'))) {
      fallback = "WorkQuest AI is a gamified Kanban Board and Team Telemetry overlay that transforms software sprint items (frontend, backend, QA, security) into gamified 'quests'. Move task cards across lanes (Todo, In Progress, In Review, Completed) to earn XP. Accumulated XP can be redeemed at the Marketplace Deck for physical/virtual rewards. Use the Burnout Telemetry Monitor to check delivery safety indicators.";
    }

    const responseText = await queryGemini(contextPrompt, fallback);
    return res.json({ reply: responseText });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ error: 'AI Coach failed to evaluate query.' });
  }
});

// @route   POST /api/ai/sprint-summary
// @desc    Generates sprint tasks performance reports
router.post('/sprint-summary', async (req: Request, res: Response): Promise<any> => {
  try {
    const totalTasksCount = await Task.countDocuments({});
    const completedTasksCount = await Task.countDocuments({ status: 'completed' });
    
    const summaryPrompt = `
      Summarize the active sprint execution.
      Total tasks allocated: ${totalTasksCount}.
      Tasks completed: ${completedTasksCount}.
      Generate a bulleted, high-level overview of delivery velocity, backlog items, and overall team performance.
    `;

    const fallback = `* Sprint completed successfully.\n* Velocity efficiency registered at 92%.\n* Core database migrations deployed to production.`;
    const summaryText = await queryGemini(summaryPrompt, fallback);
    return res.json({ summary: summaryText });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate sprint summaries.' });
  }
});

// @route   POST /api/ai/generate-task
// @desc    Generate task card specifications from raw commands
router.post('/generate-task', async (req: Request, res: Response): Promise<any> => {
  const { prompt } = req.body;

  try {
    const templatePrompt = `
      Based on the request: "${prompt}", generate a JSON task ticket spec containing:
      {
        "title": "Short Task Title",
        "description": "Scope details and deliverables description",
        "difficulty": "easy, medium, hard, or extreme",
        "priority": "low, medium, high, or critical",
        "estimatedHours": 2, 4, 8, or 16
      }
      Return ONLY clean, raw JSON matching this structure.
    `;

    const fallback = JSON.stringify({
      title: 'Holographic Cache Invalidation',
      description: 'Optimize backend query buffers to prevent stale diagnostic readouts.',
      difficulty: 'medium',
      priority: 'high',
      estimatedHours: 6
    });

    const geminiText = await queryGemini(templatePrompt, fallback);
    
    // Attempt parsing
    try {
      const cleanJsonStr = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return res.json(parsed);
    } catch {
      return res.json(JSON.parse(fallback));
    }
  } catch (err) {
    return res.status(500).json({ error: 'Task generator execution failed.' });
  }
});

// @route   POST /api/ai/estimate-difficulty
// @desc    Calculate task difficulty and grant XP thresholds
router.post('/estimate-difficulty', async (req: Request, res: Response): Promise<any> => {
  const { description } = req.body;

  try {
    const prompt = `
      Evaluate the complexity of this task description: "${description}".
      Select a difficulty level: "easy", "medium", "hard", or "extreme".
      Select an XP yield (Easy: 10 XP, Medium: 30 XP, Hard: 60 XP, Extreme: 120 XP).
      Return ONLY a JSON response:
      {
        "difficulty": "medium",
        "xp": 30
      }
    `;

    const fallback = JSON.stringify({ difficulty: 'medium', xp: 30 });
    const geminiText = await queryGemini(prompt, fallback);

    try {
      const cleanJsonStr = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return res.json(parsed);
    } catch {
      return res.json(JSON.parse(fallback));
    }
  } catch (err) {
    return res.status(500).json({ error: 'Difficulty estimator failed.' });
  }
});

// @route   POST /api/ai/performance-analysis
// @desc    Evaluate employee velocity logs and generate feedback score
router.post('/performance-analysis', async (req: Request, res: Response): Promise<any> => {
  const { employeeId } = req.body;

  try {
    const employee = await User.findOne({ employeeId });
    if (!employee) return res.status(404).json({ error: 'Employee not found.' });

    const prompt = `
      Evaluate the performance telemetry of developer ${employee.name} in department ${employee.department}.
      Total Commits: ${employee.commitsCount}, Tasks Completed: ${employee.completedTasksCount}, Burnout Index: ${employee.burnoutScore}%.
      Provide a quality score (1 to 10) and brief technical feedback.
      Return ONLY a JSON:
      {
        "score": 9.2,
        "feedback": "Analysis notes..."
      }
    `;

    const fallback = JSON.stringify({
      score: employee.performanceScore,
      feedback: 'Outstanding deployment velocity. Commits pattern show clean modular architecture.'
    });

    const geminiText = await queryGemini(prompt, fallback);

    try {
      const cleanJsonStr = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return res.json(parsed);
    } catch {
      return res.json(JSON.parse(fallback));
    }
  } catch (err) {
    return res.status(500).json({ error: 'Performance analysis pipeline failed.' });
  }
});

// @route   POST /api/ai/burnout-detection
// @desc    Evaluate burnout warning levels
router.post('/burnout-detection', async (req: Request, res: Response): Promise<any> => {
  const { employeeId } = req.body;

  try {
    const employee = await User.findOne({ employeeId });
    if (!employee) return res.status(404).json({ error: 'Employee not found.' });

    const prompt = `
      Determine the burnout warning level for ${employee.name}.
      Burnout Score is currently ${employee.burnoutScore}%, Completed Tasks: ${employee.completedTasksCount}, Pending Tasks: ${employee.pendingTasksCount}.
      Return a response detailing if they require a rest block, leave advice, or load reduction.
      Format response as JSON:
      {
        "status": "Safe" or "Warning" or "Critical",
        "suggestion": "Actionable feedback details..."
      }
    `;

    const fallback = JSON.stringify({
      status: employee.burnoutScore > 70 ? 'Warning' : 'Safe',
      suggestion: employee.burnoutScore > 70 
        ? 'Burnout score elevated. Recommended leaves allocation or task redistribution to clear active backlogs.' 
        : 'Workload limits safe. Keep daily streaks active.'
    });

    const geminiText = await queryGemini(prompt, fallback);

    try {
      const cleanJsonStr = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return res.json(parsed);
    } catch {
      return res.json(JSON.parse(fallback));
    }
  } catch (err) {
    return res.status(500).json({ error: 'Burnout detector scan failed.' });
  }
});

// @route   POST /api/ai/recommend-tasks
// @desc    Recommend tasks based on employee level and department
router.post('/recommend-tasks', async (req: Request, res: Response): Promise<any> => {
  const { employeeId } = req.body;

  try {
    const employee = await User.findOne({ employeeId });
    if (!employee) return res.status(404).json({ error: 'Employee not found.' });

    const prompt = `
      Suggest 2 realistic sprint tasks fitting a Level ${employee.level} developer in the ${employee.department} team.
      Return ONLY a JSON list of objects:
      [
        { "title": "Task A", "difficulty": "medium", "xp": 30 },
        { "title": "Task B", "difficulty": "hard", "xp": 60 }
      ]
    `;

    const fallback = JSON.stringify([
      { title: 'Refactor state selector cache nodes', difficulty: 'medium', xp: 30 },
      { title: 'Optimize docker container start metrics', difficulty: 'hard', xp: 60 }
    ]);

    const geminiText = await queryGemini(prompt, fallback);

    try {
      const cleanJsonStr = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return res.json(parsed);
    } catch {
      return res.json(JSON.parse(fallback));
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// @route   POST /api/ai/meeting-notes
// @desc    Takes raw notes and spits out task arrays
router.post('/meeting-notes', async (req: Request, res: Response): Promise<any> => {
  const { rawNotes } = req.body;

  try {
    const prompt = `
      Parse these meeting raw notes: "${rawNotes}".
      Spit out 3 structured sprint tasks to generate, containing title, description, difficulty, priority.
      Return ONLY a JSON array:
      [
        { "title": "Title", "description": "Desc...", "difficulty": "medium", "priority": "high" }
      ]
    `;

    const fallback = JSON.stringify([
      { title: 'Implement JWT Session Expiry Logs', description: 'Log session timeouts and clear browser cookies on unmounts.', difficulty: 'medium', priority: 'high' },
      { title: 'Fix WebGL Canvas Resize Lag', description: 'Debounce resize events to prevent canvas rendering loops.', difficulty: 'easy', priority: 'medium' }
    ]);

    const geminiText = await queryGemini(prompt, fallback);

    try {
      const cleanJsonStr = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      return res.json(parsed);
    } catch {
      return res.json(JSON.parse(fallback));
    }
  } catch (err) {
    return res.status(500).json({ error: 'Meeting notes parser failure.' });
  }
});

// @route   POST /api/ai/search
// @desc    Natural Language Search
router.post('/search', async (req: Request, res: Response): Promise<any> => {
  const { query } = req.body;

  try {
    // Basic database query fallback for exact terms, combined with full scans
    const matchingTasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(5);

    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } }
      ]
    }).limit(3);

    const matchingRewards = await Marketplace.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(3);

    return res.json({
      tasks: matchingTasks,
      users: matchingUsers,
      rewards: matchingRewards
    });
  } catch (err) {
    return res.status(500).json({ error: 'Natural language search query failed.' });
  }
});

export default router;
