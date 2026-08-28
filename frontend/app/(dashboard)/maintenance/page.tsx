'use client';

import React, { useState, useEffect } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { 
  Wrench, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  X, 
  TrendingDown, 
  CheckCircle2 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export default function MaintenancePage() {
  const { addToast } = useFactoryOSStore();
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState('Expedited (High P1)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.getMachines().then((res) => setMachines(res.machines || []));
  }, []);

  const handleScheduleWO = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    addToast(`🔧 Maintenance Work Order scheduled for ${selectedMachine?.name} (${priority})!`, 'success');
  };

  const degradationCurve = [
    { day: 'Day 1', baseline: 100, degradation: 98 },
    { day: 'Day 3', baseline: 100, degradation: 92 },
    { day: 'Day 5', baseline: 100, degradation: 81 },
    { day: 'Day 7 (Today)', baseline: 100, degradation: 78 },
    { day: 'Day 9 (Forecast)', baseline: 100, degradation: 45 },
    { day: 'Day 12 (Critical)', baseline: 100, degradation: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Predictive Asset Health & Maintenance</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine Health Scores, Bearing Vibration Sensors, and RUL Degradation Prognostics
          </p>
        </div>
      </div>

      {/* RUL Degradation Curve */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-purple-400" />
            <span>RUL Degradation Trajectory (Laser Weld Cell 03)</span>
          </h2>
          <span className="text-xs text-rose-400 font-bold">Predicted Failure Horizon: 48 Hours</span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={degradationCurve}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px' }} />
              <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Maintenance Threshold (50%)', fill: '#f43f5e', fontSize: 10 }} />
              <Line type="monotone" dataKey="degradation" stroke="#00f0ff" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Telemetry Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-extrabold text-slate-100">Machine Fleet Health Roster</h2>
          <span className="text-xs text-slate-400 font-bold">{machines.length} Fleet Nodes Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3">Machine Name</th>
                <th className="p-3">Line</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Vibration (mm/s)</th>
                <th className="p-3">Thermal (°C)</th>
                <th className="p-3">Predicted RUL</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {machines.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-slate-100">{m.name}</td>
                  <td className="p-3 text-slate-400">{m.line}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.healthScore > 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {m.healthScore}/100
                    </span>
                  </td>
                  <td className="p-3 font-mono">{m.vibration} mm/s</td>
                  <td className="p-3 font-mono">{m.temperature}°C</td>
                  <td className="p-3 font-mono text-cyan-400 font-bold">{m.predictedRul} hrs</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedMachine(m);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/40 text-purple-300 text-[10px] font-bold hover:bg-purple-500/25"
                    >
                      Schedule WO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Work Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-100">Schedule Preventative Work Order</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 font-bold">
              Machine: <span className="text-cyan-400">{selectedMachine?.name}</span>
            </div>
            <form onSubmit={handleScheduleWO} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                >
                  <option>Expedited (High P1)</option>
                  <option>Routine Maintenance (P2)</option>
                  <option>Next Handover Shift (P3)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Technician Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Inspect spindle bearing seals and nitrogen purge pressure"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 h-20"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-extrabold text-xs text-white uppercase tracking-wider">
                Dispatch Work Order to SAP PM
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
