# 🚀 সম্পূর্ণ Deployment & Testing Checklist

**প্রোজেক্ট:** Social Chat App  
**তারিখ:** নভেম্বর ২৬, ২০২৫  
**স্ট্যাটাস:** Local Development → Online Deployment

---

## 📌 Quick Status Overview

```
✅ = সম্পূর্ণ হয়েছে
🔄 = প্রগতিতে আছে
⏳ = শুরু হয়নি
❌ = সমস্যা আছে
```

---

## 🔹 ১) Git & Cloud Deploy প্রস্তুতি

### Git Repository Setup

- [ ] ⏳ **Local Git Initialize**
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Social Chat App complete codebase"
  ```

- [ ] ⏳ **GitHub Repository তৈরি**
  - যান: https://github.com/new
  - Repository name: `social-chat-app`
  - Visibility: Private (recommended)
  - Initialize: Skip (already have code)

- [ ] ⏳ **Remote Repository Connect**
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/social-chat-app.git
  git branch -M main
  git push -u origin main
  ```

- [ ] ⏳ **Branch Structure তৈরি**
  ```bash
  # Development branch
  git checkout -b dev
  git push -u origin dev
  
  # Feature branch example
  git checkout -b feature/posts-page
  ```

- [ ] ⏳ **`.env` Files Setup করুন**
  - Backend `.env` তৈরি করুন
  - Frontend `.env` তৈরি করুন
  - `.env.example` files তৈরি করুন (template)

### Cloud Platform Selection

- [ ] ⏳ **Backend Deploy Platform Select:**
  - **Option 1:** Render.com (সহজ, free tier)
  - **Option 2:** Railway.app (modern, auto-deploy)
  - **Option 3:** Heroku (পরিচিত, paid)
  - **Option 4:** AWS EC2 (advanced)

- [ ] ⏳ **Frontend Deploy Platform Select:**
  - **Option 1:** Vercel (recommended for React)
  - **Option 2:** Netlify (সহজ)
  - **Option 3:** Firebase Hosting
  - **Option 4:** GitHub Pages

- [ ] ⏳ **Database Platform Select:**
  - **Option 1:** MongoDB Atlas (free 512MB)
  - **Option 2:** Firebase Firestore
  - **Option 3:** Your current MongoDB server

---

## 🔹 ২) Backend / API Online Testing সেটআপ

### Local Backend Public Access (Ngrok)

- [ ] ⏳ **Ngrok Install করুন**
  ```bash
  # Download from: https://ngrok.com/download
  # Or via Chocolatey:
  choco install ngrok
  ```

- [ ] ⏳ **Backend Server Start করুন**
  ```bash
  cd C:\Users\User\social_chat_app\backend
  npm start
  # Server running: http://localhost:8000
  ```

- [ ] ⏳ **Ngrok Tunnel তৈরি করুন**
  ```bash
  ngrok http 8000
  # Output: https://abc123.ngrok.io
  ```

- [ ] ⏳ **Frontend `.env` Update করুন**
  ```env
  REACT_APP_API_BASE_URL=https://abc123.ngrok.io
  ```

- [ ] ⏳ **Frontend Restart করুন**
  ```bash
  cd C:\Users\User\social_chat_app\frontend
  npm start
  ```

### Backend API Testing

- [ ] ⏳ **Health Check API Test**
  ```bash
  curl https://abc123.ngrok.io/api/health
  # Expected: { status: "ok" }
  ```

- [ ] ⏳ **Authentication APIs Test**
  - `/api/auth/register` - POST
  - `/api/auth/login` - POST
  - `/api/auth/verify-otp` - POST

- [ ] ⏳ **User APIs Test**
  - `/api/users/profile` - GET
  - `/api/users/:id` - GET
  - `/api/users/search` - GET

- [ ] ⏳ **Posts APIs Test**
  - `/api/posts` - GET (সব posts)
  - `/api/posts/:id` - GET (single post)
  - `/api/posts/create` - POST
  - `/api/posts/:id/like` - POST
  - `/api/posts/:id/comment` - POST

- [ ] ⏳ **Messenger APIs Test**
  - `/api/conversations` - GET
  - `/api/messages/:conversationId` - GET
  - `/api/messages/send` - POST

- [ ] ⏳ **Wallet APIs Test**
  - `/api/wallet/balance` - GET
  - `/api/wallet/deposit` - POST
  - `/api/wallet/withdraw` - POST

