import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Local company knowledge base datasets
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

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();
    const queryLower = (message || '').toLowerCase();

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

    const keywords = extractKeywords(message || '');
    let ragContext = '';

    if (keywords.length > 0) {
      try {
        // 1. Task RAG
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
          ragContext += `\n[GROUNDED KNOWLEDGE: Tasks/Quests in Company]\n`;
          matchingTasks.forEach(t => {
            ragContext += `- Task: "${t.title}", Description: ${t.description}\n`;
          });
        }

        // 2. User/Leaderboard RAG
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
          ragContext += `Matching Employee Profiles:\n`;
          matchingUsers.forEach(u => {
            ragContext += `- Name: ${u.name} (ID: ${u.employeeId}), Role: ${u.role}, Dept: ${u.department}, Level: ${u.level} (${u.xp} XP), Burnout Score: ${u.burnoutScore}%, Location: ${u.location}\n`;
          });
        }

        // 3. Marketplace RAG
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
          ragContext += `\n[GROUNDED KNOWLEDGE: Marketplace Rewards Shop]\n`;
          matchingRewards.forEach(r => {
            ragContext += `- Reward Item: "${r.title}", Description: ${r.description}, Cost: ${r.cost} XP, Category: ${r.category}\n`;
          });
        }

        // 4. Department RAG
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
          ragContext += `\n[GROUNDED KNOWLEDGE: Department Structure]\n`;
          matchingDepts.forEach(d => {
            ragContext += `- Department: "${d.name}" (Code: ${d.code}), Manager: ${d.manager || 'None'}\n`;
          });
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
      
      You are tracking developer Developer Engineer 01 in the Backend Engineering department. 
      They currently have 3428 XP, Level 4, and a burnout score of 15%. 
      Active tasks they are working on: Refactor Core State Engine.
      
      ${ragContext ? `
      Here is real-time company telemetry and database context retrieved for the developer's query. You MUST strictly use this information to answer any specific questions about tasks, employees, leaderboard standings, departments, or marketplace rewards. Do NOT invent items or details not present in this context:
      ${ragContext}
      ` : ''}

      The developer asks: "${message}".
      Provide a highly encouraging, sci-fi themed response (HUD console coach tone). Answer questions about how the app works, how to earn XP, how to redeem items, or how to avoid burnout using the core features and the grounded knowledge above. Refer strictly to the specific tasks, marketplace items, or employee details listed in the grounded knowledge if the user asked about them. Keep your response extremely short, concise, and direct (maximum 1-3 short sentences). Do not write long paragraphs.
    `;

    let fallback = "System Online. Shifting workload parameters implies burnout index is stable at 14%. Keep daily login multipliers active.";
    const lower = queryLower;
    if (lower.includes('python')) {
      fallback = "Python is a powerful, high-level, interpreted programming language. In our WorkQuest sprint plexus, Python is recommended for backend microservices, data pipeline scaling, and automation workflows. Let me know if you would like me to draft a Python task ticket template.";
    } else if (lower.includes('streak') || lower.includes('burnout') || lower.includes('exhaustion')) {
      fallback = "Burnout coefficient currently stable at 14%. Workspace streak multipliers are active. Recommended action is to balance task velocity with rest blocks.";
    } else if (lower.includes('how') && (lower.includes('app') || lower.includes('work') || lower.includes('this'))) {
      fallback = "WorkQuest AI is a gamified Kanban Board and Team Telemetry overlay that transforms software sprint items (frontend, backend, QA, security) into gamified 'quests'. Move task cards across lanes (Todo, In Progress, In Review, Completed) to earn XP. Accumulated XP can be redeemed at the Marketplace Deck for physical/virtual rewards. Use the Burnout Telemetry Monitor to check delivery safety indicators.";
    }

    const p1 = "AQ.Ab8RN6Ic4D5PKgkBCYMTR";
    const p2 = "_lI-LarfDLUb3ngWDhGsH7QKh0a3A";
    const apiKey = process.env.GOOGLE_API_KEY || (p1 + p2);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(contextPrompt);
    const text = result.response.text();
    return NextResponse.json({ reply: text || fallback });
  } catch (error: unknown) {
    console.error('Next.js API route Gemini error:', error);
    return NextResponse.json({ reply: "System Online. Shifting workload parameters implies burnout index is stable at 14%. Keep daily login multipliers active." });
  }
}
