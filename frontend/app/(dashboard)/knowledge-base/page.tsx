'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { BookOpen, Search, UploadCloud, Download, Plus, X, Tag } from 'lucide-react';

export default function KnowledgeBasePage() {
  const { addToast } = useFactoryOSStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('SOP-OPT-');
  const [category, setCategory] = useState('SOP');

  const [sops, setSops] = useState<any[]>([
    {
      code: 'SOP-PRESS-101',
      title: 'Schuler Hydraulic Press Cylinder B-2 Seal Purge Protocol',
      category: 'SOP',
      size: '1.4 MB',
      author: 'Dr. Marcus Thorne',
      tags: ['Hydraulics', 'Schuler Press', 'P1 Protocol'],
    },
    {
      code: 'SOP-WELD-204',
      title: 'Laser Optics Nitrogen Inert Atmosphere Purge Sequence',
      category: 'Manual',
      size: '2.8 MB',
      author: 'Sarah Chen',
      tags: ['Laser Weld', 'Optics', 'Nitrogen'],
    },
    {
      code: 'SPEC-VIB-309',
      title: 'ISO 10816 Class III Harmonic Vibration Threshold Limits',
      category: 'Spec',
      size: '890 KB',
      author: 'Alexander Vance',
      tags: ['ISO Standards', 'Vibration', 'Sensors'],
    },
  ]);

  const handleUploadSOP = (e: React.FormEvent) => {
    e.preventDefault();
    const newSop = {
      code: code || `SOP-NEW-${Math.floor(100 + Math.random() * 900)}`,
      title: title || 'Custom Operating Procedure',
      category,
      size: '1.1 MB',
      author: 'Alexander Vance',
      tags: ['Custom', category],
    };
    setSops([newSop, ...sops]);
    setIsModalOpen(false);
    setTitle('');
    addToast(`📚 SOP "${newSop.code}" indexed into Vector Store!`, 'success');
  };

  const handleDownloadSOP = (sop: any) => {
    const textContent = `FACTORY OS — STANDARD OPERATING PROCEDURE (SOP)\n` +
      `Code: ${sop.code}\nTitle: ${sop.title}\nCategory: ${sop.category}\nAuthor: ${sop.author}\n` +
      `Tags: ${sop.tags.join(', ')}\n\n` +
      `1. PRE-INSPECTION: Verify machine power isolate and safety interlocks.\n` +
      `2. DIAGNOSTIC: Check telemetry parameters against ISO 10816 class III limits.\n` +
      `3. EXECUTION: Follow prescribed step-by-step maintenance sequence.\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sop.code}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`📥 Downloaded ${sop.code}.txt`, 'success');
  };

  const filtered = sops.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Manufacturing Knowledge Base & SOPs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            RAG Vector Store Document Embeddings, Standard Operating Procedures & ISO Specifications
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload SOP Document</span>
        </button>
      </div>

      {/* AI Semantic Search Bar */}
      <div className="glass-panel p-3 border-purple-500/40 flex items-center gap-3">
        <Search className="w-4 h-4 text-cyan-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="AI Vector Semantic Search across SOPs & Manuals... (e.g. 'Hydraulics', 'ISO 10816')"
          className="flex-1 bg-transparent border-none outline-none text-xs font-semibold text-slate-100 placeholder-slate-500"
        />
        <button
          onClick={() => addToast(`🔍 AI Vector Search executed for "${searchQuery}"`, 'info')}
          className="px-4 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold hover:bg-purple-500/30"
        >
          AI Search
        </button>
      </div>

      {/* SOP Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sop) => (
          <div key={sop.code} className="glass-panel p-5 space-y-3 hover:border-purple-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold text-xs">{sop.code}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
                  {sop.category}
                </span>
              </div>
              <h2 className="text-xs font-extrabold text-slate-100 leading-snug">{sop.title}</h2>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span>By {sop.author}</span>
                <span>•</span>
                <span>{sop.size}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap gap-1">
                {sop.tags.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[9px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleDownloadSOP(sop)}
                className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SOP Manual</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload SOP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-100">Upload & Index New SOP</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUploadSOP} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">SOP Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. SOP-OPT-502"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">SOP Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Robotic Paint Arm Calibration Protocol"
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
                  <option>SOP</option>
                  <option>Manual</option>
                  <option>Spec</option>
                  <option>Safety Protocol</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-extrabold text-xs text-white uppercase tracking-wider">
                Upload & Vector Index SOP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
