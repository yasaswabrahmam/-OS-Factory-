#!/usr/bin/env python3
"""
Factory OS — 100% Pure Python Web Server & Machine Learning Telemetry Engine
Provides complete REST API endpoints and serves the static frontend UI (client/) on port 5000.

Zero External Dependencies — Built entirely with Python 3 Standard Library!
API Automation: Live telemetry stream, anomaly events, smart ML recommendations,
auto OEE updater, real-time sensor simulation, and AI decision engine.
"""

import os
import sys
import json
import math
import time
import random
import statistics
import threading
from datetime import datetime, timedelta
from collections import deque
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

PORT = 5000
CLIENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'client')

# ── Live State Store (in-memory, auto-updated by background ML thread) ──
LIVE_STATE = {
    "oee": 90.7,
    "availability": 98.1,
    "performance": 93.4,
    "yield_rate": 98.6,
    "speed": 12.0,
    "pressure": 210.0,
    "temperature": 65.0,
    "vibration": 1.4,
    "failure_risk": 6.6,
    "rul": 168,
    "z_score": 0.15,
    "status": "HEALTHY",
    "last_updated": datetime.now().isoformat(),
    "anomaly_events": deque(maxlen=50),
    "oee_history_24h": deque(maxlen=288),  # 5-min intervals over 24h
    "sensor_readings": deque(maxlen=100)
}

# ── Background ML Automation Engine ──
def ml_background_engine():
    """Continuously runs ML models and updates LIVE_STATE every 5 seconds."""
    tick = 0
    while True:
        try:
            tick += 1
            now = datetime.now()

            # Simulate realistic sensor drift using ARIMA-style autoregression
            phi = 0.82
            drift_speed  = (random.random() - 0.5) * 0.3
            drift_press  = (random.random() - 0.5) * 1.5
            drift_temp   = (random.random() - 0.5) * 0.8
            drift_vib    = (random.random() - 0.5) * 0.05

            LIVE_STATE["speed"]       = max(8.0,  min(20.0, LIVE_STATE["speed"]       + drift_speed))
            LIVE_STATE["pressure"]    = max(180.0, min(260.0, LIVE_STATE["pressure"]  + drift_press))
            LIVE_STATE["temperature"] = max(40.0,  min(120.0, LIVE_STATE["temperature"] + drift_temp))
            LIVE_STATE["vibration"]   = max(0.8,  min(3.5,  LIVE_STATE["vibration"]   + drift_vib))

            sp = LIVE_STATE["speed"]
            pr = LIVE_STATE["pressure"]
            tp = LIVE_STATE["temperature"]
            vb = LIVE_STATE["vibration"]

            # Z-Score anomaly detection (composite multi-variate)
            z_sp = abs(sp - 12.0) / 2.0
            z_pr = abs(pr - 210.0) / 15.0
            z_tp = abs(tp - 65.0) / 8.0
            z_vb = abs(vb - 1.4) / 0.3
            z = math.sqrt((z_sp**2 + z_pr**2 + z_tp**2 + z_vb**2) / 4.0)
            z = max(0.08, z + random.random() * 0.04)

            # Logistic Sigmoid failure risk
            logit = 0.35*(sp-14.0) + 0.045*(pr-215.0) + 1.2*(vb-1.5) - 1.6
            risk  = 100.0 / (1.0 + math.exp(-logit))
            risk  = min(99.9, max(1.2, risk))

            # RUL regression
            deg = (sp/12.0)**1.6 * (pr/210.0)**1.4 * (vb/1.4)**1.2
            rul = max(0, int(round(168.0 / deg)))

            # OEE components with realistic correlation to sensor values
            av   = max(75.0, min(100.0, 98.1  - (z * 0.8) + random.gauss(0, 0.3)))
            perf = max(70.0, min(100.0, 93.4  - (risk * 0.04) + random.gauss(0, 0.4)))
            yld  = max(90.0, min(100.0, 98.6  - (z * 0.2) + random.gauss(0, 0.15)))
            oee  = round((av/100) * (perf/100) * (yld/100) * 100, 1)

            status = "ANOMALY" if (z > 2.25 or risk > 65.0) else "HEALTHY"

            LIVE_STATE.update({
                "oee": round(oee, 1),
                "availability": round(av, 1),
                "performance": round(perf, 1),
                "yield_rate": round(yld, 1),
                "failure_risk": round(risk, 1),
                "rul": rul,
                "z_score": round(z, 2),
                "status": status,
                "last_updated": now.isoformat()
            })

            # Record OEE history point
            LIVE_STATE["oee_history_24h"].append({
                "time": now.strftime("%H:%M"),
                "oee": round(oee, 1),
                "availability": round(av, 1)
            })

            # Record sensor snapshot
            LIVE_STATE["sensor_readings"].append({
                "ts": now.strftime("%H:%M:%S"),
                "speed": round(sp, 2),
                "pressure": round(pr, 1),
                "temperature": round(tp, 1),
                "vibration": round(vb, 3),
                "z": round(z, 2),
                "risk": round(risk, 1)
            })

            # Auto-generate anomaly events when thresholds breached
            if z > 2.25:
                LIVE_STATE["anomaly_events"].appendleft({
                    "id": f"EVT-{tick:04d}",
                    "time": now.strftime("%H:%M:%S"),
                    "severity": "critical" if risk > 65 else "warning",
                    "type": "Z-Score Anomaly",
                    "msg": f"Z={z:.2f} exceeds threshold 2.25. Risk={risk:.1f}%. Speed={sp:.1f} SPM, Pressure={pr:.0f} Bar.",
                    "component": "Schuler Press ML Engine"
                })
            elif vb > 2.8:
                LIVE_STATE["anomaly_events"].appendleft({
                    "id": f"EVT-{tick:04d}",
                    "time": now.strftime("%H:%M:%S"),
                    "severity": "warning",
                    "type": "ISO 10816 Vibration Alert",
                    "msg": f"Vibration={vb:.3f} mm/s exceeds ISO Class III limit (2.8 mm/s). Immediate inspection advised.",
                    "component": "Vibration Sensor Array"
                })
            elif pr > 248:
                LIVE_STATE["anomaly_events"].appendleft({
                    "id": f"EVT-{tick:04d}",
                    "time": now.strftime("%H:%M:%S"),
                    "severity": "warning",
                    "type": "Hydraulic Over-Pressure",
                    "msg": f"Pressure={pr:.0f} Bar (limit: 250 Bar). Check proportional valve seal.",
                    "component": "Schuler Hydraulic System"
                })

        except Exception as e:
            print(f"[ML Engine Error] {e}", flush=True)
        time.sleep(5)  # Update every 5 seconds

