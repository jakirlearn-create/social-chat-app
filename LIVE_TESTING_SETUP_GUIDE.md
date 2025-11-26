# 🌐 Live Online Testing System - Complete Setup Guide

**Last Updated:** November 27, 2025

এই গাইডটি আপনার Social Chat App এর জন্য সম্পূর্ণ লাইভ অনলাইন টেস্টিং সিস্টেম সেটআপ করবে যাতে আপনি যেকোনো ডিভাইস থেকে অ্যাপ টেস্ট করতে পারেন।

---

## 📋 Overview

এই সেটআপ আপনাকে দেবে:

1. ✅ GitHub Repository with Auto-Deploy
2. ✅ Vercel Hosting for Frontend & Admin Panel
3. ✅ ngrok Public URL for Backend API
4. ✅ Live Testing URLs for All Pages
5. ✅ Android APK Build with Firebase Distribution
6. ✅ CI/CD Pipeline (Auto-deploy on push)
7. ✅ Complete Testing & Error Reports

---

## 🚀 STEP 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

```powershell
# প্রথমে GitHub এ যান এবং নতুন repository তৈরি করুন:
# https://github.com/new
# 
# Repository Name: social-chat-app
# Description: Social Media App with Admin Panel, Chat, Games, and Wallet
# Visibility: Private (recommended) or Public
```

### 1.2 Push to GitHub

```powershell
cd C:\Users\User\social_chat_app

# GitHub repository URL দিয়ে remote add করুন
git remote add origin https://github.com/YOUR_USERNAME/social-chat-app.git

# Main branch তৈরি করে push করুন
git branch -M main
git push -u origin main

# Dev branch তৈরি করুন
git checkout -b dev
git push -u origin dev

# Main branch এ ফিরে যান
git checkout main
```

---

## 🔥 STEP 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Project Name: `social-chat-app`
4. Enable Google Analytics (optional)

### 2.2 Enable Services

```
✅ Authentication
   - Email/Password
   - Google Sign-In (optional)

✅ Firestore Database
   - Start in test mode
   - Later change to production rules

✅ Storage
   - Start in test mode
   - For profile pictures and media

✅ App Distribution
   - For Android APK distribution
```

### 2.3 Get Firebase Config

```javascript
// Go to Project Settings > General
// Scroll to "Your apps" section
// Click "Web" icon to register web app
// Copy the config:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2.4 Update Frontend .env

```powershell
# frontend/.env file এ যোগ করুন:
```

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## 🌐 STEP 3: Vercel Deployment

### 3.1 Install Vercel CLI

```powershell
npm install -g vercel
```

### 3.2 Deploy Frontend

```powershell
cd C:\Users\User\social_chat_app\frontend

# Vercel login
vercel login

# Deploy
vercel

# প্রশ্নগুলোর উত্তর:
# Set up and deploy? Y
# Which scope? Select your account
# Link to existing project? N
# Project name? social-chat-app-frontend
# Directory? ./ (current)
# Override settings? N

# Production deploy
vercel --prod
```

### 3.3 Deploy Admin Panel

```powershell
cd C:\Users\User\social_chat_app\admin-panel

vercel

# প্রশ্নগুলোর উত্তর:
# Set up and deploy? Y
# Which scope? Select your account
# Link to existing project? N
# Project name? social-chat-app-admin
# Directory? ./ (current)
# Override settings? N

# Production deploy
vercel --prod
```

### 3.4 Configure Environment Variables

Vercel Dashboard এ যান:
- Settings > Environment Variables
- Add all `.env` variables
- Redeploy after adding variables

---

## 🔌 STEP 4: ngrok Backend Setup

### 4.1 Install ngrok

```powershell
# Download from: https://ngrok.com/download
# Or install via Chocolatey:
choco install ngrok

# Sign up and get authtoken from:
# https://dashboard.ngrok.com/get-started/your-authtoken

# Configure authtoken:
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 4.2 Start Backend with ngrok

```powershell
# Terminal 1: Start Backend
cd C:\Users\User\social_chat_app\backend
npm start

# Terminal 2: Start ngrok
ngrok http 8000

# Copy the "Forwarding" URL (e.g., https://abc123.ngrok-free.app)
```

### 4.3 Update API URLs

**Frontend config/api.js:**
```javascript
const API_BASE_URL = 'https://YOUR_NGROK_URL.ngrok-free.app';
export default API_BASE_URL;
```

**Admin Panel (if has API config):**
```javascript
const API_BASE_URL = 'https://YOUR_NGROK_URL.ngrok-free.app';
```

### 4.4 Redeploy with New API URL

