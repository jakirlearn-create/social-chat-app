# 🚀 Vercel Deployment Guide
## Frontend & Admin Panel Deployment (বাংলায়)

---

## ⚡ Quick Deploy (দ্রুত Deploy)

**One-Click Deployment:**

```powershell
.\scripts\deploy-vercel.ps1
```

এই script automatically:
- Vercel CLI install করবে (যদি না থাকে)
- Login prompt দেখাবে
- Frontend এবং Admin Panel deploy করবে

---

## 📋 Prerequisites (প্রয়োজনীয় জিনিস)

### 1. Vercel Account তৈরি করুন

- যান: https://vercel.com/signup
- **GitHub** দিয়ে signup করুন (recommended)
- বা Email দিয়ে signup করুন

### 2. Git Repository Ready করুন

```powershell
# Check git status
git status

# If not committed
git add .
git commit -m "Ready for deployment"
```

### 3. GitHub এ Push করুন (Optional but Recommended)

```powershell
# Add remote (যদি না থাকে)
git remote add origin https://github.com/your-username/social-chat-app.git

# Push to GitHub
git push -u origin master
```

---

## 🎯 Method 1: Automated Deployment (Recommended)

### Step 1: Run Deployment Script

```powershell
.\scripts\deploy-vercel.ps1
```

### Step 2: Select Option

```
1. Deploy Frontend (React App - Port 3000)
2. Deploy Admin Panel (Port 3001)
3. Deploy Both
4. Exit
```

**প্রথমবার চালালে:**
- Browser খুলবে Vercel login করার জন্য
- Authorize করুন
- Terminal এ ফিরে আসবে

### Step 3: Configure Deployment

Vercel CLI জিজ্ঞাসা করবে:

```
? Set up and deploy "~/social_chat_app/frontend"? [Y/n]
```
→ **Y** টাইপ করুন

```
? Which scope do you want to deploy to?
```
→ আপনার **username** select করুন

```
? Link to existing project? [y/N]
```
→ প্রথমবার **N** (নতুন project)

```
? What's your project's name?
```
→ `social-chat-frontend` (বা যেকোনো নাম)

