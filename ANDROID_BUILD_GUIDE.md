# 📱 Android Build & Distribution Guide
## Complete Guide for Building Android APK

---

## ⚡ Quick Start

```powershell
# Complete automated setup
.\scripts\setup-android-build.ps1
```

This will:
- ✅ Install Capacitor
- ✅ Configure Android platform
- ✅ Setup build scripts
- ✅ Prepare for APK generation

---

## 📋 Prerequisites

### Required Software

1. **Node.js & npm** (Already installed ✅)
   ```powershell
   node --version  # Should be v14+
   npm --version
   ```

2. **Java Development Kit (JDK)**
   - Download: https://adoptium.net/
   - Version: JDK 11 or 17 (recommended)
   - Set JAVA_HOME environment variable

3. **Android Studio**
   - Download: https://developer.android.com/studio
   - Install Android SDK
   - Install Android SDK Build-Tools
   - Install Android SDK Platform-Tools

4. **Gradle** (Comes with Android Studio)

### Environment Variables Setup

```powershell
# Check Java
java -version

# Set JAVA_HOME (if not set)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x"

# Set Android SDK (if not set)
$env:ANDROID_HOME = "C:\Users\User\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

# Add to PATH
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

---

## 🎯 Method 1: Capacitor (Recommended)

### Step 1: Install Capacitor

```powershell
cd frontend

# Install Capacitor CLI and core
npm install @capacitor/core @capacitor/cli

# Install Android platform
npm install @capacitor/android

# Verify installation
npx cap --version
```

### Step 2: Initialize Capacitor

```powershell
# Initialize Capacitor
npx cap init "Social Chat" "com.socialchat.app"

# This creates:
# - capacitor.config.json
# - android/ folder (after adding platform)
```

### Step 3: Configure Capacitor

Edit `frontend/capacitor.config.json`:

```json
{
  "appId": "com.socialchat.app",
  "appName": "Social Chat",
  "webDir": "build",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#4F46E5"
    }
  }
}
```

### Step 4: Build React App

```powershell
# Build production version
npm run build

# This creates build/ folder
```

### Step 5: Add Android Platform

```powershell
# Add Android platform
npx cap add android

# This creates android/ folder with Android project
```

### Step 6: Sync Web Assets

```powershell
# Copy web assets to Android project
npx cap sync android

# Or just sync
npx cap sync
```

### Step 7: Open in Android Studio

```powershell
# Open Android project in Android Studio
npx cap open android

# This launches Android Studio with your project
```

### Step 8: Build APK in Android Studio

1. **In Android Studio:**
   - Build → Generate Signed Bundle / APK
   - Select "APK"
   - Create new keystore or use existing
   - Choose "release" build variant
   - Click "Finish"

2. **APK Location:**
   ```
   frontend/android/app/build/outputs/apk/release/app-release.apk
   ```

### Step 9: Build from Command Line (Alternative)

```powershell
cd frontend/android

# Build debug APK (quick)
.\gradlew assembleDebug

# Build release APK (unsigned)
.\gradlew assembleRelease

# APK locations:
# Debug: app/build/outputs/apk/debug/app-debug.apk
# Release: app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 🎯 Method 2: Cordova (Alternative)

### Step 1: Install Cordova

```powershell
cd frontend

# Install Cordova globally
npm install -g cordova

# Verify
cordova --version
```

### Step 2: Create Cordova Project

```powershell
# Create new Cordova project
cordova create android-app com.socialchat.app SocialChat

cd android-app

# Add Android platform
cordova platform add android
```

### Step 3: Copy Build Files

```powershell
# Build React app first
cd ../
npm run build

# Copy build files to Cordova www/
Copy-Item -Path build/* -Destination android-app/www/ -Recurse -Force
```

### Step 4: Build APK

```powershell
cd android-app

# Build debug APK
cordova build android

# Build release APK
cordova build android --release

# APK location:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔐 Signing APK (For Release)

### Generate Keystore

```powershell
# Generate keystore (one-time)
keytool -genkey -v -keystore social-chat.keystore -alias social-chat -keyalg RSA -keysize 2048 -validity 10000

