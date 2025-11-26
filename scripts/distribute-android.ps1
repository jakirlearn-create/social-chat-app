# Firebase App Distribution Script
# Upload APK to Firebase for testing

param(
    [string]$ApkPath = "",
    [string]$ReleaseNotes = "New build",
    [string]$Testers = "",
    [string]$Groups = "testers"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firebase App Distribution" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
$firebaseInstalled = $null
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Firebase CLI: $firebaseVersion" -ForegroundColor Green
    }
} catch {
    $firebaseInstalled = $false
}

if (-not $firebaseInstalled -and $LASTEXITCODE -ne 0) {
    Write-Host "Firebase CLI not installed!" -ForegroundColor Red
    Write-Host ""
    $install = Read-Host "Install Firebase CLI now? (y/n)"
    
    if ($install -eq 'y') {
        Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
        npm install -g firebase-tools
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Firebase CLI installed!" -ForegroundColor Green
        } else {
            Write-Host "Installation failed!" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Cannot continue without Firebase CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check if logged in
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow
$authCheck = firebase projects:list 2>&1

if ($authCheck -like "*not authenticated*" -or $authCheck -like "*login*") {
    Write-Host "Not logged in to Firebase" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Logging in..." -ForegroundColor Cyan
    firebase login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Login failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Authenticated!" -ForegroundColor Green
Write-Host ""

# Find APK if not specified
if (-not $ApkPath) {
    Write-Host "Searching for APK files..." -ForegroundColor Yellow
    
    $apkFiles = Get-ChildItem -Path "builds" -Filter "*.apk" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending
    
    if ($apkFiles) {
        Write-Host ""
        Write-Host "Available APK files:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $apkFiles.Count; $i++) {
            $apk = $apkFiles[$i]
            $size = "{0:N2} MB" -f ($apk.Length / 1MB)
            $time = $apk.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
            Write-Host "  [$i] $($apk.Name) ($size) - $time" -ForegroundColor White
        }
        Write-Host ""
        
        $selection = Read-Host "Select APK number (or Enter for latest)"
        
        if ($selection -eq "") {
            $ApkPath = $apkFiles[0].FullName
        } elseif ($selection -match '^\d+$' -and [int]$selection -lt $apkFiles.Count) {
            $ApkPath = $apkFiles[[int]$selection].FullName
        } else {
            Write-Host "Invalid selection!" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "No APK files found in builds/" -ForegroundColor Red
        Write-Host "Build APK first: .\scripts\build-android-apk.ps1" -ForegroundColor Yellow
        exit 1
    }
}

# Verify APK exists
if (-not (Test-Path $ApkPath)) {
    Write-Host "APK not found: $ApkPath" -ForegroundColor Red
    exit 1
}

$apkFile = Get-Item $ApkPath
$apkSize = "{0:N2} MB" -f ($apkFile.Length / 1MB)

Write-Host "Selected APK:" -ForegroundColor Cyan
Write-Host "  File: $($apkFile.Name)" -ForegroundColor White
Write-Host "  Size: $apkSize" -ForegroundColor White
Write-Host "  Path: $ApkPath" -ForegroundColor Gray
Write-Host ""

# Get Firebase App ID
Write-Host "Firebase Configuration:" -ForegroundColor Cyan
Write-Host ""

$firebaseConfig = "frontend\.firebaserc"
$appId = ""

if (Test-Path $firebaseConfig) {
    $config = Get-Content $firebaseConfig | ConvertFrom-Json
    Write-Host "Project found: $($config.projects.default)" -ForegroundColor Green
} else {
    Write-Host "Firebase project not initialized" -ForegroundColor Yellow
    Write-Host ""
    $init = Read-Host "Initialize Firebase project? (y/n)"
    
    if ($init -eq 'y') {
        Write-Host "Running firebase init..." -ForegroundColor Yellow
        firebase init
    }
}

Write-Host ""
Write-Host "Get Firebase App ID:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://console.firebase.google.com/" -ForegroundColor Gray
Write-Host "  2. Select your project" -ForegroundColor Gray
Write-Host "  3. Project Settings → General → Your apps" -ForegroundColor Gray
Write-Host "  4. Find Android app or add new one" -ForegroundColor Gray
Write-Host "  5. Copy App ID (looks like: 1:123456:android:abc123)" -ForegroundColor Gray
Write-Host ""

$appId = Read-Host "Firebase App ID"

if (-not $appId) {
    Write-Host "App ID required!" -ForegroundColor Red
    exit 1
}

# Get release notes if not provided
if (-not $ReleaseNotes -or $ReleaseNotes -eq "New build") {
    Write-Host ""
    Write-Host "Release Notes (optional, press Enter to skip):" -ForegroundColor Cyan
    $customNotes = Read-Host
    if ($customNotes) {
        $ReleaseNotes = $customNotes
    }
}

# Get testers/groups if not provided
if (-not $Testers -and -not $Groups) {
    Write-Host ""
    Write-Host "Distribution (choose one):" -ForegroundColor Cyan
    Write-Host "  1. Enter tester emails (comma-separated)" -ForegroundColor White
    Write-Host "  2. Use tester groups (recommended)" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Choice (1 or 2, default: 2)"
    
    if ($choice -eq "1") {
        $Testers = Read-Host "Tester emails"
    } else {
        Write-Host ""
        Write-Host "Common groups: testers, beta-testers, qa-team" -ForegroundColor Gray
        $Groups = Read-Host "Group name (default: testers)"
        if (-not $Groups) { $Groups = "testers" }
    }
}

# Build command
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Uploading to Firebase" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Upload Details:" -ForegroundColor Yellow
Write-Host "  APK: $($apkFile.Name)" -ForegroundColor White
Write-Host "  App ID: $appId" -ForegroundColor White
Write-Host "  Release Notes: $ReleaseNotes" -ForegroundColor White
if ($Testers) {
    Write-Host "  Testers: $Testers" -ForegroundColor White
}
if ($Groups) {
    Write-Host "  Groups: $Groups" -ForegroundColor White
}
Write-Host ""

$confirm = Read-Host "Proceed with upload? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Upload cancelled." -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "Uploading..." -ForegroundColor Yellow

# Build Firebase command
$firebaseCmd = "firebase appdistribution:distribute `"$ApkPath`" --app `"$appId`" --release-notes `"$ReleaseNotes`""

if ($Testers) {
    $firebaseCmd += " --testers `"$Testers`""
}
if ($Groups) {
    $firebaseCmd += " --groups `"$Groups`""
}

# Execute
Invoke-Expression $firebaseCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Upload Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "APK uploaded to Firebase App Distribution!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testers will receive email notification with download link." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "View distribution:" -ForegroundColor Yellow
    Write-Host "  https://console.firebase.google.com/project/_/appdistribution" -ForegroundColor White
    Write-Host ""
    
    # Save distribution log
    $logEntry = @"
Firebase App Distribution Log
==============================

Upload Time: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
APK: $($apkFile.Name)
Size: $apkSize
App ID: $appId
Release Notes: $ReleaseNotes
Testers: $Testers
Groups: $Groups

Status: SUCCESS
"@
    
    $logFile = "builds\distribution-log-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
    $logEntry | Out-File -FilePath $logFile -Encoding UTF8
    
    Write-Host "Distribution log: $logFile" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Upload failed!" -ForegroundColor Red
    Write-Host "Check error messages above" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  • App ID incorrect (check Firebase Console)" -ForegroundColor Gray
    Write-Host "  • App Distribution not enabled in Firebase" -ForegroundColor Gray
    Write-Host "  • Tester emails not added in Firebase Console" -ForegroundColor Gray
    Write-Host "  • APK file corrupted or too large" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "Distribution complete!" -ForegroundColor Green
Write-Host ""
