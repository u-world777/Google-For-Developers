'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { AuthGuard } from '@/components/rbac/AuthGuard';
import { useGovernance } from '@/lib/governance-context';
import { getPendingAuthorityLabel } from '@/lib/escalation-engine';
import { 
  Users, PlusCircle, Clock, CheckCircle2, MessageSquare, 
  MapPin, AlertCircle, FileText, Send
} from 'lucide-react';

export default function CitizenDashboardPage() {
  const { grievances, addGrievance } = useGovernance();
  const [complaintText, setComplaintText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    addGrievance({
      id: `griev-${Date.now()}`,
      ticketId: `LOK-2026-CIT-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      citizenName: 'Rameshwar Prasad (You)',
      phone: '+91 98390 12345',
      source: 'PORTAL',
      rawInput: complaintText,
      category: 'Water & Sanitation',
      priority: 'MEDIUM',
      status: 'PENDING_AI',
      wardId: 'ward-3',
      wardName: 'Ward 3 - Chowk & Silk Weaver Cluster',
      locationDetails: 'Powerloom Cluster Lane',
      sentiment: 'NEGATIVE',
      sentimentScore: -0.4,
      aiSummary: 'Citizen portal submission regarding ward drainage.',
      aiKeyEntities: { department: 'Sanitation' },
      assignedDepartment: 'Municipal Sanitation Dept',
      officerInCharge: 'Smt. Priya Gupta (Ward 3 Councillor)',
      assignedLevel: 1,
      assignedRole: 'COUNCILLOR',
      assignedOfficer: 'Smt. Priya Gupta (Ward 3 Councillor)',
      slaDays: 3,
      aiSuggestedAction: 'Inspect ward main drain.',
      generatedConstituentReply: { hi: 'आपकी शिकायत दर्ज कर ली गई है।', en: 'Your grievance has been logged.' }
    });

    setComplaintText('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <AuthGuard allowedRoles={['CITIZEN']}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />

        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
          
          {/* Isolated Role Sidebar */}
          <aside className="w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-6 hidden md:block shrink-0 h-fit">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                CP
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Citizen Portal</h3>
                <p className="text-[10px] text-slate-400">Ward 3 Resident View</p>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <a href="#my-tickets" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow">
                <FileText className="w-4 h-4" />
                <span>My Filed Grievances</span>
              </a>
              <a href="#new-ticket" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <PlusCircle className="w-4 h-4" />
                <span>File New Complaint</span>
              </a>
              <a href="/whatsapp-channel" className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Helpline</span>
              </a>
            </nav>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="text-amber-400 font-bold block">Assigned Ward Officer:</span>
              <p className="text-slate-200">Smt. Priya Gupta (Ward 3 Councillor)</p>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 space-y-6">
            
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                Citizen Self-Service Portal
              </span>
              <h1 className="text-2xl font-extrabold text-white">Track & File Local Ward Petitions</h1>
              <p className="text-xs text-slate-300">
                Directly connect with Ward 3 Councillor and track real-time resolution status of your complaints.
              </p>
            </div>

            {/* Quick Ingestion Form */}
            <div id="new-ticket" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Submit Grievance to Ward Councillor</span>
              </h2>

              {submitted && (
                <div className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your grievance was submitted and auto-routed to Level 1 Ward Councillor!</span>
                </div>
              )}

              <form onSubmit={handleCreateComplaint} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Describe your issue (e.g. Broken streetlight near weavers alley, blocked drain, etc.)..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-500"
                />

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow transition flex items-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Petition</span>
                </button>
              </form>
            </div>

            {/* Grievances Track List */}
            <div id="my-tickets" className="space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Your Registered Ward Petitions ({grievances.length})</span>
                <span className="text-xs text-slate-400 font-normal">Real-Time Hierarchy Tracking</span>
              </h2>

              <div className="space-y-3">
                {grievances.slice(0, 5).map((ticket) => {
                  const pendingAuth = getPendingAuthorityLabel(ticket.assignedLevel, ticket.assignedRole);
                  return (
                    <div key={ticket.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 text-xs shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-amber-400 font-bold">{ticket.ticketId}</span>
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Pending Authority: {pendingAuth}
                          </span>
                        </div>
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                          Status: {ticket.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-slate-200 leading-relaxed font-sans">"{ticket.rawInput}"</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{ticket.wardName}</span>
                        </span>
                        <span className="text-emerald-400 font-medium">Assigned Officer: {ticket.officerInCharge || ticket.assignedOfficer || 'Level 1: Ward Councillor'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
