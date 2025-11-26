# 🚀 Quick Start Deployment Guide

## ১. লোকাল সার্ভার চালু করা (Local Development)

### Backend Start:
```bash
cd backend
npm install
npm start
# Server: http://localhost:8000
```

### Frontend Start:
```bash
cd frontend
npm install
npm start
# App: http://localhost:3000
```

### Admin Panel Start:
```bash
cd admin-panel
npm install
npm start
# Admin: http://localhost:3001
```

---

## ২. Ngrok দিয়ে অনলাইনে Test (Temporary Online)

### Step 1: Install Ngrok
```bash
# Download: https://ngrok.com/download
# Or Chocolatey:
choco install ngrok

# Login to ngrok (one-time):
ngrok authtoken YOUR_AUTH_TOKEN
```

### Step 2: Backend Ngrok Tunnel
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Create ngrok tunnel
ngrok http 8000
# Output: https://abc123.ngrok.io
```

### Step 3: Update Frontend .env
```env
# frontend/.env
REACT_APP_API_BASE_URL=https://abc123.ngrok.io
```

### Step 4: Restart Frontend
```bash
cd frontend
npm start
# Now API calls go to ngrok URL
```

---

## ৩. GitHub এ Code Push (Version Control)

### Initial Setup:
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Social Chat App v1.0"

# Create GitHub repo:
# Go to: https://github.com/new
# Name: social-chat-app
# Private recommended

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/social-chat-app.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Daily Workflow:
```bash
# Make changes to code
# ...

# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: Add posts page reactions"

# Push to GitHub
git push origin main
```

---

## ৪. Backend Deploy (Render.com) - বিনামূল্যে

### Step 1: Create Account
- যান: https://render.com/
- Sign up with GitHub

### Step 2: Connect Repository
1. Dashboard → "New +" → "Web Service"
2. Connect GitHub account
3. Select repository: `social-chat-app`
4. Root Directory: `backend`

### Step 3: Configure Build
```
Build Command: npm install
Start Command: npm start
Environment: Node
```

### Step 4: Add Environment Variables
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
```

### Step 5: Deploy
- Click "Create Web Service"
- Wait 5-10 minutes
- Your backend URL: `https://your-app.onrender.com`

---

## ৫. Frontend Deploy (Vercel) - বিনামূল্যে

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod

# Follow prompts:
# - Set up project? Yes
# - Link to existing project? No
# - Project name: social-chat-app
# - Framework: Create React App
# - Build command: npm run build
# - Output directory: build
```

### Option B: Vercel Dashboard
1. যান: https://vercel.com/
2. Sign up with GitHub
3. "New Project"
4. Import `social-chat-app` repository
5. Root Directory: `frontend`
6. Framework Preset: Create React App
7. Environment Variables:
   ```
   REACT_APP_API_BASE_URL=https://your-backend.onrender.com
   REACT_APP_SOCKET_URL=https://your-backend.onrender.com
   ```
8. Deploy

### Your Frontend URL:
```
https://social-chat-app.vercel.app
```

---

## ৬. Database Setup (MongoDB Atlas) - বিনামূল্যে

### Step 1: Create Account
- যান: https://www.mongodb.com/cloud/atlas
- Sign up free

### Step 2: Create Cluster
1. Create Cluster → Free (M0)
2. Provider: AWS
3. Region: Mumbai (ap-south-1) বা যেকোনো
4. Cluster Name: SocialChatDB

### Step 3: Create Database User
1. Database Access → Add New User
2. Username: `socialchat_user`
3. Password: `Generate Secure Password` (copy it!)
4. Built-in Role: Atlas Admin

### Step 4: Whitelist IP
1. Network Access → Add IP Address
2. Add: `0.0.0.0/0` (Allow from anywhere)
3. Confirm

### Step 5: Get Connection String
1. Clusters → Connect
2. Connect your application
3. Driver: Node.js
4. Copy connection string:
   ```
   mongodb+srv://socialchat_user:<password>@socialchatdb.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Backend .env
