'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { 
  LineChart as LineChartIcon, 
  Download, 
  Calendar, 
  Activity, 
  BarChart3, 
  Zap 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AnalyticsPage() {
  const { addToast } = useFactoryOSStore();
  const [range, setRange] = useState('Today (Real-time)');

  const shiftData = [
    { shift: 'Shift A (Morning)', oee: 93.8, yield: 98.8, downtime: 14 },
    { shift: 'Shift B (Evening)', oee: 92.1, yield: 98.4, downtime: 22 },
    { shift: 'Shift C (Night)', oee: 89.6, yield: 97.9, downtime: 45 },
  ];

  const correlationData = [
    { temp: 42, vib: 0.8 },
    { temp: 55, vib: 1.1 },
    { temp: 68, vib: 1.5 },
    { temp: 74, vib: 1.9 },
    { temp: 88, vib: 2.8 },
  ];

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Shift,OEE,PassYield,DowntimeMins\n' +
      shiftData.map((e) => `"${e.shift}",${e.oee},${e.yield},${e.downtime}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const sanitizedRange = range.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('download', `factory_os_analytics_${sanitizedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`📥 Downloaded factory_os_analytics_${sanitizedRange}.csv`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Analytics & Shift Intelligence</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-Shift OEE Comparative Matrix, Thermal-Vibration Correlation & CSV Data Exporter
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200"
          >
            <option>Today (Real-time)</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Quarter to Date</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export Dataset</span>
          </button>
        </div>
      </div>

      {/* Multi-Shift OEE & Yield Breakdown BarChart */}
      <div className="glass-panel p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Multi-Shift Performance Matrix (OEE vs Pass Yield %)
        </h2>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shiftData}>
              <XAxis dataKey="shift" stroke="#64748b" fontSize={10} />
              <YAxis domain={[80, 100]} stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="oee" name="OEE Score (%)" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="yield" name="Pass Yield (%)" fill="#00f0ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thermal-Vibration Correlation Matrix */}
      <div className="glass-panel p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Thermal (°C) vs Vibration (mm/s) Correlation Matrix
        </h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={correlationData}>
              <XAxis dataKey="temp" stroke="#64748b" fontSize={10} name="Temperature °C" />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="vib" stroke="#f43f5e" strokeWidth={2.5} name="Vibration mm/s" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
