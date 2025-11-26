# 📊 Automated Test Result Tracker
# Logs test results and generates reports

param(
    [string]$TestName = "Manual Test Run",
    [string]$Category = "General",
    [switch]$Success,
    [switch]$Failure,
    [string]$ErrorMessage = "",
    [string]$Details = ""
)

$ErrorActionPreference = "Stop"

# Create test-results directory
$resultsDir = "test-results"
if (-not (Test-Path $resultsDir)) {
    New-Item -ItemType Directory -Path $resultsDir | Out-Null
}

# Get timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Determine status
$status = "UNKNOWN"
$statusIcon = "❓"
if ($Success) {
    $status = "PASS"
    $statusIcon = "✅"
} elseif ($Failure) {
    $status = "FAIL"
    $statusIcon = "❌"
}

# Create test result object
$testResult = @{
    TestName = $TestName
    Category = $Category
    Status = $status
    StatusIcon = $statusIcon
    Timestamp = $date
    ErrorMessage = $ErrorMessage
    Details = $Details
}

# Load existing results or create new
$resultsFile = Join-Path $resultsDir "test-results.json"
$allResults = @()

if (Test-Path $resultsFile) {
    try {
        $content = Get-Content $resultsFile -Raw | ConvertFrom-Json
        $allResults = @($content)
    } catch {
        Write-Warning "Could not load existing results, creating new file"
    }
}

# Add new result
$allResults += $testResult

# Save results
$allResults | ConvertTo-Json -Depth 10 | Set-Content $resultsFile -Encoding UTF8

# Log to individual file
$logFile = Join-Path $resultsDir "test-log-$timestamp.txt"
$logContent = @"
========================================
TEST RESULT LOG
========================================

Test Name:    $TestName
Category:     $Category
Status:       $status $statusIcon
Date/Time:    $date

$(if ($ErrorMessage) { "Error Message:`n$ErrorMessage`n" })
$(if ($Details) { "Details:`n$Details`n" })
========================================
"@

$logContent | Set-Content $logFile -Encoding UTF8

# Display result
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST RESULT LOGGED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test:     " -NoNewline; Write-Host $TestName -ForegroundColor White
Write-Host "Category: " -NoNewline; Write-Host $Category -ForegroundColor White
Write-Host "Status:   " -NoNewline
if ($status -eq "PASS") {
    Write-Host "$statusIcon $status" -ForegroundColor Green
} elseif ($status -eq "FAIL") {
    Write-Host "$statusIcon $status" -ForegroundColor Red
} else {
    Write-Host "$statusIcon $status" -ForegroundColor Yellow
}
Write-Host "Time:     " -NoNewline; Write-Host $date -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

# Generate summary report
function Generate-SummaryReport {
    $allResults = Get-Content $resultsFile -Raw | ConvertFrom-Json
    
    $total = $allResults.Count
    $passed = ($allResults | Where-Object { $_.Status -eq "PASS" }).Count
    $failed = ($allResults | Where-Object { $_.Status -eq "FAIL" }).Count
    $unknown = $total - $passed - $failed
    
    $passRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 2) } else { 0 }
    
    # Generate text summary
    $summaryFile = Join-Path $resultsDir "test-summary.txt"
    $summaryContent = @"
========================================
TEST SUMMARY REPORT
========================================
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

STATISTICS
----------------------------------------
Total Tests:      $total
✅ Passed:        $passed
❌ Failed:        $failed
❓ Unknown:       $unknown
Pass Rate:        $passRate%

RECENT TESTS (Last 10)
----------------------------------------
$($allResults | Select-Object -Last 10 | ForEach-Object {
    "$($_.StatusIcon) [$($_.Category)] $($_.TestName) - $($_.Timestamp)"
} | Out-String)

FAILED TESTS
----------------------------------------
$($allResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
    "❌ [$($_.Category)] $($_.TestName)`n   Error: $($_.ErrorMessage)`n   Time: $($_.Timestamp)`n"
} | Out-String)

