'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFactoryOSStore } from '@/lib/store';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { addToast } = useFactoryOSStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast('📧 Password reset instructions sent to your email.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-slate-100">Reset Enterprise Password</h1>
          <p className="text-xs text-slate-400 mt-1">Enter your work email to receive password recovery steps</p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-xs font-bold text-emerald-300">Recovery Instructions Sent!</div>
            <p className="text-[11px] text-slate-400">Check your inbox for password reset link.</p>
            <Link href="/login" className="inline-block mt-2 text-xs font-bold text-cyan-400 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexander.vance@factoryos.ai"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Remember password?{' '}
          <Link href="/login" className="font-bold text-cyan-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
