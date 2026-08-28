'use client';

import React, { useState, useEffect } from 'react';
import { useFactoryOSStore } from '@/lib/store';
import { api } from '@/lib/api';
import { 
  Boxes, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Layers 
} from 'lucide-react';

export default function InventoryPage() {
  const { addToast } = useFactoryOSStore();
  const [inventory, setInventory] = useState<any[]>([]);
  const [isBulkWizardOpen, setIsBulkWizardOpen] = useState(false);

  useEffect(() => {
    api.getInventory().then((res) => setInventory(res.inventory || []));
  }, []);

  const handleReorderSingle = async (sku: string, name: string) => {
    const res = await api.reorderMaterial(sku);
    setInventory((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, qty: item.maxQty, status: 'Optimal' } : item
      )
    );
    addToast(`🛒 Purchase Order for ${name} dispatched to SAP MM!`, 'success');
  };

  const handleBulkReorder = async () => {
    const lowStockItems = inventory.filter((i) => i.qty < i.maxQty * 0.75);
    for (const item of lowStockItems) {
      await api.reorderMaterial(item.sku);
    }
    setInventory((prev) =>
      prev.map((item) => ({ ...item, qty: item.maxQty, status: 'Optimal' }))
    );
    setIsBulkWizardOpen(false);
    addToast(`⚡ Bulk Emergency Reorder executed for ${lowStockItems.length} materials!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Smart Inventory & Supply Chain</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Raw Material Stock Levels, Safety Threshold Burn Rates & SAP MM ERP Requisition Gateway
          </p>
        </div>

        <button
          onClick={() => setIsBulkWizardOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Bulk Reorder Wizard</span>
        </button>
      </div>

      {/* Inventory Roster Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-extrabold text-slate-100">Warehouse Raw Material Inventory</h2>
          <span className="text-xs text-purple-400 font-bold">{inventory.length} Stock Categories</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Material Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock Level & Progress</th>
                <th className="p-3">Unit Cost</th>
                <th className="p-3">Location</th>
                <th className="p-3">Supplier</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-200">
              {inventory.map((item) => {
                const pct = Math.round((item.qty / item.maxQty) * 100);
                return (
                  <tr key={item.sku} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">{item.sku}</td>
                    <td className="p-3 font-bold text-slate-100">{item.materialName}</td>
                    <td className="p-3 text-slate-400">{item.category}</td>
                    <td className="p-3 w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>{item.qty} / {item.maxQty}</span>
                          <span className={pct < 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${pct < 50 ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-cyan-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono">${item.unitCost}</td>
                    <td className="p-3 font-mono text-slate-400">{item.location}</td>
                    <td className="p-3 text-slate-300">{item.supplier}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleReorderSingle(item.sku, item.materialName)}
                        className="px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold hover:bg-cyan-500/25"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Reorder Wizard Modal */}
      {isBulkWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel-glow border-purple-500/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-100">Execute 1-Click Bulk Reorder</h3>
              <button onClick={() => setIsBulkWizardOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              The Bulk Reorder Wizard identified raw materials below optimal threshold. Proceeding will generate batch emergency POs to SAP MM module.
            </p>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {inventory
                .filter((i) => i.qty < i.maxQty * 0.75)
                .map((i) => (
                  <div key={i.sku} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between text-xs font-semibold">
                    <span>{i.materialName}</span>
                    <span className="text-rose-400 font-bold">{i.qty} left</span>
                  </div>
                ))}
            </div>

            <button
              onClick={handleBulkReorder}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-extrabold text-xs text-white uppercase tracking-wider"
            >
              Confirm & Dispatch Batch POs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
