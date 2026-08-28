'use client';

import React from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BarChart2, 
  Camera 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function QualityPage() {
  const defectsData = [
    { batch: 'B-9910', sku: 'SKU-BAT-882', defect: 'Laser Weld Micro-porosity', confidence: 98.4, camera: 'CAM-01 (Cell A)' },
    { batch: 'B-9912', sku: 'SKU-STL-402', defect: 'Surface Thermal Discoloration', confidence: 94.2, camera: 'CAM-02 (Stamping)' },
    { batch: 'B-9915', sku: 'SKU-CFB-109', defect: 'Composite Fiber Seam Misalignment', confidence: 99.1, camera: 'CAM-04 (Composites)' },
  ];

  const paretoData = [
    { type: 'Weld Porosity', count: 42 },
    { type: 'Surface Scuff', count: 28 },
    { type: 'Dimensional Offset', count: 14 },
    { type: 'Thermal Tear', count: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Quality Control & Computer Vision</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cognex ViDi Deep Learning Inspection Node (Camera Node Q-1) & FPY Analytics
          </p>
        </div>
      </div>

      {/* Inspection Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">First Pass Yield (FPY)</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">98.4%</div>
          <span className="text-[10px] text-slate-500 font-semibold">Target: &gt;98.0% (Six Sigma 5.2σ)</span>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Cognex Vision AI Precision</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">99.8%</div>
          <span className="text-[10px] text-slate-500 font-semibold">Deep Learning ViDi Engine v4.2</span>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Defect Density</span>
          <div className="text-3xl font-extrabold text-purple-300 font-mono">1.6 / 1k</div>
          <span className="text-[10px] text-slate-500 font-semibold">Units Inspected Today: 14,200</span>
        </div>
      </div>

      {/* Vision AI Viewport & Defect Pareto Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection Log Table */}
        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Vision AI Defect Inspection Feed</span>
            </h2>
            <span className="text-xs text-purple-400 font-bold">Real-time Stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="p-3">Batch ID</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Defect Type</th>
                  <th className="p-3">AI Confidence</th>
                  <th className="p-3">Camera Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
                {defectsData.map((d) => (
                  <tr key={d.batch} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">{d.batch}</td>
                    <td className="p-3 font-mono text-slate-400">{d.sku}</td>
                    <td className="p-3 text-rose-400 font-bold">{d.defect}</td>
                    <td className="p-3 font-mono text-emerald-400">{d.confidence}%</td>
                    <td className="p-3 text-slate-400">{d.camera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Defect Pareto Breakdown */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Defect Pareto Breakdown
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paretoData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis dataKey="type" type="category" stroke="#64748b" fontSize={9} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Quality Root Cause Hints */}
      <div className="glass-panel p-5 border-purple-500/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-extrabold text-purple-400 uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Quality Root Cause Prescription Hints</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          • Laser Weld Micro-porosity correlates with nitrogen purge flow fluctuations on Laser Weld Cell 03. Adjust nitrogen flow regulator by +3.5 L/min to stabilize weld pool inert atmosphere.
        </p>
      </div>
    </div>
  );
}