### Database Connection

- [ ] ⏳ **MongoDB Atlas Setup (if using cloud)**
  1. যান: https://www.mongodb.com/cloud/atlas
  2. Create free cluster
  3. Create database user
  4. Whitelist IP: `0.0.0.0/0` (all IPs for testing)
  5. Get connection string
  6. Update `backend/.env`:
     ```env
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social_chat_app
     ```

- [ ] ⏳ **Database Connection Test**
  ```bash
  cd backend
  node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e))"
  ```

### Firebase Setup (if using)

- [ ] ⏳ **Firebase Project তৈরি**
  - যান: https://console.firebase.google.com/
  - Create new project: "Social Chat App"
  - Enable Firestore Database
  - Enable Authentication (Email, Phone, Google)
  - Enable Storage (for uploads)

- [ ] ⏳ **Firebase Config Copy করুন**
  ```javascript
  // frontend/src/config/firebase.js
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  ```

---

## 🔹 ৩) App UI/UX পেজ Testing Checklist

### A) Login / Register Pages

**Testing URL:** `http://localhost:3000/login`

- [ ] ⏳ **Phone Number Login**
  - Input field কাজ করছে
  - OTP send হচ্ছে
  - OTP verify হচ্ছে
  - Success → Home page redirect

- [ ] ⏳ **Email Login**
  - Email validation কাজ করছে
  - Password visibility toggle
  - "Remember me" checkbox
  - Forgot password link

- [ ] ⏳ **Google Sign-In (if integrated)**
  - Google popup খুলছে
  - User info fetch হচ্ছে
  - Profile photo load হচ্ছে

- [ ] ⏳ **Guest Mode (if enabled)**
  - Skip login button
  - Limited features access
  - "Sign up to continue" prompt

### B) Dashboard / Home Page

**Testing URL:** `http://localhost:3000/home`

- [ ] ⏳ **TopBar Components**
  - App logo দেখাচ্ছে
  - User profile photo
  - Notification bell icon
  - Settings icon

- [ ] ⏳ **Scroll Behavior**
  - Scroll up → TopBar hide
  - Scroll down → TopBar show
  - Smooth animation (300ms)

- [ ] ⏳ **Language Selector**
  - Dropdown open হচ্ছে
  - English / বাংলা / Hindi selection
  - Immediate text update
  - All pages affected

- [ ] ⏳ **Live Meeting Entry**
  - "Join Live" button visible
  - Click → Video/Audio permission request
  - Camera/Mic toggle buttons
  - Join room successful

- [ ] ⏳ **Wallet Preview**
  - Current balance দেখাচ্ছে
  - "Add Funds" button
  - "Withdraw" button
  - Quick transaction history (last 3)

### C) Wallet System

**Testing URL:** `http://localhost:3000/wallet`

- [ ] ⏳ **Wallet Page Load**
  - Balance fetch হচ্ছে
  - Transaction history load
  - Loading spinner show হচ্ছে

- [ ] ⏳ **Deposit Request**
  - Amount input field
  - Payment method selection (Bkash, Nagad, Rocket, Card)
  - Screenshot upload (optional)
  - Transaction ID input
  - Submit → Admin panel এ request যাচ্ছে

- [ ] ⏳ **Withdraw Request**
  - Available balance check
  - Minimum withdraw amount validation (e.g., ৳100)
  - Account number input
  - Confirmation modal
  - Submit → Pending status

- [ ] ⏳ **Transaction History**
  - Date filter কাজ করছে
  - Type filter (Deposit/Withdraw/Earned/Spent)
  - Status indicator (Pending/Approved/Rejected)
  - Infinite scroll বা pagination

- [ ] ⏳ **Admin Panel Sync**
  - Admin panel এ request দেখাচ্ছে
  - Approve button কাজ করছে
  - Reject button কাজ করছে
  - User wallet update হচ্ছে real-time

### D) Audio / Video Meeting

**Testing URL:** `http://localhost:3000/meeting/:roomId`

- [ ] ⏳ **Video Rendering**
  - Local video display
  - Remote participant videos (multiple)
  - Grid layout (2/4/6/9 participants)
  - Video quality indicator

- [ ] ⏳ **Mic Controls**
  - Mute/Unmute toggle
  - Mic icon animation
  - Audio level indicator (waveform)
  - Other participants see mute status

