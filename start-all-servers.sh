#!/bin/bash

# FWP Social Chat App - All Servers Startup Script
# This script starts all the servers required for the application

echo "=========================================="
echo "  FWP Social Chat App - Starting Servers"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}📂 Working Directory: $SCRIPT_DIR${NC}"
echo ""

# Function to check if a port is in use
# Returns 0 (success) if port is in use, 1 (failure) if port is free
# This follows bash convention where 0 = true/success in conditional statements
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use (true/success for "if check_port")
    else
        return 1  # Port is free (false/failure for "if check_port")
    fi
}

# Function to wait for a server to start
wait_for_server() {
    local port=$1
    local name=$2
    local max_wait=30
    local count=0
    
    echo -n "   Waiting for $name to start"
    while [ $count -lt $max_wait ]; do
        if check_port $port; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        count=$((count + 1))
    done
    echo -e " ${RED}✗ (timeout)${NC}"
    return 1
}

# Check if required directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ] || [ ! -d "admin-panel" ]; then
    echo -e "${RED}✗ Error: Required directories not found!${NC}"
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo -e "${GREEN}✓ Created logs directory${NC}"
fi

# 1. Start Backend Server (Node.js)
echo -e "${YELLOW}[1/4] Starting Backend Server (Port 5000)...${NC}"
if check_port 5000; then
    echo -e "${GREEN}   ✓ Backend already running on port 5000${NC}"
else
    cd backend
    node server.js > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo "   PID: $BACKEND_PID"
    cd ..
    wait_for_server 5000 "Backend"
fi
echo ""

# 2. Start Game Server (Python/FastAPI)
echo -e "${YELLOW}[2/4] Starting Game Server (Port 8001)...${NC}"
if check_port 8001; then
    echo -e "${GREEN}   ✓ Game Server already running on port 8001${NC}"
else
    cd backend
    python3 -m uvicorn game_server.main:app --port 8001 > ../logs/game-server.log 2>&1 &
    GAME_PID=$!
    echo "   PID: $GAME_PID"
    cd ..
    wait_for_server 8001 "Game Server"
fi
echo ""

# 3. Start Frontend Server (React)
echo -e "${YELLOW}[3/4] Starting Frontend Server (Port 3000)...${NC}"
if check_port 3000; then
    echo -e "${GREEN}   ✓ Frontend already running on port 3000${NC}"
else
    cd frontend
    BROWSER=none npm start > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "   PID: $FRONTEND_PID"
    cd ..
    wait_for_server 3000 "Frontend"
fi
echo ""

# 4. Start Admin Panel (React)
echo -e "${YELLOW}[4/4] Starting Admin Panel (Port 3001)...${NC}"
if check_port 3001; then
    echo -e "${GREEN}   ✓ Admin Panel already running on port 3001${NC}"
else
    cd admin-panel
    PORT=3001 BROWSER=none npm start > ../logs/admin-panel.log 2>&1 &
    ADMIN_PID=$!
    echo "   PID: $ADMIN_PID"
    cd ..
    wait_for_server 3001 "Admin Panel"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}✓ All Servers Started Successfully!${NC}"
echo "=========================================="
echo ""
echo "📊 Server URLs:"
echo "   • Backend:     http://localhost:5000"
echo "   • Frontend:    http://localhost:3000"
echo "   • Admin Panel: http://localhost:3001"
echo "   • Game Server: http://localhost:8001"
echo ""
echo "📝 API Documentation:"
echo "   • Backend Health: http://localhost:5000/api/health"
echo "   • Game API Docs:  http://localhost:8001/docs"
echo ""
echo "📋 Logs Directory: $SCRIPT_DIR/logs/"
echo ""
echo "To stop all servers, run: ./stop-all-servers.sh"
echo "Or press Ctrl+C in each terminal"
echo ""
