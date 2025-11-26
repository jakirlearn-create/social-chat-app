@echo off
title Game Server - Port 8001
cd /d C:\Users\User\social_chat_app\backend
echo.
echo ========================================
echo   Starting Game Server on Port 8001
echo ========================================
echo.
.\venv\Scripts\python.exe -m uvicorn game_server.main:app --reload --port 8001
pause
