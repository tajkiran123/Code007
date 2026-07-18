"use client";

import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Users, Trophy, AlertTriangle, Search, Check, Upload, Plus, Gift, Sparkles,
  AlertCircle, CheckCircle2, MessageSquare, Calendar, User as UserIcon,
  TrendingUp, TrendingDown, DollarSign, Percent, Activity, FileText, Lock,
  RefreshCw
} from 'lucide-react';
import { User, Task, FinancialRecord, ExpenseBreakdown, FinancialSummary } from '../types';

interface ClientProject {
  id: string;
  clientName: string;
  projectName: string;
  dueDate: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'In Review';
}

export const MOCK_CLIENT_PROJECTS: ClientProject[] = [
  { id: '1', clientName: 'Aether Corp', projectName: 'Quantum Cryptography Portal', dueDate: '2026-08-12', status: 'Active' },
  { id: '2', clientName: 'Vortex Labs', projectName: 'AI Hologram Interface v2', dueDate: '2026-07-29', status: 'In Review' },
  { id: '3', clientName: 'Solaris Grid', projectName: 'Smart Energy Node Relay', dueDate: '2026-09-02', status: 'On Hold' },
  { id: '4', clientName: 'Apex Data', projectName: 'Defragmentation Daemon Suite', dueDate: '2026-07-20', status: 'Completed' },
  { id: '5', clientName: 'Spectra Net', projectName: 'Fiber Wave Routing API', dueDate: '2026-08-05', status: 'Active' }
];

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  attendanceRate: number;
  dailyStatus: ('present' | 'absent' | 'leave' | 'weekend')[];
}

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'EMP-084',
    employeeName: 'Developer Engineer 01',
    presentDays: 10,
    leaveDays: 0,
    absentDays: 0,
    attendanceRate: 100,
    dailyStatus: ['present', 'present', 'present', 'present', 'present', 'weekend', 'weekend', 'present', 'present', 'present', 'present', 'present', 'weekend', 'weekend']
  },
  {
    id: '2',
    employeeId: 'EMP-092',
    employeeName: 'Jordan Sparks',
    presentDays: 8,
    leaveDays: 1,
    absentDays: 1,
    attendanceRate: 80,
    dailyStatus: ['present', 'present', 'absent', 'present', 'present', 'weekend', 'weekend', 'present', 'present', 'leave', 'present', 'present', 'weekend', 'weekend']
  }
];

interface ManagerDashboardProps {
  currentUser: User;
  setAppState: (state: any) => void;
  managerTab: 'quests' | 'clients';
  setManagerTab: (tab: 'quests' | 'clients') => void;
  newTaskTitle: string;
  setNewTaskTitle: (val: string) => void;
  newTaskDesc: string;
  setNewTaskDesc: (val: string) => void;
  newTaskDifficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  setNewTaskDifficulty: (val: 'easy' | 'medium' | 'hard' | 'extreme') => void;
  newTaskAssignee: string;
  setNewTaskAssignee: (val: string) => void;
  handleAddTask: (e: React.FormEvent) => void;
  tasks: Task[];
  setTaskToApprove: (task: Task) => void;
  handleSoundClick: () => void;
  usersList?: User[];
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  currentUser,
  setAppState,
  managerTab,
  setManagerTab,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDesc,
  setNewTaskDesc,
  newTaskDifficulty,
  setNewTaskDifficulty,
  newTaskAssignee,
  setNewTaskAssignee,
  handleAddTask,
  tasks,
  setTaskToApprove,
  handleSoundClick,
  usersList = [],
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-20 flex flex-col gap-8 text-left">
      <div className="glass-panel p-8 rounded-2xl border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/40">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
            System Allocator: {currentUser.name}
            <span className="text-[9px] bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ml-3 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
              Manager node
            </span>
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-2">Review pipeline logs, allocate task difficulty weight nodes, and check burnout indexes.</p>
        </div>

