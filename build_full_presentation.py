#!/usr/bin/env python3
"""
Factory OS — Full Executive PPT Slide Deck Generator
Compiles an interactive 5-slide presentation HTML file (Factory_OS_Executive_Presentation.html)
complete with embedded AI-generated architecture diagrams, data scale tables, Python ML formulas, and problem solutions.
"""

import os
import webbrowser

PRESENTATION_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factory OS — Executive Presentation Deck</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #070412; color: #f1f5f9; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; overflow-x: hidden; }
        
        .deck-wrapper { width: 100%; max-width: 1100px; position: relative; }
        
        .slide { display: none; background: rgba(18, 10, 48, 0.85); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 24px; padding: 40px; box-shadow: 0 30px 80px rgba(0,0,0,0.7); backdrop-filter: blur(20px); min-height: 640px; flex-direction: column; justify-content: space-between; }
        .slide.active { display: flex; animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .slide-header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
        .slide-title { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .slide-badge { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.35); color: #c084fc; font-size: 11px; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }

        .slide-content { flex: 1; display: flex; flex-direction: column; gap: 20px; font-size: 15px; color: #cbd5e1; line-height: 1.6; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: center; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; transition: border 0.3s; }
        .card:hover { border-color: rgba(139, 92, 246, 0.4); }
        .card h4 { font-family: 'Outfit', sans-serif; color: #38bdf8; font-size: 17px; margin-bottom: 8px; font-weight: 700; }

        .stat-box { background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 16px; text-align: center; }
        .stat-value { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; color: #4ade80; }
        .stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

        .img-preview { width: 100%; height: 260px; object-fit: cover; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

        table.slide-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
        table.slide-table th, table.slide-table td { border: 1px solid rgba(255,255,255,0.1); padding: 10px 14px; text-align: left; }
        table.slide-table th { background: rgba(139, 92, 246, 0.15); color: #c084fc; font-family: 'Outfit', sans-serif; }

        .formula-box { font-family: 'JetBrains Mono', monospace; background: rgba(0,0,0,0.4); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 10px; padding: 12px; color: #a5f3fc; font-size: 13px; }

        /* Navigation controls */
        .controls { margin-top: 24px; display: flex; justify-content: space-between; align-items: center; }
        .btn { background: linear-gradient(135deg, #8b5cf6, #06b6d4); border: none; color: white; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5); }
        .btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

        .dots { display: flex; gap: 10px; }
        .dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; transition: all 0.3s; }
        .dot.active { background: #8b5cf6; box-shadow: 0 0 12px #8b5cf6; transform: scale(1.2); }
    </style>
</head>
<body>

    <div class="deck-wrapper">
        <!-- SLIDE 1: OVERVIEW & PURPOSE -->
        <div class="slide active" id="slide-1">
            <div class="slide-header">
                <h2 class="slide-title">1. Purpose & Industrial Application</h2>
                <span class="slide-badge">Slide 1 of 4</span>
            </div>
            <div class="slide-content">
                <div class="grid-2">
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div class="card">
                            <h4>What is Factory OS?</h4>
                            <p>An enterprise-grade <strong>Manufacturing Execution System (MES)</strong> and <strong>Industrial IoT Decision Intelligence Platform</strong> powering real-time multi-site assembly intelligence.</p>
                        </div>
                        <div class="card">
                            <h4>Target Industries & Purpose</h4>
                            <p>Automotive Giga-Assembly, Battery Module Production, Heavy Hydraulic Stamping, and Electronics Line Optimization across global sites (Detroit, Austin, Berlin, Shanghai).</p>
                        </div>
                        <div class="card">
                            <h4>Automated SAP ERP Sync</h4>
                            <p>Direct BAPI integration with <strong>SAP PM</strong> (Plant Maintenance Work Orders) and <strong>SAP MM</strong> (Materials Management Requisitions).</p>
                        </div>
                    </div>
                    <div>
                        <img src="presentation_images/architecture.jpg" alt="Factory OS Architecture Diagram" class="img-preview" />
                        <p style="font-size:11px; color:#94a3b8; text-align:center; margin-top:8px;">Figure 1.1: 3D System Architecture & Python ML IoT Decision Layers</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- SLIDE 2: DATA SCALE & VOLUMES -->
        <div class="slide" id="slide-2">
            <div class="slide-header">
                <h2 class="slide-title">2. Data Scale & Telemetry Volumes</h2>
                <span class="slide-badge">Slide 2 of 4</span>
            </div>
            <div class="slide-content">
                <p>Factory OS handles massive continuous telemetry data rates across 20 registered industrial machines:</p>
                <div class="grid-3">
                    <div class="stat-box">
                        <div class="stat-value">100 Hz</div>
                        <div class="stat-label">IoT Sample Rate (100 msgs/sec)</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">25M+</div>
                        <div class="stat-label">Daily Telemetry Log Records</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">1,000</div>
                        <div class="stat-label">Monte Carlo Iterations / Run</div>
                    </div>
                </div>

                <table class="slide-table">
                    <thead>
                        <tr>
                            <th>Telemetry Channel</th>
                            <th>Sampling Frequency</th>
                            <th>Daily Data Volume</th>
                            <th>Retention Vault</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Operating Speed (SPM)</td>
                            <td>100 Hz</td>
                            <td>8.64 Million Readings</td>
                            <td>30 Days Time-Series</td>
                        </tr>
                        <tr>
                            <td>Hydraulic Pressure (Bar)</td>
                            <td>100 Hz</td>
                            <td>8.64 Million Readings</td>
                            <td>30 Days Time-Series</td>
                        </tr>
                        <tr>
                            <td>Core Temperature (°C)</td>
                            <td>10 Hz</td>
                            <td>864,000 Readings</td>
                            <td>90 Days Historical</td>
                        </tr>
                        <tr>
                            <td>ISO 10816 Vibration (mm/s)</td>
                            <td>100 Hz</td>
                            <td>8.64 Million Readings</td>
                            <td>30 Days Time-Series</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- SLIDE 3: PYTHON AI/ML ALGORITHMS -->
        <div class="slide" id="slide-3">
            <div class="slide-header">
                <h2 class="slide-title">3. Python 3.13 AI/ML Algorithms</h2>
                <span class="slide-badge">Slide 3 of 4</span>
            </div>
            <div class="slide-content">
                <div class="grid-2">
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div class="card">
                            <h4>1. Multi-Variable Z-Score Anomaly Engine</h4>
                            <div class="formula-box">Z = sqrt((Z_speed^2 + Z_press^2 + Z_temp^2 + Z_vib^2) / 4)</div>
                        </div>
                        <div class="card">
                            <h4>2. Logistic Sigmoid Failure Risk %</h4>
                            <div class="formula-box">P(Failure) = 100 / (1 + exp(-logit))</div>
                        </div>
                        <div class="card">
                            <h4>3. Remaining Useful Life (RUL) Regressor</h4>
                            <div class="formula-box">RUL = max(0, 168 / degradation_index)</div>
                        </div>
                        <div class="card">
                            <h4>4. ARIMA(1,1,0) & Monte Carlo (1,000 Trials)</h4>
                            <p style="font-size:12px; color:#cbd5e1;">6-shift OEE time-series trend extensions & Gaussian N(mu, sigma^2) confidence interval calculation.</p>
                        </div>
                    </div>
                    <div>
                        <img src="presentation_images/predictive.jpg" alt="Predictive Analytics Chart" class="img-preview" />
                        <p style="font-size:11px; color:#94a3b8; text-align:center; margin-top:8px;">Figure 3.1: Python ML Predictive Failure Curves & RUL Telemetry</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- SLIDE 4: INDUSTRIAL PROBLEMS SOLVED -->
        <div class="slide" id="slide-4">
            <div class="slide-header">
                <h2 class="slide-title">4. Industrial Problems Solved</h2>
                <span class="slide-badge">Slide 4 of 4</span>
            </div>
            <div class="slide-content">
                <div class="grid-2">
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div class="card">
                            <h4>1. Elimination of Unplanned Stoppages</h4>
                            <p>Replaces reactive breakdown downtime ($22,000/min cost) with <strong>140-hour advance RUL predictive failure alerts</strong>.</p>
                        </div>
                        <div class="card">
                            <h4>2. Six Sigma Quality Control (&lt;142.5 DPMO)</h4>
                            <p>Cognex Vision AI detects micro-weld voids automatically, maintaining <strong>98.8% First Pass Yield (FPY)</strong>.</p>
                        </div>
                        <div class="card">
                            <h4>3. Automated ERP Work Orders & Logistics</h4>
                            <p>Dispatches SAP PM tickets and SAP MM purchase requisitions when material stock drops below 25%.</p>
                        </div>
                    </div>
                    <div>
                        <img src="presentation_images/vision_ai.jpg" alt="Cognex Vision AI Inspector" class="img-preview" />
                        <p style="font-size:11px; color:#94a3b8; text-align:center; margin-top:8px;">Figure 4.1: Cognex Deep Learning Computer Vision Defect Bounding Boxes</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONTROLS -->
        <div class="controls">
            <button class="btn" id="prev-btn" onclick="changeSlide(-1)" disabled>← Previous</button>
            <div class="dots">
                <span class="dot active" onclick="goToSlide(1)"></span>
                <span class="dot" onclick="goToSlide(2)"></span>
                <span class="dot" onclick="goToSlide(3)"></span>
                <span class="dot" onclick="goToSlide(4)"></span>
            </div>
            <button class="btn" id="next-btn" onclick="changeSlide(1)">Next →</button>
        </div>
    </div>

    <script>
        let currentSlide = 1;
        const totalSlides = 4;

        function updateSlide() {
            document.querySelectorAll('.slide').forEach((el, idx) => {
                el.classList.toggle('active', idx + 1 === currentSlide);
            });
            document.querySelectorAll('.dot').forEach((el, idx) => {
                el.classList.toggle('active', idx + 1 === currentSlide);
            });
            document.getElementById('prev-btn').disabled = currentSlide === 1;
            document.getElementById('next-btn').disabled = currentSlide === totalSlides;
        }

        function changeSlide(direction) {
            currentSlide = Math.max(1, Math.min(totalSlides, currentSlide + direction));
            updateSlide();
        }

        function goToSlide(slideNum) {
            currentSlide = slideNum;
            updateSlide();
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') changeSlide(1);
            if (e.key === 'ArrowLeft') changeSlide(-1);
        });
    </script>
</body>
</html>
"""

def generate_deck():
    filepath = "Factory_OS_Executive_Presentation.html"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(PRESENTATION_HTML)
    print(f"Full presentation deck generated successfully: {filepath}")
    webbrowser.open(os.path.abspath(filepath))

if __name__ == '__main__':
    generate_deck()
