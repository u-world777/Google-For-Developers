'use client';

import React, { useState } from 'react';
import { useGovernance } from '@/lib/governance-context';
import { 
  Landmark, ShieldAlert, FileText, CheckCircle2, AlertTriangle, 
  Send, Hammer, Users, Sparkles, Building2, Truck, Award, 
  ClipboardCheck, Clock, FileCheck, ArrowRight, Zap, RefreshCw, Layers
} from 'lucide-react';

export default function GovernanceRoleBanner() {
  const { activeRole, roleDetails } = useGovernance();
  const [sanctionSuccess, setSanctionSuccess] = useState<string | null>(null);
  const [directiveStatus, setDirectiveStatus] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [campCreated, setCampCreated] = useState<string | null>(null);

  const handleSanctionFund = (project: string, amount: string) => {
    setSanctionSuccess(`MPLADS Executive Order Signed: ₹${amount} Cr sanctioned for ${project}. Forwarded to District Treasury.`);
    setTimeout(() => setSanctionSuccess(null), 5000);
  };

  const handleSendDirective = (dept: string) => {
    setDirectiveStatus(`Official DM Directive issued to ${dept} with strict 24-Hour SLA penalty warning.`);
    setTimeout(() => setDirectiveStatus(null), 5000);
  };

  const handleDispatchMachinery = (machine: string, ward: string) => {
    setDispatchStatus(`Work-Order Dispatched: ${machine} deployed to ${ward}. GPS Tracking active.`);
    setTimeout(() => setDispatchStatus(null), 5000);
  };

  const handleOrganizeCamp = (scheme: string) => {
    setCampCreated(`Camp Scheduled: ${scheme} Enrollment Drive set for Ward 3 Community Center on Saturday.`);
    setTimeout(() => setCampCreated(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Easy User Help Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center space-x-3 text-xs text-amber-200 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <span>
          <strong>💡 Quick Guide:</strong> Choose your official role above (Member of Parliament, Collector, Engineer, or Councillor). The dashboard automatically presents simple 1-click buttons to approve funds, dispatch repair crews, or resolve citizen complaints!
        </span>
      </div>

      {/* Dynamic Role Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 animate-ping`} />
              <span className="text-slate-300">Governance Mode:</span>
              <span className={`font-bold font-mono ${roleDetails.accentColor}`}>{roleDetails.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center space-x-3">
              <span>{roleDetails.name}</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono font-normal">
                {roleDetails.badge}
              </span>
            </h1>
            <p className="text-sm text-slate-300">
              <strong className="text-slate-100">{roleDetails.department}</strong> — {roleDetails.primaryFocus}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1.5 shrink-0 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Role Permissions:</span>
              <span className="text-emerald-400 font-bold font-mono">AUTHORIZED</span>
            </div>
            <div className="text-slate-300 font-medium flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Features customized for {roleDetails.badge} view</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROLE 1: MEMBER OF PARLIAMENT (MP VIEW) EXCLUSIVE FEATURES */}
      {activeRole === 'MP' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature 1: MPLADS Executive Fund Sanctioning Console */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Landmark className="w-5 h-5" />
                <h3 className="text-base text-white">MPLADS Executive Sanction Console</h3>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                MP Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Review and approve instant fund sanctions for high-priority ward infrastructure projects.
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-xs">Ward 3 High-Capacity Sewer Jetting Project</h4>
                  <p className="text-[11px] text-slate-400">Req: ₹1.40 Cr • BPL Index: 44.5% • Urgency: Critical</p>
                </div>
                <button
                  onClick={() => handleSanctionFund("Ward 3 Sewer Jetting", "1.40")}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  Sanction Fund
                </button>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-xs">Ward 5 School Approach Road & LED Lighting</h4>
                  <p className="text-[11px] text-slate-400">Req: ₹1.65 Cr • Dark Spot Risk & Asphalt • Urgency: High</p>
                </div>
                <button
                  onClick={() => handleSanctionFund("Ward 5 School Road & Lighting", "1.65")}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  Sanction Fund
                </button>
              </div>
            </div>

            {sanctionSuccess && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/40 text-amber-300 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{sanctionSuccess}</span>
              </div>
            )}
          </div>

          {/* Feature 2: Official Press & Citizen Bulletin AI Generator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Send className="w-5 h-5" />
                <h3 className="text-base text-white">MP Official Constituent Release Generator</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                Press & WhatsApp
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Generate AI-verified press releases and official WhatsApp announcements for constituents.
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 space-y-2">
              <p className="text-emerald-400 font-semibold">📢 Official MP Communiqué — 23 Aug 2026</p>
              <p>
                "Dear Citizens of Varanasi South, today I have reviewed constituent grievances and approved immediate execution orders for Ward 3 drainage & Ward 5 road lighting. Our team is committed to 100% SLA resolution."
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition">
                Copy WhatsApp Broadcast
              </button>
              <button className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition">
                Publish to Media Cell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 2: DISTRICT COLLECTOR (DM / IAS VIEW) EXCLUSIVE FEATURES */}
      {activeRole === 'COLLECTOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature 1: Departmental SLA Compliance & Penalty Matrix */}
          <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-sky-400 font-bold">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base text-white">DM Inter-Agency SLA Audit Matrix</h3>
              </div>
              <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono">
                IAS Audit Mode
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Monitor department resolution velocity and issue binding administrative directives.
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Sanitation & Jal Sansthan</span>
                  <p className="text-[11px] text-emerald-400">SLA Rate: 94% Resolution Velocity</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg font-mono font-bold">
                  GRADE A
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Public Works Department (PWD)</span>
                  <p className="text-[11px] text-rose-400">SLA Rate: 68% (12 Tickets Pending &gt; 5 Days)</p>
                </div>
                <button
                  onClick={() => handleSendDirective("PWD Chief Engineer")}
                  className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg text-xs transition"
                >
                  Issue DM Show-Cause
                </button>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">State Electricity Co.</span>
                  <p className="text-[11px] text-amber-400">SLA Rate: 82% (4 Streetlight Complaints)</p>
                </div>
                <button
                  onClick={() => handleSendDirective("Electricity SDO")}
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition"
                >
                  Dispatch 24h Order
                </button>
              </div>
            </div>

            {directiveStatus && (
              <div className="p-3 bg-sky-950/40 border border-sky-500/40 text-sky-300 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{directiveStatus}</span>
              </div>
            )}
          </div>

          {/* Feature 2: District Emergency & Disaster Taskforce Directives */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base text-white">Disaster Risk & Dengue Prevention Control</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                Magistrate Control
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Deploy health taskforce units and fogging teams based on GIS mosquito breeding hotspot maps.
            </p>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-200 font-semibold">
                <span>Ward 3 Weavers Colony Fogging Team:</span>
                <span className="text-amber-400">ACTIVE</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                CMO office instructed to stock 500 dengue test kits at nearest Primary Health Center.
              </p>
            </div>
            <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition">
              Dispatch District Health Inspection Team
            </button>
          </div>
        </div>
      )}

      {/* ROLE 3: CHIEF EXECUTIVE ENGINEER (PWD VIEW) EXCLUSIVE FEATURES */}
      {activeRole === 'ENGINEER' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature 1: Contractor Tender Approval & Work-Order Clearance */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Hammer className="w-5 h-5" />
                <h3 className="text-base text-white">Contractor Tenders & Technical Approvals</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                PWD Engineer
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Verify site inspection geotags and approve contractor technical estimates.
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Tender #PWD-2026-88: Ward 3 Pipeline</span>
                  <p className="text-[11px] text-slate-400">Bidder: Apex Infratech • Estimate: ₹42 Lakhs</p>
                </div>
                <button
                  onClick={() => handleDispatchMachinery("Pipeline Contracting Team", "Ward 3")}
                  className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Approve Bid
                </button>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">Tender #PWD-2026-92: School Road Repair</span>
                  <p className="text-[11px] text-slate-400">Bidder: Ganga Road Builders • Estimate: ₹18 Lakhs</p>
                </div>
                <button
                  onClick={() => handleDispatchMachinery("Road Roller & Bitumen Unit", "Ward 5")}
                  className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Approve Bid
                </button>
              </div>
            </div>

            {dispatchStatus && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{dispatchStatus}</span>
              </div>
            )}
          </div>

          {/* Feature 2: Heavy Machinery & Maintenance Fleet Dispatch */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-teal-400 font-bold">
                <Truck className="w-5 h-5" />
                <h3 className="text-base text-white">Municipal Fleet Dispatch Telemetry</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded-full font-mono">
                GPS Tracked
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Real-time location of high-pressure sewer jetting machines and electrical repair trucks.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-slate-400 text-[10px]">Sewer Jetting Unit #04</span>
                <p className="font-bold text-emerald-400">En Route: Ward 3</p>
                <p className="text-[10px] text-slate-500">ETA: 20 Mins</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-slate-400 text-[10px]">LED Bucket Truck #02</span>
                <p className="font-bold text-sky-400">Stationed: Ward 5</p>
                <p className="text-[10px] text-slate-500">Active Work</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 4: WARD COUNCILLOR (LOCAL WARD VIEW) EXCLUSIVE FEATURES */}
      {activeRole === 'COUNCILLOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature 1: Grassroots Ward 3 Resident Petitions Queue */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                <Users className="w-5 h-5" />
                <h3 className="text-base text-white">Ward 3 Resident Petition Desk</h3>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                Ward 3 Councillor
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Direct resident requests logged during morning doorstep constituent meetings.
            </p>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Ramesh Chandra (Weavers Colony)</span>
                  <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">High Urgency</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  "Need drinking water tanker at Lane 4 due to main pipe repair work."
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Smt. Sunita Devi (Ward 3 Basti)</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Resolved</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  "Ayushman Bharat card application verified at Councillor desk."
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Local Welfare Scheme Camp Organizer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold">
                <Award className="w-5 h-5" />
                <h3 className="text-base text-white">Ward Welfare Camp Organizer</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                Community Drive
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Schedule grassroots welfare registration camps for Ward 3 residents.
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleOrganizeCamp("Ayushman Bharat Golden Card")}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition text-left px-3 flex items-center justify-between"
              >
                <span>Schedule Ayushman Card Drive</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              <button
                onClick={() => handleOrganizeCamp("PM SVANidhi Vendor Loan Camp")}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition text-left px-3 flex items-center justify-between"
              >
                <span>Schedule Street Vendor Loan Camp</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>

            {campCreated && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{campCreated}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
