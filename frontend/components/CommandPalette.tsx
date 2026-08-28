'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFactoryOSStore } from '@/lib/store';
import { 
  Search, 
  Bot, 
  Factory, 
  Wrench, 
  ShieldCheck, 
  Boxes, 
  LineChart, 
  Lightbulb, 
  Bell, 
  UploadCloud, 
  FileSpreadsheet, 
  BookOpen, 
  Settings, 
  X,
  Sparkles
} from 'lucide-react';

export default function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen, addToast } = useFactoryOSStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { name: 'Ask AI Copilot Diagnostic', icon: Bot, path: '/copilot', category: 'AI Intelligence' },
    { name: 'View Active Work Orders', icon: Factory, path: '/production', category: 'Production MES' },
    { name: 'Inspect Machine Fleet RUL', icon: Wrench, path: '/maintenance', category: 'Maintenance' },
    { name: 'Check Cognex Vision AI Defects', icon: ShieldCheck, path: '/quality', category: 'Quality QA' },
    { name: 'Execute Bulk Reorder Wizard', icon: Boxes, path: '/inventory', category: 'Inventory' },
    { name: 'Run 1,000 Monte Carlo Simulation', icon: LineChart, path: '/analytics', category: 'Analytics' },
    { name: 'Review AI Recommendations', icon: Lightbulb, path: '/recommendations', category: 'AI Insights' },
    { name: 'Acknowledge Critical Alarms', icon: Bell, path: '/alerts', category: 'Alarms' },
    { name: 'Ingest Telemetry CSV Dataset', icon: UploadCloud, path: '/upload', category: 'Data Upload' },
    { name: 'Generate Shift Summary Report', icon: FileSpreadsheet, path: '/reports', category: 'Reports' },
    { name: 'Search SOP Knowledge Base', icon: BookOpen, path: '/knowledge-base', category: 'SOP Manuals' },
    { name: 'Configure Plant Thresholds', icon: Settings, path: '/settings', category: 'Settings' },
  ];

  const filtered = actions.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string, name: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    router.push(path);
    addToast(`📍 Navigated to: ${name}`, 'info');
  };

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-panel-glow border-purple-500/40 p-4 shadow-2xl overflow-hidden"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search platform module... (e.g. 'Copilot', 'OEE', 'Weld')"
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500 font-semibold"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Results List */}
        <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching commands. Try searching for <span className="text-cyan-400">Copilot</span> or <span className="text-purple-400">Maintenance</span>.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path + item.name}
                  onClick={() => handleSelect(item.path, item.name)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-500/20 hover:border hover:border-purple-500/40 text-left group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Execute →
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Factory OS Command Engine</span>
          </div>
          <div>Press <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Esc</kbd> to exit</div>
        </div>
      </div>
    </div>
  );
}
