'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFactoryOSStore } from '@/lib/store';
import {
  LayoutDashboard,
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
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useFactoryOSStore();

  const navItems = [
    { name: 'Executive Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'AI Decision Copilot', path: '/copilot', icon: Bot, badge: 'AI Agent' },
    { name: 'Production & MES', path: '/production', icon: Factory },
    { name: 'Predictive Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Quality & Vision AI', path: '/quality', icon: ShieldCheck },
    { name: 'Inventory & Materials', path: '/inventory', icon: Boxes },
    { name: 'Analytics & Shift Matrix', path: '/analytics', icon: LineChart },
    { name: 'AI Recommendations', path: '/recommendations', icon: Lightbulb },
    { name: 'Alarms & Events', path: '/alerts', icon: Bell },
    { name: 'Data Ingestion Hub', path: '/upload', icon: UploadCloud },
    { name: 'Executive Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Knowledge Base & SOPs', path: '/knowledge-base', icon: BookOpen },
    { name: 'Settings & Topologies', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all duration-300 flex flex-col z-20 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-800/80 flex items-center justify-between px-4">
        {!isSidebarCollapsed && (
          <Link href="/overview" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                FACTORY OS
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Decision Platform
              </span>
            </div>
          </Link>
        )}
        {isSidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              title={isSidebarCollapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-cyan-500/20 border border-purple-500/50 text-cyan-300 font-bold shadow-lg shadow-purple-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!isSidebarCollapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}
              {!isSidebarCollapsed && item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-800/80">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
