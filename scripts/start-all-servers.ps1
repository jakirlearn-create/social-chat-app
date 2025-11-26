# Quick Start All Servers Script
Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           🚀 Starting All Servers for Testing              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if ngrok is installed
$ngrokInstalled = $false
try {
    $null = Get-Command ngrok -ErrorAction Stop
    $ngrokInstalled = $true
    Write-Host "✅ ngrok found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  ngrok not installed" -ForegroundColor Yellow
    Write-Host "   Please install ngrok first. See INSTALL_NGROK.md" -ForegroundColor Gray
}

Write-Host "`n📦 Starting servers in separate windows...`n" -ForegroundColor Cyan

# Start Backend
Write-Host "1️⃣  Starting Backend Server (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
cd '$PSScriptRoot\..\backend'
Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green
npm start
"@ -WindowStyle Normal

Start-Sleep -Seconds 3

# Start ngrok if installed
if ($ngrokInstalled) {
    Write-Host "2️⃣  Starting ngrok tunnel..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '🌐 ngrok Tunnel Starting...' -ForegroundColor Cyan
Write-Host 'Copy the HTTPS URL from below and use it to update API configs' -ForegroundColor Yellow
Write-Host ''
ngrok http 8000
"@ -WindowStyle Normal
    
    Start-Sleep -Seconds 5
    
    Write-Host "`n⚠️  IMPORTANT: Copy the ngrok URL and run:" -ForegroundColor Yellow
    Write-Host "   .\scripts\update-ngrok-url.ps1 -NgrokUrl 'YOUR_NGROK_URL'`n" -ForegroundColor White
} else {
    Write-Host "2️⃣  Skipping ngrok (not installed)" -ForegroundColor Gray
}

# Start Frontend
Write-Host "3️⃣  Starting Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
cd '$PSScriptRoot\..\frontend'
Write-Host '📱 Frontend Starting...' -ForegroundColor Green
npm start
"@ -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Admin Panel
Write-Host "4️⃣  Starting Admin Panel (Port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
cd '$PSScriptRoot\..\admin-panel'
Write-Host '👔 Admin Panel Starting...' -ForegroundColor Green
npm start
"@ -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                  ✅ All Servers Started!                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📋 Server URLs:" -ForegroundColor White
Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Admin Panel:   http://localhost:3001" -ForegroundColor Cyan
Write-Host "   Backend API:   http://localhost:8000" -ForegroundColor Cyan
if ($ngrokInstalled) {
    Write-Host "   ngrok Public:  Check ngrok window" -ForegroundColor Yellow
}

Write-Host "`n💡 Tips:" -ForegroundColor White
Write-Host "   • Wait 30-60 seconds for all servers to fully start" -ForegroundColor Gray
Write-Host "   • Check each terminal window for any errors" -ForegroundColor Gray
Write-Host "   • If ngrok is running, update API URLs with the script" -ForegroundColor Gray

Write-Host "`n🔄 To stop all servers:" -ForegroundColor White
Write-Host "   Close the terminal windows or press Ctrl+C in each`n" -ForegroundColor Gray
