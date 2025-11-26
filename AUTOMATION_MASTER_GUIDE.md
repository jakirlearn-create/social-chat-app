# 🚀 Live Testing System - Complete Automation
## সম্পূর্ণ অটোমেটেড ডিপ্লয়মেন্ট সিস্টেম

---

## ⚡ Quick Start (দ্রুত শুরু করুন)

### One Command Setup:

```powershell
.\scripts\setup-live-testing.ps1
```

এই একটি command:
- ✅ Git repository status check করবে
- ✅ Firebase configuration verify করবে  
- ✅ ngrok installation check করবে
- ✅ Vercel CLI install করবে (যদি না থাকে)
- ✅ Interactive deployment শুরু করবে
- ✅ Complete status report দেখাবে

---

## 📋 সিস্টেম কম্পোনেন্ট

### 1. Git Repository ✅
- **Status:** Initialized (master branch)
- **Check:** `git status`

### 2. Backend API (ngrok)
- **Port:** 8000
- **Public URL:** ngrok tunnel
- **Start:** `.\scripts\start-all-servers.ps1`
- **Guide:** `INSTALL_NGROK.md`

### 3. Frontend (Vercel)
- **Local Port:** 3000
- **Deployment:** Vercel
- **Guide:** `VERCEL_DEPLOYMENT_GUIDE.md`

### 4. Admin Panel (Vercel)
- **Local Port:** 3001
- **Deployment:** Vercel
- **Guide:** `VERCEL_DEPLOYMENT_GUIDE.md`

### 5. Firebase Services
- **Authentication:** Email/Password
- **Database:** Firestore
- **Storage:** Cloud Storage
- **Guide:** `FIREBASE_SETUP_GUIDE.md`

---

## 🎯 Deployment Workflow

### Complete Flow:

```
1. Git Commit
   ↓
2. Firebase Setup
   ↓
3. ngrok Backend (Port 8000)
   ↓
4. Vercel Deploy (Frontend + Admin)
   ↓
5. Update API URLs
   ↓
6. Live Testing
   ↓
7. Android Build (Optional)
```

---

## 🛠️ Available Scripts

### Master Setup Script
```powershell
# Complete automated setup
.\scripts\setup-live-testing.ps1
```

### Individual Scripts

#### 1. Start All Servers
```powershell
.\scripts\start-all-servers.ps1
```
**Starts:**
- Backend API (port 8000)
- ngrok tunnel (if installed)
- Frontend (port 3000)
- Admin Panel (port 3001)

#### 2. Check Firebase
```powershell
.\scripts\check-firebase.ps1
```
**Checks:**
- Firebase credentials configured
- Config file exists
- Lists required services

#### 3. Deploy Vercel
```powershell
.\scripts\deploy-vercel.ps1
```
**Options:**
- Deploy Frontend only
- Deploy Admin Panel only
- Deploy Both
- Auto-installs Vercel CLI

#### 4. Update ngrok URL
```powershell
.\scripts\update-ngrok-url.ps1 -NgrokUrl "https://xxxx.ngrok.io"
```
**Updates:**
- `frontend/src/config/api.js`
- All environment variables
- Prompts for Vercel redeploy

---

## 📚 Complete Documentation

### Setup Guides

| Guide | Purpose | Status |
|-------|---------|--------|
| **LIVE_TESTING_SETUP_GUIDE.md** | Master guide (11 steps) | ✅ Complete |
| **FIREBASE_SETUP_GUIDE.md** | Firebase configuration | ✅ Complete |
| **VERCEL_DEPLOYMENT_GUIDE.md** | Frontend/Admin deployment | ✅ Complete |
| **INSTALL_NGROK.md** | Backend public access | ✅ Complete |
| **QUICK_TESTING_GUIDE.md** | Quick start testing | ✅ Complete |

### Quick Reference

| Topic | File |
|-------|------|
| Admin Credentials | `ADMIN_CREDENTIALS.md` |
| Project Summary | `PROJECT_SUMMARY.txt` |
| System Guide | `SYSTEM_GUIDE.txt` |
| Complete Guide | `COMPLETE_GUIDE.md` |

---

## 🔧 Step-by-Step Manual Setup

