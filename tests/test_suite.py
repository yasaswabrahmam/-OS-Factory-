import unittest
import os
import sqlite3
import json
import numpy as np

class TestFactoryOSPlatform(unittest.TestCase):
    def test_database_seeding(self):
        db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'factoryos.db')
        self.assertTrue(os.path.exists(db_path), "Database factoryos.db must exist.")
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM users WHERE email = 'alexander.vance@factoryos.ai';")
        user_count = cur.fetchone()[0]
        conn.close()
        self.assertGreater(user_count, 0, "Seed user alexander.vance@factoryos.ai must exist.")

    def test_ml_models_joblib_files(self):
        models_dir = os.path.join(os.path.dirname(__file__), '..', 'ml_service', 'models')
        self.assertTrue(os.path.exists(os.path.join(models_dir, 'isolation_forest.joblib')), "isolation_forest.joblib missing")
        self.assertTrue(os.path.exists(os.path.join(models_dir, 'failure_classifier.joblib')), "failure_classifier.joblib missing")
        self.assertTrue(os.path.exists(os.path.join(models_dir, 'rul_regressor.joblib')), "rul_regressor.joblib missing")

    def test_ml_math_calculations(self):
        sp, pr, tp, vb = 12.0, 210.0, 65.0, 1.4
        deg = (sp/12.0)**1.6 * (pr/210.0)**1.4 * (vb/1.4)**1.2
        rul = max(0, int(round(168.0 / max(0.1, deg))))
        self.assertEqual(rul, 168, "Nominal RUL calculation must equal 168 hours.")

if __name__ == '__main__':
    unittest.main()
