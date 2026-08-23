'use client';

import React from 'react';
import { useGovernance } from '@/lib/governance-context';
import { Activity, Clock, CheckCircle2, ShieldCheck, UserCheck, Landmark } from 'lucide-react';

export default function GovernanceAuditFeed() {
  const { auditLogs, grievances } = useGovernance();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold">
          <Activity className="w-5 h-5 animate-pulse" />
          <h3 className="text-base text-white">Live Cross-Departmental Governance Action Log</h3>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
          System Synchronized
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Every executive decision, emergency fund release, DM show-cause notice, and PWD engineer dispatch is logged in real-time across all portals.
      </p>

      <div className="space-y-3">
        {auditLogs.slice(0, 6).map((log) => (
          <div
            key={log.id}
            className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 space-y-1.5 transition"
          >
            <div className="flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-bold text-white">{log.actionTitle}</span>
                {log.ticketId && (
                  <span className="font-mono text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                    #{log.ticketId}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 pl-4 border-l-2 border-slate-800">
              {log.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center space-x-1 text-slate-300 font-medium">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>By: {log.roleName}</span>
              </span>
              {log.wardName && <span className="text-slate-400">Location: {log.wardName}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