```powershell
# Frontend
cd frontend
vercel --prod

# Admin Panel
cd ../admin-panel
vercel --prod
```

---

## 📱 STEP 5: Android Build Setup

### 5.1 Install Android Build Tools

```powershell
# Install Cordova (if not installed)
npm install -g cordova

# Or use Capacitor:
npm install -g @capacitor/cli
```

### 5.2 Build Android APK

**Option A: Using Electron Builder**
```powershell
cd frontend
npm run build
npm run electron-pack
```

**Option B: Using Capacitor**
```powershell
cd frontend

# Add Android platform
npx cap add android

# Sync
npx cap sync

# Open in Android Studio
npx cap open android

# Build APK in Android Studio:
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### 5.3 Upload to Firebase App Distribution

1. Go to Firebase Console > App Distribution
2. Click "Get started"
3. Upload your APK
4. Add testers (email addresses)
5. Send invites

---

## ⚙️ STEP 6: CI/CD Pipeline (GitHub Actions)

### 6.1 Create GitHub Actions Workflow

```powershell
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, dev]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy Frontend
        working-directory: ./frontend
        run: |
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_FRONTEND_ID }}
  
  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy Admin Panel
        working-directory: ./admin-panel
        run: |
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ADMIN_ID }}
```

### 6.2 Add GitHub Secrets

Go to GitHub Repository > Settings > Secrets and variables > Actions

Add these secrets:
```
VERCEL_TOKEN - Get from https://vercel.com/account/tokens
VERCEL_ORG_ID - Get from Vercel project settings
VERCEL_PROJECT_FRONTEND_ID - Get from Vercel frontend project settings
VERCEL_PROJECT_ADMIN_ID - Get from Vercel admin project settings
```

---

## 🧪 STEP 7: Testing System

### 7.1 Create Testing Script

Create `scripts/test-all-features.ps1`:

```powershell
# Complete Testing Script
Write-Host "🧪 Starting Complete App Testing..." -ForegroundColor Cyan

$tests = @(
    @{Name="Frontend"; URL="https://your-frontend.vercel.app"; Pages=@("/", "/login", "/signup", "/home", "/profile", "/messenger", "/wallet", "/games")},
    @{Name="Admin Panel"; URL="https://your-admin.vercel.app"; Pages=@("/", "/admin/login", "/superadmin/login")},
    @{Name="Backend API"; URL="https://your-ngrok-url.ngrok-free.app"; Endpoints=@("/api/health", "/api/auth/me")}
)

$results = @()

foreach ($test in $tests) {
    Write-Host "`n Testing $($test.Name)..." -ForegroundColor Yellow
    
    if ($test.Pages) {
        foreach ($page in $test.Pages) {
            try {
                $url = "$($test.URL)$page"
                $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -UseBasicParsing
                $status = if ($response.StatusCode -eq 200) { "✅ PASS" } else { "⚠️ WARN" }
                $results += "$status - $($test.Name) - $page - Status: $($response.StatusCode)"
                Write-Host "  $status $page" -ForegroundColor Green
            } catch {
                $results += "❌ FAIL - $($test.Name) - $page - Error: $($_.Exception.Message)"
                Write-Host "  ❌ FAIL $page" -ForegroundColor Red
            }
        }
    }
    
    if ($test.Endpoints) {
        foreach ($endpoint in $test.Endpoints) {
            try {
                $url = "$($test.URL)$endpoint"
                $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -UseBasicParsing
                $status = if ($response.StatusCode -eq 200) { "✅ PASS" } else { "⚠️ WARN" }
                $results += "$status - $($test.Name) - $endpoint - Status: $($response.StatusCode)"
                Write-Host "  $status $endpoint" -ForegroundColor Green
            } catch {
                $results += "❌ FAIL - $($test.Name) - $endpoint - Error: $($_.Exception.Message)"
                Write-Host "  ❌ FAIL $endpoint" -ForegroundColor Red
            }
        }
    }
}

# Save results
$results | Out-File "test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
Write-Host "`n✅ Testing Complete! Results saved." -ForegroundColor Green
```

---

## 📊 STEP 8: Live Testing URLs

আপনার deployment complete হলে এই URLগুলো পাবেন:

### Frontend URLs
```
Production: https://social-chat-app-frontend.vercel.app
Dev: https://social-chat-app-frontend-dev.vercel.app

Pages to Test:
├── / (Landing/Home)
├── /login
├── /signup
├── /home (Main Feed)
├── /profile
├── /messenger
├── /chat/:id
├── /wallet
├── /wallet/deposit
├── /wallet/withdraw
├── /games
├── /settings
└── /create
```

### Admin Panel URLs
```
Production: https://social-chat-app-admin.vercel.app
Dev: https://social-chat-app-admin-dev.vercel.app

