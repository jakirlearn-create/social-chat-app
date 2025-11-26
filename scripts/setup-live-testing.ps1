# Complete Live Testing System Automation
# একবার চালান, সব automated হয়ে যাবে!

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Live Testing System - Master Setup" -ForegroundColor Cyan
Write-Host "Complete Automation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$global:setupComplete = @{
    git = $false
    firebase = $false
    ngrok = $false
    vercel = $false
}

# Function: Check Git
function Check-Git {
    Write-Host "Step 1: Git Repository Status" -ForegroundColor Yellow
    
    if (Test-Path ".git") {
        Write-Host "  Git: INITIALIZED" -ForegroundColor Green
        
        $status = git status --porcelain
        if ($status) {
            Write-Host "  Uncommitted changes found" -ForegroundColor Yellow
            $commit = Read-Host "  Commit changes now? (y/n)"
            if ($commit -eq 'y') {
                git add .
                git commit -m "Automated commit for deployment"
                Write-Host "  Committed successfully!" -ForegroundColor Green
            }
        } else {
            Write-Host "  All changes committed" -ForegroundColor Green
        }
        $global:setupComplete.git = $true
    } else {
        Write-Host "  Git: NOT INITIALIZED" -ForegroundColor Red
        $init = Read-Host "  Initialize Git now? (y/n)"
        if ($init -eq 'y') {
            git init
            git add .
            git commit -m "Initial commit"
            Write-Host "  Git initialized!" -ForegroundColor Green
            $global:setupComplete.git = $true
        }
    }
    Write-Host ""
}

# Function: Check Firebase
function Check-Firebase {
    Write-Host "Step 2: Firebase Configuration" -ForegroundColor Yellow
    
    $envPath = "frontend\.env"
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath -Raw
        if ($envContent -match "REACT_APP_FIREBASE_API_KEY=(.+)") {
            $apiKey = $matches[1].Trim()
            if ($apiKey -ne "your_firebase_api_key" -and $apiKey -ne "") {
                Write-Host "  Firebase: CONFIGURED" -ForegroundColor Green
                $global:setupComplete.firebase = $true
            } else {
                Write-Host "  Firebase: NOT CONFIGURED" -ForegroundColor Red
                Write-Host "  Action Required: Read FIREBASE_SETUP_GUIDE.md" -ForegroundColor Yellow
                Write-Host "  Quick setup: .\scripts\check-firebase.ps1" -ForegroundColor Cyan
            }
        }
    }
    Write-Host ""
}

# Function: Check ngrok
function Check-Ngrok {
    Write-Host "Step 3: ngrok Backend Setup" -ForegroundColor Yellow
    
    $ngrokExists = $null
    try {
        $ngrokVersion = ngrok version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ngrok: INSTALLED" -ForegroundColor Green
            $global:setupComplete.ngrok = $true
        }
    } catch {
        Write-Host "  ngrok: NOT INSTALLED" -ForegroundColor Red
        Write-Host "  Action Required: Read INSTALL_NGROK.md" -ForegroundColor Yellow
        Write-Host "  Quick download: https://ngrok.com/download" -ForegroundColor Cyan
    }
    Write-Host ""
}

# Function: Check and Install Vercel
function Check-Vercel {
    Write-Host "Step 4: Vercel CLI Setup" -ForegroundColor Yellow
    
    $vercelExists = $null
    try {
        $vercelVersion = vercel --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Vercel CLI: INSTALLED ($vercelVersion)" -ForegroundColor Green
            $global:setupComplete.vercel = $true
            return $true
        }
    } catch {}
    
    Write-Host "  Vercel CLI: NOT INSTALLED" -ForegroundColor Red
    $install = Read-Host "  Install Vercel CLI now? (y/n)"
    
    if ($install -eq 'y') {
        Write-Host "  Installing Vercel CLI..." -ForegroundColor Yellow
        npm install -g vercel
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Vercel CLI installed successfully!" -ForegroundColor Green
            $global:setupComplete.vercel = $true
            return $true
        } else {
            Write-Host "  Installation failed!" -ForegroundColor Red
            return $false
        }
    }
    Write-Host ""
    return $false
}

