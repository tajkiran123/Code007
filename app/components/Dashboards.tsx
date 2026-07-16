"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Trophy, AlertTriangle, Search, Zap, Check, Upload, Plus, Gift, Sparkles,
  AlertCircle, CheckCircle2, MessageSquare, Calendar, User as UserIcon
} from 'lucide-react';
import { User, Task } from '../types';

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
                    <option value="emp-1">Developer Engineer 01</option>
                    <option value="emp-2">Jordan Sparks</option>
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
                <div className="p-5 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Developer Engineer 01</h4>
                    <p className="text-[10px] text-emerald-400 mt-1.5">Burnout: 14% (Safe)</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>

                <div className="p-5 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Jordan Sparks</h4>
                    <p className="text-[10px] text-red-500 mt-1.5">Burnout: 78% (Warning)</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                </div>
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
  ceoTab: 'salaries' | 'clients' | 'attendance' | 'rewards' | 'issues';
  setCeoTab: (tab: 'salaries' | 'clients' | 'attendance' | 'rewards' | 'issues') => void;
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
}) => {
  const [rewardTitle, setRewardTitle] = React.useState('');
  const [rewardDesc, setRewardDesc] = React.useState('');
  const [rewardCost, setRewardCost] = React.useState('1000');
  const [rewardStock, setRewardStock] = React.useState('10');
  const [rewardCategory, setRewardCategory] = React.useState<'food' | 'electronics' | 'fashion' | 'accessories' | 'giftcards' | 'leaves'>('electronics');
  const [rewardImage, setRewardImage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [addStatus, setAddStatus] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
                      return u.name.toLowerCase().includes(query) || u.department.toLowerCase().includes(query);
                    })
                    .sort((a, b) => (a.department || '').localeCompare(b.department || ''))
                    .map((emp) => {
                      const burnout = emp.burnoutScore || 15;
                      const burnoutColor = burnout < 30 ? 'text-emerald-400 font-bold' : burnout < 65 ? 'text-yellow-400 font-bold' : 'text-red-500 font-bold';
                      
                      return (
                        <tr key={emp.id} className="hover:bg-white/[0.02] transition duration-200 group">
                          <td className="py-4 px-3 flex items-center gap-3">
                            <div className="relative">
                              <img src={emp.avatar} className="w-9 h-9 rounded-full object-cover border border-[#00e5ff]/35 shadow-[0_0_8px_rgba(0,229,255,0.15)] group-hover:scale-105 transition" alt="" />
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-zinc-950 ${emp.status === 'on_leave' ? 'bg-yellow-500' : 'bg-[#00ff88] animate-pulse'}`} />
                            </div>
                            <div>
                              <p className="font-bold text-white font-sans group-hover:text-[#00e5ff] transition">{emp.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{emp.email}</p>
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
            <div className="flex flex-col text-right font-mono text-[10px]">
              <span className="text-zinc-500 uppercase">TELEMETRY LINK STATUS</span>
              <span className="text-[#00e5ff] font-bold">ONLINE // ENCRYPTED</span>
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
    </div>
  );
};
