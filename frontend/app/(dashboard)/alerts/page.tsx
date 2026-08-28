'use client';

import React, { useState, useEffect } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { 
  BellAlert as Bell, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  Filter 
} from 'lucide-react';

export default function AlertsPage() {
  const { addToast } = useFactoryOSStore();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    api.getAlerts().then((res) => setAlerts(res.alerts || []));
  }, []);

  const handleAcknowledge = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    addToast('👍 Alert acknowledged.', 'info');
  };

  const handleResolve = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
    addToast('✅ Alert marked as Resolved.', 'success');
  };

  const filteredAlerts = alerts.filter(
    (a) => severityFilter === 'ALL' || a.severity.toUpperCase() === severityFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Alarms & Critical Events Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Telemetry Alarm Queue, Severity Filtering & Incident Triage Workflow
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((f) => (
            <button
              key={f}
              onClick={() => setSeverityFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                severityFilter === f
                  ? 'bg-purple-500/20 text-cyan-300 border border-purple-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3">Severity</th>
                <th className="p-3">Component / Machine</th>
                <th className="p-3">Alert Message</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Triage Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {filteredAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-900/40">
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        a.severity === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : a.severity === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {a.severity}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-100">{a.component}</td>
                  <td className="p-3 text-slate-300 max-w-md">{a.msg}</td>
                  <td className="p-3 text-slate-500 font-mono text-[10px]">{a.created_at || 'Just now'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-300'}`}>
                      {a.status || 'UNACKNOWLEDGED'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {a.status !== 'ACKNOWLEDGED' && a.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleAcknowledge(a.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold hover:bg-slate-700"
                        >
                          Ack
                        </button>
                      )}
                      {a.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleResolve(a.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
