#!/usr/bin/env python3
"""
Factory OS — Database Seeder
Seeds SQLite (factoryos.db) with demo seed accounts, machine telemetry, work orders,
defects, inventory stock, and alerts.
"""

import os
import sqlite3
from datetime import datetime

def seed_database():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'factoryos.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    print(f"Seeding database at {db_path}...")

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Create tables
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        site TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS machines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        line TEXT NOT NULL,
        status TEXT NOT NULL,
        health_score INTEGER NOT NULL,
        speed REAL NOT NULL,
        pressure REAL NOT NULL,
        temperature REAL NOT NULL,
        vibration REAL NOT NULL,
        predicted_rul INTEGER NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS work_orders (
        id TEXT PRIMARY KEY,
        sku TEXT NOT NULL,
        product_name TEXT NOT NULL,
        line TEXT NOT NULL,
        target_qty INTEGER NOT NULL,
        completed_qty INTEGER NOT NULL,
        defects_qty INTEGER NOT NULL,
        status TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        sku TEXT PRIMARY KEY,
        material_name TEXT NOT NULL,
        category TEXT NOT NULL,
        qty INTEGER NOT NULL,
        max_qty INTEGER NOT NULL,
        unit_cost REAL NOT NULL,
        location TEXT NOT NULL,
        supplier TEXT NOT NULL,
        lead_time_days INTEGER NOT NULL,
        status TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        severity TEXT NOT NULL,
        component TEXT NOT NULL,
        msg TEXT NOT NULL,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL
    );
    """)

    # Clear existing
    cur.execute("DELETE FROM users;")
    cur.execute("DELETE FROM machines;")
    cur.execute("DELETE FROM work_orders;")
    cur.execute("DELETE FROM inventory;")
    cur.execute("DELETE FROM alerts;")

    # Seed Admin User
    # Pre-filled credentials: alexander.vance@factoryos.ai / password123
    cur.execute("""
    INSERT INTO users (email, password_hash, name, role, site) VALUES
    ('alexander.vance@factoryos.ai', 'pbkdf2:sha256:password123_hash', 'Alexander Vance', 'Plant Manager', 'Gigafactory Nevada');
    """)

    # Seed Machines
    machines = [
        ('det-m1', 'Schuler Hydraulic Press S-200', 'Main Press Line A', 'OPERATIONAL', 92, 12.0, 210.0, 65.0, 1.4, 168),
        ('det-m2', 'Laser Weld Cell 03', 'Body Welding Cell A', 'DEGRADED', 78, 24.5, 185.0, 88.0, 2.8, 48),
        ('det-m3', 'CNC Milling Station Alpha', 'Machining Line 2', 'OPERATIONAL', 95, 18.0, 195.0, 58.0, 1.1, 210),
        ('det-m4', 'Durr Convection Oven O-4', 'Paint Bake Oven B', 'MAINTENANCE', 45, 0.0, 0.0, 210.0, 0.5, 12),
        ('det-m5', 'Cognex Vision AI Inspection Camera Q-1', 'Final Assembly Cell', 'OPERATIONAL', 98, 45.0, 0.0, 42.0, 0.8, 320)
    ]
    cur.executemany("INSERT INTO machines VALUES (?,?,?,?,?,?,?,?,?,?);", machines)

    # Seed Work Orders
    orders = [
        ('WO-2026-9041', 'SKU-BAT-882', 'Lithium Pack Assembly 4680', 'Line 1 — Nevada Giga', 5000, 4120, 14, 'In Progress'),
        ('WO-2026-9042', 'SKU-STL-402', 'Austenite Chassis Panel B', 'Line 2 — Body Stamping', 3200, 3200, 8, 'Completed'),
        ('WO-2026-9043', 'SKU-CFB-109', 'Carbon Fiber Aero Wing R', 'Line 3 — Composites', 1500, 940, 22, 'In Progress'),
        ('WO-2026-9044', 'SKU-VAL-332', 'Proportional Valve Seal Kit', 'Line 4 — Maintenance', 200, 0, 0, 'Pending Approval')
    ]
    cur.executemany("INSERT INTO work_orders VALUES (?,?,?,?,?,?,?,?);", orders)

    # Seed Inventory
    inv = [
        ('SKU-BAT-882', 'Lithium Battery Packs (4680 Cells)', 'Energy Storage', 120, 150, 450.0, 'WH-A-12', 'Panasonic Energy', 3, 'Optimal'),
        ('SKU-STL-402', 'Austenite Sheet Steel (Grade 304)', 'Raw Metal', 450, 500, 85.0, 'WH-B-04', 'ThyssenKrupp AG', 5, 'Optimal'),
        ('SKU-CFB-109', 'Pre-preg Carbon Fiber Rolls', 'Composites', 340, 500, 310.0, 'WH-C-09', 'Toray Industries', 7, 'Refill Triggered'),
        ('SKU-VAL-332', 'Proportional Valve Seal Kits (B-2)', 'Hydraulics Spare', 2, 10, 1250.0, 'WH-M-01', 'Bosch Rexroth', 2, 'Low Stock')
    ]
    cur.executemany("INSERT INTO inventory VALUES (?,?,?,?,?,?,?,?,?,?);", inv)

    # Seed Alerts
    alerts = [
        (1, 'critical', 'Schuler Press S-200', 'Hydraulic Pressure Decay on Cylinder B-2. Variance exceeded safety limits.', datetime.now().isoformat(), 'UNACKNOWLEDGED'),
        (2, 'warning', 'Laser Weld Cell 03', 'Machine telemetry exceeded ISO 10816 class III vibration threshold (2.8 mm/s).', datetime.now().isoformat(), 'UNACKNOWLEDGED'),
        (3, 'info', 'Warehouse Inventory', 'Current Carbon Fiber stock level reached 68% of safety threshold.', datetime.now().isoformat(), 'RESOLVED')
    ]
    cur.executemany("INSERT INTO alerts VALUES (?,?,?,?,?,?);", alerts)

    conn.commit()
    conn.close()
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
