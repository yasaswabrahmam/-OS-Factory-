'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFactoryOSStore } from '@/lib/store';
import { Cpu, Building2, Factory, Mail, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useFactoryOSStore();
  const [plantName, setPlantName] = useState('');
  const [vertical, setVertical] = useState('Automotive EV & Battery');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`✅ Plant "${plantName}" registered successfully! Welcome to Factory OS.`, 'success');
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-slate-100">Register Manufacturing Plant</h1>
          <p className="text-xs text-slate-400 mt-1">Connect your factory lines to Factory OS Intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Facility / Plant Name</label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g. Gigafactory Nevada — Assembly Alpha"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Industry Vertical</label>
            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-100"
            >
              <option>Automotive EV & Battery</option>
              <option>Aerospace & Composites</option>
              <option>Semiconductor & Electronics</option>
              <option>Heavy Industrial Machinery</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Register Facility</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-cyan-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
