#!/bin/bash
echo "Starting GoViral..."

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

echo "GoViral is running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"

wait $SERVER_PID $CLIENT_PID
