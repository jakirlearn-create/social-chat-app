# 🤖 Android Build Complete Workflow
## From Setup to Distribution

---

## ⚡ Complete Automated Workflow

### One-Time Setup (First Time Only)
```powershell
# Install and configure Android build system
.\scripts\setup-android-build.ps1
```

### Build APK (Every Release)
```powershell
# Debug build (for testing)
.\scripts\build-android-apk.ps1 -BuildType debug

# Release build (for distribution)
.\scripts\build-android-apk.ps1 -BuildType release
```

### Distribute to Testers
```powershell
# Upload to Firebase App Distribution
.\scripts\distribute-android.ps1
```

---

## 📋 Complete Step-by-Step Guide

### Phase 1: Initial Setup

#### Step 1.1: Install Prerequisites

**Java JDK 17:**
```powershell
# Download and install from:
# https://adoptium.net/

# Verify installation
java -version

# Set JAVA_HOME
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.x.x', 'User')
```

**Android Studio:**
```powershell
# Download and install:
# https://developer.android.com/studio

# During setup, install:
# - Android SDK
# - Android SDK Platform-Tools
# - Android SDK Build-Tools
# - Android Emulator (optional)

# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\User\AppData\Local\Android\Sdk', 'User')
```

**Firebase CLI:**
```powershell
npm install -g firebase-tools
firebase login
```

#### Step 1.2: Run Setup Script
```powershell
.\scripts\setup-android-build.ps1
```

This script will:
- ✅ Check prerequisites
- ✅ Install Capacitor
- ✅ Initialize Capacitor project
- ✅ Build React app
- ✅ Add Android platform
- ✅ Sync assets

**Output:**
```
frontend/
  ├── capacitor.config.json    # Capacitor configuration
  ├── android/                 # Android Studio project
  │   ├── app/
  │   ├── gradle/
  │   └── build.gradle
  └── build/                   # React production build
```

---

### Phase 2: Building APK

#### Method 1: Automated Script (Recommended)

**Debug Build:**
```powershell
.\scripts\build-android-apk.ps1 -BuildType debug
```

**Release Build:**
```powershell
.\scripts\build-android-apk.ps1 -BuildType release
```

**Custom Output Name:**
```powershell
.\scripts\build-android-apk.ps1 -BuildType release -OutputName "my-app-v1.0.apk"
```

**Output Location:**
```
builds/
  └── social-chat-1.0.0-release-20251127-143022.apk
```

#### Method 2: Android Studio (GUI)

```powershell
# Open project in Android Studio
cd frontend
npx cap open android
```

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Choose or create **keystore**
4. Select **release** variant
5. Click **Finish**

APK Location:
```
frontend/android/app/build/outputs/apk/release/app-release.apk
```

#### Method 3: Manual Gradle

```powershell
# Build React app
cd frontend
npm run build

# Sync with Capacitor
npx cap sync android

# Build APK
cd android
.\gradlew assembleDebug      # or assembleRelease
```

---

### Phase 3: Signing APK (Release Only)

#### Generate Keystore (One-Time)

```powershell
# Navigate to project root
cd C:\Users\User\social_chat_app

# Generate keystore
keytool -genkey -v -keystore social-chat-release.keystore -alias social-chat -keyalg RSA -keysize 2048 -validity 10000

# Answer prompts:
# Keystore password: (create strong password)
# Key password: (same or different)
# Your name: Your Name
# Organizational unit: Development
# Organization: Your Company
# City: Your City
# State: Your State
# Country code: US
```

**⚠️ CRITICAL:** 
- Backup this keystore file!
- Never lose the password!
- You need it for ALL future app updates!

#### Configure Automatic Signing

Create `frontend/android/keystore.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=social-chat
storeFile=../../../social-chat-release.keystore
```

**Add to .gitignore:**
```
keystore.properties
*.keystore
```

Edit `frontend/android/app/build.gradle`:
```gradle
// Add at top
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
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Now builds will auto-sign:
```powershell
.\scripts\build-android-apk.ps1 -BuildType release
# Output: Signed release APK
```

---

### Phase 4: Testing APK

#### Install on Physical Device

```powershell
# Enable USB Debugging on phone:
# Settings → About Phone → Tap "Build Number" 7 times
# Settings → Developer Options → Enable USB Debugging

# Connect phone via USB

# Check device connected
adb devices

# Install APK
adb install builds\social-chat-1.0.0-debug-*.apk

# Or latest APK
$latestApk = Get-ChildItem builds\*.apk | Sort-Object LastWriteTime -Descending | Select-Object -First 1
adb install $latestApk.FullName
```

#### Install on Emulator

```powershell
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_30 &

# Wait for emulator to boot, then install
adb install builds\social-chat-*.apk
```

#### Test Checklist

- [ ] App launches successfully
- [ ] No crash on startup
- [ ] Login/Registration works
- [ ] API calls successful
- [ ] Images load properly
- [ ] Navigation works
- [ ] Messenger functions
- [ ] Wallet displays
- [ ] Games accessible
- [ ] No console errors

---

### Phase 5: Distribution

#### Firebase App Distribution

**Setup (One-Time):**
```powershell
# Install Firebase CLI (if not done)
npm install -g firebase-tools

# Login
firebase login

# Initialize in project
firebase init

# Select:
# - App Distribution
# - Use existing project
```

**Upload APK:**
```powershell
# Automated script
.\scripts\distribute-android.ps1

