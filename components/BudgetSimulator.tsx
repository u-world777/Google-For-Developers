'use client';

import React, { useState } from 'react';
import { WardData, INITIAL_WARDS } from '@/lib/constituency-data';
import { optimizeBudgetAllocationAI, BudgetAllocationPlan } from '@/lib/gemini';
import { 
  PieChart as PieIcon, Sliders, Sparkles, RefreshCw, Landmark, 
  TrendingUp, AlertTriangle, ShieldCheck, DollarSign, CheckCircle2, ArrowUpRight, Loader2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface Props {
  initialWards: WardData[];
  totalMpladsCr: number;
}

export default function BudgetSimulator({ initialWards, totalMpladsCr }: Props) {
  // Weights (Sum up to 100)
  const [povertyWeight, setPovertyWeight] = useState(40);
  const [infraDeficitWeight, setInfraDeficitWeight] = useState(40);
  const [grievanceWeight, setGrievanceWeight] = useState(20);
  const [fundPoolCr, setFundPoolCr] = useState(totalMpladsCr);

  const [isSimulating, setIsSimulating] = useState(false);
  const [allocationPlan, setAllocationPlan] = useState<BudgetAllocationPlan | null>(null);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const plan = await optimizeBudgetAllocationAI(initialWards, fundPoolCr, {
        povertyWeight,
        infraDeficitWeight,
        grievanceWeight
      });
      setAllocationPlan(plan);
    } catch (err) {
      console.error("Budget Simulation Error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const chartData = allocationPlan ? allocationPlan.allocations.map((a) => ({
    name: a.wardCode,
    allocated: a.allocatedAmountCr,
    bpl: a.povertyIndex,
    infraDeficit: 100 - a.infraScore
  })) : initialWards.map((w) => ({
    name: w.code,
    allocated: Number((totalMpladsCr / initialWards.length).toFixed(2)),
    bpl: w.bplPercentage,
    infraDeficit: 100 - w.infrastructureScore
  }));

  return (
    <div className="space-y-8">
      
      {/* Top Configuration Controls Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Multi-Factor Socio-Economic Weight Balancer</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust priority sliders to simulate AI-weighted ward budget distribution
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium">MPLADS Pool:</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">₹{fundPoolCr} Cr</span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Slider 1: Poverty Density */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">BPL Poverty Weight</span>
              <span className="font-mono font-extrabold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                {povertyWeight}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={povertyWeight}
              onChange={(e) => setPovertyWeight(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Prioritizes wards with high BPL population %</p>
          </div>

          {/* Slider 2: Infrastructure Deficit */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">Infra Deficit Weight</span>
              <span className="font-mono font-extrabold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded">
                {infraDeficitWeight}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={infraDeficitWeight}
              onChange={(e) => setInfraDeficitWeight(Number(e.target.value))}
              className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Directs funds to wards with lowest infra scores</p>
          </div>

          {/* Slider 3: Grievance Intensity */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">Grievance Heatmap Weight</span>
              <span className="font-mono font-extrabold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded">
                {grievanceWeight}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={grievanceWeight}
              onChange={(e) => setGrievanceWeight(Number(e.target.value))}
              className="w-full accent-sky-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Directs funds to high complaint ticket zones</p>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Gemini Allocation Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Gemini Allocation Engine</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Results Matrix & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>Ward-wise Budget Distribution (₹ Crores)</span>
            </h4>
            <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800">
              {allocationPlan ? 'AI Optimized' : 'Equal Baseline'}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Bar dataKey="allocated" fill="#10b981" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#34d399' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Rationale Briefing Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4" />
              <span>Policy Strategic Rationale</span>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-200">
              {allocationPlan ? (
                <>
                  <p className="whitespace-pre-line">{allocationPlan.strategicRationale}</p>
                </>
              ) : (
                <p className="text-slate-400 italic">
                  Click "Run Gemini Allocation Engine" above to compute socio-economic fund weightings and policy justification.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>DPI Pillar 2 Strategy</span>
            <span className="font-mono text-emerald-400">Formulaic Fallback Active</span>
          </div>
        </div>

      </div>

    </div>
  );
}
