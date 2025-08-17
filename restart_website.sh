#!/bin/bash

echo "🔄 Restarting HBnB Website..."

# Stop the website first
echo "🛑 Stopping all services..."
./stop_website.sh

# Wait for ports to be completely freed
echo "⏳ Waiting for ports to be freed..."
sleep 5

# Ensure all processes are terminated
echo "🧹 Final cleanup..."
pkill -f "python run_v4.py" 2>/dev/null || true
pkill -f "python -m http.server 8080" 2>/dev/null || true
kill -9 $(lsof -ti:5001) 2>/dev/null || true
kill -9 $(lsof -ti:8080) 2>/dev/null || true

# Wait additional time
sleep 3

# Start the website
echo "🚀 Starting services..."
./start_website.sh