- [ ] ⏳ **Camera Controls**
  - Video on/off toggle
  - Front/Rear camera switch (mobile)
  - Black screen when off
  - Camera switch smooth

- [ ] ⏳ **Speaker Switch**
  - Earpiece/Speaker toggle
  - Bluetooth headset detection
  - Volume control slider

- [ ] ⏳ **Network Handling**
  - Poor connection warning
  - Reconnect attempt
  - Participant dropped → notification
  - Auto-reconnect on network restore

- [ ] ⏳ **Group Value Selection**
  - Group list visible
  - Select multiple users
  - "Create Group" button
  - Group chat room open

### E) Group Games

**Testing URL:** `http://localhost:3000/games`

- [ ] ⏳ **Game Lobby**
  - Available games list
  - Player count display
  - "Join" button enable/disable
  - Waiting room UI

- [ ] ⏳ **Player Join/Leave Detection**
  - Real-time player list update
  - Player avatar display
  - Ready/Not Ready status
  - Start game when all ready

- [ ] ⏳ **Real-time Points Update**
  - Score board visible
  - Points increment animation
  - Leaderboard ranking
  - Live commentary (if any)

- [ ] ⏳ **Game Over Summary**
  - Winner announcement
  - Final scores table
  - Stats (accuracy, time, etc.)
  - "Play Again" button
  - Share results button

### F) Super Admin Panel

**Testing URL:** `http://localhost:3001/super-admin`

- [ ] ⏳ **Super Admin Login**
  - Credentials: (check `ADMIN_CREDENTIALS.md`)
  - 2FA/OTP verification
  - Session timeout (30 min)

- [ ] ⏳ **Admin Management**
  - Create new admin
  - Assign permissions (Read/Write/Delete)
  - Delete admin account
  - Admin activity logs

- [ ] ⏳ **All Users List**
  - User table with pagination
  - Search by name/email/phone
  - Filter by status (Active/Banned/Suspended)
  - Sort by join date/activity

- [ ] ⏳ **User Actions**
  - Suspend user (temp ban)
  - Permanent ban
  - Unban user
  - View user profile
  - View user posts/messages

- [ ] ⏳ **Meeting Logs Viewer**
  - Meeting history table
  - Room ID, duration, participants
  - Recordings (if enabled)
  - Chat logs export

- [ ] ⏳ **Wallet Admin Requests**
  - Deposit requests list
  - Withdraw requests list
  - Approve with screenshot verification
  - Reject with reason
  - Auto-update user wallet

### G) Admin Panel (Non-Super)

**Testing URL:** `http://localhost:3001/admin`

- [ ] ⏳ **Admin Login**
  - Credentials from super admin
  - Limited dashboard view

- [ ] ⏳ **User Lists Load**
  - Assigned users only (if permission-based)
  - Basic user info
  - Recent activity

- [ ] ⏳ **Wallet Request List**
  - View pending requests
  - Cannot approve/reject (if no permission)
  - View history

- [ ] ⏳ **Single User Activity Logs**
  - Login/Logout times
  - Pages visited
  - API calls made
  - Errors encountered

- [ ] ⏳ **Meeting Live Monitor**
  - Active meetings list
  - Participant count
  - Duration
  - "Join as observer" button (if implemented)

### H) Settings Page

**Testing URL:** `http://localhost:3000/settings`

- [ ] ⏳ **Language Settings**
  - Language dropdown
  - English / বাংলা / Hindi
  - Instant UI update
  - Save preference to localStorage

- [ ] ⏳ **Profile Edit**
  - Name, bio, location fields
  - Profile photo upload
  - Cover photo upload
  - Save button → API call → Success toast

- [ ] ⏳ **Security Settings**
  - Change password
  - 2FA enable/disable
  - Login activity history
  - Device management

- [ ] ⏳ **Privacy Settings**
  - Profile visibility (Public/Friends/Private)
  - Who can message me
  - Who can see my posts
  - Block list

- [ ] ⏳ **Notifications**
  - Push notifications toggle
  - Email notifications
  - SMS notifications
  - Sound/Vibration preferences

- [ ] ⏳ **Payment Options**
  - Saved payment methods
  - Add new card/account
  - Set default payment method

- [ ] ⏳ **Support Page**
  - FAQ accordion
  - Contact form
  - Live chat widget (if integrated)
  - Report a bug button

---

## 🌐 ৪) প্রতিটি পেজ "অনলাইনে টেস্ট" করার রুটিন