# Start background ML engine in daemon thread
_ml_thread = threading.Thread(target=ml_background_engine, daemon=True)
_ml_thread.start()

# ── 1. Python AI/ML Engine ──
def box_muller():
    """Generates standard normal random variable N(0,1)."""
    u1 = random.random()
    u2 = random.random()
    while u1 <= 1e-15:
        u1 = random.random()
    return math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)

def predict_telemetry(speed=12.0, pressure=210.0, temp=65.0, vibration=1.4):
    """Multi-variable Z-score, Logistic Sigmoid Risk %, RUL, and ARIMA forecast."""
    z_speed = abs(speed - 12.0) / 2.0
    z_press = abs(pressure - 210.0) / 15.0
    z_temp = abs(temp - 65.0) / 8.0
    z_vib = abs(vibration - 1.4) / 0.3

    composite_z = math.sqrt((z_speed**2 + z_press**2 + z_temp**2 + z_vib**2) / 4.0)
    composite_z = max(0.15, composite_z + (random.random() * 0.05))

    logit = 0.35 * (speed - 14.0) + 0.045 * (pressure - 215.0) + 1.2 * (vibration - 1.5) - 1.6
    failure_risk = 100.0 / (1.0 + math.exp(-logit))
    failure_risk = min(99.9, max(1.2, failure_risk))

    degradation = (speed / 12.0)**1.6 * (pressure / 210.0)**1.4 * (vibration / 1.4)**1.2
    rul = max(0, int(round(168.0 / degradation)))

    phi = 0.65
    drift = -0.15 if failure_risk > 50 else 0.1
    forecast = []
    current_oee = max(40.0, min(99.0, 92.4 - (failure_risk * 0.25)))
    prev_diff = 0.0
    
    for _ in range(6):
        noise = box_muller() * 0.4
        diff = phi * prev_diff + drift + noise
        current_oee = max(35.0, min(99.5, current_oee + diff))
        prev_diff = diff
        forecast.append(round(current_oee, 1))

    status = "ANOMALY" if (composite_z > 2.25 or failure_risk > 65.0) else "HEALTHY"

    return {
        "engine": "Pure Python 3.13 AI/ML Engine",
        "parameters": {
            "speed": speed,
            "pressure": pressure,
            "temperature": temp,
            "vibration": vibration
        },
        "zScore": round(composite_z, 2),
        "failureRisk": round(failure_risk, 1),
        "rul": rul,
        "oeeForecast": forecast,
        "status": status
    }

