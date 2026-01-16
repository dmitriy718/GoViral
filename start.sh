#!/bin/bash
echo "Starting PostDoctor..."

# Function to cleanup background processes on exit
cleanup() {
  echo "Stopping services..."
  kill $(jobs -p)
  exit
}

trap cleanup SIGINT SIGTERM

# Start Server
echo "Starting Backend on port 5000..."
cd server
npm run dev > server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait a bit for server
sleep 2

# Start Client
echo "Starting Frontend..."
cd client
npm run dev > client.log 2>&1 &
CLIENT_PID=$!
cd ..

APP_URL_VALUE="${APP_URL:-http://localhost:5173}"
APP_URL_VALUE="${APP_URL_VALUE%/}"

echo "PostDoctor is running!"
echo "Frontend: ${APP_URL_VALUE}"
echo "Backend: ${APP_URL_VALUE}/api"

wait $SERVER_PID $CLIENT_PID
