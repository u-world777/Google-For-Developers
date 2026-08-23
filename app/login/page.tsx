'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setSession, ROLE_DASHBOARD_ROUTES } from '@/lib/auth';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('mp.sharma@lokseva.gov.in');
  const [password, setPassword] = useState('securePass123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        // Update client session & role cookie from backend database user
        setSession(data.user);

        // Automatic role-based routing
        const targetRoute = redirectUrl || ROLE_DASHBOARD_ROUTES[data.user.role as keyof typeof ROLE_DASHBOARD_ROUTES] || '/dashboard/citizen';
        router.push(targetRoute);
      } else {
        setErrorMsg(data.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      console.error('Backend Login Submit Error:', err);
      setErrorMsg('Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 relative z-10">
      
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>LokSeva AI • Backend Database Auth Gateway</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
          Official Governance Sign-In
        </h1>
        <p className="text-xs text-slate-400">
          Enter your registered municipal email to authenticate directly against the governance roster database.
        </p>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2 text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} className="bg-slate-900/95 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl backdrop-blur-md">
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Registered Gov Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. mp.sharma@lokseva.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500 font-mono transition"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Security Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-mono transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Verifying Database Roster...</span>
            </div>
          ) : (
            <>
              <span>Authenticate & Access Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2 text-center border-t border-slate-800/80">
          <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Connected to Backend Database API (/api/auth/login)</span>
          </span>
        </div>

      </form>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <Suspense fallback={
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          <span>Loading Governance Portal...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
