#!/bin/bash

echo "🔄 Restarting HBnB Website..."

# Stop the website first
./stop_website.sh

# Wait a moment
sleep 2

# Start the website
./start_website.sh