### Step 1: Git Repository
```powershell
# Check status
git status

# Commit if needed
git add .
git commit -m "Ready for deployment"

# Push to GitHub (optional)
git remote add origin YOUR_GITHUB_URL
git push -u origin master
```

### Step 2: Firebase Configuration
```powershell
# Check current config
.\scripts\check-firebase.ps1

# Read setup guide
# File: FIREBASE_SETUP_GUIDE.md

# Create Firebase project at:
# https://console.firebase.google.com/
```

**Required Services:**
- ✅ Authentication (Email/Password)
- ✅ Firestore Database (Test mode)
- ✅ Cloud Storage
- ⏳ App Distribution (for Android later)

### Step 3: Install ngrok
```powershell
# Read guide
# File: INSTALL_NGROK.md

# Download from:
# https://ngrok.com/download

# Extract to: C:\Windows\System32\

# Configure auth token:
ngrok config add-authtoken YOUR_TOKEN
```

### Step 4: Start Backend with ngrok
```powershell
# Start all servers (automated)
.\scripts\start-all-servers.ps1

# Or manually:
# Terminal 1: cd backend && node server.js
# Terminal 2: ngrok http 8000
# Terminal 3: cd frontend && npm start
# Terminal 4: cd admin-panel && npm start
```

**Copy ngrok URL:** `https://xxxx-xx-xxx.ngrok-free.app`

### Step 5: Update API URLs
```powershell
# Update all config files
.\scripts\update-ngrok-url.ps1 -NgrokUrl "YOUR_NGROK_URL"
```

### Step 6: Deploy to Vercel
```powershell
# Automated deployment
.\scripts\deploy-vercel.ps1

# Or manually:
npm install -g vercel
vercel login
cd frontend && vercel --prod
cd ../admin-panel && vercel --prod
```

### Step 7: Update Vercel Environment Variables

**Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**

Add:
```env
REACT_APP_API_BASE_URL=YOUR_NGROK_URL
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_KEY
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_CLOUDINARY_CLOUD_NAME=dibq2ofsi
```

**Redeploy** after updating environment variables.

### Step 8: Test Live URLs

**Frontend:** `https://social-chat-frontend.vercel.app`
**Admin:** `https://social-chat-admin.vercel.app`
**API:** `https://xxxx.ngrok.io/api`

Test these pages:
- ✅ Homepage
- ✅ Login/Register
- ✅ Profile
- ✅ Messenger
- ✅ Wallet
- ✅ Games
- ✅ Admin Panel

---

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Homepage loads
- [ ] User registration works
- [ ] Login successful
- [ ] Profile page displays
- [ ] Profile picture upload (Cloudinary)
- [ ] Messenger loads conversations
- [ ] Send/receive messages
- [ ] Wallet balance displays
- [ ] Game pages accessible

### Admin Panel Testing
- [ ] Admin login works
- [ ] Dashboard displays stats
- [ ] User management
- [ ] Wallet transactions
- [ ] Game logs visible
- [ ] Super Admin features

### API Testing
```powershell
# Health check
curl https://your-ngrok-url/api/health

# Test auth endpoint
curl https://your-ngrok-url/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔄 CI/CD Automation (Optional)

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Admin
        run: |
          cd admin-panel
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Setup:**
1. Get Vercel token: `vercel whoami` → Settings → Tokens
2. Add to GitHub Secrets: Repository → Settings → Secrets
3. Push code → Auto-deploy!

---

## 📱 Android Build (Coming Soon)

### Prerequisites:
- ✅ Frontend deployed to Vercel
- ✅ Backend running with ngrok
- ✅ Firebase App Distribution enabled

### Build Steps:
```powershell
# Install Capacitor
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor
npx cap init

# Add Android platform
npx cap add android

# Sync web files
npx cap sync

# Open in Android Studio
npx cap open android
```

**Build APK:**
- Android Studio → Build → Generate Signed Bundle/APK
- Upload to Firebase App Distribution

---

## 🐛 Common Issues & Solutions

### ❌ ngrok URL changes every restart

**Solution:**
1. Get new ngrok URL: `https://xxxx.ngrok.io`
2. Run: `.\scripts\update-ngrok-url.ps1 -NgrokUrl NEW_URL`
3. Update Vercel environment variables
4. Redeploy

