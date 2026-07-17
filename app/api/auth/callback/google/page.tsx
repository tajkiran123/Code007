"use client";

import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function GoogleAuthCallback() {
  const [status, setStatus] = useState('Initializing telemetry link...');
  const [logMessages, setLogMessages] = useState<string[]>([
    'NODE_PORT: 5000',
    'CONNECTION: ESTABLISHED',
    'SSO_CALLBACK: RECEIVED'
  ]);

  const addLog = (msg: string) => {
    setLogMessages(prev => [...prev, msg].slice(-4));
  };

  const handleGoogleLoginBackend = async (idToken: string) => {
    setStatus('Authenticating with node gateway...');
    addLog('HANDSHAKE: SENDING_JWT');
    
    try {
      const res = await fetch(`${API_BASE}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      if (res.ok) {
        const data = await res.json();
        addLog('SESSION: VERIFIED');
        localStorage.setItem('workquest_token', data.token);
        localStorage.setItem('workquest_user', JSON.stringify(data.user));
        
        setStatus('Access granted. Synchronizing systems...');
        addLog('REDIRECTING: DASHBOARD');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else {
        const errData = await res.json();
        addLog('ERROR: VERIFICATION_FAILED');
        console.error('Backend Google Auth failed:', errData);
        alert(errData.error || "Google authentication failed.");
        window.location.href = '/';
      }
    } catch (err) {
      console.warn("Google SSO Backend authentication offline fallback", err);
      addLog('OFFLINE: FALLBACK_ACTIVE');
      
      let email = 'tajkiranjunnuri@gmail.com';
      try {
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        if (payload.email) email = payload.email;
      } catch (e) {
        addLog('JWT_PARSE: ERROR');
      }
      
      const role = (email.toLowerCase() === 'tajkiranjunnuri@gmail.com' || email.toLowerCase() === 'bhanug5616@gmail.com') ? 'admin' : 'employee';
      executeOfflineLogin(email, role);
    }
  };

  const executeOfflineLogin = async (email: string, role: string, name?: string, picture?: string) => {
    addLog('DATABASE: OFFLINE');
    setStatus('Configuring standalone session...');
    
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const users = await res.json();
        const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          addLog('OFFLINE_MATCH: SUCCESS');
          const mockUser = {
            id: found._id,
            name: found.name,
            email: found.email,
            role: found.role,
            department: found.department,
            employeeId: found.employeeId,
            avatar: found.avatar,
            xp: found.xp || 100,
            level: found.level || 1,
            streak: 5
          };
          localStorage.setItem('workquest_token', 'mock_token_' + found.employeeId);
          localStorage.setItem('workquest_user', JSON.stringify(mockUser));
          window.location.href = '/';
          return;
        }
      }
    } catch (err) {
      console.warn("Users sync offline", err);
    }

    // Default mock users list from mockData
    const mockUsers = [
      {
        id: 'adm-1',
        name: 'Tajkiran Junnuri',
        email: 'tajkiranjunnuri@gmail.com',
        role: 'Admin',
        department: 'Executive Office',
        employeeId: 'CEO-001',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
        xp: 12500,
        level: 8,
        streak: 15,
        themeColor: 'emerald',
        skipsLeft: 3,
        streakFreezeActive: true,
        salary: '$180,000'
      },
      {
        id: 'emp-1',
        name: 'Bhanu G',
        email: 'bhanug5616@gmail.com',
        role: 'Admin',
        department: 'Product Strategy',
        employeeId: 'ADM-002',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        xp: 8520,
        level: 6,
        streak: 12,
        themeColor: 'cyan',
        skipsLeft: 1,
        streakFreezeActive: false,
        salary: '$145,000'
      },
      {
        id: 'emp-3',
        name: 'Hello Hi',
        email: 'hellbbhh5575@gmail.com',
        role: 'Employee',
        department: 'Design',
        employeeId: 'EMP-003',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        xp: 4320,
        level: 3,
        streak: 4,
        themeColor: 'rose',
        skipsLeft: 0,
        streakFreezeActive: false,
        salary: '$92,000'
      }
    ];

    const match = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    const finalUser = match || {
      id: 'emp-new-' + Math.floor(Math.random() * 1000),
      name: name || email.split('@')[0],
      email: email,
      role: role === 'admin' ? 'Admin' : 'Employee',
      department: role === 'admin' ? 'Executive' : 'Engineering',
      employeeId: 'EMP-' + Math.floor(Math.random() * 10000),
      avatar: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      xp: 100,
      level: 1,
      streak: 1,
      themeColor: 'cyan',
      skipsLeft: 1,
      streakFreezeActive: false,
      salary: '$75,000'
    };

    localStorage.setItem('workquest_token', 'mock_token_' + finalUser.employeeId);
    localStorage.setItem('workquest_user', JSON.stringify(finalUser));
    addLog('STANDALONE: ACTIVE');
    
    setTimeout(() => {
      window.location.href = '/';
    }, 1200);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token=') || hash.includes('id_token='))) {
        addLog('HASH_PARAMS: FOUND');
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        
        window.history.replaceState(null, '', window.location.pathname);
        
        if (idToken) {
          handleGoogleLoginBackend(idToken);
        } else if (accessToken) {
          addLog('TOKEN_VERIFY: REQUESTING');
          setStatus('Resolving token credentials...');
          fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
            .then(res => {
              if (res.ok) return res.json();
              throw new Error("Failed to query Google UserInfo");
            })
            .then(userInfo => {
              addLog('USERINFO: FETCHED');
              const email = userInfo.email;
              const name = userInfo.name;
              const picture = userInfo.picture;
              const role = (email.toLowerCase() === 'tajkiranjunnuri@gmail.com' || email.toLowerCase() === 'bhanug5616@gmail.com') ? 'admin' : 'employee';
              
              executeOfflineLogin(email, role, name, picture);
            })
            .catch(err => {
              addLog('ERROR: API_RESOLVE_FAIL');
              console.error("Failed to authenticate Google access token:", err);
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
            });
        }
      } else {
        addLog('HASH_PARAMS: MISSING');
        setStatus('No telemetry parameters detected. Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center p-4 font-sans text-left selection:bg-cyan-500/30 text-white">
      <div className="relative w-full max-w-md bg-zinc-950/70 border border-white/5 rounded-2xl p-9 flex flex-col justify-center min-h-[380px] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Background glow grids */}
        <div className="absolute -top-40 -left-40 w-85 h-85 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-85 h-85 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="py-6 flex flex-col items-center justify-center text-center font-mono">
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
              Authenticating
            </h3>
            <p className="text-[9px] text-[#00e5ff] uppercase tracking-wider min-h-[14px]">
              {status}
            </p>
          </div>
          
          {/* Live console logging logs */}
          <div className="w-full bg-zinc-950/95 border border-white/5 rounded-lg p-4 text-left text-[9px] text-zinc-500 font-mono space-y-1.5 select-none max-w-xs overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
            {logMessages.map((msg, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 pb-1 last:border-0 last:pb-0">
                <span>{msg.split(':')[0]}:</span>
                <span className={
                  msg.includes('ESTABLISHED') || msg.includes('SUCCESS') || msg.includes('VERIFIED')
                    ? 'text-emerald-400 font-bold' 
                    : msg.includes('ERROR') || msg.includes('FAILED')
                    ? 'text-red-400 font-bold'
                    : 'text-[#00e5ff]'
                }>{msg.split(':')[1] || ''}</span>
              </div>
            ))}
            <div className="text-[7px] text-zinc-650 border-t border-white/5 pt-1.5 text-center mt-2">
              TELEMETRY NODE SECURE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
