'use client';

import React, { useState } from 'react';
import { Grievance } from '@/lib/constituency-data';
import { 
  FileText, Sparkles, Send, CheckCircle2, Clock, User, Phone, MapPin, 
  AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Copy, Check, MessageSquare
} from 'lucide-react';

interface GrievanceCardProps {
  grievance: Grievance;
  onStatusChange?: (id: string, newStatus: Grievance['status']) => void;
}

export default function GrievanceCard({ grievance, onStatusChange }: GrievanceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedHi, setCopiedHi] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [activeTab, setActiveTab] = useState<'HI' | 'EN'>('HI');
  const [dispatched, setDispatched] = useState(grievance.status === 'DISPATCHED' || grievance.status === 'RESOLVED');

  const copyText = (text: string, type: 'HI' | 'EN') => {
    navigator.clipboard.writeText(text);
    if (type === 'HI') {
      setCopiedHi(true);
      setTimeout(() => setCopiedHi(false), 2000);
    } else {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    }
  };

  const handleDispatch = () => {
    setDispatched(true);
    if (onStatusChange) {
      onStatusChange(grievance.id, 'DISPATCHED');
    }
  };

  return (
    <div className={`bg-slate-900/90 border rounded-2xl p-5 space-y-4 shadow-xl transition-all ${
      grievance.priority === 'CRITICAL' ? 'border-rose-500/40 bg-slate-900/95' :
      grievance.priority === 'HIGH' ? 'border-amber-500/30' : 'border-slate-800'
    }`}>
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {grievance.ticketId}
          </span>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
            grievance.priority === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' :
            grievance.priority === 'HIGH' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
            'bg-sky-500/10 border-sky-500/30 text-sky-400'
          }`}>
            {grievance.priority}
          </span>
          <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded">
            {grievance.category}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>SLA: {grievance.slaDays} Day(s)</span>
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
            dispatched ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
          }`}>
            {dispatched ? 'DISPATCHED TO DEPT' : grievance.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Citizen Raw Complaint & Ward details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-slate-100">{grievance.citizenName}</span>
            {grievance.phone && <span className="text-slate-400 font-mono">({grievance.phone})</span>}
          </div>
          <span className="text-slate-400 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{grievance.wardName}</span>
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-sans leading-relaxed">
          <span className="text-slate-400 text-[10px] block font-mono uppercase mb-1">Source: {grievance.source.replace('_', ' ')}</span>
          "{grievance.rawInput}"
        </div>
      </div>

      {/* Gemini Entity Breakdown Box */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/30 border border-emerald-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Gemini NLP Intelligence Summary</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Sentiment: <strong className={grievance.sentimentScore < 0 ? 'text-rose-400' : 'text-emerald-400'}>{grievance.sentimentScore}</strong>
          </span>
        </div>
        <p className="text-xs text-slate-200">{grievance.aiSummary}</p>

        {grievance.aiKeyEntities && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Impacted Population</span>
              <span className="font-semibold text-slate-200">{grievance.aiKeyEntities.affectedCount || 'Local Community'}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Extracted Location</span>
              <span className="font-semibold text-slate-200">{grievance.locationDetails}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Officer Assigned</span>
              <span className="font-semibold text-emerald-300">{grievance.officerInCharge}</span>
            </div>
          </div>
        )}
      </div>

      {/* Expand/Collapse Toggle for Official Constituent Reply */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-white flex items-center space-x-1 font-medium transition"
        >
          <span>{expanded ? 'Hide Generated Response Draft' : 'Review & Edit AI Response Draft'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="flex items-center space-x-2">
          {!dispatched ? (
            <button
              onClick={handleDispatch}
              className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Ticket to {grievance.assignedDepartment.split(' ')[0]}</span>
            </button>
          ) : (
            <span className="text-emerald-400 font-semibold flex items-center space-x-1 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Dispatched to Nodal Officer</span>
            </span>
          )}
        </div>
      </div>

      {/* Expanded Constituent Response Draft Box */}
      {expanded && (
        <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Automated MP Response Draft for Constituent</span>
            </span>

            <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('HI')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  activeTab === 'HI' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                onClick={() => setActiveTab('EN')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  activeTab === 'EN' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="relative bg-slate-900 p-3 rounded-lg border border-slate-800 font-sans text-slate-200 leading-relaxed">
            {activeTab === 'HI' ? (
              <p>{grievance.generatedConstituentReply.hi.replace('#TICKET_ID', grievance.ticketId)}</p>
            ) : (
              <p>{grievance.generatedConstituentReply.en.replace('#TICKET_ID', grievance.ticketId)}</p>
            )}

            <button
              onClick={() => copyText(
                activeTab === 'HI'
                  ? grievance.generatedConstituentReply.hi.replace('#TICKET_ID', grievance.ticketId)
                  : grievance.generatedConstituentReply.en.replace('#TICKET_ID', grievance.ticketId),
                activeTab
              )}
              className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
              title="Copy SMS/WhatsApp Response"
            >
              {(activeTab === 'HI' && copiedHi) || (activeTab === 'EN' && copiedEn) ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
