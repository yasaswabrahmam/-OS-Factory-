#!/usr/bin/env python3
"""
Factory OS — 100% Pure Python Web Server & Machine Learning Telemetry Engine
Provides complete REST API endpoints and serves the static frontend UI (client/) on port 5000.

Zero External Dependencies — Built entirely with Python 3 Standard Library!
"""

import os
import sys
import json
import math
import random
import statistics
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

PORT = 5000
CLIENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'client')

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
            msg = str(body_data.get('message', '')).lower()
            sp = float(body_data.get('speed', 12.0))
            pr = float(body_data.get('pressure', 210.0))
            tele = predict_telemetry(sp, pr)

            if 'press' in msg or 'schuler' in msg or 'pressure' in msg:
                reply = f"⚠️ **Schuler Press Diagnostic (Python Engine):** Z-Score is **{tele['zScore']} Z** (Failure Risk: **{tele['failureRisk']}%**). Operating at **{sp} SPM** and **{pr} Bar**. Predicted RUL: **{tele['rul']} hrs**."
            elif 'oee' in msg or 'forecast' in msg:
                reply = f"📊 **ARIMA OEE Forecast:** Current OEE is baseline 87.4%. Forecast trajectory for next 6 shifts: {tele['oeeForecast']}."
            elif 'carbon' in msg or 'fiber' in msg or 'stock' in msg:
                reply = "📦 **Inventory Stock Report:** Pre-preg Carbon Fiber is at **340 rolls** (safety limit: 500 rolls). Replenishment order PO-44912-SAP is active."
            else:
                reply = f"Hello Alexander. Factory OS Python AI Copilot active for Detroit Plant Alpha. Telemetry Status: **{tele['status']}** (Speed: {sp} SPM, Pressure: {pr} Bar)."

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
