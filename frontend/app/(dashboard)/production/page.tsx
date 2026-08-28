'use client';

import React, { useState, useEffect } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { 
  Factory, 
  Plus, 
  Filter, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  X, 
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function ProductionPage() {
  const { addToast } = useFactoryOSStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [downtime, setDowntime] = useState<any[]>([]);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState('All Shifts');

  // Form State
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [line, setLine] = useState('Line 1 — Nevada Giga');
  const [targetQty, setTargetQty] = useState(1000);

  useEffect(() => {
    api.getWorkOrders().then((res) => setOrders(res.orders || []));
    setDowntime([
      { id: 'DT-101', machine: 'Durr Convection Oven O-4', durationMins: 45, reason: 'Thermal ramp temperature sensor calibration drift', impact: '$14,500' },
      { id: 'DT-102', machine: 'Laser Weld Cell 03', durationMins: 22, reason: 'Nitrogen purge line pressure drop', impact: '$7,200' },
      { id: 'DT-103', machine: 'Schuler Press S-200', durationMins: 14, reason: 'Proportional valve B-2 seal check', impact: '$4,100' },
    ]);
  }, []);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd = {
      id: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sku: sku || 'SKU-CUSTOM-99',
      productName: productName || 'Custom Battery Pack Component',
      line: line,
      targetQty: Number(targetQty),
      completedQty: 0,
      defectsQty: 0,
      status: 'In Progress',
    };
    setOrders([newOrd, ...orders]);
    setIsNewOrderModalOpen(false);
    setProductName('');
    setSku('');
    addToast(`🏭 Work Order ${newOrd.id} dispatched directly to MES table!`, 'success');
  };

  const utilizationData = [
    { line: 'Line 1', util: 92 },
    { line: 'Line 2', util: 88 },
    { line: 'Line 3', util: 95 },
    { line: 'Line 4', util: 62 },
    { line: 'Line 5', util: 96 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Production Operations & MES</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active Work Orders, Line Utilization Ratings & Downtime Financial Logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            <Filter className="w-4 h-4 text-purple-400" />
            <span>Shift: {selectedShift}</span>
          </button>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* Line Utilization BarChart & Downtime Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Line Utilization Rates (%)
            </h2>
            <span className="text-[10px] text-cyan-400 font-bold">Target: &gt;90%</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <XAxis dataKey="line" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="util" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Downtime Incident Financial Log */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Downtime Financial Impact</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </h2>
          <div className="space-y-2.5">
            {downtime.map((dt) => (
              <div key={dt.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="truncate">{dt.machine}</span>
                  <span className="text-rose-400 font-mono">{dt.impact}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{dt.reason}</span>
                  <span className="text-slate-500 font-mono">{dt.durationMins} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Work Orders Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-extrabold text-slate-100">Active MES Work Orders</h2>
          <span className="text-xs text-purple-400 font-bold">{orders.length} Active Orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Line</th>
                <th className="p-3">Completion Progress</th>
                <th className="p-3">Defects</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {orders.map((ord) => {
                const pct = Math.round((ord.completedQty / ord.targetQty) * 100);
                return (
                  <tr key={ord.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">{ord.id}</td>
                    <td className="p-3 font-mono text-slate-400">{ord.sku}</td>
                    <td className="p-3 font-bold text-slate-100">{ord.productName}</td>
                    <td className="p-3 text-slate-400">{ord.line}</td>
                    <td className="p-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-mono">{pct}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-amber-400">{ord.defectsQty}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-300'}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Work Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-100">Create New MES Work Order</h3>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Lithium Cell Pack 4680"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SKU-BAT-882"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Quantity</label>
                <input
                  type="number"
                  value={targetQty}
                  onChange={(e) => setTargetQty(Number(e.target.value))}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-extrabold text-xs text-white uppercase tracking-wider">
                Dispatch Order to MES
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shift Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel-glow border-purple-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-100">Filter Shift View</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {['All Shifts', 'Shift A (Morning)', 'Shift B (Evening)', 'Shift C (Night)'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedShift(s);
                    setIsFilterModalOpen(false);
                    addToast(`Shift view set to ${s}`, 'info');
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left ${selectedShift === s ? 'bg-purple-500/20 text-cyan-300 border border-purple-500/40' : 'bg-slate-900 text-slate-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
