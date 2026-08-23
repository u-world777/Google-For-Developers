'use client';

import React from 'react';
import Header from '@/components/Header';
import { HardHat, Truck, FileText, Activity } from 'lucide-react';

export function EngineerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        
        {/* Tailored Engineer-Only Sidebar */}
        <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-6 hidden md:block shrink-0 h-fit">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold">
              ENG
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Chief Engineer Cell</h3>
              <p className="text-[10px] text-slate-400">Execution & Fleet Portal</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <a href="/dashboard/engineer" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-sky-600 text-white font-bold shadow">
              <HardHat className="w-4 h-4" />
              <span>Forwarded Work Orders</span>
            </a>
            <a href="/projects" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <Truck className="w-4 h-4" />
              <span>Machinery Fleet Dispatch</span>
            </a>
            <a href="/grievances" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <FileText className="w-4 h-4" />
              <span>Technical Inspection Roster</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
