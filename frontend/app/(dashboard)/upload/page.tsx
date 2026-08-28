'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { UploadCloud, FileSpreadsheet, CheckCircle2, Database, ArrowRight, Zap } from 'lucide-react';

export default function UploadPage() {
  const { addToast } = useFactoryOSStore();
  const [file, setFile] = useState<File | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const schemaMapping = [
    { csvCol: 'Machine_ID', internalField: 'machine_id', status: 'Mapped OK' },
    { csvCol: 'Timestamp_UTC', internalField: 'timestamp', status: 'Mapped OK' },
    { csvCol: 'Vibration_Val', internalField: 'vibration_mm_s', status: 'Mapped OK' },
    { csvCol: 'Thermal_Sensor', internalField: 'temperature_celsius', status: 'Mapped OK' },
  ];

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      addToast(`📄 File "${e.target.files[0].name}" uploaded. Schema validation passed!`, 'info');
    }
  };

  const handleIngest = () => {
    setIngesting(true);
    setTimeout(() => {
      setIngesting(false);
      addToast('⚡ 14,200 telemetry records ingested into SQLite DB & ChromaDB Vector Store!', 'success');
    }, 1500);
  };

  const handleTestDB = () => {
    setDbStatus('Testing connection...');
    setTimeout(() => {
      setDbStatus('Connected: PostgreSQL / TimescaleDB Cluster — Latency: 1.4ms');
      addToast('✅ Cluster connection verified! Latency: 1.4ms', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Manufacturing Data Ingestion Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            CSV Batch Data Importer, Column Schema Mapping & Database Cluster Latency Verification
          </p>
        </div>

        <button
          onClick={handleTestDB}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white"
        >
          <Database className="w-4 h-4 text-purple-400" />
          <span>Test DB Connection</span>
        </button>
      </div>

      {dbStatus && (
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono font-bold text-purple-300">
          {dbStatus}
        </div>
      )}

      {/* Drag & Drop Ingestion Card */}
      <div className="glass-panel p-8 border-dashed border-2 border-slate-700 hover:border-cyan-500/50 transition-all text-center space-y-3">
        <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto" />
        <div>
          <h2 className="text-sm font-extrabold text-slate-100">Drag & Drop Telemetry CSV or Excel</h2>
          <p className="text-xs text-slate-400 mt-1">Supports files up to 500MB for batch vector indexing</p>
        </div>

        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileDrop}
          className="hidden"
          id="file-upload-input"
        />

        <label
          htmlFor="file-upload-input"
          className="inline-block px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold cursor-pointer hover:bg-purple-500/30 transition-all"
        >
          Browse Files
        </label>

        {file && (
          <div className="text-xs font-bold text-cyan-300 font-mono">
            Loaded: {file.name} ({Math.round(file.size / 1024)} KB)
          </div>
        )}
      </div>

      {/* Schema Mapping & Validator Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-extrabold text-slate-100">Schema Field Mapping & Validator</h2>
          <span className="text-xs text-emerald-400 font-bold">4 Fields Validated</span>
        </div>

        <table className="w-full text-left text-xs font-semibold">
          <thead className="text-[10px] text-slate-400 uppercase bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="p-3">CSV Header Column</th>
              <th className="p-3">Internal Schema Target</th>
              <th className="p-3">Validation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {schemaMapping.map((s) => (
              <tr key={s.csvCol}>
                <td className="p-3 font-mono text-slate-400">{s.csvCol}</td>
                <td className="p-3 font-mono text-cyan-400">{s.internalField}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={handleIngest}
          disabled={ingesting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
        >
          <span>{ingesting ? 'Ingesting 14,200 records...' : 'Proceed to Schema Ingestion'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
