#!/usr/bin/env python3
"""
Factory OS — Python ARIMA(1,1,0) Time-Series Forecaster
Extends 24-hour historical OEE curves into a 6-shift predictive trajectory.
"""

import math
import random

class ArimaForecaster:
    def __init__(self, phi=0.65, drift=0.1):
        self.phi = phi
        self.drift = drift

    def forecast_oee(self, current_oee, failure_risk=12.5, steps=6):
        drift_val = -0.15 if failure_risk > 50.0 else self.drift
        forecast = []
        val = current_oee
        prev_diff = 0.0

        for _ in range(steps):
            u1 = random.random()
            u2 = random.random()
            noise = math.sqrt(-2.0 * math.log(u1 + 1e-15)) * math.cos(2.0 * math.pi * u2) * 0.4
            
            diff = self.phi * prev_diff + drift_val + noise
            val = max(35.0, min(99.5, val + diff))
            prev_diff = diff
            forecast.append(round(val, 1))

        return forecast

if __name__ == '__main__':
    forecaster = ArimaForecaster()
    print("6-Shift OEE ARIMA Forecast:", forecaster.forecast_oee(96.4, 12.5))
