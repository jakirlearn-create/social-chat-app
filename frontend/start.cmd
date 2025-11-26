@echo off
cd /d C:\Users\User\social_chat_app\frontend
set BROWSER=none
set SKIP_PREFLIGHT_CHECK=true
set GENERATE_SOURCEMAP=false
set TSC_COMPILE_ON_ERROR=true
set DISABLE_ESLINT_PLUGIN=true
set NODE_OPTIONS=--localstorage-file=.localstorage
echo.
echo =======================================
echo    FRONTEND SERVER - PORT 3000
echo    Running for 2 hours
echo =======================================
echo.
npm start