========================================
"@
    
    $summaryContent | Set-Content $summaryFile -Encoding UTF8
    
    # Generate HTML report
    $htmlFile = Join-Path $resultsDir "test-summary.html"
    $htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Summary Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .stat-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .stat-card .label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .stat-card.total .number { color: #667eea; }
        .stat-card.passed .number { color: #10b981; }
        .stat-card.failed .number { color: #ef4444; }
        .stat-card.rate .number { color: #f59e0b; }
        .section {
            padding: 30px;
        }
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        .test-list {
            list-style: none;
        }
        .test-item {
            background: #f8f9fa;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid #ddd;
            transition: all 0.3s;
        }
        .test-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
        }
        .test-item.pass { border-left-color: #10b981; }
        .test-item.fail { border-left-color: #ef4444; }
        .test-item .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .test-item .test-name {
            font-weight: bold;
            color: #333;
        }
        .test-item .test-status {
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .test-status.pass {
            background: #d1fae5;
            color: #065f46;
        }
        .test-status.fail {
            background: #fee2e2;
            color: #991b1b;
        }
        .test-item .test-details {
            color: #666;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .test-item .test-category {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 3px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            margin-right: 10px;
        }
        .test-item .test-time {
            color: #999;
            font-size: 0.85em;
        }
        .test-item .test-error {
            background: #fee2e2;
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
            color: #991b1b;
            font-size: 0.9em;
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Test Summary Report</h1>
            <p>Generated: $(Get-Date -Format "MMMM dd, yyyy HH:mm:ss")</p>
        </div>
        
        <div class="stats">
            <div class="stat-card total">
                <div class="label">Total Tests</div>
                <div class="number">$total</div>
            </div>
            <div class="stat-card passed">
                <div class="label">Passed</div>
                <div class="number">$passed</div>
            </div>
            <div class="stat-card failed">
                <div class="label">Failed</div>
                <div class="number">$failed</div>
            </div>
            <div class="stat-card rate">
                <div class="label">Pass Rate</div>
                <div class="number">$passRate%</div>
            </div>
        </div>
        
        <div class="section">
            <h2>Recent Tests (Last 20)</h2>
            $(if ($total -gt 0) {
                "<ul class='test-list'>"
                $allResults | Select-Object -Last 20 | Sort-Object { [DateTime]$_.Timestamp } -Descending | ForEach-Object {
                    $statusClass = $_.Status.ToLower()
                    @"
                    <li class='test-item $statusClass'>
                        <div class='test-header'>
                            <div class='test-name'>$($_.StatusIcon) $($_.TestName)</div>
                            <span class='test-status $statusClass'>$($_.Status)</span>
                        </div>
                        <div class='test-details'>
                            <span class='test-category'>$($_.Category)</span>
                            <span class='test-time'>$($_.Timestamp)</span>
                        </div>
                        $(if ($_.ErrorMessage) { "<div class='test-error'><strong>Error:</strong> $($_.ErrorMessage)</div>" })
                        $(if ($_.Details) { "<div class='test-error'><strong>Details:</strong> $($_.Details)</div>" })
                    </li>
"@
                } | Out-String
                "</ul>"
            } else {
                "<div class='empty-state'>No test results yet. Run some tests to see results here.</div>"
            })}
        </div>
        
        $(if ($failed -gt 0) {
            @"
            <div class='section'>
                <h2>Failed Tests</h2>
                <ul class='test-list'>
                $(($allResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
                    @"
                    <li class='test-item fail'>
                        <div class='test-header'>
                            <div class='test-name'>$($_.StatusIcon) $($_.TestName)</div>
                            <span class='test-status fail'>FAILED</span>
                        </div>
                        <div class='test-details'>
                            <span class='test-category'>$($_.Category)</span>
                            <span class='test-time'>$($_.Timestamp)</span>
                        </div>
                        $(if ($_.ErrorMessage) { "<div class='test-error'><strong>Error:</strong> $($_.ErrorMessage)</div>" })
                        $(if ($_.Details) { "<div class='test-error'><strong>Details:</strong> $($_.Details)</div>" })
                    </li>
"@
                }) -join "`n")
                </ul>
            </div>
"@
        })
        
        <div class="footer">
            <p>Social Chat App - Automated Test Results</p>
            <p>© 2025 Test Automation System</p>
        </div>
    </div>
</body>
</html>
"@
    
    $htmlContent | Set-Content $htmlFile -Encoding UTF8
    
    Write-Host "`n📊 Summary reports generated:" -ForegroundColor Green
    Write-Host "   - Text: $summaryFile" -ForegroundColor Cyan
    Write-Host "   - HTML: $htmlFile" -ForegroundColor Cyan
    
    # Ask to open HTML report
    $openReport = Read-Host "`nOpen HTML report in browser? (y/n)"
    if ($openReport -eq 'y') {
        Start-Process $htmlFile
    }
}

# Generate summary report
Generate-SummaryReport

Write-Host "`n✅ Test result logged successfully!" -ForegroundColor Green
Write-Host "View all results in: $resultsDir" -ForegroundColor Cyan

# Usage examples
Write-Host "`n📚 Usage Examples:" -ForegroundColor Yellow
Write-Host @"
# Log a successful test
.\scripts\log-test-result.ps1 -TestName "User Login" -Category "Authentication" -Success

# Log a failed test
.\scripts\log-test-result.ps1 -TestName "Payment Processing" -Category "Wallet" -Failure -ErrorMessage "Insufficient balance"

# Log with details
.\scripts\log-test-result.ps1 -TestName "Send Message" -Category "Messenger" -Success -Details "Message sent to 3 users"
"@ -ForegroundColor Gray
