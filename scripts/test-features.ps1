# Feature Testing Script
# Comprehensive automated testing for all features

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Feature Testing System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$testResults = @()
$testStartTime = Get-Date

# Configuration
$baseUrl = "http://localhost:3000"
$apiUrl = "http://localhost:8000/api"
$adminUrl = "http://localhost:3001"

# Function to test URL
function Test-Feature {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Category,
        [scriptblock]$AdditionalTests = $null
    )
    
    Write-Host "Testing: $Name..." -NoNewline -ForegroundColor Yellow
    
    $result = @{
        Category = $Category
        Feature = $Name
        Url = $Url
        Status = "Unknown"
        Message = ""
        Timestamp = Get-Date
    }
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $result.Status = "PASS"
            $result.Message = "OK (HTTP 200)"
            Write-Host " ✓ PASS" -ForegroundColor Green
            
            # Run additional tests if provided
            if ($AdditionalTests) {
                & $AdditionalTests $response
            }
        } else {
            $result.Status = "WARNING"
            $result.Message = "HTTP $($response.StatusCode)"
            Write-Host " ⚠ WARNING" -ForegroundColor Yellow
        }
    } catch {
        $result.Status = "FAIL"
        $result.Message = $_.Exception.Message
        Write-Host " ✗ FAIL" -ForegroundColor Red
    }
    
    return $result
}

# Check if servers are running
Write-Host "Checking server status..." -ForegroundColor Cyan
Write-Host ""

$backendRunning = Test-NetConnection -ComputerName localhost -Port 8000 -InformationLevel Quiet -WarningAction SilentlyContinue
$frontendRunning = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
$adminRunning = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue

Write-Host "Backend (8000):  $(if($backendRunning){'✓ RUNNING'}else{'✗ STOPPED'})" -ForegroundColor $(if($backendRunning){'Green'}else{'Red'})
Write-Host "Frontend (3000): $(if($frontendRunning){'✓ RUNNING'}else{'✗ STOPPED'})" -ForegroundColor $(if($frontendRunning){'Green'}else{'Red'})
Write-Host "Admin (3001):    $(if($adminRunning){'✓ RUNNING'}else{'✗ STOPPED'})" -ForegroundColor $(if($adminRunning){'Green'}else{'Red'})
Write-Host ""

if (-not $backendRunning -or -not $frontendRunning) {
    Write-Host "⚠️  Servers not running!" -ForegroundColor Yellow
    Write-Host "Start servers: .\scripts\start-all-servers.ps1" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Continue testing anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 0
    }
    Write-Host ""
}

# Test Categories
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Features" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Backend API Tests
Write-Host "Backend API Tests:" -ForegroundColor Cyan
$testResults += Test-Feature "API Health Check" "$apiUrl/health" "Backend API"
$testResults += Test-Feature "Auth Endpoint" "$apiUrl/auth" "Backend API"
$testResults += Test-Feature "Users Endpoint" "$apiUrl/users" "Backend API"
$testResults += Test-Feature "Posts Endpoint" "$apiUrl/posts" "Backend API"
$testResults += Test-Feature "Messages Endpoint" "$apiUrl/messages" "Backend API"
$testResults += Test-Feature "Wallet Endpoint" "$apiUrl/wallet" "Backend API"
Write-Host ""

# 2. Frontend Tests
Write-Host "Frontend Application Tests:" -ForegroundColor Cyan
$testResults += Test-Feature "Homepage" "$baseUrl/" "Frontend"
$testResults += Test-Feature "Login Page" "$baseUrl/login" "Frontend"
$testResults += Test-Feature "Register Page" "$baseUrl/register" "Frontend"
$testResults += Test-Feature "Profile Page" "$baseUrl/profile" "Frontend"
$testResults += Test-Feature "Messenger Page" "$baseUrl/messenger" "Frontend"
$testResults += Test-Feature "Wallet Page" "$baseUrl/wallet" "Frontend"
$testResults += Test-Feature "Games Page" "$baseUrl/games" "Frontend"
$testResults += Test-Feature "Settings Page" "$baseUrl/settings" "Frontend"
Write-Host ""

# 3. Admin Panel Tests
if ($adminRunning) {
    Write-Host "Admin Panel Tests:" -ForegroundColor Cyan
    $testResults += Test-Feature "Admin Login" "$adminUrl/admin/login" "Admin Panel"
    $testResults += Test-Feature "Admin Dashboard" "$adminUrl/admin/dashboard" "Admin Panel"
    $testResults += Test-Feature "User Management" "$adminUrl/admin/users" "Admin Panel"
    $testResults += Test-Feature "Wallet Management" "$adminUrl/admin/wallet" "Admin Panel"
    Write-Host ""
}

