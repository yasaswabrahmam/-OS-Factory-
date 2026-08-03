#!/usr/bin/env python3
"""
Factory OS — Python Presentation PDF Generator
Generates Factory_OS_Presentation_Deck.pdf using pure Python and FPDF.
"""

import os
from fpdf import FPDF

class PresentationPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(139, 92, 246)
        self.cell(0, 8, 'FACTORY OS - EXECUTIVE PRESENTATION SLIDE DECK', border=0, align='R')
        self.ln(6)
        self.set_draw_color(139, 92, 246)
        self.line(10, 18, 200, 18)
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(140, 140, 150)
        self.cell(0, 10, f'Page {self.page_no()} of {{nb}} | Confidential Executive Slide Deck', border=0, align='C')

def generate_pdf():
    pdf = PresentationPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)

    # ── SLIDE 1 ──
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(26, 12, 58)
    pdf.cell(0, 10, '1. Industrial Application & Purpose', border=0, align='L')
    pdf.ln(10)

    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(109, 40, 217)
    pdf.cell(0, 6, 'What is the Use of this App to Industries?', border=0, align='L')
    pdf.ln(6)

    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(50, 50, 60)
    pdf.multi_cell(190, 5, "Factory OS is a next-generation Manufacturing Execution System (MES) and Industrial IoT Decision Intelligence Platform built for high-speed assembly environments.\n\n* Core Purpose: Enables plant managers, reliability engineers, and production supervisors to monitor multi-site telemetry in real-time, predict equipment failures before breakdown, and enforce >95.0% Overall Equipment Effectiveness (OEE) compliance.\n\n* Target Industries: Automotive Giga-Assembly, Battery Module Manufacturing, Heavy Hydraulic Stamping, and Electronics Line Optimization across global sites (Detroit, Austin, Berlin, Shanghai).\n\n* SAP ERP Integration: Directly connects to SAP PM (Plant Maintenance) and SAP MM (Materials Management) BAPI endpoints for automated work orders and inventory refills.")
    pdf.ln(6)

    img1_path = os.path.join(os.path.dirname(__file__), 'presentation_images', 'architecture.jpg')
    if os.path.exists(img1_path):
        pdf.image(img1_path, x=10, w=190, h=75)

    # ── SLIDE 2 ──
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(26, 12, 58)
    pdf.cell(0, 10, '2. Telemetry Data Scale & Volumes', border=0, align='L')
    pdf.ln(10)

    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(109, 40, 217)
    pdf.cell(0, 6, 'How Much Data is Used?', border=0, align='L')
    pdf.ln(6)

    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(50, 50, 60)
    pdf.multi_cell(190, 5, "Factory OS processes high-throughput industrial telemetry streams across 20 registered industrial machines:\n\n* IoT Sensor Sampling Rate: 100 Hz High-Speed Streaming (100 readings per second per machine).\n* Daily Log Volume: Over 25 Million sensor data points daily (Operating Speed, Hydraulic Pressure, Thermal Drift, ISO 10816 Vibration).\n* Historical Vault: 30-Day Rolling Time-Series history per plant location.\n* Stochastic Monte Carlo Scale: 1,000 trial parameter iterations computed per simulation execution.")
    pdf.ln(6)

    headers = ["Telemetry Channel", "Sampling Rate", "Daily Data Volume", "Retention Vault"]
    widths = [45, 35, 60, 50]
    pdf.set_font('Helvetica', 'B', 8.5)
    pdf.set_fill_color(230, 230, 245)
    for h, w in zip(headers, widths):
        pdf.cell(w, 7, h, border=1, align='C', fill=True)
    pdf.ln()

    rows = [
        ["Operating Speed (SPM)", "100 Hz", "8.64 Million Records", "30 Days Time-Series"],
        ["Hydraulic Pressure (Bar)", "100 Hz", "8.64 Million Records", "30 Days Time-Series"],
        ["Core Temperature (C)", "10 Hz", "864,000 Records", "90 Days Historical"],
        ["ISO 10816 Vibration (mm/s)", "100 Hz", "8.64 Million Records", "30 Days Time-Series"]
    ]
    pdf.set_font('Helvetica', '', 8.5)
    for row in rows:
        for val, w in zip(row, widths):
            pdf.cell(w, 6.5, f' {val}', border=1, align='L')
        pdf.ln()

    # ── SLIDE 3 ──
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(26, 12, 58)
    pdf.cell(0, 10, '3. Python 3.13 AI/ML Algorithms', border=0, align='L')
    pdf.ln(10)

    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(109, 40, 217)
    pdf.cell(0, 6, 'What Algorithms are Used & How do They Run?', border=0, align='L')
    pdf.ln(6)

    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(50, 50, 60)
    pdf.multi_cell(190, 4.5, "1. Multi-Variable Z-Score Anomaly Engine:\n   Formula: Z = sqrt((Z_speed^2 + Z_press^2 + Z_temp^2 + Z_vib^2) / 4)\n   Evaluates deviation across 4 sensor channels. Triggers alert if Z > 2.25.\n\n2. Logistic Sigmoid Failure Risk Classifier:\n   Formula: P(Failure) = 100 / (1 + e^-logit)\n   Calculates failure probability % based on continuous mechanical stress.\n\n3. Remaining Useful Life (RUL) Regressor:\n   Formula: RUL = max(0, 168 / degradation_index)\n   Estimates remaining operational hours before mandatory maintenance.\n\n4. ARIMA(1,1,0) & Monte Carlo (1,000 Trials):\n   Extends 24-hour OEE curves into a 6-shift forecast & computes P(OEE >= 95%) confidence limits.")
    pdf.ln(4)

    img2_path = os.path.join(os.path.dirname(__file__), 'presentation_images', 'predictive.jpg')
    if os.path.exists(img2_path):
        pdf.image(img2_path, x=10, w=190, h=65)

    # ── SLIDE 4 ──
    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(26, 12, 58)
    pdf.cell(0, 10, '4. Industrial Problems Solved', border=0, align='L')
    pdf.ln(10)

    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(109, 40, 217)
    pdf.cell(0, 6, 'What Problem is Solved by this App?', border=0, align='L')
    pdf.ln(6)

    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(50, 50, 60)
    pdf.multi_cell(190, 4.5, "1. Zero Unplanned Mechanical Downtime:\n   Replaces reactive breakdown downtime ($22,000/min cost) with 140-hour advance RUL predictive failure alerts.\n\n2. Six Sigma Quality Control (<142.5 DPMO):\n   Cognex Vision AI detects micro-weld voids automatically, maintaining 98.8% First Pass Yield (FPY).\n\n3. Automated ERP Work Orders & Logistics:\n   Dispatches SAP PM tickets and SAP MM purchase requisitions when stock drops below 25% safety threshold.")
    pdf.ln(4)

    img3_path = os.path.join(os.path.dirname(__file__), 'presentation_images', 'vision_ai.jpg')
    if os.path.exists(img3_path):
        pdf.image(img3_path, x=10, w=190, h=65)

    output_filename = "Factory_OS_Presentation_Deck.pdf"
    pdf.output(output_filename)
    print(f"Presentation PDF generated successfully: {output_filename}")

if __name__ == '__main__':
    generate_pdf()
