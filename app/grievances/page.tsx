'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import GrievanceCard from '@/components/GrievanceCard';
import { INITIAL_GRIEVANCES, INITIAL_WARDS, Grievance } from '@/lib/constituency-data';
import { processGrievanceWithAI } from '@/lib/gemini';
import { 
  FileText, Mic, Upload, MessageSquare, Sparkles, Filter, 
  Search, CheckCircle2, AlertTriangle, Plus, Loader2, Volume2, Shield
} from 'lucide-react';

export default function GrievancePage() {
  const [grievanceList, setGrievanceList] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'DISPATCHED' | 'NEW'>('ALL');

  // New Complaint Ingestion Form State
  const [source, setSource] = useState<Grievance['source']>('SCANNED_LETTER');
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [wardId, setWardId] = useState('ward-3');
  const [rawInput, setRawInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Quick Preset Sample Letters for instant testing
  const sampleLetters = [
    {
      title: "Scanned Letter (Hindi) - Ward 3 Sewer Blockage",
      source: 'SCANNED_LETTER' as Grievance['source'],
      name: "Rameshwar Prasad Weaver",
      phone: "+91 98390 12345",
      ward: "ward-3",
      text: "आदरणीय सांसद जी, चौक रेशम बुनकर वार्ड नंबर 3 में पिछले 12 दिनों से मुख्य सीवर लाइन पूरी तरह बंद है। गंदा पानी सड़कों पर फैल रहा है जिससे पावरलूम काम बंद है। 250 बुनकर परिवार परेशान हैं। कृपया सुपर सकर मशीन भिजवाएं।"
    },
    {
      title: "Voice Audio Recording - Ward 5 Primary School Road",
      source: 'VOICE_NOTE' as Grievance['source'],
      name: "Smt. Sunita Devi",
      phone: "+91 94152 87654",
      ward: "ward-5",
      text: "Namaste MP Sir, Shivpur Ward 5 me primary school rasta ekdam toota hai aur raat me koi streetlight nahi hai. Do bache gir ke chotil huye hain. Kripya LED light aur road repair karwayein."
    },
    {
      title: "WhatsApp Message - CHC Vaccine Shortage",
      source: 'WHATSAPP' as Grievance['source'],
      name: "Dr. Alok Nath Pandey",
      phone: "+91 97921 55432",
      ward: "ward-1",
      text: "Respected MP Sir, Dashashwamedh Ward 1 community health centre has been facing acute shortage of typhoid & anti-rabies vaccines for 3 weeks. Urgent intervention needed with CMO."
    }
  ];

  const applySample = (sample: typeof sampleLetters[0]) => {
    setSource(sample.source);
    setCitizenName(sample.name);
    setPhone(sample.phone);
    setWardId(sample.ward);
    setRawInput(sample.text);
  };

  const handleSimulateVoiceRecord = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      setSource('VOICE_NOTE');
      setCitizenName('Vikram Pratap Singh');
      setPhone('+91 99182 33445');
      setWardId('ward-2');
      setRawInput('[Voice Note Transcript]: Namaste MP Sahib, Ceylon intersection street lights in Lanka ward have been dead for 4 nights. Female BHU students facing harassment risk in darkness. Please fix immediately.');
    }, 2500);
  };

  const handleIngestGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim() || !citizenName.trim()) return;

    setIsProcessingAI(true);
    const selectedWard = INITIAL_WARDS.find(w => w.id === wardId) || INITIAL_WARDS[0];

    try {
      const aiResult = await processGrievanceWithAI(rawInput, source, citizenName, selectedWard.name);
      
      const newTicket: Grievance = {
        id: `griev-${Date.now()}`,
        ticketId: `LOK-2026-0${Math.floor(845 + Math.random() * 100)}`,
        createdAt: new Date().toISOString(),
        citizenName,
        phone: phone || '+91 98000 00000',
        source,
        rawInput,
        category: aiResult.category || 'Roads & Public Works',
        priority: aiResult.priority || 'MEDIUM',
        status: 'AI_PROCESSED',
        wardId: selectedWard.id,
        wardName: selectedWard.name,
        locationDetails: aiResult.locationDetails || selectedWard.name,
        sentiment: aiResult.sentiment || 'NEGATIVE',
        sentimentScore: aiResult.sentimentScore || -0.5,
        aiSummary: aiResult.aiSummary || `Ingested citizen request regarding ${selectedWard.name}.`,
        aiKeyEntities: aiResult.aiKeyEntities || { location: selectedWard.name, affectedCount: "Local Community", urgencyReason: "Civic infrastructure repair" },
        assignedDepartment: aiResult.assignedDepartment || 'Municipal Executive Wing',
        officerInCharge: aiResult.officerInCharge || 'Shri S. P. Tripathi (AE)',
        slaDays: aiResult.slaDays || 3,
        aiSuggestedAction: aiResult.aiSuggestedAction || 'Dispatch inspection team within 72 hours.',
        generatedConstituentReply: aiResult.generatedConstituentReply || {
          hi: `प्रिय ${citizenName} जी, आपकी शिकायत दर्ज कर ली गई है। शीघ्र निस्तारण किया जाएगा।`,
          en: `Dear ${citizenName} ji, your grievance has been logged. Action is underway.`
        }
      };

      setGrievanceList([newTicket, ...grievanceList]);
      setRawInput('');
      setCitizenName('');
      setPhone('');
    } catch (err) {
      console.error("Ingestion failed:", err);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const filteredList = grievanceList.filter(g => {
    if (activeTab === 'CRITICAL') return g.priority === 'CRITICAL';
    if (activeTab === 'DISPATCHED') return g.status === 'DISPATCHED' || g.status === 'RESOLVED';
    if (activeTab === 'NEW') return g.status === 'AI_PROCESSED' || g.status === 'PENDING_AI';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>DPI Pillar 1 • Citizen Request Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Grievance Intelligence & Ticket Processing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ingest unstructured public complaints (letters, voice notes, WhatsApp, social posts) & convert into Gemini AI structured tickets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Complaint Ingestion Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Ingest New Citizen Request</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Gemini NLP Engine</span>
              </div>

              {/* Ingestion Source Tabs */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Input Channel / Source
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSource('SCANNED_LETTER')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition ${
                      source === 'SCANNED_LETTER'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 shrink-0" />
                    <span>Scanned Letter</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateVoiceRecord}
                    disabled={isRecordingVoice}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition ${
                      source === 'VOICE_NOTE'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {isRecordingVoice ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400 shrink-0" />
                    ) : (
                      <Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span>{isRecordingVoice ? 'Recording...' : 'Voice Note'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSource('WHATSAPP')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition ${
                      source === 'WHATSAPP'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>WhatsApp / SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSource('PORTAL')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition ${
                      source === 'PORTAL'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Citizen Portal</span>
                  </button>
                </div>
              </div>

              {/* Sample Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium">Quick Test Presets:</span>
                <div className="flex flex-col gap-1">
                  {sampleLetters.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applySample(sample)}
                      className="text-left text-[11px] p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition line-clamp-1"
                    >
                      💡 {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleIngestGrievance} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Citizen Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rameshwar Prasad"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98390..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Constituency Ward Location</label>
                  <select
                    value={wardId}
                    onChange={(e) => setWardId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    {INITIAL_WARDS.map((w) => (
                      <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Unstructured Text / Letter / Transcript</label>
                  <textarea
                    rows={4}
                    placeholder="Paste complaint letter in Hindi/English/Hinglish..."
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-500 leading-relaxed font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessingAI || !rawInput.trim() || !citizenName.trim()}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini Analyzing Entity & Priority...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Gemini AI Classification Engine</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Ticket List & Filters (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'ALL' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Complaints ({grievanceList.length})
                </button>

                <button
                  onClick={() => setActiveTab('CRITICAL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'CRITICAL' ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Critical Priority ({grievanceList.filter(g => g.priority === 'CRITICAL').length})
                </button>

                <button
                  onClick={() => setActiveTab('DISPATCHED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'DISPATCHED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Dispatched
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {filteredList.length} Ticket(s)
              </span>
            </div>

            {/* Grievance Cards List */}
            <div className="space-y-4">
              {filteredList.map((grievance) => (
                <GrievanceCard key={grievance.id} grievance={grievance} />
              ))}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
