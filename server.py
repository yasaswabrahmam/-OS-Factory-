#!/usr/bin/env python3
"""
Factory OS — Autonomous Decision Intelligence Platform
Pure Python 3.10+ Standard Library Server (Port 5000)
Zero external pip dependencies.
Fuses real-time 100 Hz telemetry simulation loop, multi-plant state, Anomaly Z-Score math,
Box-Muller Monte Carlo engine, REST APIs, and static SPA client delivery.
"""

import http.server
import socketserver
import threading
import json
import math
import random
import statistics
import datetime
import time
import os
import mimetypes
from collections import deque
from urllib.parse import urlparse, parse_qs

PORT = 5000
CLIENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'client')

# -----------------------------------------------------------------------------
# GLOBAL IN-MEMORY TELEMETRY & APP STATE
# -----------------------------------------------------------------------------
class FactoryState:
    def __init__(self):
        self.lock = threading.Lock()
        self.active_plant = "Detroit Giga-Assembly Plant Alpha"
        self.sampling_freq_hz = 100
        self.z_threshold = 2.25
        self.target_oee = 95.8
        
        # Plant profiles
        self.plants = {
            "Detroit Giga-Assembly Plant Alpha": {
                "oee": 79.8,
                "availability": 85.1,
                "performance": 94.6,
                "yield": 98.3,
                "fpy": 98.3,
                "temp_c": 28.5,
                "weather": "28°C Sunny",
                "active_orders": 3,
                "fleet_health": 78
            },
            "Austin Giga-Factory 1": {
                "oee": 88.4,
                "availability": 91.2,
                "performance": 97.1,
                "yield": 99.1,
                "fpy": 99.1,
                "temp_c": 34.0,
                "weather": "34°C Clear",
                "active_orders": 5,
                "fleet_health": 89
            },
            "Berlin Giga-Factory 2": {
                "oee": 82.3,
                "availability": 87.0,
                "performance": 94.8,
                "yield": 98.5,
                "fpy": 98.5,
                "temp_c": 21.0,
                "weather": "21°C Overcast",
                "active_orders": 2,
                "fleet_health": 84
            },
            "Shanghai Megapack Plant": {
                "oee": 91.6,
                "availability": 94.5,
                "performance": 96.9,
                "yield": 99.4,
                "fpy": 99.4,
                "temp_c": 31.2,
                "weather": "31°C Humid",
                "active_orders": 4,
                "fleet_health": 93
            }
        }

        # Baseline distributions for Anomaly Math
        self.dist_params = {
            "speed": (12.0, 1.8),
            "pressure": (210.0, 15.0),
            "temp": (68.0, 6.5),
            "vibration": (1.4, 0.45)
        }

        # Live simulation parameters
        self.current_spm = 13.4
        self.current_bar = 218.0
        self.current_temp = 72.4
        self.current_vibration = 1.62
        
        # 24-hour Telemetry Ring Buffer
        self.telemetry_24h = deque(maxlen=24)
        now = datetime.datetime.now()
        base_oee = [78.2, 79.0, 77.8, 76.5, 78.9, 81.2, 83.4, 85.0, 84.2, 82.1, 79.8, 77.4, 
                    75.6, 74.2, 62.1, 65.4, 71.0, 76.8, 79.2, 81.5, 80.8, 79.8, 80.2, 79.8]
        for i in range(24):
            t_hour = (now - datetime.timedelta(hours=23-i)).strftime("%H:00")
            self.telemetry_24h.append({
                "time": t_hour,
                "oee": base_oee[i % len(base_oee)],
                "spm": round(12.0 + random.uniform(-1.2, 1.5), 1),
                "bar": round(210.0 + random.uniform(-8.0, 12.0), 1),
                "temp": round(68.0 + random.uniform(-3.0, 16.0), 1),
                "vibration": round(1.4 + random.uniform(-0.3, 1.8), 2)
            })

        self.console_logs = deque(maxlen=30)
        self.log_counter = 100

        # Production Lines
        self.production_lines = [
            {
                "id": "line-1",
                "name": "Schuler Hydraulic Main Press Line A",
                "location": "Line 1 - Stamping",
                "status": "OPERATIONAL",
                "utilization": 75.2,
                "oee": 75.2,
                "output_rate": "840 units/hr",
                "pressure": "214 Bar",
                "speed": "12.2 SPM",
                "temp": "64.2 °C",
                "vibration": "1.2 mm/s",
                "active_errors": []
            },
            {
                "id": "line-2",
                "name": "KUKA Robotic Body Welding Cell 4",
                "location": "Line 2 - Battery Enclosure",
                "status": "OPERATIONAL",
                "utilization": 94.1,
                "oee": 94.1,
                "output_rate": "1,120 units/hr",
                "pressure": "198 Bar",
                "speed": "14.8 SPM",
                "temp": "58.0 °C",
                "vibration": "1.4 mm/s",
                "active_errors": ["Weld Gas Pressure Minor Variance"]
            },
            {
                "id": "line-3",
                "name": "Durr Paint Bake Oven B",
                "location": "Line 3 - Paint",
                "status": "OPERATIONAL",
                "utilization": 98.0,
                "oee": 98.0,
                "output_rate": "950 units/hr",
                "pressure": "185 Bar",
                "speed": "11.5 SPM",
                "temp": "142.0 °C",
                "vibration": "0.9 mm/s",
                "active_errors": []
            },
            {
                "id": "line-4",
                "name": "DMG MORI 5-Axis CNC Mill X5",
                "location": "Line 4 - CNC Machining",
                "status": "DEGRADED",
                "utilization": 62.1,
                "oee": 62.1,
                "output_rate": "420 units/hr",
                "pressure": "242 Bar",
                "speed": "17.4 SPM",
                "temp": "84.1 °C",
                "vibration": "8.9 mm/s",
                "active_errors": ["CRITICAL: Spindle Bearing Harmonic Anomaly"]
            },
            {
                "id": "line-5",
                "name": "Final Vehicle Assembly Line 01",
                "location": "Line 5 - Final Assembly",
                "status": "OPERATIONAL",
                "utilization": 92.4,
                "oee": 92.4,
                "output_rate": "780 units/hr",
                "pressure": "205 Bar",
                "speed": "13.0 SPM",
                "temp": "49.5 °C",
                "vibration": "1.8 mm/s",
                "active_errors": []
            }
        ]

        # Asset Health Data
        self.assets = [
            {
                "id": "AST-01",
                "name": "KUKA Titan Robot Arm Alpha",
                "line": "Line 1 - Body Stamping",
                "health": 92,
                "rul": 420,
                "temp": 44.2,
                "vibration": 2.1,
                "last_maint": "2026-07-04",
                "status": "HEALTHY"
            },
            {
                "id": "AST-02",
                "name": "DMG MORI 5-Axis CNC Mill X5",
                "line": "Line 4 - Gearbox Machining",
                "health": 52,
                "rul": 18,
                "temp": 84.1,
                "vibration": 8.9,
                "last_maint": "2026-07-04",
                "status": "CRITICAL"
            },
            {
                "id": "AST-03",
                "name": "Trumpf Laser Weld Cell 03",
                "line": "Line 2 - Battery Enclosure",
                "health": 89,
                "rul": 610,
                "temp": 58.0,
                "vibration": 1.4,
                "last_maint": "2026-07-04",
                "status": "HEALTHY"
            },
            {
                "id": "AST-04",
                "name": "Fanuc Assembly Robot R-2000iC",
                "line": "Line 5 - Final Assembly",
                "health": 88,
                "rul": 355,
                "temp": 49.5,
                "vibration": 1.8,
                "last_maint": "2026-07-04",
                "status": "HEALTHY"
            },
            {
                "id": "AST-05",
                "name": "Siemens Servo Press Line P-2",
                "line": "Line 1 - Stamping",
                "health": 65,
                "rul": 140,
                "temp": 71.0,
                "vibration": 4.2,
                "last_maint": "2026-07-04",
                "status": "WARNING"
            },
            {
                "id": "AST-06",
                "name": "ABB Palletizer IRB 660",
                "line": "Line 3 - Packing",
                "health": 91,
                "rul": 780,
                "temp": 52.0,
                "vibration": 1.1,
                "last_maint": "2026-07-04",
                "status": "HEALTHY"
            }
        ]

        # SAP Work Orders
        self.work_orders = [
            {
                "sap_id": "PWO-8910",
                "order_num": "PO-2026-8801",
                "product": "Model S EV Battery Housing Enclosure",
                "line": "Line 2 - Battery Enclosure",
                "units": "980 / 1,200",
                "defects": 14,
                "oee": "92.4%",
                "status": "In Progress",
                "technician": "Hans Müller",
                "component": "Spindle Bearing Unit SPR-SPINDLE-MORI-09",
                "desc": "Emergency Spindle Bearing Replacement & Harmonic Vibration Dampening"
            },
            {
                "sap_id": "PWO-8902",
                "order_num": "PO-2026-8802",
                "product": "Gigacast Rear Chassis Assembly",
                "line": "Line 1 - Stamping",
                "units": "850 / 850",
                "defects": 3,
                "oee": "94.1%",
                "status": "Completed",
                "technician": "Elena Rostova",
                "component": "Servo Press Die Clamp Set",
                "desc": "Routine 50,000 Cycle Die Calibration & Laser Alignment"
            },
            {
                "sap_id": "PWO-8894",
                "order_num": "PO-2026-8803",
                "product": "Front Subframe Module",
                "line": "Line 5 - Final Assembly",
                "units": "410 / 600",
                "defects": 22,
                "oee": "76.5%",
                "status": "Delayed",
                "technician": "Marcus Chen",
                "component": "Hydraulic Proportional Valve",
                "desc": "Investigate Pressure Transducer Signal Noise & Filter Replacement"
            }
        ]

        # Quality Inspection Logs
        self.inspection_logs = [
            {
                "batch_id": "9999-9999-00001 (PO-2026-8801)",
                "system": "AI Vision",
                "asset": "Trumpf Laser Weld Cell 03",
                "defect": "Weld Fault",
                "severity": "Major",
                "status": "Quarantined",
                "confidence": 98.4,
                "date": "2026-08-01 14:12"
            },
            {
                "batch_id": "9999-9999-00002 (PO-2026-8802)",
                "system": "Laser Scanner",
                "asset": "Schuler Main Press Line A",
                "defect": "Dimensional Deviation",
                "severity": "Minor",
                "status": "Reworked",
                "confidence": 94.2,
                "date": "2026-08-01 13:48"
            }
        ]

        # Material Inventory
        self.inventory = [
            {
                "sku": "AL-6061-2MM",
                "name": "Structural Aluminum Sheets 6061-T6 (2mm)",
                "category": "Raw Material",
                "stock": 4200,
                "min_stock": 1500,
                "unit_cost": 145.0,
                "location": "Bay A-04, Rack 01",
                "supplier": "Alcoa Global Metals Inc.",
                "lead_time": "3 Days Lead Time",
                "status": "Optimal"
            },
            {
                "sku": "SP-6205-2RS",
                "name": "Deep Groove Ball Bearing 6205-2RS",
                "category": "Spare Parts",
                "stock": 48,
                "min_stock": 25,
                "unit_cost": 16.5,
                "location": "Tool Crib 03, Shelf B",
                "supplier": "SKF Bearings",
                "lead_time": "2 Days Lead Time",
                "status": "Optimal"
            },
            {
                "sku": "FLT-HYD-7500X",
                "name": "Industrial Hydraulic Oil Filter 7500X",
                "category": "Components",
                "stock": 89,
                "min_stock": 40,
                "unit_cost": 42.0,
                "location": "Bay C-02, Rack 05",
                "supplier": "Parker Hannifin",
                "lead_time": "5 Days Lead Time",
                "status": "Optimal"
            },
            {
                "sku": "BAT-MOD-2170",
                "name": "EV Battery Cell Module (2170)",
                "category": "Finished Goods",
                "stock": 1320,
                "min_stock": 400,
                "unit_cost": 85.0,
                "location": "Bay D-01, Rack 02",
                "supplier": "Internal Assembly",
                "lead_time": "Same Day Transfer",
                "status": "Optimal"
            }
        ]

        # AI Recommendations
        self.recommendations = [
            {
                "id": "REC-01",
                "severity": "HIGH",
                "impact": "High Impact",
                "confidence": 96,
                "date": "2026-08-01",
                "title": "Schedule Preventive Spindle Bearing Replacement on CNC Mill X5",
                "desc": "Vibration telemetry detected 12x baseline harmonic anomaly at 14:22 UTC.",
                "work_order": "Issue Work Order #WO-8910",
                "savings": "$42,000",
                "status": "PENDING"
            },
            {
                "id": "REC-02",
                "severity": "MEDIUM",
                "impact": "Medium Impact",
                "confidence": 87,
                "date": "2026-08-01",
                "title": "Rebalance Shift Load Across Lines 1-3",
                "desc": "Evening shift OEE dropped 4.2% due to line 1 stamping starvation.",
                "work_order": "Reassign 2 operators to Line 2",
                "savings": "$12,500",
                "status": "PENDING"
            },
            {
                "id": "REC-03",
                "severity": "OPTIMIZATION",
                "impact": "Low Impact",
                "confidence": 94,
                "date": "2026-08-01",
                "title": "Calibrate Assist Gas Regulator on Trumpf Laser Cell 03",
                "desc": "Weld porosity cluster detected when assist gas drops below 4.8 bar.",
                "work_order": "SOP-WLD-88 Gas Valve Calibration",
                "savings": "$8,400",
                "status": "PENDING"
            }
        ]

        # Alarms & Alerts
        self.alerts = [
            {
                "id": "ALT-101",
                "severity": "CRITICAL",
                "status": "Unresolved",
                "date": "2026-08-01 14:22",
                "title": "CNC Mill X5 Vibration Spike (8.9 mm/s)",
                "desc": "Telemetry exceeded ISO-10816 Class IV threshold (8.9 mm/s vs 1.4 baseline)."
            },
            {
                "id": "ALT-102",
                "severity": "WARNING",
                "status": "Unresolved",
                "date": "2026-08-01 13:45",
                "title": "Servo Press P-2 Tool Wear Detected",
                "desc": "Predictive failure model indicates 82% bearing wear probability."
            },
            {
                "id": "ALT-103",
                "severity": "WARNING",
                "status": "Unresolved",
                "date": "2026-08-01 11:20",
                "title": "BRG-SP-6205-2RS Below Reorder Threshold",
                "desc": "Spare bearing stock fell to safety buffer level."
            }
        ]

        # Knowledge Base SOPs
        self.knowledge_base = [
            {
                "code": "SOP-MECH-401",
                "title": "DMG MORI CNC Spindle Maintenance & Calibration Protocol",
                "type": "SOP",
                "size": "4.2 MB",
                "author": "Chief Reliability Engineer Hans Müller",
                "date": "2026-06-14",
                "tags": ["#CNC", "#Machining", "#Spindle", "#Calibration"]
            },
            {
                "code": "MAN-WLD-88",
                "title": "Trumpf Fiber Laser Welding Operation & Safety Guide v4.2",
                "type": "Manual",
                "size": "8.5 MB",
                "author": "Trumpf Technical Support",
                "date": "2026-05-02",
                "tags": ["#Laser", "#Welding", "#Safety", "#LaserCell"]
            },
            {
                "code": "SPEC-QUAL-01",
                "title": "Automotive Body Stamping Tolerance Specifications ISO-9001",
                "type": "Quality Spec",
                "size": "2.1 MB",
                "author": "Quality Assurance Directorate",
                "date": "2026-04-18",
                "tags": ["#Stamping", "#ISO-9001", "#Tolerance"]
            }
        ]

        # Reports
        self.reports = [
            {
                "id": "REP-01",
                "title": "Executive Daily Plant Intelligence Brief - Detroit Giga Plant",
                "badge": "Executive Brief",
                "type": "PDF",
                "date": "Today, 06:00 AM",
                "status": "Ready"
            },
            {
                "id": "REP-02",
                "title": "Weekly OEE & Asset Reliability Audit (Week 30 - 2026)",
                "badge": "OEE Weekly Performance",
                "type": "PDF",
                "date": "2026-07-28",
                "status": "Ready"
            },
            {
                "id": "REP-03",
                "title": "AI Root Cause & Unplanned Downtime Pareto Analysis",
                "badge": "Downtime Audit",
                "type": "PDF",
                "date": "2026-07-25",
                "status": "Ready"
            },
            {
                "id": "REP-04",
                "title": "Factory OS OEE Report",
                "badge": "OEE",
                "type": "PDF",
                "date": "2026-08-01",
                "status": "Ready"
            }
        ]

    # --- MATHEMATICAL ENGINES ---
    def calculate_anomaly_engine(self, spm, bar, temp=None, vibration=None):
        if temp is None:
            temp = 68.0 + (bar - 210.0) * 0.4 + (spm - 12.0) * 1.5
        if vibration is None:
            vibration = 1.4 + max(0.0, (spm - 12.0) * 0.35 + (bar - 210.0) * 0.08)

        mu_s, sig_s = self.dist_params["speed"]
        mu_p, sig_p = self.dist_params["pressure"]
        mu_t, sig_t = self.dist_params["temp"]
        mu_v, sig_v = self.dist_params["vibration"]

        z_speed = (spm - mu_s) / sig_s
        z_pressure = (bar - mu_p) / sig_p
        z_temp = (temp - mu_t) / sig_t
        z_vibration = (vibration - mu_v) / sig_v

        z_composite = math.sqrt((z_speed**2 + z_pressure**2 + z_temp**2 + z_vibration**2) / 4.0)

        logit = 0.35 * (spm - 14.0) + 0.045 * (bar - 215.0) + 1.2 * (vibration - 1.5) - 1.6
        raw_risk = 100.0 / (1.0 + math.exp(-max(-20.0, min(20.0, logit))))
        risk_pct = min(99.9, max(1.2, raw_risk))

        deg_speed = (max(1.0, spm) / 12.0) ** 1.6
        deg_bar = (max(1.0, bar) / 210.0) ** 1.4
        deg_vib = (max(0.1, vibration) / 1.4) ** 1.2
        degradation = max(0.1, deg_speed * deg_bar * deg_vib)
        rul_hours = max(0, round(168.0 / degradation))

        is_anomaly = z_composite > self.z_threshold

        return {
            "spm": round(spm, 2),
            "bar": round(bar, 2),
            "temp": round(temp, 2),
            "vibration": round(vibration, 2),
            "z_composite": round(z_composite, 3),
            "failure_risk_pct": round(risk_pct, 1),
            "safe_rul_hours": rul_hours,
            "status": "ANOMALY DETECTED" if is_anomaly else "HEALTHY",
            "is_anomaly": is_anomaly
        }

    def run_monte_carlo(self, iterations=1000):
        results = []
        for _ in range(iterations):
            u1, u2 = max(1e-9, random.random()), random.random()
            z_a = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
            avail = 92.0 + 2.5 * z_a

            u3, u4 = max(1e-9, random.random()), random.random()
            z_p = math.sqrt(-2.0 * math.log(u3)) * math.cos(2.0 * math.pi * u4)
            perf = 89.0 + 3.1 * z_p

            u5, u6 = max(1e-9, random.random()), random.random()
            z_q = math.sqrt(-2.0 * math.log(u5)) * math.cos(2.0 * math.pi * u6)
            qual = 98.5 + 0.8 * z_q

            avail = min(100.0, max(60.0, avail))
            perf = min(100.0, max(60.0, perf))
            qual = min(100.0, max(85.0, qual))

            oee_k = (avail * perf * qual) / 10000.0
            results.append(oee_k)

        results.sort()
        mean_val = statistics.mean(results)
        stdev_val = statistics.stdev(results)
        p10 = results[int(0.10 * iterations)]
        p50 = results[int(0.50 * iterations)]
        p90 = results[int(0.90 * iterations)]
        prob_ge_95 = (sum(1 for x in results if x >= 95.0) / iterations) * 100.0

        bins = 15
        min_v, max_v = min(results), max(results)
        step = (max_v - min_v) / bins
        hist_data = []
        for b in range(bins):
            b_start = min_v + b * step
            b_end = b_start + step
            count = sum(1 for x in results if b_start <= x < b_end or (b == bins-1 and x >= b_start))
            hist_data.append({
                "range": f"{b_start:.1f}-{b_end:.1f}%",
                "count": count
            })

        return {
            "iterations": iterations,
            "mean_oee": round(mean_val, 2),
            "stdev": round(stdev_val, 2),
            "p10": round(p10, 2),
            "p50": round(p50, 2),
            "p90": round(p90, 2),
            "prob_ge_95_pct": round(prob_ge_95, 1),
            "histogram": hist_data
        }

    def generate_chat_response(self, query):
        q_lower = str(query).lower()
        now_str = datetime.datetime.now().strftime("%I:%M %p")

        if "line 4" in q_lower or "oee drop" in q_lower or "62.1" in q_lower or "mitigate" in q_lower:
            return {
                "sender": "assistant",
                "time": now_str,
                "text": "Based on real-time telemetry analysis and historical maintenance logs, Line 4 OEE dropped to **62.1%** primarily due to unplanned downtime on **'DMG MORI 5-Axis CNC Mill X5'**.",
                "findings": [
                    {"label": "\"Vibration Anomaly\"", "desc": "Spindle vibration spiked to 8.9 mm/s starting at 14:22 UTC."},
                    {"label": "\"Thermal Overheating\"", "desc": "Bearing temperature reached 84.1°C (24°C above nominal baseline)."},
                    {"label": "\"Financial Impact\"", "desc": "Estimated lost output & labor scrap equals **$16,500**."}
                ],
                "recommendation": "We advise scheduling immediate bearing replacement using spare part 'SPR-SPINDLE-MORI-09' available in Tool Crib 03. Executing Work Order 'PWO-8910' now will restore Line 4 OEE to >91% within 2.5 hours."
            }
        else:
            return {
                "sender": "assistant",
                "time": now_str,
                "text": f"Factory OS Decision Intelligence copilot processed inquiry: '{query}'. Overall plant operations are running at **{self.plants[self.active_plant]['oee']}% OEE**.",
                "findings": [
                    {"label": "\"Telemetry Status\"", "desc": f"IoT streaming at {self.sampling_freq_hz} Hz with 42 monitored assets."}
                ],
                "recommendation": "Check the Prescriptive Maintenance Hub for pending work orders and monitor Line 4 CNC vibration trajectory."
            }

