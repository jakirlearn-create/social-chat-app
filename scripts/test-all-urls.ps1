# Interactive URL Testing Dashboard
# Test all URLs and show results

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Live URL Testing Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test URL
function Test-Url {
    param(
        [string]$url,
        [int]$timeout = 5
    )
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec $timeout -UseBasicParsing -ErrorAction Stop
        return @{
            success = $true
            status = $response.StatusCode
            time = $response.ResponseTime
        }
    } catch {
        return @{
            success = $false
            error = $_.Exception.Message
        }
    }
}

# Load URLs from config
$configFile = "testing-urls.json"
if (Test-Path $configFile) {
    $config = Get-Content $configFile | ConvertFrom-Json
} else {
    Write-Host "No URL config found. Run .\scripts\generate-testing-urls.ps1 first" -ForegroundColor Red
    exit 1
}

Write-Host "Testing URLs..." -ForegroundColor Yellow
Write-Host ""

# Test Results
$results = @()

# Test Local URLs
Write-Host "Local URLs:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$localTests = @(
    @{name="Frontend"; url="http://localhost:3000"},
    @{name="Admin Panel"; url="http://localhost:3001"},
    @{name="API Health"; url="http://localhost:8000/api/health"}
)

foreach ($test in $localTests) {
    Write-Host "  Testing $($test.name)..." -NoNewline
    $result = Test-Url -url $test.url -timeout 3
    
    if ($result.success) {
        Write-Host " ✓ OK ($($result.status))" -ForegroundColor Green
    } else {
        Write-Host " ✗ FAIL" -ForegroundColor Red
    }
    
    $results += @{
        category = "Local"
        name = $test.name
        url = $test.url
        success = $result.success
    }
}

Write-Host ""

# Test ngrok URL
if ($config.ngrok.active -and $config.ngrok.url) {
    Write-Host "ngrok URLs:" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    Write-Host "  Testing ngrok API..." -NoNewline
    $result = Test-Url -url "$($config.ngrok.url)/api/health" -timeout 5
    
    if ($result.success) {
        Write-Host " ✓ OK" -ForegroundColor Green
    } else {
        Write-Host " ✗ FAIL" -ForegroundColor Red
    }
    
    $results += @{
        category = "ngrok"
        name = "API"
        url = "$($config.ngrok.url)/api"
        success = $result.success
    }
    
    Write-Host ""
} else {
    Write-Host "ngrok: Not active" -ForegroundColor Gray
    Write-Host ""
}

# Test Vercel URLs
if ($config.vercel.frontend -or $config.vercel.admin) {
    Write-Host "Vercel URLs:" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    if ($config.vercel.frontend) {
        Write-Host "  Testing Frontend..." -NoNewline
        $result = Test-Url -url $config.vercel.frontend -timeout 10
        
        if ($result.success) {
            Write-Host " ✓ OK" -ForegroundColor Green
        } else {
            Write-Host " ✗ FAIL" -ForegroundColor Red
        }
        
        $results += @{
            category = "Vercel"
            name = "Frontend"
            url = $config.vercel.frontend
            success = $result.success
        }
    }
    
    if ($config.vercel.admin) {
        Write-Host "  Testing Admin..." -NoNewline
        $result = Test-Url -url $config.vercel.admin -timeout 10
        
        if ($result.success) {
            Write-Host " ✓ OK" -ForegroundColor Green
        } else {
            Write-Host " ✗ FAIL" -ForegroundColor Red
        }
        
        $results += @{
            category = "Vercel"
            name = "Admin Panel"
            url = $config.vercel.admin
            success = $result.success
        }
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$total = $results.Count
$passed = ($results | Where-Object {$_.success}).Count
$failed = $total - $passed

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if($failed -gt 0){"Red"}else{"Green"})
Write-Host ""

if ($failed -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    $results | Where-Object {-not $_.success} | ForEach-Object {
        Write-Host "  ✗ $($_.category) - $($_.name): $($_.url)" -ForegroundColor Red
    }
    Write-Host ""
}

# Actions
Write-Host "Quick Actions:" -ForegroundColor Yellow
if (-not $config.status.backend -or -not $config.status.frontend) {
    Write-Host "  Start servers: .\scripts\start-all-servers.ps1" -ForegroundColor White
}
Write-Host "  View all URLs: cat LIVE_TESTING_URLS.md" -ForegroundColor White
Write-Host "  Update URLs: .\scripts\generate-testing-urls.ps1" -ForegroundColor White
Write-Host ""
