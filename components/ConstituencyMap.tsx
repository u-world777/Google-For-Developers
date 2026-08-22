'use client';

import React, { useState } from 'react';
import { WardData, INITIAL_WARDS, Grievance, INITIAL_GRIEVANCES } from '@/lib/constituency-data';
import { 
  MapPin, AlertTriangle, Layers, Filter, Sparkles, Building2, 
  Droplets, Construction, Activity, ArrowUpRight, ShieldCheck, UserCheck
} from 'lucide-react';

export default function ConstituencyMap() {
  const [wards] = useState<WardData[]>(INITIAL_WARDS);
  const [grievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [selectedWard, setSelectedWard] = useState<WardData | null>(INITIAL_WARDS[2]); // Default Ward 3 Chowk
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const filteredGrievances = selectedCategoryFilter === 'ALL'
    ? grievances
    : grievances.filter(g => g.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      
      {/* Map Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Constituency Geo-Spatial GIS Telemetry & Heatmap</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Interactive ward-level infrastructure health index & live citizen issue pins</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span>Critical (&lt;55)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 ml-1.5" />
            <span>Moderate</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 ml-1.5" />
            <span>Good</span>
          </div>

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Pins ({grievances.length})</option>
            <option value="Water">Water & Sanitation</option>
            <option value="Roads">Roads & Lighting</option>
            <option value="Healthcare">Healthcare</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Vector Map Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/80 rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Map Grid Wards Layout */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {wards.map((ward) => {
              const isSelected = selectedWard?.id === ward.id;
              const statusColor = ward.infrastructureScore < 55 ? 'border-rose-500/60 bg-rose-950/20 text-rose-300' :
                                ward.infrastructureScore < 70 ? 'border-amber-500/50 bg-amber-950/20 text-amber-300' :
                                'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
              
              const wardPins = filteredGrievances.filter(g => g.wardId === ward.id);

              return (
                <div
                  key={ward.id}
                  onClick={() => setSelectedWard(ward)}
                  className={`border rounded-2xl p-3 sm:p-4 cursor-pointer transition-all space-y-2 relative group ${statusColor} ${
                    isSelected ? 'ring-2 ring-emerald-400 scale-[1.02] shadow-xl' : 'hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white">
                      {ward.code}
                    </span>
                    <span className="text-[10px] font-extrabold font-mono">
                      Score: {ward.infrastructureScore}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{ward.name.split(' - ')[1]}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pop: {(ward.population / 1000).toFixed(0)}k</p>
                  </div>

                  {/* Grievance Pins Badge on Map */}
                  {wardPins.length > 0 && (
                    <div className="flex items-center space-x-1 pt-1">
                      {wardPins.map(pin => (
                        <span
                          key={pin.id}
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md animate-pulse ${
                            pin.priority === 'CRITICAL' ? 'bg-rose-500 text-white' :
                            pin.priority === 'HIGH' ? 'bg-amber-500 text-slate-950' : 'bg-sky-400 text-slate-950'
                          }`}
                          title={`Pin: ${pin.ticketId} - ${pin.category}`}
                        >
                          <MapPin className="w-3 h-3" />
                        </span>
                      ))}
                      <span className="text-[9px] text-slate-400 font-mono">({wardPins.length})</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Footer Info */}
          <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1">
            <span className="flex items-center space-x-1 text-[11px]">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Varanasi South: 25.3176° N, 82.9739° E</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">Live Telemetry Synchronized</span>
          </div>
        </div>

        {/* Right Column: Ward Telemetry Inspector Drawer (5 cols) */}
        {selectedWard ? (
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {selectedWard.code} INSPECTOR
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white mt-1">{selectedWard.name}</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                selectedWard.infrastructureScore < 55 ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              }`}>
                {selectedWard.infrastructureScore}/100
              </span>
            </div>

            {/* Ward Metrics grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">BPL Density</span>
                <p className="font-bold text-white text-xs sm:text-sm">{selectedWard.bplPercentage}%</p>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Literacy Rate</span>
                <p className="font-bold text-white text-xs sm:text-sm">{selectedWard.literacyRate}%</p>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Water Index</span>
                <p className="font-bold text-sky-400 text-xs sm:text-sm">{selectedWard.waterAccessScore}%</p>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px]">Healthcare</span>
                <p className="font-bold text-emerald-400 text-xs sm:text-sm">{selectedWard.healthcareDensity} Clinics/10k</p>
              </div>
            </div>

            {/* Active Grievances in this Ward */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active Issue Pins in {selectedWard.code}
              </span>
              
              {grievances.filter(g => g.wardId === selectedWard.id).map(g => (
                <div key={g.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-emerald-400 font-semibold">{g.ticketId}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      g.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {g.priority}
                    </span>
                  </div>
                  <p className="text-slate-200 text-[11px] line-clamp-2">"{g.rawInput}"</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">Assigned: {g.assignedDepartment}</span>
                </div>
              ))}

              {grievances.filter(g => g.wardId === selectedWard.id).length === 0 && (
                <p className="text-xs text-slate-500 italic py-1">No critical open issue pins reported for this ward.</p>
              )}
            </div>

            {/* Urgent Needs list */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Priority Infrastructural Needs</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedWard.urgentNeeds.map((need, idx) => (
                  <span key={idx} className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2 py-0.5 rounded-lg font-medium">
                    ⚡ {need}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
