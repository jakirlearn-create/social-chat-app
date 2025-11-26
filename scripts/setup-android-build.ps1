# Android Build Setup Script
# Automated Capacitor and Android platform setup

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android Build Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  Node.js: NOT INSTALLED" -ForegroundColor Red
    Write-Host "  Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Java
$javaVersion = java -version 2>&1 | Select-String "version" | Select-Object -First 1
if ($javaVersion) {
    Write-Host "  Java: $javaVersion" -ForegroundColor Green
} else {
    Write-Host "  Java: NOT INSTALLED" -ForegroundColor Red
    Write-Host "  Download JDK 17: https://adoptium.net/" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "Continue without Java? (y/n)"
    if ($install -ne 'y') { exit 1 }
}

# Check Android SDK
if ($env:ANDROID_HOME) {
    Write-Host "  Android SDK: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "  Android SDK: NOT CONFIGURED" -ForegroundColor Yellow
    Write-Host "  Set ANDROID_HOME after installing Android Studio" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Capacitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd frontend

# Check if Capacitor is already installed
$capConfig = Test-Path "capacitor.config.json"
if ($capConfig) {
    Write-Host "Capacitor already initialized!" -ForegroundColor Green
    Write-Host ""
    $reinstall = Read-Host "Reinstall Capacitor? (y/n)"
    if ($reinstall -ne 'y') {
        cd ..
        Write-Host "Setup cancelled." -ForegroundColor Gray
        exit 0
    }
}

# Install Capacitor packages
Write-Host "Installing Capacitor packages..." -ForegroundColor Yellow
npm install @capacitor/core @capacitor/cli

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install Capacitor!" -ForegroundColor Red
    cd ..
    exit 1
}

npm install @capacitor/android

Write-Host ""
Write-Host "Capacitor installed successfully!" -ForegroundColor Green
Write-Host ""

# Initialize Capacitor
if (-not $capConfig) {
    Write-Host "Initializing Capacitor..." -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "App Configuration:" -ForegroundColor Cyan
    $appName = Read-Host "App Name (default: Social Chat)"
    if (-not $appName) { $appName = "Social Chat" }
    
    $appId = Read-Host "App ID (default: com.socialchat.app)"
    if (-not $appId) { $appId = "com.socialchat.app" }
    
    Write-Host ""
    Write-Host "Initializing with:" -ForegroundColor Yellow
    Write-Host "  Name: $appName" -ForegroundColor White
    Write-Host "  ID: $appId" -ForegroundColor White
    Write-Host ""
    
    npx cap init "$appName" "$appId" --web-dir=build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Capacitor initialized!" -ForegroundColor Green
    } else {
        Write-Host "Failed to initialize Capacitor!" -ForegroundColor Red
        cd ..
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building React App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    cd ..
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Add Android platform
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Adding Android Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$androidExists = Test-Path "android"
if ($androidExists) {
    Write-Host "Android platform already exists!" -ForegroundColor Yellow
    $readd = Read-Host "Remove and re-add? (y/n)"
    if ($readd -eq 'y') {
        Write-Host "Removing existing Android platform..." -ForegroundColor Yellow
        Remove-Item -Path "android" -Recurse -Force
    } else {
        Write-Host "Skipping Android platform addition." -ForegroundColor Gray
    }
}

if (-not (Test-Path "android")) {
    Write-Host "Adding Android platform..." -ForegroundColor Yellow
    npx cap add android
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Android platform added!" -ForegroundColor Green
    } else {
        Write-Host "Failed to add Android platform!" -ForegroundColor Red
        cd ..
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Syncing Assets" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Syncing web assets to Android..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -eq 0) {
    Write-Host "Sync successful!" -ForegroundColor Green
} else {
    Write-Host "Sync had errors, but may be okay." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Project Structure:" -ForegroundColor Cyan
Write-Host "  frontend/" -ForegroundColor White
Write-Host "    ├── capacitor.config.json" -ForegroundColor Gray
Write-Host "    ├── android/" -ForegroundColor Gray
Write-Host "    │   └── (Android Studio project)" -ForegroundColor Gray
Write-Host "    └── build/" -ForegroundColor Gray
Write-Host "        └── (React production build)" -ForegroundColor Gray
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Build with Android Studio (GUI)" -ForegroundColor Cyan
Write-Host "  Command: npx cap open android" -ForegroundColor White
Write-Host "  Then: Build → Generate Signed Bundle/APK" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 2: Build with Gradle (Command Line)" -ForegroundColor Cyan
Write-Host "  cd frontend/android" -ForegroundColor White
Write-Host "  .\gradlew assembleDebug     # Debug APK" -ForegroundColor Gray
Write-Host "  .\gradlew assembleRelease   # Release APK" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 3: Automated Build" -ForegroundColor Cyan
Write-Host "  .\scripts\build-android-apk.ps1" -ForegroundColor White
Write-Host ""

Write-Host "APK Output Locations:" -ForegroundColor Yellow
Write-Host "  Debug:   frontend/android/app/build/outputs/apk/debug/" -ForegroundColor Gray
Write-Host "  Release: frontend/android/app/build/outputs/apk/release/" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  Complete Guide: ANDROID_BUILD_GUIDE.md" -ForegroundColor White
Write-Host ""

cd ..

# Offer to open Android Studio
Write-Host "Open in Android Studio now? (y/n): " -ForegroundColor Cyan -NoNewline
$open = Read-Host
if ($open -eq 'y') {
    Write-Host ""
    Write-Host "Opening Android Studio..." -ForegroundColor Yellow
    cd frontend
    npx cap open android
    cd ..
}

Write-Host ""
Write-Host "Setup script completed!" -ForegroundColor Green
Write-Host ""
