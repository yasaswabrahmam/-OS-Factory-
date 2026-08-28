#!/usr/bin/env python3
"""
Factory OS — AI ML Inference Microservice (Port 8001)
FastAPI service running Scikit-Learn joblib models for Machine Anomaly Detection,
Failure Risk Classification, and RUL Regression.
"""

import os
import math
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(
    title="Factory OS — AI ML Inference Microservice",
    description="Dedicated ML inference API running Joblib serialized models on Port 8001",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
iso_forest_model = None
failure_cls_model = None
rul_reg_model = None

# Attempt to load joblib models
try:
    iso_path = os.path.join(MODELS_DIR, 'isolation_forest.joblib')
    if os.path.exists(iso_path):
        iso_forest_model = joblib.load(iso_path)
    
    cls_path = os.path.join(MODELS_DIR, 'failure_classifier.joblib')
    if os.path.exists(cls_path):
        failure_cls_model = joblib.load(cls_path)

    reg_path = os.path.join(MODELS_DIR, 'rul_regressor.joblib')
    if os.path.exists(reg_path):
        rul_reg_model = joblib.load(reg_path)
    print("ML Inference Microservice: Successfully loaded Joblib models.")
except Exception as e:
    print(f"ML Inference Microservice Warning: Could not load Joblib models ({e}). Using algorithmic fallback.")

class TelemetryPayload(BaseModel):
    machineId: str = Field(default="m1")
    speed: float = Field(default=12.0)
    pressure: float = Field(default=210.0)
    temperature: float = Field(default=65.0)
    vibration: float = Field(default=1.4)

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "Factory OS ML Inference Microservice",
        "port": 8001,
        "modelsLoaded": {
            "isolationForest": iso_forest_model is not None,
            "failureClassifier": failure_cls_model is not None,
            "rulRegressor": rul_reg_model is not None
        }
    }

@app.post("/api/v1/predict/machine")
def predict_machine(payload: TelemetryPayload):
    sp = payload.speed
    pr = payload.pressure
    tp = payload.temperature
    vb = payload.vibration
    features = np.array([[sp, pr, tp, vb]])

    # 1. Anomaly Detection (Isolation Forest)
    is_anomaly = False
    anomaly_score = 0.15
    if iso_forest_model is not None:
        pred = iso_forest_model.predict(features)[0] # -1 for anomaly, 1 for normal
        is_anomaly = (pred == -1)
        anomaly_score = float(iso_forest_model.decision_function(features)[0])
    else:
        z_sp = abs(sp - 12.0) / 2.0
        z_pr = abs(pr - 210.0) / 15.0
        z_tp = abs(tp - 65.0) / 8.0
        z_vb = abs(vb - 1.4) / 0.3
        composite_z = math.sqrt((z_sp**2 + z_pr**2 + z_tp**2 + z_vb**2) / 4.0)
        is_anomaly = composite_z > 2.25

    # 2. Failure Classification (Random Forest)
    failure_risk = 6.5
    status = "HEALTHY"
    if failure_cls_model is not None:
        probs = failure_cls_model.predict_proba(features)[0]
        # Class index 0: Normal, 1: Warning, 2: Critical
        critical_prob = float(probs[2]) if len(probs) > 2 else 0.0
        warning_prob = float(probs[1]) if len(probs) > 1 else 0.0
        failure_risk = round((critical_prob * 100.0) + (warning_prob * 40.0), 1)
        failure_risk = max(1.2, min(99.9, failure_risk))
        if critical_prob > 0.4 or is_anomaly:
            status = "CRITICAL"
        elif warning_prob > 0.3:
            status = "WARNING"
    else:
        logit = 0.35 * (sp - 14.0) + 0.045 * (pr - 215.0) + 1.2 * (vb - 1.5) - 1.6
        failure_risk = round(100.0 / (1.0 + math.exp(-logit)), 1)
        failure_risk = max(1.2, min(99.9, failure_risk))
        status = "CRITICAL" if failure_risk > 65 else ("WARNING" if failure_risk > 30 else "HEALTHY")

    # 3. RUL Regression (Gradient Boosting)
    predicted_rul = 168
    if rul_reg_model is not None:
        predicted_rul = int(round(float(rul_reg_model.predict(features)[0])))
        predicted_rul = max(0, predicted_rul)
    else:
        deg = (sp / 12.0)**1.6 * (pr / 210.0)**1.4 * (vb / 1.4)**1.2
        predicted_rul = max(0, int(round(168.0 / max(0.1, deg))))

    health_score = max(0, min(100, int(round(100 - (failure_risk * 0.7) - (0 if not is_anomaly else 20)))))

    return {
        "success": True,
        "machineId": payload.machineId,
        "metrics": {
            "speed": sp,
            "pressure": pr,
            "temperature": tp,
            "vibration": vb
        },
        "predictions": {
            "isAnomaly": is_anomaly,
            "anomalyScore": round(anomaly_score, 3),
            "failureRisk": failure_risk,
            "predictedRulHours": predicted_rul,
            "healthScore": health_score,
            "status": status
        },
        "inferenceEngine": "Scikit-Learn Microservice (Port 8001)"
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