        {currentUser.role === 'Admin' && (
          <div className="flex gap-4">
            <button 
              onClick={() => { setAppState('ceo_dashboard'); handleSoundClick(); }}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 border border-purple-500/30 hover:border-purple-500 text-[9px] font-mono tracking-widest uppercase text-purple-400 font-bold transition"
            >
              Switch to CEO View
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/5 gap-8 font-mono text-[10px] tracking-wider uppercase font-bold mb-2">
        <button
          onClick={() => { setManagerTab('quests'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            managerTab === 'quests' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>⚡ Quest Allocator</span>
        </button>
        <button
          onClick={() => { setManagerTab('clients'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            managerTab === 'clients' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>💼 Client Projects</span>
        </button>
      </div>

      {managerTab === 'quests' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Allocator Form */}
          <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono mb-6">Allocate Quest Ticket</h3>
            <form onSubmit={handleAddTask} className="space-y-5 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-2 font-bold uppercase tracking-widest text-[9px]">Quest Title</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. SQLite database cache fix"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 font-bold uppercase tracking-widest text-[9px]">Scope Description</label>
                <textarea 
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Specify deliverables..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-2 font-bold uppercase tracking-widest text-[9px]">Difficulty</label>
                  <select 
                    value={newTaskDifficulty} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTaskDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/5 text-white text-xs focus:outline-none"
                  >
                    <option value="easy">Easy (10 XP)</option>
                    <option value="medium">Medium (30 XP)</option>
                    <option value="hard">Hard (60 XP)</option>
                    <option value="extreme">Extreme (120 XP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-2 font-bold uppercase tracking-widest text-[9px]">Assignee</label>
                  <select 
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-[#00e5ff]/20 text-white text-xs focus:outline-none"
                  >
                    {usersList && usersList.filter(u => u.role?.toLowerCase() === 'employee' || u.role?.toLowerCase() === 'staff').length > 0 ? (
                      usersList.filter(u => u.role?.toLowerCase() === 'employee' || u.role?.toLowerCase() === 'staff').map(u => (
                        <option key={u.employeeId || u.id} value={u.employeeId || u.id}>
                          {u.name} ({u.employeeId || u.id})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="EMP-001">Developer Engineer 01 (EMP-001)</option>
                        <option value="EMP-002">Developer Engineer 02 (EMP-002)</option>
                        <option value="EMP-003">Developer Engineer 03 (EMP-003)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3.5 rounded-lg bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] cyber-bracket"
              >
                Deploy Quest Card
              </button>
            </form>
          </div>

          {/* Pipeline */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Verification Pipeline</h3>
                <span className="text-[8px] bg-yellow-400/10 text-yellow-400 font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-yellow-500/20">
                  {tasks.filter(t => t.status === 'in_review').length} Pending
                </span>
              </div>

              <div className="space-y-4">
                {tasks.filter(t => t.status === 'in_review').length === 0 ? (
                  <div className="py-16 text-center text-zinc-600 text-xs font-mono border border-dashed border-white/5 rounded-2xl">
                    Pipeline clear. No quests waiting verification logs.
                  </div>
                ) : (
                  tasks.filter(t => t.status === 'in_review').map((task) => (
                    <div key={task.id} className="p-5 rounded-xl bg-zinc-950/60 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition duration-300">
                      <div className="font-mono">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-zinc-400">
                            {task.difficulty} ({task.xp} XP)
                          </span>
                          <span className="text-[9px] text-zinc-500">From: {task.assignedToName}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 font-sans">{task.title}</h4>
                        <p className="text-[11px] text-zinc-500">{task.description}</p>
                      </div>
                      
                      <button 
                        onClick={() => { setTaskToApprove(task); handleSoundClick(); }}
                        className="px-4 py-2 rounded bg-emerald-500 text-black font-bold text-xs font-mono uppercase hover:bg-white transition"
                      >
                        Verify
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Burnout index */}
            <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">AI Exhaustion Indexes</h3>
                <AlertTriangle className="text-accent animate-pulse-glow" size={16} />
              </div>
              <p className="text-xs text-zinc-500 font-mono mb-6">Indices measured via frequency of commits, backlog size, and hours active.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {usersList
                  .filter(u => u.role?.toLowerCase() === 'employee')
                  .map(emp => {
                    const score = emp.burnoutScore || 15;
                    const statusText = score > 70 ? 'Danger' : score > 40 ? 'Warning' : 'Safe';
                    const colorClass = score > 70 ? 'text-red-500' : score > 40 ? 'text-yellow-450' : 'text-emerald-400';
                    const indicatorClass = score > 70 ? 'bg-red-500 animate-ping' : score > 40 ? 'bg-yellow-500' : 'bg-emerald-500';
                    return (
                      <div key={emp.employeeId || emp.id} className="p-5 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-white">{emp.name}</h4>
                          <p className={`text-[10px] ${colorClass} mt-1.5`}>Burnout: {score}% ({statusText})</p>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${indicatorClass}`} />
                      </div>
                    );
                  })
                }
                {usersList.filter(u => u.role?.toLowerCase() === 'employee').length === 0 && (
                  <div className="col-span-2 py-8 text-center text-zinc-600 text-xs font-mono">
                    No team members registry found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Client projects view */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8 w-full"
        >
          <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Client Operations Registry</h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono">Overview of current project milestones, client nodes, and delivery status logs.</p>
              </div>
            </div>

            <div className="overflow-x-auto w-full relative z-10">
              <table className="w-full border-collapse font-mono text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                    <th className="py-4 px-3">Client Name</th>
                    <th className="py-4 px-3">Project Title</th>
                    <th className="py-4 px-3">Target Due Date</th>
                    <th className="py-4 px-3 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-zinc-300">
                  {MOCK_CLIENT_PROJECTS.map((proj) => {
                    const statusColors = {
                      'Active': 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/20',
                      'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      'On Hold': 'bg-red-500/10 text-red-400 border-red-500/20',
                      'In Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    };
                    return (
                      <tr key={proj.id} className="hover:bg-white/[0.02] transition duration-200">
                        <td className="py-4 px-3 font-bold text-white font-sans">
                          {proj.clientName}
                        </td>
                        <td className="py-4 px-3 text-zinc-300 font-bold uppercase tracking-wider text-[10px]">
                          {proj.projectName}
                        </td>
                        <td className="py-4 px-3 text-zinc-500">
                          {proj.dueDate}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <span className={`inline-flex items-center gap-1.5 text-[8px] uppercase font-bold px-2.5 py-1 rounded border ${statusColors[proj.status] || ''}`}>
                            {proj.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface CeoDashboardProps {
  currentUser: User;
  setAppState: (state: any) => void;
  ceoTab: 'salaries' | 'clients' | 'attendance' | 'rewards' | 'issues' | 'analytics' | 'leaderboard';
  setCeoTab: (tab: 'salaries' | 'clients' | 'attendance' | 'rewards' | 'issues' | 'analytics' | 'leaderboard') => void;
  usersList: User[];
  employeeSearch: string;
  setEmployeeSearch: (val: string) => void;
  totalNodes: number;
  totalPayroll: number;
  avgBurnout: number;
  handleSoundClick: () => void;
  loadBackendData: () => void;
  triggerNotification: (text: string, type: any) => void;
  complaintsList: any[];
  setComplaintsList: React.Dispatch<React.SetStateAction<any[]>>;
  companyFinancials: FinancialRecord[];
  expenseBreakdown: ExpenseBreakdown;
  financialSummary: FinancialSummary;
  leaderboardList?: any[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const CeoDashboard: React.FC<CeoDashboardProps> = ({
  currentUser,
  setAppState,
  ceoTab,
  setCeoTab,
  usersList,
  employeeSearch,
  setEmployeeSearch,
  totalNodes,
  totalPayroll,
  avgBurnout,
  handleSoundClick,
  loadBackendData,
  triggerNotification,
  complaintsList,
  setComplaintsList,
  companyFinancials,
  expenseBreakdown,
  financialSummary,
  leaderboardList = [],
}) => {
  const [rewardTitle, setRewardTitle] = React.useState('');
  const [selectedManagerId, setSelectedManagerId] = React.useState<string | null>(null);
  const [rewardDesc, setRewardDesc] = React.useState('');
  const [rewardCost, setRewardCost] = React.useState('1000');
  const [rewardStock, setRewardStock] = React.useState('10');
  const [rewardCategory, setRewardCategory] = React.useState<'food' | 'electronics' | 'fashion' | 'accessories' | 'giftcards' | 'leaves'>('electronics');
  const [rewardImage, setRewardImage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [addStatus, setAddStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [timeframe, setTimeframe] = React.useState<'6m' | '12m'>('6m');
  const [hoveredDataPoint, setHoveredDataPoint] = React.useState<any | null>(null);
  const [hoveredChart, setHoveredChart] = React.useState<'profit' | 'expenses' | 'growth' | null>(null);
  const [isRefreshingIssues, setIsRefreshingIssues] = React.useState(false);

  const handleRefreshIssues = async () => {
    handleSoundClick();
    setIsRefreshingIssues(true);
    try {
      await loadBackendData();
      triggerNotification('Telemetry nodes synchronized', 'success');
    } catch (err) {
      triggerNotification('Telemetry nodes sync failed', 'error');
    } finally {
      setIsRefreshingIssues(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRewardImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSoundClick();
    if (!rewardTitle || !rewardDesc || !rewardCost || !rewardStock) {
      setAddStatus({ type: 'error', message: 'All telemetry metrics must be populated.' });
      return;
    }

    setIsSubmitting(true);
    setAddStatus(null);

    const payload = {
      title: rewardTitle,
      description: rewardDesc,
      cost: Number(rewardCost),
      stock: Number(rewardStock),
      category: rewardCategory,
      image: rewardImage || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400'
    };

    try {
      const res = await fetch(`${API_BASE}/rewards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setIsSubmitting(false);

      if (res.ok) {
        setAddStatus({ type: 'success', message: 'Reward successfully deployed to marketplace catalog!' });
        triggerNotification(`New Reward "${rewardTitle}" deployed!`, 'success');
        
        // Reset form
        setRewardTitle('');
        setRewardDesc('');
        setRewardCost('1000');
        setRewardStock('10');
        setRewardCategory('electronics');
        setRewardImage('');

        // Confetti!
        import('canvas-confetti').then((module) => {
          const confettiFn = module.default;
          confettiFn({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        });

        // Reload data
        loadBackendData();
      } else {
        const data = await res.json();
        setAddStatus({ type: 'error', message: data.error || 'Failed to submit reward node.' });
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      setAddStatus({ type: 'error', message: 'Server offline. Cannot register reward registry.' });
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    handleSoundClick();
    try {
      const res = await fetch(`${API_BASE}/ai/complaints/${complaintId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setComplaintsList(prev => prev.map(c => (c._id === complaintId || c.id === complaintId) ? { ...c, status: 'resolved' } : c));
        triggerNotification('Complaint ticket resolved successfully', 'success');
      } else {
        setComplaintsList(prev => prev.map(c => (c._id === complaintId || c.id === complaintId) ? { ...c, status: 'resolved' } : c));
        triggerNotification('Complaint resolved locally (offline)', 'success');
      }
    } catch {
      setComplaintsList(prev => prev.map(c => (c._id === complaintId || c.id === complaintId) ? { ...c, status: 'resolved' } : c));
      triggerNotification('Complaint resolved locally (offline)', 'success');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-20 flex flex-col gap-8 text-left">
      <div className="glass-panel p-8 rounded-2xl border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/40">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
            Executive Console: {currentUser.name}
            <span className="text-[9px] bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ml-3 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
              CEO node
            </span>
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-2">Oversee organizational compensation models, key client project statuses, and monthly check-in registry logs.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => { setAppState('employee_dashboard'); handleSoundClick(); }}
            className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-white text-[9px] font-mono tracking-widest uppercase text-zinc-300 font-bold transition"
          >
            Switch to Employee View
          </button>
          <button 
            onClick={() => { setAppState('manager_dashboard'); handleSoundClick(); }}
            className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-[#00e5ff]/25 hover:border-[#00e5ff] text-[9px] font-mono tracking-widest uppercase text-[#00e5ff] font-bold transition shadow-[0_0_10px_rgba(0,229,255,0.05)]"
          >
            Switch to Manager View
          </button>
        </div>
      </div>

      {/* CEO Navigation Tab Bar */}
      <div className="flex border-b border-white/5 gap-8 font-mono text-[10px] tracking-wider uppercase font-bold mb-2">
        <button
          onClick={() => { setCeoTab('salaries'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'salaries' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>👥 Staff Salaries</span>
        </button>
        <button
          onClick={() => { setCeoTab('clients'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'clients' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>💼 Client Projects</span>
        </button>
        <button
          onClick={() => { setCeoTab('attendance'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'attendance' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>📅 Monthly Attendance</span>
        </button>
        <button
          onClick={() => { setCeoTab('rewards'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'rewards' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>🎁 Store Rewards</span>
        </button>
        <button
          onClick={() => { setCeoTab('issues'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'issues' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>⚠️ Issues Log</span>
        </button>
        <button
          onClick={() => { setCeoTab('analytics'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'analytics' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>📈 Company Graphs</span>
        </button>
        <button
          onClick={() => { setCeoTab('leaderboard'); handleSoundClick(); }}
          className={`pb-3 border-b-2 transition relative flex items-center gap-2 ${
            ceoTab === 'leaderboard' ? 'border-[#00e5ff] text-[#00e5ff] font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>🏆 Leaderboard</span>
        </button>
      </div>

      {ceoTab === 'salaries' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8 w-full"
        >
          {/* Cyberpunk Stats Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl border-[#00e5ff]/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.02)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00e5ff]/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Secure Core Nodes</p>
                <h4 className="text-2xl font-black text-white mt-1">{totalNodes} Active</h4>
                <p className="text-[9px] text-zinc-500 mt-1 uppercase">MGRs: {usersList.filter(u => u.role === 'Manager').length} • EMPs: {usersList.filter(u => u.role === 'Employee').length}</p>
              </div>
              <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
                <Users size={16} />
              </span>
            </div>

            <div className="glass-panel p-6 rounded-xl border-[#00ff88]/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.02)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Payroll Telemetry</p>
                <h4 className="text-2xl font-black text-[#00ff88] mt-1">${totalPayroll.toLocaleString()}</h4>
              </div>
              <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
                <Trophy size={16} />
              </span>
            </div>

            <div className="glass-panel p-6 rounded-xl border-red-500/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.02)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">System Stress Factor</p>
                <h4 className="text-2xl font-black text-red-500 mt-1">{avgBurnout}% Index</h4>
              </div>
              <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-red-500/30 flex items-center justify-center text-red-500">
                <AlertTriangle size={16} className={avgBurnout > 40 ? "animate-bounce" : ""} />
              </span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Active Employees Directory</h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono">Telemetry database containing compensation rates, node settings, and status flags.</p>
              </div>
              
              {/* Search Input */}
              <div className="relative max-w-sm w-full font-mono text-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input 
                  type="text"
                  placeholder="Search nodes by name or dept..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition"
                />
              </div>
            </div>

            {/* Managers Selector Filters */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono border-b border-white/5 pb-4 relative z-10">
              <button 
                onClick={() => { setSelectedManagerId(null); handleSoundClick(); }}
                className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition duration-300 ${
                  selectedManagerId === null 
                    ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.15)]' 
                    : 'border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                All Nodes ({usersList.length})
              </button>
              {usersList.filter(u => u.role === 'Manager').map(mgr => (
                <button
                  key={mgr.employeeId || mgr.id}
                  onClick={() => { setSelectedManagerId(mgr.employeeId); handleSoundClick(); }}
                  className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition duration-300 ${
                    selectedManagerId === mgr.employeeId 
                      ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                      : 'border-white/5 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mgr.name} Team ({usersList.filter(u => u.managerId === mgr.employeeId).length})
                </button>
              ))}
            </div>

            <div className="overflow-x-auto w-full relative z-10">
              <table className="w-full border-collapse font-mono text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-zinc-500">
                    <th className="py-4 px-3 font-semibold">Node Name</th>
                    <th className="py-4 px-3 font-semibold">Employee ID</th>
                    <th className="py-4 px-3 font-semibold">Title / Role</th>
                    <th className="py-4 px-3 font-semibold">Department</th>
                    <th className="py-4 px-3 font-semibold">XP Rank</th>
                    <th className="py-4 px-3 font-semibold">Annual Salary</th>
                    <th className="py-4 px-3 font-semibold">AI Exhaustion</th>
                    <th className="py-4 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-zinc-300">
                  {usersList
                    .filter(u => {
                      const query = employeeSearch.toLowerCase();
                      const matchesSearch = u.name.toLowerCase().includes(query) || u.department.toLowerCase().includes(query);
                      if (!matchesSearch) return false;
                      if (selectedManagerId) {
                        return u.managerId === selectedManagerId;
                      }
                      return true;
                    })
                    .sort((a, b) => (a.department || '').localeCompare(b.department || ''))
                    .map((emp) => {
                      const burnout = emp.burnoutScore || 15;
                      const burnoutColor = burnout < 30 ? 'text-emerald-400 font-bold' : burnout < 65 ? 'text-yellow-400 font-bold' : 'text-red-500 font-bold';
                      
                      return (
                        <tr 
                          key={emp.id} 
                          onClick={() => {
                            if (emp.role === 'Manager' || emp.role === 'manager') {
                              setSelectedManagerId(emp.employeeId || emp.id);
                              handleSoundClick();
                            }
                          }}
                          className={`hover:bg-white/[0.02] transition duration-200 group ${
                            (emp.role === 'Manager' || emp.role === 'manager') ? 'cursor-pointer border-l-2 border-purple-500' : ''
                          }`}
                        >
                          <td className="py-4 px-3 flex items-center gap-3">
                            <div className="relative">
                              <img src={emp.avatar} className="w-9 h-9 rounded-full object-cover border border-[#00e5ff]/35 shadow-[0_0_8px_rgba(0,229,255,0.15)] group-hover:scale-105 transition" alt="" />
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-zinc-950 ${emp.status === 'on_leave' ? 'bg-yellow-500' : 'bg-[#00ff88] animate-pulse'}`} />
                            </div>
                            <div>
                              <p className="font-bold text-white font-sans group-hover:text-[#00e5ff] transition flex items-center gap-1.5">
                                {emp.name}
                                {(emp.role === 'Manager' || emp.role === 'manager') && (
                                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/35 uppercase">MGR Node</span>
                                )}
                              </p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{emp.email}</p>
                              {emp.role?.toLowerCase() === 'employee' && (
                                <p className="text-[9px] text-[#00e5ff]/70 mt-1.5 font-mono">Streak: {emp.streak || 0}d • Tasks: {emp.completedTasksCount || 0} completed</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-3 font-bold text-zinc-400">
                            {emp.employeeId || `EMP-0${Math.floor(10 + Math.random() * 90)}`}
                          </td>
                          <td className="py-4 px-3 uppercase text-[10px] text-zinc-400 font-bold">
                            {emp.role}
                          </td>
                          <td className="py-4 px-3 text-zinc-500">
                            {emp.department}
                          </td>
                          <td className="py-4 px-3">
                            <span className="text-[#00e5ff] font-bold">LVL {emp.level}</span>
                            <span className="text-[9px] text-zinc-500 ml-1.5">({emp.xp} XP)</span>
                            {emp.role?.toLowerCase() === 'employee' && (
                              <p className="text-[9px] text-zinc-500 mt-1 font-mono">Attendance: {emp.attendance || 95}%</p>
                            )}
                          </td>
                          <td className="py-4 px-3">
                            <div className="px-3 py-1 rounded-md bg-[#00ff88]/5 border border-[#00ff88]/20 font-bold font-mono text-[#00ff88] text-[10px] tracking-wide shadow-[0_0_10px_rgba(0,255,136,0.05)] flex items-center justify-center gap-1.5 w-fit">
                              <span>{emp.salary || '$115,000'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
                                  const threshold = step * 10;
                                  const isActive = burnout >= threshold;
                                  const activeColor = burnout < 30 ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]' : burnout < 65 ? 'bg-yellow-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]';
                                  return (
                                    <div 
                                      key={step} 
                                      className={`w-1.5 h-3 rounded-sm transition-all duration-300 ${
                                        isActive ? `${activeColor}` : 'bg-zinc-950 border border-white/5'
                                      }`} 
                                    />
                                  );
                                })}
                              </div>
                              <span className={`text-[10px] ${burnoutColor}`}>{burnout}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-right">
                            <span className={`inline-flex items-center gap-1.5 text-[8px] uppercase font-bold px-2.5 py-1.5 rounded border ${
                              emp.status === 'on_leave' 
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                                : 'bg-emerald-500/10 text-[#00ff88] border-[#00ff88]/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'on_leave' ? 'bg-yellow-500' : 'bg-[#00ff88]'}`} />
                              {emp.status === 'on_leave' ? 'Leave' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {ceoTab === 'clients' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8 w-full"
        >
          <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Client Operations Registry</h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono">Overview of current project milestones, client nodes, and delivery status logs.</p>
              </div>
            </div>

            <div className="overflow-x-auto w-full relative z-10">
              <table className="w-full border-collapse font-mono text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                    <th className="py-4 px-3 font-semibold">Client Name</th>
                    <th className="py-4 px-3 font-semibold">Project Title</th>
                    <th className="py-4 px-3 font-semibold">Target Due Date</th>
                    <th className="py-4 px-3 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-zinc-300">
                  {MOCK_CLIENT_PROJECTS.map((proj) => {
                    const statusColors = {
                      'Active': 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/20',
                      'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                      'On Hold': 'bg-red-500/10 text-red-400 border-red-500/20',
                      'In Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    };
                    return (
                      <tr key={proj.id} className="hover:bg-white/[0.02] transition duration-200">
                        <td className="py-4 px-3 font-bold text-white font-sans">
                          {proj.clientName}
                        </td>
                        <td className="py-4 px-3 text-zinc-300 font-bold uppercase tracking-wider text-[10px]">
                          {proj.projectName}
                        </td>
                        <td className="py-4 px-3 text-zinc-500">
                          {proj.dueDate}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <span className={`inline-flex items-center gap-1.5 text-[8px] uppercase font-bold px-2.5 py-1 rounded border ${statusColors[proj.status] || ''}`}>
                            {proj.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {ceoTab === 'attendance' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8 w-full"
        >
          <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Monthly Attendance Registry</h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono">Consolidated operational check-in indices and daily telemetry status cards.</p>
              </div>
            </div>

            <div className="overflow-x-auto w-full relative z-10">
              <table className="w-full border-collapse font-mono text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                    <th className="py-4 px-3">Employee</th>
                    <th className="py-4 px-3 text-center">Present</th>
                    <th className="py-4 px-3 text-center">On Leave</th>
                    <th className="py-4 px-3 text-center">Absent</th>
                    <th className="py-4 px-3 text-center font-semibold">Rate</th>
                    <th className="py-4 px-3 text-right font-bold">14-Day Check-in Telemetry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-zinc-300">
                  {MOCK_ATTENDANCE.map((att) => (
                    <tr key={att.id} className="hover:bg-white/[0.02] transition duration-200">
                      <td className="py-4 px-3">
                        <p className="font-bold text-white font-sans">{att.employeeName}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{att.employeeId}</p>
                      </td>
                      <td className="py-4 px-3 text-center text-emerald-400 font-bold">{att.presentDays}d</td>
                      <td className="py-4 px-3 text-center text-yellow-500 font-bold">{att.leaveDays}d</td>
                      <td className="py-4 px-3 text-center text-red-500 font-bold">{att.absentDays}d</td>
                      <td className="py-4 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold text-[10px]">
                          {att.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="flex gap-1 justify-end">
                          {att.dailyStatus.map((status, index) => {
                            const tooltipText = `Day ${index + 1}: ${status.toUpperCase()}`;
                            let bgClass = 'bg-zinc-950 border border-white/5';
                            if (status === 'present') bgClass = 'bg-[#00ff88] shadow-[0_0_6px_rgba(0,255,136,0.3)]';
                            else if (status === 'leave') bgClass = 'bg-yellow-500 shadow-[0_0_6px_rgba(245,158,11,0.3)]';
                            else if (status === 'absent') bgClass = 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.3)]';
                            else if (status === 'weekend') bgClass = 'bg-zinc-800/80';
                            
                            return (
                              <div
                                key={index}
                                className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-110 cursor-pointer ${bgClass}`}
                                title={tooltipText}
                              />
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {ceoTab === 'rewards' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8 w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
              
              <div className="border-b border-white/5 pb-4 relative z-10">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
                  <Gift className="text-[#00e5ff]" size={16} /> Register New Reward Node
                </h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono">Inject new physical or digital redemption assets into the employee marketplace registry.</p>
              </div>

              {addStatus && (
                <div className={`p-4 rounded-lg border font-mono text-xs relative z-10 ${
                  addStatus.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {addStatus.message}
                </div>
              )}

              <form onSubmit={handleCreateReward} className="space-y-6 font-mono text-xs relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Reward Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mechanical Keyboard"
                      value={rewardTitle}
                      onChange={(e) => setRewardTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 focus:border-[#00e5ff] focus:outline-none transition duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Category</label>
                    <select
                      value={rewardCategory}
                      onChange={(e) => setRewardCategory(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white focus:border-[#00e5ff] focus:outline-none transition duration-300"
                    >
                      <option value="electronics">Electronics (Hardware/Gadgets)</option>
                      <option value="leaves">Leaves (Time Off/Paid Leave)</option>
                      <option value="food">Food & Beverages (Coffee/Snacks)</option>
                      <option value="fashion">Fashion & Apparel (Hoodies/Caps)</option>
                      <option value="accessories">Accessories (Workstation Gear)</option>
                      <option value="giftcards">Gift Cards & Vouchers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">XP Cost Requirement</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="e.g. 1500"
                      value={rewardCost}
                      onChange={(e) => setRewardCost(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 focus:border-[#00e5ff] focus:outline-none transition duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Stock Inventory</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="e.g. 15"
                      value={rewardStock}
                      onChange={(e) => setRewardStock(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 focus:border-[#00e5ff] focus:outline-none transition duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Item Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Provide a compelling description detailing item features, terms, and delivery timeline."
                    value={rewardDesc}
                    onChange={(e) => setRewardDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 focus:border-[#00e5ff] focus:outline-none transition duration-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Reward Image / Photo</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload Zone */}
                    <div className="border-2 border-dashed border-white/5 hover:border-[#00e5ff]/35 rounded-xl p-6 transition flex flex-col items-center justify-center gap-2 cursor-pointer bg-zinc-950/40 relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="text-zinc-500" size={24} />
                      <span className="text-[10px] text-zinc-400 text-center">Click or Drag Image to Upload Base64</span>
                    </div>

                    {/* Image URL fallback */}
                    <div className="flex flex-col justify-center">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-[9px]">URL:</span>
                        <input 
                          type="text" 
                          placeholder="Or paste direct image link..."
                          value={rewardImage}
                          onChange={(e) => setRewardImage(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 focus:border-[#00e5ff] focus:outline-none transition duration-300"
                        />
                      </div>
                      <span className="text-[9px] text-zinc-600 mt-2">Supports high-res Unsplash links or localized base64 telemetry streams.</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-lg bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center justify-center gap-2 cyber-bracket"
                >
                  {isSubmitting ? (
                    'Transmitting Node Registry...'
                  ) : (
                    <>
                      <Plus size={14} /> Deploy Reward to Store
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="flex flex-col gap-6">
              <div className="glass-panel p-6 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col justify-between h-fit relative">
                <div className="absolute top-3 right-3 text-[7px] bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] px-2 py-0.5 rounded font-mono uppercase font-bold tracking-widest">
                  Live Preview
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono mb-4">Marketplace Preview card</h4>

                <div className="rounded-xl overflow-hidden bg-zinc-950 border border-white/5 shadow-lg group transition duration-300 hover:border-white/15">
                  <div className="h-44 relative bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {rewardImage ? (
                      <img src={rewardImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-600 font-mono text-[10px] select-none">
                        <Gift size={32} strokeWidth={1} />
                        <span>No asset loaded</span>
                      </div>
                    )}
                    
                    <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-bold text-white font-mono shadow">
                      {rewardCost} XP
                    </div>

                    <div className="absolute bottom-3 left-3 bg-[#00e5ff]/90 border border-[#00e5ff] text-black font-mono font-bold text-[8px] uppercase px-2 py-0.5 rounded shadow tracking-wider">
                      {rewardCategory.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between gap-4">
                    <div className="text-left font-mono">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5 font-sans leading-snug">
                        {rewardTitle || 'FUTURISTIC REWARD PRODUCT'}
                      </h4>
                      <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">
                        {rewardDesc || 'This card demonstrates the live reactive rendering layout of store products inside user marketplace portals.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="text-left font-mono">
                        <p className="text-[8px] text-zinc-500 font-semibold uppercase tracking-wider">Inventory</p>
                        <p className="text-[10px] text-emerald-400 font-bold">{rewardStock} units</p>
                      </div>
                      <button 
                        disabled
                        className="px-4 py-2 rounded bg-zinc-900 border border-white/5 text-zinc-500 font-bold text-[9px] uppercase cursor-not-allowed"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative tips */}
              <div className="glass-panel p-6 rounded-2xl border-[#00e5ff]/20 bg-zinc-950/40 text-left font-mono text-xs flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00e5ff]/5 rounded-full blur-xl" />
                <h4 className="font-bold text-white flex items-center gap-1.5"><Sparkles className="text-[#00e5ff]" size={12} /> System Guidelines</h4>
                <ul className="space-y-2 text-[10px] text-zinc-400 leading-relaxed list-disc list-inside">
                  <li>Physical rewards will automatically transmit notifications to dispatch coordinates.</li>
                  <li>Leaves category injections will increment the applicant's skip tokens counts immediately.</li>
                  <li>Base64 streams are securely indexed and decoded on-demand inside the web view cache.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Redemption History / Audit logs */}
          <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl mt-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
                  <span>📋 Employee Redemptions Audit Log</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1 font-mono">Live ledger tracks which employee claimed which award, cost deductions, and current shipment status.</p>
              </div>
            </div>

            <div className="overflow-x-auto w-full relative z-10">
              <table className="w-full border-collapse font-mono text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                    <th className="py-4 px-3">Employee Name</th>
                    <th className="py-4 px-3">Reward Item</th>
                    <th className="py-4 px-3 text-center">XP Cost</th>
                    <th className="py-4 px-3 text-center">Claim Date</th>
                    <th className="py-4 px-3 text-right">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-zinc-300">
                  {[
                    { id: 'red-1', userName: 'Developer Engineer 01', userEmail: 'employee1@workquest.ai', rewardTitle: 'Mechanical Keyboard', cost: 1200, date: '2026-07-15 10:24 AM', status: 'Delivered' },
                    { id: 'red-2', userName: 'Developer Engineer 02', userEmail: 'employee2@workquest.ai', rewardTitle: 'Coffee Voucher', cost: 300, date: '2026-07-16 09:12 AM', status: 'Delivered' },
                    { id: 'red-3', userName: 'Developer Engineer 03', userEmail: 'employee3@workquest.ai', rewardTitle: 'Steam Gift Card ($50)', cost: 1000, date: '2026-07-16 11:45 AM', status: 'Shipped' },
                    { id: 'red-4', userName: 'Developer Engineer 01', userEmail: 'employee1@workquest.ai', rewardTitle: 'Extra Leave Day', cost: 2000, date: '2026-07-16 02:30 PM', status: 'Processing' },
                  ].map((claim) => {
                    const statusColors: Record<string, string> = {
                      'Processing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                      'Shipped': 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/20',
                      'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    };
                    return (
                      <tr key={claim.id} className="hover:bg-white/[0.02] transition duration-200">
                        <td className="py-4 px-3">
                          <p className="font-bold text-white font-sans">{claim.userName}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{claim.userEmail}</p>
                        </td>
                        <td className="py-4 px-3 text-zinc-300 font-bold uppercase tracking-wider text-[10px]">
                          {claim.rewardTitle}
                        </td>
                        <td className="py-4 px-3 text-center text-[#00e5ff] font-bold">
                          -{claim.cost} XP
                        </td>
                        <td className="py-4 px-3 text-center text-zinc-500">
                          {claim.date}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <span className={`inline-flex items-center gap-1.5 text-[8px] uppercase font-bold px-2.5 py-1 rounded border ${statusColors[claim.status] || ''}`}>
                            {claim.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {ceoTab === 'issues' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col gap-8 text-left"
        >
          {/* Header Panel */}
          <div className="glass-panel p-8 rounded-2xl border-[#00e5ff]/20 bg-zinc-950/40 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#00e5ff] font-mono flex items-center gap-2">
                <AlertCircle size={16} className="text-[#00e5ff]" />
                CEO Issues & Complaints Audit Feed
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-2 leading-relaxed">
                Direct system logs and complaints filed by workspace agents through chatbot coach nodes. Audit and resolve blocks to maintain team velocity.
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-zinc-500 uppercase">TELEMETRY LINK STATUS</span>
                <span className="text-[#00e5ff] font-bold">ONLINE // ENCRYPTED</span>
              </div>
              <button
                onClick={handleRefreshIssues}
                disabled={isRefreshingIssues}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white hover:border-[#00e5ff]/50 transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <RefreshCw 
                  size={12} 
                  className={`text-[#00e5ff] ${isRefreshingIssues ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} 
                />
                <span className="text-[9px] uppercase tracking-widest font-black">Sync Feed</span>
              </button>
            </div>
          </div>

          {/* Complaints Feed List */}
          {complaintsList.length === 0 ? (
            <div className="glass-panel py-16 px-6 text-center rounded-2xl border-emerald-500/10 bg-zinc-950/20 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <CheckCircle2 size={24} />
              </div>
              <div className="font-mono">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Pending Issues Logged</h4>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  All workspace terminals are active and reporting zero operational blocks. Keep chatbot channels listening.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaintsList.map((complaint, index) => {
                const cId = complaint._id || complaint.id;
                const formattedId = `COMP-${String(cId).slice(-4).toUpperCase() || (index + 1001)}`;
                const isResolved = complaint.status === 'resolved';
                
                return (
                  <div 
                    key={cId}
                    className={`glass-panel p-6 rounded-2xl border-white/5 bg-zinc-950/30 flex flex-col justify-between gap-5 relative overflow-hidden transition duration-300 ${
                      isResolved ? 'hover:border-emerald-500/15' : 'hover:border-[#00e5ff]/20'
                    }`}
                  >
                    {/* Glowing side line indicators */}
                    <div className={`absolute top-0 left-0 w-[3px] h-full ${isResolved ? 'bg-emerald-500/50' : 'bg-amber-500/50'}`} />

                    <div>
                      {/* Ticket Header Metadata */}
                      <div className="flex justify-between items-center pb-3.5 border-b border-white/5">
                        <div className="flex flex-col gap-1 text-left font-mono">
                          <span className="text-[11px] font-bold text-white tracking-wider">{formattedId}</span>
                          <span className="text-[8px] text-zinc-500 uppercase flex items-center gap-1">
                            <UserIcon size={9} /> {complaint.userName || 'Unknown Agent'}
                          </span>
                        </div>
                        <div className="text-right font-mono flex flex-col items-end gap-1">
                          <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                            isResolved 
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                          }`}>
                            {complaint.status || 'pending'}
                          </span>
                          <span className="text-[7px] text-zinc-600 uppercase flex items-center gap-0.5">
                            <Calendar size={8} /> {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Today'}
                          </span>
                        </div>
                      </div>

                      {/* Complaint description body */}
                      <div className="pt-4 text-left font-mono text-[11px] text-zinc-300 leading-relaxed flex gap-2">
                        <MessageSquare size={13} className="text-[#00e5ff] shrink-0 mt-0.5" />
                        <p>{complaint.text}</p>
                      </div>
                    </div>

                    {/* Action Button: Mark Resolved */}
                    <div className="pt-4 border-t border-white/5 flex justify-end">
                      {isResolved ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold">
                          <Check size={12} /> Resolved & Archived
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleResolveComplaint(cId)}
                          className="px-4 py-2 rounded-lg bg-[#00e5ff] hover:bg-white text-black font-bold font-mono text-[9px] uppercase tracking-widest transition duration-300 shadow-[0_0_12px_rgba(0,229,255,0.15)] cursor-pointer"
                        >
                          Resolve Alert
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {ceoTab === 'analytics' && (() => {
        const filteredData = (companyFinancials && companyFinancials.length > 0 ? companyFinancials : []).slice(timeframe === '6m' ? -6 : -12);
        
        const chartWidth = 500;
        const chartHeight = 220;
        const padLeft = 60;
        const padRight = 20;
        const padTop = 20;
        const padBottom = 40;
        const usableWidth = chartWidth - padLeft - padRight;
        const usableHeight = chartHeight - padTop - padBottom;

        const maxRevenue = Math.max(...filteredData.map(d => d.revenue || 0), 100000);
        const maxClients = Math.max(...filteredData.map(d => d.clients || 0), 30);
        const maxGrowth = Math.max(...filteredData.map(d => Math.abs(d.growth || 0)), 10);

        const revPoints = filteredData.map((d, idx) => {
          const x = padLeft + (idx * usableWidth) / (filteredData.length - 1);
          const y = padTop + usableHeight - ((d.revenue || 0) / maxRevenue) * usableHeight;
          return { x, y, data: d };
        });

        const profitPoints = filteredData.map((d, idx) => {
          const x = padLeft + (idx * usableWidth) / (filteredData.length - 1);
          const y = padTop + usableHeight - ((d.profit || 0) / maxRevenue) * usableHeight;
          return { x, y, data: d };
        });

        const getLinePath = (points: { x: number; y: number }[]) => {
          if (points.length === 0) return '';
          return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        };

        const getAreaPath = (points: { x: number; y: number }[]) => {
          if (points.length === 0) return '';
          const linePath = getLinePath(points);
          const bottomY = padTop + usableHeight;
          return `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
        };

        return (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col gap-8 text-left"
          >
            {/* Cyberpunk Financial Stats Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-xl border-[#00e5ff]/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.02)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00e5ff]/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Total Revenue (YTD)</p>
                  <h4 className="text-xl font-black text-white mt-1">${financialSummary?.totalRevenueYTD?.toLocaleString() || '1,790,000'}</h4>
                  <p className="text-[9px] text-[#00e5ff] flex items-center gap-1 mt-1 font-bold">
                    <TrendingUp size={10} /> +12.4% MoM
                  </p>
                </div>
                <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff]">
                  <DollarSign size={16} />
                </span>
              </div>

              <div className="glass-panel p-6 rounded-xl border-red-500/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.02)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Operating Expenses (YTD)</p>
                  <h4 className="text-xl font-black text-white mt-1">${financialSummary?.totalExpensesYTD?.toLocaleString() || '1,323,000'}</h4>
                  <p className="text-[9px] text-red-400 flex items-center gap-1 mt-1 font-bold">
                    <TrendingUp size={10} /> +3.2% MoM
                  </p>
                </div>
                <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-red-500/30 flex items-center justify-center text-red-500">
                  <TrendingDown size={16} />
                </span>
              </div>

              <div className="glass-panel p-6 rounded-xl border-[#00ff88]/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.02)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Net Profit (YTD)</p>
                  <h4 className="text-xl font-black text-[#00ff88] mt-1">${financialSummary?.totalProfitYTD?.toLocaleString() || '467,000'}</h4>
                  <p className="text-[9px] text-[#00ff88] flex items-center gap-1 mt-1 font-bold">
                    <TrendingUp size={10} /> +23.6% MoM
                  </p>
                </div>
                <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
                  <Trophy size={16} />
                </span>
              </div>

              <div className="glass-panel p-6 rounded-xl border-amber-500/20 bg-zinc-950/50 flex items-center justify-between font-mono relative overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.02)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Growth Velocity Index</p>
                  <h4 className="text-xl font-black text-white mt-1">{financialSummary?.averageGrowth || '4.8'}% avg</h4>
                  <p className="text-[9px] text-amber-400 flex items-center gap-1 mt-1 font-bold">
                    <Activity size={10} /> +8.1% vs last Q
                  </p>
                </div>
                <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Percent size={16} />
                </span>
              </div>
            </div>

            {/* Header Controls */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 bg-zinc-950/40 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#00e5ff] font-mono flex items-center gap-2">
                  <Activity size={16} className="text-[#00e5ff]" />
                  Company Financial Telemetry console
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-2 leading-relaxed">
                  Visualizing company profit margins, operational overhead distributions, and client growth velocity metrics.
                </p>
              </div>
              
              <div className="flex bg-zinc-905 border border-white/5 p-1 rounded-lg self-end sm:self-auto font-mono text-[9px] uppercase tracking-wider font-bold">
                <button 
                  onClick={() => { setTimeframe('6m'); handleSoundClick(); }}
                  className={`px-3 py-1.5 rounded-md transition ${timeframe === '6m' ? 'bg-[#00e5ff] text-black font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  6 Month Log
                </button>
                <button 
                  onClick={() => { setTimeframe('12m'); handleSoundClick(); }}
                  className={`px-3 py-1.5 rounded-md transition ${timeframe === '12m' ? 'bg-[#00e5ff] text-black font-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  12 Month Log
                </button>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              
              {/* Chart 1: Profit & Revenue */}
              <div className="glass-panel p-6 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-4 relative overflow-hidden shadow-xl">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Profit vs Revenue Telemetry</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Area overview of monthly revenues and retained profits (USD)</p>
                </div>

                <div className="relative w-full h-[220px] bg-zinc-950/30 rounded-xl border border-white/[0.02] flex items-center justify-center p-2">
                  <svg viewBox="0 0 500 220" className="w-full h-full">
                    <defs>
                      <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="profit-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00ff88" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#00ff88" stopOpacity={0.0} />
                      </linearGradient>
                      <filter id="glow-rev" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map(i => {
                      const y = 20 + (i * 160) / 4;
                      return (
                        <line 
                          key={i} 
                          x1="60" 
                          y1={y} 
                          x2="480" 
                          y2={y} 
                          stroke="white" 
                          strokeOpacity={0.03} 
                          strokeDasharray="2 2" 
                        />
                      );
                    })}

                    {/* X Axis Grid Lines */}
                    {filteredData.map((d, idx) => {
                      const x = 60 + (idx * 420) / (filteredData.length - 1);
                      return (
                        <line 
                          key={idx} 
                          x1={x} 
                          y1="20" 
                          x2={x} 
                          y2="180" 
                          stroke="white" 
                          strokeOpacity={0.03} 
                          strokeDasharray="2 2" 
                        />
                      );
                    })}

                    {/* Revenue Area & Line */}
                    <path 
                      d={getAreaPath(revPoints)} 
                      fill="url(#rev-grad)" 
                    />
                    <path 
                      d={getLinePath(revPoints)} 
                      fill="none" 
                      stroke="#00e5ff" 
                      strokeWidth={2} 
                      filter="url(#glow-rev)"
                    />

                    {/* Profit Area & Line */}
                    <path 
                      d={getAreaPath(profitPoints)} 
                      fill="url(#profit-grad)" 
                    />
                    <path 
                      d={getLinePath(profitPoints)} 
                      fill="none" 
                      stroke="#00ff88" 
                      strokeWidth={2} 
                      filter="url(#glow-rev)"
                    />

                    {/* Interactive Nodes */}
                    {revPoints.map((p, idx) => (
                      <g key={idx}>
                        {/* Revenue point */}
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r={hoveredDataPoint?.month === p.data.month && hoveredChart === 'profit' ? 6 : 3} 
                          fill="#00e5ff" 
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => {
                            setHoveredDataPoint(p.data);
                            setHoveredChart('profit');
                          }}
                          onMouseLeave={() => {
                            setHoveredDataPoint(null);
                            setHoveredChart(null);
                          }}
                        />
                        {/* Profit point */}
                        <circle 
                          cx={profitPoints[idx].x} 
                          cy={profitPoints[idx].y} 
                          r={hoveredDataPoint?.month === p.data.month && hoveredChart === 'profit' ? 6 : 3} 
                          fill="#00ff88" 
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => {
                            setHoveredDataPoint(p.data);
                            setHoveredChart('profit');
                          }}
                          onMouseLeave={() => {
                            setHoveredDataPoint(null);
                            setHoveredChart(null);
                          }}
                        />
                      </g>
                    ))}

                    {/* Axes labels */}
                    {/* Y Axis labels */}
                    {[0, 1, 2, 3, 4].map(i => {
                      const y = 24 + (i * 160) / 4;
                      const val = Math.round(maxRevenue - (i * maxRevenue) / 4);
                      return (
                        <text 
                          key={i} 
                          x="50" 
                          y={y} 
                          fill="#52525b" 
                          fontSize="7" 
                          fontFamily="monospace" 
                          textAnchor="end"
                        >
                          ${Math.round(val / 1000)}k
                        </text>
                      );
                    })}

                    {/* X Axis Labels */}
                    {filteredData.map((d, idx) => {
                      const x = 60 + (idx * 420) / (filteredData.length - 1);
                      return (
                        <text 
                          key={idx} 
                          x={x} 
                          y="195" 
                          fill="#52525b" 
                          fontSize="7" 
                          fontFamily="monospace" 
                          textAnchor="middle"
                        >
                          {d.month}
                        </text>
                      );
                    })}
                  </svg>

                  {/* Custom Tooltip */}
                  {hoveredDataPoint && hoveredChart === 'profit' && (
                    <div className="absolute top-3 right-3 glass-panel p-3 rounded-lg border-[#00e5ff]/20 bg-zinc-950/95 font-mono text-[9px] flex flex-col gap-1 shadow-2xl z-30 pointer-events-none w-40 text-left">
                      <p className="text-white font-bold border-b border-white/5 pb-1 uppercase">{hoveredDataPoint.month} audit</p>
                      <p className="text-[#00e5ff] flex justify-between"><span>Revenue:</span> <span>${hoveredDataPoint.revenue?.toLocaleString()}</span></p>
                      <p className="text-red-400 flex justify-between"><span>Expenses:</span> <span>${hoveredDataPoint.expenses?.toLocaleString()}</span></p>
                      <p className="text-[#00ff88] flex justify-between font-bold"><span>Net Profit:</span> <span>${hoveredDataPoint.profit?.toLocaleString()}</span></p>
                      <p className="text-zinc-500 flex justify-between border-t border-white/5 pt-1"><span>Margin:</span> <span>{Math.round((hoveredDataPoint.profit / hoveredDataPoint.revenue) * 100)}%</span></p>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex gap-4 font-mono text-[8px] uppercase tracking-wider font-bold">
                  <span className="flex items-center gap-1.5 text-[#00e5ff]"><span className="w-2.5 h-1 bg-[#00e5ff] rounded" /> Revenue</span>
                  <span className="flex items-center gap-1.5 text-[#00ff88]"><span className="w-2.5 h-1 bg-[#00ff88] rounded" /> Net Profit</span>
                </div>
              </div>

              {/* Chart 2: Expenses Breakdown */}
              <div className="glass-panel p-6 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-4 relative overflow-hidden shadow-xl">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Operating Expenses Composition</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Stacked telemetry of salaries, infrastructure, and marketing overhead</p>
                </div>

                <div className="relative w-full h-[220px] bg-zinc-950/30 rounded-xl border border-white/[0.02] flex items-center justify-center p-2">
                  <svg viewBox="0 0 500 220" className="w-full h-full">
                    {/* Grid Lines */}
                    {[0, 1, 2, 3, 4].map(i => {
                      const y = 20 + (i * 160) / 4;
                      return (
                        <line 
                          key={i} 
                          x1="60" 
                          y1={y} 
                          x2="480" 
                          y2={y} 
                          stroke="white" 
                          strokeOpacity={0.03} 
                          strokeDasharray="2 2" 
                        />
                      );
                    })}

                    {/* Draw Stacked Bars */}
                    {filteredData.map((d, idx) => {
                      const xCenter = 60 + (idx * 420) / (filteredData.length - 1);
                      const barWidth = timeframe === '6m' ? 18 : 10;
                      
                      const salariesVal = d.breakdown?.salaries || 78000;
                      const infraVal = d.breakdown?.infrastructure || 15000;
                      const marketingVal = d.breakdown?.marketing || 12000;
                      const softwareVal = d.breakdown?.software || 8000;
                      const miscVal = d.breakdown?.misc || 5000;

                      const total = salariesVal + infraVal + marketingVal + softwareVal + miscVal;
                      const scaleFactor = 160 / maxRevenue;

                      const salH = salariesVal * scaleFactor;
                      const infH = infraVal * scaleFactor;
                      const marH = marketingVal * scaleFactor;
                      const softH = softwareVal * scaleFactor;
                      const misH = miscVal * scaleFactor;

                      const ySal = 180 - salH;
                      const yInf = ySal - infH;
                      const yMar = yInf - marH;
                      const ySoft = yMar - softH;
                      const yMis = ySoft - misH;

                      return (
                        <g 
                          key={idx}
                          className="cursor-pointer"
                          onMouseEnter={() => {
                            setHoveredDataPoint(d);
                            setHoveredChart('expenses');
                          }}
                          onMouseLeave={() => {
                            setHoveredDataPoint(null);
                            setHoveredChart(null);
                          }}
                        >
                          {/* Salaries */}
                          <rect x={xCenter - barWidth/2} y={ySal} width={barWidth} height={salH} fill="#00ff88" fillOpacity={0.75} rx={1} />
                          {/* Infra */}
                          <rect x={xCenter - barWidth/2} y={yInf} width={barWidth} height={infH} fill="#8b5cf6" fillOpacity={0.75} rx={1} />
                          {/* Marketing */}
                          <rect x={xCenter - barWidth/2} y={yMar} width={barWidth} height={marH} fill="#f59e0b" fillOpacity={0.75} rx={1} />
                          {/* Software */}
                          <rect x={xCenter - barWidth/2} y={ySoft} width={barWidth} height={softH} fill="#00e5ff" fillOpacity={0.75} rx={1} />
                          {/* Misc */}
                          <rect x={xCenter - barWidth/2} y={yMis} width={barWidth} height={misH} fill="#ef4444" fillOpacity={0.75} rx={1} />
                        </g>
                      );
                    })}

                    {/* Y Axis labels */}
                    {[0, 1, 2, 3, 4].map(i => {
                      const y = 24 + (i * 160) / 4;
                      const val = Math.round(maxRevenue - (i * maxRevenue) / 4);
                      return (
                        <text 
                          key={i} 
                          x="50" 
                          y={y} 
                          fill="#52525b" 
                          fontSize="7" 
                          fontFamily="monospace" 
                          textAnchor="end"
                        >
                          ${Math.round(val / 1000)}k
                        </text>
                      );
                    })}

                    {/* X Axis Labels */}
                    {filteredData.map((d, idx) => {
                      const x = 60 + (idx * 420) / (filteredData.length - 1);
                      return (
                        <text 
                          key={idx} 
                          x={x} 
                          y="195" 
                          fill="#52525b" 
                          fontSize="7" 
                          fontFamily="monospace" 
                          textAnchor="middle"
                        >
                          {d.month}
                        </text>
                      );
                    })}
                  </svg>

                  {/* Custom Tooltip */}
                  {hoveredDataPoint && hoveredChart === 'expenses' && (
                    <div className="absolute top-3 right-3 glass-panel p-3 rounded-lg border-[#00e5ff]/20 bg-zinc-950/95 font-mono text-[9px] flex flex-col gap-1 shadow-2xl z-30 pointer-events-none w-48 text-left">
                      <p className="text-white font-bold border-b border-white/5 pb-1 uppercase">{hoveredDataPoint.month} cost breakdown</p>
                      <p className="text-[#00ff88] flex justify-between"><span>Salaries:</span> <span>${hoveredDataPoint.breakdown?.salaries?.toLocaleString() || '82,000'}</span></p>
                      <p className="text-purple-400 flex justify-between"><span>Infrastructure:</span> <span>${hoveredDataPoint.breakdown?.infrastructure?.toLocaleString() || '21,000'}</span></p>
                      <p className="text-amber-400 flex justify-between"><span>Marketing:</span> <span>${hoveredDataPoint.breakdown?.marketing?.toLocaleString() || '15,000'}</span></p>
                      <p className="text-[#00e5ff] flex justify-between"><span>SaaS/Software:</span> <span>${hoveredDataPoint.breakdown?.software?.toLocaleString() || '9,000'}</span></p>
                      <p className="text-red-400 flex justify-between"><span>Operations/Misc:</span> <span>${hoveredDataPoint.breakdown?.misc?.toLocaleString() || '5,000'}</span></p>
                      <p className="text-white flex justify-between border-t border-white/5 pt-1 font-bold"><span>Total Expenses:</span> <span>${hoveredDataPoint.expenses?.toLocaleString()}</span></p>
                    </div>
                  )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[8px] uppercase tracking-wider font-bold">
                  <span className="flex items-center gap-1.5 text-[#00ff88]"><span className="w-2.5 h-2.5 bg-[#00ff88] rounded" /> Salaries</span>
                  <span className="flex items-center gap-1.5 text-purple-400"><span className="w-2.5 h-2.5 bg-[#8b5cf6] rounded" /> Cloud/Infra</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 bg-[#f59e0b] rounded" /> Marketing</span>
                  <span className="flex items-center gap-1.5 text-[#00e5ff]"><span className="w-2.5 h-2.5 bg-[#00e5ff] rounded" /> SaaS/Software</span>
                </div>
              </div>

            </div>

            {/* Chart 3: Company Growth & Clients */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-4 relative overflow-hidden shadow-xl lg:col-span-2">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Company Growth Velocity & Client Node Index</h4>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Dual-axis overview tracking monthly client integrations against month-over-month revenue growth percentage</p>
              </div>

              <div className="relative w-full h-[220px] bg-zinc-950/30 rounded-xl border border-white/[0.02] flex items-center justify-center p-2">
                <svg viewBox="0 0 1000 220" className="w-full h-full">
                  <defs>
                    <linearGradient id="client-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map(i => {
                    const y = 20 + (i * 160) / 4;
                    return (
                      <line 
                        key={i} 
                        x1="60" 
                        y1={y} 
                        x2="940" 
                        y2={y} 
                        stroke="white" 
                        strokeOpacity={0.03} 
                        strokeDasharray="2 2" 
                      />
                    );
                  })}

                  {/* Draw Client Nodes Area */}
                  <path 
                    d={getAreaPath(filteredData.map((d, idx) => {
                      const x = 60 + (idx * 880) / (filteredData.length - 1);
                      const y = 20 + 160 - ((d.clients || 0) / maxClients) * 160;
                      return { x, y };
                    }))} 
                    fill="url(#client-grad)" 
                  />
                  <path 
                    d={getLinePath(filteredData.map((d, idx) => {
                      const x = 60 + (idx * 880) / (filteredData.length - 1);
                      const y = 20 + 160 - ((d.clients || 0) / maxClients) * 160;
                      return { x, y };
                    }))} 
                    fill="none" 
                    stroke="#00e5ff" 
                    strokeWidth={2} 
                  />

                  {/* Draw Growth Rate Line */}
                  <path 
                    d={getLinePath(filteredData.map((d, idx) => {
                      const x = 60 + (idx * 880) / (filteredData.length - 1);
                      const y = 20 + 160 - ((d.growth || 0) / maxGrowth) * 160;
                      return { x, y };
                    }))} 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    strokeDasharray="3 3" 
                  />

                  {/* Interactive Nodes */}
                  {filteredData.map((d, idx) => {
                    const x = 60 + (idx * 880) / (filteredData.length - 1);
                    const yClient = 20 + 160 - ((d.clients || 0) / maxClients) * 160;
                    const yGrowth = 20 + 160 - ((d.growth || 0) / maxGrowth) * 160;
                    
                    return (
                      <g key={idx}>
                        <circle 
                          cx={x} 
                          cy={yClient} 
                          r={hoveredDataPoint?.month === d.month && hoveredChart === 'growth' ? 5 : 2.5} 
                          fill="#00e5ff" 
                          className="cursor-pointer"
                          onMouseEnter={() => {
                            setHoveredDataPoint(d);
                            setHoveredChart('growth');
                          }}
                          onMouseLeave={() => {
                            setHoveredDataPoint(null);
                            setHoveredChart(null);
                          }}
                        />
                        <circle 
                          cx={x} 
                          cy={yGrowth} 
                          r={hoveredDataPoint?.month === d.month && hoveredChart === 'growth' ? 5 : 2.5} 
                          fill="#f59e0b" 
                          className="cursor-pointer"
                          onMouseEnter={() => {
                            setHoveredDataPoint(d);
                            setHoveredChart('growth');
                          }}
                          onMouseLeave={() => {
                            setHoveredDataPoint(null);
                            setHoveredChart(null);
                          }}
                        />
                      </g>
                    );
                  })}

                  {/* Left Y-Axis labels (Clients) */}
                  {[0, 1, 2, 3, 4].map(i => {
                    const y = 24 + (i * 160) / 4;
                    const val = Math.round(maxClients - (i * maxClients) / 4);
                    return (
                      <text 
                        key={i} 
                        x="50" 
                        y={y} 
                        fill="#52525b" 
                        fontSize="7" 
                        fontFamily="monospace" 
                        textAnchor="end"
                      >
                        {val} Nodes
                      </text>
                    );
                  })}

                  {/* Right Y-Axis labels (Growth) */}
                  {[0, 1, 2, 3, 4].map(i => {
                    const y = 24 + (i * 160) / 4;
                    const val = (maxGrowth - (i * maxGrowth) / 4).toFixed(1);
                    return (
                      <text 
                        key={i} 
                        x="950" 
                        y={y} 
                        fill="#52525b" 
                        fontSize="7" 
                        fontFamily="monospace" 
                        textAnchor="start"
                      >
                        +{val}%
                      </text>
                    );
                  })}

                  {/* X Axis Labels */}
                  {filteredData.map((d, idx) => {
                    const x = 60 + (idx * 880) / (filteredData.length - 1);
                    return (
                      <text 
                        key={idx} 
                        x={x} 
                        y="195" 
                        fill="#52525b" 
                        fontSize="7" 
                        fontFamily="monospace" 
                        textAnchor="middle"
                      >
                        {d.month}
                      </text>
                    );
                  })}
                </svg>

                {/* Custom Tooltip */}
                {hoveredDataPoint && hoveredChart === 'growth' && (
                  <div className="absolute top-3 right-3 glass-panel p-3 rounded-lg border-[#00e5ff]/20 bg-zinc-950/95 font-mono text-[9px] flex flex-col gap-1 shadow-2xl z-30 pointer-events-none w-48 text-left">
                    <p className="text-white font-bold border-b border-white/5 pb-1 uppercase">{hoveredDataPoint.month} scale stats</p>
                    <p className="text-[#00e5ff] flex justify-between"><span>Active Clients:</span> <span>{hoveredDataPoint.clients} Nodes</span></p>
                    <p className="text-amber-400 flex justify-between font-bold"><span>MoM Revenue Growth:</span> <span>+{hoveredDataPoint.growth}%</span></p>
                    <p className="text-zinc-500 flex justify-between border-t border-white/5 pt-1"><span>Net Profit Yield:</span> <span>${hoveredDataPoint.profit?.toLocaleString()}</span></p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex gap-4 font-mono text-[8px] uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1.5 text-[#00e5ff]"><span className="w-2.5 h-1 bg-[#00e5ff] rounded" /> Active Client Nodes</span>
                <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-1.5 border-t border-dashed border-[#f59e0b]" /> Revenue Growth (%)</span>
              </div>
            </div>

            {/* Expense Distribution Details & Executive Report Action */}
            <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left flex flex-col gap-6 relative overflow-hidden shadow-2xl lg:col-span-2">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-6 relative z-10">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Corporate Cost Distribution Audit</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">Current distribution of expenses across operational departments.</p>
                </div>
                
                <button 
                  onClick={() => {
                    confetti({
                      particleCount: 150,
                      spread: 80,
                      origin: { y: 0.6 },
                      colors: ['#00e5ff', '#00ff88', '#8b5cf6', '#f59e0b']
                    });
                    triggerNotification('Executive Financial Audit Report compiled & encrypted successfully.', 'success');
                    handleSoundClick();
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#00e5ff] hover:bg-white text-black font-black font-mono text-[9px] tracking-widest uppercase transition shadow-[0_0_15px_rgba(0,229,255,0.15)] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <FileText size={12} /> Compile Audit Report
                </button>
              </div>

              {/* Progress bars list representing breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 font-mono text-xs">
                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Departmental Shares</h4>
                  
                  {/* Salaries */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#00ff88] rounded-full" /> Salaries & Payroll</span>
                      <span className="text-white font-bold">${expenseBreakdown?.salaries?.toLocaleString() || '82,000'} ({Math.round(( (expenseBreakdown?.salaries || 82000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00ff88]" style={{ width: `${((expenseBreakdown?.salaries || 82000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100}%` }} />
                    </div>
                  </div>

                  {/* Cloud/Infra */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#8b5cf6] rounded-full" /> Cloud & Bare-metal Infrastructure</span>
                      <span className="text-white font-bold">${expenseBreakdown?.infrastructure?.toLocaleString() || '21,000'} ({Math.round(((expenseBreakdown?.infrastructure || 21000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8b5cf6]" style={{ width: `${((expenseBreakdown?.infrastructure || 21000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100}%` }} />
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#f59e0b] rounded-full" /> Growth & Marketing Telemetry</span>
                      <span className="text-white font-bold">${expenseBreakdown?.marketing?.toLocaleString() || '15,000'} ({Math.round(((expenseBreakdown?.marketing || 15000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f59e0b]" style={{ width: `${((expenseBreakdown?.marketing || 15000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100}%` }} />
                    </div>
                  </div>

                  {/* Software SaaS */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#00e5ff] rounded-full" /> SaaS & Software Licences</span>
                      <span className="text-white font-bold">${expenseBreakdown?.software?.toLocaleString() || '9,000'} ({Math.round(((expenseBreakdown?.software || 9000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00e5ff]" style={{ width: `${((expenseBreakdown?.software || 9000) / ((expenseBreakdown?.salaries || 82000) + (expenseBreakdown?.infrastructure || 21000) + (expenseBreakdown?.marketing || 15000) + (expenseBreakdown?.software || 9000) + (expenseBreakdown?.misc || 5000))) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Retained Profit Margin Summary</h4>
                    <div className="p-4 rounded-xl border border-[#00ff88]/10 bg-[#00ff88]/[0.01] flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Annual Margin Index</p>
                        <h4 className="text-2xl font-black text-[#00ff88] mt-1">
                          {financialSummary?.totalRevenueYTD ? Math.round((financialSummary.totalProfitYTD / financialSummary.totalRevenueYTD) * 100) : 26}%
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold">MoM Yield</p>
                        <span className="text-[9px] font-bold text-white bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 mt-1 justify-end">
                          <TrendingUp size={9} /> STABLE
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-[10px] text-zinc-500 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <p className="font-bold text-zinc-400 uppercase text-[9px] tracking-wider mb-1 flex items-center gap-1.5 text-[#00e5ff]">
                      <Lock size={10} /> Cryptographic Telemetry Node
                    </p>
                    All financial indicators are computed on-chain and hashed locally. The system stress factor is verified automatically before compounding ledger updates.
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        );
      })()}

      {/* Leaderboard Tab */}
      {ceoTab === 'leaderboard' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 w-full max-w-4xl mx-auto"
        >
          <div className="glass-panel p-8 rounded-2xl border-[#00e5ff]/25 bg-zinc-950/40">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">🏆 Leaderboard Standings</h3>
                <p className="text-[11px] text-zinc-500 font-mono mt-1">Real-time organizational performance ranking by computed telemetry XP weight.</p>
              </div>
              <Trophy className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" size={20} />
            </div>

            <div className="space-y-4">
              {leaderboardList.map((lead: any, index: number) => (
                <div 
                  key={lead.id || index} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition duration-300 ${
                    lead.role === 'admin' || lead.role === 'Admin'
                      ? 'bg-purple-500/10 border-purple-500/30' 
                      : 'bg-zinc-950/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono font-bold w-6 ${
                      index === 0 ? 'text-[#00e5ff]' : index === 1 ? 'text-purple-400' : 'text-zinc-500'
                    }`}>
                      #0{index + 1}
                    </span>
                    <img 
                      src={lead.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-800" 
                      alt="" 
                    />
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        {lead.name}
                        {(lead.role === 'admin' || lead.role === 'Admin') && (
                          <span className="text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded uppercase font-mono font-bold">CEO</span>
                        )}
                      </p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">{lead.department || 'Engineering'}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <p className="text-sm font-bold text-white">{lead.xp} XP</p>
                    <p className="text-[9px] text-zinc-500 mt-0.5">LVL {lead.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};
