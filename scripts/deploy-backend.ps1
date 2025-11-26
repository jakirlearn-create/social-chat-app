# ===============================================
# Social Chat App - Backend Deploy Script
# ===============================================
# This script prepares and deploys backend to Render.com

Write-Host "`n🚀 Backend Deployment Started..." -ForegroundColor Cyan

# Step 1: Check if we're in correct directory
if (-not (Test-Path ".\backend")) {
    Write-Host "❌ Error: backend folder not found!" -ForegroundColor Red
    Write-Host "Please run this script from project root directory" -ForegroundColor Yellow
    exit 1
}

# Step 2: Navigate to backend
Set-Location backend

Write-Host "`n📦 Step 1/5: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n🧪 Step 2/5: Running tests..." -ForegroundColor Yellow
# Add test command if you have tests
# npm test

Write-Host "`n✅ Step 3/5: Checking environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Please edit backend/.env with your actual values" -ForegroundColor Green
}

Write-Host "`n🔍 Step 4/5: Verifying server starts..." -ForegroundColor Yellow
Write-Host "Starting server for 5 seconds..." -ForegroundColor Gray
$job = Start-Job -ScriptBlock { 
    Set-Location $using:PWD
    node server.js 
}
Start-Sleep -Seconds 5
Stop-Job $job
Remove-Job $job

Write-Host "`n📤 Step 5/5: Git commit and push..." -ForegroundColor Yellow
Set-Location ..
git add .
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "chore: Backend deployment update - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
git commit -m $commitMsg
git push origin main

Write-Host "`n✅ Backend code pushed to GitHub!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://dashboard.render.com/" -ForegroundColor White
Write-Host "2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "3. Connect your GitHub repository" -ForegroundColor White
Write-Host "4. Configure:" -ForegroundColor White
Write-Host "   - Root Directory: backend" -ForegroundColor Gray
Write-Host "   - Build Command: npm install" -ForegroundColor Gray
Write-Host "   - Start Command: npm start" -ForegroundColor Gray
Write-Host "   - Environment: Node" -ForegroundColor Gray
Write-Host "5. Add Environment Variables from backend/.env" -ForegroundColor White
Write-Host "6. Click 'Create Web Service'" -ForegroundColor White
Write-Host "`n🎉 Your backend will be live in 5-10 minutes!" -ForegroundColor Green

Read-Host "`nPress Enter to exit"
