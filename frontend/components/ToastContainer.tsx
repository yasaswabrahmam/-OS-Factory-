'use client';

import React from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { CheckCircle, Info, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useFactoryOSStore();

  const iconMap = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
    danger: AlertOctagon,
  };

  const colorMap = {
    success: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    info: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    warning: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    danger: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const Icon = iconMap[t.type] || Info;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-xl border glass-panel shadow-xl flex items-start gap-3 animate-in slide-in-from-right duration-300 ${colorMap[t.type]}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold text-slate-100 leading-snug">
              {t.msg}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
