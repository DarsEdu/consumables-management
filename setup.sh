#!/bin/bash

# Setup script for Depot Inventory Kiosk

echo "Setting up Python virtual environment..."

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Parse CSV to create inventory.json
echo "Parsing CSV file..."
python3 parse-csv.py

echo ""
echo "Setup complete!"
echo ""
echo "To start the server:"
echo "  1. Activate the virtual environment: source venv/bin/activate"
echo "  2. Run: python3 server.py"
echo "  3. Open http://localhost:3000 in your browser"
echo ""

