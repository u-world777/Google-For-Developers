'use client';

import React from 'react';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/rbac/AuthGuard';
import GrievanceCard from '@/components/GrievanceCard';
import { useGovernance } from '@/lib/governance-context';
import { filterGrievancesByRole } from '@/lib/escalation-engine';
import { Building2, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';

export default function CouncillorDashboardPage() {
  const { grievances } = useGovernance();
  const councillorTickets = filterGrievancesByRole(grievances, 'COUNCILLOR');

  return (
    <AuthGuard allowedRoles={['COUNCILLOR', 'MP']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />

        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
          
          {/* Councillor Sidebar */}
          <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-6 hidden md:block shrink-0 h-fit">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                L1
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Ward Councillor</h3>
                <p className="text-[10px] text-slate-400">Level 1 First Responder</p>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow">
                <span className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>Ward Petitions</span>
                </span>
                <span className="bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono">{councillorTickets.length}</span>
              </button>
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 space-y-6">
            <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                Level 1 Ward Control Panel
              </span>
              <h1 className="text-2xl font-extrabold text-white">Ward 3 Doorstep Verification & Forwarding</h1>
              <p className="text-xs text-slate-300">
                Inspect incoming citizen grievances, conduct ground verification, or elevate complex technical issues to PWD Engineers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white">Ward Grievance Queue ({councillorTickets.length})</h2>
              <div className="space-y-4">
                {councillorTickets.map((ticket) => (
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
