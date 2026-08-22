'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { 
  FileSpreadsheet, Sparkles, Send, FileText, Upload, 
  BarChart, ArrowRight, CheckCircle2, Search, Database, Loader2
} from 'lucide-react';

export default function AnalyticsPage() {
  const [query, setQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [activeDataset, setActiveDataset] = useState('Varanasi_South_Census_2026.csv');
  const [response, setResponse] = useState<{
    text: string;
    tableData?: Array<{ ward: string; bpl: string; infraScore: number; urgentFix: string }>;
  } | null>({
    text: "According to the uploaded 2026 Census & Ward Sanitation Telemetry dataset, **Ward 3 (Chowk)** and **Ward 5 (Shivpur)** exhibit the highest poverty-to-infrastructure deficit ratio. Ward 3 has a 42.1% BPL density combined with a 48/100 infrastructure index due to aging powerloom sewer networks.",
    tableData: [
      { ward: 'Ward 3 (Chowk Silk)', bpl: '42.1%', infraScore: 48, urgentFix: 'Underground Sewerage & High-Tension Wire' },
      { ward: 'Ward 5 (Shivpur)', bpl: '38.8%', infraScore: 51, urgentFix: 'Overhead Clean Water Tank & Road LED' },
      { ward: 'Ward 1 (Dashashwamedh)', bpl: '34.5%', infraScore: 62, urgentFix: 'Drainage De-silting & CHC Vaccines' }
    ]
  });

  const datasets = [
    { name: 'Varanasi_South_Census_2026.csv', size: '2.4 MB', type: 'CSV' },
    { name: 'MPLADS_Guidelines_2026.pdf', size: '4.1 MB', type: 'PDF' },
    { name: 'Ward_Sanitation_Audit_Q2.pdf', size: '1.8 MB', type: 'PDF' }
  ];

  const handleRunAnalytics = (qText?: string) => {
    const q = qText || query;
    if (!q.trim() || isParsing) return;

    setIsParsing(true);
    setTimeout(() => {
      setResponse({
        text: `Gemini AI parsed query "${q}" across dataset [${activeDataset}].\n\n📌 **Key Analysis:** The dataset indicates that prioritizing ₹2.8 Cr funding into Ward 3 and Ward 5 sewer/water pipelines yields a projected 18% improvement in constituent health index over 12 months.`,
        tableData: [
          { ward: 'Ward 3 (Chowk)', bpl: '42.1%', infraScore: 48, urgentFix: 'Sewer Jetting & Powerloom Facility' },
          { ward: 'Ward 5 (Shivpur)', bpl: '38.8%', infraScore: 51, urgentFix: 'School Approach Road' }
        ]
      });
      setIsParsing(false);
      setQuery('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>DPI Data RAG Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Census & Governance Document RAG Analyst
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ask natural language questions over uploaded municipal CSV datasets, census statistics, and government policy PDFs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Datasets & Query Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Datasets List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Uploaded Datasets & Circulars</span>
                </h4>
                <button className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition flex items-center space-x-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
              </div>

              <div className="space-y-2">
                {datasets.map((ds, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveDataset(ds.name)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      activeDataset === ds.name
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{ds.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{ds.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Natural Language Query Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask Gemini Data Analyst</span>
              </h4>

              <div className="space-y-1 text-[11px] text-slate-400">
                <span>Sample Prompts:</span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleRunAnalytics("Show ward correlation between poverty BPL % and infrastructure deficit.")}
                    className="text-left p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition text-[11px]"
                  >
                    💡 Ward correlation: BPL % vs Infrastructure score
                  </button>
                  <button
                    onClick={() => handleRunAnalytics("Which ward requires maximum emergency MPLADS water funding?")}
                    className="text-left p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition text-[11px]"
                  >
                    💡 Max emergency MPLADS water funding ward
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Ask any question over constituency census data..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />

                <button
                  onClick={() => handleRunAnalytics()}
                  disabled={!query.trim() || isParsing}
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Parsing Document RAG...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Gemini Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: AI Insights & Table Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {response && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Gemini Synthesized Data Insights</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {response.text}
                </p>

                {response.tableData && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Extracted Ward Need Matrix
                    </span>
                    <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                          <tr>
                            <th className="p-3">Ward Sector</th>
                            <th className="p-3">BPL %</th>
                            <th className="p-3">Infra Index</th>
                            <th className="p-3">Urgent Fix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {response.tableData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/50">
                              <td className="p-3 font-semibold text-white">{row.ward}</td>
                              <td className="p-3 text-amber-400 font-mono">{row.bpl}</td>
                              <td className="p-3 font-mono">{row.infraScore}/100</td>
                              <td className="p-3 text-emerald-300">{row.urgentFix}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