### Daily Testing Workflow

- [ ] ⏳ **১. Code Change করুন**
  ```bash
  # Example: Update PostsPage.js
  code frontend/src/pages/PostsPage.js
  ```

- [ ] ⏳ **২. Git Commit + Push**
  ```bash
  git add .
  git commit -m "feat: Add reaction animations to posts"
  git push origin dev
  ```

- [ ] ⏳ **৩. Auto-Deploy Check**
  - Vercel/Netlify dashboard check করুন
  - Build status: Success / Failed
  - Deploy preview URL পান

- [ ] ⏳ **৪. Mobile Build (if testing app)**
  ```bash
  # For React Native / Expo
  expo build:android
  expo build:ios
  
  # Upload to Firebase App Distribution
  firebase appdistribution:distribute app-release.apk --groups testers
  ```

- [ ] ⏳ **৫. মোবাইলে Download করুন**
  - Firebase email notification
  - Download link click
  - Install APK (Android)

- [ ] ⏳ **৬. API Live Server Ping**
  ```bash
  # Postman বা curl দিয়ে
  curl https://your-backend.onrender.com/api/health
  ```

- [ ] ⏳ **৭. UI → Live Data Load**
  - Browser dev tools open করুন (F12)
  - Network tab check করুন
  - API calls successful কিনা
  - Response data correct কিনা

- [ ] ⏳ **৮. Error Logs Capture**
  - Console errors দেখুন
  - Backend logs check করুন:
    ```bash
    # Render.com logs
    https://dashboard.render.com/web/YOUR_SERVICE/logs
    
    # Railway logs
    railway logs
    ```

---

## 🧩 ৫) Device Matrix Test

### Android Testing

- [ ] ⏳ **Small Screen (4.7" - 5.5")**
  - Device: Samsung Galaxy A10, Redmi 9A
  - Resolution: 720x1480
  - Layout responsive কিনা
  - Text readable কিনা
  - Buttons accessible

- [ ] ⏳ **Large Screen (6" - 6.7")**
  - Device: Samsung Galaxy S21, OnePlus 9
  - Resolution: 1080x2400
  - Cards/images proper size
  - Navigation comfortable

- [ ] ⏳ **Tablet (7" - 10")**
  - Device: Samsung Tab A, iPad
  - Resolution: 1200x1920
  - Multi-column layout
  - Side navigation visible

### Chromebook Testing

- [ ] ⏳ **Chrome OS App**
  - Install from Chrome Web Store বা PWA
  - Keyboard navigation
  - Mouse + Touch support
  - Window resize handling

### Network Testing

- [ ] ⏳ **Low Network Mode**
  ```
  Chrome DevTools → Network → Throttling → Slow 3G
  ```
  - Page load time < 10 seconds
  - Images lazy loading
  - Loading skeleton দেখাচ্ছে

- [ ] ⏳ **Offline Mode**
  ```
  Chrome DevTools → Network → Offline
  ```
  - "No internet" message
  - Cached data show হচ্ছে
  - Retry button works

- [ ] ⏳ **Slow 3G Test**
  - Upload large image (5MB)
  - Progress bar accurate
  - Cancel upload works
  - Resume on reconnect

### Theme Testing

- [ ] ⏳ **Dark Mode Test**
  - Settings → Toggle dark mode
  - All pages dark background
  - Text readable (contrast ratio > 4.5:1)
  - Images not too bright

- [ ] ⏳ **Light Mode Test**
  - Settings → Toggle light mode
  - Clean white background
  - Colors vibrant
  - Shadows visible

---

## 🎯 ৬) Deployment Final Checks

### Build Optimization

- [ ] ⏳ **Frontend Build Size Check**
  ```bash
  cd frontend
  npm run build
  # Check build/ folder size
  du -sh build/
  # Target: < 5MB recommended
  ```

- [ ] ⏳ **Bundle Analyzer Run**
  ```bash
  npm install --save-dev webpack-bundle-analyzer
  npm run analyze
  ```
  - Remove unused libraries
  - Code splitting করুন
  - Dynamic imports use করুন

- [ ] ⏳ **Backend Build**
  ```bash
  cd backend
  npm run build
  # If TypeScript: tsc
  ```

### Crash Logs Setup

- [ ] ⏳ **Sentry Integration (Recommended)**
  ```bash
  npm install @sentry/react @sentry/tracing
  ```
  ```javascript
  // frontend/src/index.js
  import * as Sentry from "@sentry/react";
  
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: "production",
    tracesSampleRate: 1.0,
  });
  ```

