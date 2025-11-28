#!/bin/bash

# ClassNote AI - Startup Script
# This script starts both the Flask backend and Vite frontend servers

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   ClassNote AI - Starting Servers${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    pkill -P $$ 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt 2>/dev/null || echo "No requirements.txt found"
else
    echo -e "${GREEN}✓ Virtual environment found${NC}"
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source .venv/bin/activate

# Start Flask backend in background
echo -e "${BLUE}Starting Flask backend server...${NC}"
python3 dt.py > /tmp/flask_server.log 2>&1 &
FLASK_PID=$!

# Wait for Flask to start
sleep 3

# Check if Flask started successfully
if ps -p $FLASK_PID > /dev/null; then
    echo -e "${GREEN}✓ Flask server started (PID: $FLASK_PID)${NC}"
    echo -e "${GREEN}  → http://localhost:5000${NC}"
else
    echo -e "${YELLOW}✗ Flask server failed to start. Check /tmp/flask_server.log${NC}"
    exit 1
fi

# Start Vite frontend
echo -e "${BLUE}Starting Vite frontend server...${NC}"
cd ClassNoteAI
npm run dev > /tmp/vite_server.log 2>&1 &
VITE_PID=$!
cd ..

# Wait for Vite to start
sleep 2

# Check if Vite started successfully
if ps -p $VITE_PID > /dev/null; then
    echo -e "${GREEN}✓ Vite server started (PID: $VITE_PID)${NC}"
    echo -e "${GREEN}  → http://localhost:3000${NC}"
else
    echo -e "${YELLOW}✗ Vite server failed to start. Check /tmp/vite_server.log${NC}"
    kill $FLASK_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   All servers running successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Frontend:${NC} http://localhost:3001"
echo -e "${BLUE}Backend:${NC}  http://localhost:5000"
echo -e "${BLUE}ESP32:${NC}    TCP Server on port 6000"
echo ""
echo -e "${BLUE}Features:${NC}"
echo "  🎤 Audio transcription with timestamps (Whisper AI)"
echo "  🤖 AI-powered content generation with summaries"
echo "  📡 ESP32 wireless microphone support"
echo "  🔍 Multi-tier image search (max 5 per lecture)"
echo "  📊 Custom STEM diagrams"
echo "  🎵 Audio-synced transcript highlighting"
echo "  🗑️  Full CRUD operations"
echo ""
echo ""
echo -e "${YELLOW}ESP32 Connection:${NC}"
echo "  1. Upload sketch to ESP32 (Arduino Files/sketch_nov4a.ino)"
echo "  2. Configure WiFi credentials in sketch"
echo "  3. Set serverIP to $(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -1)"
echo "  4. ESP32 will auto-connect on startup"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Keep script running and monitor processes
while true; do
    if ! ps -p $FLASK_PID > /dev/null; then
        echo -e "${YELLOW}Flask server stopped unexpectedly!${NC}"
        cleanup
    fi
    if ! ps -p $VITE_PID > /dev/null; then
        echo -e "${YELLOW}Vite server stopped unexpectedly!${NC}"
        cleanup
    fi
    sleep 5
done
