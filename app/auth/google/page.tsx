"use client";

import React from 'react';

interface SsoUser {
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatarType: 'letter' | 'image';
  avatarValue: string;
  color?: string;
}

const GOOGLE_ACCOUNTS: SsoUser[] = [
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

export default function GoogleAuthPopup() {
  const handleSelect = (user: SsoUser) => {
    if (window.opener) {
      const mockPayload = {
        iss: 'https://accounts.google.com',
        sub: 'mock_sub_' + Math.floor(Math.random() * 100000000),
        email: user.email,
        name: user.name,
        picture: user.avatarType === 'image' ? user.avatarValue : '',
        aud: '547514809228-kgg4h76v9q8mop43o8lqpe4o6oasv652.apps.googleusercontent.com',
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      const mockJwt = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.' + btoa(JSON.stringify(mockPayload)) + '.mock_signature';

      window.opener.postMessage(
        {
          type: 'google-sso-success',
          idToken: mockJwt,
          email: user.email,
          role: user.role,
          name: user.name,
          picture: user.avatarType === 'image' ? user.avatarValue : ''
        },
        window.location.origin
      );
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4 font-sans text-left selection:bg-blue-500/30">
      <div className="w-full max-w-[440px] bg-[#0d0d0d] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Google Header Logo & Subtitle */}
        <div className="p-6 pb-4 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.87h12.66c-.55 2.94-2.22 5.44-4.72 7.11l7.33 5.68C43.5 36.8 46.5 31.06 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.33-5.68c-2.03 1.36-4.64 2.19-8.56 2.19-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-[13px] text-zinc-300 font-medium">Sign in with Google</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-normal text-white tracking-tight">Choose an account</h2>
            <p className="text-[13px] text-zinc-400 font-normal">
              to continue to <span className="text-[#8ab4f8]">twin-biz-ai.vercel.app</span>
            </p>
          </div>
        </div>

        {/* Account selection list */}
        <div className="flex flex-col max-h-[380px] overflow-y-auto border-t border-zinc-800/80">
          {GOOGLE_ACCOUNTS.map((u) => (
            <button
              key={u.email}
              onClick={() => handleSelect(u)}
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

              {/* CEO/Staff Role Indicator */}
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                u.role === 'admin' 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-zinc-800/40 text-zinc-550 text-zinc-500'
              }`}>
                {u.role === 'admin' ? 'CEO' : 'Staff'}
              </span>
            </button>
          ))}

          {/* Use another account option */}
          <button
            onClick={() => {
              const email = prompt("Enter your Google Account email address:");
              if (email) {
                const role = (email.toLowerCase() === 'tajkiranjunnuri@gmail.com' || email.toLowerCase() === 'bhanug5616@gmail.com') ? 'admin' : 'employee';
                handleSelect({
                  name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
                  email: email,
                  role: role,
                  avatarType: 'letter',
                  avatarValue: email.substring(0, 1).toUpperCase(),
                  color: '#0284c7'
                });
              }
            }}
            className="w-full px-6 py-4 hover:bg-[#1a1a1a]/60 flex items-center gap-4 transition duration-150 text-left border-b border-zinc-800/40 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-[13.5px] text-zinc-300 font-normal group-hover:text-white transition">
              Use another account
            </span>
          </button>
        </div>

        {/* Consent terms */}
        <div className="p-6 text-[11px] text-zinc-500 font-normal leading-relaxed">
          <p>
            To continue, Google will share your name, email address, language preference, and profile picture with twin-biz-ai.vercel.app.
          </p>
        </div>
      </div>
    </div>
  );
}
