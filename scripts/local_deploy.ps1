<#
Builds the frontend, copies the build into backend static folder,
restarts any running uvicorn instance, and launches a new uvicorn
process in a new PowerShell window.

Usage: Run this from anywhere in the workspace:
  powershell -ExecutionPolicy Bypass -File .\scripts\local_deploy.ps1
#>

Set-StrictMode -Version Latest

Write-Host "Starting local deploy: build frontend -> copy -> start backend" -ForegroundColor Cyan

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Run-FrontendBuild {
    Write-Host "Building frontend..." -ForegroundColor Yellow
    Push-Location -Path (Join-Path $scriptRoot '..\frontend')
    try {
        $env:NODE_OPTIONS = '--localstorage-file=.localstorage'
        npm run build
    } finally {
        Pop-Location
    }
}

function Copy-BuildToBackend {
    Write-Host "Copying build to backend static folder..." -ForegroundColor Yellow
    $src = Join-Path $scriptRoot '..\frontend\build'
    $dest = Join-Path $scriptRoot '..\backend\messenger_api\static'
    if (-Not (Test-Path $src)) { throw "Build folder not found: $src" }
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    # Use robocopy for robust copy
    robocopy $src $dest /MIR | Out-Null
}

function Restart-Uvicorn {
    Write-Host "Stopping existing uvicorn/python processes (if any)..." -ForegroundColor Yellow
    $procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'uvicorn' -or $_.CommandLine -match 'python.*uvicorn' }
    foreach ($p in $procs) {
        try {
            Write-Host "Stopping PID $($p.ProcessId) (Cmd: $($p.CommandLine))"
            Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Warning "Could not stop PID $($p.ProcessId): $_"
        }
    }

    Write-Host "Starting uvicorn in a new PowerShell window..." -ForegroundColor Yellow
    $backendDir = Join-Path $scriptRoot '..\backend\messenger_api'
    $pythonExe = Join-Path $backendDir '.venv\Scripts\python.exe'
    if (-Not (Test-Path $pythonExe)) { Write-Warning "Python executable not found at $pythonExe. Make sure .venv exists." }
    $cmd = "& '$pythonExe' -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
    Start-Process powershell -ArgumentList '-NoExit','-Command',"cd `"$backendDir`"; $cmd" -WorkingDirectory $backendDir
}

try {
    Run-FrontendBuild
    Copy-BuildToBackend
    Restart-Uvicorn
    Write-Host "Local deploy finished. Visit http://127.0.0.1:8000" -ForegroundColor Green
} catch {
    Write-Error "Local deploy failed: $_"
    exit 1
}
