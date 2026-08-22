'use client';

import React from 'react';
import Header from '@/components/Header';
import WhatsAppSimulator from '@/components/WhatsAppSimulator';
import { MessageSquare, PhoneCall, Sparkles } from 'lucide-react';

export default function WhatsAppChannelPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>DPI Multi-Channel • Citizen Touchpoint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              WhatsApp Bot & Outbound AI Verification Call
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Interactive mobile constituent chat channel paired with automated outbound voice call quality verification.
            </p>
          </div>
        </div>

        <WhatsAppSimulator />

      </main>
    </div>
  );
}