**Better Solution:**
- Upgrade to ngrok Pro for static domain
- Or use Cloudflare Tunnel (free alternative)

### ❌ Vercel build fails

**Check:**
```powershell
# Test build locally
cd frontend
npm run build

# Check for errors
# Fix dependencies
npm install

# Commit and push
git add .
git commit -m "Fix build"
git push
```

### ❌ Firebase errors on production

**Solution:**
1. Whitelist Vercel domain in Firebase Console
2. Firebase Console → Authentication → Settings → Authorized domains
3. Add: `your-app.vercel.app`

### ❌ API calls not working

**Debug:**
```powershell
# Check ngrok is running
curl https://your-ngrok-url/api/health

# Check API base URL in code
cat frontend/src/config/api.js

# Check Vercel environment variables
# Vercel Dashboard → Settings → Environment Variables
```

---

## 📊 System Architecture

```
┌─────────────────┐
│   User Device   │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ Frontend        │  │ Admin Panel     │
│ (Vercel)        │  │ (Vercel)        │
│ Port 3000       │  │ Port 3001       │
└────────┬────────┘  └────────┬────────┘
         │                    │
         └────────┬───────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ Backend API     │
         │ (ngrok)         │
         │ Port 8000       │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│ MongoDB         │  │ Firebase        │
│ (Local/Cloud)   │  │ (Auth/Storage)  │
└─────────────────┘  └─────────────────┘
```

---

## 🎯 Production Checklist

### Pre-Deployment
- [ ] All code committed to Git
- [ ] Firebase configured and tested
- [ ] ngrok installed and authenticated
- [ ] Vercel CLI installed
- [ ] Environment variables prepared
- [ ] Local testing complete

### Deployment
- [ ] Backend running with ngrok
- [ ] Frontend deployed to Vercel
- [ ] Admin Panel deployed to Vercel
- [ ] API URLs updated everywhere
- [ ] Vercel environment variables set
- [ ] Redeployed after env var changes

### Post-Deployment
- [ ] All pages accessible
- [ ] Authentication working
- [ ] Database operations successful
- [ ] File uploads working (Cloudinary)
- [ ] Real-time features tested (Messenger)
- [ ] Admin panel functional
- [ ] Error logging enabled

### Optional
- [ ] Custom domain configured
- [ ] CI/CD pipeline setup
- [ ] Android APK built
- [ ] Firebase App Distribution
- [ ] Analytics enabled
- [ ] Monitoring setup

---

## 📞 Support & Resources

### Documentation Files
- `LIVE_TESTING_SETUP_GUIDE.md` - Master guide
- `FIREBASE_SETUP_GUIDE.md` - Firebase setup
- `VERCEL_DEPLOYMENT_GUIDE.md` - Vercel deployment
- `INSTALL_NGROK.md` - ngrok installation
- `QUICK_TESTING_GUIDE.md` - Quick testing

### External Resources
- **Vercel:** https://vercel.com/docs
- **ngrok:** https://ngrok.com/docs
- **Firebase:** https://firebase.google.com/docs
- **GitHub:** https://docs.github.com

### Quick Commands
```powershell
# Complete setup
.\scripts\setup-live-testing.ps1

# Start servers
.\scripts\start-all-servers.ps1

# Check Firebase
.\scripts\check-firebase.ps1

# Deploy Vercel
.\scripts\deploy-vercel.ps1

# Update ngrok URL
.\scripts\update-ngrok-url.ps1 -NgrokUrl URL
```

---

## 🎉 You're All Set!

এখন আপনার complete live testing system ready!

**Next Actions:**
1. Run: `.\scripts\setup-live-testing.ps1`
2. Follow on-screen instructions
3. Test your live app
4. Share URLs with testers

**Any issues?** Check the troubleshooting sections in:
- `LIVE_TESTING_SETUP_GUIDE.md`
- `VERCEL_DEPLOYMENT_GUIDE.md`
- `FIREBASE_SETUP_GUIDE.md`

---

**Happy Testing! 🚀**
