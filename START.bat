@echo off
REM FWP AudioChat - Quick Start Script

color 0A
cls
echo.
echo ===============================================
echo   FWP AudioChat - Development Server
echo ===============================================
echo.

REM Kill any existing Node processes
echo Killing existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend
echo.
echo [1/2] Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d C:\Users\User\social_chat_app\backend && node server-dev.js"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend Server (Port 3000)...
cd /d C:\Users\User\social_chat_app\frontend
set NODE_OPTIONS=--localstorage-file=.localstorage
set REACT_APP_API_URL=http://localhost:5000/api
start "Frontend Server" cmd /k "npm start"

echo.
echo ===============================================
echo   ✓ Services Starting...
echo ===============================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   Waiting for servers to start (30 seconds)...
echo.

timeout /t 30 /nobreak >nul

REM Open in browser
echo Opening browsers...
start http://localhost:3000/signup
start http://localhost:5000/api/health

echo.
echo ✓ All services started! Check browser windows.
echo.
pause
