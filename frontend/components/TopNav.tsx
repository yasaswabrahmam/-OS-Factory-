'use client';

import React, { useState } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { 
  Building2, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Command, 
  LogOut, 
  Check, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function TopNav() {
  const { 
    activeSite, 
    setActiveSite, 
    setCommandPaletteOpen, 
    notifications, 
    markAllNotificationsRead, 
    user, 
    logout,
    triggerRefresh,
    refreshCounter
  } = useFactoryOSStore();

  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sites = [
    'Gigafactory Nevada — Line 1-4',
    'Austin Battery Plant',
    'Berlin Stamping Facility',
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Site Switcher & Live Status */}
      <div className="flex items-center gap-4">
        {/* Multi-Site Factory Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-sm font-semibold text-slate-100 hover:border-purple-500/50 transition-all"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="max-w-[200px] truncate">{activeSite}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isSiteDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 glass-panel-glow py-2 z-50">
              <div className="px-3 py-1 text-xs font-bold text-purple-400 uppercase tracking-wider">
                Manufacturing Sites
              </div>
              {sites.map((site) => (
                <button
                  key={site}
                  onClick={() => {
                    setActiveSite(site);
                    setIsSiteDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-purple-500/20 hover:text-cyan-300 flex items-center justify-between"
                >
                  <span>{site}</span>
                  {activeSite === site && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Plant Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>All 5 Production Lines Operational — 87.4% OEE</span>
        </div>
      </div>

      {/* Right: Quick Action, Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Manual Refresh Trigger */}
        <button
          onClick={handleRefresh}
          title="Refresh Telemetry"
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Quick Action Button / Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/40 text-xs font-bold text-purple-300 hover:bg-purple-500/25 transition-all"
        >
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Actions</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 relative transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-panel-glow py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">System Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-purple-400 hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 text-xs hover:bg-slate-900/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${n.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-left pr-1">
              <div className="text-xs font-bold text-slate-100">{user.name}</div>
              <div className="text-[10px] text-slate-400">{user.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel-glow py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <div className="text-xs font-bold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-purple-400">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
