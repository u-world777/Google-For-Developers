'use client';

import React from 'react';
import Header from '@/components/Header';
import BudgetSimulator from '@/components/BudgetSimulator';
import { INITIAL_CONSTITUENCY_OVERVIEW, INITIAL_WARDS } from '@/lib/constituency-data';
import { PieChart, Landmark, TrendingUp, Sparkles } from 'lucide-react';

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <PieChart className="w-4 h-4" />
              <span>DPI Pillar 2 • Resource & Budget Planning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              MPLADS & Ward Funds Optimization Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              AI-driven socio-economic budget allocation balancer based on poverty rates, infrastructure deficits, and citizen complaint heatmaps.
            </p>
          </div>
        </div>

        <BudgetSimulator initialWards={INITIAL_WARDS} totalMpladsCr={INITIAL_CONSTITUENCY_OVERVIEW.annualMpladsBudgetCr} />

      </main>
    </div>
  );
}
