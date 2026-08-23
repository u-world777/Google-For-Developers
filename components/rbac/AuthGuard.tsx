'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, ROLE_DASHBOARD_ROUTES, UserSession } from '@/lib/auth';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';

interface AuthGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userSession = getSession();

    if (!userSession) {
      // Not logged in -> Redirect to central /login portal
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      setLoading(false);
      return;
    }

    setSessionState(userSession);

    // Check if user's role is allowed on this route
    const userRole = userSession.role;
    const hasAccess = allowedRoles.includes(userRole) || userRole === 'MP'; // MP can access as Superuser

    if (!hasAccess) {
      // Unauthorized role -> Redirect to designated dashboard
      const targetRoute = ROLE_DASHBOARD_ROUTES[userRole] || '/login';
      setTimeout(() => {
        router.push(targetRoute);
      }, 2000);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    setLoading(false);
  }, [router, pathname, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Verifying Security Token & Role Permissions...</p>
      </div>
    );
  }

  if (!isAuthorized && session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400">
          <ShieldAlert className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-lg font-bold">Access Denied: Protected Route</h2>
          <p className="text-xs text-slate-300 max-w-md mt-1">
            Your current role (<strong className="text-amber-400">{session.role}</strong>) does not have authorization to view <code className="bg-slate-900 px-2 py-0.5 rounded text-rose-300 font-mono">{pathname}</code>.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Redirecting to your authorized dashboard ({ROLE_DASHBOARD_ROUTES[session.role]})...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
