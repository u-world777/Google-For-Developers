'use client';

import React from 'react';
import Header from '@/components/Header';
import VoiceAgent from '@/components/VoiceAgent';
import { Bot, Sparkles, Languages } from 'lucide-react';

export default function JanMitraPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Bot className="w-4 h-4" />
              <span>DPI Pillar 3 • Public Information Accessibility</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Jan-Mitra (जन-मित्र) Multi-Lingual Citizen Voice AI Agent
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Conversational Voice & Chat Assistant helping citizens navigate welfare schemes (PM-Kisan, Ayushman, PMAY, PM-SVANidhi) in their regional language.
            </p>
          </div>
        </div>

        <VoiceAgent />

      </main>
    </div>
  );
}
