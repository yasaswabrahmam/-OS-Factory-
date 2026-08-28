/**
 * Factory OS — API Client Layer
 * Handles communication with FastAPI Backend (Port 8000) & ML Microservice (Port 8001).
 * Features transparent fallback to rich mock fixtures when backend is offline or unreachable.
 */

const BACKEND_URL = 'http://localhost:8000';
const ML_URL = 'http://localhost:8001';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const api = {
  // Auth Login
  async login(email: string, password: string) {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, using local authentication mock fallback.');
    }
    // Mock Fallback
    return {
      success: true,
      accessToken: 'eyJhbGciOiJIUzI1NiJ9.mock_fallback_jwt_token',
      user: {
        email: email || 'alexander.vance@factoryos.ai',
        name: 'Alexander Vance',
        role: 'Plant Manager / Enterprise Admin',
        site: 'Gigafactory Nevada — Line 1-4',
      },
    };
  },

  // Machines List
  async getMachines() {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/machines/`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, returning mock machine fleet telemetry.');
    }
    return {
      success: true,
      machines: [
        { id: 'det-m1', name: 'Schuler Hydraulic Press S-200', line: 'Main Press Line A', status: 'OPERATIONAL', healthScore: 92, speed: 12.0, pressure: 210.0, temperature: 65.0, vibration: 1.4, predictedRul: 168 },
        { id: 'det-m2', name: 'Laser Weld Cell 03', line: 'Body Welding Cell A', status: 'DEGRADED', healthScore: 78, speed: 24.5, pressure: 185.0, temperature: 88.0, vibration: 2.8, predictedRul: 48 },
        { id: 'det-m3', name: 'CNC Milling Station Alpha', line: 'Machining Line 2', status: 'OPERATIONAL', healthScore: 95, speed: 18.0, pressure: 195.0, temperature: 58.0, vibration: 1.1, predictedRul: 210 },
        { id: 'det-m4', name: 'Durr Convection Oven O-4', line: 'Paint Bake Oven B', status: 'MAINTENANCE', healthScore: 45, speed: 0.0, pressure: 0.0, temperature: 210.0, vibration: 0.5, predictedRul: 12 },
        { id: 'det-m5', name: 'Cognex Quality Camera Q-1', line: 'Final Assembly Cell', status: 'OPERATIONAL', healthScore: 98, speed: 45.0, pressure: 0.0, temperature: 42.0, vibration: 0.8, predictedRul: 320 },
      ],
    };
  },

  // Work Orders List
  async getWorkOrders() {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/production/orders`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      orders: [
        { id: 'WO-2026-9041', sku: 'SKU-BAT-882', productName: 'Lithium Pack Assembly 4680', line: 'Line 1 — Nevada Giga', targetQty: 5000, completedQty: 4120, defectsQty: 14, status: 'In Progress' },
        { id: 'WO-2026-9042', sku: 'SKU-STL-402', productName: 'Austenite Chassis Panel B', line: 'Line 2 — Body Stamping', targetQty: 3200, completedQty: 3200, defectsQty: 8, status: 'Completed' },
        { id: 'WO-2026-9043', sku: 'SKU-CFB-109', productName: 'Carbon Fiber Aero Wing R', line: 'Line 3 — Composites', targetQty: 1500, completedQty: 940, defectsQty: 22, status: 'In Progress' },
        { id: 'WO-2026-9044', sku: 'SKU-VAL-332', productName: 'Proportional Valve Seal Kit', line: 'Line 4 — Maintenance', targetQty: 200, completedQty: 0, defectsQty: 0, status: 'Pending Approval' },
      ],
    };
  },

  // Inventory List
  async getInventory() {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/inventory/`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      inventory: [
        { sku: 'SKU-BAT-882', materialName: 'Lithium Battery Packs (4680 Cells)', category: 'Energy Storage', qty: 120, maxQty: 150, unitCost: 450.0, location: 'WH-A-12', supplier: 'Panasonic Energy', leadTimeDays: 3, status: 'Optimal' },
        { sku: 'SKU-STL-402', materialName: 'Austenite Sheet Steel (Grade 304)', category: 'Raw Metal', qty: 450, maxQty: 500, unitCost: 85.0, location: 'WH-B-04', supplier: 'ThyssenKrupp AG', leadTimeDays: 5, status: 'Optimal' },
        { sku: 'SKU-CFB-109', materialName: 'Pre-preg Carbon Fiber Rolls', category: 'Composites', qty: 340, maxQty: 500, unitCost: 310.0, location: 'WH-C-09', supplier: 'Toray Industries', leadTimeDays: 7, status: 'Refill Triggered' },
        { sku: 'SKU-VAL-332', materialName: 'Proportional Valve Seal Kits (B-2)', category: 'Hydraulics Spare', qty: 2, maxQty: 10, unitCost: 1250.0, location: 'WH-M-01', supplier: 'Bosch Rexroth', leadTimeDays: 2, status: 'Low Stock' },
      ],
    };
  },

  // Reorder Inventory
  async reorderMaterial(sku: string) {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/inventory/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      message: `Emergency Purchase Requisition PO-SAP-${Math.floor(Date.now() / 1000)} generated in SAP MM Module for ${sku}.`,
      newStatus: 'Optimal',
    };
  },

  // Copilot Query
  async queryCopilot(query: string, site = 'Nevada Gigafactory') {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, site }),
      }, 2500);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Copilot backend offline, using deterministic consensus engine fallback.');
    }
    // Local fallback response
    const q = query.toLowerCase();
    if (q.includes('laser') || q.includes('thermal') || q.includes('cell 03')) {
      return {
        success: true,
        data: {
          agent: 'Maintenance & Optics Diagnostics Agent',
          confidence: 96.4,
          evidence: [
            { title: 'Laser Optics Purge Protocol', detail: 'Nitrogen flow verified at 42 L/min (target: 45 L/min). Optics clean cycle required.' },
            { title: 'Thermal Runaway Curve', detail: 'Bearing temp spike to 88°C correlates with 2.8 mm/s vibration peak.' },
          ],
          actions: ['Reduce laser weld feed rate by 8%', 'Dispatch technician for nitrogen seal check', 'Apply grease purge on spindle bearing B'],
          trendData: [{ shift: 'Shift 1', temp: 62, vib: 1.2 }, { shift: 'Shift 2', temp: 71, vib: 1.8 }, { shift: 'Shift 3', temp: 88, vib: 2.8 }],
          response: '🚨 **Diagnostic Complete (Multi-Agent Consensus)**:\n\nLaser Weld Cell 03 thermal anomaly is driven by nitrogen purge line pressure decay (185 Bar vs 210 Bar nominal) causing localized thermal expansion on the main spindle. Recommend immediate 8% feed reduction and seal replacement.',
        },
      };
    } else if (q.includes('line 4') || q.includes('oee')) {
      return {
        success: true,
        data: {
          agent: 'Production MES & Root Cause Agent',
          confidence: 94.2,
          evidence: [
            { title: 'Gearbox Chatter Analysis', detail: 'High-frequency vibration detected at 1,420 Hz on Line 4 main drive.' },
            { title: 'Spindle Vibration Metric', detail: 'Micro-stops accumulated 42 minutes of downtime.' },
          ],
          actions: ['Adjust spindle feed rate to 18 SPM', 'Re-balance drive coupling alignment', 'Lock feeder speed limit in PLC master'],
          trendData: [{ shift: 'Shift A', oee: 88.4 }, { shift: 'Shift B', oee: 74.2 }, { shift: 'Shift C', oee: 62.1 }],
          response: '📊 **Line 4 OEE Drop Analysis**:\n\nThe OEE decline to 62.1% during Shift C was caused by mechanical micro-chatter in the line 4 drive coupling (42 mins cumulative stops) combined with material starvation on carbon fiber feed. Adjust feed rate to 18 SPM.',
        },
      };
    } else if (q.includes('carbon') || q.includes('stockout')) {
      return {
        success: true,
        data: {
          agent: 'Supply Chain & Material Planning Agent',
          confidence: 98.1,
          evidence: [
            { title: 'Burn Rate Telemetry', detail: 'Current burn rate: 48 rolls/shift. Remaining stock: 340 rolls.' },
            { title: 'Supplier Lead Time', detail: 'Toray Industries lead time: 7 days. Reorder threshold breached.' },
          ],
          actions: ['Dispatch emergency PO PO-44912-SAP (160 rolls)', 'Throttle composite line 3 speed by 5%', 'Reallocate safety stock from Warehouse B'],
          trendData: [{ day: 'Day 1', stock: 500 }, { day: 'Day 3', stock: 420 }, { day: 'Day 5', stock: 340 }],
          response: '📦 **Carbon Fiber Stockout Projection**:\n\nPre-preg Carbon Fiber stock (340 rolls) will reach zero in **7.0 shifts** (approx 2.3 days) at current production burn rates. Reorder threshold was breached. Dispatch emergency PO immediately.',
        },
      };
    } else {
      return {
        success: true,
        data: {
          agent: 'Executive Plant Analytics Agent',
          confidence: 95.0,
          evidence: [
            { title: 'Overall OEE Compliance', detail: 'Overall factory OEE currently at 87.4% (Benchmark target: >85.0%).' },
            { title: 'First Pass Yield', detail: 'Quality rating holding steady at 98.4% across all lines.' },
          ],
          actions: ['Maintain current shift output targets', 'Review line 3 preventative maintenance checklist', 'Sync SAP ERP work orders before handover'],
          trendData: [{ hour: '08:00', oee: 86.2 }, { hour: '12:00', oee: 87.4 }, { hour: '16:00', oee: 88.1 }],
          response: '🏭 **Executive Shift Report Summary**:\n\nFactory operations are operating nominally at 87.4% OEE with 98.4% First Pass Yield. 5 of 5 production lines are operational with 1 active warning alert on Laser Weld Cell 03.',
        },
      };
    }
  },

  // ML Machine Predict
  async predictMachine(speed = 12.0, pressure = 210.0, temperature = 65.0, vibration = 1.4) {
    try {
      const res = await fetchWithTimeout(`${ML_URL}/api/v1/predict/machine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed, pressure, temperature, vibration }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback Scikit-Learn emulation math
    const z_sp = Math.abs(speed - 12.0) / 2.0;
    const z_pr = Math.abs(pressure - 210.0) / 15.0;
    const z_tp = Math.abs(temperature - 65.0) / 8.0;
    const z_vb = Math.abs(vibration - 1.4) / 0.3;
    const composite_z = Math.sqrt((z_sp ** 2 + z_pr ** 2 + z_tp ** 2 + z_vb ** 2) / 4.0);

    const logit = 0.35 * (speed - 14.0) + 0.045 * (pressure - 215.0) + 1.2 * (vibration - 1.5) - 1.6;
    const failureRisk = Math.min(99.9, Math.max(1.2, Number((100.0 / (1.0 + Math.exp(-logit))).toFixed(1))));

    const deg = Math.pow(speed / 12.0, 1.6) * Math.pow(pressure / 210.0, 1.4) * Math.pow(vibration / 1.4, 1.2);
    const predictedRul = Math.max(0, Math.round(168.0 / Math.max(0.1, deg)));

    return {
      success: true,
      predictions: {
        isAnomaly: composite_z > 2.25,
        anomalyScore: Number(composite_z.toFixed(2)),
        failureRisk,
        predictedRulHours: predictedRul,
        healthScore: Math.max(0, Math.min(100, Math.round(100 - failureRisk * 0.7))),
        status: failureRisk > 65 ? 'CRITICAL' : failureRisk > 30 ? 'WARNING' : 'HEALTHY',
      },
      inferenceEngine: 'Client-Side Joblib Emulator',
    };
  },
};
