#!/usr/bin/env python3
"""
Factory OS — ML Model Initializer & Serializer
Trains Scikit-Learn models for Anomaly Detection (Isolation Forest),
Failure Classification (Random Forest), and RUL Regression (Gradient Boosting / Random Forest).
Saves models to ml_service/models/ directory.
"""

import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier, GradientBoostingRegressor

def init_ml_models():
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'ml_service', 'models')
    os.makedirs(models_dir, exist_ok=True)
    print(f"Creating ML models in {models_dir}...")

    # 1. Anomaly Detector (Isolation Forest)
    # Features: [speed, pressure, temperature, vibration]
    np.random.seed(42)
    normal_data = np.random.normal(loc=[12.0, 210.0, 65.0, 1.4], scale=[1.5, 12.0, 5.0, 0.3], size=(500, 4))
    anomaly_data = np.random.uniform(low=[5.0, 150.0, 100.0, 3.5], high=[25.0, 300.0, 140.0, 8.0], size=(50, 4))
    X_anomaly = np.vstack([normal_data, anomaly_data])

    iso_forest = IsolationForest(n_estimators=100, contamination=0.08, random_state=42)
    iso_forest.fit(X_anomaly)
    joblib.dump(iso_forest, os.path.join(models_dir, 'isolation_forest.joblib'))
    print("  [OK] Saved isolation_forest.joblib")

    # 2. Failure Classifier (Random Forest)
    # Features: [speed, pressure, temperature, vibration] -> Target: 0 (Normal), 1 (Warning), 2 (Critical)
    X_cls = np.random.uniform(low=[8.0, 180.0, 40.0, 0.8], high=[20.0, 260.0, 120.0, 4.0], size=(1000, 4))
    y_cls = []
    for row in X_cls:
        sp, pr, tp, vb = row
        z = np.sqrt(((sp-12)/2)**2 + ((pr-210)/15)**2 + ((tp-65)/8)**2 + ((vb-1.4)/0.3)**2) / 2
        if z > 2.25 or vb > 3.0:
            y_cls.append(2) # Critical
        elif z > 1.2 or vb > 2.2:
            y_cls.append(1) # Warning
        else:
            y_cls.append(0) # Normal
    
    rf_cls = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_cls.fit(X_cls, y_cls)
    joblib.dump(rf_cls, os.path.join(models_dir, 'failure_classifier.joblib'))
    print("  [OK] Saved failure_classifier.joblib")

    # 3. Remaining Useful Life (RUL) Regressor (Gradient Boosting)
    # Features: [speed, pressure, temperature, vibration] -> Target: RUL (Hours 0 - 200)
    X_reg = np.random.uniform(low=[8.0, 180.0, 40.0, 0.8], high=[20.0, 260.0, 120.0, 4.0], size=(1000, 4))
    y_reg = []
    for row in X_reg:
        sp, pr, tp, vb = row
        deg = (sp/12.0)**1.6 * (pr/210.0)**1.4 * (vb/1.4)**1.2
        rul = max(0, int(round(168.0 / max(0.1, deg))))
        y_reg.append(rul)
    
    gb_reg = GradientBoostingRegressor(n_estimators=100, random_state=42)
    gb_reg.fit(X_reg, y_reg)
    joblib.dump(gb_reg, os.path.join(models_dir, 'rul_regressor.joblib'))
    print("  [OK] Saved rul_regressor.joblib")
    print("ML models initialized successfully!")

if __name__ == '__main__':
    init_ml_models()
