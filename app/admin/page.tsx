'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { 
  Users, UserPlus, UserMinus, ShieldCheck, Mail, Phone, MapPin, Building2,
  Server, Database, Activity, Sparkles, Key, CheckCircle2, AlertTriangle,
  RefreshCw, Download, Terminal, HardDrive, Trash2, Plus, Check, Clock, FileText,
  Sliders, Layers, Search, LayoutDashboard, BarChart3, PieChart, Settings,
  Shield, Bell, ChevronRight, TrendingUp, TrendingDown, Eye, DollarSign, Briefcase
} from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '@/lib/gemini';
import { useGovernance } from '@/lib/governance-context';
import { GovernanceMember } from '@/lib/constituency-data';
import { 
  useGovernanceMembers, 
  useGovernanceGrievances, 
  useGovernanceProjects, 
  useGovernanceAuditLogs 
} from '@/lib/hooks/useGovernanceData';
import { usePermissions } from '@/lib/rbac/usePermissions';
import { RequireRole } from '@/components/rbac/RequireRole';
import { RequirePermission } from '@/components/rbac/RequirePermission';

export default function AdminDashboardPage() {
  const { grievances: contextGrievances, projects: contextProjects, auditLogs: contextLogs, members: contextMembers, addMember, removeMember, resetDataToDefault } = useGovernance();
  
  const { members: swrMembers } = useGovernanceMembers();
  const { grievances: swrGrievances } = useGovernanceGrievances();
  const { projects: swrProjects } = useGovernanceProjects();
  const { auditLogs: swrAuditLogs } = useGovernanceAuditLogs();

  const members = swrMembers.length > 0 ? swrMembers : contextMembers;
  const grievances = swrGrievances.length > 0 ? swrGrievances : contextGrievances;
  const projects = swrProjects.length > 0 ? swrProjects : contextProjects;
  const auditLogs = swrAuditLogs.length > 0 ? swrAuditLogs : contextLogs;

  // RBAC Permission Hook
  const { activeRole, isTabAccessible, accessibleTabs, hasRole, hasPermission } = usePermissions();
  
  // Navigation State inside Admin Panel Sidebar
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MEMBERS' | 'COMPLAINTS' | 'PROJECTS' | 'AUDIT' | 'SETTINGS'>('MEMBERS');

  // Auto switch tab if current role doesn't have permission for active tab
  useEffect(() => {
    if (!isTabAccessible(activeTab) && accessibleTabs.length > 0) {
      setActiveTab(accessibleTabs[0].id);
    }
  }, [activeRole, activeTab, isTabAccessible, accessibleTabs]);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemName, setNewMemName] = useState('');
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemRole, setNewMemRole] = useState<'MP' | 'COLLECTOR' | 'ENGINEER' | 'COUNCILLOR' | 'NODAL_OFFICER'>('NODAL_OFFICER');
  const [newMemDept, setNewMemDept] = useState('Municipal Public Health & Sanitation Cell');
  const [newMemWard, setNewMemWard] = useState('Ward 3 - Chowk & Silk Weaver Cluster');
  const [newMemEmail, setNewMemEmail] = useState('');
  const [newMemPhone, setNewMemPhone] = useState('');

  // Search & Config State
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) setApiKeyInput(stored);
  }, []);

  const notify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim() || !newMemTitle.trim()) {
      alert('Please enter member name and designation title.');
      return;
    }

    await addMember({
      name: newMemName.trim(),
      title: newMemTitle.trim(),
      role: newMemRole as any,
      department: newMemDept.trim(),
      wardName: newMemWard.trim(),
      email: newMemEmail.trim() || `${newMemName.toLowerCase().replace(/\s+/g, '.')}@lokseva.gov.in`,
      phone: newMemPhone.trim() || '+91 98000 12345',
      activeStatus: true
    } as any);

    notify(`✅ Success: Added ${newMemName} to Governance Team!`);
    setShowAddModal(false);
    setNewMemName('');
    setNewMemTitle('');
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from active governance staff?`)) {
      await removeMember(id);
      notify(`🗑️ Removed ${name} from active staff roster.`);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKeyInput.trim());
    setKeySaveSuccess(true);
    setTimeout(() => setKeySaveSuccess(false), 4000);
  };

  const handleExportJson = () => {
    const dataObj = { members, grievances, projects, auditLogs };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LokSeva_Admin_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.wardName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Main Admin Panel Outer Container with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Menu (Inspired by Maxton Dashboard UI) */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col shrink-0 hidden md:flex">
          
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm tracking-tight">Admin Panel</h2>
              <p className="text-[10px] text-slate-400">Governance Command</p>
            </div>
          </div>

          {/* Navigation Category 1: CORE CONTROL */}
          <div className="p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Core Control</p>

            {isTabAccessible('DASHBOARD') && (
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'DASHBOARD'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Dashboard</span>
              </button>
            )}

            {isTabAccessible('MEMBERS') && (
              <button
                onClick={() => setActiveTab('MEMBERS')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'MEMBERS'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4" />
                  <span>Governance Staff</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'MEMBERS' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {members.length}
                </span>
              </button>
            )}
          </div>

          {/* Navigation Category 2: GOVERNANCE UNITS */}
          <div className="p-4 space-y-1 border-t border-slate-800/60">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Governance Units</p>

            {isTabAccessible('COMPLAINTS') && (
              <button
                onClick={() => setActiveTab('COMPLAINTS')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'COMPLAINTS'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4" />
                  <span>Complaints Roster</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {grievances.length}
                </span>
              </button>
            )}

            {isTabAccessible('PROJECTS') && (
              <button
                onClick={() => setActiveTab('PROJECTS')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'PROJECTS'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4" />
                  <span>Ward Projects</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {projects.length}
                </span>
              </button>
            )}

            {isTabAccessible('AUDIT') && (
              <button
                onClick={() => setActiveTab('AUDIT')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'AUDIT'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>
            )}
          </div>

          {/* Navigation Category 3: SYSTEM */}
          <div className="p-4 space-y-1 border-t border-slate-800/60 mt-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">System</p>

            {isTabAccessible('SETTINGS') && (
              <button
                onClick={() => setActiveTab('SETTINGS')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'SETTINGS'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin Settings</span>
              </button>
            )}
          </div>

          {/* Sidebar Footer Backend Badge */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>REST API Connected</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">DB Sync • Real-Time `/api/members`</p>
          </div>

        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Top Bar inside Content Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
                <span>Admin Panel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-amber-400 font-semibold uppercase">{activeTab}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {activeTab === 'DASHBOARD' && 'Executive Administration Dashboard'}
                {activeTab === 'MEMBERS' && 'Governance Team & Staff Roster'}
                {activeTab === 'COMPLAINTS' && 'City Complaints & Petitions'}
                {activeTab === 'PROJECTS' && 'MPLADS Ward Projects & Funds'}
                {activeTab === 'AUDIT' && 'Executive Audit & Compliance Stream'}
                {activeTab === 'SETTINGS' && 'Admin Settings & API Keys'}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center space-x-2 text-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>

              <button
                onClick={handleExportJson}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Live Toast Notification Banner */}
          {notificationMsg && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 shadow-xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{notificationMsg}</span>
              </div>
              <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* TAB 1: EXECUTIVE DASHBOARD (Matching Image Design: Welcome Banner + 4 Stat Cards + Charts + Staff Table) */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              
              {/* Top Row Grid: Welcome Hero Banner + 4 Metric Sparkline Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Hero Banner Card (Inspired by Maxton Dashboard "Congratulations Jhon") */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="space-y-3 z-10">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold">
                        SYSTEM ACTIVE 🎉
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">Welcome, Admin!</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                      Governance operations running smoothly across Varanasi South. Staff assignments, complaint routing, and fund releases are synchronized in real-time.
                    </p>
                    <div className="pt-2">
                      <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                        98.4% <span className="text-xs text-slate-400 font-sans font-normal">SLA Compliance Target</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 z-10 flex items-center space-x-3">
                    <button
                      onClick={() => setActiveTab('MEMBERS')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                    >
                      Manage Staff Team
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
                    >
                      + Add New Member
                    </button>
                  </div>

                  {/* Decorative Glowing Graphic Overlay */}
                  <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none">
                    <ShieldCheck className="w-48 h-48 text-indigo-400" />
                  </div>
                </div>

                {/* 4 Stat Cards Grid (Matching Image: Total Orders, Total Sales, Total Visits, Bounce Rate) */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                  
                  {/* Card 1: Active Staff */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                      <span>Governance Staff</span>
                      <span className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+12%</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-white font-mono">{members.length}</div>
                      <p className="text-[11px] text-slate-400">Active Team Members</p>
                    </div>
                    {/* Sparkline Graphic Visual */}
                    <div className="h-6 w-full flex items-end space-x-1 pt-1">
                      <div className="bg-emerald-500/40 w-1/6 h-2 rounded-t" />
                      <div className="bg-emerald-500/50 w-1/6 h-3 rounded-t" />
                      <div className="bg-emerald-500/60 w-1/6 h-2 rounded-t" />
                      <div className="bg-emerald-500/80 w-1/6 h-4 rounded-t" />
                      <div className="bg-emerald-400 w-1/6 h-5 rounded-t" />
                      <div className="bg-emerald-300 w-1/6 h-6 rounded-t" />
                    </div>
                  </div>

                  {/* Card 2: Complaints */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                      <span>Total Complaints</span>
                      <span className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+24%</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-white font-mono">{grievances.length}</div>
                      <p className="text-[11px] text-slate-400">Registered Citizen Petitions</p>
                    </div>
                    {/* Sparkline Graphic Visual */}
                    <div className="h-6 w-full flex items-end space-x-1 pt-1">
                      <div className="bg-sky-500/40 w-1/6 h-3 rounded-t" />
                      <div className="bg-sky-500/60 w-1/6 h-2 rounded-t" />
                      <div className="bg-sky-500/80 w-1/6 h-4 rounded-t" />
                      <div className="bg-sky-400 w-1/6 h-3 rounded-t" />
                      <div className="bg-sky-400 w-1/6 h-5 rounded-t" />
                      <div className="bg-sky-300 w-1/6 h-6 rounded-t" />
                    </div>
                  </div>

                  {/* Card 3: Funds Sanctioned */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                      <span>MPLADS Budget</span>
                      <span className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+14%</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-amber-400 font-mono">₹47.6 Cr</div>
                      <p className="text-[11px] text-slate-400">Sanctioned Ward Infrastructure</p>
                    </div>
                    {/* Sparkline Graphic Visual */}
                    <div className="h-6 w-full flex items-end space-x-1 pt-1">
                      <div className="bg-amber-500/40 w-1/6 h-2 rounded-t" />
                      <div className="bg-amber-500/60 w-1/6 h-4 rounded-t" />
                      <div className="bg-amber-500/80 w-1/6 h-3 rounded-t" />
                      <div className="bg-amber-400 w-1/6 h-5 rounded-t" />
                      <div className="bg-amber-400 w-1/6 h-4 rounded-t" />
                      <div className="bg-amber-300 w-1/6 h-6 rounded-t" />
                    </div>
                  </div>

                  {/* Card 4: SLA Resolution Rate */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                      <span>SLA Resolution Rate</span>
                      <span className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+18%</span>
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold text-emerald-400 font-mono">94.6%</div>
                      <p className="text-[11px] text-slate-400">Average SLA Target 3.2 Days</p>
                    </div>
                    {/* Bar Sparkline Visual */}
                    <div className="h-6 w-full flex items-end space-x-1 pt-1">
                      <div className="bg-indigo-500/40 w-1/6 h-4 rounded-t" />
                      <div className="bg-indigo-500/60 w-1/6 h-3 rounded-t" />
                      <div className="bg-indigo-500/80 w-1/6 h-5 rounded-t" />
                      <div className="bg-indigo-400 w-1/6 h-4 rounded-t" />
                      <div className="bg-indigo-400 w-1/6 h-6 rounded-t" />
                      <div className="bg-indigo-300 w-1/6 h-5 rounded-t" />
                    </div>
                  </div>

                </div>

              </div>

              {/* Middle Row Grid (Matching Image Charts: Left Glowing Donut Chart + Right Bar Chart Visualizer) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: Glowing Donut Chart (Matching Image: Order Status 68%) */}
                <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-base text-white">Complaint Resolution Status</h3>
                    <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-4 relative">
                    {/* SVG Glowing Donut Chart */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-800"
                          strokeWidth="3.8"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          strokeDasharray="68, 100"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-amber-400"
                          strokeDasharray="25, 100"
                          strokeDashoffset="-68"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-rose-500"
                          strokeDasharray="14, 100"
                          strokeDashoffset="-93"
                          strokeWidth="3.8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-extrabold text-white">68%</span>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">Resolved</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <div>
                        <p className="text-slate-400 text-[10px]">Resolved</p>
                        <p className="font-bold text-white">68%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                      <div>
                        <p className="text-slate-400 text-[10px]">In Progress</p>
                        <p className="font-bold text-white">25%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                      <div>
                        <p className="text-slate-400 text-[10px]">Escalated</p>
                        <p className="font-bold text-white">14%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Card: Monthly Bar Chart Visualizer (Matching Image: Sales & Views Jan-Sep) */}
                <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-white">Monthly Grievances vs Resolutions</h3>
                      <p className="text-xs text-slate-400">Constituency wide trend analysis</p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-semibold">
                      <span className="flex items-center space-x-1 text-amber-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                        <span>Logged</span>
                      </span>
                      <span className="flex items-center space-x-1 text-sky-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
                        <span>Resolved</span>
                      </span>
                    </div>
                  </div>

                  {/* Bar Chart Bars */}
                  <div className="h-44 w-full flex items-end justify-between px-2 pt-4">
                    {[
                      { month: 'Jan', logged: 40, resolved: 35 },
                      { month: 'Feb', logged: 55, resolved: 48 },
                      { month: 'Mar', logged: 95, resolved: 88 },
                      { month: 'Apr', logged: 30, resolved: 28 },
                      { month: 'May', logged: 65, resolved: 60 },
                      { month: 'Jun', logged: 45, resolved: 42 },
                      { month: 'Jul', logged: 75, resolved: 70 },
                      { month: 'Aug', logged: 35, resolved: 32 },
                      { month: 'Sep', logged: 60, resolved: 58 },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1 group">
                        <div className="flex items-end space-x-1 h-32">
                          <div
                            className="bg-amber-400 rounded-t w-3 sm:w-4 transition-all group-hover:bg-amber-300"
                            style={{ height: `${bar.logged}%` }}
                          />
                          <div
                            className="bg-sky-400 rounded-t w-3 sm:w-4 transition-all group-hover:bg-sky-300"
                            style={{ height: `${bar.resolved}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{bar.month}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Metric Ring Footer */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-400">
                        65k
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Monthly Citizen Touchpoints</p>
                        <p className="text-xs font-bold text-white">65,127 <span className="text-[10px] text-emerald-400 font-normal">+16.5%</span></p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center font-bold text-xs text-amber-400">
                        984k
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Yearly SLA Resolutions</p>
                        <p className="text-xs font-bold text-white">984,246 <span className="text-[10px] text-emerald-400 font-normal">+24.9%</span></p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Section: Staff Roster Quick Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>Governance Staff Roster (`/api/members`)</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('MEMBERS')}
                    className="text-xs text-amber-400 font-semibold hover:underline"
                  >
                    View All Staff Members →
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Official Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Ward</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {members.map((mem) => (
                        <tr key={mem.id} className="hover:bg-slate-800/50">
                          <td className="p-3 font-bold text-white">{mem.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {mem.role}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">{mem.department}</td>
                          <td className="p-3 text-slate-400">{mem.wardName}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemoveMember(mem.id, mem.name)}
                              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition text-[11px] font-bold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STAFF MEMBERS MANAGER */}
          {activeTab === 'MEMBERS' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <span>Official Governance Staff Roster</span>
                  </h3>
                  <p className="text-xs text-slate-400">Add, remove, or update official team members synced directly to `/api/members`.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search member or ward..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-amber-500 w-64"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Member</span>
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Member Name & Title</th>
                      <th className="p-3.5">Role Category</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Ward / Sector</th>
                      <th className="p-3.5">Contact Email / Phone</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredMembers.map((mem) => (
                      <tr key={mem.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3.5">
                          <div>
                            <div className="font-bold text-white text-sm">{mem.name}</div>
                            <div className="text-[11px] text-amber-400">{mem.title}</div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                            mem.role === 'MP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            mem.role === 'COLLECTOR' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                            mem.role === 'ENGINEER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}>
                            {mem.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-200 font-medium max-w-xs">{mem.department}</td>
                        <td className="p-3.5 text-slate-300">{mem.wardName}</td>
                        <td className="p-3.5 font-mono text-slate-400">
                          <div>{mem.email}</div>
                          <div className="text-[11px] text-slate-500">{mem.phone}</div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleRemoveMember(mem.id, mem.name)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition text-xs font-bold flex items-center space-x-1 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLAINTS ROSTER */}
          {activeTab === 'COMPLAINTS' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  <span>Constituent Grievance Table (`/api/grievances`)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{grievances.length} Active Complaints</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Ticket ID</th>
                      <th className="p-3">Citizen</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assigned Dept</th>
                      <th className="p-3">SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {grievances.map((g: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-mono font-bold text-amber-400">#{g.ticketId}</td>
                        <td className="p-3 text-white font-medium">{g.citizenName}</td>
                        <td className="p-3 text-slate-300">{g.category}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            g.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {g.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                            {g.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 truncate max-w-xs">{g.assignedDepartment}</td>
                        <td className="p-3 font-mono text-emerald-400">{g.slaDays} Days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WARD PROJECTS */}
          {activeTab === 'PROJECTS' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  <span>MPLADS Infrastructure Projects Table (`/api/projects`)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{projects.length} Projects</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Project Name</th>
                      <th className="p-3">Ward Location</th>
                      <th className="p-3">Sanctioned Budget</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {projects.map((p: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="p-3 font-mono text-slate-400">{p.code}</td>
                        <td className="p-3 font-bold text-white max-w-xs">{p.name}</td>
                        <td className="p-3 text-slate-300">{p.wardName}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">₹{p.sanctionedBudgetCr} Cr</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold">{p.progressPercentage}%</span>
                            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${p.progressPercentage}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[10px] text-teal-300">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT STREAM */}
          {activeTab === 'AUDIT' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <span>Executive Governance Audit Stream (`/api/audit-logs`)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Log Entries</span>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          {log.role}
                        </span>
                        <span className="font-bold text-white">{log.roleName}</span>
                      </div>
                      <p className="text-slate-300 font-medium">{log.description}</p>
                      <p className="text-[11px] text-slate-400">Action: <strong className="text-slate-200">{log.actionTitle}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>Admin Settings & API Keys</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure your Gemini AI API key and database settings.
                </p>
              </div>

              <form onSubmit={handleSaveKey} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Gemini API Key (Google AI Studio)
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {keySaveSuccess && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>API Key saved successfully! Gemini live inference enabled.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg transition"
                >
                  Save Admin Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ADD TEAM MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Add New Governance Team Member</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. Rajesh Gupta"
                  value={newMemName}
                  onChange={(e) => setNewMemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Executive Engineer (Sanitation)"
                  value={newMemTitle}
                  onChange={(e) => setNewMemTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Category</label>
                  <select
                    value={newMemRole}
                    onChange={(e) => setNewMemRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="NODAL_OFFICER">Nodal Officer</option>
                    <option value="ENGINEER">Executive Engineer</option>
                    <option value="COUNCILLOR">Ward Councillor</option>
                    <option value="COLLECTOR">Collector Assistant</option>
                    <option value="MP">MP Office Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Ward</label>
                  <select
                    value={newMemWard}
                    onChange={(e) => setNewMemWard(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                  >
                    <option value="Ward 1 - Dashashwamedh Heritage Belt">Ward 1 - Dashashwamedh</option>
                    <option value="Ward 3 - Chowk & Silk Weaver Cluster">Ward 3 - Chowk Cluster</option>
                    <option value="Ward 5 - Shivpur Peri-Urban Sector">Ward 5 - Shivpur</option>
                    <option value="Ward 6 - Ramnagar Riverfront Extension">Ward 6 - Ramnagar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Municipal Public Health & Sanitation Cell"
                  value={newMemDept}
                  onChange={(e) => setNewMemDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="official@lokseva.gov.in"
                    value={newMemEmail}
                    onChange={(e) => setNewMemEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98000 12345"
                    value={newMemPhone}
                    onChange={(e) => setNewMemPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg transition"
                >
                  Save Member to Backend Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