# Answer prompts:
# - Password: (choose strong password)
# - Name: Your Name
# - Organization: Your Organization
# - City, State, Country
```

**⚠️ IMPORTANT:** Keep this keystore safe! You need it for all future updates.

### Sign APK Manually

```powershell
# Align APK
zipalign -v -p 4 app-release-unsigned.apk app-release-aligned.apk

# Sign APK
apksigner sign --ks social-chat.keystore --out app-release-signed.apk app-release-aligned.apk

# Verify signature
apksigner verify app-release-signed.apk
```

### Configure Gradle Signing (Automatic)

Create `frontend/android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=social-chat
storeFile=../../../social-chat.keystore
```

Edit `frontend/android/app/build.gradle`:

```gradle
// Add above android { }
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...
    
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Now build:

```powershell
cd frontend/android
.\gradlew assembleRelease

# Signed APK at:
# app/build/outputs/apk/release/app-release.apk
```

---

## 🚀 Firebase App Distribution

### Step 1: Setup Firebase

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (in project root)
firebase init

# Select:
# - App Distribution
# - Use existing project (your Firebase project)
```

### Step 2: Upload APK

```powershell
# Upload to Firebase App Distribution
firebase appdistribution:distribute frontend/android/app/build/outputs/apk/release/app-release.apk \
  --app YOUR_FIREBASE_APP_ID \
  --release-notes "Version 1.0 - Initial release" \
  --testers "tester1@example.com,tester2@example.com" \
  --groups "qa-team,beta-testers"

# Get YOUR_FIREBASE_APP_ID from:
# Firebase Console → Project Settings → General → Your apps
```

### Step 3: Manage Testers

**Firebase Console:**
1. Go to: App Distribution
2. Testers & Groups
3. Add testers by email
4. Testers receive email with download link

---

## 🤖 Automated Build Scripts

### Complete Build Script

Create `scripts/build-android.ps1`:

```powershell
# Complete Android build script
Write-Host "Building Android APK..." -ForegroundColor Cyan

cd frontend

# 1. Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# 2. Build React app
Write-Host "Building React app..." -ForegroundColor Yellow
npm run build

# 3. Sync with Capacitor
Write-Host "Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android

# 4. Build APK
Write-Host "Building APK..." -ForegroundColor Yellow
cd android
.\gradlew assembleRelease

# 5. Copy APK
Write-Host "Copying APK..." -ForegroundColor Yellow
$apkPath = "app\build\outputs\apk\release\app-release.apk"
$outputPath = "..\..\builds\social-chat-v1.0.apk"

New-Item -Path "..\..\builds" -ItemType Directory -Force
Copy-Item $apkPath $outputPath

Write-Host "APK built successfully!" -ForegroundColor Green
Write-Host "Location: $outputPath" -ForegroundColor Cyan

cd ..\..
```

### Quick Build & Deploy Script

```powershell
# Build and upload to Firebase
.\scripts\build-android.ps1

firebase appdistribution:distribute builds/social-chat-v1.0.apk \
  --app YOUR_APP_ID \
  --release-notes "Latest build" \
  --groups "testers"
```

---

## 📱 Testing APK

### Install on Physical Device

```powershell
# Enable USB debugging on phone
# Connect phone via USB

# Check device
adb devices

# Install APK
adb install builds/social-chat-v1.0.apk

# Or install specific file
adb install frontend/android/app/build/outputs/apk/release/app-release.apk
```

### Install on Emulator

```powershell
# List emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_30

# Install APK
adb install builds/social-chat-v1.0.apk
```

### Share APK File

1. **Copy APK to shared folder**
2. **Upload to cloud** (Google Drive, Dropbox)
3. **Send via messaging app**
4. **Use Firebase App Distribution** (recommended)

---

## 🔧 Configuration Files

### capacitor.config.json (Complete)

```json
{
  "appId": "com.socialchat.app",
  "appName": "Social Chat",
  "webDir": "build",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true,
    "hostname": "localhost",
    "allowNavigation": [
      "https://*.vercel.app",
      "https://*.ngrok-free.app",
      "https://*.cloudinary.com"
    ]
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "launchAutoHide": true,
      "backgroundColor": "#4F46E5",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false
    },
    "Keyboard": {
      "resize": "body",
      "style": "dark",
      "resizeOnFullScreen": true
    }
  }
}
```

### android/app/build.gradle (Key Parts)

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.socialchat.app"
        minSdkVersion 22
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }
}
```

