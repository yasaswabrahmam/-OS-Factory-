# 🏭 Factory OS — Decision Intelligence Platform

> **CIH Hackathon 2026** | Full-Stack Industrial IoT Dashboard with AI/ML Predictive Analytics

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-candid--kelpie--ac1c3a.netlify.app-brightgreen?style=for-the-badge)](https://candid-kelpie-ac1c3a.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-yasaswabrahmam%2F--OS--Factory---%20-181717?style=for-the-badge&logo=github)](https://github.com/yasaswabrahmam/-OS-Factory-)

---

## 🌐 Live Deployment

> **👉 [https://candid-kelpie-ac1c3a.netlify.app/](https://candid-kelpie-ac1c3a.netlify.app/)**

Deployed on **Netlify** — fully static, zero-dependency cloud hosting.  
No backend required — the embedded client-side ML & AI Copilot engine runs 100% in the browser.

---

## Overview

**Factory OS** is a production-grade Manufacturing Execution System (MES) dashboard that combines:

- **Real-time OEE Telemetry** across 4 plant sites (Detroit, Austin, Berlin, Shanghai)
- **AI/ML Predictive Maintenance** — Z-Score Anomaly, Logistic Failure Risk, ARIMA Forecasting
- **SAP ERP Integration** — Simulated PM Work Orders & MM Purchase Requisitions
- **Six Sigma Quality Analytics** — DPMO, First-Pass Yield, Cognex Vision AI
- **12 Operational Views** — Overview, Production, Maintenance, Quality, Inventory, Analytics, Recommendations, Alerts, Data Upload, Reports, Knowledge Base, Settings
- **Fully Responsive** — Desktop (4-col), Tablet (2-col), Mobile (hamburger nav)
- **Profile System** — Multi-account switcher with Settings, Add Account & Log Out
- **AI Copilot** — Conversational plant intelligence assistant with real-time telemetry context

---

## Quick Start (Local)

```bash
# Run the Python backend server (port 5000)
python server.py
```

Then open your browser at **`http://localhost:5000`**

---

## Project Structure

```
factory-os/
├── client/                    # Static Frontend (SPA)
│   ├── css/
│   │   ├── variables.css      # Design tokens (colors, spacing, typography)
│   │   └── main.css           # Full UI + 4-breakpoint responsive system
│   ├── js/
│   │   ├── app.js             # Core dashboard controller (routing, charts, ML, Auth)
│   │   └── vendor/
│   │       └── lucide.min.js  # Icon library
│   ├── _redirects             # Netlify SPA routing rule
│   └── index.html             # Main SPA entry point (12 views)
│
├── server.py                  # Pure Python 3 backend + ML engine + REST API
├── netlify.toml               # Netlify build configuration
└── README.md
```

---

## ML Model Architecture

| Model | Algorithm | Output |
|-------|-----------|--------|
| Anomaly Detection | Z-Score `\|SPM-12\|×0.42 + \|Bar-210\|×0.022` | Anomaly index (threshold 2.25) |
| Failure Risk | Logistic Sigmoid `σ(0.45×speed + 0.065×pressure)` | Probability % |
| Remaining Useful Life | `168 - f(SPM, BAR)` hours | RUL in hours |
| OEE Forecast | ARIMA AR(1) with speed-adaptive drift | 6-shift projection |
| Monte Carlo | 1,000 Gaussian iterations N(μ,σ²) | P(OEE > 90%) |

---

## OEE Benchmark Results

| Plant | OEE Score | Target | Status |
|-------|-----------|--------|--------|
| Detroit | 92.4% | 90% | ✅ PASS |
| Austin | 94.2% | 90% | ✅ PASS |
| Berlin | 91.8% | 90% | ✅ PASS |
| Shanghai | 95.1% | 90% | ✅ PASS |

---

## Responsive Design

| Breakpoint | Width | Layout |
|---|---|---|
| Desktop | ≥ 1281px | 4-column bento grid, 260px sidebar |
| Small Laptop | 1025–1280px | 2-column, 220px compact sidebar |
| Tablet | 768–1024px | 2-column, 200px narrow sidebar |
| Mobile | ≤ 767px | Single column, hamburger menu |
| Extra Small | ≤ 375px | Single column, compressed UI |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/telemetry/predict` | Get ML predictions (default params) |
| `POST` | `/api/telemetry/predict` | ML predict with `{ speed, pressure }` body |
| `GET` | `/api/telemetry/history?plant=detroit` | 30-day OEE history |
| `GET` | `/api/telemetry/alerts` | Real-time alert feed |
| `POST` | `/api/ai/tutor/chat` | AI Copilot chatbot |
| `GET` | `/api/analytics/shift` | Shift performance matrix |
| `GET` | `/api/live/state?plant=detroit` | Live ML engine state |
| `GET` | `/api/live/anomalies` | Live anomaly event queue |

---

## Deployment

### ☁️ Netlify (Live)
**🌐 [https://candid-kelpie-ac1c3a.netlify.app/](https://candid-kelpie-ac1c3a.netlify.app/)**

The `netlify.toml` and `client/_redirects` are pre-configured.  
To redeploy: import `yasaswabrahmam/-OS-Factory-` on [app.netlify.com](https://app.netlify.com).

### 💻 Local (Python Server)
```bash
python server.py
# Open http://localhost:5000
```

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript ES6+, Chart.js, Lucide Icons
- **Backend**: Pure Python 3 (no frameworks), custom HTTP server
- **ML Engine**: Custom mathematical models (Z-Score, Sigmoid, ARIMA, RUL, Monte Carlo)
- **Design**: Glassmorphism, CSS Grid/Flexbox, CSS Custom Properties
- **Fonts**: Outfit, Inter (Google Fonts)
- **Deployment**: Netlify (static) + Python edge server

---

## License

MIT © 2026 Yasaswabrahman Muppalla | CIH Hackathon  

🌐 **Live**: [https://candid-kelpie-ac1c3a.netlify.app/](https://candid-kelpie-ac1c3a.netlify.app/)  
📦 **GitHub**: [https://github.com/yasaswabrahmam/-OS-Factory-](https://github.com/yasaswabrahmam/-OS-Factory-)