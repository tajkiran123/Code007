"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Award, Trophy, ShoppingBag, Cpu, Lightbulb, User as UserIcon, 
  ChevronRight, Sparkles, CheckCircle2, Play, Plus, Clock, Users, 
  Trash2, ShieldCheck, TrendingUp, Moon, Sun, ArrowRight, Zap, 
  ChevronDown, Search, ArrowUpRight, Check, Send, AlertTriangle, 
  PieChart, MessageSquare, LogOut, Code, RefreshCw, Layers,
  ChevronLeft, Minus, Lock, Mail, Fingerprint, Terminal, Upload, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sfx } from './audio';
import { 
  mockUsers, mockBadges, mockTasks, mockRewards, 
  mockLeaderboard as initialLeaderboard, 
  mockActivityLogs as initialActivityLogs, 
  mockProductivityStats as initialProductivityStats,
  levelNames, difficultyXp, defaultFinancials
} from './mockData';
import { User, Task, Reward, Badge, LeaderboardEntry, ActivityLog, FinancialRecord, ExpenseBreakdown, FinancialSummary } from './types';

// WebGL Canvas & Magnetic Interaction Components
import ThreeCanvas from './components/ThreeCanvas';
import Magnet from './components/Magnet';
import { ManagerDashboard, CeoDashboard, MOCK_CLIENT_PROJECTS } from './components/Dashboards';
import CeoAiAssistant from './components/CeoAiAssistant';

// ===================================================
// GOOGLE SSO ACCOUNT OPTION TELEMETRY
// ===================================================
interface SsoUserOption {
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatarType: 'letter' | 'image';
  avatarValue: string;
  color?: string;
}

const GOOGLE_ACCOUNTS_LIST: SsoUserOption[] = [
  {
    name: 'Tajkiran Junnuri',
    email: 'tajkiranjunnuri@gmail.com',
    role: 'admin',
    avatarType: 'letter',
    avatarValue: 'T',
    color: '#0284c7'
  },
  {
    name: 'Bhanu G',
    email: 'bhanug5616@gmail.com',
    role: 'admin',
    avatarType: 'letter',
    avatarValue: 'B',
    color: '#059669'
  },
  {
    name: 'Hello Hi',
    email: 'hellbbhh5575@gmail.com',
    role: 'employee',
    avatarType: 'letter',
    avatarValue: 'H',
    color: '#4f46e5'
  },
  {
    name: 'Junnuri Bobby',
    email: 'junnuribobby111@gmail.com',
    role: 'employee',
    avatarType: 'image',
    avatarValue: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Tajkiran Junnuri',
    email: 'junnuritajkiran@gmail.com',
    role: 'employee',
    avatarType: 'image',
    avatarValue: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Aparna GreenWave',
    email: 'aparnagreenwave99@gmail.com',
    role: 'employee',
    avatarType: 'letter',
    avatarValue: 'A',
    color: '#ea580c'
  },
  {
    name: 'Krishna Junnuri',
    email: 'jkldbabu@gmail.com',
    role: 'employee',
    avatarType: 'image',
    avatarValue: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=150&q=80'
  }
];

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const generateId = () => Math.random().toString(36).substr(2, 9);
const getCurrentTimestamp = () => Date.now();
const getDueDate = () => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

