'use client';

import React from 'react';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/rbac/AuthGuard';
import GrievanceCard from '@/components/GrievanceCard';
import { useGovernance } from '@/lib/governance-context';
import { filterGrievancesByRole } from '@/lib/escalation-engine';
import { HardHat, Truck, CheckCircle2, Wrench } from 'lucide-react';

export default function EngineerDashboardPage() {
  const { grievances, projects } = useGovernance();
  const engineerTickets = filterGrievancesByRole(grievances, 'ENGINEER');

  return (
    <AuthGuard allowedRoles={['ENGINEER', 'MP']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />

        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
          
          {/* Engineer Sidebar */}
          <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-6 hidden md:block shrink-0 h-fit">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold">
                L2
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Chief Engineer</h3>
                <p className="text-[10px] text-slate-400">Level 2 Infrastructure Cell</p>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-sky-600 text-white font-bold shadow">
                <span className="flex items-center space-x-2">
                  <HardHat className="w-4 h-4" />
                  <span>Forwarded Workorders</span>
                </span>
                <span className="bg-slate-950 px-2 py-0.5 rounded text-[10px] font-mono">{engineerTickets.length}</span>
              </button>

              <a href="/projects" className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <Truck className="w-4 h-4" />
                <span>Heavy Machinery Fleet</span>
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <div className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/30 p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full font-bold">
                Level 2 Execution Engineer Cell
              </span>
              <h1 className="text-2xl font-extrabold text-white">Technical Infrastructure & Contractor Fleet Dispatch</h1>
              <p className="text-xs text-slate-300">
                Execute forwarded municipal works, dispatch super-sucker sewer jetting units, and update road repair progress.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white">Technical Work Orders ({engineerTickets.length})</h2>
              <div className="space-y-4">
                {engineerTickets.map((ticket) => (
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
