#!/usr/bin/env python3
"""
Factory OS — Python Desktop Launcher & GUI Controller
Launches Factory OS Python Web Server and opens a dedicated browser window.
"""

import sys
import os
import time
import webbrowser
import subprocess

def launch_factory_os():
    print("========================================================")
    print("        FACTORY OS — PYTHON DESKTOP LAUNCHER            ")
    print("========================================================")
    print("Starting Python Web Server on http://localhost:5000...")
    
    server_path = os.path.join(os.path.dirname(__file__), 'server.py')
    server_process = subprocess.Popen([sys.executable, server_path])
    
    time.sleep(1.5)
    print("Opening Factory OS Dashboard in web browser...")
    webbrowser.open("http://localhost:5000")
    
    try:
        server_process.wait()
    except KeyboardInterrupt:
        print("\nTerminating Factory OS Server...")
        server_process.terminate()

if __name__ == '__main__':
    launch_factory_os()
