'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ConstituencyMap from '@/components/ConstituencyMap';
import { INITIAL_CONSTITUENCY_OVERVIEW, INITIAL_WARDS, INITIAL_GRIEVANCES, Grievance, WardData } from '@/lib/constituency-data';
import { 
  Landmark, Users, FileCheck, DollarSign, TrendingUp, AlertTriangle, 
  MapPin, ArrowUpRight, Sparkles, Filter, CheckCircle2, Clock, 
  ChevronRight, Activity, ShieldAlert, FileText, PieChart, Bot, Zap, MessageSquare, Building2
} from 'lucide-react';

export default function DashboardPage() {
  const [overview] = useState(INITIAL_CONSTITUENCY_OVERVIEW);
  const [wards] = useState<WardData[]>(INITIAL_WARDS);
  const [grievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Hero Banner - MP Executive Briefing */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini DPI Intelligence Engine • Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {overview.mpName}
              </h1>
              <p className="text-sm text-slate-300">
                Constituency Development & Public Grievance Command Center for <span className="text-emerald-400 font-medium">{overview.name}</span>.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/grievances"
                className="px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Ingest Complaint</span>
              </Link>
              <Link
                href="/budget"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5"
              >
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Budget AI</span>
              </Link>
              <Link
                href="/whatsapp-channel"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Bot</span>
              </Link>
              <Link
                href="/jan-mitra"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 font-semibold rounded-xl text-xs transition flex items-center space-x-1.5"
              >
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Jan-Mitra Voice</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Key Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Constituency Pop.</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">485,000</span>
              <span className="text-xs text-emerald-400 font-medium">6 Wards</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Socio-economic density indexed</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Grievances This Month</span>
              <FileCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">{overview.totalGrievancesThisMonth}</span>
              <span className="text-xs text-emerald-400 font-medium">{overview.resolvedGrievancesThisMonth} Resolved</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Avg SLA Resolution: <strong className="text-slate-200">{overview.avgSlaDays} Days</strong></p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>MPLADS Fund Spent</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹{overview.allocatedBudgetCr} Cr</span>
              <span className="text-xs text-slate-400">of ₹{overview.annualMpladsBudgetCr} Cr</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(overview.allocatedBudgetCr / overview.annualMpladsBudgetCr) * 100}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Citizen Satisfaction</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">{overview.citizenSatisfactionRate}%</span>
              <span className="text-xs text-emerald-400 font-medium">+3.2% vs Q2</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Based on constituent feedback loops</p>
          </div>
        </div>

        {/* Gemini AI Daily Intelligence Briefing Section */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                  <span>Gemini Executive Morning Briefing</span>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                    22 AUG 2026
                  </span>
                </h3>
                <p className="text-xs text-slate-400">AI-synthesized priority actions from constituent reports & ward telemetry</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">Updated 10 minutes ago</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>CRITICAL HOTSPOT: Ward 3 Sewerage</span>
              </div>
              <p className="text-xs text-slate-300">
                250 weaver families in Ward 3 affected by a 12-day sewer blockage. High dengue risk. Jetting machine dispatched via executive escalation.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>SCHOOL ROAD SAFETY: Ward 5</span>
              </div>
              <p className="text-xs text-slate-300">
                School approach road dark spot caused child injuries. PWD & Municipal Electrical cell assigned for LED pole setup within 72 hrs.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold">
                <Activity className="w-4 h-4 shrink-0" />
                <span>BUDGET RE-ALLOCATION RECOMMENDATION</span>
              </div>
              <p className="text-xs text-slate-300">
                AI Budget Simulator suggests allocating ₹1.4 Cr to Ward 3 and ₹1.65 Cr to Ward 5 based on high BPL density and infrastructure deficit.
              </p>
            </div>
          </div>
        </div>

        {/* GIS Geo-Spatial Ward Map */}
        <ConstituencyMap />

      </main>
    </div>
  );
}