- [ ] ⏳ **Error Boundary Setup**
  ```javascript
  // frontend/src/components/ErrorBoundary.js
  class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
      Sentry.captureException(error);
    }
  }
  ```

### Permission Flow

- [ ] ⏳ **Camera Permission**
  - First time request
  - Denied → Show instruction
  - Granted → Access camera

- [ ] ⏳ **Microphone Permission**
  - Audio recording test
  - Permission denied handling

- [ ] ⏳ **Location Permission (if needed)**
  - Get current location
  - Use in profile/posts

- [ ] ⏳ **Notification Permission**
  - Browser push notification request
  - FCM token generate করুন

### App Store Preparation

- [ ] ⏳ **APK/AAB Build (Android)**
  ```bash
  # Build release APK
  cd android
  ./gradlew assembleRelease
  
  # Build AAB for Play Store
  ./gradlew bundleRelease
  ```

- [ ] ⏳ **App Screenshots (5-8 images)**
  - Home screen
  - Chat screen
  - Video call
  - Games
  - Wallet
  - Settings

- [ ] ⏳ **App Icon Sizes**
  - 512x512 (Play Store feature graphic)
  - 192x192 (App icon)
  - 48x48, 72x72, 96x96, 144x144 (various densities)

- [ ] ⏳ **Privacy Policy URL**
  - Create privacy policy page
  - Host on your domain
  - Add to Play Store listing

- [ ] ⏳ **Terms of Service URL**
  - Create terms page
  - Legal compliance
  - User agreement

---

## 📦 Quick Deploy Commands

### Frontend Deploy to Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
# Follow prompts
```

### Backend Deploy to Render.com

```bash
# Go to: https://dashboard.render.com/
# 1. Click "New +" → "Web Service"
# 2. Connect GitHub repo
# 3. Select branch: main
# 4. Build Command: cd backend && npm install
# 5. Start Command: cd backend && npm start
# 6. Add Environment Variables
# 7. Click "Create Web Service"
```

### MongoDB Atlas Connection

```env
# backend/.env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/social_chat_app?retryWrites=true&w=majority
```

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Error

**Error:** `Access to fetch at 'https://api.example.com' from origin 'https://app.example.com' has been blocked by CORS`

**Solution:**
```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue 2: MongoDB Connection Timeout

**Error:** `MongoTimeoutError: Server selection timed out after 30000 ms`

**Solution:**
1. Whitelist IP in MongoDB Atlas: `0.0.0.0/0`
2. Check connection string format
3. Ensure database user has correct permissions

### Issue 3: Build Failed on Vercel

**Error:** `Module not found: Can't resolve './components/X'`

**Solution:**
```bash
# Case-sensitive file imports fix
# Ensure import matches actual filename
import MyComponent from './components/MyComponent'; // Correct
import mycomponent from './components/mycomponent'; // Wrong
```

### Issue 4: Environment Variables Not Working

**Error:** `process.env.REACT_APP_API_URL is undefined`

**Solution:**
- Restart development server after adding `.env`
- Vercel: Add in Project Settings → Environment Variables
- Prefix with `REACT_APP_` for frontend

---

## ✅ Testing Complete Checklist

**এই checklist সম্পূর্ণ হলে আপনার অ্যাপ production-ready!**

- [ ] ⏳ Git repository created & pushed
- [ ] ⏳ Backend deployed online
- [ ] ⏳ Frontend deployed online
- [ ] ⏳ Database connected to cloud
- [ ] ⏳ All APIs tested with Postman
- [ ] ⏳ Login/Signup working
- [ ] ⏳ Posts page functional
- [ ] ⏳ Messenger working
- [ ] ⏳ Video/Audio calls tested
- [ ] ⏳ Wallet system operational
- [ ] ⏳ Admin panel accessible
- [ ] ⏳ Mobile responsive
- [ ] ⏳ Dark mode tested
- [ ] ⏳ Language switching works
- [ ] ⏳ Error handling implemented
- [ ] ⏳ Loading states added
- [ ] ⏳ Performance optimized
- [ ] ⏳ Security measures in place
- [ ] ⏳ Privacy policy created
- [ ] ⏳ Ready for App Store submission

---

**আরো সাহায্য লাগলে বলুন! 🚀**