```env
MONGODB_URI=mongodb+srv://socialchat_user:YOUR_PASSWORD@socialchatdb.xxxxx.mongodb.net/social_chat_app?retryWrites=true&w=majority
```

### Step 7: Update Render.com
- Render Dashboard → Your Service
- Environment → Add Variable
- Key: `MONGODB_URI`
- Value: (paste connection string)
- Save Changes → Auto redeploy

---

## ৭. Firebase Setup (Optional - for Auth/Storage)

### Step 1: Create Project
1. যান: https://console.firebase.google.com/
2. Add Project: "Social Chat App"
3. Google Analytics: Enable (optional)

### Step 2: Enable Services
**Authentication:**
- Build → Authentication → Get Started
- Sign-in method:
  - Email/Password: Enable
  - Phone: Enable (configure later)
  - Google: Enable

**Firestore Database:**
- Build → Firestore Database → Create
- Mode: Production mode
- Location: asia-south1 (Mumbai)

**Storage:**
- Build → Storage → Get Started
- Mode: Production mode

### Step 3: Get Firebase Config
1. Project Settings (⚙️)
2. Your apps → Web app → Add app
3. App nickname: "Social Chat Web"
4. Copy config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "social-chat-app.firebaseapp.com",
  projectId: "social-chat-app",
  storageBucket: "social-chat-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 4: Add to Frontend .env
```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=social-chat-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=social-chat-app
REACT_APP_FIREBASE_STORAGE_BUCKET=social-chat-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 5: Redeploy Frontend
```bash
# If using Vercel CLI:
cd frontend
vercel --prod

# Or Vercel Dashboard:
# Update environment variables → Redeploy
```

---

## ৮. Testing Your Live App

### Backend Health Check:
```bash
curl https://your-backend.onrender.com/api/health
# Expected: {"status":"ok"}
```

### Frontend Test:
```
Open: https://social-chat-app.vercel.app
Check:
- Page loads
- Login works
- API calls successful (check Network tab)
```

### Database Connection Test:
```bash
# In backend terminal:
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ DB Connected')).catch(e => console.log('❌ Error:', e));"
```

---

## ৯. Mobile Testing (Android APK)

### For Expo/React Native:
```bash
# Build APK
expo build:android

# Download APK from Expo
# Install on Android device

# Or use EAS Build:
eas build --platform android --profile preview
```

### For Web App (PWA):
1. Open app in Chrome mobile
2. Menu → "Add to Home Screen"
3. Test as installed app

---

## 🚨 Common Errors & Fixes

### Error 1: CORS Blocked
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://social-chat-app.vercel.app'
  ],
  credentials: true
}));
```

### Error 2: Module Not Found
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error 3: Build Failed on Vercel
```
Check Build Logs:
- Case-sensitive imports?
- Missing dependencies?
- Environment variables set?
```

### Error 4: MongoDB Connection Timeout
```
Solutions:
1. Check IP whitelist: 0.0.0.0/0
2. Verify connection string format
3. Check database user permissions
```

---

## 📊 Monitoring & Analytics

### Render.com Logs:
```
Dashboard → Your Service → Logs
View real-time backend logs
```

### Vercel Analytics:
```
Dashboard → Your Project → Analytics
View page visits, performance
```

### MongoDB Atlas Monitoring:
```
Clusters → Metrics
View database operations, connections
```

---

## ✅ Final Checklist

- [ ] Git repository created & pushed
- [ ] Backend deployed on Render.com
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas connected
- [ ] Environment variables configured
- [ ] CORS configured properly
- [ ] Backend health check passing
- [ ] Frontend loads successfully
- [ ] Login/Signup working
- [ ] API calls successful
- [ ] Database operations working
- [ ] Mobile responsive
- [ ] Dark mode functional
- [ ] Language switching works

---

**🎉 আপনার অ্যাপ এখন অনলাইনে live! Share করুন এবং feedback নিন!**

**Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
- Admin Panel: (Deploy separately বা subdomain use করুন)

**Questions? আমাকে জিজ্ঞাসা করুন! 🚀**