def run_monte_carlo(trials=1000, target_oee=95.0, speed=12.0, pressure=210.0):
    """1,000-Iteration Monte Carlo Risk Simulator."""
    pass_count = 0
    results = []
    speed_factor = 1.0 - abs(speed - 12.0) * 0.015
    press_factor = 1.0 - abs(pressure - 210.0) * 0.0008

    for _ in range(trials):
        z0 = box_muller()
        z1 = box_muller()
        av = min(100.0, max(60.0, (96.2 + z0 * 1.8) * press_factor))
        perf = min(100.0, max(50.0, (94.5 + z1 * 2.2) * speed_factor))
        yld = min(100.0, max(75.0, 98.4 + (random.random() * 1.2 - 0.6)))
        sim_oee = round((av / 100.0) * (perf / 100.0) * (yld / 100.0) * 100.0, 1)
        results.append(sim_oee)
        if sim_oee >= target_oee:
            pass_count += 1

    results.sort()
    return {
        "trials": trials,
        "targetOee": target_oee,
        "passProbability": round((pass_count / trials) * 100.0, 1),
        "p10": results[int(trials * 0.10)],
        "p50": results[int(trials * 0.50)],
        "p90": results[int(trials * 0.90)],
        "mean": round(statistics.mean(results), 1),
        "stdDev": round(statistics.stdev(results), 2),
        "distributionBucket": {
            "<80%": len([x for x in results if x < 80]),
            "80-85%": len([x for x in results if 80 <= x < 85]),
            "85-90%": len([x for x in results if 85 <= x < 90]),
            "90-95%": len([x for x in results if 90 <= x < 95]),
            ">95%": len([x for x in results if x >= 95])
        }
    }

def inspect_vision_quality(image_id="weld_sample_01"):
    """Cognex Vision AI Part Inspection Simulation."""
    defects = [
        {"id": "DEF-01", "type": "Micro-porosity Weld Void", "confidence": 0.964, "bbox": [140, 85, 45, 30], "severity": "HIGH"},
        {"id": "DEF-02", "type": "Surface Thermal Discoloration", "confidence": 0.882, "bbox": [310, 220, 60, 40], "severity": "LOW"}
    ]
    return {
        "inspectionId": image_id,
        "visionModel": "Cognex ViDi Deep Learning v4.2 (Python Engine)",
        "passStatus": False,
        "defectsDetected": len(defects),
        "defects": defects,
        "dpmo": 142.5,
        "firstPassYield": 98.6,
        "timestamp": datetime.now().isoformat()
    }

# ── 2. Data Registries ──
def generate_historical_data(seed_oee, seed_av, seed_perf, seed_yield):
    return [
        {
            "date": f"2026-07-{(i+1):02d}",
            "oee": round(min(100.0, max(50.0, seed_oee + math.sin(i / 3) * 3 + random.random() * 2)), 1),
            "availability": round(min(100.0, max(50.0, seed_av + math.cos(i / 4) * 2 + random.random() * 1.5)), 1),
            "performance": round(min(100.0, max(50.0, seed_perf + math.sin(i / 5) * 1.5 - random.random() * 1.5)), 1),
            "yield": round(min(100.0, max(50.0, seed_yield + math.cos(i / 2) * 1 - random.random() * 0.8)), 1)
        }
        for i in range(30)
    ]

HISTORICAL_DB = {
    "detroit": generate_historical_data(92.4, 96.2, 94.8, 98.6),
    "austin": generate_historical_data(94.2, 96.4, 94.8, 98.5),
    "berlin": generate_historical_data(91.8, 94.5, 93.2, 97.8),
    "shanghai": generate_historical_data(95.1, 98.1, 97.0, 99.2)
}

ASSET_REGISTRY = {
    "detroit": [
        {"id": "det-m1", "line": "Main Press Line", "name": "Schuler Hydraulic Press S-200", "type": "Press", "manufacturer": "Schuler Group", "serial": "SCH-8849-A", "limitSpeed": 20, "limitPressure": 260},
        {"id": "det-m2", "line": "Main Press Line", "name": "Kuka Transfer Robot Arm T-1", "type": "Robotics", "manufacturer": "KUKA", "serial": "KUK-9932-B", "limitSpeed": 100, "limitPressure": 0},
        {"id": "det-m3", "line": "Body Welding Cell A", "name": "Fanuc Arc Welder W-12", "type": "Welder", "manufacturer": "FANUC", "serial": "FAN-7721-C", "limitSpeed": 45, "limitPressure": 0},
        {"id": "det-m4", "line": "Body Welding Cell A", "name": "Cognex Quality Camera Q-1", "type": "Scanner", "manufacturer": "Cognex", "serial": "COG-4431-D", "limitSpeed": 60, "limitPressure": 0},
        {"id": "det-m5", "line": "Paint Oven B", "name": "Durr Convection Oven O-4", "type": "Oven", "manufacturer": "Dürr AG", "serial": "DUR-3310-E", "limitTemp": 220, "limitPressure": 0}
    ]
}

ALERTS_HISTORY = [
    {"id": 101, "severity": "critical", "component": "Schuler Press", "msg": "Hydraulic Pressure Decay on Cylinder B-2. Variance exceeded safety limits.", "time": "1 hour ago", "resolved": False},
    {"id": 102, "severity": "warning", "component": "System", "msg": "Machine telemetry exceeded ISO 10816 class III vibration threshold.", "time": "12 mins ago", "resolved": False},
    {"id": 103, "severity": "info", "component": "Carbon Fiber Inventory", "msg": "Current stock level (340 rolls) reached 68% of safety threshold.", "time": "3 hours ago", "resolved": False}
]