Pages to Test:
├── / (Role Selection)
├── /admin/login
├── /admin/dashboard
├── /superadmin/login
└── /superadmin/dashboard
```

### Backend API
```
ngrok URL: https://abc123.ngrok-free.app

Endpoints to Test:
├── /api/health
├── /api/auth/signup
├── /api/auth/login
├── /api/auth/me
├── /api/users
├── /api/posts
├── /api/messages
├── /api/conversations
├── /api/wallet
└── /api/admin
```

---

## 🔄 STEP 9: Auto-Deploy Workflow

এখন থেকে যখনই আপনি code push করবেন:

```powershell
# Make changes to code
git add .
git commit -m "Your commit message"
git push origin main

# GitHub Actions automatically:
# 1. Runs tests
# 2. Builds frontend and admin panel
# 3. Deploys to Vercel
# 4. Generates new URLs
# 5. Sends notification (optional)
```

---

## 📱 STEP 10: Mobile Testing

### Android Testing via Firebase
1. Go to Firebase Console > App Distribution
2. Share APK link with testers
3. Testers download via Firebase App Distribution app
4. Install and test on real devices

### Browser Testing
- Open live URLs on mobile browsers
- Test responsiveness
- Check all features

---

## 🐛 STEP 11: Error Monitoring

### Setup Sentry (Optional)

```powershell
npm install @sentry/react @sentry/tracing
```

```javascript
// frontend/src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 📋 Quick Commands Reference

```powershell
# Start all servers locally
cd backend && npm start  # Terminal 1
ngrok http 8000          # Terminal 2
cd frontend && npm start # Terminal 3
cd admin-panel && npm start # Terminal 4

# Deploy frontend
cd frontend && vercel --prod

# Deploy admin panel
cd admin-panel && vercel --prod

# Run tests
./scripts/test-all-features.ps1

# Check deployment status
vercel list

# View deployment logs
vercel logs YOUR_DEPLOYMENT_URL
```

---

## ✅ Testing Checklist

আপনার live testing system সেটআপ সম্পূর্ণ হলে এই checklistটি follow করুন:

### Frontend Testing
- [ ] Landing page loads
- [ ] User registration works
- [ ] Login works
- [ ] Profile page displays correctly
- [ ] Messenger loads and sends messages
- [ ] Wallet shows balance
- [ ] Games page accessible
- [ ] Settings save correctly
- [ ] Logout works

### Admin Panel Testing
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] User list displays
- [ ] Wallet requests visible
- [ ] Super admin login works
- [ ] Super admin can approve admins
- [ ] Logs are recorded

### Backend API Testing
- [ ] Health check responds
- [ ] Authentication endpoints work
- [ ] User CRUD operations work
- [ ] Posts API functional
- [ ] Messages API functional
- [ ] Wallet API functional
- [ ] Admin API secured

### Mobile Testing
- [ ] APK installs on Android
- [ ] All features work on mobile
- [ ] Responsive design looks good
- [ ] Touch interactions smooth
- [ ] Camera/media access works

---

## 🎯 Final URLs Summary

After complete setup, save these URLs:

```
📱 Frontend (Live): https://YOUR-FRONTEND.vercel.app
👔 Admin Panel (Live): https://YOUR-ADMIN.vercel.app
⚙️ Backend API (Live): https://YOUR-NGROK.ngrok-free.app
📦 Android APK: https://appdistribution.firebase.dev/YOUR-APP
📊 GitHub Repo: https://github.com/YOUR-USERNAME/social-chat-app
🔧 Vercel Dashboard: https://vercel.com/dashboard
🔥 Firebase Console: https://console.firebase.google.com/
```

---

## 🆘 Troubleshooting

### Issue: Vercel build fails
```powershell
# Check build logs
vercel logs

# Clear cache and redeploy
vercel --force
```

### Issue: ngrok URL expires
```powershell
# ngrok free plan URLs expire after 2 hours
# Get a paid plan or restart ngrok:
ngrok http 8000

# Update API URLs and redeploy
```

### Issue: Firebase quota exceeded
```
- Upgrade to Blaze plan (pay-as-you-go)
- Or optimize your database queries
```

---

## 📞 Support

যদি কোন সমস্যা হয়:
1. Check server logs
2. Check browser console
3. Check Vercel deployment logs
4. Check Firebase console
5. Review error messages carefully

---

**🎉 Congratulations! Your live testing system is now ready!**

এখন আপনি যেকোনো ডিভাইস থেকে আপনার অ্যাপ টেস্ট করতে পারবেন!

---

*Last Updated: November 27, 2025*
