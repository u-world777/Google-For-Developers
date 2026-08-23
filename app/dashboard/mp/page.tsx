'use client';

import React from 'react';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/rbac/AuthGuard';
import GrievanceCard from '@/components/GrievanceCard';
import { useGovernance } from '@/lib/governance-context';
import { filterGrievancesByRole } from '@/lib/escalation-engine';
import { Sparkles, LayoutDashboard, Building2, Activity, Settings, Users, FileText } from 'lucide-react';

export default function MPDashboardPage() {
  const { grievances, members, projects } = useGovernance();
  const mpTickets = filterGrievancesByRole(grievances, 'MP');

  return (
    <AuthGuard allowedRoles={['MP']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />

        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
          
          {/* MP Superuser Sidebar */}
          <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-6 hidden md:block shrink-0 h-fit">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                L4
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Member of Parliament</h3>
                <p className="text-[10px] text-amber-400 font-semibold">Apex Superuser Administration</p>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <a href="/admin" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow">
                <LayoutDashboard className="w-4 h-4" />
                <span>Superuser Admin Panel</span>
              </a>

              <a href="/admin?tab=MEMBERS" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <span className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4" />
                  <span>Governance Staff</span>
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">{members.length}</span>
              </a>

              <a href="/projects" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <span className="flex items-center space-x-2.5">
                  <Building2 className="w-4 h-4" />
                  <span>MPLADS Budget Projects</span>
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">{projects.length}</span>
              </a>

              <a href="/admin?tab=SETTINGS" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                Level 4 Apex Executive Control
              </span>
              <h1 className="text-2xl font-extrabold text-white">Constituency Macro Telemetry & MP Fund Sanctions</h1>
              <p className="text-xs text-slate-300">
                Full high-level oversight of all constituency wards, MPLADS emergency fund approvals, and officer rosters.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white">Constituency Master Petitions ({mpTickets.length})</h2>
              <div className="space-y-4">
                {mpTickets.map((ticket) => (
                  <GrievanceCard key={ticket.id} grievance={ticket} />
                ))}
              </div>
            </div>
          </main>

        </div>
      </div>
    </AuthGuard>
  );
}
