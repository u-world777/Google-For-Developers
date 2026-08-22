'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Phone, PhoneCall, PhoneOff, Send, CheckCheck, 
  Sparkles, Camera, Mic, CheckCircle2, Star, ShieldCheck, User, Volume2, Loader2
} from 'lucide-react';

interface ChatBubble {
  id: string;
  sender: 'CITIZEN' | 'BOT';
  text: string;
  image?: string;
  ticketId?: string;
  time: string;
}

export default function WhatsAppSimulator() {
  const [activeTab, setActiveTab] = useState<'WHATSAPP' | 'OUTBOUND_CALL'>('WHATSAPP');

  // WhatsApp State
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 'w-1',
      sender: 'CITIZEN',
      text: 'Namaste MP Sir, Shivpur Ward 5 me primary school approach road completely broken and streetlights dead. School children falling in dark. Please help!',
      time: '10:14 AM'
    },
    {
      id: 'w-2',
      sender: 'BOT',
      text: '🙏 *LokSeva AI Helpline Response*\n\nYour complaint has been parsed & registered!\n\n📋 *Ticket ID:* #LOK-2026-0899\n🏛️ *Assigned Dept:* PWD & Municipal Electrical Cell\n👤 *Officer:* Shri S. P. Tripathi (AE)\n⏱️ *SLA Resolution:* 72 Hours\n\nYou will receive a WhatsApp update once repair work is completed.',
      ticketId: 'LOK-2026-0899',
      time: '10:14 AM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Call Simulator State
  const [callState, setCallState] = useState<'IDLE' | 'RINGING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [callRating, setCallRating] = useState<number | null>(null);

  const handleSendWhatsApp = () => {
    if (!inputMsg.trim() || isSending) return;

    const citizenMsg: ChatBubble = {
      id: `w-${Date.now()}`,
      sender: 'CITIZEN',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, citizenMsg]);
    setInputMsg('');
    setIsSending(true);

    setTimeout(() => {
      const ticketNum = Math.floor(900 + Math.random() * 50);
      const botReply: ChatBubble = {
        id: `w-bot-${Date.now()}`,
        sender: 'BOT',
        text: `🙏 *LokSeva AI Helpline Response*\n\nComplaint successfully parsed by Gemini AI!\n\n📋 *Ticket ID:* #LOK-2026-0${ticketNum}\n🏛️ *Assigned Dept:* Municipal Executive & Sanitation Cell\n⏱️ *Expected SLA:* 48 Hours\n\nNodal officer notified. Thank you for reporting!`,
        ticketId: `LOK-2026-0${ticketNum}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
      setIsSending(false);
    }, 1500);
  };

  const triggerCall = () => {
    setCallState('RINGING');
  };

  const answerCall = () => {
    setCallState('CONNECTED');
  };

  const endCall = (rating?: number) => {
    if (rating) setCallRating(rating);
    setCallState('ENDED');
    setTimeout(() => {
      setCallState('IDLE');
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Selector Header Bar */}
      <div className="lg:col-span-12 flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('WHATSAPP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'WHATSAPP'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Bot Channel</span>
          </button>

          <button
            onClick={() => setActiveTab('OUTBOUND_CALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'OUTBOUND_CALL'
                ? 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Outbound AI Call Verification</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">Constituent Channel Simulation</span>
      </div>

      {activeTab === 'WHATSAPP' ? (
        /* Left: WhatsApp Mobile UI Frame */
        <div className="lg:col-span-8 lg:col-start-3 bg-slate-950 border border-slate-800 rounded-[32px] p-4 shadow-2xl space-y-3 max-w-lg mx-auto w-full">
          
          {/* Phone Top Speaker & Camera Notch */}
          <div className="flex justify-center mb-1">
            <div className="w-24 h-4 bg-slate-900 rounded-full border border-slate-800" />
          </div>

          {/* WhatsApp Header */}
          <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-3 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                LS
              </div>
              <div>
                <h4 className="font-bold text-sm flex items-center space-x-1">
                  <span>LokSeva AI Helpline</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <p className="text-[10px] text-emerald-300">Official Constituency WhatsApp Bot</p>
              </div>
            </div>

            <span className="text-[10px] font-mono bg-emerald-950 px-2 py-1 rounded text-emerald-300 border border-emerald-800">
              Online
            </span>
          </div>

          {/* WhatsApp Chat Body */}
          <div className="bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:12px_12px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 h-[420px] overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'CITIZEN' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs sm:max-w-sm rounded-2xl p-3.5 space-y-1.5 text-xs shadow-md ${
                  msg.sender === 'CITIZEN'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end space-x-1 text-[9px] opacity-70">
                    <span>{msg.time}</span>
                    {msg.sender === 'CITIZEN' && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-emerald-400 flex items-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini AI processing WhatsApp request...</span>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Input Footer */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type complaint or location details..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
            />
            <button
              onClick={handleSendWhatsApp}
              disabled={!inputMsg.trim() || isSending}
              className="p-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl font-bold transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Right: Outbound AI Verification Call Simulator */
        <div className="lg:col-span-8 lg:col-start-3 bg-slate-950 border border-slate-800 rounded-[32px] p-6 shadow-2xl space-y-6 max-w-lg mx-auto w-full text-center">
          
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Quality Verification IVR Agent</span>
            </div>
            <h3 className="text-xl font-bold text-white">Outbound Constituent Call Verification</h3>
            <p className="text-xs text-slate-400">Simulate automated phone call to constituent after department marks ticket as resolved</p>
          </div>

          {callState === 'IDLE' && (
            <div className="py-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <PhoneCall className="w-8 h-8" />
              </div>
              <button
                onClick={triggerCall}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-indigo-500/20 transition"
              >
                Trigger Outbound AI Verification Call
              </button>
            </div>
          )}

          {callState === 'RINGING' && (
            <div className="py-8 space-y-6 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <Phone className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-white">Incoming Call...</h4>
                <p className="text-xs text-emerald-400 font-mono">LokSeva AI MP Office (+91 8000-LOKSEVA)</p>
              </div>
              <button
                onClick={answerCall}
                className="px-6 py-3 bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg transition"
              >
                Accept Call & Listen AI Transcript
              </button>
            </div>
          )}

          {callState === 'CONNECTED' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Call Connected • Voice AI Speaking...</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Ticket #LOK-2026-0841</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-200 italic leading-relaxed">
                "Namaste Rameshwar Prasad ji! This is an automated quality call from MP Dr. Rajeshwar Sharma's office regarding your sewer blockage complaint in Ward 3 Chowk. The sanitation engineer reported that jetting machine work is complete. Did the work satisfy your request?"
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Simulate Constituent Feedback Rating:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => endCall(5)}
                    className="p-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold transition text-center"
                  >
                    🟢 Fully Resolved (5★)
                  </button>
                  <button
                    onClick={() => endCall(3)}
                    className="p-2.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-xl text-xs font-bold transition text-center"
                  >
                    🟡 Partial Work (3★)
                  </button>
                  <button
                    onClick={() => endCall(1)}
                    className="p-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold transition text-center"
                  >
                    🔴 Not Done (1★)
                  </button>
                </div>
              </div>
            </div>
          )}

          {callState === 'ENDED' && (
            <div className="py-6 space-y-3 bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Feedback Captured & Logged</h4>
              <p className="text-xs text-slate-300">
                Citizen Rating: <strong className="text-amber-400">{callRating} / 5 Stars</strong> logged in executive telemetry!
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
