'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { 
  Settings, 
  Building2, 
  Users, 
  Bell, 
  Key, 
  ShieldCheck, 
  Check, 
  RefreshCw,
  Cpu
} from 'lucide-react';

export default function SettingsPage() {
  const { addToast } = useFactoryOSStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'sites' | 'users' | 'notifications' | 'apikeys'>('profile');

  // Profile Form
  const [orgName, setOrgName] = useState('Tesla Giga Manufacturing Inc.');
  const [vertical, setVertical] = useState('Automotive EV & Battery');

  // Notifications
  const [emailDigests, setEmailDigests] = useState(true);
  const [smsPagers, setSmsPagers] = useState(true);
  const [slackWebhooks, setSlackWebhooks] = useState(false);

  // API Key
  const [apiKey, setApiKey] = useState('fos_prod_live_8f99a3b2c1d4e5f67890abcdef123456');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('✅ Organization Profile updated successfully!', 'success');
  };

  const handleGenerateKey = () => {
    const newKey = `fos_prod_live_${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`;
    setApiKey(newKey);
    addToast('🔑 New 32-character Production API Key generated!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Enterprise Settings & Topologies</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organization Profile, Manufacturing Sites, User RBAC Permissions, Notification Pagers & Production API Tokens
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2">
        {[
          { id: 'profile', name: 'Organization Profile', icon: Building2 },
          { id: 'sites', name: 'Manufacturing Sites', icon: Cpu },
          { id: 'users', name: 'Users & RBAC', icon: Users },
          { id: 'notifications', name: 'Notifications & Pagers', icon: Bell },
          { id: 'apikeys', name: 'Production API Keys', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-500/20 text-cyan-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold text-slate-100">Organization Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Industry Vertical</label>
              <input
                type="text"
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-semibold"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider"
            >
              Save Organization Profile
            </button>
          </form>
        </div>
      )}

      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Gigafactory Nevada', lines: 4, oee: '87.4%', status: 'Primary Active' },
            { name: 'Austin Battery Plant', lines: 3, oee: '92.1%', status: 'Active' },
            { name: 'Berlin Stamping Facility', lines: 2, oee: '89.6%', status: 'Active' },
          ].map((s) => (
            <div key={s.name} className="glass-panel p-5 space-y-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {s.status}
              </span>
              <h3 className="text-sm font-extrabold text-slate-100">{s.name}</h3>
              <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Lines: {s.lines}</span>
                <span className="font-bold text-emerald-400">OEE: {s.oee}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-panel p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-100">Enterprise User Roster & RBAC Roles</h2>
          <table className="w-full text-left text-xs font-semibold">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="p-3 font-bold text-slate-100">Alexander Vance</td>
                <td className="p-3 font-mono text-cyan-400">alexander.vance@factoryos.ai</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold">Plant Manager</span></td>
                <td className="p-3 text-slate-400">Full Enterprise Admin Access</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-100">Sarah Chen</td>
                <td className="p-3 font-mono text-slate-400">sarah.chen@factoryos.ai</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">Lead Maintenance Eng</span></td>
                <td className="p-3 text-slate-400">Predictive RUL & Work Orders</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-100">Marcus Thorne</td>
                <td className="p-3 font-mono text-slate-400">marcus.thorne@factoryos.ai</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">Quality Auditor</span></td>
                <td className="p-3 text-slate-400">Cognex Vision AI Inspection</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold text-slate-100">Notification Pagers & Alert Subscriptions</h2>
          <div className="space-y-3 text-xs font-semibold">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={emailDigests}
                onChange={(e) => setEmailDigests(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <div>
                <div className="text-slate-100 font-bold">Email Shift Executive Digests</div>
                <div className="text-[11px] text-slate-400">Daily OEE summaries emailed at shift end</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={smsPagers}
                onChange={(e) => setSmsPagers(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <div>
                <div className="text-slate-100 font-bold">Emergency SMS Pager Alerts (P1 Critical)</div>
                <div className="text-[11px] text-slate-400">Instant SMS on Z-score anomaly breach &gt;2.25</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={slackWebhooks}
                onChange={(e) => setSlackWebhooks(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
              <div>
                <div className="text-slate-100 font-bold">Slack / Teams Webhook Integration</div>
                <div className="text-[11px] text-slate-400">Post copilot recommendations directly into channels</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'apikeys' && (
        <div className="glass-panel p-6 space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold text-slate-100">Production REST API Key Manager</h2>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-all">
            {apiKey}
          </div>
          <button
            onClick={handleGenerateKey}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider"
          >
            Generate New Production Key
          </button>
        </div>
      )}
    </div>
  );
}
