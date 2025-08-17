#!/bin/bash

echo "🚀 Starting HBnB Website..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if ports are already in use
echo "🔍 Checking ports availability..."
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 5001 is already in use. Stopping existing process..."
    pkill -f "python run_v4.py" 2>/dev/null || true
    kill -9 $(lsof -ti:5001) 2>/dev/null || true
    sleep 2
fi

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 8080 is already in use. Stopping existing process..."
    pkill -f "python -m http.server 8080" 2>/dev/null || true
    kill -9 $(lsof -ti:8080) 2>/dev/null || true
    sleep 2
fi

# Start database
echo "📊 Starting MySQL database..."
docker-compose up -d mysql

# Wait for database to start
echo "⏳ Waiting for database to start..."
sleep 5

# Check database health
echo "🔍 Checking database connection..."
until docker-compose exec mysql mysqladmin ping -h localhost --silent; do
    echo "Waiting for database to start..."
    sleep 2
done

echo "✅ Database is running"

# Start backend API server (background)
echo "🔧 Starting backend API server (port 5001)..."
cd part4
python run_v4.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start and verify
sleep 3
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend server (background)
echo "🌐 Starting frontend server (port 8080)..."
cd part4/frontend
python -m http.server 8080 &
FRONTEND_PID=$!
cd ../..

# Wait for frontend to start and verify
sleep 2
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start"
    exit 1
fi

# Save process IDs to files
echo $BACKEND_PID > .backend_pid
echo $FRONTEND_PID > .frontend_pid

echo ""
echo "🎉 Website started successfully!"
echo ""
echo "📱 Access URLs:"
echo "   Main Website: http://localhost:8080"
echo "   API Docs:     http://127.0.0.1:5001/swagger"
echo "   API Base:     http://127.0.0.1:5001/api/v1/"
echo ""
echo "🔐 Default Admin Account:"
echo "   Email: admin@hbnb.io"
echo "   Password: admin1234"
echo ""
echo "💡 To stop the website, run: ./stop_website.sh"