```
? In which directory is your code located?
```
→ **./** (Enter চাপুন)

**Framework Detection:**
```
? Want to override the settings? [y/N]
```
→ **N** (Vercel automatically React detect করবে)

### Step 4: Wait for Deployment

```
🔍 Inspect: https://vercel.com/...
✅ Production: https://social-chat-frontend.vercel.app
```

**Copy করুন:**
- ✅ Production URL
- 🔍 Inspect URL (deployment details দেখতে)

---

## 🎯 Method 2: Manual CLI Deployment

### Frontend Deployment

```powershell
# Navigate to frontend
cd frontend

# Login to Vercel (প্রথমবার)
vercel login

# Deploy to production
vercel --prod

# Get deployment URL
vercel ls
```

### Admin Panel Deployment

```powershell
# Navigate to admin panel
cd admin-panel

# Deploy to production
vercel --prod
```

---

## 🎯 Method 3: GitHub Integration (Best for CI/CD)

### Step 1: Connect GitHub Repository

1. যান: https://vercel.com/new
2. **Import Git Repository** ক্লিক করুন
3. আপনার **social_chat_app** repository select করুন
4. **Import** ক্লিক করুন

### Step 2: Configure Frontend Project

**Project Settings:**
- **Framework Preset:** Create React App
- **Root Directory:** `frontend`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

**Environment Variables যোগ করুন:**

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_CLOUDINARY_CLOUD_NAME=dibq2ofsi
```

**Deploy করুন:**
- **Deploy** button ক্লিক করুন
- ২-৩ মিনিট অপেক্ষা করুন

### Step 3: Configure Admin Panel Project

একইভাবে admin-panel এর জন্য:

**Project Settings:**
- **Root Directory:** `admin-panel`
- Other settings same as frontend

---

## 🔧 Environment Variables Configuration

### Frontend Environment Variables

Vercel Dashboard এ যান:
1. **Settings** → **Environment Variables**
2. প্রতিটা variable add করুন:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_BASE_URL` | `https://your-ngrok-url/api` | Production |
| `REACT_APP_FIREBASE_API_KEY` | Your Firebase key | Production |
| `REACT_APP_CLOUDINARY_CLOUD_NAME` | `dibq2ofsi` | Production |

**Important:** ngrok URL প্রতিবার change হয়, তাই এটা manually update করতে হবে।

### Admin Panel Environment Variables

Admin panel এর জন্যও same process follow করুন।

---

## 🔄 Auto-Deploy Setup (Git Push এর সাথে)

### Automatic Deployments

GitHub Integration ব্যবহার করলে:

```powershell
# Code change করুন
# Commit করুন
git add .
git commit -m "Updated feature"

# Push করুন
git push origin master
```

**Vercel automatically:**
- আপনার code pull করবে
- Build করবে
- Deploy করবে
- নতুন URL generate করবে

### Preview Deployments

```powershell
# Create feature branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature
```

Vercel **preview deployment** তৈরি করবে (production এ affect করবে না)।

---

## 📊 Vercel Dashboard

### Deployment Status দেখুন

1. যান: https://vercel.com/dashboard
2. আপনার projects দেখবেন
3. Click করে details দেখুন:
   - Build logs
   - Deployment history
   - Analytics
   - Custom domains

### Deployment URLs

```
Production: https://social-chat-frontend.vercel.app
Preview: https://social-chat-frontend-git-feature-username.vercel.app
```

---

## 🔗 Custom Domain Setup (Optional)

### Add Custom Domain

1. **Vercel Dashboard** → **Your Project** → **Settings** → **Domains**
2. **Add** button ক্লিক করুন
3. আপনার domain name দিন (e.g., `mychat.com`)
4. DNS records configure করুন (Vercel guide দেখাবে)

**DNS Configuration:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🐛 Troubleshooting (সমস্যা সমাধান)

### ❌ Build Failed

**Check Build Logs:**
1. Vercel Dashboard → Your Project → Deployments
2. Failed deployment ক্লিক করুন
3. **Building** section এ error দেখুন

**Common Issues:**
- **Missing dependencies:** `package.json` check করুন
- **Build errors:** Local এ `npm run build` চালান
- **Environment variables:** সব required variables add করেছেন কিনা

### ❌ "Module not found" Error

**Solution:**
```powershell
# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Test build locally
npm run build

# Commit and redeploy
git add .
git commit -m "Fixed dependencies"
git push
```

### ❌ API Calls Failing

**Check:**
1. `REACT_APP_API_BASE_URL` correctly set করা আছে কিনা
2. ngrok running আছে কিনা: `.\scripts\start-all-servers.ps1`
3. Backend API accessible কিনা: `curl https://your-ngrok-url/api/health`

**Update API URL:**
```powershell
# Get ngrok URL
# Update in Vercel Environment Variables
# Redeploy (automatic if GitHub connected)
```

### ❌ Firebase Errors on Production

**Solution:**
1. Firebase credentials verify করুন
2. Firebase Console এ web app registered আছে কিনা check করুন
3. Domain whitelist করুন: Firebase Console → Authentication → Settings → Authorized domains

---

## 📖 Vercel CLI Commands Reference

```powershell
# Login
vercel login

# Deploy (preview)
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url

# View logs
vercel logs deployment-url

# Environment variables
vercel env ls
vercel env add VARIABLE_NAME
vercel env rm VARIABLE_NAME

# Alias management
vercel alias
vercel alias set deployment-url custom-domain.com

# Project settings
vercel project ls
vercel project rm project-name
```

---

## 🎯 Complete Deployment Checklist

### Frontend Deployment

- [ ] Git repository committed
- [ ] Firebase configured (`FIREBASE_SETUP_GUIDE.md`)
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged in to Vercel (`vercel login`)
- [ ] Environment variables prepared
- [ ] Deployed frontend (`vercel --prod` in `frontend/`)
- [ ] Deployment URL copied
- [ ] Tested live frontend URL

### Admin Panel Deployment

- [ ] Deployed admin panel (`vercel --prod` in `admin-panel/`)
- [ ] Admin deployment URL copied
- [ ] Tested admin panel login

### Post-Deployment

- [ ] ngrok running (`.\scripts\start-all-servers.ps1`)
- [ ] API URL updated in Vercel env vars
- [ ] Redeployed with new API URL
- [ ] All pages tested
- [ ] Firebase authentication tested
- [ ] Cloudinary image upload tested

---

## 🚀 Quick Reference

| Action | Command |
|--------|---------|
| **Install CLI** | `npm install -g vercel` |
| **Login** | `vercel login` |
| **Deploy Preview** | `vercel` |
| **Deploy Production** | `vercel --prod` |
| **View Deployments** | `vercel ls` |
| **View Logs** | `vercel logs` |
| **Automated Deploy** | `.\scripts\deploy-vercel.ps1` |

---

## 📌 Important Notes

1. **ngrok URL Change:** প্রতিবার ngrok restart করলে URL change হয়, Vercel env vars update করতে হবে।

2. **Free Tier Limits:**
   - Vercel Hobby (Free): 100 GB bandwidth/month
   - Unlimited deployments
   - Automatic SSL certificates

3. **Build Time:** First deployment ২-৫ মিনিট সময় নেয়।

4. **Preview vs Production:**
   - `vercel` = Preview deployment
   - `vercel --prod` = Production deployment

5. **GitHub Integration:** Automatic deployments এর জন্য GitHub integration best।

---

## ✅ Next Steps

**Deployment সম্পূর্ণ হলে:**

1. **Generate Live URLs** (সব pages এর জন্য)
2. **Update ngrok URL** এবং redeploy
3. **Test all features** live environment এ
4. **Setup CI/CD** for automatic deployments
5. **Build Android APK** এবং Firebase App Distribution

**Continue to:** `LIVE_TESTING_SETUP_GUIDE.md` → Step 5

---

**🎉 Vercel Deployment Complete!**

এখন আপনার app live এবং accessible from anywhere! 🌐
