import { User, Task, Reward, Badge, LeaderboardEntry, ActivityLog } from './types';

export const mockUsers: User[] = [
  {
    id: 'emp-1',
    name: 'Developer Engineer 01',
    role: 'employee',
    email: 'employee1@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    xp: 3420,
    level: 4, // Level 4 Champion
    streak: 6,
    badges: ['badge-1', 'badge-2', 'badge-4'],
    department: 'Engineering',
    joinedAt: '2026-01-15',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$115,000',
  },
  {
    id: 'mgr-1',
    name: 'Manager Leader 01',
    role: 'manager',
    email: 'manager01@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    xp: 8520,
    level: 7, // Level 7 Titan
    streak: 12,
    badges: ['badge-3', 'badge-7', 'badge-10'],
    department: 'Product',
    joinedAt: '2025-05-10',
    themeColor: 'cyan',
    skipsLeft: 1,
    streakFreezeActive: false,
    salary: '$145,000',
  },
  {
    id: 'adm-1',
    name: 'Admin Commander 01',
    role: 'admin',
    email: 'admin01@workquest.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    xp: 5000,
    level: 5,
    streak: 8,
    badges: ['badge-5', 'badge-8'],
    department: 'DevOps',
    joinedAt: '2024-03-12',
    themeColor: 'purple',
    skipsLeft: 2,
    streakFreezeActive: false,
    salary: '$160,000',
  }
];

export const mockBadges: Badge[] = [
  { id: 'badge-1', name: 'Early Bird', description: 'Complete a task before 9:00 AM', iconName: 'Sun', rarity: 'common' },
  { id: 'badge-2', name: 'Perfect Week', description: 'Maintain a 5-day task completion streak', iconName: 'CalendarCheck', rarity: 'rare' },
  { id: 'badge-3', name: 'Task Master', description: 'Complete 50 tasks in total', iconName: 'Award', rarity: 'epic' },
  { id: 'badge-4', name: 'Fast Finisher', description: 'Complete a High difficulty task in under 4 hours', iconName: 'Zap', rarity: 'rare' },
  { id: 'badge-5', name: 'Innovation Hero', description: 'Get a perfect 10/10 quality score from your manager', iconName: 'Lightbulb', rarity: 'legendary' },
  { id: 'badge-6', name: 'Team Player', description: 'Assist 5 team members in resolving blockers', iconName: 'Users', rarity: 'common' },
  { id: 'badge-7', name: 'Marathon Worker', description: 'Log code or tasks 10 days in a row', iconName: 'Flame', rarity: 'epic' },
  { id: 'badge-8', name: 'Top Performer', description: 'Rank #1 on the monthly leaderboard', iconName: 'Crown', rarity: 'legendary' },
];

export const levelNames: Record<number, string> = {
  1: 'Rookie',
  2: 'Explorer',
  3: 'Warrior',
  4: 'Champion',
  5: 'Elite',
  6: 'Legend',
  7: 'Titan',
  8: 'Master',
  9: 'Grandmaster',
  10: 'Mythic'
};

export const difficultyXp: Record<string, number> = {
  easy: 10,
  medium: 30,
  hard: 60,
  extreme: 120
};

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Refactor Core State Engine',
    description: 'Optimize global context queries to improve paint rendering on mobile screens.',
    difficulty: 'hard',
    xp: 60,
    dueDate: '2026-07-08',
    status: 'in_progress',
    assignedTo: 'emp-1',
    assignedToName: 'Developer Engineer 01',
    assignedBy: 'mgr-1',
    commentsCount: 3,
  },
  {
    id: 'task-2',
    title: 'Design WorkQuest Landing Page',
    description: 'Create interactive high-fidelity dark-mode layouts mirroring Linear / Stripe.',
    difficulty: 'extreme',
    xp: 120,
    dueDate: '2026-07-07',
    status: 'in_review',
    assignedTo: 'emp-1',
    assignedToName: 'Developer Engineer 01',
    assignedBy: 'mgr-1',
    commentsCount: 7,
  },
  {
    id: 'task-3',
    title: 'Write API endpoints for Auth',
    description: 'Develop JWT token verification and OAuth middleware flow inside Express.',
    difficulty: 'medium',
    xp: 30,
    dueDate: '2026-07-10',
    status: 'todo',
    assignedTo: 'emp-1',
    assignedToName: 'Developer Engineer 01',
    assignedBy: 'mgr-1',
    commentsCount: 1,
  },
  {
    id: 'task-4',
    title: 'Biometric Integration Boilerplate',
    description: 'Integrate Expo LocalAuthentication for FaceID / Fingerprint unlocks.',
    difficulty: 'medium',
    xp: 30,
    dueDate: '2026-07-05',
    status: 'completed',
    assignedTo: 'emp-1',
    assignedToName: 'Developer Engineer 01',
    assignedBy: 'mgr-1',
    completionTime: '3.5h',
    qualityScore: 9,
    feedback: 'Fantastic implementation and quick deployment!',
    commentsCount: 2,
  },
  {
    id: 'task-5',
    title: 'Fix SQLite cache leak',
    description: 'Resolve database lock errors when restoring offline queues on React Native.',
    difficulty: 'hard',
    xp: 60,
    dueDate: '2026-07-09',
    status: 'todo',
    assignedTo: 'emp-2',
    assignedToName: 'Jordan Sparks',
    assignedBy: 'mgr-1',
    commentsCount: 0,
  }
];

