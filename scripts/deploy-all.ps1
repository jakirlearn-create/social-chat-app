# ===============================================
# Social Chat App - Complete Deployment Script
# ===============================================
# This script deploys both backend and frontend

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Social Chat App - Full Deployment        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan

# Pre-flight checks
Write-Host "`n🔍 Running pre-flight checks..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found! Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check npm
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Check Git
$gitVersion = git --version 2>$null
if ($gitVersion) {
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git not found! Please install Git" -ForegroundColor Red
    exit 1
}

# Check if in git repository
$isGitRepo = Test-Path .git
if ($isGitRepo) {
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "⚠️  Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check remote
$hasRemote = git remote -v 2>$null
if ($hasRemote) {
    Write-Host "✅ Git remote configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  No git remote found!" -ForegroundColor Yellow
    Write-Host "Please configure GitHub repository:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/social-chat-app.git" -ForegroundColor Gray
    $addRemote = Read-Host "Add remote now? (Y/N)"
    if ($addRemote -eq 'Y' -or $addRemote -eq 'y') {
        $repoUrl = Read-Host "Enter your GitHub repository URL"
        git remote add origin $repoUrl
        Write-Host "✅ Remote added" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment requires remote repository" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ All pre-flight checks passed!" -ForegroundColor Green

# Menu
Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  What would you like to deploy?           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "1. Backend only" -ForegroundColor White
Write-Host "2. Frontend only" -ForegroundColor White
Write-Host "3. Both (Full deployment)" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-4)"

switch ($choice) {
    1 {
        Write-Host "`n🚀 Deploying Backend..." -ForegroundColor Cyan
        & "$PSScriptRoot\deploy-backend.ps1"
    }
    2 {
        Write-Host "`n🚀 Deploying Frontend..." -ForegroundColor Cyan
        & "$PSScriptRoot\deploy-frontend.ps1"
    }
    3 {
        Write-Host "`n🚀 Deploying Backend and Frontend..." -ForegroundColor Cyan
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "STEP 1: Backend Deployment" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        & "$PSScriptRoot\deploy-backend.ps1"
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "STEP 2: Frontend Deployment" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        & "$PSScriptRoot\deploy-frontend.ps1"
        
        Write-Host "`n🎉 Full deployment complete!" -ForegroundColor Green
    }
    4 {
        Write-Host "`nExiting..." -ForegroundColor Gray
        exit 0
    }
    default {
        Write-Host "`n❌ Invalid choice!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Deployment Process Complete!              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check deployment status on Render/Vercel dashboard" -ForegroundColor White
Write-Host "2. Test your live URLs" -ForegroundColor White
Write-Host "3. Monitor logs for any errors" -ForegroundColor White
Write-Host "4. Update DNS settings (if using custom domain)" -ForegroundColor White

Read-Host "`nPress Enter to exit"