# Generate Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object {$_.Status -eq "PASS"}).Count
$failedTests = ($testResults | Where-Object {$_.Status -eq "FAIL"}).Count
$warningTests = ($testResults | Where-Object {$_.Status -eq "WARNING"}).Count

$passRate = if($totalTests -gt 0) {[math]::Round(($passedTests / $totalTests) * 100, 2)} else {0}

Write-Host "Total Tests:    $totalTests" -ForegroundColor White
Write-Host "Passed:         $passedTests" -ForegroundColor Green
Write-Host "Failed:         $failedTests" -ForegroundColor $(if($failedTests -gt 0){'Red'}else{'Green'})
Write-Host "Warnings:       $warningTests" -ForegroundColor $(if($warningTests -gt 0){'Yellow'}else{'Green'})
Write-Host "Pass Rate:      $passRate%" -ForegroundColor $(if($passRate -ge 80){'Green'}elseif($passRate -ge 60){'Yellow'}else{'Red'})
Write-Host ""

# Show failed tests
if ($failedTests -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    $testResults | Where-Object {$_.Status -eq "FAIL"} | ForEach-Object {
        Write-Host "  ✗ $($_.Category) - $($_.Feature)" -ForegroundColor Red
        Write-Host "    URL: $($_.Url)" -ForegroundColor Gray
        Write-Host "    Error: $($_.Message)" -ForegroundColor Gray
    }
    Write-Host ""
}

# Generate Report
$testEndTime = Get-Date
$duration = $testEndTime - $testStartTime

$reportPath = "test-reports\feature-test-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$htmlReportPath = "test-reports\feature-test-$(Get-Date -Format 'yyyyMMdd-HHmmss').html"

# Create reports directory
New-Item -Path "test-reports" -ItemType Directory -Force | Out-Null

# Save JSON report
$report = @{
    TestRun = @{
        StartTime = $testStartTime
        EndTime = $testEndTime
        Duration = $duration.TotalSeconds
    }
    Summary = @{
        Total = $totalTests
        Passed = $passedTests
        Failed = $failedTests
        Warnings = $warningTests
        PassRate = $passRate
    }
    Results = $testResults
}

$report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "Reports Generated:" -ForegroundColor Cyan
Write-Host "  JSON: $reportPath" -ForegroundColor White
Write-Host ""

# Generate HTML Report
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>Feature Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #4F46E5; padding-bottom: 10px; }
        h2 { color: #4F46E5; margin-top: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-card.pass { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .stat-card.fail { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); }
        .stat-card.warn { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .stat-number { font-size: 48px; font-weight: bold; margin: 10px 0; }
        .stat-label { font-size: 14px; opacity: 0.9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #4F46E5; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f9f9f9; }
        .status-pass { color: #10b981; font-weight: bold; }
        .status-fail { color: #ef4444; font-weight: bold; }
        .status-warn { color: #f59e0b; font-weight: bold; }
        .timestamp { color: #666; font-size: 12px; }
        .category { background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Feature Test Report</h1>
        <p class="timestamp">Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</p>
        <p class="timestamp">Duration: $([math]::Round($duration.TotalSeconds, 2)) seconds</p>
        
        <h2>Summary</h2>
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">$totalTests</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card pass">
                <div class="stat-number">$passedTests</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card fail">
                <div class="stat-number">$failedTests</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card warn">
                <div class="stat-number">$warningTests</div>
                <div class="stat-label">Warnings</div>
            </div>
        </div>
        
        <h2>Test Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Feature</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>URL</th>
                </tr>
            </thead>
            <tbody>
"@

foreach ($result in $testResults) {
    $statusClass = switch ($result.Status) {
        "PASS" { "status-pass" }
        "FAIL" { "status-fail" }
        "WARNING" { "status-warn" }
        default { "" }
    }
    
    $htmlContent += @"
                <tr>
                    <td><span class="category">$($result.Category)</span></td>
                    <td>$($result.Feature)</td>
                    <td class="$statusClass">$($result.Status)</td>
                    <td>$($result.Message)</td>
                    <td><a href="$($result.Url)" target="_blank">$($result.Url)</a></td>
                </tr>
"@
}

$htmlContent += @"
            </tbody>
        </table>
    </div>
</body>
</html>
"@

$htmlContent | Out-File -FilePath $htmlReportPath -Encoding UTF8

Write-Host "  HTML: $htmlReportPath" -ForegroundColor White
Write-Host ""

# Open HTML report
$openReport = Read-Host "Open HTML report in browser? (y/n)"
if ($openReport -eq 'y') {
    Start-Process $htmlReportPath
}

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor Green
Write-Host ""
