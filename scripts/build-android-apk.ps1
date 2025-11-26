# Build Android APK Script
# Complete automated build process

param(
    [string]$BuildType = "debug",  # debug or release
    [string]$OutputName = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Validate build type
if ($BuildType -ne "debug" -and $BuildType -ne "release") {
    Write-Host "Invalid build type: $BuildType" -ForegroundColor Red
    Write-Host "Use: debug or release" -ForegroundColor Yellow
    exit 1
}

Write-Host "Build Type: $BuildType" -ForegroundColor Cyan
Write-Host ""

# Check if Android project exists
if (-not (Test-Path "frontend\android")) {
    Write-Host "Android project not found!" -ForegroundColor Red
    Write-Host "Run setup first: .\scripts\setup-android-build.ps1" -ForegroundColor Yellow
    exit 1
}

# Step 1: Build React App
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Building React App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd frontend

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed!" -ForegroundColor Red
    cd ..
    exit 1
}

Write-Host ""
Write-Host "Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "React build failed!" -ForegroundColor Red
    cd ..
    exit 1
}

Write-Host "React build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Sync with Capacitor
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Syncing with Capacitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Copying web assets to Android..." -ForegroundColor Yellow
npx cap sync android

Write-Host "Sync complete!" -ForegroundColor Green
Write-Host ""

# Step 3: Build APK
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Building APK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd android

if ($BuildType -eq "debug") {
    Write-Host "Building DEBUG APK..." -ForegroundColor Yellow
    .\gradlew assembleDebug
    
    $apkSource = "app\build\outputs\apk\debug\app-debug.apk"
    $buildVariant = "debug"
} else {
    Write-Host "Building RELEASE APK..." -ForegroundColor Yellow
    .\gradlew assembleRelease
    
    $apkSource = "app\build\outputs\apk\release\app-release-unsigned.apk"
    $buildVariant = "release"
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "APK build failed!" -ForegroundColor Red
    Write-Host "Check Gradle output above for errors." -ForegroundColor Yellow
    cd ..\..
    exit 1
}

Write-Host "APK build successful!" -ForegroundColor Green
Write-Host ""

# Step 4: Copy APK to builds folder
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 4: Organizing Output" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

cd ..\..

# Create builds directory
$buildsDir = "builds"
if (-not (Test-Path $buildsDir)) {
    New-Item -Path $buildsDir -ItemType Directory | Out-Null
}

# Get version from package.json
$packageJson = Get-Content "frontend\package.json" | ConvertFrom-Json
$version = $packageJson.version
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Determine output filename
if ($OutputName) {
    $outputFileName = $OutputName
} else {
    $outputFileName = "social-chat-$version-$buildVariant-$timestamp.apk"
}

$outputPath = Join-Path $buildsDir $outputFileName

# Copy APK
Write-Host "Copying APK..." -ForegroundColor Yellow
Copy-Item -Path "frontend\android\$apkSource" -Destination $outputPath -Force

Write-Host "APK copied to: $outputPath" -ForegroundColor Green
Write-Host ""

# Get APK info
$apkSize = (Get-Item $outputPath).Length / 1MB
$apkSizeFormatted = "{0:N2} MB" -f $apkSize

Write-Host "========================================" -ForegroundColor Green
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "APK Details:" -ForegroundColor Cyan
Write-Host "  File: $outputPath" -ForegroundColor White
Write-Host "  Size: $apkSizeFormatted" -ForegroundColor White
Write-Host "  Type: $buildVariant" -ForegroundColor White
Write-Host "  Version: $version" -ForegroundColor White
Write-Host ""

# Show original location too
Write-Host "Original Location:" -ForegroundColor Yellow
Write-Host "  frontend\android\$apkSource" -ForegroundColor Gray
Write-Host ""

# Next steps
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""

if ($BuildType -eq "debug") {
    Write-Host "Install on device:" -ForegroundColor Cyan
    Write-Host "  adb install $outputPath" -ForegroundColor White
    Write-Host ""
    Write-Host "Or drag and drop APK to emulator" -ForegroundColor Gray
} else {
    Write-Host "Release APK built!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "For distribution, you need to SIGN the APK:" -ForegroundColor Yellow
    Write-Host "  1. Generate keystore (if not done):" -ForegroundColor White
    Write-Host "     keytool -genkey -v -keystore social-chat.keystore ..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Sign APK:" -ForegroundColor White
    Write-Host "     Read: ANDROID_BUILD_GUIDE.md (Signing section)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Upload to Firebase App Distribution:" -ForegroundColor White
    Write-Host "     firebase appdistribution:distribute $outputPath ..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Build log saved to: builds\build-log-$timestamp.txt" -ForegroundColor Gray
Write-Host ""

# Save build log
$buildLog = @"
Android APK Build Log
=====================

Build Time: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Build Type: $buildVariant
Version: $version
Output: $outputPath
Size: $apkSizeFormatted

APK Location: $outputPath
Original: frontend\android\$apkSource

Status: SUCCESS
"@

$buildLog | Out-File -FilePath "builds\build-log-$timestamp.txt" -Encoding UTF8

Write-Host "Build script completed successfully!" -ForegroundColor Green
Write-Host ""
