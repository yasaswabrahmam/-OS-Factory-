#!/usr/bin/env python3
"""
Factory OS — Real-Time IoT Telemetry Simulator
Simulates sensor streams for Operating Speed (SPM), Hydraulic Pressure (Bar), Core Temperature (°C), and Vibration.
"""

import time
import math
import random

class TelemetrySimulator:
    def __init__(self, base_speed=12.0, base_pressure=210.0, base_temp=65.0):
        self.base_speed = base_speed
        self.base_pressure = base_pressure
        self.base_temp = base_temp
        self.tick = 0

    def generate_reading(self):
        self.tick += 1
        speed_drift = math.sin(self.tick / 5.0) * 0.8 + (random.random() * 0.4 - 0.2)
        press_drift = math.cos(self.tick / 4.0) * 3.5 + (random.random() * 2.0 - 1.0)
        temp_drift = math.sin(self.tick / 10.0) * 1.5 + (random.random() * 0.8 - 0.4)
        vibration = 1.4 + abs(math.sin(self.tick / 3.0)) * 0.6 + (random.random() * 0.2)

        speed = max(8.0, min(24.0, self.base_speed + speed_drift))
        pressure = max(160.0, min(280.0, self.base_pressure + press_drift))
        temperature = max(40.0, min(120.0, self.base_temp + temp_drift))

        return {
            "timestamp": time.time(),
            "speed": round(speed, 1),
            "pressure": round(pressure, 1),
            "temperature": round(temperature, 1),
            "vibration": round(vibration, 2)
        }

if __name__ == '__main__':
    sim = TelemetrySimulator()
    print("Simulating 5 IoT telemetry sensor readings:")
    for _ in range(5):
        print(sim.generate_reading())
        time.sleep(0.1)
