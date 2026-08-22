'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Landmark, FileText, PieChart, Bot, Sparkles, Key, Check, 
  MapPin, MessageSquare, Building2, FileSpreadsheet, ChevronDown, Menu, X
} from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import { getStoredApiKey } from '@/lib/gemini';

export default function Header() {
  const pathname = usePathname();
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [activeRole, setActiveRole] = useState<'MP' | 'COLLECTOR' | 'ENGINEER' | 'COUNCILLOR'>('MP');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHasApiKey(!!getStoredApiKey());
  }, [isKeyModalOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'MP Command', shortLabel: 'Dashboard', icon: Landmark, color: 'text-amber-400' },
    { href: '/grievances', label: 'Grievance Intelligence', shortLabel: 'Grievances', icon: FileText, color: 'text-sky-400' },
    { href: '/budget', label: 'Budget AI', shortLabel: 'Budget', icon: PieChart, color: 'text-emerald-400' },
    { href: '/jan-mitra', label: 'Jan-Mitra Voice', shortLabel: 'Voice AI', icon: Bot, color: 'text-indigo-400' },
    { href: '/whatsapp-channel', label: 'WhatsApp Bot', shortLabel: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-400' },
    { href: '/projects', label: 'MPLADS Projects', shortLabel: 'Projects', icon: Building2, color: 'text-teal-400' },
    { href: '/analytics', label: 'Census RAG', shortLabel: 'Analytics', icon: FileSpreadsheet, color: 'text-rose-400' },
  ];

  const roles = [
    { key: 'MP', name: 'Dr. R. Sharma', title: 'Member of Parliament (MP)', badge: 'MP' },
    { key: 'COLLECTOR', name: 'Shri S. K. Roy, IAS', title: 'District Collector (DM)', badge: 'IAS' },
    { key: 'ENGINEER', name: 'Er. A. K. Verma', title: 'Chief Executive Engineer', badge: 'PWD' },
    { key: 'COUNCILLOR', name: 'Smt. Priya Gupta', title: 'Ward 3 Councillor', badge: 'WARD' },
  ];

  const currentRoleObj = roles.find(r => r.key === activeRole) || roles[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Constituency Badge */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-500 p-0.5 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold tracking-tight text-base sm:text-lg text-white bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                      LokSeva <span className="text-emerald-400">AI</span>
                    </span>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      DPI Hackathon
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-500 inline" />
                    <span>Varanasi South Constituency</span>
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden xl:flex items-center space-x-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? link.color : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls: Role Switcher & Gemini Status */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  hasApiKey
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
                title="Configure Gemini API Key"
              >
                <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="hidden sm:inline">
                  {hasApiKey ? 'Gemini Active' : 'Gemini AI'}
                </span>
                {hasApiKey && <Check className="w-3 h-3 text-emerald-400" />}
              </button>

              {/* Multi-Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-2 sm:px-2.5 py-1 text-xs transition"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-950">
                    {currentRoleObj.badge}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-semibold text-slate-200 leading-none text-[11px]">{currentRoleObj.name}</p>
                    <p className="text-[9px] text-slate-400 leading-none mt-0.5">{currentRoleObj.badge} View</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                      Select Governance View:
                    </div>
                    {roles.map(r => (
                      <button
                        key={r.key}
                        onClick={() => {
                          setActiveRole(r.key as any);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between ${
                          activeRole === r.key ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <p className="text-xs">{r.name}</p>
                          <p className="text-[9px] text-slate-400">{r.title}</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400">
                          {r.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Navigation Bar for Tablet / Small Screens */}
        <div className="hidden md:flex xl:hidden border-t border-slate-800/60 bg-slate-950/90 px-3 py-2 items-center space-x-2 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 py-1 px-3 rounded-xl text-xs font-medium shrink-0 transition ${
                  isActive ? 'text-emerald-400 bg-slate-800/80 border border-slate-700/60' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? link.color : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <ApiKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} />
    </>
  );
}
