'use client';

import React, { useState, useEffect } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { FileSpreadsheet, Plus, Download, FileText, X } from 'lucide-react';

export default function ReportsPage() {
  const { addToast } = useFactoryOSStore();
  const [reports, setReports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Executive Digest');
  const [format, setFormat] = useState('PDF');

  useEffect(() => {
    api.getReports().then((res) => setReports(res.reports || []));
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRep = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      name: `${title.replace(/\s+/g, '_')}.${format.toLowerCase()}`,
      category,
      size: '950 KB',
      date: new Date().toISOString().split('T')[0],
      format,
    };
    setReports([newRep, ...reports]);
    setIsModalOpen(false);
    setTitle('');
    addToast(`📄 Report "${newRep.name}" generated successfully!`, 'success');
  };

  const handleDownloadReport = (rep: any) => {
    const textContent = `FACTORY OS — EXECUTIVE REPORT SUMMARY\n` +
      `Report Title: ${rep.name}\n` +
      `Category: ${rep.category}\n` +
      `Generated Date: ${rep.date}\n` +
      `Format: ${rep.format}\n` +
      `Plant: Nevada Gigafactory Line 1-4\n` +
      `Overall OEE: 87.4%\nFirst Pass Yield: 98.4%\n` +
      `Status: AUDITED & COMPLIANT\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = rep.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`📥 Downloaded ${rep.name}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Automated Executive & Shift Reports</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compiled Shift Digests, Quality Audits, and Custom PDF/CSV Report Generation
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Custom Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="p-3">Report ID</th>
                <th className="p-3">File Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-mono text-cyan-400">{rep.id}</td>
                  <td className="p-3 font-bold text-slate-100">{rep.name}</td>
                  <td className="p-3 text-slate-400">{rep.category}</td>
                  <td className="p-3 font-mono text-slate-500">{rep.size}</td>
                  <td className="p-3 text-slate-400 font-mono">{rep.date}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDownloadReport(rep)}
                      className="px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/40 text-purple-300 text-[10px] font-bold hover:bg-purple-500/25 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Custom Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-100">Generate Custom Intelligence Report</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Report Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shift_A_Downtime_Audit"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                >
                  <option>Executive Digest</option>
                  <option>Maintenance & RUL</option>
                  <option>Quality Control</option>
                  <option>Supply Chain</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                >
                  <option>PDF</option>
                  <option>CSV</option>
                  <option>XLSX</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-extrabold text-xs text-white uppercase tracking-wider">
                Compile & Generate Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