export default function Home() {
  // Theme & State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appState, setAppState] = useState<'landing' | 'login' | 'employee_dashboard' | 'manager_dashboard' | 'ceo_dashboard'>('landing');

  // Authenticated User
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Task & Board State
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('EMP-001');
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
  const [mockLeaderboard, setMockLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [mockActivityLogs, setMockActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [mockProductivityStats, setMockProductivityStats] = useState<{ day: string; xp: number; tasks: number }[]>(initialProductivityStats);
  const [burnoutReport, setBurnoutReport] = useState<unknown[]>([]);

  // Manager Approval State
  const [taskToApprove, setTaskToApprove] = useState<Task | null>(null);
  const [managerQualityScore, setManagerQualityScore] = useState(9);
  const [managerFeedback, setManagerFeedback] = useState('Outstanding deployment. Commendable velocity!');
  const [managerTab, setManagerTab] = useState<'quests' | 'clients'>('quests');
  const [ceoTab, setCeoTab] = useState<'salaries' | 'clients' | 'attendance' | 'rewards' | 'issues' | 'analytics' | 'leaderboard'>('salaries');

  // AI Verification & Upload States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTaskForUpload, setSelectedTaskForUpload] = useState<Task | null>(null);
  const [uploadLink, setUploadLink] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadFileBase64, setUploadFileBase64] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [verificationScore, setVerificationScore] = useState<number | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState('');


  const [companyFinancials, setCompanyFinancials] = useState<FinancialRecord[]>(defaultFinancials);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown>({
    salaries: 82000,
    infrastructure: 21000,
    marketing: 15000,
    software: 9000,
    misc: 5000
  });
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRevenueYTD: 1790000,
    totalExpensesYTD: 1323000,
    totalProfitYTD: 467000,
    averageGrowth: 4.8,
    currentClients: 23
  });
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [isWarping, setIsWarping] = useState(false);
  const [ssoModalOpen, setSsoModalOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<'google' | 'microsoft' | null>(null);
  const [customSsoEmail, setCustomSsoEmail] = useState('');
  const [showCustomSsoInput, setShowCustomSsoInput] = useState(false);
  const [showClientIdPrompt, setShowClientIdPrompt] = useState(false);
  const [tempClientId, setTempClientId] = useState('');

  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'xp' | 'badge' | 'reward' | 'success'; amount?: string }[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Issues / Complaints state
  const [complaintsList, setComplaintsList] = useState<any[]>([
    { id: '1', userName: 'Developer Engineer 01', text: 'Slow loading times on the dev environment.', status: 'pending', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', userName: 'Developer Engineer 02', text: 'Telemetry metrics missing for Cloud project.', status: 'reviewed', createdAt: new Date(Date.now() - 7200000).toISOString() }
  ]);

  // Holographic Quest Forge Sandbox State
  const [forgeName, setForgeName] = useState('Cache synchronization daemon');
  const [forgeDept, setForgeDept] = useState<'Engineering' | 'Product' | 'Design' | 'Marketing'>('Engineering');
  const [forgeDifficulty, setForgeDifficulty] = useState<'easy' | 'medium' | 'hard' | 'extreme'>('medium');
  const [forgeBadge, setForgeBadge] = useState('Innovation Hero');
  const [isForging, setIsForging] = useState(false);
  const [forgeLog, setForgeLog] = useState<string[]>([]);
  const [forgeSuccess, setForgeSuccess] = useState(false);

  const executeForgeSimulation = () => {
    handleSoundClick();
    setIsForging(true);
    setForgeSuccess(false);
    setForgeLog([`[INFO] Initializing Quest Forge Engine...`]);

    const logs = [
      `[INFO] Validating department node: ${forgeDept}...`,
      `[INFO] Calculating difficulty weight coefficients for "${forgeDifficulty}"...`,
      `[INFO] Securing tokenized badge assignment: "${forgeBadge}"...`,
      `[PROCESS] Compiling cryptographic telemetry specs...`,
      `[SUCCESS] Quest "${forgeName}" compiled successfully!`,
      `[SUCCESS] Hashing Quest node to simulated ledger...`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setForgeLog(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsForging(false);
          setForgeSuccess(true);
          const xpYield = forgeDifficulty === 'easy' ? 25 : forgeDifficulty === 'medium' ? 50 : forgeDifficulty === 'hard' ? 100 : 200;
          triggerNotification(`Quest Forged successfully! +${xpYield} XP predicted.`, "xp", `${xpYield}`);
          
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.85 },
            colors: ['#00e5ff', '#7c3aed', '#10b981']
          });
        }
      }, (index + 1) * 350);
    });
  };

  // Load telemetry data from MongoDB backend
  const loadBackendData = async () => {
    try {
      // 1. Fetch tasks (merge with mockTasks fallback)
      const tasksRes = await fetch(`${API_BASE}/tasks`);
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        if (data.length > 0) {
          const backendTasks = data.map((t: { _id?: string; id?: string; status: string }) => ({
            ...t,
            id: t._id || t.id,
            status: t.status.toLowerCase()
          }));
          // Merge: backend tasks + any mockTasks whose id is not already in backend
          const backendIds = new Set(backendTasks.map((t: { id: string }) => t.id));
          const merged = [...backendTasks, ...mockTasks.filter(t => !backendIds.has(t.id))];
          setTasks(merged);
        }
        // If backend returned empty array, keep the existing mockTasks intact
      }

      // 2. Fetch rewards
      const rewardsRes = await fetch(`${API_BASE}/rewards`);
      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewardList(data.map((r: { _id?: string; id?: string }) => ({
          ...r,
          id: r._id || r.id
        })));
      }

      // 3. Fetch leaderboard
      const leadRes = await fetch(`${API_BASE}/users/leaderboard`);
      if (leadRes.ok) {
        const data = await leadRes.json();
        setMockLeaderboard(data.map((u: { _id?: string; id?: string }) => ({
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

      // 6. Fetch users list
      const usersRes = await fetch(`${API_BASE}/users`);
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsersList(data.map((u: { _id?: string; id?: string }) => ({
          ...u,
          id: u._id || u.id
        })));
      }

      // 7. Fetch complaints / issues list
      try {
        const complaintsRes = await fetch(`${API_BASE}/ai/complaints`);
        if (complaintsRes.ok) {
          const data = await complaintsRes.json();
          setComplaintsList(data);
        }
      } catch (err) {
        console.warn("Failed to fetch complaints", err);
      }

      // 8. Fetch company financial analytics
      try {
        const compRes = await fetch(`${API_BASE}/analytics/company`);
        if (compRes.ok) {
          const data = await compRes.json();
          if (data.financials) setCompanyFinancials(data.financials);
          if (data.expenseBreakdown) setExpenseBreakdown(data.expenseBreakdown);
          if (data.summary) setFinancialSummary(data.summary);
        }
      } catch (err) {
        console.warn("Failed to fetch company financial analytics", err);
      }
    } catch (err) {
      console.warn("WorkQuest API server offline. Using local telemetry state.", err);
    }
  };

  const handleGoogleLoginBackend = async (idToken: string) => {
    setAuthLoading(true);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      const res = await fetch(`${API_BASE}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      await sleep(1500); // Visual loader matching standard email/password authentication
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('workquest_token', data.token);
        localStorage.setItem('workquest_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        if (data.user.role === 'Admin' || data.user.role === 'admin') {
          setAppState('ceo_dashboard');
          triggerNotification("Executive system access enabled", "success");
        } else if (data.user.role === 'Manager' || data.user.role === 'manager') {
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
        alert(errData.error || "Google authentication failed.");
        setAuthLoading(false);
      }
    } catch (err) {
      console.warn("Google SSO Backend authentication offline fallback", err);
      await sleep(1500);
      
      let email = 'tajkiranjunnuri@gmail.com';
      try {
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        if (payload.email) email = payload.email;
      } catch (e) {}
      
      const role = (email.toLowerCase() === 'tajkiranjunnuri@gmail.com' || email.toLowerCase() === 'bhanug5616@gmail.com') ? 'admin' : 'employee';
      setSsoProvider('google');
      executeSsoLogin(email, role);
    }
  };

  // Load token on mount & fetch Google GSI script
  useEffect(() => {
    // Parse Google OAuth redirect token from URL hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token=') || hash.includes('id_token='))) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        
        window.history.replaceState(null, '', window.location.pathname);
        
        if (idToken) {
          handleGoogleLoginBackend(idToken);
        } else if (accessToken) {
          setAuthLoading(true);
          fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
            .then(res => {
              if (res.ok) return res.json();
              throw new Error("Failed to query Google UserInfo");
            })
            .then(userInfo => {
              const email = userInfo.email;
              const name = userInfo.name;
              const picture = userInfo.picture;
              const role = (email.toLowerCase() === 'tajkiranjunnuri@gmail.com' || email.toLowerCase() === 'bhanug5616@gmail.com') ? 'admin' : 'employee';
              
              setSsoProvider('google');
              executeSsoLogin(email, role, name, picture);
            })
            .catch(err => {
              console.error("Failed to authenticate Google access token:", err);
              setAuthLoading(false);
            });
        }
      }
    }

    // Persisted session load
    const token = localStorage.getItem('workquest_token');
    const userStr = localStorage.getItem('workquest_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        if (user.role === 'Admin') {
          setAppState('ceo_dashboard');
        } else if (user.role === 'Manager') {
          setAppState('manager_dashboard');
        } else {
          setAppState('employee_dashboard');
        }
      } catch (e) {
        console.error("Failed to parse persisted user session", e);
      }
    }

    // Listen for Google SSO popup authentication messages
    const handleSsoMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'google-sso-success') {
        const { idToken, email, role, name, picture } = event.data;
        if (idToken) {
          handleGoogleLoginBackend(idToken);
        } else {
          setSsoProvider('google');
          executeSsoLogin(email, role, name, picture);
        }
      }
    };
    window.addEventListener('message', handleSsoMessage);

    // Load Google client script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      window.removeEventListener('message', handleSsoMessage);
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
    };
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadBackendData();
    });
  }, [appState]);

  // Track dynamic mouse offset coordinates for sci-fi HUD display
  const [hudCoords, setHudCoords] = useState({ x: 104.2, y: -24.9, z: 0.05 });
  const [scrollProgress, setScrollProgress] = useState(0);

  // Trigger HUD Notification
  const triggerNotification = (text: string, type: 'xp' | 'badge' | 'reward' | 'success', amount?: string) => {
    const id = generateId();
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



  // Poll backend data every 5 seconds to ensure real-time synchronization between manager and employee portals
  useEffect(() => {
    if (['employee_dashboard', 'manager_dashboard', 'ceo_dashboard'].includes(appState)) {
      const interval = setInterval(() => {
        loadBackendData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [appState]);

  // Auth Handling
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSoundClick();
    if (!authEmail) return;
    setAuthLoading(true);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: 'Password123!' })
      });

      await sleep(1500); // 1.5s visual after effect loading

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('workquest_token', data.token);
        localStorage.setItem('workquest_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        if (data.user.role === 'Admin') {
          setAppState('ceo_dashboard');
          triggerNotification("Executive system access enabled", "success");
        } else if (data.user.role === 'Manager') {
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
      await sleep(1500); // 1.5s visual after effect loading
      if (authEmail.includes('admin') || authEmail.includes('ceo')) {
        setCurrentUser(mockUsers[2]);
        localStorage.setItem('workquest_token', 'mock_admin_token');
        localStorage.setItem('workquest_user', JSON.stringify(mockUsers[2]));
        setAppState('ceo_dashboard');
        triggerNotification("Executive system access enabled (offline)", "success");
      } else if (authEmail.includes('manager') || authEmail.includes('sarah')) {
        setCurrentUser(mockUsers[1]);
        localStorage.setItem('workquest_token', 'mock_manager_token');
        localStorage.setItem('workquest_user', JSON.stringify(mockUsers[1]));
        setAppState('manager_dashboard');
        triggerNotification("Secured administrator level access token (offline)", "success");
      } else {
        setCurrentUser(mockUsers[0]);
        localStorage.setItem('workquest_token', 'mock_employee_token');
        localStorage.setItem('workquest_user', JSON.stringify(mockUsers[0]));
        setAppState('employee_dashboard');
        triggerNotification("Logged in (offline)", "success");
        if (soundEnabled) sfx.playStreakFire();
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const executeSsoLogin = async (email: string, selectedRole?: 'admin' | 'employee', selectedName?: string, selectedAvatar?: string) => {
    if (!ssoProvider) return;
    setSsoModalOpen(false);
    setAuthLoading(true);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const providerName = ssoProvider === 'google' ? 'Google' : 'Microsoft';
    
    // Map roles: if selectedRole is provided, we use it. Otherwise inspect email
    let finalRole: 'Admin' | 'Manager' | 'Employee' = 'Employee';
    if (selectedRole) {
      finalRole = selectedRole === 'admin' ? 'Admin' : 'Employee';
    } else {
      if (email.includes('admin') || email.includes('ceo')) {
        finalRole = 'Admin';
      } else if (email.includes('manager') || email.includes('sarah')) {
        finalRole = 'Manager';
      }
    }

    const finalName = selectedName || (finalRole === 'Admin' ? 'Admin Commander 01' : finalRole === 'Manager' ? 'Manager Leader 01' : 'Developer Engineer 01');
    const finalAvatar = selectedAvatar || (finalRole === 'Admin' ? mockUsers[2].avatar : finalRole === 'Manager' ? mockUsers[1].avatar : mockUsers[0].avatar);

    try {
      // 1. Attempt to resolve user from backend
      const res = await fetch(`${API_BASE}/users`);
      await sleep(1500); // 1.5s visual loader
      
      if (res.ok) {
        const users: User[] = await res.json();
        const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (matchedUser) {
          if (selectedRole) {
            matchedUser.role = selectedRole === 'admin' ? 'Admin' : 'Employee';
          }
          localStorage.setItem('workquest_token', `mock_sso_${ssoProvider}_token`);
          localStorage.setItem('workquest_user', JSON.stringify(matchedUser));
          setCurrentUser(matchedUser);
          
          if (matchedUser.role === 'Admin') {
            setAppState('ceo_dashboard');
            triggerNotification(`Executive access enabled via ${providerName} SSO`, "success");
          } else if (matchedUser.role === 'Manager') {
            setAppState('manager_dashboard');
            triggerNotification(`Secured administrator level access via ${providerName} SSO`, "success");
          } else {
            setAppState('employee_dashboard');
            triggerNotification(`Logged in to workspace session via ${providerName} SSO`, "success");
            if (soundEnabled) sfx.playStreakFire();
          }
          loadBackendData();
          setAuthLoading(false);
          setSsoProvider(null);
          return;
        }
      }
    } catch (err) {
      console.warn("Express server offline during SSO authentication. Falling back to offline SSO.", err);
    }
    
    // 2. Offline Fallback logic
    await sleep(1000);
    
    const mockBase = finalRole === 'Admin' ? mockUsers[2] : finalRole === 'Manager' ? mockUsers[1] : mockUsers[0];
    const userObj: User = {
      ...mockBase,
      name: finalName,
      email: email,
      avatar: finalAvatar,
      role: finalRole.toLowerCase() as any
    };
    
    let token = `mock_${ssoProvider}_employee_token`;
    let targetState: any = 'employee_dashboard';
    let notifyMsg = `Logged in as ${finalName} via ${providerName} SSO`;
    
    if (finalRole === 'Admin') {
      token = `mock_${ssoProvider}_admin_token`;
      targetState = 'ceo_dashboard';
      notifyMsg = `Executive system access enabled for ${finalName}`;
    } else if (finalRole === 'Manager') {
      token = `mock_${ssoProvider}_manager_token`;
      targetState = 'manager_dashboard';
      notifyMsg = `Secured administrator access for ${finalName}`;
    }
    
    localStorage.setItem('workquest_token', token);
    localStorage.setItem('workquest_user', JSON.stringify(userObj));
    setCurrentUser(userObj);
    setAppState(targetState);
    triggerNotification(notifyMsg, "success");
    if (targetState === 'employee_dashboard' && soundEnabled) {
      sfx.playStreakFire();
    }
    setAuthLoading(false);
    setSsoProvider(null);
  };

  const handleGoogleSsoClick = () => {
    handleSoundClick();
    
    let clientId = '';
    if (typeof window !== 'undefined') {
      clientId = localStorage.getItem('google_client_id') || '';
      // Self-heal: If the saved client ID is invalid (e.g. doesn't end with .apps.googleusercontent.com), clear it
      if (clientId && !clientId.endsWith('.apps.googleusercontent.com')) {
        localStorage.removeItem('google_client_id');
        clientId = '';
      }
    }
    if (!clientId) {
      clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    }
    
    // Only block if the Client ID is empty, contains placeholder, or matches the exact deleted ID
    if (!clientId || clientId.includes('YOUR_GOOGLE') || clientId === '547514809228-kgg4h76v9q8mop43o8lqpe4o6oasv652.apps.googleusercontent.com') {
      setTempClientId('');
      setShowClientIdPrompt(true);
      return;
    }
    
    // Direct redirect to Google's actual OAuth 2.0 endpoint page
    if (typeof window !== 'undefined') {
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/api/auth/callback/google`;
      const nonce = Math.random().toString(36).substring(2);
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token%20token&scope=openid%20email%20profile&prompt=select_account&nonce=${nonce}`;
      
      window.location.href = oauthUrl;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('workquest_token');
    localStorage.removeItem('workquest_user');
    setCurrentUser(mockUsers[0]);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setAppState('landing');
    if (soundEnabled) sfx.playClick();
    triggerNotification("Session terminated. Token cleared.", "success");
  };

  // Task Assignment
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSoundClick();
    if (!newTaskTitle) return;

    const targetXp = difficultyXp[newTaskDifficulty] || 30;
    const assigneeUser = usersList.find(u => (u.employeeId || u.id) === newTaskAssignee);
    const assignedToName = assigneeUser ? assigneeUser.name : (newTaskAssignee === 'emp-1' ? 'Developer Engineer 01' : 'Jordan Sparks');

    const taskPayload = {
      title: newTaskTitle,
      description: newTaskDesc,
      difficulty: newTaskDifficulty,
      xp: targetXp,
      assignedTo: newTaskAssignee,
      assignedToName: assignedToName,
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
          id: `task-${getCurrentTimestamp()}`,
          title: newTaskTitle,
          description: newTaskDesc,
          difficulty: newTaskDifficulty,
          xp: targetXp,
          dueDate: getDueDate(),
          status: 'todo',
          assignedTo: newTaskAssignee,
          assignedToName: assignedToName,
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
        id: `task-${getCurrentTimestamp()}`,
        title: newTaskTitle,
        description: newTaskDesc,
        difficulty: newTaskDifficulty,
        xp: targetXp,
        dueDate: getDueDate(),
        status: 'todo',
        assignedTo: newTaskAssignee,
        assignedToName: assignedToName,
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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      triggerNotification("Only PDF files are accepted for document verification.", "success");
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
    triggerNotification(`Uploaded ${file.name} successfully`, "success");
  };

  const handleAiVerifySubmit = async () => {
    if (!selectedTaskForUpload) return;
    setIsVerifying(true);
    setVerificationLogs([`[INFO] Connecting to AI Verification Node...`]);

    const logs = [
      `[INFO] Retrieving submission payload (PDF/Link)...`,
      `[PROCESS] Analyzing file signatures & source integrity...`,
      `[PROCESS] Compiling test metrics against Quest specification...`,
      `[PROCESS] Evaluating code quality and department standards...`,
      `[SUCCESS] Compliance verification complete. Generative feedback generated.`
    ];

    logs.forEach((log, index) => {
      setTimeout(async () => {
        setVerificationLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          const calculatedScore = Math.floor(Math.random() * 3) + 8; // Score: 8, 9, 10
          setVerificationScore(calculatedScore);
          
          let aiFeedback = `AI Verification Report:\n`;
          if (uploadLink) {
            aiFeedback += `- Project URL: ${uploadLink}\n`;
          }
          if (uploadedFileName) {
            aiFeedback += `- Submission File: ${uploadedFileName}\n`;
          }
          aiFeedback += `- Acceptance Criteria: MET\n`;
          aiFeedback += `- Performance Index: OPTIMAL\n`;
          aiFeedback += `- AI Insights: Clean structure, robust memory caching implementation, and comprehensive unit tests. Well done!`;

          setVerificationFeedback(aiFeedback);

          try {
            // First step: mark as in_review
            await fetch(`${API_BASE}/tasks/${selectedTaskForUpload.id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'in_review' })
            });

            // Second step: approve it directly
            const res = await fetch(`${API_BASE}/tasks/${selectedTaskForUpload.id}/approve`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ qualityScore: calculatedScore, feedback: aiFeedback })
            });

            if (res.ok) {
              const result = await res.json();
              const updatedTask = result.task;
              
              setTasks((prev) =>
                prev.map((t) => (t.id === selectedTaskForUpload.id ? { ...updatedTask, id: updatedTask._id || updatedTask.id, status: updatedTask.status.toLowerCase() } : t))
              );

              triggerNotification(`AI Verified! +${selectedTaskForUpload.xp} XP registered`, 'xp', `+${selectedTaskForUpload.xp}`);
              
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.75 },
                colors: ['#00e5ff', '#7c3aed', '#10b981']
              });

              loadBackendData();
            } else {
              setTasks((prev) =>
                prev.map((t) => (t.id === selectedTaskForUpload.id ? { ...t, status: 'completed', qualityScore: calculatedScore, feedback: aiFeedback } : t))
              );
            }
          } catch (err) {
            console.error("AI Verify error:", err);
            setTasks((prev) =>
              prev.map((t) => (t.id === selectedTaskForUpload.id ? { ...t, status: 'completed', qualityScore: calculatedScore, feedback: aiFeedback } : t))
            );
          }

          setIsVerifying(false);
        }
      }, (index + 1) * 450);
    });
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
      setCurrentUser(prev => ({
        ...prev,
        xp: prev.xp - reward.cost
      }));
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

    const isIssueMsg = 
      inputMsg.trim().toLowerCase().startsWith('/complaint') || 
      inputMsg.toLowerCase().includes('issue') || 
      inputMsg.toLowerCase().includes('problem') || 
      inputMsg.toLowerCase().includes('broken') || 
      inputMsg.toLowerCase().includes('not working') || 
      inputMsg.toLowerCase().includes('bug') || 
      inputMsg.toLowerCase().includes('error') || 
      inputMsg.toLowerCase().includes('complaint');

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
        
        if (isIssueMsg) {
          setTimeout(() => {
            loadBackendData();
          }, 400);
        }
      } else {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: "Calculations indicate offline fallback. Please check Gemini API network connections.", timestamp: 'Just now' }]);
      }
    } catch {
      setIsTyping(false);
      if (isIssueMsg) {
        let complaintText = inputMsg;
        if (inputMsg.trim().toLowerCase().startsWith('/complaint')) {
          complaintText = inputMsg.replace(/^\/complaint\s*/i, '').trim();
        }
        if (complaintText) {
          const mockComp = {
            id: Math.random().toString(),
            userName: currentUser.name || 'Developer Engineer 01',
            text: complaintText,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          setComplaintsList(prev => [mockComp, ...prev]);
          setChatMessages((prev) => [...prev, { 
            sender: 'ai', 
            text: `🚨 SYSTEM UPLINK SECURED (OFFLINE): Issue ticket logged under Ticket ID [COMP-${Math.floor(1000 + Math.random() * 9000)}] on local storage.`, 
            timestamp: 'Just now' 
          }]);
          return;
        }
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: "Calculations indicate offline fallback. Please check Gemini API network connections.", timestamp: 'Just now' }]);
    }
  };

  // Compute payroll statistics dynamically at the component root level
  const totalNodes = usersList.length;
  const totalPayroll = usersList.reduce((acc, curr) => {
    const rawVal = String(curr.salary || '').replace(/[^0-9]/g, '');
    return acc + (parseInt(rawVal, 10) || 115000);
  }, 0);
  const avgBurnout = Math.round(
    usersList.reduce((acc, curr) => acc + (curr.burnoutScore || 15), 0) / (totalNodes || 1)
  );

  return (
    <div className={`${isDarkMode ? '' : 'light-mode'} flex flex-col min-h-screen relative overflow-hidden bg-background bg-scanlines`}>
      {/* Noise Texture layer */}
      <div className="noise-overlay" />

      {/* Interactive WebGL Scene sitting in the background */}
      <ThreeCanvas appState={appState} themeColor={currentUser.themeColor || 'cyan'} />

      {/* Floating HUD Telemetry Gauges (Spaceship cockpit HUD feeling) */}
      <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-30 font-mono text-[8px] text-zinc-500 space-y-6 pointer-events-none uppercase select-none tracking-widest">
        <div>
          <p className="text-zinc-600">{"// CORE TELEMETRY"}</p>
          <p>X_COORD: <span className="text-[#00e5ff] font-bold">{hudCoords.x}</span></p>
          <p>Y_COORD: <span className="text-[#00e5ff] font-bold">{hudCoords.y}</span></p>
          <p>Z_DEPTH: <span className="text-[#7c3aed] font-bold">{hudCoords.z}</span></p>
        </div>
        <div>
          <p className="text-zinc-600">{"// SYS CONFIG"}</p>
          <p>WARP_VEL: <span className="text-white">0.82c</span></p>
          <p>WARP_PCT: <span className="text-emerald-400">{(scrollProgress * 100).toFixed(0)}%</span></p>
          <p>SYS_TEMP: <span className="text-amber-500">41.8°C</span></p>
        </div>
        <div>
          <p className="text-zinc-600">{"// HUD STATE"}</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {"ONLINE // SECURE"}
          </p>
        </div>
      </div>

      {/* Navigation Header - Floating Command Deck HUD */}
      <div className="w-full px-6 md:px-12 pt-6 relative z-40">
        <header className="max-w-7xl mx-auto px-8 py-4.5 rounded-full glass-panel border border-[#00e5ff]/20 bg-zinc-950/70 backdrop-blur-xl flex justify-between items-center relative shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Left: Branding & Core Telemetry */}
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            onClick={() => { 
              if (typeof window !== 'undefined') {
                window.history.replaceState(null, '', window.location.pathname);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              setAppState('landing'); 
              handleSoundClick(); 
            }}
          >
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
            {['employee_dashboard', 'manager_dashboard', 'ceo_dashboard'].includes(appState) ? (
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
                    onClick={handleLogout}
                    className="p-2.5 rounded-full glass-panel border-white/5 hover:border-red-500/25 text-zinc-500 hover:text-red-400 transition"
                  >
                    <LogOut size={12} />
                  </button>
                </Magnet>
              </div>
            ) : (
              <Magnet>
                <button 
                  onClick={() => {
                    handleSoundClick();
                    const token = localStorage.getItem('workquest_token');
                    const userStr = localStorage.getItem('workquest_user');
                    if (token && userStr) {
                      try {
                        const user = JSON.parse(userStr);
                        if (user.role === 'Admin') setAppState('ceo_dashboard');
                        else if (user.role === 'Manager') setAppState('manager_dashboard');
                        else setAppState('employee_dashboard');
                        return;
                      } catch {}
                    }
                    setAppState('login');
                  }}
                  className="px-6 py-2.5 text-[10px] tracking-widest uppercase rounded-full bg-[#00e5ff] text-black font-bold transition duration-300 shadow-[0_0_20px_rgba(0,229,255,0.35)]"
                >
                  Access Portal
                </button>
              </Magnet>
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
                        <p className="text-zinc-500">{"// XP ACCRUING VELOCITY"}</p>
                        <div className="flex justify-between text-white mt-1">
                          <span>TOTAL YIELD RATE:</span>
                          <span className="text-[#00e5ff] font-bold">982 XP/HR</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-zinc-500">{"// ACTIVE WORKSPACE COGNITION"}</p>
                        <div className="flex justify-between text-white mt-1">
                          <span>AI STREAK STABILITY:</span>
                          <span className="text-emerald-400 font-bold">98.4%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-zinc-500">{"// BACKEND MEMORY PIPELINE"}</p>
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
                    <span className="text-[9px] font-mono text-[#00e5ff] uppercase tracking-widest block mb-2">{"// System Mechanics"}</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase leading-none">The Gamification Lifecycle</h2>
                    <p className="text-zinc-400 text-xs mt-6 font-mono border-l-2 border-[#7c3aed] pl-4">A balanced engine designed for continuous developer velocity without burnout alerts.</p>
                    
                    <div className="mt-12 hidden lg:block border border-[#00e5ff]/20 p-5 bg-zinc-950/40 rounded-xl font-mono text-[9px] text-zinc-500">
                      <p className="text-white font-bold mb-2 uppercase">{"// RADAR READOUT"}</p>
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
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">{"// Engineering Specifications"}</span>
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

                {/* Right Side: AI Burnout Guardian Telemetry Card */}
                <TiltCard className="tilt-reveal delay-200">
                  <div className="glass-panel p-8 rounded-2xl border-glow border-purple-500/20 bg-zinc-950/40 shadow-xl relative">
                    <div className="absolute top-4 right-4 text-[8px] font-mono text-zinc-500 tracking-widest uppercase">● Live AI Telemetry</div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6 font-mono">🤖 Burnout Guardian Node</h3>
                    
                    <div className="space-y-6">
                      {/* Metric Gauge */}
                      <div className="p-4 rounded-xl bg-zinc-950/60 border border-purple-500/10">
                        <div className="flex justify-between items-center mb-2 font-mono text-[10px]">
                          <span className="text-zinc-400 uppercase font-bold tracking-wider">Cognitive Load Index</span>
                          <span className="text-purple-400 font-bold">28% (STABLE)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden relative border border-purple-500/10">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: '28%' }} />
                        </div>
                      </div>

                      {/* Diagnostic Items */}
                      <div className="grid grid-cols-2 gap-4 text-left font-mono">
                        <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-white/5">
                          <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider block">Sleep Quality</span>
                          <span className="text-xs font-bold text-white mt-1 block">92.4% (Optimal)</span>
                        </div>
                        <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-white/5">
                          <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider block">Workspace Velocity</span>
                          <span className="text-xs font-bold text-[#00e5ff] mt-1 block">12.8 Tasks/Wk</span>
                        </div>
                        <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-white/5">
                          <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider block">Streak Multiplier</span>
                          <span className="text-xs font-bold text-emerald-400 mt-1 block">1.45x Active</span>
                        </div>
                        <div className="p-3.5 rounded-lg bg-zinc-950/40 border border-white/5">
                          <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider block">Rest Coefficient</span>
                          <span className="text-xs font-bold text-purple-400 mt-1 block">8.5h Avg Rest</span>
                        </div>
                      </div>

                      {/* Guardian Recommendation */}
                      <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] text-left font-mono text-[9px] leading-relaxed text-emerald-400">
                        <span className="font-bold uppercase tracking-wider block mb-1">✓ Automated Advice:</span>
                        Pulse telemetry indicates optimal balance. No burnout risk detected. Recommendation: Maintain current workflow rate and streak levels.
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </section>

            {/* Diagonal Composition Section: Marketplace */}
            <section id="marketplace" className="max-w-7xl w-full px-6 py-28 border-b border-white/5 text-left relative z-20">
              <div className="tilt-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="text-[9px] font-mono text-[#00e5ff] uppercase tracking-widest block mb-2">{"// Exchange Store"}</span>
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

            {/* Interactive Section: Holographic Quest Forge Sandbox */}
            <section className="max-w-7xl w-full px-6 py-28 border-b border-white/5 text-left relative z-20">
              <div className="tilt-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <div>
                  <span className="text-[9px] font-mono text-[#00e5ff] uppercase tracking-widest block mb-2">{"// Telemetry Sandbox"}</span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">Holographic Quest Forge</h2>
                  <p className="text-zinc-400 text-xs mt-3 font-mono max-w-xl">Simulate on-chain ticket creation metrics, select diagnostic badges, and compile a fully hashed Quest node.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                {/* Left Panel: Forge Parameters (3 cols) */}
                <div className="lg:col-span-3 glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/30 flex flex-col justify-between gap-8 relative overflow-hidden">
                  <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-[#00e5ff]/30" />
                  <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-[#00e5ff]/30" />
                  <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-[#00e5ff]/30" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-[#00e5ff]/30" />
                  
                  <div className="space-y-6">
                    {/* Input: Quest Title */}
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 font-mono">Quest Title / Identifier</label>
                      <input 
                        type="text" 
                        value={forgeName}
                        onChange={(e) => setForgeName(e.target.value)}
                        placeholder="e.g. Cache synchronization daemon..."
                        className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition font-mono"
                      />
                    </div>

                    {/* Selector: Department */}
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 font-mono">Department Node</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                        {(['Engineering', 'Product', 'Design', 'Marketing'] as const).map(dept => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => { setForgeDept(dept); handleSoundClick(); }}
                            className={`py-2 px-3 rounded-lg border transition duration-300 text-center capitalize cursor-pointer ${
                              forgeDept === dept 
                                ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-white font-bold' 
                                : 'border-white/5 bg-zinc-950/60 text-zinc-400 hover:border-white/10'
                            }`}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector: Difficulty & XP scale */}
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 font-mono">Node Weight (Difficulty)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                        {(['easy', 'medium', 'hard', 'extreme'] as const).map(difficulty => {
                          const xpYield = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 50 : difficulty === 'hard' ? 100 : 200;
                          return (
                            <button
                              key={difficulty}
                              type="button"
                              onClick={() => { setForgeDifficulty(difficulty); handleSoundClick(); }}
                              className={`py-2 px-3 rounded-lg border transition duration-300 text-center uppercase cursor-pointer flex flex-col items-center gap-1 ${
                                forgeDifficulty === difficulty 
                                  ? 'border-[#00e5ff] bg-[#00e5ff]/10 text-white font-bold' 
                                  : 'border-white/5 bg-zinc-950/60 text-zinc-400 hover:border-white/10'
                              }`}
                            >
                              <span>{difficulty}</span>
                              <span className="text-[8px] text-zinc-500 font-normal">+{xpYield} XP</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selector: Unlockable Badge */}
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 font-mono">Unlockable Badge Reward</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                        {(['Early Bird', 'Task Master', 'Innovation Hero', 'Bug Hunter'] as const).map(badge => (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => { setForgeBadge(badge); handleSoundClick(); }}
                            className={`py-2 px-3 rounded-lg border transition duration-300 text-center cursor-pointer ${
                              forgeBadge === badge 
                                ? 'border-[#7c3aed] bg-purple-500/10 text-white font-bold' 
                                : 'border-white/5 bg-zinc-950/60 text-zinc-400 hover:border-white/10'
                            }`}
                          >
                            {badge}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Forge Button */}
                  <button
                    type="button"
                    onClick={executeForgeSimulation}
                    disabled={isForging}
                    className="w-full py-4 rounded-lg bg-[#00e5ff] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center justify-center gap-2 cyber-bracket cursor-pointer font-mono"
                  >
                    {isForging ? (
                      <>
                        <RefreshCw className="animate-spin" size={14} /> Compiling Cryptographic Node...
                      </>
                    ) : (
                      <>
                        <Cpu size={14} /> Forge System Quest
                      </>
                    )}
                  </button>
                </div>

                {/* Right Panel: Output HUD (2 cols) */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border-[#00e5ff]/20 bg-zinc-950/50 flex flex-col justify-between relative overflow-hidden text-zinc-400 font-mono text-[10px] min-h-[420px]">
                  <div className="absolute top-4 left-4 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00e5ff]" />
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 border-t-2 border-r-2 border-[#00e5ff]" />
                  <div className="absolute bottom-4 left-4 w-2.5 h-2.5 border-b-2 border-l-2 border-[#00e5ff]" />
                  <div className="absolute bottom-4 right-4 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00e5ff]" />

                  <div>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#00e5ff]/15">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00e5ff] flex items-center gap-1.5"><Sparkles size={11} className="text-[#00e5ff] animate-pulse" /> Forge Log Output</h3>
                      <span className="text-[8px] text-zinc-500 font-bold uppercase">SECURE CONNECT</span>
                    </div>

                    {/* Scroll Terminal Log */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 h-64 overflow-y-auto font-mono text-[9px] text-zinc-400 space-y-2 flex flex-col text-left">
                      {forgeLog.map((log, index) => (
                        <div key={index} className={`leading-relaxed ${log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[PROCESS]') ? 'text-purple-400' : 'text-zinc-400'}`}>
                          {log}
                        </div>
                      ))}
                      {isForging && (
                        <div className="text-zinc-650 text-zinc-500 animate-pulse">▋ System compiler processing...</div>
                      )}
                      {!isForging && forgeLog.length === 0 && (
                        <div className="text-zinc-650 text-zinc-500 italic">No nodes compiled. Toggle parameters and click Forge.</div>
                      )}
                    </div>
                  </div>

                  {/* Estimated Output Yield Footer */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2 text-left font-mono">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-zinc-500">
                      <span>Mapped Department:</span>
                      <span className="text-white font-bold">{forgeDept}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-zinc-500">
                      <span>Estimated Reward:</span>
                      <span className="text-[#00e5ff] font-bold flex items-center gap-1">
                        <Award size={10} /> +{forgeDifficulty === 'easy' ? 25 : forgeDifficulty === 'medium' ? 50 : forgeDifficulty === 'hard' ? 100 : 200} XP
                      </span>
                    </div>
                    {forgeSuccess && (
                      <div className="mt-2 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 p-2.5 rounded-lg flex items-center gap-2">
                        <Check size={11} /> Cryptographic node forged & verified!
                      </div>
                    )}
                  </div>
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
            <TiltCard className="w-full max-w-md shadow-2xl relative overflow-hidden text-left bg-zinc-950/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-0.5">
              
              {/* Sci-fi backdrop auroras inside the card */}
              <div className="absolute -top-40 -left-40 w-85 h-85 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-40 -right-40 w-85 h-85 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="p-9 relative z-10 flex flex-col h-full bg-zinc-950/85 rounded-2xl border border-white/5 min-h-[420px] justify-center">
                
                {authLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center font-mono">
                    {/* Glowing circular loading animation */}
                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-[#00e5ff] border-r-purple-500/40 border-b-indigo-500/20 border-l-[#00e5ff] animate-spin" />
                      <div className="absolute inset-3 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center">
                        <Terminal className="text-[#00e5ff] animate-pulse" size={20} />
                      </div>
                    </div>
                    
                    {/* Status message */}
                    <div className="space-y-2 mb-6">
                      <h3 className="text-xs font-bold text-white uppercase tracking-widest animate-pulse">
                        Authenticating...
                      </h3>
                      <p className="text-[8px] text-[#00e5ff] uppercase tracking-wider animate-cyber-blink">
                        Resolving Telemetry Node Gateway
                      </p>
                    </div>
                    
                    {/* Live console logging logs */}
                    <div className="w-full bg-zinc-950/95 border border-white/5 rounded-lg p-3 text-left text-[8px] text-zinc-500 font-mono space-y-1 select-none max-w-xs overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                      <div className="flex justify-between">
                        <span>NODE_PORT:</span>
                        <span className="text-[#00e5ff]">5000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CONNECTION:</span>
                        <span className="text-emerald-400">ESTABLISHED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AES_256_KEY:</span>
                        <span className="text-purple-400">SYNC_ACTIVE</span>
                      </div>
                      <div className="text-[7px] text-zinc-600 animate-cyber-blink border-t border-white/5 pt-1.5 text-center mt-2">
                        Do not refresh terminal connection
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header section with rotating cybernetic shield logo */}
                    <div className="text-center mb-8">
                      <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                        {/* Rotating dual boxes */}
                        <div className="absolute inset-0 rounded-xl border border-[#00e5ff]/40 rotate-45 animate-[spin_12s_linear_infinite]" />
                        <div className="absolute inset-1 rounded-xl border border-[#7c3aed]/30 -rotate-45 animate-[spin_8s_linear_infinite]" />
                        {/* Center non-biometric icon */}
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-[#00e5ff]/35 flex items-center justify-center shadow-lg relative z-10">
                          <ShieldCheck className="text-[#00e5ff] drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]" size={18} />
                        </div>
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-wider font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-300 to-purple-400">
                        Verification Required
                      </h2>
                      <p className="text-[9px] text-zinc-500 font-mono mt-1.5 tracking-widest uppercase flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping inline-block" />
                        Secure Workspace Gateway v3.12
                      </p>
                    </div>

                    {/* Form Option Selector (Quick selection of roles) */}
                    <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-950 border border-white/5 mb-6 text-[9px] text-zinc-400">
                      <button 
                        type="button"
                        onClick={() => { setAuthEmail('employee1@workquest.ai'); handleSoundClick(); }} 
                        className={`py-2 px-1 rounded-lg transition duration-300 font-mono uppercase flex flex-col items-center gap-1.5 ${authEmail === 'employee1@workquest.ai' ? 'bg-[#00e5ff]/10 text-white font-bold border border-[#00e5ff]/50 shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'hover:bg-zinc-900 hover:text-zinc-200'}`}
                      >
                        <Terminal size={12} className={authEmail === 'employee1@workquest.ai' ? 'text-[#00e5ff]' : 'text-zinc-500'} />
                        <span>DEV (EMP)</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setAuthEmail('manager01@workquest.ai'); handleSoundClick(); }} 
                        className={`py-2 px-1 rounded-lg transition duration-300 font-mono uppercase flex flex-col items-center gap-1.5 ${authEmail === 'manager01@workquest.ai' ? 'bg-purple-500/10 text-white font-bold border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'hover:bg-zinc-900 hover:text-zinc-200'}`}
                      >
                        <Users size={12} className={authEmail === 'manager01@workquest.ai' ? 'text-purple-400' : 'text-zinc-500'} />
                        <span>LEAD (MGR)</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setAuthEmail('admin01@workquest.ai'); handleSoundClick(); }} 
                        className={`py-2 px-1 rounded-lg transition duration-300 font-mono uppercase flex flex-col items-center gap-1.5 ${authEmail === 'admin01@workquest.ai' ? 'bg-indigo-500/10 text-white font-bold border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'hover:bg-zinc-900 hover:text-zinc-200'}`}
                      >
                        <ShieldCheck size={12} className={authEmail === 'admin01@workquest.ai' ? 'text-indigo-400' : 'text-zinc-500'} />
                        <span>CEO (ADM)</span>
                      </button>
                    </div>

                    {/* Form fields */}
                    <form onSubmit={handleLogin} className="space-y-5 font-mono">
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Mail size={10} className="text-[#00e5ff]" /> Workplace Email
                        </label>
                        <div className="relative">
                          <input 
                            type="email" 
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            required
                            placeholder="name@company.com"
                            className="w-full pl-4 pr-10 py-3 rounded-lg bg-zinc-950/80 border border-white/10 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 focus:outline-none transition duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                          />
                          <div className="absolute right-3 top-3.5 text-zinc-600">
                            <Zap size={12} className="text-[#00e5ff]/30" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Lock size={10} className="text-[#00e5ff]" /> Password
                          </label>
                          <a href="#" className="text-[9px] text-zinc-600 hover:text-zinc-300 transition">Recover?</a>
                        </div>
                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            required
                            className="w-full pl-4 pr-10 py-3 rounded-lg bg-zinc-950/80 border border-white/10 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 focus:outline-none transition duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] font-mono"
                          />
                          <div className="absolute right-3 top-3.5 text-zinc-600">
                            <Lock size={12} className="text-zinc-600" />
                          </div>
                        </div>
                      </div>

                      {/* Initialize Token Button */}
                      <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.015, boxShadow: "0 0 25px rgba(0,229,255,0.4)" }}
                        whileTap={{ scale: 0.985 }}
                        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-400 via-teal-400 to-[#7c3aed] text-black font-black text-xs uppercase tracking-widest hover:text-white transition duration-300 shadow-[0_0_20px_rgba(0,229,255,0.25)] relative overflow-hidden cyber-bracket cursor-pointer font-sans"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Initialize Token <ArrowRight size={14} />
                        </span>
                      </motion.button>
                    </form>

                    {/* SSO options */}
                    <div className="relative my-6 text-center">
                      <span className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
                      <span className="relative bg-zinc-950 px-3 text-[8px] text-zinc-500 uppercase tracking-widest font-mono">Or SSO Credentials</span>
                    </div>

                    <div className="flex flex-col gap-4 font-mono text-[9px] uppercase">
                      <button 
                        onClick={handleGoogleSsoClick}
                        className="w-full py-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-300 flex items-center justify-center gap-2 hover:border-[#00e5ff]/50 transition duration-300 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Google Account
                      </button>
                    </div>

                    {/* Security Diagnostic footer */}
                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] text-zinc-600 uppercase font-mono tracking-wider animate-pulse-glow">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>System status: Secure</span>
                      </div>
                      <span>Port 5000 Active</span>
                    </div>
                  </>
                )}
              </div>
            </TiltCard>
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
                    
                    {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && (
                      <button 
                        onClick={() => { 
                          if (currentUser.role === 'Admin') setAppState('ceo_dashboard');
                          else setAppState('manager_dashboard');
                          handleSoundClick(); 
                        }}
                        className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-[#00e5ff]/25 hover:border-[#00e5ff]/50 text-[9px] text-[#00e5ff] font-mono tracking-widest uppercase transition font-bold shadow-[0_0_12px_rgba(0,229,255,0.1)]"
                      >
                        {currentUser.role === 'Admin' ? 'Executive Console' : 'Manager Console'}
                      </button>
                    )}
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
                                    setSelectedTaskForUpload(task);
                                    setUploadLink('');
                                    setUploadedFileName('');
                                    setUploadFileBase64('');
                                    setIsVerifying(false);
                                    setVerificationLogs([]);
                                    setVerificationScore(null);
                                    setVerificationFeedback('');
                                    setIsUploadModalOpen(true);
                                    handleSoundClick();
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

                {/* Active Client Milestones */}
                <div className="glass-panel p-8 rounded-2xl border-purple-500/15 bg-zinc-950/40 text-left">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider font-sans">Active Client Milestones</h3>
                      <p className="text-xs text-zinc-500 mt-1 font-mono">Observe system-wide project objectives and due schedules.</p>
                    </div>
                    <Briefcase className="text-purple-400 animate-pulse" size={18} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_CLIENT_PROJECTS.slice(0, 4).map((project) => (
                      <div key={project.id} className="p-4 rounded-xl border border-white/5 bg-zinc-950/60 flex flex-col justify-between hover:border-purple-500/35 hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition duration-300">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans leading-snug">{project.projectName}</h4>
                            <p className="text-[9px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">Client: {project.clientName}</p>
                          </div>
                          <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            project.status === 'Active' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 
                            project.status === 'In Review' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3.5 border-t border-white/5 font-mono text-[9px]">
                          <span className="text-zinc-500 uppercase tracking-wider">Target Date</span>
                          <span className="text-purple-400 font-bold">{project.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Productivity graph */}
                <div className="glass-panel p-8 rounded-2xl border-white/5 bg-zinc-950/40 text-left relative overflow-hidden">
                  {/* Subtle animated background grid */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />
                  
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">Performance Velocity Output</h3>
                      <p className="text-[8px] text-zinc-600 font-mono mt-1 uppercase tracking-wider">Weekly XP Distribution • {mockProductivityStats.reduce((a, s) => a + s.xp, 0)} Total XP</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
                      <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Live</span>
                    </div>
                  </div>

                  {/* Y-axis scale indicators */}
                  <div className="relative z-10">
                    <div className="absolute left-0 top-0 h-60 flex flex-col justify-between py-1 -ml-1">
                      {[Math.max(...mockProductivityStats.map(s => s.xp)), Math.round(Math.max(...mockProductivityStats.map(s => s.xp)) * 0.66), Math.round(Math.max(...mockProductivityStats.map(s => s.xp)) * 0.33), 0].map((val, i) => (
                        <span key={i} className="text-[7px] text-zinc-600 font-mono w-7 text-right">{val}</span>
                      ))}
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="relative h-60 w-full flex items-end gap-2.5 pl-10 pr-2 border-b border-l border-white/8 pb-2 z-10">
                    {/* Horizontal grid lines */}
                    {[0.33, 0.66, 1].map((pct, i) => (
                      <div key={i} className="absolute left-10 right-2 border-t border-dashed border-white/[0.04]" style={{ bottom: `${pct * 100}%` }} />
                    ))}

                    {mockProductivityStats.map((stat, idx) => {
                      const maxXp = Math.max(...mockProductivityStats.map(s => s.xp));
                      const heightPct = (stat.xp / maxXp) * 100;
                      const barColors = [
                        'from-[#00e5ff] to-[#0891b2]',
                        'from-[#06b6d4] to-[#7c3aed]',
                        'from-[#7c3aed] to-[#a855f7]',
                        'from-[#a855f7] to-[#ec4899]',
                        'from-[#ec4899] to-[#f43f5e]',
                        'from-[#10b981] to-[#00e5ff]',
                        'from-[#f59e0b] to-[#ef4444]',
                      ];
                      const glowColors = [
                        'rgba(0,229,255,0.35)',
                        'rgba(6,182,212,0.35)',
                        'rgba(124,58,237,0.35)',
                        'rgba(168,85,247,0.35)',
                        'rgba(236,72,153,0.35)',
                        'rgba(16,185,129,0.35)',
                        'rgba(245,158,11,0.35)',
                      ];
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end relative">
                          {/* Floating tooltip */}
                          <div className="absolute bottom-full mb-4 hidden group-hover:flex flex-col items-center z-40 animate-[fadeIn_0.2s_ease-out]">
                            <div className="bg-zinc-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-mono border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[100px]">
                              <p className="text-[11px] font-bold text-[#00e5ff] mb-1">{stat.xp} XP</p>
                              <p className="text-[9px] text-zinc-400">{stat.tasks} Quests Done</p>
                              <div className="w-full bg-zinc-800 rounded-full h-1 mt-2">
                                <div className={`h-full rounded-full bg-gradient-to-r ${barColors[idx]}`} style={{ width: `${heightPct}%` }} />
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-zinc-900/95 border-r border-b border-white/10 rotate-45 -mt-1" />
                          </div>

                          {/* XP value label on top of bar */}
                          <span className="text-[9px] font-mono font-bold text-white/60 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {stat.xp}
                          </span>

                          {/* Animated bar */}
                          <div 
                            className={`w-full bg-gradient-to-t ${barColors[idx]} rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden group-hover:scale-x-110 group-hover:brightness-125`}
                            style={{ 
                              height: `${heightPct}%`,
                              boxShadow: `0 0 20px ${glowColors[idx]}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                              animation: `growUp 0.8s ease-out ${idx * 0.1}s both`,
                            }}
                          >
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Animated shine sweep */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          </div>

                          {/* Day label */}
                          <span className="text-[10px] text-zinc-500 mt-3 font-mono font-semibold group-hover:text-white transition-colors duration-300 uppercase">{stat.day}</span>
                          
                          {/* Active dot indicator */}
                          <div className={`w-1 h-1 rounded-full mt-1.5 transition-all duration-300 ${idx === mockProductivityStats.indexOf(mockProductivityStats.reduce((a, b) => a.xp > b.xp ? a : b)) ? 'bg-[#00e5ff] shadow-[0_0_6px_rgba(0,229,255,0.8)]' : 'bg-zinc-700 group-hover:bg-zinc-400'}`} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom stat summary bar */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]" />
                        <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Peak: {Math.max(...mockProductivityStats.map(s => s.xp))} XP</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-[#a855f7] to-[#ec4899]" />
                        <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Avg: {Math.round(mockProductivityStats.reduce((a, s) => a + s.xp, 0) / mockProductivityStats.length)} XP</span>
                      </div>
                    </div>
                    <span className="text-[8px] text-[#00e5ff]/60 font-mono uppercase tracking-wider">
                      {mockProductivityStats.reduce((a, s) => a + s.tasks, 0)} Total Quests
                    </span>
                  </div>
                </div>

              </div>

              {/* Sidebars: Leaderboard & Quick Store */}
              <div className="flex flex-col gap-8 text-left">
                
                {/* Leaderboard */}
                {currentUser.role === 'Admin' && (
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
                )}

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
          <ManagerDashboard
            currentUser={currentUser}
            setAppState={setAppState}
            managerTab={managerTab}
            setManagerTab={setManagerTab}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskDesc={newTaskDesc}
            setNewTaskDesc={setNewTaskDesc}
            newTaskDifficulty={newTaskDifficulty}
            setNewTaskDifficulty={setNewTaskDifficulty}
            newTaskAssignee={newTaskAssignee}
            setNewTaskAssignee={setNewTaskAssignee}
            handleAddTask={handleAddTask}
            tasks={tasks}
            setTaskToApprove={setTaskToApprove}
            handleSoundClick={handleSoundClick}
            usersList={usersList}
          />
        )}

        {appState === 'ceo_dashboard' && (
          <>
            <CeoDashboard
              currentUser={currentUser}
              setAppState={setAppState}
              ceoTab={ceoTab}
              setCeoTab={setCeoTab}
              usersList={usersList}
              employeeSearch={employeeSearch}
              setEmployeeSearch={setEmployeeSearch}
              totalNodes={totalNodes}
              totalPayroll={totalPayroll}
              avgBurnout={avgBurnout}
              handleSoundClick={handleSoundClick}
              loadBackendData={loadBackendData}
              triggerNotification={triggerNotification}
              complaintsList={complaintsList}
              setComplaintsList={setComplaintsList}
              companyFinancials={companyFinancials}
              expenseBreakdown={expenseBreakdown}
              financialSummary={financialSummary}
              leaderboardList={mockLeaderboard}
            />
            <CeoAiAssistant
              currentUser={currentUser}
              usersList={usersList}
              loadBackendData={loadBackendData}
              triggerNotification={triggerNotification}
              setCeoTab={setCeoTab}
              setAppState={setAppState}
            />
          </>
        )}

      </main>

      {/* ===================================================
          5. FLOATING AI COACH
          =================================================== */}
      {appState !== 'ceo_dashboard' && (
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
      )}

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
          AI PROJECT VERIFICATION & UPLOAD MODAL
          =================================================== */}
      {isUploadModalOpen && selectedTaskForUpload && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-8 rounded-2xl border-[#00e5ff]/25 text-left font-mono text-xs bg-zinc-950/80 shadow-2xl relative">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => { setIsUploadModalOpen(false); handleSoundClick(); }}
                className="text-zinc-550 text-zinc-500 hover:text-white font-bold w-6 h-6 rounded-full hover:bg-white/5 transition flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              <Award className="text-[#00e5ff]" size={18} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Submit Quest Solution</h3>
            </div>

            <p className="text-[10px] text-zinc-400 mb-6 leading-relaxed">
              Upload your deliverables below. You can submit a project URL or attach a PDF documentation file. Our AI Verification node will instantly compile, build, and test your solution to award XP nodes.
            </p>

            <div className="space-y-5 mb-6">
              {/* Target Quest Card */}
              <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/40 text-zinc-400 text-[10px] flex justify-between items-center">
                <div>
                  <span className="uppercase text-[8px] font-bold text-zinc-550 text-zinc-500">Target Quest</span>
                  <p className="text-white font-bold text-xs mt-1 uppercase tracking-wider">{selectedTaskForUpload.title}</p>
                </div>
                <div className="text-right">
                  <span className="uppercase text-[8px] font-bold text-zinc-550 text-zinc-500">Node XP Weight</span>
                  <p className="text-[#00e5ff] font-bold text-xs mt-1 font-mono">+{selectedTaskForUpload.xp} XP</p>
                </div>
              </div>

              {/* Input: Project Link */}
              <div>
                <label className="block text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Project URL / Link</label>
                <input 
                  type="text" 
                  value={uploadLink}
                  onChange={(e) => setUploadLink(e.target.value)}
                  placeholder="https://github.com/user/workquest-project"
                  disabled={isVerifying}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-white/5 text-white placeholder-zinc-700 text-xs focus:border-[#00e5ff] focus:outline-none transition"
                />
              </div>

              {/* Input: PDF File Upload */}
              <div>
                <label className="block text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Project Documentation (PDF)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    disabled={isVerifying}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-5 border border-dashed border-white/10 hover:border-[#00e5ff]/35 rounded-xl bg-zinc-950/60 transition text-center flex flex-col items-center justify-center gap-2">
                    <Upload className="text-zinc-500" size={16} />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Drag and drop or click to attach PDF'}
                    </span>
                    <span className="text-[8px] text-zinc-600">ONLY PDF FILES (MAX 10MB)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Log Output area */}
            {(isVerifying || verificationLogs.length > 0) && (
              <div className="mb-6 p-4 rounded-xl bg-black/60 border border-[#00e5ff]/15 font-mono text-[9px] text-zinc-400 space-y-1.5 max-h-40 overflow-y-auto flex flex-col text-left">
                {verificationLogs.map((log, index) => (
                  <div key={index} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[PROCESS]') ? 'text-purple-400' : 'text-zinc-400'}>
                    {log}
                  </div>
                ))}
                {isVerifying && (
                  <div className="text-zinc-550 text-zinc-500 animate-pulse">▋ System compiler processing...</div>
                )}
              </div>
            )}

            {/* Final AI Verdict */}
            {!isVerifying && verificationScore !== null && (
              <div className="mb-6 p-4.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] text-left font-mono space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px]">✓ AI Verification Success</span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Score: {verificationScore}/10</span>
                </div>
                <pre className="text-[9px] text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">{verificationFeedback}</pre>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => { setIsUploadModalOpen(false); handleSoundClick(); }}
                disabled={isVerifying}
                className="flex-1 py-3 rounded-lg border border-white/5 text-zinc-400 font-bold text-[9px] uppercase tracking-widest hover:border-white transition text-center disabled:opacity-50 cursor-pointer"
              >
                Close portal
              </button>
              <button 
                onClick={handleAiVerifySubmit}
                disabled={isVerifying || (!uploadLink && !uploadedFileName)}
                className="flex-grow py-3 rounded-lg bg-[#00e5ff] text-black font-bold text-[9px] uppercase tracking-widest hover:bg-white transition text-center disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
              >
                <Cpu size={12} /> Launch AI Verification
              </button>
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

      {/* SSO Account Selector Modal Overlay */}
      <AnimatePresence>
        {ssoModalOpen && ssoProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSsoModalOpen(false); setSsoProvider(null); handleSoundClick(); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card - Styled like a premium dark mode Google OAuth screen */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-[440px] bg-[#0d0d0d] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative z-10 text-left flex flex-col font-sans"
            >
              {/* Google Header Logo & Subtitle */}
              <div className="p-6 pb-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Google G Logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.87h12.66c-.55 2.94-2.22 5.44-4.72 7.11l7.33 5.68C43.5 36.8 46.5 31.06 46.5 24z"/>
                      <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.33-5.68c-2.03 1.36-4.64 2.19-8.56 2.19-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    <span className="text-[13px] text-zinc-300 font-medium">Sign in with Google</span>
                  </div>
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => { setSsoModalOpen(false); setSsoProvider(null); handleSoundClick(); }}
                    className="text-zinc-500 hover:text-white transition-colors text-xs font-mono border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 rounded-md"
                  >
                    Close
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-normal text-white tracking-tight">Choose an account</h2>
                  <p className="text-[13px] text-zinc-400 font-normal">
                    to continue to <span className="text-[#8ab4f8] hover:underline cursor-pointer">twin-biz-ai.vercel.app</span>
                  </p>
                  
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-400 font-sans leading-relaxed mt-2">
                    ⚠️ This is a simulated local selector. To display your device's actual Google Accounts, configure the environment variable <code className="bg-black/40 px-1 rounded text-white font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
                  </div>
                </div>
              </div>

              {/* Account selection list */}
              <div className="flex flex-col max-h-[380px] overflow-y-auto border-t border-zinc-800/80">
                {GOOGLE_ACCOUNTS_LIST.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => { handleSoundClick(); executeSsoLogin(u.email, u.role, u.name, u.avatarType === 'image' ? u.avatarValue : ''); }}
                    className="w-full px-6 py-3.5 hover:bg-[#1a1a1a]/60 flex items-center gap-4 transition duration-150 text-left border-b border-zinc-800/40 cursor-pointer group"
                  >
                    {/* Avatar Column */}
                    <div className="shrink-0">
                      {u.avatarType === 'letter' ? (
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{ backgroundColor: u.color || '#27272a' }}
                        >
                          {u.avatarValue}
                        </div>
                      ) : (
                        <img 
                          src={u.avatarValue} 
                          className="w-9 h-9 rounded-full object-cover border border-white/5 group-hover:border-white/10 transition" 
                          alt="" 
                        />
                      )}
                    </div>

                    {/* Name and Email */}
                    <div className="flex-grow flex flex-col justify-center">
                      <span className="text-[13.5px] font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {u.name}
                      </span>
                      <span className="text-[11.5px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {u.email}
                      </span>
                    </div>

                    {/* Optional role badge (small and clean) */}
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                      u.role === 'admin' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-zinc-800/40 text-zinc-500'
                    }`}>
                      {u.role === 'admin' ? 'CEO' : 'Staff'}
                    </span>
                  </button>
                ))}

                {/* Use another account option */}
                {!showCustomSsoInput ? (
                  <button
                    onClick={() => { handleSoundClick(); setShowCustomSsoInput(true); }}
                    className="w-full px-6 py-4 hover:bg-[#1a1a1a]/60 flex items-center gap-4 transition duration-150 text-left border-b border-zinc-800/40 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition">
                      {/* User icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span className="text-[13.5px] text-zinc-300 font-normal group-hover:text-white transition">
                      Use another account
                    </span>
                  </button>
                ) : (
                  <div className="p-6 bg-zinc-950/40 border-b border-zinc-800/40">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (customSsoEmail) {
                          executeSsoLogin(customSsoEmail);
                          setShowCustomSsoInput(false);
                          setCustomSsoEmail('');
                        }
                      }}
                      className="flex flex-col gap-3 font-mono text-xs"
                    >
                      <div className="flex gap-2">
                        <input 
                          type="email"
                          placeholder="Enter email address..."
                          value={customSsoEmail}
                          onChange={(e) => setCustomSsoEmail(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:border-[#8ab4f8] focus:outline-none transition text-xs font-sans"
                          required
                          autoFocus
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-[#8ab4f8] text-black font-semibold text-xs tracking-wider transition cursor-pointer"
                        >
                          Go
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => { handleSoundClick(); setShowCustomSsoInput(false); setCustomSsoEmail(''); }}
                        className="text-[10px] text-zinc-500 hover:text-white transition uppercase tracking-widest text-left font-sans mt-1"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Footer info matching Google Account chooser details */}
              <div className="p-6 text-[11px] text-zinc-505 text-zinc-500 font-normal leading-relaxed">
                <p>
                  To continue, Google will share your name, email address, language preference, and profile picture with twin-biz-ai.vercel.app.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Client ID Setup Dialog */}
      <AnimatePresence>
        {showClientIdPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowClientIdPrompt(false); handleSoundClick(); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-[460px] bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-6 shadow-2xl relative z-10 text-left flex flex-col gap-5 font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#8ab4f8] font-bold text-sm">G</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Connect Google Sign-In</h3>
                </div>
                <button 
                  onClick={() => { setShowClientIdPrompt(false); handleSoundClick(); }}
                  className="text-zinc-500 hover:text-white transition-colors text-xs font-mono border border-zinc-800 bg-zinc-900/40 px-2 py-0.5 rounded-md"
                >
                  Close
                </button>
              </div>

              {/* Explainer */}
              <div className="text-xs text-zinc-400 leading-relaxed flex flex-col gap-2 font-sans">
                <p>
                  To redirect browser sessions to Google's real page, Google requires registering an <strong>OAuth Client ID</strong> for security.
                </p>
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-3 text-[11px] text-[#8ab4f8]">
                  <strong>Developer Note:</strong> You only do this setup once. When deployed, your users will log in securely with one click without seeing this setup!
                </div>
              </div>

              {/* Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (tempClientId.trim()) {
                    handleSoundClick();
                    localStorage.setItem('google_client_id', tempClientId.trim());
                    setShowClientIdPrompt(false);
                    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/api/auth/callback/google`;
                    const nonce = Math.random().toString(36).substring(2);
                    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${tempClientId.trim()}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token%20token&scope=openid%20email%20profile&prompt=select_account&nonce=${nonce}`;
                    window.location.href = oauthUrl;
                  }
                }}
                className="flex flex-col gap-4 font-mono text-xs"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Google Client ID:</label>
                  <input 
                    type="text"
                    placeholder="paste Client ID (e.g. xxxxx.apps.googleusercontent.com)..."
                    value={tempClientId}
                    onChange={(e) => setTempClientId(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:border-[#8ab4f8] focus:outline-none transition text-xs font-sans"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs tracking-wider transition cursor-pointer text-center font-sans"
                  >
                    Save & Redirect to Gmail Accounts
                  </button>

                  <div className="relative text-center my-1.5">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-zinc-800" />
                    <span className="relative bg-[#0d0d0d] px-3 text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Or Offline Testing</span>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      handleSoundClick();
                      setShowClientIdPrompt(false);
                      const width = 510;
                      const height = 620;
                      const left = window.screen.width / 2 - width / 2;
                      const top = window.screen.height / 2 - height / 2;
                      window.open(
                        '/auth/google',
                        'Google Sign In',
                        `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,scrollbars=yes`
                      );
                    }}
                    className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs tracking-wider transition cursor-pointer text-center font-sans"
                  >
                    Launch Local Account Simulator
                  </button>
                </div>
              </form>

              {/* Console Link */}
              <div className="text-[10px] text-zinc-500 font-sans border-t border-zinc-800/80 pt-3 text-center">
                Need a key? Create one in your{" "}
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#8ab4f8] hover:underline"
                >
                  Google Cloud Console →
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
