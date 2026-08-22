'use client';

import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertCircle, Sparkles, X, RefreshCw } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '@/lib/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState('');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getStoredApiKey() || '');
      setSavedStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(keyInput);
    setSavedStatus('Key saved successfully! The app will use Gemini API for live NLP and Budget AI reasoning.');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleClear = () => {
    setKeyInput('');
    setStoredApiKey('');
    setSavedStatus('Key cleared. App will run in built-in fallback NLP engine mode.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Google Gemini API Configuration</h3>
              <p className="text-xs text-slate-400">Power LokSeva AI with Google AI Studio key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center text-emerald-400 font-medium space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Full Gemini 2.5 Flash Integration</span>
            </div>
            <p>
              Entering your Gemini API Key unlocks live entity extraction, dynamic grievance summarization, voice translation, and AI rationale generation.
            </p>
            <p className="text-slate-400">
              *If left blank, LokSeva AI automatically operates using high-fidelity built-in heuristic AI fallback algorithms.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm font-mono text-emerald-300 placeholder-slate-600 outline-none transition"
              />
            </div>
          </div>

          {savedStatus && (
            <div className="flex items-start space-x-2 text-xs p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{savedStatus}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition"
          >
            Reset to Default
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save API Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
