'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { 
  Bot, 
  Send, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  LineChart as LineChartIcon,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function CopilotPage() {
  const { activeSite, addToast } = useFactoryOSStore();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome',
      role: 'assistant',
      response: "👋 **Hello! I'm Factory OS AI Decision Copilot** — powered by FastAPI multi-agent LangGraph orchestrator. Ask me anything about plant diagnostics, OEE forecasts, material stockout, or SOP maintenance protocols.",
      confidence: 99.0,
      agent: 'Multi-Agent Gateway',
      evidence: [],
      actions: [],
    },
  ]);

  const presetChips = [
    { title: 'Diagnose thermal anomaly on Laser Weld Cell 03', query: 'Diagnose thermal anomaly on Laser Weld Cell 03' },
    { title: 'Why did Line 4 OEE drop to 62.1% this shift?', query: 'Why did Line 4 OEE drop to 62.1% this shift?' },
    { title: 'Forecast Pre-preg Carbon Fiber stockout date', query: 'Forecast Pre-preg Carbon Fiber stockout date' },
    { title: 'Generate Shift A Executive Summary Report', query: 'Generate Shift A Executive Summary Report' },
  ];

  const handleSend = async (qText?: string) => {
    const query = qText || inputQuery;
    if (!query.trim()) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.queryCopilot(query, activeSite);
      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            ...res.data,
          },
        ]);
        addToast('🤖 Multi-agent consensus response received.', 'info');
      }
    } catch (e) {
      addToast('⚠️ Copilot fallback response delivered.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">AI Decision Intelligence Copilot</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            RAG-Grounded Multi-Agent Orchestrator with 2.5s Timeout Consensus Engine
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat History</span>
        </button>
      </div>

      {/* Preset Query Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presetChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="p-3 rounded-xl glass-panel text-left hover:border-cyan-500/50 hover:bg-purple-500/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Preset Query #{idx + 1}</span>
              <Sparkles className="w-3 h-3 text-purple-400 group-hover:animate-spin" />
            </div>
            <div className="text-xs font-semibold text-slate-200 line-clamp-2">{chip.title}</div>
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            )}

            <div className={`max-w-3xl space-y-3 ${msg.role === 'user' ? 'bg-purple-600/30 border border-purple-500/40 p-4 rounded-2xl text-slate-100 text-xs font-semibold' : 'glass-panel p-5 border-slate-800/90 text-slate-200'}`}>
              {msg.role === 'user' ? (
                <div>{msg.content}</div>
              ) : (
                <div className="space-y-4">
                  {/* Agent Header */}
                  {msg.agent && (
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>{msg.agent}</span>
                      </span>
                      {msg.confidence && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          {msg.confidence}% AI Confidence
                        </span>
                      )}
                    </div>
                  )}

                  {/* Main Markdown Response */}
                  <div className="text-xs leading-relaxed whitespace-pre-wrap">{msg.response}</div>

                  {/* Evidence & Telemetry Cards */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        RAG Grounded Evidence & Sensor Citations:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.evidence.map((ev: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px]">
                            <span className="font-bold text-cyan-300 block mb-0.5">{ev.title}</span>
                            <span className="text-slate-400 text-[10px]">{ev.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Recharts Visualization */}
                  {msg.trendData && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Telemetry Correlation Curve:
                      </span>
                      <div className="h-36 bg-slate-900/60 rounded-xl p-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={msg.trendData}>
                            <XAxis dataKey={Object.keys(msg.trendData[0])[0]} stroke="#64748b" fontSize={9} />
                            <YAxis stroke="#64748b" fontSize={9} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '10px' }} />
                            <Line type="monotone" dataKey={Object.keys(msg.trendData[0])[1]} stroke="#00f0ff" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Prescriptive Action Items */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                        Prescriptive Operational Directives:
                      </span>
                      <div className="space-y-1">
                        {msg.actions.map((act: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Chat Box */}
      <div className="glass-panel p-3 border-purple-500/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type your industrial query... (e.g. 'Diagnose thermal anomaly on Laser Weld Cell 03')"
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
          >
            <span>{loading ? 'Analyzing...' : 'Dispatch Agent'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