def get_shift_matrix():
    return {
        "shifts": [
            {"name": "Alpha (Morning: 06:00 - 14:00)", "oee": 93.8, "availability": 97.4, "performance": 95.1, "yield": 98.8, "outputUnits": 4120, "downtimeMins": 14},
            {"name": "Bravo (Afternoon: 14:00 - 22:00)", "oee": 92.1, "availability": 96.0, "performance": 94.2, "yield": 98.4, "outputUnits": 3980, "downtimeMins": 22},
            {"name": "Charlie (Night: 22:00 - 06:00)", "oee": 89.6, "availability": 94.2, "performance": 92.5, "yield": 97.9, "outputUnits": 3740, "downtimeMins": 45}
        ],
        "topDowntimeCategories": [
            {"category": "Technical / Mechanical", "minutes": 110, "color": "#ef4444"},
            {"category": "Tooling / Changeover", "minutes": 55, "color": "#f59e0b"},
            {"category": "Material Starvation", "minutes": 35, "color": "#3b82f6"},
            {"category": "Operator / Micro-Stops", "minutes": 23, "color": "#10b981"}
        ]
    }

# ── 3. Pure Python HTTP Request Handler ──
class FactoryOSRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CLIENT_DIR, **kwargs)

    def _send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        response_bytes = json.dumps({"success": True, "data": data}).encode('utf-8')
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path.startswith('/api/'):
            if path == '/api/telemetry/predict':
                sp = float(query.get('speed', [12.0])[0])
                pr = float(query.get('pressure', [210.0])[0])
                self._send_json(predict_telemetry(sp, pr))
            elif path == '/api/telemetry/history':
                plant = query.get('plant', ['detroit'])[0].lower()
                self._send_json(HISTORICAL_DB.get(plant, HISTORICAL_DB['detroit']))
            elif path == '/api/telemetry/assets':
                plant = query.get('plant', ['detroit'])[0].lower()
                self._send_json(ASSET_REGISTRY.get(plant, ASSET_REGISTRY['detroit']))
            elif path == '/api/telemetry/alerts':
                self._send_json(ALERTS_HISTORY)
            elif path == '/api/analytics/shift':
                self._send_json(get_shift_matrix())
            elif path == '/api/analytics/stats':
                self._send_json({"shiftMatrix": get_shift_matrix(), "monteCarlo": run_monte_carlo()})
            elif path == '/api/reports/list':
                self._send_json([
                    {"name": "Factory_OS_Data_AI_ML_Report.pdf", "type": "PDF", "size": "1.2 MB", "date": "Today"},
                    {"name": "Shift_Alpha_OEE_Summary_Q3.pdf", "type": "PDF", "size": "840 KB", "date": "Yesterday"},
                    {"name": "Cognex_Vision_AI_Defects.csv", "type": "CSV", "size": "320 KB", "date": "Aug 02, 2026"}
                ])

            # ── LIVE ML API ENDPOINTS (auto-updated by background engine) ──
            elif path == '/api/live/state':
                plant = query.get('plant', ['detroit'])[0].lower()
                offsets = {
                    'detroit':  {'oee': 0.0,  'speed': 0.0, 'pressure': 0.0, 'weather': {'temp': '28°C', 'desc': 'Mostly cloudy'}},
                    'austin':   {'oee': 1.8,  'speed': 4.0, 'pressure': -5.0, 'weather': {'temp': '34°C', 'desc': 'Clear & sunny'}},
                    'berlin':   {'oee': -0.6, 'speed': -1.0, 'pressure': 15.0, 'weather': {'temp': '18°C', 'desc': 'Light rain'}},
                    'shanghai': {'oee': 2.7,  'speed': 6.0, 'pressure': -12.0, 'weather': {'temp': '26°C', 'desc': 'Humid & clear'}}
                }
                off = offsets.get(plant, offsets['detroit'])

                base_oee  = min(100.0, max(60.0, LIVE_STATE["oee"] + off['oee']))
                base_avail = min(100.0, max(60.0, LIVE_STATE["availability"] + off['oee']*0.3))
                base_perf  = min(100.0, max(60.0, LIVE_STATE["performance"] + off['oee']*0.4))
                base_yield = min(100.0, max(60.0, LIVE_STATE["yield_rate"] + off['oee']*0.2))

                self._send_json({
                    "plant": plant,
                    "oee": round(base_oee, 1),
                    "availability": round(base_avail, 1),
                    "performance": round(base_perf, 1),
                    "yield": round(base_yield, 1),
                    "speed": round(max(6.0, LIVE_STATE["speed"] + off['speed']), 1),
                    "pressure": round(max(150.0, LIVE_STATE["pressure"] + off['pressure']), 1),
                    "temperature": round(LIVE_STATE["temperature"], 1),
                    "vibration": round(LIVE_STATE["vibration"], 3),
                    "failureRisk": LIVE_STATE["failure_risk"],
                    "rul": LIVE_STATE["rul"],
                    "zScore": LIVE_STATE["z_score"],
                    "status": LIVE_STATE["status"],
                    "weather": off['weather'],
                    "lastUpdated": LIVE_STATE["last_updated"]
                })

            elif path == '/api/live/oee-stream':
                # Last 60 OEE data points for real-time chart
                history = list(LIVE_STATE["oee_history_24h"])[-60:]
                self._send_json({
                    "points": history,
                    "current": LIVE_STATE["oee"],
                    "trend": "up" if len(history) > 1 and history[-1]["oee"] > history[0]["oee"] else "down"
                })

            elif path == '/api/live/sensors':
                # Last 20 sensor readings
                readings = list(LIVE_STATE["sensor_readings"])[-20:]
                self._send_json({
                    "readings": readings,
                    "current": {
                        "speed": round(LIVE_STATE["speed"], 2),
                        "pressure": round(LIVE_STATE["pressure"], 1),
                        "temperature": round(LIVE_STATE["temperature"], 1),
                        "vibration": round(LIVE_STATE["vibration"], 3)
                    }
                })

            elif path == '/api/live/anomalies':
                # Latest anomaly events from ML engine
                events = list(LIVE_STATE["anomaly_events"])[:15]
                self._send_json({
                    "events": events,
                    "totalDetected": len(LIVE_STATE["anomaly_events"]),
                    "systemStatus": LIVE_STATE["status"]
                })

            elif path == '/api/live/dashboard':
                # One-shot full dashboard data — replaces multiple API calls
                self._send_json({
                    "kpis": {
                        "oee": LIVE_STATE["oee"],
                        "availability": LIVE_STATE["availability"],
                        "performance": LIVE_STATE["performance"],
                        "yield": LIVE_STATE["yield_rate"]
                    },
                    "ml": {
                        "failureRisk": LIVE_STATE["failure_risk"],
                        "rul": LIVE_STATE["rul"],
                        "zScore": LIVE_STATE["z_score"],
                        "status": LIVE_STATE["status"]
                    },
                    "sensors": {
                        "speed": round(LIVE_STATE["speed"], 2),
                        "pressure": round(LIVE_STATE["pressure"], 1),
                        "temperature": round(LIVE_STATE["temperature"], 1),
                        "vibration": round(LIVE_STATE["vibration"], 3)
                    },
                    "recentAnomalies": list(LIVE_STATE["anomaly_events"])[:5],
                    "lastUpdated": LIVE_STATE["last_updated"]
                })

            elif path == '/api/ai/recommend':
                # Smart ML-based recommendations based on live state
                risk  = LIVE_STATE["failure_risk"]
                z     = LIVE_STATE["z_score"]
                rul   = LIVE_STATE["rul"]
                sp    = LIVE_STATE["speed"]
                pr    = LIVE_STATE["pressure"]
                recs  = []

                if risk > 65:
                    recs.append({"priority": "CRITICAL", "action": "Emergency maintenance dispatch", "detail": f"Failure risk at {risk:.1f}%. Dispatch technician to Schuler Press immediately.", "impact": "Prevent unplanned downtime"})
                if z > 2.25:
                    recs.append({"priority": "HIGH", "action": "Reduce operating speed", "detail": f"Z-Score {z:.2f} exceeds safe limit. Reduce speed from {sp:.1f} SPM to {max(8, sp-2):.1f} SPM.", "impact": "+3-5% RUL extension"})
                if pr > 240:
                    recs.append({"priority": "HIGH", "action": "Inspect hydraulic valve", "detail": f"Pressure at {pr:.0f} Bar (limit 250). Check proportional valve seal on Cylinder B-2.", "impact": "Prevent hydraulic failure"})
                if rul < 48:
                    recs.append({"priority": "HIGH", "action": "Schedule maintenance window", "detail": f"RUL = {rul}hrs. Schedule maintenance before next shift handover.", "impact": "Prevent unscheduled downtime"})
                if not recs:
                    recs.append({"priority": "LOW", "action": "System nominal", "detail": f"All ML models within safe thresholds. OEE={LIVE_STATE['oee']}%, Risk={risk:.1f}%.", "impact": "Continue monitoring"})

                self._send_json({"recommendations": recs, "generatedAt": datetime.now().isoformat(), "mlStatus": LIVE_STATE["status"]})

            else:
                self._send_json({"error": "API route not found"}, status_code=404)

        elif path == '/health':
            self._send_json({"status": "OK", "server": "Pure Python 3.13 Server"})
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        body_data = {}
        if content_length > 0:
            raw_body = self.rfile.read(content_length).decode('utf-8')
            try:
                body_data = json.loads(raw_body)
            except Exception:
                pass

        if path == '/api/telemetry/predict':
            sp = float(body_data.get('speed', 12.0))
            pr = float(body_data.get('pressure', 210.0))
            self._send_json(predict_telemetry(sp, pr))
        elif path == '/api/analytics/montecarlo':
            trials = int(body_data.get('trials', 1000))
            target_oee = float(body_data.get('targetOee', 95.0))
            sp = float(body_data.get('speed', 12.0))
            pr = float(body_data.get('pressure', 210.0))
            self._send_json(run_monte_carlo(trials, target_oee, sp, pr))
        elif path == '/api/quality/inspect':
            img_id = str(body_data.get('imageId', 'sample_01'))
            self._send_json(inspect_vision_quality(img_id))
        elif path == '/api/upload/dataset':
            filename = str(body_data.get('filename', 'telemetry_upload.csv'))
            self._send_json({
                "status": "INGESTED",
                "filename": filename,
                "rowsProcessed": 14500,
                "columnsDetected": ["timestamp", "speed", "pressure", "temperature", "vibration", "oee"],
                "schemaValidated": True
            })
        elif path == '/api/ai/tutor/chat':
            msg_raw = str(body_data.get('message', ''))
            msg = msg_raw.lower().strip()
            sp = float(body_data.get('speed', 12.0))
            pr = float(body_data.get('pressure', 210.0))
            tele = predict_telemetry(sp, pr)
            risk = tele['failureRisk']
            z = tele['zScore']
            rul = tele['rul']
            status = tele['status']
            forecast = tele['oeeForecast']

            # ── Intelligent Multi-Context AI Brain ──
            if any(k in msg for k in ['hello', 'hi', 'hey', 'start', 'good morning', 'good evening']):
                reply = (f"👋 **Hello! I'm Factory OS AI Copilot** — your intelligent manufacturing assistant powered by Python ML.\n\n"
                         f"**Current Plant Status:**\n"
                         f"• System: **{status}** | Z-Score: **{z} Z**\n"
                         f"• Failure Risk: **{risk}%** | RUL: **{rul} hrs**\n\n"
                         f"Ask me anything about production, maintenance, OEE, quality, inventory, alerts, or analytics!")

            elif any(k in msg for k in ['press', 'schuler', 'hydraulic', 'cylinder', 'valve', 'pump']):
                action = "🚨 **DISPATCH MAINTENANCE NOW**" if risk > 50 else "✅ Monitor closely"
                reply = (f"🔧 **Schuler Hydraulic Press Diagnostic (Python ML Engine)**\n\n"
                         f"• Operating Speed: **{sp} SPM** | Pressure: **{pr} Bar**\n"
                         f"• Z-Score Anomaly: **{z} Z** {'⚠️ ANOMALY DETECTED' if z > 2.25 else '✅ Normal'}\n"
                         f"• Failure Risk: **{risk}%** {'🔴 CRITICAL' if risk > 65 else '🟡 Elevated' if risk > 30 else '🟢 Low'}\n"
                         f"• Remaining Useful Life: **{rul} hours**\n\n"
                         f"**Recommendation:** {action}\n"
                         f"{'• Check Cylinder B-2 proportional valve seal. Pressure decay at 248 Bar.' if pr > 240 else '• Hydraulics within nominal operating envelope.'}")

            elif any(k in msg for k in ['oee', 'overall equipment', 'efficiency', 'performance', 'forecast']):
                trend = "📈 Upward" if forecast[-1] > forecast[0] else "📉 Declining"
                reply = (f"📊 **OEE Intelligence Report (ARIMA Python Forecaster)**\n\n"
                         f"• Current Baseline OEE: **87.4%**\n"
                         f"• Benchmark Compliance: **>95.0%** target\n"
                         f"• 6-Shift ARIMA Forecast: **{forecast}**\n"
                         f"• Trend Direction: **{trend}**\n\n"
                         f"**Plant Breakdown:**\n"
                         f"• Detroit Alpha: 90.7% | Austin Beta: 94.2%\n"
                         f"• Berlin Gamma: 91.8% | Shanghai Delta: 95.1%\n\n"
                         f"**Top Improvement Area:** {'Reduce mechanical downtime (110 mins/shift)' if risk < 50 else 'Address critical failure risk immediately'}")

            elif any(k in msg for k in ['maintenance', 'work order', 'repair', 'fix', 'technician', 'service', 'pm']):
                reply = (f"🔩 **Predictive Maintenance Intelligence**\n\n"
                         f"**Active Work Orders:**\n"
                         f"• WO-2026-0941 — Schuler Press Cylinder B-2: Proportional valve seal (**Approved**)\n"
                         f"• WO-2026-1120 — Paint Oven B Exhaust: Belt alignment (**In Progress**)\n"
                         f"• WO-2026-0348 — Welder Tips Arc Cell A: Resurfacing (**Completed**)\n\n"
                         f"**Current Telemetry Risk:** {risk}% failure probability\n"
                         f"**Predicted RUL:** {rul} hours remaining\n\n"
                         f"**Action:** {'🚨 Escalate to emergency maintenance immediately' if risk > 65 else '📋 Schedule next available maintenance window'}")

            elif any(k in msg for k in ['quality', 'defect', 'vision', 'cognex', 'fpy', 'yield', 'inspection', 'dpmo']):
                reply = (f"🔬 **Cognex Vision AI Quality Intelligence**\n\n"
                         f"• Vision Model: **Cognex ViDi Deep Learning v4.2**\n"
                         f"• First Pass Yield: **98.8%** (Target: >98.5%)\n"
                         f"• DPMO: **142.5** (Six Sigma Level: 5.2σ)\n\n"
                         f"**Active Defects (Last 4 Hours):**\n"
                         f"• DF-9910 — Door Panel: Surface Tear (10 mins ago)\n"
                         f"• DF-9912 — Battery Pack Plate: Weld Splatter (1 hr ago)\n"
                         f"• DF-9915 — Press Cap Cylinder-B: Friction Scuff (3 hrs ago)\n\n"
                         f"**Quality Gate Status:** 🟢 **PASSING** all ISO 9001 thresholds")

            elif any(k in msg for k in ['inventory', 'stock', 'carbon', 'fiber', 'material', 'battery', 'steel', 'spare']):
                reply = (f"📦 **Warehouse Inventory Intelligence**\n\n"
                         f"• Lithium Battery Packs: **120/150 units** 🟢 Healthy\n"
                         f"• Austenite Sheet Steel: **450/500 sheets** 🟢 Healthy\n"
                         f"• Pre-preg Carbon Fiber: **340/500 rolls** 🟡 Refill Triggered\n"
                         f"• Proportional Valve Seals: **2/10 kits** 🔴 **CRITICAL LOW**\n\n"
                         f"**Active Purchase Orders (SAP MM):**\n"
                         f"• PO-88219-SAP — Valve Seals (5 kits): **Released**\n"
                         f"• PO-44912-SAP — Carbon Fiber (160 rolls): **Completed**\n\n"
                         f"**Alert:** Valve Seal stock critically low — delivery ETA: 48hrs")

            elif any(k in msg for k in ['alert', 'alarm', 'warning', 'critical', 'error', 'issue', 'problem']):
                reply = (f"🚨 **Active Plant Alerts ({status} System)**\n\n"
                         f"• 🔴 CRITICAL: Schuler Press — Hydraulic Pressure Decay Cylinder B-2 (1 hr ago)\n"
                         f"• 🟡 WARNING: ISO 10816 Vibration threshold exceeded (12 mins ago)\n"
                         f"• ℹ️ INFO: Carbon Fiber stock at 68% safety threshold (3 hrs ago)\n\n"
                         f"**ML Anomaly Detection:**\n"
                         f"• Z-Score: **{z} Z** {'🔴 Anomaly' if z > 2.25 else '🟢 Normal'}\n"
                         f"• Failure Probability: **{risk}%**\n\n"
                         f"**Recommended Actions:** {'Immediate inspection of Cylinder B-2' if risk > 30 else 'Continue monitoring'}")

            elif any(k in msg for k in ['analytics', 'monte carlo', 'simulation', 'risk', 'probability', 'statistics']):
                mc = run_monte_carlo(500, 95.0, sp, pr)
                reply = (f"📈 **Monte Carlo Risk Analytics (500 Iterations)**\n\n"
                         f"• P(OEE ≥ 95%): **{mc['passProbability']}%**\n"
                         f"• P10 (Pessimistic): **{mc['p10']}%**\n"
                         f"• P50 (Expected): **{mc['p50']}%**\n"
                         f"• P90 (Optimistic): **{mc['p90']}%**\n"
                         f"• Mean OEE: **{mc['mean']}%** | Std Dev: **{mc['stdDev']}%**\n\n"
                         f"**Risk Assessment:** {'⚠️ High risk of missing OEE target' if mc['passProbability'] < 30 else '✅ Good probability of meeting OEE target'}")

            elif any(k in msg for k in ['production', 'line', 'shift', 'output', 'throughput', 'rate', 'units']):
                reply = (f"🏭 **Production Intelligence Report**\n\n"
                         f"**Active Production Lines:**\n"
                         f"• L1 Main Press Line: OEE **89.2%** | 15 SPM | 1 alert\n"
                         f"• L2 Body Welding Cell A: OEE **92.4%** | 24 robots | ✅\n"
                         f"• L3 Paint Oven B: OEE **45.1%** | 🔴 Maintenance\n"
                         f"• L4 Final Assembly Line 1: OEE **88.5%** | 45 JPH | ✅\n"
                         f"• L5 Battery Pack Integration: OEE **96.2%** | 22 packs/hr | ✅\n\n"
                         f"**Shift Summary:**\n"
                         f"• Alpha: 93.8% OEE | 4,120 units output\n"
                         f"• Bravo: 92.1% OEE | 3,980 units output\n"
                         f"• Charlie: 89.6% OEE | 3,740 units output")

            elif any(k in msg for k in ['temperature', 'temp', 'heat', 'thermal', 'cooling', 'oven']):
                reply = (f"🌡️ **Thermal Monitoring Intelligence**\n\n"
                         f"• Current Operating Temperature: **{round(65 + (sp-12)*0.5 + random.random()*2, 1)}°C**\n"
                         f"• Safe Operating Range: 40°C – 120°C\n"
                         f"• Thermal Z-Score: **{round(abs(65 - 65)/8, 2)} Z** ✅ Normal\n"
                         f"• Paint Oven B: Currently in maintenance — thermal offline\n\n"
                         f"**ISO 10816 Vibration Status:** {round(1.4 + random.random()*0.3, 2)} mm/s (Class A — GOOD)")

            elif any(k in msg for k in ['z score', 'zscore', 'anomaly', 'detect', 'vibration', 'sensor', 'ml', 'model', 'algorithm']):
                reply = (f"🧠 **Python AI/ML Model Status**\n\n"
                         f"**Active ML Engines:**\n"
                         f"• Z-Score Anomaly Engine: **{z} Z** {'🔴 ANOMALY' if z > 2.25 else '🟢 Nominal'}\n"
                         f"• Logistic Sigmoid Risk: **{risk}%** failure probability\n"
                         f"• RUL Regressor: **{rul} hrs** remaining useful life\n"
                         f"• ARIMA Forecaster: 6-shift trajectory computed\n"
                         f"• Monte Carlo: 1,000-trial OEE confidence simulation ready\n"
                         f"• Cognex ViDi Vision AI: Active defect inspection running\n\n"
                         f"**Formula:** Z = √((Z_speed² + Z_press² + Z_temp² + Z_vib²) / 4)\n"
                         f"**Current composite Z = {z}** {'⚠️ Exceeds 2.25 threshold!' if z > 2.25 else '✅ Below 2.25 safe threshold'}")

            elif any(k in msg for k in ['report', 'pdf', 'export', 'download', 'summary']):
                reply = (f"📄 **Report Generation Status**\n\n"
                         f"**Available Reports:**\n"
                         f"• Factory_OS_Data_AI_ML_Report.pdf (1.2 MB) — Today\n"
                         f"• Shift_Alpha_OEE_Summary_Q3.pdf (840 KB) — Yesterday\n"
                         f"• Cognex_Vision_AI_Defects.csv (320 KB) — Aug 02, 2026\n\n"
                         f"**Factory OS Project Review PDF:** Available locally\n"
                         f"**GitHub Repository:** https://github.com/yasaswabrahmam/-OS-Factory-\n\n"
                         f"To generate a new report, go to **Reports** view and click Generate.")

            elif any(k in msg for k in ['help', 'what can you do', 'capabilities', 'features', 'commands']):
                reply = (f"🤖 **Factory OS AI Copilot — Full Capabilities**\n\n"
                         f"I can help you with:\n"
                         f"• 📊 **OEE & Forecasting** — Real-time and 6-shift ARIMA predictions\n"
                         f"• 🔧 **Maintenance** — Predictive RUL, work orders, failure risk\n"
                         f"• 🔬 **Quality** — Cognex Vision AI defect analysis\n"
                         f"• 📦 **Inventory** — Stock levels and SAP MM requisitions\n"
                         f"• 🚨 **Alerts** — Active critical/warning/info alerts\n"
                         f"• 🧠 **ML Models** — Z-Score, Monte Carlo, ARIMA details\n"
                         f"• 🏭 **Production** — Line status, shift matrices\n"
                         f"• 🌡️ **Thermal/Vibration** — ISO 10816 sensor analysis\n\n"
                         f"Just type your question naturally!")

            else:
                # Smart general fallback with live telemetry context
                reply = (f"🏭 **Factory OS AI Response** | Plant: Detroit Alpha | {datetime.now().strftime('%H:%M:%S')}\n\n"
                         f"I understood your query: *\"{msg_raw[:80]}{'...' if len(msg_raw) > 80 else ''}\"*\n\n"
                         f"**Live System Status:**\n"
                         f"• System: **{status}** | Z-Score: **{z} Z** | Risk: **{risk}%**\n"
                         f"• Speed: {sp} SPM | Pressure: {pr} Bar | RUL: **{rul} hrs**\n\n"
                         f"Could you be more specific? Try asking about:\n"
                         f"*OEE, maintenance, quality, inventory, alerts, analytics, production, or ML models*")

            self._send_json({"role": "assistant", "content": reply, "timestamp": datetime.now().isoformat()})
        else:
            self._send_json({"error": "Endpoint not found"}, status_code=404)

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, FactoryOSRequestHandler)
    print(f"========================================================")
    print(f"   FACTORY OS — 100% PURE PYTHON SERVER LAUNCHED        ")
    print(f"========================================================")
    print(f"Server running on port {PORT}...")
    print(f"Open browser at: http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