export const mockRewards: Reward[] = [
  {
    id: 'rew-1',
    title: 'Extra Paid Leave (1 Day)',
    description: 'Redeem an additional day of paid time off. Automatically credited to your leave balance.',
    category: 'leaves',
    cost: 1500,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=250&q=80',
    iconName: 'PlaneTakeoff',
  },
  {
    id: 'rew-2',
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Premium industry-leading noise canceling wireless headphones in silver.',
    category: 'electronics',
    cost: 3000,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=250&q=80',
    iconName: 'Headphones',
  },
  {
    id: 'rew-3',
    title: 'WorkQuest Hoodie (Lunar White)',
    description: 'Heavyweight organic cotton hoodie with minimalist glow-in-the-dark logo prints.',
    category: 'fashion',
    cost: 600,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&h=250&q=80',
    iconName: 'Shirt',
  },
  {
    id: 'rew-4',
    title: 'SteelSeries Apex Pro Keyboard',
    description: 'OmniPoint adjustable mechanical switches for professional grade typing and gaming.',
    category: 'electronics',
    cost: 2000,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&h=250&q=80',
    iconName: 'Cpu',
  },
  {
    id: 'rew-5',
    title: 'Starbucks Premium Coffee Box',
    description: 'Receive 5 prepaid grande coffee coupons sent straight to your email address.',
    category: 'food',
    cost: 250,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&h=250&q=80',
    iconName: 'Coffee',
  },
  {
    id: 'rew-6',
    title: 'Amazon E-Gift Card ($50)',
    description: 'Digital gift voucher redeemable for any product on the global store.',
    category: 'giftcards',
    cost: 500,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&w=400&h=250&q=80',
    iconName: 'CreditCard',
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, id: 'leader-1', name: 'Clara Oswald', xp: 5200, level: 6, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', department: 'Design' },
  { rank: 2, id: 'leader-2', name: 'Marcus Aurelius', xp: 4800, level: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', department: 'Engineering' },
  { rank: 3, id: 'leader-3', name: 'Manager Leader 01', xp: 4200, level: 5, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', department: 'Product' },
  { rank: 4, id: 'emp-1', name: 'Developer Engineer 01', xp: 3420, level: 4, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', department: 'Engineering' },
  { rank: 5, id: 'leader-5', name: 'Linus Torvalds', xp: 3100, level: 4, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', department: 'Infrastructure' },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: 'log-1', userName: 'Developer Engineer 01', action: 'completed task "Biometric Integration Boilerplate"', timestamp: '2 hours ago', type: 'task', value: '30 XP' },
  { id: 'log-2', userName: 'Clara Oswald', action: 'redeemed "Extra Paid Leave (1 Day)"', timestamp: '5 hours ago', type: 'reward', value: '1500 XP' },
  { id: 'log-3', userName: 'Marcus Aurelius', action: 'unlocked badge "Innovation Hero"', timestamp: '1 day ago', type: 'badge', value: 'Innovation Hero' },
  { id: 'log-4', userName: 'Developer Engineer 01', action: 'achieved a 5-day login streak', timestamp: '1 day ago', type: 'streak', value: '5 Days' }
];

export const mockProductivityStats = [
  { day: 'Mon', xp: 80, tasks: 3 },
  { day: 'Tue', xp: 120, tasks: 4 },
  { day: 'Wed', xp: 210, tasks: 5 },
  { day: 'Thu', xp: 140, tasks: 3 },
  { day: 'Fri', xp: 320, tasks: 6 },
  { day: 'Sat', xp: 50, tasks: 1 },
  { day: 'Sun', xp: 90, tasks: 2 },
];
