'use client';

import React, { useState, useEffect } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  Gauge, 
  AlertOctagon, 
  Wrench, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function OverviewPage() {
  const { activeSite, refreshCounter, triggerRefresh, addToast } = useFactoryOSStore();
  const [machines, setMachines] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    triggerRefresh();
    try {
      const res = await api.getMachines();
      setMachines(res.machines || []);
      addToast('🔄 Telemetry data refetched from sensors.', 'info');
    } catch (e) {}
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    api.getMachines().then((res) => setMachines(res.machines || []));
  }, [refreshCounter]);

  const historyData = [
    { time: '00:00', oee: 84.2 },
    { time: '04:00', oee: 85.8 },
    { time: '08:00', oee: 89.1 },
    { time: '12:00', oee: 87.4 },
    { time: '16:00', oee: 88.6 },
    { time: '20:00', oee: 89.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Banner */}
      <div className="glass-panel-glow p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-purple-500/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold uppercase border border-cyan-500/40">
              Live Plant Operations
            </span>
            <span className="text-xs font-bold text-slate-400">● Real-time Telemetry Tele-Stream</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-wide mt-1">
            {activeSite}
          </h1>
          <p className="text-xs text-slate-400">
            Automated Decision Intelligence & Machine Prognostics Engine
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-purple-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Plant OEE Target</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100 mt-2 font-mono">87.4%</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.1% vs shift baseline</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">First Pass Yield</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100 mt-2 font-mono">98.4%</div>
          <div className="text-xs text-slate-400 mt-2 font-semibold">Six Sigma Benchmark: 5.2σ</div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Machine Availability</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100 mt-2 font-mono">94.5%</div>
          <div className="text-xs text-emerald-400 mt-2 font-semibold">5 of 5 Lines Active</div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-5 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Incidents</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">1 Active</div>
          <div className="text-xs text-amber-300 mt-2 font-semibold">Laser Weld Cell 03 Warning</div>
        </div>
      </div>

      {/* Machine Fleet Health Grid & OEE Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Machine Fleet Health Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Machine Fleet Telemetry Grid</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">Live IoT Sensors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {machines.map((m) => (
              <div
                key={m.id}
                className="glass-panel p-4 hover:border-purple-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{m.name}</h3>
                    <span className="text-[10px] text-slate-400">{m.line}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                      m.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : m.status === 'DEGRADED'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[9px] block uppercase font-bold">Health</span>
                    <span className="font-extrabold text-purple-300">{m.healthScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block uppercase font-bold">Vibration</span>
                    <span className="font-extrabold text-slate-200">{m.vibration} mm/s</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] block uppercase font-bold">RUL</span>
                    <span className="font-extrabold text-cyan-300">{m.predictedRul} hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: OEE Component Gauges & 24h Trend Chart */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>24-Hour OEE Telemetry Trend</span>
          </h2>

          <div className="glass-panel p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="oeeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis domain={[70, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="oee" stroke="#00f0ff" strokeWidth={2} fill="url(#oeeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
