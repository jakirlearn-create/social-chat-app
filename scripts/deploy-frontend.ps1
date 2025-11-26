# ===============================================
# Social Chat App - Frontend Deploy Script
# ===============================================
# This script prepares and deploys frontend to Vercel

Write-Host "`n🚀 Frontend Deployment Started..." -ForegroundColor Cyan

# Step 1: Check if we're in correct directory
if (-not (Test-Path ".\frontend")) {
    Write-Host "❌ Error: frontend folder not found!" -ForegroundColor Red
    Write-Host "Please run this script from project root directory" -ForegroundColor Yellow
    exit 1
}

# Step 2: Navigate to frontend
Set-Location frontend

Write-Host "`n📦 Step 1/6: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Step 2/6: Checking environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Please edit frontend/.env with your backend URL" -ForegroundColor Green
    Write-Host "   REACT_APP_API_BASE_URL=https://your-backend.onrender.com" -ForegroundColor Gray
}

Write-Host "`n🔨 Step 3/6: Building production version..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📊 Step 4/6: Checking build size..." -ForegroundColor Yellow
$buildSize = (Get-ChildItem build -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Build size: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Gray
if ($buildSize -gt 10) {
    Write-Host "⚠️  Warning: Build size is large! Consider optimization." -ForegroundColor Yellow
}

Write-Host "`n🧹 Step 5/6: Cleaning up..." -ForegroundColor Yellow
# Remove build artifacts that shouldn't be committed
Remove-Item build -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n📤 Step 6/6: Git commit and push..." -ForegroundColor Yellow
Set-Location ..
git add .
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "chore: Frontend deployment update - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
git commit -m $commitMsg
git push origin main

Write-Host "`n✅ Frontend code pushed to GitHub!" -ForegroundColor Green

# Check if Vercel CLI is installed
Write-Host "`n🔍 Checking for Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if ($vercelInstalled) {
    Write-Host "✅ Vercel CLI found!" -ForegroundColor Green
    $deployNow = Read-Host "`nDeploy to Vercel now? (Y/N)"
    if ($deployNow -eq 'Y' -or $deployNow -eq 'y') {
        Set-Location frontend
        Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
        vercel --prod
        Set-Location ..
        Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Vercel CLI not installed" -ForegroundColor Yellow
    Write-Host "`n📋 Installation Options:" -ForegroundColor Cyan
    Write-Host "Option 1: Install Vercel CLI" -ForegroundColor White
    Write-Host "   npm install -g vercel" -ForegroundColor Gray
    Write-Host "   vercel login" -ForegroundColor Gray
    Write-Host "   cd frontend && vercel --prod" -ForegroundColor Gray
    Write-Host "`nOption 2: Deploy via Vercel Dashboard" -ForegroundColor White
    Write-Host "   1. Go to: https://vercel.com/" -ForegroundColor Gray
    Write-Host "   2. Sign up with GitHub" -ForegroundColor Gray
    Write-Host "   3. Import repository: social-chat-app" -ForegroundColor Gray
    Write-Host "   4. Root Directory: frontend" -ForegroundColor Gray
    Write-Host "   5. Framework: Create React App" -ForegroundColor Gray
    Write-Host "   6. Add Environment Variables" -ForegroundColor Gray
    Write-Host "   7. Deploy!" -ForegroundColor Gray
}

Write-Host "`n🎉 Your frontend will be live shortly!" -ForegroundColor Green

Read-Host "`nPress Enter to exit"
