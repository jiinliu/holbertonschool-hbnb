#!/bin/bash

echo "🛑 Stopping HBnB Website..."

# Stop frontend and backend servers
if [ -f .backend_pid ]; then
    BACKEND_PID=$(cat .backend_pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "🔧 Stopping backend API server..."
        kill $BACKEND_PID
    fi
    rm .backend_pid
fi

if [ -f .frontend_pid ]; then
    FRONTEND_PID=$(cat .frontend_pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "🌐 Stopping frontend server..."
        kill $FRONTEND_PID
    fi
    rm .frontend_pid
fi

# Kill any remaining Python server processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "python run_v4.py" 2>/dev/null || true
pkill -f "python -m http.server 8080" 2>/dev/null || true

# Ask if user wants to stop database
echo ""
read -p "❓ Stop database too? (data will NOT be lost) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Stopping MySQL database..."
    docker-compose stop mysql
    echo "✅ Database stopped (data preserved in volume)"
else
    echo "📊 Database remains running"
fi

echo ""
echo "✅ Website stopped"
echo "💡 To restart the website, run: ./start_website.sh"