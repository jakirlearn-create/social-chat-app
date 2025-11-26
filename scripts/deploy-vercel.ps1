# Vercel Deployment Automation Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel Deployment Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow

$vercelInstalled = $null
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $vercelInstalled = $true
        Write-Host "Vercel CLI: INSTALLED ($vercelVersion)" -ForegroundColor Green
    }
} catch {
    $vercelInstalled = $false
}

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI: NOT INSTALLED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
    
    npm install -g vercel
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Vercel CLI installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Options" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Deploy Frontend (React App - Port 3000)" -ForegroundColor White
Write-Host "2. Deploy Admin Panel (Port 3001)" -ForegroundColor White
Write-Host "3. Deploy Both" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select option (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying Frontend to Vercel..." -ForegroundColor Cyan
        Write-Host ""
        
        cd frontend
        
        Write-Host "Step 1: Login to Vercel (browser will open)" -ForegroundColor Yellow
        vercel login
        
        Write-Host ""
        Write-Host "Step 2: Deploying..." -ForegroundColor Yellow
        vercel --prod
        
        Write-Host ""
        Write-Host "Deployment complete!" -ForegroundColor Green
        Write-Host "Your frontend is now live!" -ForegroundColor Green
        
        cd ..
    }
    
    "2" {
        Write-Host ""
        Write-Host "Deploying Admin Panel to Vercel..." -ForegroundColor Cyan
        Write-Host ""
        
        cd admin-panel
        
        Write-Host "Step 1: Login to Vercel" -ForegroundColor Yellow
        vercel login
        
        Write-Host ""
        Write-Host "Step 2: Deploying..." -ForegroundColor Yellow
        vercel --prod
        
        Write-Host ""
        Write-Host "Deployment complete!" -ForegroundColor Green
        Write-Host "Your admin panel is now live!" -ForegroundColor Green
        
        cd ..
    }
    
    "3" {
        Write-Host ""
        Write-Host "Deploying BOTH to Vercel..." -ForegroundColor Cyan
        Write-Host ""
        
        # Login once
        Write-Host "Login to Vercel (browser will open)" -ForegroundColor Yellow
        vercel login
        
        # Deploy Frontend
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Deploying Frontend..." -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Cyan
        cd frontend
        vercel --prod
        cd ..
        
        # Deploy Admin Panel
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Deploying Admin Panel..." -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Cyan
        cd admin-panel
        vercel --prod
        cd ..
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "All deployments complete!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    }
    
    "4" {
        Write-Host "Exiting..." -ForegroundColor Gray
        exit 0
    }
    
    default {
        Write-Host "Invalid option!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy your Vercel deployment URLs" -ForegroundColor White
Write-Host "2. Update API base URL in your frontend" -ForegroundColor White
Write-Host "3. Update ngrok URL for backend API" -ForegroundColor White
Write-Host "4. Test your live application" -ForegroundColor White
Write-Host ""
Write-Host "Check deployment status: https://vercel.com/dashboard" -ForegroundColor Green
Write-Host ""
