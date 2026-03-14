#!/usr/bin/env python3
"""
Simple script to run the Flask backend
"""
import os
import sys
from app import create_app

if __name__ == "__main__":
    # Check if virtual environment exists
    if not os.path.exists("venv") and not os.path.exists(".venv"):
        print("Virtual environment not found!")
        print("Create one with: python -m venv venv")
        print("Then activate it and install dependencies:")
        print("  Windows: venv\\Scripts\\activate")
        print("  macOS/Linux: source venv/bin/activate")
        print("  pip install -r requirements.txt")
        sys.exit(1)

    # Check if .env file exists
    if not os.path.exists(".env"):
        print(".env file not found!")
        print("Copy .env.example to .env and configure your settings")
        sys.exit(1)

    print("Starting Flask backend...")
    print("API will be available at: http://localhost:5000")
    print("API documentation at: http://localhost:5000")
    print("CORS enabled for: http://localhost:3000")
    print("\nReady to serve your React frontend!")

    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
