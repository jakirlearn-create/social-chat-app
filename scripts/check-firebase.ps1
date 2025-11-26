# Firebase Configuration Check

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firebase Configuration Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envPath = "frontend\.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    
    if ($envContent -match "REACT_APP_FIREBASE_API_KEY=(.+)") {
        $apiKeyValue = $matches[1].Trim()
        
        if ($apiKeyValue -eq "your_firebase_api_key" -or $apiKeyValue -eq "") {
            Write-Host "Status: NOT configured" -ForegroundColor Red
            Write-Host ""
            Write-Host "Setup Instructions:" -ForegroundColor Yellow
            Write-Host "1. Create Firebase project at https://console.firebase.google.com/" -ForegroundColor White
            Write-Host "2. Add Web App and get configuration" -ForegroundColor White
            Write-Host "3. Update frontend\.env file with your Firebase keys" -ForegroundColor White
            Write-Host "4. Read: FIREBASE_SETUP_GUIDE.md" -ForegroundColor White
        } else {
            Write-Host "Status: CONFIGURED" -ForegroundColor Green
            $maskedKey = $apiKeyValue.Substring(0, 10) + "..."
            Write-Host "API Key: $maskedKey" -ForegroundColor Gray
            
            if ($envContent -match "REACT_APP_FIREBASE_PROJECT_ID=(.+)") {
                $projectId = $matches[1].Trim()
                Write-Host "Project ID: $projectId" -ForegroundColor Gray
            }
        }
    }
} else {
    Write-Host "ERROR: .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Full guide: FIREBASE_SETUP_GUIDE.md" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