---

## 🐛 Troubleshooting

### "JAVA_HOME not set"

```powershell
# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.x"

# Verify
java -version
```

### "Android SDK not found"

```powershell
# Set ANDROID_HOME
$env:ANDROID_HOME = "C:\Users\User\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

# Add to PATH
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

### "Gradle build failed"

```powershell
# Clean and rebuild
cd frontend/android
.\gradlew clean
.\gradlew assembleDebug
```

### "App not installing on device"

```powershell
# Uninstall old version first
adb uninstall com.socialchat.app

# Then install new
adb install app-release.apk
```

### "White screen on app launch"

**Check:**
1. API URLs configured correctly
2. Build folder synced: `npx cap sync`
3. CORS enabled on backend
4. Network permissions in AndroidManifest.xml

---

## 📋 Build Checklist

### Pre-Build
- [ ] Frontend code tested locally
- [ ] API URLs configured (use production Vercel URL)
- [ ] Firebase configured
- [ ] Images optimized
- [ ] All features working

### Build Setup
- [ ] JDK installed
- [ ] Android Studio installed
- [ ] Capacitor installed
- [ ] Android platform added
- [ ] Keystore generated (for release)

### Build Process
- [ ] `npm run build` successful
- [ ] `npx cap sync` executed
- [ ] APK built without errors
- [ ] APK signed (for release)
- [ ] APK tested on device

### Distribution
- [ ] Firebase App Distribution setup
- [ ] Testers added
- [ ] APK uploaded
- [ ] Release notes written
- [ ] Testers notified

---

## 💡 Pro Tips

### Tip 1: Version Management

Update version in 3 places:
1. `frontend/package.json` → version
2. `frontend/android/app/build.gradle` → versionCode, versionName
3. Build file name: `social-chat-v1.0.apk`

### Tip 2: Automated Version Bump

```powershell
# Bump version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Tip 3: Environment-Specific Builds

```javascript
// frontend/src/config/api.js
const API_URL = process.env.REACT_APP_API_BASE_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'
    : 'https://your-production-api.com/api');
```

### Tip 4: Reduce APK Size

```gradle
// android/app/build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
    
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a'
        }
    }
}
```

### Tip 5: CI/CD for Android

GitHub Actions workflow:

```yaml
name: Build Android APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
      - name: Build
        run: |
          cd frontend
          npm install
          npm run build
          npx cap sync android
      - name: Build APK
        run: |
          cd frontend/android
          ./gradlew assembleRelease
      - name: Upload APK
        uses: actions/upload-artifact@v2
        with:
          name: app-release
          path: frontend/android/app/build/outputs/apk/release/
```

---

## 🎯 Quick Commands Reference

```powershell
# Setup
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init

# Build web
npm run build

# Sync
npx cap sync android

# Open Android Studio
npx cap open android

# Build APK (command line)
cd android
.\gradlew assembleDebug        # Debug
.\gradlew assembleRelease      # Release

# Install on device
adb install app-release.apk

# Firebase upload
firebase appdistribution:distribute app-release.apk --app APP_ID
```

---

## ✅ Complete Workflow

```powershell
# 1. Setup (first time only)
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Social Chat" "com.socialchat.app"
npx cap add android

# 2. Every build
npm run build
npx cap sync android
cd android
.\gradlew assembleRelease

# 3. Test
adb install app\build\outputs\apk\release\app-release.apk

# 4. Distribute
firebase appdistribution:distribute app-release.apk --app YOUR_APP_ID
```

---

**🎉 Ready to build your Android app!**

Start with automated setup: `.\scripts\setup-android-build.ps1`
