'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast } = useFactoryOSStore();
  const [email, setEmail] = useState('alexander.vance@factoryos.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        login(res.accessToken, res.user);
        addToast(`🟢 Welcome back, ${res.user.name}! Plant console unlocked.`, 'success');
        router.push('/overview');
      } else {
        addToast('⚠️ Invalid credentials. Please try again.', 'danger');
      }
    } catch (err) {
      addToast('⚠️ Authentication failed.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-8 shadow-2xl relative z-10">
        {/* Brand Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/30 mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            FACTORY OS
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Enterprise Decision Intelligence
          </p>
        </div>

        {/* Demo Credentials Badge */}
        <div className="mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-purple-300">1-Click Demo Credentials:</span>
            <div className="text-[11px] text-slate-400 font-mono">alexander.vance@factoryos.ai / password123</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 left-0 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-cyan-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Plant Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Need a plant workspace?{' '}
          <Link href="/register" className="font-bold text-cyan-400 hover:underline">
            Register your facility
          </Link>
        </div>
      </div>
    </div>
  );
}
