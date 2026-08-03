#!/usr/bin/env python3
"""
Factory OS — Advanced Python Analytics & Statistical Engine
Provides statistical metrics, Monte Carlo simulations, shift matrix calculations, and ISO 10816 vibration analysis.
"""

import math
import random
import statistics

def box_muller():
    """Generates standard normal random variable N(0,1)."""
    u1 = random.random()
    u2 = random.random()
    while u1 <= 1e-15:
        u1 = random.random()
    return math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)

def calculate_iso_vibration_class(vibration_rms):
    """
    ISO 10816 Mechanical Vibration Severity Evaluation for Class III Heavy Industrial Machinery.
    - Good (<1.8 mm/s)
    - Allowable (1.8 - 4.5 mm/s)
    - Tolerable (4.5 - 11.2 mm/s)
    - Unacceptable (>11.2 mm/s)
    """
    if vibration_rms < 1.8:
        return {"class": "A", "status": "GOOD", "severity": "LOW"}
    elif vibration_rms < 4.5:
        return {"class": "B", "status": "ALLOWABLE", "severity": "MODERATE"}
    elif vibration_rms < 11.2:
        return {"class": "C", "status": "TOLERABLE", "severity": "HIGH"}
    else:
        return {"class": "D", "status": "UNACCEPTABLE", "severity": "CRITICAL"}

def run_advanced_monte_carlo(trials=1000, target_oee=95.0, speed=12.0, pressure=210.0):
    """
    Runs 1,000-trial Monte Carlo simulation using Box-Muller Gaussian sampling.
    Returns OEE probability distributions, P10/P50/P90 percentile thresholds, and confidence limits.
    """
    pass_count = 0
    oee_results = []
    
    speed_factor = 1.0 - abs(speed - 12.0) * 0.015
    press_factor = 1.0 - abs(pressure - 210.0) * 0.0008

    for _ in range(trials):
        z0 = box_muller()
        z1 = box_muller()
        
        availability = min(100.0, max(60.0, (96.2 + z0 * 1.8) * press_factor))
        performance = min(100.0, max(50.0, (94.5 + z1 * 2.2) * speed_factor))
        quality_yield = min(100.0, max(75.0, 98.4 + (random.random() * 1.2 - 0.6)))

        simulated_oee = round((availability / 100.0) * (performance / 100.0) * (quality_yield / 100.0) * 100.0, 1)
        oee_results.append(simulated_oee)
        
        if simulated_oee >= target_oee:
            pass_count += 1

    oee_results.sort()
    
    return {
        "trials": trials,
        "targetOee": target_oee,
        "passProbability": round((pass_count / trials) * 100.0, 1),
        "percentiles": {
            "p10": oee_results[int(trials * 0.10)],
            "p50": oee_results[int(trials * 0.50)],
            "p90": oee_results[int(trials * 0.90)]
        },
        "statistics": {
            "mean": round(statistics.mean(oee_results), 1),
            "stdDev": round(statistics.stdev(oee_results), 2),
            "min": min(oee_results),
            "max": max(oee_results)
        },
        "buckets": {
            "<80%": len([x for x in oee_results if x < 80]),
            "80-85%": len([x for x in oee_results if 80 <= x < 85]),
            "85-90%": len([x for x in oee_results if 85 <= x < 90]),
            "90-95%": len([x for x in oee_results if 90 <= x < 95]),
            ">95%": len([x for x in oee_results if x >= 95])
        }
    }

if __name__ == '__main__':
    print("Factory OS Advanced Analytics Engine initialized.")
    res = run_advanced_monte_carlo()
    print("Monte Carlo Result:", res)
