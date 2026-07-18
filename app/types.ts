export type Role = 'employee' | 'manager' | 'admin' | 'Employee' | 'Manager' | 'Admin';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed';
export type RewardCategory = 'food' | 'electronics' | 'fashion' | 'accessories' | 'giftcards' | 'leaves';
export type NotificationType = 'xp' | 'badge' | 'reward' | 'info' | 'streak';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[]; // Badge IDs
  department: string;
  joinedAt: string;
  employeeId?: string;
  managerId?: string;
  themeColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  skipsLeft?: number;
  streakFreezeActive?: boolean;
  salary?: string;
  location?: string;
  phone?: string;
  burnoutScore?: number;
  completedTasksCount?: number;
  pendingTasksCount?: number;
  commitsCount?: number;
  status?: string;
  attendance?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  xp: number;
  dueDate: string;
  status: TaskStatus;
  assignedTo: string; // User ID
  assignedToName: string;
  assignedBy: string; // Manager ID
  completionTime?: string;
  qualityScore?: number;
  feedback?: string;
  commentsCount: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: RewardCategory;
  cost: number;
  stock: number;
  image: string;
  iconName: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  department: string;
  employeeId?: string;
}

export interface ActivityLog {
  id: string;
  userName: string;
  action: string;
  timestamp: string;
  type: 'task' | 'reward' | 'badge' | 'streak';
  value?: string;
}

export interface ClientProject {
  id: string;
  clientName: string;
  projectName: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'In Review';
  dueDate: string;
}

export interface EmployeeAttendance {
  id: string;
  employeeName: string;
  employeeId: string;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  attendanceRate: number;
  dailyStatus: ('present' | 'leave' | 'absent' | 'weekend')[];
}

export interface FinancialRecord {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  clients: number;
  breakdown: {
    salaries: number;
    infrastructure: number;
    marketing: number;
    software: number;
    misc: number;
  };
}

export interface ExpenseBreakdown {
  salaries: number;
  infrastructure: number;
  marketing: number;
  software: number;
  misc: number;
}

export interface FinancialSummary {
  totalRevenueYTD: number;
  totalExpensesYTD: number;
  totalProfitYTD: number;
  averageGrowth: number;
  currentClients: number;
}
