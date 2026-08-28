'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { Lightbulb, CheckCircle2, ShieldAlert, Zap, DollarSign } from 'lucide-react';

export default function RecommendationsPage() {
  const { addToast } = useFactoryOSStore();
  const [recs, setRecs] = useState<any[]>([
    {
      id: 'REC-01',
      title: 'Reduce SPM Speed on Laser Weld Cell 03',
      severity: 'HIGH IMPACT',
      confidence: 96.4,
      savings: '$18,400/shift',
      desc: 'Thermal runaway detected on bearing assembly. Reducing speed from 24.5 to 22.0 SPM stabilizes temperature curve and prevents unscheduled downtime.',
      applied: false,
    },
    {
      id: 'REC-02',
      title: 'SAP MM Requisition Dispatch — Valve Seals',
      severity: 'CRITICAL',
      confidence: 99.1,
      savings: '$45,000 shutdown prevention',
      desc: 'Proportional valve seals stock at 2 kits (safety threshold: 5). Dispatch emergency procurement requisition to Bosch Rexroth.',
      applied: false,
    },
    {
      id: 'REC-03',
      title: 'Paint Oven B Thermal Pre-heat Schedule',
      severity: 'MEDIUM IMPACT',
      confidence: 92.0,
      savings: '+12 mins throughput',
      desc: 'Schedule automated thermal ramp 15 mins before Shift A morning start to optimize first-hour cure yield.',
      applied: false,
    },
  ]);

  const handleApply = (id: string, title: string) => {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );
    addToast(`⚡ Protocol "${title}" locked as Active in MES!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">AI Prescriptive Recommendations</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning Action Cards Prioritized by Financial Impact ($) & AI Confidence Rate
          </p>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recs.map((r) => (
          <div
            key={r.id}
            className={`glass-panel p-5 space-y-3 transition-all ${
              r.applied ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:border-purple-500/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    r.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  }`}
                >
                  {r.severity}
                </span>
                <h2 className="text-sm font-extrabold text-slate-100">{r.title}</h2>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-cyan-300 font-mono">{r.confidence}% Confidence</span>
                <span className="text-emerald-400 font-mono font-extrabold">{r.savings}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{r.desc}</p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
              {r.applied ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Active in MES</span>
                </span>
              ) : (
                <button
                  onClick={() => handleApply(r.id, r.title)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-purple-500/20"
                >
                  Apply Protocol
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
