# Update ngrok URL Script
param(
    [Parameter(Mandatory=$true)]
    [string]$NgrokUrl
)

Write-Host "`n🔄 Updating API URLs with ngrok..." -ForegroundColor Cyan
Write-Host "New URL: $NgrokUrl`n" -ForegroundColor Yellow

# Remove trailing slash if exists
$NgrokUrl = $NgrokUrl.TrimEnd('/')

# Function to update file
function Update-ApiUrl {
    param($FilePath, $Pattern, $Replacement)
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        $newContent = $content -replace $Pattern, $Replacement
        Set-Content $FilePath $newContent -NoNewline
        Write-Host "✅ Updated: $FilePath" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $FilePath" -ForegroundColor Yellow
    }
}

# Update Frontend API config
Write-Host "📱 Updating Frontend..." -ForegroundColor Cyan
Update-ApiUrl `
    -FilePath "frontend\src\config\api.js" `
    -Pattern "const API_BASE_URL = [^;]+;" `
    -Replacement "const API_BASE_URL = '$NgrokUrl';"

# Update Frontend .env if exists
if (Test-Path "frontend\.env") {
    $envContent = Get-Content "frontend\.env"
    $newEnvContent = $envContent -replace "REACT_APP_BACKEND_URL=.*", "REACT_APP_BACKEND_URL=$NgrokUrl"
    Set-Content "frontend\.env" $newEnvContent
    Write-Host "✅ Updated: frontend\.env" -ForegroundColor Green
}

# Update Admin Panel if has API config
Write-Host "`n👔 Checking Admin Panel..." -ForegroundColor Cyan
$adminApiPath = "admin-panel\src\config\api.js"
if (Test-Path $adminApiPath) {
    Update-ApiUrl `
        -FilePath $adminApiPath `
        -Pattern "const API_BASE_URL = [^;]+;" `
        -Replacement "const API_BASE_URL = '$NgrokUrl';"
}

# Check admin-panel service
$adminServicePath = "admin-panel\src\services\authService.js"
if (Test-Path $adminServicePath) {
    $serviceContent = Get-Content $adminServicePath -Raw
    if ($serviceContent -match "localhost:8000" -or $serviceContent -match "http://localhost:5000") {
        Write-Host "⚠️  Admin Panel service file contains hardcoded URLs" -ForegroundColor Yellow
        Write-Host "   File: $adminServicePath" -ForegroundColor Gray
        Write-Host "   Please check and update manually if needed" -ForegroundColor Gray
    }
}

Write-Host "`n✅ URL update completed!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test API connection: curl $NgrokUrl/api/health" -ForegroundColor White
Write-Host "   2. Restart frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "   3. Restart admin panel: cd admin-panel && npm start" -ForegroundColor White

Write-Host "`n💡 Tip: ngrok free URLs expire after 2 hours" -ForegroundColor Yellow
Write-Host "   Run this script again with new URL when it expires`n" -ForegroundColor Yellow