STATE = FactoryState()

def background_telemetry_loop():
    while True:
        with STATE.lock:
            jitter_spm = STATE.current_spm + random.uniform(-0.08, 0.08)
            jitter_bar = STATE.current_bar + random.uniform(-0.4, 0.4)
            STATE.current_spm = max(8.0, min(20.0, jitter_spm))
            STATE.current_bar = max(180.0, min(260.0, jitter_bar))

            if random.random() < 0.15:
                STATE.log_counter += 1
                ts = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-3]
                lines_pool = [
                    f"[INFO] Press Line 01 Speed: {STATE.current_spm:.1f} SPM | Pressure: {STATE.current_bar:.1f} Bar",
                    f"[OK] Viscosity output: {78.0 + random.uniform(0, 5):.1f} cPoise | Thermal: {STATE.current_temp:.1f} °C",
                    f"[TELEMETRY] Sensor Node #491 stream packet validated (100 Hz, 0 drop)",
                    f"[SCANNER] Cognex AI Vision batch {STATE.log_counter} inspected (Pass rate: 99.2%)",
                    f"[SAP-SYNC] ERP work order queue refreshed. Total active: {len(STATE.work_orders)}"
                ]
                STATE.console_logs.append(f"[{ts}] {random.choice(lines_pool)}")
        time.sleep(0.5)

class FactoryOSHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def _send_json(self, data, status=200):
        body = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def _parse_post_json(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length > 0:
                raw = self.rfile.read(length).decode('utf-8')
                return json.loads(raw)
        except Exception:
            pass
        return {}

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)

        # High priority REST APIs
        if path == '/api/health':
            with STATE.lock:
                plant_info = STATE.plants[STATE.active_plant]
                res = {
                    "status": "ONLINE",
                    "telemetry_hz": STATE.sampling_freq_hz,
                    "active_plant": STATE.active_plant,
                    "benchmark_score": "96.4%",
                    "ai_copilot": "Active / Ready",
                    "weather": plant_info["weather"]
                }
            self._send_json(res)
            return

        elif path == '/api/telemetry/live':
            with STATE.lock:
                ml_res = STATE.calculate_anomaly_engine(STATE.current_spm, STATE.current_bar, STATE.current_temp, STATE.current_vibration)
                plant_info = STATE.plants[STATE.active_plant]
                res = {
                    "plant": STATE.active_plant,
                    "kpi": plant_info,
                    "ml_simulation": ml_res,
                    "history_24h": list(STATE.telemetry_24h),
                    "console_logs": list(STATE.console_logs)
                }
            self._send_json(res)
            return

        elif path in ['/api/live/state', '/api/telemetry/predict']:
            plant_name = qs.get('plant', [STATE.active_plant])[0]
            with STATE.lock:
                calc = STATE.calculate_anomaly_engine(STATE.current_spm, STATE.current_bar, STATE.current_temp, STATE.current_vibration)
                plant_info = STATE.plants.get(plant_name, STATE.plants[STATE.active_plant])
                res = {
                    "success": True,
                    "oee": plant_info["oee"],
                    "availability": plant_info["availability"],
                    "performance": plant_info["performance"],
                    "yield": plant_info["yield"],
                    "speed": calc["spm"],
                    "pressure": calc["bar"],
                    "temperature": calc["temp"],
                    "vibration": calc["vibration"],
                    "failureRisk": calc["failure_risk_pct"],
                    "rul": calc["safe_rul_hours"],
                    "zScore": calc["z_composite"],
                    "status": calc["status"],
                    "weather": {"temp": plant_info["weather"].split()[0], "desc": " ".join(plant_info["weather"].split()[1:])}
                }
            self._send_json(res)
            return

        elif path == '/api/telemetry/alerts':
            with STATE.lock:
                res = {"success": True, "alerts": STATE.alerts}
            self._send_json(res)
            return

        elif path == '/api/telemetry/history':
            with STATE.lock:
                res = {"success": True, "history": list(STATE.telemetry_24h)}
            self._send_json(res)
            return

        # Static Client Serving
        safe_path = path.lstrip('/') or 'index.html'
        file_path = os.path.join(CLIENT_DIR, safe_path)
        if os.path.isdir(file_path):
            file_path = os.path.join(file_path, 'index.html')

        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', mime_type or 'application/octet-stream')
            self.send_header('Content-Length', str(len(content)))
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
            return
        else:
            index_file = os.path.join(CLIENT_DIR, 'index.html')
            if os.path.exists(index_file):
                with open(index_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(content)
                return
            self.send_error(404, "File Not Found")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._parse_post_json()

        if path == '/api/telemetry/simulate':
            spm = float(body.get('spm', body.get('speed', 12.0)))
            bar = float(body.get('bar', body.get('pressure', 210.0)))
            with STATE.lock:
                STATE.current_spm = spm
                STATE.current_bar = bar
                calc = STATE.calculate_anomaly_engine(spm, bar)
            self._send_json(calc)
            return

        elif path in ['/api/analytics/monte-carlo', '/api/analytics/montecarlo']:
            iterations = int(body.get('iterations', body.get('trials', 1000)))
            with STATE.lock:
                mc_res = STATE.run_monte_carlo(iterations)
            self._send_json(mc_res)
            return

        elif path in ['/api/ai/tutor/chat', '/api/copilot/query']:
            query = body.get('query', body.get('message', ''))
            with STATE.lock:
                chat_res = STATE.generate_chat_response(query)
            self._send_json(chat_res)
            return

        else:
            self.send_error(404, "Endpoint Not Found")

def run_server():
    t = threading.Thread(target=background_telemetry_loop, daemon=True)
    t.start()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), FactoryOSHandler) as httpd:
        print(f"🏭 Factory OS Server Running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            httpd.server_close()

if __name__ == '__main__':
    run_server()