# Function: Deploy to Vercel
function Deploy-ToVercel {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Vercel Deployment" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "What do you want to deploy?" -ForegroundColor Yellow
    Write-Host "  1. Frontend (React App)" -ForegroundColor White
    Write-Host "  2. Admin Panel" -ForegroundColor White
    Write-Host "  3. Both (Recommended)" -ForegroundColor White
    Write-Host "  4. Skip for now" -ForegroundColor Gray
    Write-Host ""
    
    $choice = Read-Host "Select (1-4)"
    
    switch ($choice) {
        "1" {
            Write-Host ""
            Write-Host "Deploying Frontend..." -ForegroundColor Cyan
            cd frontend
            vercel --prod
            cd ..
            Write-Host ""
            Write-Host "Frontend deployed!" -ForegroundColor Green
        }
        "2" {
            Write-Host ""
            Write-Host "Deploying Admin Panel..." -ForegroundColor Cyan
            cd admin-panel
            vercel --prod
            cd ..
            Write-Host ""
            Write-Host "Admin Panel deployed!" -ForegroundColor Green
        }
        "3" {
            Write-Host ""
            Write-Host "Logging in to Vercel..." -ForegroundColor Yellow
            vercel login
            
            Write-Host ""
            Write-Host "Deploying Frontend..." -ForegroundColor Cyan
            cd frontend
            vercel --prod
            cd ..
            
            Write-Host ""
            Write-Host "Deploying Admin Panel..." -ForegroundColor Cyan
            cd admin-panel
            vercel --prod
            cd ..
            
            Write-Host ""
            Write-Host "Both deployments complete!" -ForegroundColor Green
        }
        "4" {
            Write-Host "Skipping Vercel deployment" -ForegroundColor Gray
        }
        default {
            Write-Host "Invalid option" -ForegroundColor Red
        }
    }
}

# Function: Setup Status Summary
function Show-Summary {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Setup Status Summary" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Component          Status" -ForegroundColor White
    Write-Host "-----------------------------------" -ForegroundColor Gray
    
    if ($global:setupComplete.git) {
        Write-Host "Git Repository     READY" -ForegroundColor Green
    } else {
        Write-Host "Git Repository     PENDING" -ForegroundColor Red
    }
    
    if ($global:setupComplete.firebase) {
        Write-Host "Firebase Config    READY" -ForegroundColor Green
    } else {
        Write-Host "Firebase Config    PENDING" -ForegroundColor Red
    }
    
    if ($global:setupComplete.ngrok) {
        Write-Host "ngrok Backend      READY" -ForegroundColor Green
    } else {
        Write-Host "ngrok Backend      PENDING" -ForegroundColor Red
    }
    
    if ($global:setupComplete.vercel) {
        Write-Host "Vercel CLI         READY" -ForegroundColor Green
    } else {
        Write-Host "Vercel CLI         PENDING" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Function: Next Steps
function Show-NextSteps {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Next Steps" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    $allReady = $global:setupComplete.git -and 
                $global:setupComplete.firebase -and 
                $global:setupComplete.ngrok -and 
                $global:setupComplete.vercel
    
    if ($allReady) {
        Write-Host "All systems ready for deployment!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Quick Actions:" -ForegroundColor Yellow
        Write-Host "  Start servers:   .\scripts\start-all-servers.ps1" -ForegroundColor White
        Write-Host "  Deploy Vercel:   .\scripts\deploy-vercel.ps1" -ForegroundColor White
        Write-Host "  Update ngrok:    .\scripts\update-ngrok-url.ps1 -NgrokUrl YOUR_URL" -ForegroundColor White
    } else {
        Write-Host "Setup incomplete. Please complete these steps:" -ForegroundColor Yellow
        Write-Host ""
        
        if (-not $global:setupComplete.git) {
            Write-Host "  Git: Run this script again and initialize Git" -ForegroundColor White
        }
        if (-not $global:setupComplete.firebase) {
            Write-Host "  Firebase: Read FIREBASE_SETUP_GUIDE.md" -ForegroundColor White
            Write-Host "            Run: .\scripts\check-firebase.ps1" -ForegroundColor Cyan
        }
        if (-not $global:setupComplete.ngrok) {
            Write-Host "  ngrok: Read INSTALL_NGROK.md" -ForegroundColor White
            Write-Host "         Download: https://ngrok.com/download" -ForegroundColor Cyan
        }
        if (-not $global:setupComplete.vercel) {
            Write-Host "  Vercel: Run this script again to install" -ForegroundColor White
        }
    }
    
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Yellow
    Write-Host "  Complete Guide:  LIVE_TESTING_SETUP_GUIDE.md" -ForegroundColor White
    Write-Host "  Quick Start:     QUICK_TESTING_GUIDE.md" -ForegroundColor White
    Write-Host ""
}

# Main Execution
Check-Git
Check-Firebase
Check-Ngrok

$vercelReady = Check-Vercel

if ($vercelReady) {
    $deploy = Read-Host "Start Vercel deployment now? (y/n)"
    if ($deploy -eq 'y') {
        Deploy-ToVercel
    }
}

Show-Summary
Show-NextSteps

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup script completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