# Or manual command
firebase appdistribution:distribute builds\social-chat-1.0.0-release.apk `
  --app YOUR_FIREBASE_APP_ID `
  --release-notes "Version 1.0 - Initial release" `
  --groups "testers"
```

**Get Firebase App ID:**
1. Go to: https://console.firebase.google.com/
2. Select project
3. ⚙️ Project Settings → General
4. Scroll to "Your apps"
5. Find Android app or add new one
6. Copy **App ID** (format: `1:123456789:android:abcdef123456`)

**Add Testers:**
1. Firebase Console → App Distribution
2. Testers & Groups → Add testers
3. Enter email addresses
4. Create groups (e.g., "beta-testers", "qa-team")

**Testers Receive:**
- Email notification
- Download link
- Install instructions
- Release notes

---

## 🔄 Regular Build Workflow

### Every Code Change

```powershell
# 1. Make code changes in frontend/

# 2. Test locally
cd frontend
npm start

# 3. When ready, build APK
cd ..
.\scripts\build-android-apk.ps1 -BuildType debug

# 4. Test on device
adb install builds\latest-apk.apk

# 5. If all good, build release
.\scripts\build-android-apk.ps1 -BuildType release

# 6. Distribute
.\scripts\distribute-android.ps1
```

### Version Updates

```powershell
# Update version in package.json
cd frontend
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0

# Update Android version code and name
# Edit: android/app/build.gradle
# versionCode = 2
# versionName = "1.0.1"

# Commit changes
git add .
git commit -m "Bump version to 1.0.1"

# Build and distribute
cd ..
.\scripts\build-android-apk.ps1 -BuildType release
.\scripts\distribute-android.ps1
```

---

## 📊 Build Optimization

### Reduce APK Size

**Enable ProGuard/R8:**
```gradle
// android/app/build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }
}
```

**Split APK by ABI:**
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
            universalApk false
        }
    }
}
```

**Optimize Images:**
```powershell
# Use WebP format
# Compress images before building
# Remove unused assets
```

### Speed Up Builds

**Gradle Optimization:**

Create/Edit `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
android.enableJetifier=true
android.useAndroidX=true
```

**Incremental Builds:**
```powershell
# Only sync when needed
npx cap sync android

# Clean only when necessary
cd frontend/android
.\gradlew clean
```

---

## 🐛 Troubleshooting

### Build Fails - Java Issues

```powershell
# Check Java version
java -version

# Should be JDK 11 or 17
# If wrong version, set JAVA_HOME:
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x"
```

### Build Fails - Gradle Issues

```powershell
# Clean Gradle cache
cd frontend/android
.\gradlew clean

# Delete .gradle folder
Remove-Item -Recurse -Force .gradle

# Rebuild
.\gradlew assembleDebug
```

### App Crashes on Launch

**Check:**
1. API URL configured correctly in capacitor.config.json
2. Permissions in AndroidManifest.xml
3. Network security config
4. Firebase initialized

**Debug:**
```powershell
# View device logs
adb logcat | Select-String "socialchat"

# Clear app data and reinstall
adb shell pm clear com.socialchat.app
adb install -r builds\app.apk
```

### APK Too Large

**Solutions:**
1. Enable minify and shrink
2. Use WebP images
3. Split APKs by ABI
4. Remove unused dependencies
5. Use ProGuard rules

---

## 📱 Publishing to Google Play Store

### Prepare for Production

1. **Create signed release APK**
2. **Generate App Bundle** (AAB):
   ```powershell
   cd frontend/android
   .\gradlew bundleRelease
   # Output: app/build/outputs/bundle/release/app-release.aab
   ```

3. **Create store listing:**
   - App name
   - Description
   - Screenshots
   - Icon
   - Privacy policy

4. **Submit to Google Play Console:**
   - Upload AAB file
   - Fill in store listing
   - Set pricing
   - Submit for review

---

## ✅ Complete Checklist

### Initial Setup
- [ ] Java JDK installed
- [ ] Android Studio installed
- [ ] JAVA_HOME set
- [ ] ANDROID_HOME set
- [ ] Firebase CLI installed
- [ ] Capacitor setup completed
- [ ] Keystore generated
- [ ] Signing configured

### Every Build
- [ ] Code changes tested locally
- [ ] Version updated (if needed)
- [ ] React app built
- [ ] Assets synced
- [ ] APK built successfully
- [ ] APK tested on device
- [ ] No crashes or errors

### Distribution
- [ ] Release notes written
- [ ] Testers identified
- [ ] Firebase App Distribution setup
- [ ] APK uploaded
- [ ] Testers notified
- [ ] Feedback collected

---

## 📚 Quick Commands Reference

```powershell
# Complete setup
.\scripts\setup-android-build.ps1

# Build debug APK
.\scripts\build-android-apk.ps1 -BuildType debug

# Build release APK
.\scripts\build-android-apk.ps1 -BuildType release

# Distribute to testers
.\scripts\distribute-android.ps1

# Manual build steps
cd frontend
npm run build
npx cap sync android
cd android
.\gradlew assembleRelease

# Install on device
adb devices
adb install path\to\app.apk

# View logs
adb logcat

# Firebase upload
firebase appdistribution:distribute app.apk --app APP_ID
```

---

**🎉 Ready to build Android APK!**

Start with: `.\scripts\setup-android-build.ps1`
