#!/bin/bash

# FWP Social Chat App - Stop All Servers Script
# This script stops all running servers

echo "=========================================="
echo "  FWP Social Chat App - Stopping Servers"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local name=$2
    
    echo -e "${YELLOW}Stopping $name (Port $port)...${NC}"
    
    # Find and kill processes using the port
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pids" ]; then
        echo -e "   ${GREEN}✓ No process found on port $port${NC}"
    else
        echo "   Found PIDs: $pids"
        kill -15 $pids 2>/dev/null
        sleep 2
        
        # Force kill if still running
        pids=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "   Force killing: $pids"
            kill -9 $pids 2>/dev/null
        fi
        
        echo -e "   ${GREEN}✓ $name stopped${NC}"
    fi
}

# Stop each server
kill_port 5000 "Backend Server"
kill_port 3000 "Frontend Server"
kill_port 3001 "Admin Panel"
kill_port 8001 "Game Server"

echo ""
echo "=========================================="
echo -e "${GREEN}✓ All Servers Stopped${NC}"
echo "=========================================="
echo ""
