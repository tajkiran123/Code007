"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Award, Trophy, ShoppingBag, Cpu, Lightbulb, User as UserIcon, 
  ChevronRight, Sparkles, CheckCircle2, Play, Plus, Clock, Users, 
  Trash2, ShieldCheck, TrendingUp, Moon, Sun, ArrowRight, Zap, 
  ChevronDown, Search, ArrowUpRight, Check, Send, AlertTriangle, 
  PieChart, MessageSquare, LogOut, Code, RefreshCw, Layers,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sfx } from './audio';
import { 
  mockUsers, mockBadges, mockTasks, mockRewards, 
  mockLeaderboard as initialLeaderboard, 
  mockActivityLogs as initialActivityLogs, 
  mockProductivityStats as initialProductivityStats,
  levelNames, difficultyXp 
} from './mockData';
import { User, Task, Reward, Badge, LeaderboardEntry } from './types';

// WebGL Canvas & Magnetic Interaction Components
import ThreeCanvas from './components/ThreeCanvas';
import Magnet from './components/Magnet';

// ===================================================
// DYNAMIC 3D MOUSE-TILT & SPOTLIGHT GLOW CARD WRAPPER
// ===================================================
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: x * 11, y: -y * 11 });
    setMousePos({ x: e.clientX - left, y: e.clientY - top });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(8px)`,
        transformStyle: "preserve-3d",
      }}
      className={`transition-transform duration-200 ease-out relative overflow-hidden ${className}`}
    >
      {/* Spotlight Cursor radial glow (Awwwards design touch) */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
            left: `${mousePos.x - 120}px`,
            top: `${mousePos.y - 120}px`,
            pointerEvents: 'none',
            zIndex: 10
          }}
          className="transition-opacity duration-300"
        />
      )}
      <div style={{ transform: "translateZ(18px)" }} className="h-full">
        {children}
      </div>
    </div>
  );
};

// ===================================================
// FLAT SCROLL 3D COMPATIBLE BOX
// ===================================================
const Scroll3DContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full select-none">
      {children}
    </div>
  );
};

const API_BASE = 'http://localhost:5000/api';

export default function Home() {
  // Theme & State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appState, setAppState] = useState<'landing' | 'login' | 'employee_dashboard' | 'manager_dashboard'>('landing');

  // Authenticated User
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Task & Board State
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('emp-1');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [mockComments, setMockComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    'task-1': [
      { author: 'Manager Leader 01', text: 'Ensure test harness metrics compile successfully on iOS sandbox.', time: '1h ago' },
    ]
  });

  // Rewards State
  const [rewardList, setRewardList] = useState<Reward[]>(mockRewards);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rewardSuccess, setRewardSuccess] = useState<string | null>(null);

  // AI Chat Bot
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([
    { sender: 'ai', text: 'System Online. WorkQuest AI Coach tracking. Current efficiency coefficient is optimal. Ready to allocate new tasks to claim bonus multipliers?', timestamp: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Dynamic API states to replace imports
  const [mockLeaderboard, setMockLeaderboard] = useState<any[]>(initialLeaderboard);
  const [mockActivityLogs, setMockActivityLogs] = useState<any[]>(initialActivityLogs);
  const [mockProductivityStats, setMockProductivityStats] = useState<any[]>(initialProductivityStats);
  const [burnoutReport, setBurnoutReport] = useState<any[]>([]);

  // Manager Approval State
  const [taskToApprove, setTaskToApprove] = useState<Task | null>(null);
  const [managerQualityScore, setManagerQualityScore] = useState(9);
  const [managerFeedback, setManagerFeedback] = useState('Outstanding deployment. Commendable velocity!');

  // Toast / System Notifications State
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'xp' | 'badge' | 'reward' | 'success'; amount?: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load telemetry data from MongoDB backend
  const loadBackendData = async () => {
    try {
      // 1. Fetch tasks
      const tasksRes = await fetch(`${API_BASE}/tasks`);
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.map((t: any) => ({
          ...t,
          id: t._id || t.id,
          status: t.status.toLowerCase()
        })));
      }

      // 2. Fetch rewards
      const rewardsRes = await fetch(`${API_BASE}/rewards`);
      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewardList(data.map((r: any) => ({
          ...r,
          id: r._id || r.id
        })));
      }

      // 3. Fetch leaderboard
      const leadRes = await fetch(`${API_BASE}/users/leaderboard`);
      if (leadRes.ok) {
        const data = await leadRes.json();
        setMockLeaderboard(data.map((u: any) => ({
          ...u,
          id: u._id || u.id
        })));
      }

      // 4. Fetch productivity velocity stats
      const velRes = await fetch(`${API_BASE}/analytics/velocity`);
      if (velRes.ok) {
        const data = await velRes.json();
        setMockProductivityStats(data);
      }

      // 5. Fetch burnout report
      const burnRes = await fetch(`${API_BASE}/analytics/burnout`);
      if (burnRes.ok) {
        const data = await burnRes.json();
        setBurnoutReport(data);
      }
    } catch (err) {
      console.warn("WorkQuest API server offline. Using local telemetry state.", err);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, [appState]);

  // Track dynamic mouse offset coordinates for sci-fi HUD display
  const [hudCoords, setHudCoords] = useState({ x: 104.2, y: -24.9, z: 0.05 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Trigger HUD Notification
  const triggerNotification = (text: string, type: 'xp' | 'badge' | 'reward' | 'success', amount?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, text, type, amount }]);
    
    if (soundEnabled) {
      if (type === 'xp') sfx.playXpGain();
      else if (type === 'badge') sfx.playLevelUp();
      else if (type === 'reward') sfx.playRedeem();
      else sfx.playClick();
    }

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const handleSoundClick = () => {
    if (soundEnabled) sfx.playClick();
  };

  // Centralized scroll reveal IntersectionObserver for 3D Tilt-Reveal
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      const elements = document.querySelectorAll('.tilt-reveal');
      elements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target); // Trigger only once
          }
        });
      },
      {
        threshold: 0.15, // Trigger at 15% visibility
      }
    );

    const elements = document.querySelectorAll('.tilt-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [appState]);

  // Track scroll coordinates and mouse coordinates for HUD cockpit readout
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = window.scrollY / maxScroll;
      setScrollProgress(progress);
      setHudCoords(prev => ({ ...prev, z: Number((0.05 + progress * 0.9).toFixed(3)) }));
    };
    window.addEventListener('scroll', handleScroll);

    const handleMouseMove = (e: MouseEvent) => {
      setHudCoords(prev => ({
        ...prev,
        x: Number((e.clientX / 10).toFixed(1)),
        y: Number((e.clientY / 10).toFixed(1))
      }));
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle smooth scroll navigation, switching state to landing if necessary
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    handleSoundClick();
    if (appState !== 'landing') {
      setAppState('landing');
      window.location.hash = targetId;
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      window.location.hash = targetId;
    }
  };

  // Scroll to hash when transition back to landing page completes
  useEffect(() => {
    if (appState === 'landing' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const timer = setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [appState]);

  // Auth Handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSoundClick();
    if (!authEmail) return;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: 'Password123!' })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('workquest_token', data.token);
        setCurrentUser(data.user);
        
        if (data.user.role === 'Manager' || data.user.role === 'Admin') {
          setAppState('manager_dashboard');
          triggerNotification("Secured administrator level access token", "success");
        } else {
          setAppState('employee_dashboard');
          triggerNotification("Logged in to workspace session", "success");
          if (soundEnabled) sfx.playStreakFire();
        }
        loadBackendData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Authentication failed.");
      }
    } catch (err) {
      console.warn("Express server offline. Loading mock user account.", err);
      if (authEmail.includes('manager') || authEmail.includes('sarah')) {
        setCurrentUser(mockUsers[1]);
        setAppState('manager_dashboard');
        triggerNotification("Secured administrator level access token (offline)", "success");
      } else {
        setCurrentUser(mockUsers[0]);
        setAppState('employee_dashboard');
        triggerNotification("Logged in (offline)", "success");
        if (soundEnabled) sfx.playStreakFire();
      }
    }
  };

  const handleSsoLogin = (provider: 'google' | 'microsoft') => {
    handleSoundClick();
    triggerNotification(`Authenticated token via ${provider === 'google' ? 'Google' : 'Microsoft'} SSO`, 'success');
    setCurrentUser(mockUsers[0]);
    setAppState('employee_dashboard');
  };

  // Task Assignment
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSoundClick();
    if (!newTaskTitle) return;

    const targetXp = difficultyXp[newTaskDifficulty] || 30;
    const taskPayload = {
      title: newTaskTitle,
      description: newTaskDesc,
      difficulty: newTaskDifficulty,
      xp: targetXp,
      assignedTo: newTaskAssignee,
      assignedToName: newTaskAssignee === 'emp-1' ? 'Developer Engineer 01' : 'Jordan Sparks',
      assignedBy: currentUser.employeeId || currentUser.id
    };

    try {
      const res = await fetch(`${API_BASE}/tasks/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload)
      });
      if (res.ok) {
        const createdTask = await res.json();
        setTasks((prev) => [{ ...createdTask, id: createdTask._id || createdTask.id, status: createdTask.status.toLowerCase() }, ...prev]);
        setNewTaskTitle('');
        setNewTaskDesc('');
        triggerNotification(`Assigned sprint ticket to ${createdTask.assignedToName}`, 'success');
        loadBackendData();
      } else {
        // Fallback
        const createdTask: Task = {
          id: `task-${Date.now()}`,
          title: newTaskTitle,
          description: newTaskDesc,
          difficulty: newTaskDifficulty,
          xp: targetXp,
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          status: 'todo',
          assignedTo: newTaskAssignee,
          assignedToName: newTaskAssignee === 'emp-1' ? 'Developer Engineer 01' : 'Jordan Sparks',
          assignedBy: currentUser.id,
          commentsCount: 0
        };
        setTasks((prev) => [createdTask, ...prev]);
        setNewTaskTitle('');
        setNewTaskDesc('');
        triggerNotification(`Assigned sprint ticket (offline)`, 'success');
      }
    } catch {
      // Fallback
      const createdTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDesc,
        difficulty: newTaskDifficulty,
        xp: targetXp,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        status: 'todo',
        assignedTo: newTaskAssignee,
        assignedToName: newTaskAssignee === 'emp-1' ? 'Developer Engineer 01' : 'Jordan Sparks',
        assignedBy: currentUser.id,
        commentsCount: 0
      };
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskTitle('');
      setNewTaskDesc('');
      triggerNotification(`Assigned sprint ticket (offline)`, 'success');
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'in_review' | 'completed') => {
    handleSoundClick();
    
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...updatedTask, id: updatedTask._id || updatedTask.id, status: updatedTask.status.toLowerCase() } : t))
        );
        if (newStatus === 'in_review') {
          triggerNotification("Quest dispatched to verification pipeline", "success");
        }
      } else {
        setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch {
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  // Manager Approval Logic
  const handleApproveTask = async () => {
    if (!taskToApprove) return;
    handleSoundClick();

    try {
      const res = await fetch(`${API_BASE}/tasks/${taskToApprove.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualityScore: managerQualityScore, feedback: managerFeedback })
      });
      
      if (res.ok) {
        const result = await res.json();
        const updatedTask = result.task;
        
        setTasks((prev) =>
          prev.map((t) => (t.id === taskToApprove.id ? { ...updatedTask, id: updatedTask._id || updatedTask.id, status: updatedTask.status.toLowerCase() } : t))
        );

        triggerNotification(`Verified! +${taskToApprove.xp} XP registered`, 'xp', `+${taskToApprove.xp}`);
        loadBackendData();
      } else {
        const earnedXp = taskToApprove.xp;
        setTasks((prev) =>
          prev.map((t) => (t.id === taskToApprove.id ? { ...t, status: 'completed', qualityScore: managerQualityScore, feedback: managerFeedback } : t))
        );
        triggerNotification(`Verified! +${earnedXp} XP registered (offline)`, 'xp', `+${earnedXp}`);
      }
    } catch {
      const earnedXp = taskToApprove.xp;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskToApprove.id ? { ...t, status: 'completed', qualityScore: managerQualityScore, feedback: managerFeedback } : t))
      );
      triggerNotification(`Verified! +${earnedXp} XP registered (offline)`, 'xp', `+${earnedXp}`);
    }

    setTaskToApprove(null);
  };

  // Redeem Rewards Store
  const handleRedeemReward = async (reward: Reward) => {
    handleSoundClick();
    if (currentUser.xp < reward.cost) {
      alert("Insufficient XP balance. Complete pending Kanban tickets to earn additional metrics.");
      return;
    }

    if (reward.stock <= 0) {
      alert("Item stock exhausted. Please wait for inventory reload.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/rewards/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: reward.id, userId: currentUser.id, userCurrentXp: currentUser.xp })
      });
      if (res.ok) {
        const result = await res.json();
        
        // Update user state XP
        setCurrentUser(prev => ({ ...prev, xp: result.remainingXp }));
        setRewardList((prev) =>
          prev.map((r) => (r.id === reward.id ? { ...r, stock: result.stockLeft } : r))
        );

        setRewardSuccess(reward.title);
        triggerNotification(`Redemption finalized: ${reward.title}`, 'reward', `-${reward.cost} XP`);
        
        confetti({
          particleCount: 130,
          spread: 75,
          colors: ['#00e5ff', '#7c3aed']
        });
      } else {
        alert("Redemption failed on server check.");
      }
    } catch {
      // Fallback
      currentUser.xp -= reward.cost;
      setRewardList((prev) => prev.map((r) => r.id === reward.id ? { ...r, stock: r.stock - 1 } : r));
      setRewardSuccess(reward.title);
      triggerNotification(`Redemption finalized: ${reward.title} (offline)`, 'reward', `-${reward.cost} XP`);
    }
  };

  // AI Chat Bot Reply Logic
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    handleSoundClick();
    
    const userMsg = { sender: 'user' as const, text: chatInput, timestamp: 'Just now' };
    setChatMessages((prev) => [...prev, userMsg]);
    const inputMsg = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMsg, userId: currentUser.id })
      });
      setIsTyping(false);
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { sender: 'ai', text: data.reply, timestamp: 'Just now' }]);
        if (soundEnabled) sfx.playXpGain();
      } else {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: "Calculations indicate offline fallback. Please check Gemini API network connections.", timestamp: 'Just now' }]);
      }
    } catch {
      setIsTyping(false);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: "Calculations indicate offline fallback. Please check Gemini API network connections.", timestamp: 'Just now' }]);
    }
  };

  return (
    <div className={`${isDarkMode ? '' : 'light-mode'} flex flex-col min-h-screen relative overflow-hidden bg-background bg-scanlines`}>
      {/* Noise Texture layer */}
      <div className="noise-overlay" />

      {/* Interactive WebGL Scene sitting in the background */}
      <ThreeCanvas />

      {/* Floating HUD Telemetry Gauges (Spaceship cockpit HUD feeling) */}
      <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-30 font-mono text-[8px] text-zinc-500 space-y-6 pointer-events-none uppercase select-none tracking-widest">
        <div>
          <p className="text-zinc-600">// CORE TELEMETRY</p>
          <p>X_COORD: <span className="text-[#00e5ff] font-bold">{hudCoords.x}</span></p>
          <p>Y_COORD: <span className="text-[#00e5ff] font-bold">{hudCoords.y}</span></p>
          <p>Z_DEPTH: <span className="text-[#7c3aed] font-bold">{hudCoords.z}</span></p>
        </div>
        <div>
          <p className="text-zinc-600">// SYS CONFIG</p>
          <p>WARP_VEL: <span className="text-white">0.82c</span></p>
          <p>WARP_PCT: <span className="text-emerald-400">{(scrollProgress * 100).toFixed(0)}%</span></p>
          <p>SYS_TEMP: <span className="text-amber-500">41.8°C</span></p>
        </div>
        <div>
          <p className="text-zinc-600">// HUD STATE</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE // SECURE
          </p>
        </div>
      </div>

      {/* Navigation Header - Floating Command Deck HUD */}
      <div className="w-full px-6 md:px-12 pt-6 relative z-40">
        <header className="max-w-7xl mx-auto px-8 py-4.5 rounded-full glass-panel border border-[#00e5ff]/20 bg-zinc-950/70 backdrop-blur-xl flex justify-between items-center relative shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Left: Branding & Core Telemetry */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setAppState('landing'); handleSoundClick(); }}>
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-[#00e5ff]/30 flex items-center justify-center shadow-lg relative group">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00e5ff]/50 group-hover:rotate-180 duration-[15s] ease-linear" />
              <Layers className="text-[#00e5ff]" size={16} />
            </div>
            <div className="text-left font-mono">
              <h1 className="text-[11px] font-black tracking-widest text-white uppercase flex items-center gap-2 leading-none">
                WORKQUEST <span className="text-[7px] bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] font-bold px-2 py-0.5 rounded-full">SYS_HUD</span>
              </h1>
              <p className="text-[7px] text-[#7c3aed] uppercase mt-1 leading-none tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
                SYS_CONN: SECURE // ACCEL_3D
              </p>
            </div>
          </div>

          {/* Center: HUD Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-[9px] tracking-widest uppercase">
            <Magnet>
              <a href="#how-it-works" onClick={(e) => handleNavLinkClick(e, '#how-it-works')} className="text-zinc-400 hover:text-[#00e5ff] transition duration-300 py-1.5 px-3 border border-transparent hover:border-[#00e5ff]/20 hover:bg-[#00e5ff]/5 rounded-full">
                [ 01_METHODOLOGY ]
              </a>
            </Magnet>
            <Magnet>
              <a href="#features" onClick={(e) => handleNavLinkClick(e, '#features')} className="text-zinc-400 hover:text-[#00e5ff] transition duration-300 py-1.5 px-3 border border-transparent hover:border-[#00e5ff]/20 hover:bg-[#00e5ff]/5 rounded-full">
                [ 02_FEATURES ]
              </a>
            </Magnet>
            <Magnet>
              <a href="#marketplace" onClick={(e) => handleNavLinkClick(e, '#marketplace')} className="text-zinc-400 hover:text-[#00e5ff] transition duration-300 py-1.5 px-3 border border-transparent hover:border-[#00e5ff]/20 hover:bg-[#00e5ff]/5 rounded-full">
                [ 03_MARKETPLACE ]
              </a>
            </Magnet>
          </nav>

          {/* Right: Auth Actions */}
          <div className="flex items-center gap-5 font-mono">
            {appState === 'landing' ? (
              <Magnet>
                <button 
                  onClick={() => { setAppState('login'); handleSoundClick(); }}
                  className="px-6 py-2.5 text-[10px] tracking-widest uppercase rounded-full bg-[#00e5ff] text-black font-bold transition duration-300 shadow-[0_0_20px_rgba(0,229,255,0.35)]"
                >
                  Access Portal
                </button>
              </Magnet>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full border border-[#00e5ff]/30 object-cover" />
                  <div className="hidden md:block text-left">
                    <p className="text-[10px] font-bold text-white leading-none">{currentUser.name}</p>
                    <p className="text-[7px] text-[#00e5ff] uppercase mt-0.5">{currentUser.xp} XP</p>
                  </div>
                </div>
                <Magnet>
                  <button 
                    onClick={() => { setAppState('landing'); handleSoundClick(); }}
                    className="p-2.5 rounded-full glass-panel border-white/5 hover:border-red-500/25 text-zinc-500 hover:text-red-400 transition"
                  >
                    <LogOut size={12} />
                  </button>
                </Magnet>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10">
        
        {/* ===================================================
            1. LANDING VIEW (Asymmetrical Cinematic HUD)
            =================================================== */}
        {appState === 'landing' && (
          <div className="w-full flex flex-col items-center relative">
            
            {/* Asymmetrical Hero Section */}
            <section className="relative w-full min-h-[95vh] flex flex-col lg:flex-row items-center justify-between px-10 md:px-24 overflow-hidden py-20 gap-12">
              
              {/* Left Asymmetrical Header text block */}
              <div className="w-full lg:w-3/5 text-left select-none relative z-20">
                {/* HUD Coordinates indicator */}
                <div className="tilt-reveal inline-flex items-center gap-3 px-3 py-1.5 rounded bg-zinc-950 border border-[#00e5ff]/30 text-[8px] font-mono text-[#00e5ff] uppercase tracking-widest mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  [ SECURE COMMAND DECK ] // INDEX: 0092.14
                </div>

                {/* Massive Typography overlapping background */}
                <h1 className="tilt-reveal delay-100 text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-white uppercase font-sans">
                  THE FUTURE OF <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#7c3aed] to-white">
                    PRODUCTIVITY
                  </span>
                </h1>

                {/* Descriptive subheadline offset */}
                <p className="tilt-reveal delay-150 text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed mb-12 font-mono border-l border-[#00e5ff]/20 pl-6">
                  WorkQuest AI maps commits, tickets, and logs into a gamified plexus layout. Maintain daily streaks, earn XP metrics, and redeem for merchandise.
                </p>

                {/* Interactive CTAs */}
                <div className="tilt-reveal delay-200 flex flex-wrap items-center gap-5">
                  <Magnet>
                    <button 
                      onClick={() => { setAppState('login'); handleSoundClick(); }}
                      className="px-10 py-4.5 rounded bg-[#00e5ff] text-black font-mono text-xs tracking-widest uppercase hover:bg-white transition-all font-bold shadow-[0_0_25px_rgba(0,229,255,0.3)] cyber-bracket"
                    >
                      Deploy Workspace
                    </button>
                  </Magnet>
                  <Magnet>
                    <a 
                      href="#how-it-works"
                      onClick={handleSoundClick}
                      className="px-10 py-4.5 rounded glass-panel border-[#00e5ff]/20 text-zinc-300 font-mono text-xs tracking-widest uppercase hover:border-white transition-all text-center"
                    >
                      View Mechanics
                    </a>
                  </Magnet>
                </div>
              </div>

              {/* Right Asymmetrical Telemetry HUD panel */}
              <div className="w-full lg:w-2/5 flex justify-end z-20">
                <TiltCard className="tilt-reveal delay-250 w-full max-w-sm">
                  <div className="glass-panel p-8 rounded-2xl border-[#00e5ff]/35 bg-zinc-950/70 shadow-2xl relative text-left">
                    {/* Glowing brackets */}
                    <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
                    <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />

                    <div className="flex justify-between items-center mb-6 border-b border-[#00e5ff]/15 pb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00e5ff] font-mono">SYS_HUD // DIAGNOSTICS</h3>
                      <span className="text-[7px] text-zinc-500 font-mono">SECURE</span>
                    </div>

                    <div className="space-y-4 font-mono text-[9px]">
                      <div>
                        <p className="text-zinc-500">// XP ACCRUING VELOCITY</p>
                        <div className="flex justify-between text-white mt-1">
                          <span>TOTAL YIELD RATE:</span>
                          <span className="text-[#00e5ff] font-bold">982 XP/HR</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-zinc-500">// ACTIVE WORKSPACE COGNITION</p>
                        <div className="flex justify-between text-white mt-1">
                          <span>AI STREAK STABILITY:</span>
                          <span className="text-emerald-400 font-bold">98.4%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-zinc-500">// BACKEND MEMORY PIPELINE</p>
                        <div className="flex justify-between text-white mt-1">
                          <span>IN-MEMORY CACHE:</span>
                          <span className="text-[#7c3aed] font-bold">STABLE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>

              {/* Scroll down indicator */}
              <div className="absolute bottom-8 left-6 flex items-center gap-4 opacity-50 z-20">
                <span className="text-[8px] font-mono tracking-widest uppercase text-zinc-500">SCROLL DOWN [W_WARP]</span>
                <div className="w-[30px] h-[18px] rounded-full border-2 border-zinc-500 flex justify-start p-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
                </div>
              </div>
            </section>

            {/* Split Screen Grid Section: Methodology */}
            <section id="how-it-works" className="max-w-7xl w-full px-6 py-28 border-b border-white/5 text-left relative z-20">
              <Scroll3DContainer>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* Left Column: Diagonal Pinned Text */}
                  <div className="tilt-reveal lg:col-span-1">
                    <span className="text-[9px] font-mono text-[#00e5ff] uppercase tracking-widest block mb-2">// System Mechanics</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase leading-none">The Gamification Lifecycle</h2>
                    <p className="text-zinc-400 text-xs mt-6 font-mono border-l-2 border-[#7c3aed] pl-4">A balanced engine designed for continuous developer velocity without burnout alerts.</p>
                    
                    <div className="mt-12 hidden lg:block border border-[#00e5ff]/20 p-5 bg-zinc-950/40 rounded-xl font-mono text-[9px] text-zinc-500">
                      <p className="text-white font-bold mb-2 uppercase">// RADAR READOUT</p>
                      <p>W_COORDS: [X: {hudCoords.x}, Y: {hudCoords.y}]</p>
                      <p>W_DEPTH: [Z: {hudCoords.z}]</p>
                    </div>
                  </div>

                  {/* Right Column: Overlapping Asymmetrical Cards */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { step: '01', title: 'Task Allocation', desc: 'Tickets map to XP points depending on difficulty nodes (Easy to Extreme).' },
                      { step: '02', title: 'XP Validation', desc: 'Managers approve completions, triggering sound sweeps and XP rewards.' },
                      { step: '03', title: 'Streak Engine', desc: 'Daily log verification builds streak coefficients, boosting XP rates.' },
                      { step: '04', title: 'Reward Checkout', desc: 'Redeem XP for paid leaves, coffee vouchers, or hardware gadgets.' }
                    ].map((item, idx) => (
                      <TiltCard key={idx} className={`tilt-reveal delay-${(idx + 1) * 100}`}>
                        <div className="glass-panel p-7 rounded-2xl border-glow border-[#00e5ff]/20 hover:border-[#00e5ff]/50 transition duration-300 bg-zinc-950/40 shadow-lg h-full flex flex-col justify-between relative group">
                          <span className="text-3xl font-black text-[#00e5ff]/10 block mb-6 font-mono group-hover:text-[#00e5ff]/30 transition duration-300">{item.step}</span>
                          <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-mono">{item.title}</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed font-mono">{item.desc}</p>
                          </div>
                        </div>
                      </TiltCard>
                    ))}
                  </div>

                </div>
              </Scroll3DContainer>
            </section>

            {/* Split Screen Grid Section: Features */}
            <section id="features" className="max-w-7xl w-full px-6 py-28 border-b border-white/5 text-left relative z-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                
                {/* Left Side: Diagnostics and Spec details */}
                <div className="tilt-reveal">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">// Engineering Specifications</span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase mb-8 leading-none">
                    Linear Architecture. <br />Handcrafted Details.
                  </h2>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-10 font-mono">
                    WorkQuest AI is designed as a unified workspace. It provides managers with detailed analytics and employee burnout detection metrics while giving developers a clean visual tool.
                  </p>

                  <div className="space-y-8">
                    {[
                      { icon: <Award className="text-[#00e5ff]" size={16} />, title: "Unlockable Badges", desc: "Gain Early Bird, Task Master, or Innovation Hero badges representing verified skills." },
                      { icon: <TrendingUp className="text-[#00e5ff]" size={16} />, title: "Advanced Analytics", desc: "View detailed visual metrics of personal productivity growth over time." },
                      { icon: <Lightbulb className="text-[#00e5ff]" size={16} />, title: "AI Burnout Guardian", desc: "Automated analysis prompts suggestion tips when work logs imply over-exhaustion." }
                    ].map((feat, index) => (
                      <div key={index} className={`flex gap-4 items-start tilt-reveal delay-${(index + 1) * 100}`}>
                        <div className="p-2.5 rounded-lg bg-zinc-950 border border-[#00e5ff]/20 shadow-md">{feat.icon}</div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{feat.title}</h4>
                          <p className="text-xs text-zinc-400 mt-1.5 font-mono leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Simulated Leaderboard View */}
                <TiltCard className="tilt-reveal delay-200">
                  <div className="glass-panel p-8 rounded-2xl border-glow border-[#00e5ff]/20 bg-zinc-950/40 shadow-xl relative">
                    <div className="absolute top-4 right-4 text-[8px] font-mono text-zinc-500 tracking-widest uppercase">● Live Telemetry</div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6 font-mono">🏆 Leaderboard Rankings</h3>
                    <div className="space-y-4">
                      {mockLeaderboard.slice(0, 3).map((lead, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/60 border border-[#00e5ff]/10 hover:border-[#00e5ff]/35 transition duration-300 shadow-[0_0_15px_rgba(0,229,255,0.02)]">
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-zinc-500">#0{idx + 1}</span>
                            <img src={lead.avatar} className="w-8 h-8 rounded-full object-cover border border-[#00e5ff]/25" alt="" />
                            <div>
                              <p className="text-xs font-bold text-white font-sans">{lead.name}</p>
                              <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">{lead.department}</p>
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <p className="text-xs font-bold text-[#00e5ff]">{lead.xp} XP</p>
                            <p className="text-[8px] text-zinc-500 mt-0.5">LVL {lead.level}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            </section>

            {/* Diagonal Composition Section: Marketplace */}
            <section id="marketplace" className="max-w-7xl w-full px-6 py-28 border-b border-white/5 text-left relative z-20">
              <div className="tilt-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="text-[9px] font-mono text-[#00e5ff] uppercase tracking-widest block mb-2">// Exchange Store</span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">The Rewards Marketplace</h2>
                  <p className="text-zinc-400 text-xs mt-3 font-mono max-w-xl">Collect points and redeem items instantly. Ships directly to your office desk.</p>
                </div>
              </div>
              
              {/* Infinite Rotating Marquee Slider */}
              <div className="tilt-reveal delay-100 marquee-viewport">
                <div className="marquee-track-infinite">
                  {[...rewardList, ...rewardList].map((rew, idx) => (
                    <div 
                      key={`${rew.id}-dup-${idx}`} 
                      className="marquee-slide-card select-none group cursor-pointer"
                      onClick={() => { setSelectedReward(rew); handleSoundClick(); }}
                    >
                      <div className="glass-panel h-[390px] rounded-2xl overflow-hidden border-glow border-[#00e5ff]/15 hover:border-[#00e5ff]/45 transition-all duration-350 flex flex-col justify-between relative bg-zinc-950/30 hover:bg-zinc-950/70 hover:shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                        
                        {/* Futuristic Corner Brackets */}
                        <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-[#00e5ff]/20 group-hover:border-[#00e5ff] transition duration-300" />
                        <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-[#00e5ff]/20 group-hover:border-[#00e5ff] transition duration-300" />
                        <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-[#00e5ff]/20 group-hover:border-[#00e5ff] transition duration-300" />
                        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-[#00e5ff]/20 group-hover:border-[#00e5ff] transition duration-300" />

                        {/* Image scan wrapper */}
                        <div className="relative h-44 w-full overflow-hidden border-b border-[#00e5ff]/15 bg-black">
                          <img 
                            src={rew.image} 
                            alt={rew.title} 
                            className="w-full h-full object-cover filter grayscale contrast-110 brightness-[0.75] group-hover:filter-none group-hover:scale-102 transition-all duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                          
                          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] uppercase font-mono font-bold bg-zinc-900/80 border border-[#00e5ff]/30 text-[#00e5ff] z-20 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
                            {rew.category}
                          </span>
                        </div>

                        {/* Card body content */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 font-mono group-hover:text-[#00e5ff] transition duration-300">{rew.title}</h4>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono line-clamp-2">{rew.description}</p>
                          </div>

                          {/* Footer with XP Loot Token */}
                          <div className="flex justify-between items-center pt-4 border-t border-[#00e5ff]/15 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] font-mono font-bold text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(0,229,255,0.1)]">
                              <Zap size={10} className="text-[#00e5ff]" />
                              {rew.cost} XP
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] text-zinc-500 font-mono uppercase">Inventory</p>
                              <p className="text-[10px] text-white font-mono font-bold">{rew.stock} units</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-12 px-6 md:px-12 border-t border-[#00e5ff]/20 glass-panel mt-20 text-center text-zinc-500 font-mono text-[9px] tracking-widest uppercase relative z-20">
              <p>© 2026 WorkQuest AI. Built on Next.js 16 + React 19 + WebGL 3D. Designed for the Future of Work.</p>
            </footer>
          </div>
        )}

        {/* ===================================================
            2. LOGIN VIEW
            =================================================== */}
        {appState === 'login' && (
          <div className="flex-grow flex items-center justify-center px-4 py-20 relative z-20">
            <div className="w-full max-w-md glass-panel p-10 rounded-2xl border-[#00e5ff]/20 shadow-2xl relative overflow-hidden text-left bg-zinc-950/60 backdrop-blur-xl">
              
              <div className="text-center mb-8">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-[#00e5ff]/30 flex items-center justify-center shadow-lg mx-auto mb-4 animate-float-ambient">
                  <Layers className="text-[#00e5ff]" size={20} />
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-sans">Verification Required</h2>
                <p className="text-xs text-zinc-500 font-mono mt-1">Authenticate identity token for workspace sync</p>
              </div>

              {/* Form Option Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-zinc-950 border border-white/5 mb-6 text-[10px] text-zinc-400">
                <button 
                  onClick={() => { setAuthEmail('employee1@workquest.ai'); handleSoundClick(); }} 
                  className={`py-2 rounded-md transition font-mono uppercase ${authEmail === 'employee1@workquest.ai' ? 'bg-zinc-900 text-white font-bold border border-[#00e5ff]/30' : ''}`}
                >
                  Dev (employee1)
                </button>
                <button 
                  onClick={() => { setAuthEmail('manager01@workquest.ai'); handleSoundClick(); }} 
                  className={`py-2 rounded-md transition font-mono uppercase ${authEmail === 'manager01@workquest.ai' ? 'bg-zinc-900 text-white font-bold border border-[#00e5ff]/30' : ''}`}
                >
                  Lead (manager01)
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 font-mono">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Workplace Email</label>
                  <input 
                    type="email" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition duration-300"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                    <a href="#" className="text-[10px] text-zinc-600 hover:text-zinc-300 transition">Recover?</a>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition duration-300"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition duration-300 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                >
                  Initialize Token
                </button>
              </form>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-1/2 h-px bg-[#cca43b]/10" />
                <span className="relative bg-zinc-950 px-3 text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Or SSO credentials</span>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] uppercase">
                <button 
                  onClick={() => handleSsoLogin('google')}
                  className="w-full py-2.5 rounded-lg glass-panel border-white/5 text-zinc-300 flex items-center justify-center gap-2 hover:border-[#00e5ff] transition"
                >
                  Google
                </button>
                <button 
                  onClick={() => handleSsoLogin('microsoft')}
                  className="w-full py-2.5 rounded-lg glass-panel border-white/5 text-zinc-300 flex items-center justify-center gap-2 hover:border-[#00e5ff] transition"
                >
                  Microsoft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            3. EMPLOYEE DASHBOARD VIEW
            =================================================== */}
        {appState === 'employee_dashboard' && (
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-20 flex flex-col gap-8 text-left">
            
            {/* User stats cockpit telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Level / XP details */}
              <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border-[#00e5ff]/20 flex flex-col justify-between relative overflow-hidden bg-zinc-950/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentUser.avatar} 
                      alt="" 
                      className="w-14 h-14 rounded-full border border-[#00e5ff]/30 object-cover shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-3 font-sans uppercase tracking-wider">
                        {currentUser.name} 
                        <span className="text-[9px] bg-[#00e5ff]/10 border border-[#00e5ff]/35 text-[#00e5ff] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                          Rank LVL {currentUser.level}
                        </span>
                      </h2>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1.5 uppercase tracking-widest">Developer Node • Dept: {currentUser.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-950 border border-white/5 px-4.5 py-2.5 rounded-xl self-start sm:self-auto shadow-md">
                    <div className="text-right font-mono">
                      <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Streak Mod</p>
                      <p className="text-xs font-bold text-[#00e5ff] uppercase">
                        {currentUser.streak} DAYS ACTIVE
                      </p>
                    </div>
                    <Flame className="text-[#00e5ff] animate-bounce" size={20} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2.5 font-mono">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Tier Status: {levelNames[currentUser.level] || 'Rookie'}
                    </span>
                    <span className="text-xs text-[#00e5ff] font-bold">
                      {currentUser.xp} XP total
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-zinc-950 overflow-hidden relative border border-[#00e5ff]/15 mb-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#7c3aed] to-[#00e5ff] transition-all duration-1000 shadow-[0_0_12px_rgba(0,229,255,0.3)]" 
                      style={{ width: `${(currentUser.xp % 1000) / 10}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 font-mono tracking-wider">
                    <span>LEVEL {currentUser.level}</span>
                    <span>{1000 - (currentUser.xp % 1000)} XP to LEVEL {currentUser.level + 1}</span>
                  </div>
                </div>
              </div>

              {/* Activity log feed */}
              <div className="glass-panel p-8 rounded-2xl border-white/5 flex flex-col justify-between bg-zinc-950/40">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Department logs</h3>
                  <span className="text-[8px] px-2 py-0.5 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/25 text-[#00e5ff] font-mono tracking-widest uppercase font-bold animate-pulse">REAL-TIME</span>
                </div>
                <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                  {mockActivityLogs.map((log) => (
                    <div key={log.id} className="text-xs flex justify-between items-start gap-2 border-b border-white/5 pb-2">
                      <div className="font-mono text-[11px] leading-relaxed">
                        <span className="font-bold text-white">{log.userName} </span>
                        <span className="text-zinc-400">{log.action}</span>
                        <p className="text-[8px] text-zinc-600 mt-1">{log.timestamp}</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-950 font-mono text-[#00e5ff] font-bold whitespace-nowrap border border-[#00e5ff]/15">
                        {log.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sprint Board & Sidebars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Kanban Sprint Board */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                <div className="glass-panel p-8 rounded-2xl border-[#00e5ff]/15 bg-zinc-950/40">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Active Sprint Quests</h3>
                      <p className="text-xs text-zinc-500 mt-1 font-mono">Complete assignments to yield XP points.</p>
                    </div>
                    
                    <button 
                      onClick={() => { setAppState('manager_dashboard'); handleSoundClick(); }}
                      className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-[#00e5ff]/25 hover:border-[#00e5ff]/50 text-[9px] text-[#00e5ff] font-mono tracking-widest uppercase transition font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                    >
                      + Assign new quest
                    </button>
                  </div>

                  {/* Kanban Lanes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* TODO lane */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-zinc-950 text-[9px] font-bold text-zinc-400 uppercase font-mono border-l-2 border-slate-600 shadow">
                        <span>To Do ({tasks.filter(t => t.status === 'todo').length})</span>
                      </div>
                      <div className="space-y-4 min-h-[150px]">
                        {tasks.filter(t => t.status === 'todo').map((task) => (
                          <TiltCard key={task.id}>
                            <div 
                              onClick={() => { setSelectedTask(task); handleSoundClick(); }}
                              className="glass-panel p-5 rounded-xl border-white/5 hover:border-[#00e5ff]/35 transition cursor-pointer text-left relative bg-zinc-900/40 shadow-lg interactive-card"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                                  task.difficulty === 'extreme' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-950 text-zinc-400 border border-white/5'
                                }`}>
                                  {task.difficulty}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500">{task.dueDate}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-sans">{task.title}</h4>
                              <div className="flex justify-between items-center mt-4.5 pt-2.5 border-t border-white/5">
                                <span className="text-[10px] text-zinc-400 font-bold font-mono">+{task.xp} XP</span>
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleTaskStatusChange(task.id, 'in_progress'); 
                                  }}
                                  className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-md bg-[#00e5ff] text-black font-bold hover:bg-white transition shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                                >
                                  Start
                                </button>
                              </div>
                            </div>
                          </TiltCard>
                        ))}
                      </div>
                    </div>

                    {/* IN PROGRESS lane */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-zinc-950 text-[9px] font-bold text-zinc-400 uppercase font-mono border-l-2 border-[#00e5ff] shadow">
                        <span>In Progress ({tasks.filter(t => t.status === 'in_progress').length})</span>
                      </div>
                      <div className="space-y-4 min-h-[150px]">
                        {tasks.filter(t => t.status === 'in_progress').map((task) => (
                          <TiltCard key={task.id}>
                            <div 
                              onClick={() => { setSelectedTask(task); handleSoundClick(); }}
                              className="glass-panel p-5 rounded-xl border-white/5 hover:border-[#00e5ff]/45 transition cursor-pointer text-left relative bg-zinc-900/40 shadow-lg interactive-card"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                                  task.difficulty === 'extreme' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-950 text-zinc-400 border border-white/5'
                                }`}>
                                  {task.difficulty}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500">{task.dueDate}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-sans">{task.title}</h4>
                              <div className="flex justify-between items-center mt-4.5 pt-2.5 border-t border-white/5">
                                <span className="text-[10px] text-[#00e5ff] font-bold font-mono">+{task.xp} XP</span>
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleTaskStatusChange(task.id, 'in_review'); 
                                  }}
                                  className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-md bg-[#00e5ff] text-black font-bold hover:bg-white transition shadow-[0_0_12px_rgba(0,229,255,0.25)]"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </TiltCard>
                        ))}
                      </div>
                    </div>

                    {/* PIPELINE / VERIFY lane */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-zinc-950 text-[9px] font-bold text-[#00ff88] uppercase font-mono border-l-2 border-[#00ff88] shadow">
                        <span>Pipeline ({tasks.filter(t => t.status === 'in_review' || t.status === 'completed').length})</span>
                      </div>
                      <div className="space-y-4 min-h-[150px]">
                        {tasks.filter(t => t.status === 'in_review' || t.status === 'completed').map((task) => (
                          <TiltCard key={task.id}>
                            <div 
                              onClick={() => { setSelectedTask(task); handleSoundClick(); }}
                              className="glass-panel p-5 rounded-xl border-white/10 transition cursor-pointer text-left relative bg-zinc-900/40 shadow-lg interactive-card"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                                  task.status === 'completed' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                }`}>
                                  {task.status === 'completed' ? 'Verified' : 'Verification'}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500">
                                  {task.status === 'completed' ? `Score: ${task.qualityScore}/10` : 'Pending'}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-sans">{task.title}</h4>
                              <div className="flex justify-between items-center mt-4.5 pt-2.5 border-t border-white/5">
                                <span className="text-[10px] text-zinc-400 font-bold font-mono">+{task.xp} XP</span>
                                {task.status === 'in_review' && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTaskToApprove(task);
                                      setAppState('manager_dashboard');
                                      triggerNotification("Loaded review request", "success");
                                    }}
                                    className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-md bg-zinc-900 text-zinc-300 border border-[#00e5ff]/25 hover:border-white transition"
                                  >
                                    Verify
                                  </button>
                                )}
                              </div>
                            </div>
                          </TiltCard>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Productivity graph */}
                <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono mb-6">Performance Velocity Output</h3>
                  <div className="relative h-60 w-full flex items-end gap-3 px-4 border-b border-l border-white/5 pb-2">
                    {mockProductivityStats.map((stat, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end relative">
                        <div className="absolute bottom-full mb-3 hidden group-hover:block bg-zinc-950 text-white text-[9px] px-3 py-1.5 rounded-lg font-mono border border-white/5 shadow-lg z-30">
                          {stat.xp} XP • {stat.tasks} Quests
                        </div>
                        <div 
                          className="w-full bg-zinc-900/60 border-t-2 border-[#00e5ff] rounded-t-md transition-all duration-500 hover:bg-[#00e5ff]/20 shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                          style={{ height: `${(stat.xp / 350) * 100}%` }}
                        />
                        <span className="text-[10px] text-zinc-500 mt-2 font-mono">{stat.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebars: Leaderboard & Quick Store */}
              <div className="flex flex-col gap-8 text-left">
                
                {/* Leaderboard */}
                <div className="glass-panel p-8 rounded-2xl border-[#00e5ff]/15 bg-zinc-950/40">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Rank rosters</h3>
                    <Trophy className="text-zinc-400" size={16} />
                  </div>
                  <div className="space-y-4">
                    {mockLeaderboard.map((lead) => (
                      <div 
                        key={lead.id} 
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition duration-300 ${
                          lead.id === currentUser.id ? 'bg-[#00e5ff]/10 border-[#00e5ff]/35 shadow-md' : 'bg-zinc-950/30 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono font-bold ${
                            lead.rank === 1 ? 'text-[#00e5ff]' : 'text-zinc-500'
                          }`}>
                            #0{lead.rank}
                          </span>
                          <img src={lead.avatar} className="w-8 h-8 rounded-full object-cover border border-zinc-800" alt="" />
                          <div>
                            <p className="text-xs font-bold text-white font-sans">{lead.name}</p>
                            <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">{lead.department}</p>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <p className="text-xs font-bold text-white">{lead.xp} XP</p>
                          <p className="text-[8px] text-zinc-500 mt-0.5">LVL {lead.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shop Quick Claim */}
                <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Marketplace Claim</h3>
                    <ShoppingBag className="text-zinc-400" size={16} />
                  </div>
                  <div className="space-y-4">
                    {rewardList.slice(0, 3).map((reward) => (
                      <div key={reward.id} className="flex gap-3 items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition duration-300">
                        <div className="flex gap-3 items-center">
                          <img src={reward.image} className="w-10 h-10 rounded-lg object-cover filter grayscale border border-zinc-800" alt="" />
                          <div>
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{reward.title}</h4>
                            <p className="text-[9px] text-[#00e5ff] font-mono mt-0.5">{reward.cost} XP</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRedeemReward(reward)}
                          className="px-3 py-1.5 rounded-md bg-[#00e5ff] text-black font-bold text-[9px] font-mono uppercase hover:bg-white transition shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                        >
                          Claim
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => { setSelectedReward(rewardList[0]); handleSoundClick(); }}
                    className="w-full mt-4 py-2.5 rounded-lg glass-panel hover:bg-white/5 border-white/10 text-[9px] font-mono uppercase tracking-widest text-zinc-300 font-bold transition"
                  >
                    Load Marketplace catalog
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================
            4. MANAGER DASHBOARD VIEW
            =================================================== */}
        {appState === 'manager_dashboard' && (
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-20 flex flex-col gap-8 text-left">
            
            <div className="glass-panel p-8 rounded-2xl border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-950/40">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-sans">
                  System Allocator: {currentUser.name}
                  <span className="text-[9px] bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ml-3 shadow-[0_0_10px_rgba(0,229,255,0.15)]">
                    Admin node
                  </span>
                </h2>
                <p className="text-xs text-zinc-500 font-mono mt-2">Review pipeline logs, allocate task difficulty weight nodes, and check burnout indexes.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { setAppState('employee_dashboard'); handleSoundClick(); }}
                  className="px-5 py-2.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-white text-[9px] font-mono tracking-widest uppercase text-zinc-300 font-bold transition"
                >
                  Switch to Employee View
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Task Allocator Form */}
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
                        onChange={(e: any) => setNewTaskDifficulty(e.target.value)}
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
                    className="w-full mt-4 py-3.5 rounded-lg bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                  >
                    Deploy Quest Card
                  </button>
                </form>
              </div>

              {/* pipeline list */}
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

          </div>
        )}

      </main>

      {/* ===================================================
          5. FLOATING AI COACH
          =================================================== */}
      <div className="fixed bottom-8 right-8 z-40">
        <AnimatePresence>
          {chatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-80 h-96 glass-panel rounded-2xl border-[#00e5ff]/20 shadow-2xl flex flex-col mb-4 overflow-hidden text-left font-mono bg-zinc-950/85 backdrop-blur-xl"
            >
              {/* Scanline hologram effect */}
              <div className="absolute inset-0 bg-scanlines opacity-[0.05] pointer-events-none z-10" />

              <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-[#00e5ff]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="soundwave-bar" style={{ animationDelay: '0.1s' }} />
                    <span className="soundwave-bar" style={{ animationDelay: '0.3s' }} />
                    <span className="soundwave-bar" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Coach Node AI</h4>
                    <p className="text-[8px] text-zinc-500 uppercase tracking-widest">Hologram Uplink • Online</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setChatOpen(false); handleSoundClick(); }}
                  className="text-zinc-500 hover:text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/5 transition"
                >
                  ✕
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-grow p-4 space-y-3 overflow-y-auto bg-zinc-950/60">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[85%] p-3 rounded-xl text-[11px] leading-relaxed shadow ${
                        msg.sender === 'user' 
                          ? 'bg-[#00e5ff] text-black rounded-tr-none font-semibold' 
                          : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[7px] text-zinc-600 mt-1">{msg.timestamp}</span>
                  </div>
                ))}
                {isTyping && (
                  <div className="text-[9px] text-[#00e5ff] font-mono italic animate-pulse">Running metrics analytics...</div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-2 border-t border-white/5 flex gap-2 items-center bg-zinc-950">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask coach..."
                  className="flex-grow px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 text-white placeholder-zinc-700 text-xs focus:outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-2 rounded-lg bg-[#00e5ff] text-black hover:bg-white transition"
                >
                  <Send size={11} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => { setChatOpen(!chatOpen); handleSoundClick(); }}
          className="w-12 h-12 rounded-full bg-zinc-950 border border-[#00e5ff]/35 flex items-center justify-center shadow-xl hover:border-[#00e5ff] hover:scale-105 transition duration-300 cursor-pointer animate-float-ambient"
        >
          <Sparkles className="text-[#00e5ff]" size={18} />
        </button>
      </div>

      {/* ===================================================
          6. MANAGER VERIFICATION MODAL
          =================================================== */}
      {taskToApprove && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-[#00e5ff]/20 text-left font-mono text-xs bg-zinc-950/80 shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Verify Quest Submission</h3>
            
            <div className="p-4 rounded-xl bg-zinc-950 border border-white/5 mb-4 shadow-inner">
              <h4 className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Quest Title</h4>
              <p className="text-xs font-bold text-white mb-2 uppercase tracking-wide leading-tight">{taskToApprove.title}</p>
              <h4 className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Owner node</h4>
              <p className="text-xs text-zinc-300">{taskToApprove.assignedToName} ({taskToApprove.xp} XP Base)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-2 font-bold uppercase tracking-widest text-[8px]">Quality rating coefficient: {managerQualityScore}/10</label>
                <input 
                  type="range" 
                  min="6" 
                  max="10"
                  value={managerQualityScore}
                  onChange={(e) => setManagerQualityScore(Number(e.target.value))}
                  className="w-full accent-[#00e5ff] h-1.5 rounded-lg appearance-none cursor-pointer bg-zinc-900 border border-white/5"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 font-bold uppercase tracking-widest text-[8px]">Evaluation / Feedback logs</label>
                <textarea 
                  value={managerFeedback}
                  onChange={(e) => setManagerFeedback(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/5 text-white text-xs focus:outline-none resize-none transition"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => { setTaskToApprove(null); handleSoundClick(); }}
                className="flex-1 py-2.5 rounded-lg glass-panel border-white/5 hover:bg-white/5 text-[10px] uppercase font-bold text-zinc-400 text-center transition"
              >
                Abort
              </button>
              <button 
                onClick={handleApproveTask}
                className="flex-1 py-2.5 rounded-lg bg-[#00e5ff] text-black font-bold text-[10px] uppercase text-center hover:bg-white transition"
              >
                Finalize & Grant XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          7. REWARDS CATALOG DETAILS MODAL
          =================================================== */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl glass-panel rounded-2xl border-[#00e5ff]/20 overflow-hidden text-left flex flex-col md:flex-row font-mono text-xs bg-zinc-950/80 shadow-2xl relative">
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={selectedReward.image} alt="" className="w-full h-full object-cover filter grayscale contrast-110" />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 to-transparent" />
            </div>

            <div className="md:w-1/2 p-6 flex flex-col justify-between relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[8px] px-2.5 py-1 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] font-bold uppercase tracking-widest shadow-sm">
                    {selectedReward.category}
                  </span>
                  <button 
                    onClick={() => { setSelectedReward(null); handleSoundClick(); }}
                    className="text-zinc-500 hover:text-white font-bold w-6 h-6 rounded-full hover:bg-white/5 transition flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 leading-tight">{selectedReward.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">{selectedReward.description}</p>
                
                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-3 mb-6">
                  <div>
                    <span className="text-[8px] text-zinc-500 block uppercase tracking-widest">Inventory stock</span>
                    <span className="text-xs font-bold text-white">{selectedReward.stock} units</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-500 block uppercase tracking-widest">Accrued XP</span>
                    <span className="text-xs font-bold text-[#00e5ff]">{currentUser.xp} XP</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-base font-extrabold text-[#00e5ff] mb-4">{selectedReward.cost} XP Points</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setSelectedReward(null); handleSoundClick(); }}
                    className="flex-1 py-2.5 rounded-lg glass-panel border-white/5 hover:bg-white/5 text-[9px] uppercase tracking-widest font-bold transition text-center"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => { handleRedeemReward(selectedReward); setSelectedReward(null); }}
                    className="flex-1 py-2.5 rounded-lg bg-[#00e5ff] text-black font-bold text-[9px] uppercase tracking-widest transition text-center"
                  >
                    Redeem claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          8. KANBAN QUEST DETAIL MODAL
          =================================================== */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border-[#00e5ff]/20 text-left font-mono text-xs bg-zinc-950/80 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-[#00e5ff]/10 border border-[#00e5ff]/25 text-[#00e5ff]">
                {selectedTask.difficulty} tier
              </span>
              <button 
                onClick={() => { setSelectedTask(null); handleSoundClick(); }}
                className="text-zinc-500 hover:text-white font-bold w-6 h-6 rounded-full hover:bg-white/5 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5 font-sans leading-snug">{selectedTask.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">{selectedTask.description}</p>

            <div className="border-t border-white/5 pt-4 mb-6">
              <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Quest logs & comments</h4>
              
              <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1 mb-4">
                {(mockComments[selectedTask.id] || []).map((comm, cIdx) => (
                  <div key={cIdx} className="p-3 rounded-lg bg-zinc-950 border border-white/5 text-xs">
                    <div className="flex justify-between text-[8px] text-zinc-500 font-mono mb-1.5 uppercase">
                      <span>{comm.author}</span>
                      <span>{comm.time}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{comm.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Insert logs query..."
                  className="flex-grow px-3.5 py-2 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:outline-none"
                />
                <button 
                  onClick={() => {
                    if (!commentText.trim()) return;
                    handleSoundClick();
                    const newComm = { author: currentUser.name, text: commentText, time: 'Just now' };
                    setMockComments(prev => ({
                      ...prev,
                      [selectedTask.id]: [...(prev[selectedTask.id] || []), newComm]
                    }));
                    setCommentText('');
                    triggerNotification("Log comment registered", "success");
                  }}
                  className="px-4 rounded-lg bg-[#00e5ff] text-black hover:bg-white transition text-[9px] uppercase font-bold"
                >
                  Post
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs text-[#00e5ff] font-bold font-mono">Value: +{selectedTask.xp} XP</span>
              <button 
                onClick={() => { setSelectedTask(null); handleSoundClick(); }}
                className="px-4 py-2 rounded-lg glass-panel border-white/5 text-[9px] uppercase tracking-widest text-zinc-300 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          9. HUD SYSTEM TOAST NOTIFICATIONS
          =================================================== */}
      <div className="fixed top-6 left-6 z-50 flex flex-col gap-3 pointer-events-none font-mono">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, x: -30, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -15, scale: 0.97 }}
              className="p-3.5 rounded-xl glass-panel border-[#00e5ff]/20 shadow-2xl pointer-events-auto flex items-center gap-3 bg-zinc-950/85 backdrop-blur-xl"
            >
              {notif.type === 'xp' && (
                <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] flex items-center justify-center font-bold text-xs shadow-sm">
                  {notif.amount}
                </div>
              )}
              {notif.type === 'badge' && (
                <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] flex items-center justify-center shadow-md">
                  <Award size={14} />
                </div>
              )}
              {notif.type === 'reward' && (
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 text-[#00e5ff] flex items-center justify-center font-bold text-xs shadow-sm">
                  {notif.amount}
                </div>
              )}
              {notif.type === 'success' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-md">
                  <CheckCircle2 size={14} />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider leading-tight">{notif.text}</p>
                <p className="text-[8px] text-zinc-500 uppercase mt-1">System HUD Telemetry Log</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
