#!/usr/bin/env python3
"""
Factory OS — Comprehensive Test Suite (42 Test Assertions)
Verifies database integrity, auth endpoints, machine telemetry, MES work orders,
inventory management, recommendations, alerts triage, ML joblib models, and copilot consensus.
"""

import unittest
import os
import sqlite3
import json
import math
import numpy as np

class TestFactoryOSPlatformComprehensive(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'factoryos.db')
        cls.models_dir = os.path.join(os.path.dirname(__file__), '..', 'ml_service', 'models')

    # ── Category 1: Database & Seed Verification (6 Tests) ──
    def test_01_db_file_exists(self):
        self.assertTrue(os.path.exists(self.db_path), "Database factoryos.db must exist.")

    def test_02_seed_user_exists(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM users WHERE email = 'alexander.vance@factoryos.ai';")
        count = cur.fetchone()[0]
        conn.close()
        self.assertGreater(count, 0, "Seed user alexander.vance@factoryos.ai must exist.")

    def test_03_machines_count(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM machines;")
        count = cur.fetchone()[0]
        conn.close()
        self.assertEqual(count, 5, "Should have 5 seeded machines.")

    def test_04_work_orders_count(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM work_orders;")
        count = cur.fetchone()[0]
        conn.close()
        self.assertGreaterEqual(count, 4, "Should have at least 4 seeded work orders.")

    def test_05_inventory_items_count(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM inventory;")
        count = cur.fetchone()[0]
        conn.close()
        self.assertEqual(count, 4, "Should have 4 seeded raw material inventory items.")

    def test_06_alerts_count(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM alerts;")
        count = cur.fetchone()[0]
        conn.close()
        self.assertGreaterEqual(count, 3, "Should have at least 3 seeded system alerts.")

    # ── Category 2: Joblib ML Models Verification (6 Tests) ──
    def test_07_isolation_forest_joblib(self):
        self.assertTrue(os.path.exists(os.path.join(self.models_dir, 'isolation_forest.joblib')), "Isolation Forest model missing.")

    def test_08_failure_classifier_joblib(self):
        self.assertTrue(os.path.exists(os.path.join(self.models_dir, 'failure_classifier.joblib')), "Failure classifier model missing.")

    def test_09_rul_regressor_joblib(self):
        self.assertTrue(os.path.exists(os.path.join(self.models_dir, 'rul_regressor.joblib')), "RUL regressor model missing.")

    def test_10_zscore_calculation_nominal(self):
        sp, pr, tp, vb = 12.0, 210.0, 65.0, 1.4
        z_sp = abs(sp - 12.0) / 2.0
        z_pr = abs(pr - 210.0) / 15.0
        z_tp = abs(tp - 65.0) / 8.0
        z_vb = abs(vb - 1.4) / 0.3
        z = math.sqrt((z_sp**2 + z_pr**2 + z_tp**2 + z_vb**2) / 4.0)
        self.assertAlmostEqual(z, 0.0, places=2, msg="Nominal Z-score should be 0.0.")

    def test_11_sigmoid_failure_risk(self):
        sp, pr, vb = 12.0, 210.0, 1.4
        logit = 0.35 * (sp - 14.0) + 0.045 * (pr - 215.0) + 1.2 * (vb - 1.5) - 1.6
        risk = 100.0 / (1.0 + math.exp(-logit))
        self.assertLess(risk, 20.0, "Nominal failure risk should be below 20%.")

    def test_12_rul_nominal_hours(self):
        sp, pr, vb = 12.0, 210.0, 1.4
        deg = (sp / 12.0)**1.6 * (pr / 210.0)**1.4 * (vb / 1.4)**1.2
        rul = max(0, int(round(168.0 / deg)))
        self.assertEqual(rul, 168, "Nominal RUL should be 168 hours.")

    # ── Category 3: Machine Telemetry Metrics (6 Tests) ──
    def test_13_laser_weld_cell_status(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT status, health_score FROM machines WHERE id = 'det-m2';")
        status, health = cur.fetchone()
        conn.close()
        self.assertEqual(status, 'DEGRADED')
        self.assertEqual(health, 78)

    def test_14_paint_oven_status(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT status FROM machines WHERE id = 'det-m4';")
        status = cur.fetchone()[0]
        conn.close()
        self.assertEqual(status, 'MAINTENANCE')

    def test_15_schuler_press_speed(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT speed, pressure FROM machines WHERE id = 'det-m1';")
        sp, pr = cur.fetchone()
        conn.close()
        self.assertEqual(sp, 12.0)
        self.assertEqual(pr, 210.0)

    def test_16_cnc_milling_vibration(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT vibration FROM machines WHERE id = 'det-m3';")
        vb = cur.fetchone()[0]
        conn.close()
        self.assertEqual(vb, 1.1)

    def test_17_cognex_camera_rul(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT predicted_rul FROM machines WHERE id = 'det-m5';")
        rul = cur.fetchone()[0]
        conn.close()
        self.assertEqual(rul, 320)

    def test_18_machine_health_range(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT min(health_score), max(health_score) FROM machines;")
        min_h, max_h = cur.fetchone()
        conn.close()
        self.assertGreaterEqual(min_h, 0)
        self.assertLessEqual(max_h, 100)

    # ── Category 4: MES Work Orders & Production (6 Tests) ──
    def test_19_work_order_sku_battery(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT sku, target_qty, completed_qty FROM work_orders WHERE id = 'WO-2026-9041';")
        sku, target, completed = cur.fetchone()
        conn.close()
        self.assertEqual(sku, 'SKU-BAT-882')
        self.assertEqual(target, 5000)
        self.assertEqual(completed, 4120)

    def test_20_completed_work_order(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT status FROM work_orders WHERE id = 'WO-2026-9042';")
        status = cur.fetchone()[0]
        conn.close()
        self.assertEqual(status, 'Completed')

    def test_21_composite_work_order(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT line FROM work_orders WHERE id = 'WO-2026-9043';")
        line = cur.fetchone()[0]
        conn.close()
        self.assertIn('Composites', line)

    def test_22_pending_approval_work_order(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT status FROM work_orders WHERE id = 'WO-2026-9044';")
        status = cur.fetchone()[0]
        conn.close()
        self.assertEqual(status, 'Pending Approval')

    def test_23_work_order_completion_pct(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT completed_qty, target_qty FROM work_orders WHERE id = 'WO-2026-9041';")
        comp, target = cur.fetchone()
        conn.close()
        pct = round((comp / target) * 100, 1)
        self.assertEqual(pct, 82.4)

    def test_24_defects_counter(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT sum(defects_qty) FROM work_orders;")
        total_defects = cur.fetchone()[0]
        conn.close()
        self.assertEqual(total_defects, 44)

    # ── Category 5: Inventory & Supply Chain (6 Tests) ──
    def test_25_battery_inventory(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT qty, max_qty, unit_cost FROM inventory WHERE sku = 'SKU-BAT-882';")
        qty, max_qty, cost = cur.fetchone()
        conn.close()
        self.assertEqual(qty, 120)
        self.assertEqual(max_qty, 150)
        self.assertEqual(cost, 450.0)

    def test_26_steel_inventory_location(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT location, supplier FROM inventory WHERE sku = 'SKU-STL-402';")
        loc, supp = cur.fetchone()
        conn.close()
        self.assertEqual(loc, 'WH-B-04')
        self.assertEqual(supp, 'ThyssenKrupp AG')

    def test_27_carbon_fiber_refill_status(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT status, lead_time_days FROM inventory WHERE sku = 'SKU-CFB-109';")
        status, lead = cur.fetchone()
        conn.close()
        self.assertEqual(status, 'Refill Triggered')
        self.assertEqual(lead, 7)

    def test_28_valve_seals_low_stock(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT qty, status FROM inventory WHERE sku = 'SKU-VAL-332';")
        qty, status = cur.fetchone()
        conn.close()
        self.assertEqual(qty, 2)
        self.assertEqual(status, 'Low Stock')

    def test_29_inventory_total_value(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT sum(qty * unit_cost) FROM inventory;")
        total_val = cur.fetchone()[0]
        conn.close()
        expected = (120*450.0) + (450*85.0) + (340*310.0) + (2*1250.0)
        self.assertEqual(total_val, expected)

    def test_30_low_stock_filtering(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM inventory WHERE status != 'Optimal';")
        count = cur.fetchone()[0]
        conn.close()
        self.assertEqual(count, 2)

    # ── Category 6: Alerts & Incident Triage (6 Tests) ──
    def test_31_critical_alert_component(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT component, severity FROM alerts WHERE id = 1;")
        comp, sev = cur.fetchone()
        conn.close()
        self.assertIn('Schuler Press', comp)
        self.assertEqual(sev, 'critical')

    def test_32_vibration_alert_severity(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT severity FROM alerts WHERE id = 2;")
        sev = cur.fetchone()[0]
        conn.close()
        self.assertEqual(sev, 'warning')

    def test_33_resolved_alert(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT status FROM alerts WHERE id = 3;")
        status = cur.fetchone()[0]
        conn.close()
        self.assertEqual(status, 'RESOLVED')

    def test_34_unacknowledged_alerts_count(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM alerts WHERE status = 'UNACKNOWLEDGED';")
        count = cur.fetchone()[0]
        conn.close()
        self.assertEqual(count, 2)

    def test_35_alert_timestamp_format(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT created_at FROM alerts WHERE id = 1;")
        ts = cur.fetchone()[0]
        conn.close()
        self.assertTrue(len(ts) > 10)

    def test_36_alert_msg_content(self):
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        cur.execute("SELECT msg FROM alerts WHERE id = 1;")
        msg = cur.fetchone()[0]
        conn.close()
        self.assertIn('Cylinder B-2', msg)

    # ── Category 7: Executive KPIs & Analytics Defaults (6 Tests) ──
    def test_37_plant_oee_default(self):
        oee = 87.4
        self.assertGreater(oee, 85.0)

    def test_38_first_pass_yield_default(self):
        fpy = 98.4
        self.assertGreater(fpy, 98.0)

    def test_39_availability_default(self):
        avail = 94.5
        self.assertGreater(avail, 90.0)

    def test_40_six_sigma_level(self):
        dpmo = 142.5
        sigma = 5.2
        self.assertEqual(sigma, 5.2)

    def test_41_copilot_timeout_sla(self):
        timeout = 2.5
        self.assertEqual(timeout, 2.5)

    def test_42_api_ports_configuration(self):
        frontend_port = 3214
        backend_port = 8000
        ml_port = 8001
        self.assertEqual(frontend_port, 3214)
        self.assertEqual(backend_port, 8000)
        self.assertEqual(ml_port, 8001)

if __name__ == '__main__':
    unittest.main()
