# ===============================================
# Social Chat App - Ngrok Testing Script
# ===============================================
# This script starts backend and creates ngrok tunnel for testing

Write-Host "`n🌐 Starting Ngrok Testing Environment..." -ForegroundColor Cyan

# Check if ngrok is installed
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokInstalled) {
    Write-Host "❌ Ngrok not found!" -ForegroundColor Red
    Write-Host "`nInstallation Options:" -ForegroundColor Yellow
    Write-Host "1. Download: https://ngrok.com/download" -ForegroundColor White
    Write-Host "2. Or install via Chocolatey: choco install ngrok" -ForegroundColor White
    Write-Host "3. Run: ngrok authtoken YOUR_TOKEN" -ForegroundColor White
    exit 1
}

Write-Host "✅ Ngrok found!" -ForegroundColor Green

# Start backend server in background
Write-Host "`n🚀 Starting backend server..." -ForegroundColor Yellow
Set-Location backend

# Start server as background job
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm start
}

Write-Host "⏳ Waiting for server to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Check if server is running
$serverRunning = netstat -ano | Select-String "8000" -Quiet
if ($serverRunning) {
    Write-Host "✅ Backend server running on http://localhost:8000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server failed to start!" -ForegroundColor Red
    Stop-Job $serverJob
    Remove-Job $serverJob
    exit 1
}

Set-Location ..

# Start ngrok
Write-Host "`n🌐 Creating ngrok tunnel..." -ForegroundColor Yellow
$ngrokJob = Start-Job -ScriptBlock {
    ngrok http 8000
}

Write-Host "⏳ Waiting for ngrok to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Get ngrok URL
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels"
    $ngrokUrl = $ngrokApi.tunnels[0].public_url
    Write-Host "`n✅ Ngrok tunnel created!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Your Backend URL: $ngrokUrl" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    # Copy to clipboard (Windows only)
    Set-Clipboard -Value $ngrokUrl
    Write-Host "✅ URL copied to clipboard!" -ForegroundColor Green
    
    Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Update frontend/.env:" -ForegroundColor White
    Write-Host "   REACT_APP_API_BASE_URL=$ngrokUrl" -ForegroundColor Gray
    Write-Host "2. Restart frontend: npm start" -ForegroundColor White
    Write-Host "3. Test your app!" -ForegroundColor White
    
    Write-Host "`n🌐 Ngrok Dashboard: http://localhost:4040" -ForegroundColor Cyan
    Write-Host "View requests, responses, and logs in real-time" -ForegroundColor Gray
    
    Write-Host "`n⚠️  Note: This tunnel will expire in 2 hours (free plan)" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop ngrok and backend server" -ForegroundColor Yellow
    
    # Keep running
    Write-Host "`n✅ Press Ctrl+C to stop..." -ForegroundColor Green
    Wait-Job $ngrokJob
    
} catch {
    Write-Host "❌ Failed to get ngrok URL!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

# Cleanup on exit
try {
    Stop-Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job $serverJob -ErrorAction SilentlyContinue
    Stop-Job $ngrokJob -ErrorAction SilentlyContinue
    Remove-Job $ngrokJob -ErrorAction SilentlyContinue
} catch {
    # Ignore cleanup errors
}

Write-Host "`n👋 Stopped!" -ForegroundColor Gray
