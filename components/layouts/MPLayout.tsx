'use client';

import React from 'react';
import Header from '@/components/Header';
import { Sparkles, LayoutDashboard, Users, Building2, Settings, ShieldCheck } from 'lucide-react';

export function MPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        
        {/* Tailored MP Superuser Apex Sidebar */}
        <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-6 hidden md:block shrink-0 h-fit">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              MP
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Member of Parliament</h3>
              <p className="text-[10px] text-amber-400 font-semibold">Apex Executive Oversight</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <a href="/admin" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow">
              <LayoutDashboard className="w-4 h-4" />
              <span>Superuser Admin Panel</span>
            </a>
            <a href="/admin?tab=MEMBERS" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <Users className="w-4 h-4" />
              <span>Governance Staff Roster</span>
            </a>
            <a href="/projects" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <Building2 className="w-4 h-4" />
              <span>MPLADS Fund Sanctions</span>
            </a>
            <a href="/admin?tab=SETTINGS" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <Settings className="w-4 h-4" />
              <span>System & API Settings</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
