'use client';

import React, { useState, useEffect, useRef } from 'react';
import { chatJanMitraAI } from '@/lib/gemini';
import { Scheme } from '@/lib/schemes-db';
import { 
  Bot, Mic, MicOff, Volume2, VolumeX, Send, Sparkles, Languages, 
  ExternalLink, FileCheck, CheckCircle2, User, ArrowRight, RefreshCw, Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'BOT';
  text: string;
  matchedSchemes?: Scheme[];
  suggestedQuestions?: string[];
  timestamp: string;
}

export default function VoiceAgent() {
  const [language, setLanguage] = useState<'hi' | 'en' | 'ta' | 'te' | 'bn'>('hi');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'BOT',
      text: 'नमस्ते! मैं जन-मित्र (Jan-Mitra) AI सहायक हूँ। आप मुझसे केंद्र व राज्य सरकार की कल्याणकारी योजनाओं (जैसे PM-किसान, आयुष्मान भारत, पीएम आवास, स्वनिधि, विश्वकर्मा) के बारे में बोलकर या लिखकर प्रश्न पूछ सकते हैं।',
      suggestedQuestions: [
        'मुझे ₹5 लाख तक के मुफ्त इलाज योजना की जानकारी दें',
        'पीएम किसान की ₹6000 की किस्त कब आती है?',
        'रेहड़ी-पटरी व्यवसाय के लिए बिना गारंटी लोन कैसे मिलेगा?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech Recognition toggle
  const toggleSpeechRecognition = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;

      if (!isListening) {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputQuery(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        setIsListening(false);
      }
    } else {
      // Fallback voice simulation
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleQuery = language === 'hi'
          ? "पीएम आवास योजना में पक्का मकान बनाने के लिए कितनी सहायता मिलती है?"
          : "What is the financial grant under PM Awas Yojana for building a house?";
        setInputQuery(sampleQuery);
        handleSendMessage(sampleQuery);
      }, 2000);
    }
  };

  // Text-to-Speech synthesis
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const cleanText = text.replace(/\*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'USER' ? ('user' as const) : ('model' as const),
        parts: m.text
      }));

      const botRes = await chatJanMitraAI(q, language, history);

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'BOT',
        text: botRes.text,
        matchedSchemes: botRes.matchedSchemes,
        suggestedQuestions: botRes.suggestedQuestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(botRes.text);
    } catch (err) {
      console.error("Jan-Mitra chat error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const citizenPersonas = [
    {
      label: "Small Farmer (किसान)",
      query: "मैं एक छोटा किसान हूँ, मुझे खेती के लिए सालाना ₹6000 सहायता योजना की जानकारी चाहिए।"
    },
    {
      label: "Street Vendor (रेहड़ी-पटरी)",
      query: "रेहड़ी-पटरी पर फल बेचने वालों के लिए बिना गारंटी लोन की योजना बताओ।"
    },
    {
      label: "Artisan / Weaver (कारीगर/बुनकर)",
      query: "पीएम विश्वकर्मा योजना में टूलकिट और सिलाई/करघा ट्रेनिंग का लाभ कैसे लें?"
    },
    {
      label: "Free Hospital Care (मुफ्त इलाज)",
      query: "क्या मुझे और मेरे परिवार को अस्पताल में ₹5 लाख तक का फ्री इलाज मिल सकता है?"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Main Chat Interface (8 cols) */}
      <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[520px] sm:h-[620px] lg:h-[680px]">
        
        {/* Chat Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center space-x-2">
                <span>Jan-Mitra Voice Assistant (जन-मित्र)</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-mono">
                  Gemini RAG
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Multi-lingual voice bot for public schemes & governance</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
            <Languages className="w-4 h-4 text-indigo-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="hi" className="bg-slate-900">हिंदी (Hindi)</option>
              <option value="en" className="bg-slate-900">English</option>
              <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
              <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
              <option value="bn" className="bg-slate-900">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>

        {/* Message Log Scroll Box */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 sm:pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[88%] sm:max-w-xl rounded-2xl p-3.5 sm:p-4 space-y-2 sm:space-y-3 shadow-lg ${
                msg.sender === 'USER'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                <div className="flex items-center justify-between text-[10px] opacity-70 border-b border-white/10 pb-1.5">
                  <span className="font-semibold flex items-center space-x-1">
                    {msg.sender === 'USER' ? (
                      <>
                        <User className="w-3 h-3" />
                        <span>Constituent</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Jan-Mitra AI</span>
                      </>
                    )}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Text-to-speech button for Bot messages */}
                {msg.sender === 'BOT' && (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold flex items-center space-x-1 transition"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen Voice Response'}</span>
                    </button>
                  </div>
                )}

                {/* Matched Scheme Cards inside Bot message */}
                {msg.matchedSchemes && msg.matchedSchemes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Matched Public Welfare Schemes:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.matchedSchemes.map((scheme) => (
                        <div key={scheme.id} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl space-y-1.5 text-xs">
                          <span className="font-mono text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                            {scheme.code}
                          </span>
                          <h4 className="font-bold text-slate-100 line-clamp-1">{language === 'hi' ? scheme.name.hi : scheme.name.en}</h4>
                          <a
                            href={scheme.applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 hover:underline font-semibold"
                          >
                            <span>Official Apply Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Questions */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-medium">Follow-up Questions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-[10px] bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-full transition text-left"
                        >
                          💬 {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-indigo-400 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Searching scheme vector database & synthesizing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 sm:p-3 rounded-2xl border transition shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Speech Voice Input"
          >
            {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />}
          </button>

          <input
            type="text"
            placeholder={language === 'hi' ? 'अपनी योजना के बारे में पूछें...' : 'Type or speak your question...'}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs text-white placeholder-slate-500 outline-none transition"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isProcessing}
            className="p-2.5 sm:p-3 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold rounded-2xl transition disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Right Column: Citizen Personas & Quick Scheme Explorer (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Quick Personas Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Citizen Persona Profiles</span>
          </h4>
          <p className="text-xs text-slate-400">Click any persona to run automated scheme matching query:</p>

          <div className="space-y-2">
            {citizenPersonas.map((persona, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(persona.query)}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition space-y-1 group"
              >
                <span className="font-semibold text-xs text-emerald-400 group-hover:text-emerald-300">
                  {persona.label}
                </span>
                <p className="text-[11px] text-slate-300 line-clamp-2">"{persona.query}"</p>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
