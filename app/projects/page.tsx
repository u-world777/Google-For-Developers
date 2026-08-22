'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  Building2, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, 
  Sparkles, Camera, MapPin, ShieldCheck, Plus, FileText, BarChart2
} from 'lucide-react';

interface Project {
  id: string;
  code: string;
  name: string;
  wardName: string;
  allocatedCr: number;
  spentCr: number;
  stage: 'PROPOSAL' | 'ADMIN_APPROVAL' | 'TENDER' | 'IN_CONSTRUCTION' | 'PHOTO_VERIFIED' | 'COMPLETED';
  progressPercent: number;
  contractor: string;
  targetCompletionDate: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  verificationCoords: string;
  verificationStatus: 'VERIFIED' | 'PENDING_AUDIT';
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      code: 'MPL-2026-01',
      name: 'Ward 3 Weaver Common Facility Center & Super-Sewer Line',
      wardName: 'Ward 3 - Chowk & Silk Weaver Cluster',
      allocatedCr: 1.40,
      spentCr: 1.05,
      stage: 'IN_CONSTRUCTION',
      progressPercent: 75,
      contractor: 'Varanasi Heritage Infrastructure Pvt Ltd',
      targetCompletionDate: '2026-09-30',
      verificationCoords: '25.3102° N, 83.0104° E',
      verificationStatus: 'VERIFIED'
    },
    {
      id: 'proj-2',
      code: 'MPL-2026-02',
      name: 'Ward 5 Primary School Approach Road & 15 LED Street Poles',
      wardName: 'Ward 5 - Shivpur Peri-Urban Sector',
      allocatedCr: 1.65,
      spentCr: 0.66,
      stage: 'IN_CONSTRUCTION',
      progressPercent: 40,
      contractor: 'Purvanchal PWD Contractors',
      targetCompletionDate: '2026-10-15',
      verificationCoords: '25.3421° N, 82.9855° E',
      verificationStatus: 'PENDING_AUDIT'
    },
    {
      id: 'proj-3',
      code: 'MPL-2026-03',
      name: 'Ward 1 CHC Vaccine Cold Storage & Emergency Care Room',
      wardName: 'Ward 1 - Dashashwamedh Heritage Belt',
      allocatedCr: 1.25,
      spentCr: 1.20,
      stage: 'PHOTO_VERIFIED',
      progressPercent: 95,
      contractor: 'Apex Health Infra Ltd',
      targetCompletionDate: '2026-08-31',
      verificationCoords: '25.3055° N, 83.0088° E',
      verificationStatus: 'VERIFIED'
    }
  ]);

  const stages = [
    { key: 'PROPOSAL', label: 'Proposal' },
    { key: 'ADMIN_APPROVAL', label: 'Admin Sanction' },
    { key: 'TENDER', label: 'Tender' },
    { key: 'IN_CONSTRUCTION', label: 'Construction' },
    { key: 'PHOTO_VERIFIED', label: 'Geo-Photo Audit' },
    { key: 'COMPLETED', label: 'Completed' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>DPI Infrastructure Life-Cycle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              MPLADS Project & Photo Verification Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track project milestones from sanction to execution with geo-tagged photo verification to prevent fraud.
            </p>
          </div>
        </div>

        {/* Projects Matrix */}
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                      {project.code}
                    </span>
                    <span className="text-xs text-slate-400">{project.wardName}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white mt-1">{project.name}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-right">
                    <span className="text-slate-400 text-[10px] block">Allocated Fund</span>
                    <span className="font-extrabold text-emerald-400 text-sm font-mono">₹{project.allocatedCr} Cr</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-right">
                    <span className="text-slate-400 text-[10px] block">Target Completion</span>
                    <span className="font-bold text-slate-200 text-xs font-mono">{project.targetCompletionDate}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Stage Stepper */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Physical Progress Stage:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{project.progressPercent}% Complete</span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>

                {/* Stage Badges */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1 text-[10px]">
                  {stages.map((st, idx) => {
                    const isCompleted = idx <= stages.findIndex(s => s.key === project.stage);
                    return (
                      <div
                        key={st.key}
                        className={`p-2 rounded-lg text-center font-semibold border transition ${
                          isCompleted
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {st.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contractor & Geo Photo Verification Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Contractor Entity</span>
                  <p className="font-bold text-slate-200">{project.contractor}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-[11px]">{project.verificationCoords}</span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1 ${
                    project.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{project.verificationStatus === 'VERIFIED' ? 'Geo-Photo Verified' : 'Pending Audit'}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
