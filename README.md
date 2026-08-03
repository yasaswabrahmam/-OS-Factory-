# Factory OS — Decision Intelligence

> **CIH Hackathon 2026** | Full-Stack Industrial IoT Dashboard with AI/ML Predictive Analytics

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)](https://expressjs.com)
[![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MIT License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## Overview

**Factory OS** is a production-grade Manufacturing Execution System (MES) dashboard that combines:

- **Real-time OEE Telemetry** across 4 plant sites (Detroit, Austin, Berlin, Shanghai)
- **AI/ML Predictive Maintenance** — Z-Score Anomaly, Logistic Failure Risk, ARIMA Forecasting
- **SAP ERP Integration** — Simulated PM Work Orders & MM Purchase Requisitions
- **Six Sigma Quality Analytics** — DPMO, First-Pass Yield, Cognex Vision AI
- **12 Operational Views** — Overview, Production, Maintenance, Quality, Inventory, Analytics, Recommendations, Alerts, Data Upload, Reports, Knowledge Base, Settings
- **Fully Responsive** — Desktop (4-col), Tablet (2-col), Mobile (hamburger nav)

---

## Quick Start

```bash
# Install dependencies
cd server
npm install

# Start the backend API server (port 5000)
node server.js
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
│   │   ├── app.js             # Core dashboard controller (routing, charts, ML)
│   │   └── vendor/
│   │       └── lucide.min.js  # Icon library
│   └── index.html             # Main SPA entry point (12 views)
│
├── server/                    # Node.js + Express Backend
│   ├── server.js              # App entry, middleware, rate limiting
│   ├── package.json
│   └── domains/
│       ├── ai/                # AI Copilot chatbot engine
│       │   ├── ai.controller.js
│       │   ├── ai.gateway.js
│       │   ├── ai.routes.js
│       │   ├── ai.service.js
│       │   └── engines/
│       │       └── tutor.engine.js
│       ├── analytics/         # Shift analytics & Monte Carlo simulation
│       │   ├── analytics.controller.js
│       │   └── analytics.service.js
│       └── telemetry/         # Core IoT ML engine
│           ├── telemetry.controller.js   # GET/POST /api/telemetry/predict
│           ├── telemetry.routes.js       # Express routes
│           └── telemetry.service.js      # Z-Score, ARIMA, Sigmoid, RUL
│
├── Factory_OS_Project_Review.pdf  # 3-page technical review document
├── .gitignore
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

---

## Deployment

### Netlify (Static Frontend)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `client/` folder onto the page
3. Get your live HTTPS URL instantly

### Backend
Deploy the `server/` folder to any Node.js host (Railway, Render, Heroku).

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3, JavaScript ES6+, Chart.js, Lucide Icons
- **Backend**: Node.js 20, Express.js, express-rate-limit, morgan
- **ML Engine**: Custom mathematical models (no heavy ML frameworks needed)
- **Design**: Glassmorphism, CSS Grid/Flexbox, CSS Custom Properties
- **Fonts**: Inter (Google Fonts)

---

## License

MIT © 2026 Yasaswabrahman Muppalla | CIH Hackathon