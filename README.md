# 🏭 Factory OS — Enterprise Manufacturing Decision Intelligence Platform

> **CIH Hackathon 2026** | Full-Stack Industrial IoT Dashboard with AI/ML Predictive Analytics & Multi-Agent Copilot

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-candid--kelpie--ac1c3a.netlify.app-brightgreen?style=for-the-badge)](https://candid-kelpie-ac1c3a.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-yasaswabrahmam%2F--OS--Factory---%20-181717?style=for-the-badge&logo=github)](https://github.com/yasaswabrahmam/-OS-Factory-)

---

## 🌐 Live Deployments & Local Ports

| Layer | Technology | Port / URL | Description |
|---|---|---|---|
| 🌐 **Netlify Cloud Web App** | Static Single Page App | [candid-kelpie-ac1c3a.netlify.app](https://candid-kelpie-ac1c3a.netlify.app/) | Zero-dependency static hosting |
| 💻 **Next.js 16 Frontend** | Next.js 16 + React 19 + Tailwind v4 + Zustand | `http://localhost:3214` | Port **3214** full enterprise UI |
| ⚙️ **FastAPI Gateway Backend** | Python 3.11+ FastAPI + SQLite `factoryos.db` | `http://localhost:8000` | Port **8000** REST API & LangGraph Copilot |
| 🧠 **AI ML Inference Service** | FastAPI + Scikit-Learn Joblib Models | `http://localhost:8001` | Port **8001** Anomaly, Failure Risk, RUL |
| 🐍 **Pure Python Edge Server** | Python 3 Standard Library | `http://localhost:5000` | Port **5000** zero-dependency server |

---

## 🎯 Overview

**Factory OS** is a production-grade Manufacturing Execution System (MES) and Industrial IoT Decision Intelligence Platform combining:

- **Real-time OEE Telemetry** across 4 plant sites (Nevada Gigafactory, Austin, Berlin, Shanghai)
- **AI/ML Predictive Maintenance** — Isolation Forest Anomaly Detection, Random Forest Failure Risk, Gradient Boosting RUL Regressor
- **Multi-Agent Decision Intelligence Copilot** — LangGraph orchestrator with 2.5s threadpool timeout & deterministic consensus fallback
- **Cognex Vision AI Quality Control** — Deep learning defect inspection, DPMO, and First-Pass Yield (FPY)
- **SAP ERP Integrations** — PM Work Orders & MM Purchase Requisitions
- **17 Operational Modules & Routes** — Overview, Copilot, Production MES, Maintenance, Quality, Inventory, Analytics, Recommendations, Alerts, Data Upload, Reports, Knowledge Base, Settings, Login, Register, Forgot Password
- **Interactive Command Palette** — Global `Ctrl + K` instant action search overlay

---

## ⚡ Quick Start (Full Enterprise Stack)

```bash
# 1. Install dependencies
npm run init

# 2. Start all 3 microservices concurrently (Frontend: 3214, Backend: 8000, ML: 8001)
npm run dev

# 3. Run automated test suite
npm test
```

Open **`http://localhost:3214`** to access the enterprise Next.js platform!

### Demo Login Credentials
- **Email**: `alexander.vance@factoryos.ai`
- **Password**: `password123`

---

## 📂 Repository Structure

```
factory-os/
├── frontend/                  # Next.js 16 (App Router, Tailwind v4, Zustand, Port 3214)
│   ├── app/                   # 17 Module Routes (Overview, Copilot, Production, etc.)
│   ├── components/            # TopNav, Sidebar, CommandPalette, ToastContainer
│   └── lib/                   # API client (with mock fallbacks) & Zustand store
│
├── backend/                   # FastAPI API Gateway (Port 8000)
│   ├── main.py                # REST Gateway & Multi-Agent LangGraph Copilot
│   ├── factoryos.db           # SQLite database
│   └── requirements.txt
│
├── ml_service/                # Joblib AI ML Microservice (Port 8001)
│   ├── main.py                # Scikit-Learn inference API
│   ├── models/                # Isolation Forest, Random Forest, Gradient Boosting models
│   └── requirements.txt
│
├── client/                    # Static Single Page App (for Netlify/Vercel static deploy)
├── server.py                  # Standalone Pure Python 3 Edge Server (Port 5000)
├── scripts/                   # init_models.py & seed_database.py
├── tests/                     # Automated test suite
├── package.json               # Root orchestration (concurrently)
└── README.md
```

---

## 🧠 ML Model Architecture

| Model | Algorithm | Output Target |
|-------|-----------|---------------|
| Anomaly Detection | Isolation Forest (`isolation_forest.joblib`) | Outlier score & binary flag |
| Failure Classifier | Random Forest (`failure_classifier.joblib`) | Failure Risk % (Normal / Warning / Critical) |
| RUL Regressor | Gradient Boosting (`rul_regressor.joblib`) | Remaining Useful Life in Hours (0 - 200h) |
| OEE Forecaster | ARIMA AR(1) Autoregressive Model | 6-shift trajectory projection |
| Monte Carlo Risk | 1,000 Box-Muller Gaussian Iterations | P(OEE ≥ 95%), P10, P50, P90 confidence |

---

## ☁️ Netlify Deployment

The static `client/` folder is pre-configured with `netlify.toml` and `client/_redirects`.  
Live URL: **[https://candid-kelpie-ac1c3a.netlify.app/](https://candid-kelpie-ac1c3a.netlify.app/)**

---

## 📄 License

MIT © 2026 Yasaswabrahman Muppalla | CIH Hackathon  
🌐 **Live**: [https://candid-kelpie-ac1c3a.netlify.app/](https://candid-kelpie-ac1c3a.netlify.app/)  
📦 **GitHub**: [https://github.com/yasaswabrahmam/-OS-Factory-](https://github.com/yasaswabrahmam/-OS-Factory-)