# 🚀 Automated Online Deployment Script
# Deploys everything to cloud with MongoDB Atlas

param(
    [string]$MongoDBUri = "",
    [string]$JWTSecret = "",
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$SkipAdmin
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   🚀 COMPLETE ONLINE DEPLOYMENT" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Railway CLI is installed
Write-Host "📦 Checking Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version 2>&1
    Write-Host "✅ Railway CLI installed: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    Write-Host "`nInstalling Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI installed!" -ForegroundColor Green
}

# Check if Vercel CLI is installed
Write-Host "`n📦 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   📊 STEP 1: MongoDB Atlas Setup" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

if (-not $MongoDBUri) {
    Write-Host "⚠️  You need to setup MongoDB Atlas first!" -ForegroundColor Yellow
    Write-Host "`n📖 Follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Go to: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "2. Sign up (FREE)" -ForegroundColor White
    Write-Host "3. Create FREE M0 cluster" -ForegroundColor White
    Write-Host "4. Create database user (username: admin)" -ForegroundColor White
    Write-Host "5. Whitelist IP: 0.0.0.0/0 (allow all)" -ForegroundColor White
    Write-Host "6. Get connection string" -ForegroundColor White
    Write-Host "`nConnection string format:" -ForegroundColor Cyan
    Write-Host "mongodb+srv://admin:<password>@cluster.xxxxx.mongodb.net/social_chat_app" -ForegroundColor Gray
    
    $MongoDBUri = Read-Host "`nPaste your MongoDB Atlas connection string"
    
    if (-not $MongoDBUri) {
        Write-Host "❌ MongoDB URI is required! Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ MongoDB URI configured!" -ForegroundColor Green

if (-not $JWTSecret) {
    $JWTSecret = Read-Host "`nEnter JWT Secret (or press Enter for auto-generated)"
    if (-not $JWTSecret) {
        $JWTSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        Write-Host "✅ Generated JWT Secret: $JWTSecret" -ForegroundColor Green
    }
}

# Save configuration
$config = @{
    MongoDBUri = $MongoDBUri
    JWTSecret = $JWTSecret
    DeploymentDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

$configFile = "deployment-config.json"
$config | ConvertTo-Json | Set-Content $configFile
Write-Host "✅ Configuration saved to: $configFile" -ForegroundColor Green

# Deploy Backend to Railway
if (-not $SkipBackend) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   🚂 STEP 2: Deploy Backend to Railway" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "📦 Preparing backend for deployment..." -ForegroundColor Yellow
    
    # Check if already logged in
    Write-Host "`n🔐 Logging into Railway..." -ForegroundColor Yellow
    Write-Host "⚠️  Browser will open - please login with GitHub" -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    
    try {
        railway login
        Write-Host "✅ Logged into Railway!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Railway login failed. Please try manually:" -ForegroundColor Red
        Write-Host "   railway login" -ForegroundColor Yellow
        exit 1
    }
    
    # Navigate to backend
    cd backend
    
    # Check if railway.json exists
    if (-not (Test-Path "railway.json")) {
        Write-Host "`n📝 Initializing Railway project..." -ForegroundColor Yellow
        railway init
    }
    
    # Set environment variables
    Write-Host "`n⚙️  Setting environment variables..." -ForegroundColor Yellow
    railway variables set MONGODB_URI="$MongoDBUri"
    railway variables set JWT_SECRET="$JWTSecret"
    railway variables set PORT="8000"
    railway variables set NODE_ENV="production"
    
    Write-Host "✅ Environment variables set!" -ForegroundColor Green
    
    # Deploy
    Write-Host "`n🚀 Deploying backend to Railway..." -ForegroundColor Yellow
    Write-Host "⏳ This may take 2-3 minutes..." -ForegroundColor Cyan
    
    railway up
    
    # Get domain
    Write-Host "`n🌐 Getting backend URL..." -ForegroundColor Yellow
    $backendUrl = railway domain
    
    if ($backendUrl) {
        Write-Host "`n✅ Backend deployed successfully!" -ForegroundColor Green
        Write-Host "🔗 Backend URL: https://$backendUrl" -ForegroundColor Cyan
        
        $config.BackendUrl = "https://$backendUrl"
        $config | ConvertTo-Json | Set-Content "../$configFile"
    } else {
        Write-Host "⚠️  No domain assigned yet. Assign domain:" -ForegroundColor Yellow
        Write-Host "   railway domain" -ForegroundColor White
    }
    
    cd ..
}

# Deploy Frontend to Vercel
if (-not $SkipFrontend) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   ⚡ STEP 3: Deploy Frontend to Vercel" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    # Get backend URL from config
    $deployConfig = Get-Content $configFile | ConvertFrom-Json
    $backendApiUrl = $deployConfig.BackendUrl + "/api"
    
    if (-not $backendApiUrl -or $backendApiUrl -eq "/api") {
        $backendApiUrl = Read-Host "Enter backend URL (Railway URL from previous step)"
        if (-not $backendApiUrl.EndsWith("/api")) {
            $backendApiUrl = $backendApiUrl + "/api"
        }
    }
    
    Write-Host "📦 Preparing frontend..." -ForegroundColor Yellow
    cd frontend
    
    # Update API URL in code
    Write-Host "⚙️  Updating API URL in config..." -ForegroundColor Yellow
    $apiConfigPath = "src\config\api.js"
    
    if (Test-Path $apiConfigPath) {
        $apiConfig = Get-Content $apiConfigPath -Raw
        $newApiConfig = $apiConfig -replace "http://localhost:8000/api", $backendApiUrl
        $newApiConfig | Set-Content $apiConfigPath
        Write-Host "✅ API URL updated!" -ForegroundColor Green
    }
    
    # Create vercel.json if not exists
    $vercelConfig = @{
        "buildCommand" = "npm run build"
        "outputDirectory" = "build"
        "devCommand" = "npm start"
        "installCommand" = "npm install"
        "env" = @{
            "REACT_APP_API_URL" = $backendApiUrl
        }
    }
    
    $vercelConfig | ConvertTo-Json -Depth 10 | Set-Content "vercel.json"
    
    # Deploy to Vercel
    Write-Host "`n🚀 Deploying frontend to Vercel..." -ForegroundColor Yellow
    Write-Host "⏳ This may take 2-3 minutes..." -ForegroundColor Cyan
    
    $vercelOutput = vercel --prod --yes 2>&1
    
    # Extract URL from output
    $frontendUrl = ($vercelOutput | Select-String -Pattern "https://[^\s]+\.vercel\.app" | Select-Object -First 1).Matches.Value
    
    if ($frontendUrl) {
        Write-Host "`n✅ Frontend deployed successfully!" -ForegroundColor Green
        Write-Host "🔗 Frontend URL: $frontendUrl" -ForegroundColor Cyan
        
        $deployConfig.FrontendUrl = $frontendUrl
        $deployConfig | ConvertTo-Json | Set-Content "../$configFile"
    }
    
    cd ..
}

# Deploy Admin Panel to Vercel
if (-not $SkipAdmin) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   🔐 STEP 4: Deploy Admin Panel to Vercel" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    $deployConfig = Get-Content $configFile | ConvertFrom-Json
    $backendApiUrl = $deployConfig.BackendUrl + "/api"
    
    Write-Host "📦 Preparing admin panel..." -ForegroundColor Yellow
    cd admin-panel
    
    # Update API URL in services
    Write-Host "⚙️  Updating API URL in services..." -ForegroundColor Yellow
    $authServicePath = "src\services\authService.js"
    
    if (Test-Path $authServicePath) {
        $authService = Get-Content $authServicePath -Raw
        $newAuthService = $authService -replace "http://localhost:8000/api", $backendApiUrl
        $newAuthService | Set-Content $authServicePath
        Write-Host "✅ API URL updated!" -ForegroundColor Green
    }
    
    # Create vercel.json
    $vercelConfig = @{
        "buildCommand" = "npm run build"
        "outputDirectory" = "build"
        "devCommand" = "npm start"
        "installCommand" = "npm install"
        "env" = @{
            "REACT_APP_API_URL" = $backendApiUrl
        }
    }
    
    $vercelConfig | ConvertTo-Json -Depth 10 | Set-Content "vercel.json"
    
    # Deploy
    Write-Host "`n🚀 Deploying admin panel to Vercel..." -ForegroundColor Yellow
    Write-Host "⏳ This may take 2-3 minutes..." -ForegroundColor Cyan
    
    $vercelOutput = vercel --prod --yes 2>&1
    
    $adminUrl = ($vercelOutput | Select-String -Pattern "https://[^\s]+\.vercel\.app" | Select-Object -First 1).Matches.Value
    
    if ($adminUrl) {
        Write-Host "`n✅ Admin panel deployed successfully!" -ForegroundColor Green
        Write-Host "🔗 Admin URL: $adminUrl" -ForegroundColor Cyan
        
        $deployConfig.AdminUrl = $adminUrl
        $deployConfig | ConvertTo-Json | Set-Content "../$configFile"
    }
    
    cd ..
}

# Final Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$finalConfig = Get-Content $configFile | ConvertFrom-Json

Write-Host "📱 YOUR LIVE URLS:" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

if ($finalConfig.FrontendUrl) {
    Write-Host "✅ Frontend App:  " -NoNewline -ForegroundColor Green
    Write-Host $finalConfig.FrontendUrl -ForegroundColor Cyan
}

if ($finalConfig.AdminUrl) {
    Write-Host "✅ Admin Panel:   " -NoNewline -ForegroundColor Green
    Write-Host $finalConfig.AdminUrl -ForegroundColor Cyan
}

if ($finalConfig.BackendUrl) {
    Write-Host "✅ Backend API:   " -NoNewline -ForegroundColor Green
    Write-Host $finalConfig.BackendUrl -ForegroundColor Cyan
}

Write-Host "─────────────────────────────────────────`n" -ForegroundColor Gray

# Create shareable links document
$linksDoc = @"
# 🌐 Your Live App Links

**Deployment Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 📱 Access from ANY Phone

### Frontend Application (Main App)
🔗 **$($finalConfig.FrontendUrl)**

Features:
- User Registration & Login
- Profile Management
- Posts & Feed
- Messenger Chat
- Wallet
- Games

### Admin Panel
🔗 **$($finalConfig.AdminUrl)**

Admin Login:
- Email: admin@admin.com
- Password: admin123

### Backend API
🔗 **$($finalConfig.BackendUrl)**

API Documentation: $($finalConfig.BackendUrl)/api

---

## 📱 Test on Mobile

1. Open browser on ANY phone
2. Go to: $($finalConfig.FrontendUrl)
3. Register new account
4. Test all features
5. Share link with friends!

---

## 🔒 Database

**MongoDB Atlas** (Cloud)
- Connection String: [Configured]
- Database: social_chat_app
- Location: Cloud (accessible from anywhere)

---

## 🎉 Share with Anyone

Just send them this link:
**$($finalConfig.FrontendUrl)**

They can:
- Register
- Login
- Use all features
- Access from any device
- No installation needed!

---

**Deployed by:** Automated Deployment Script
**Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

$linksDoc | Set-Content "LIVE_APP_LINKS.md"

Write-Host "📄 Links saved to: LIVE_APP_LINKS.md" -ForegroundColor Green

# Test the deployment
Write-Host "`n🧪 Testing deployment..." -ForegroundColor Yellow

if ($finalConfig.BackendUrl) {
    try {
        $healthCheck = Invoke-RestMethod -Uri "$($finalConfig.BackendUrl)/api/health" -TimeoutSec 10
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Backend health check failed. May take a few minutes to start." -ForegroundColor Yellow
    }
}

# Open in browser
Write-Host "`n🌐 Open in browser?" -ForegroundColor Yellow
$openBrowser = Read-Host "Press 'y' to open frontend URL (y/n)"

if ($openBrowser -eq 'y' -and $finalConfig.FrontendUrl) {
    Start-Process $finalConfig.FrontendUrl
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Check LIVE_APP_LINKS.md for all URLs" -ForegroundColor Cyan
Write-Host "Your app is now LIVE and accessible from anywhere!" -ForegroundColor Green
