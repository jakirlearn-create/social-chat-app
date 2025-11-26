# Frontend Server Startup Script
cd C:\Users\User\social_chat_app\frontend

Write-Host ""
Write-Host "   " -ForegroundColor Cyan
Write-Host "    FRONTEND SERVER - PORT 3000" -ForegroundColor Yellow
Write-Host "    Running for 2 hours" -ForegroundColor Green  
Write-Host "   " -ForegroundColor Cyan
Write-Host ""

# Set environment variables to suppress warnings
$env:BROWSER = "none"
$env:SKIP_PREFLIGHT_CHECK = "true"
$env:GENERATE_SOURCEMAP = "false"
$env:DISABLE_ESLINT_PLUGIN = "true"

# Start the server
npm start
