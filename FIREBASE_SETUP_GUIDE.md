# 🔥 Firebase Complete Setup Guide
## সম্পূর্ণ Firebase Configuration (বাংলায়)

---

## ⚡ Quick Check (দ্রুত পরীক্ষা)

**আগে Firebase configured আছে কিনা চেক করুন:**

```powershell
.\scripts\check-firebase.ps1
```

যদি "✅ Firebase is configured!" দেখান, তাহলে আপনি এই guide skip করতে পারেন।

---

## 📝 Step 1: Firebase Project তৈরি করুন

### 1.1 Firebase Console খুলুন
- ব্রাউজারে যান: https://console.firebase.google.com/
- Google account দিয়ে login করুন

### 1.2 নতুন Project তৈরি
1. **"Add project"** বা **"Create a project"** ক্লিক করুন
2. Project Name দিন: `social-chat-app` (বা যেকোনো নাম)
3. **Continue** ক্লিক করুন
4. Google Analytics: **Enable** করুন (recommended)
5. Analytics account select করুন বা নতুন তৈরি করুন
6. **Create project** ক্লিক করুন
7. Setup complete হতে ২-৩ মিনিট অপেক্ষা করুন
8. **Continue** ক্লিক করুন

---

## 📱 Step 2: Web App যোগ করুন

### 2.1 Web App Register করুন
1. Project Overview পেজে থাকুন
2. **"</>"** (Web) আইকন ক্লিক করুন
3. App nickname: `social-chat-web` দিন
4. **"Also set up Firebase Hosting"** - এটা **চেক করুন না** (পরে করব)
5. **"Register app"** ক্লিক করুন

### 2.2 Firebase Configuration Copy করুন

একটা **config object** দেখাবে এরকম:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-xxxxx",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

**এই values গুলো কোথাও notepad এ save করে রাখুন!**

### 2.3 Configuration Script Run করুন

PowerShell এ এই command চালান:

```powershell
.\scripts\check-firebase.ps1
```

যখন জিজ্ঞাসা করবে **"Do you want to configure Firebase now? (y/n)"**, তখন `y` টাইপ করুন এবং আপনার Firebase credentials paste করুন।

**অথবা manually .env file edit করুন:**

`frontend\.env` ফাইল খুলুন এবং এই values গুলো replace করুন:

```env
REACT_APP_FIREBASE_API_KEY=আপনার_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=আপনার_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=আপনার_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=আপনার_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=আপনার_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=আপনার_app_id
```

---

## 🔐 Step 3: Authentication Setup করুন

### 3.1 Authentication Enable করুন
1. Firebase Console এ বাম sidebar থেকে **"Authentication"** ক্লিক করুন
2. **"Get started"** বা **"Set up sign-in method"** ক্লিক করুন

### 3.2 Email/Password Authentication Enable করুন
1. **"Sign-in method"** ট্যাব ক্লিক করুন
2. **"Email/Password"** provider ক্লিক করুন
3. **"Enable"** toggle ON করুন
4. **"Save"** ক্লিক করুন

### 3.3 (Optional) Other Providers
প্রয়োজন হলে এই providers ও enable করতে পারেন:
- Google Sign-in
- Facebook Login
- Phone Authentication

---

## 💾 Step 4: Firestore Database Setup করুন

### 4.1 Database তৈরি করুন
1. Firebase Console এ **"Firestore Database"** ক্লিক করুন
2. **"Create database"** ক্লিক করুন

### 4.2 Security Rules নির্বাচন করুন

**Testing এর জন্য:**
- **"Start in test mode"** select করুন
- এটা ৩০ দিনের জন্য সব access allow করবে
- **"Next"** ক্লিক করুন

**Production এর জন্য (পরে change করবেন):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4.3 Location Select করুন
1. আপনার কাছাকাছি location select করুন (e.g., **asia-south1** for India)
2. **"Enable"** ক্লিক করুন
3. Database create হতে কিছুক্ষণ অপেক্ষা করুন

---

## 📦 Step 5: Cloud Storage Setup করুন

### 5.1 Storage Enable করুন
1. Firebase Console এ **"Storage"** ক্লিক করুন
2. **"Get started"** ক্লিক করুন

### 5.2 Security Rules
**Testing এর জন্য:**
- Default rules accept করুন
- **"Next"** ক্লিক করুন

**Production Rules (পরে change করবেন):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5.3 Location Confirm করুন
- Firestore এর same location automatically select হবে
- **"Done"** ক্লিক করুন

---

## 📲 Step 6: App Distribution (Android APK এর জন্য)

এটা পরে Android build করার সময় setup করব। এখন skip করতে পারেন।

**যখন Android build করবেন:**

1. **"App Distribution"** section এ যান
2. **"Get started"** ক্লিক করুন
3. Testers যোগ করুন (email addresses)
4. Firebase CLI দিয়ে APK upload করবেন

---

## ✅ Step 7: Verification (যাচাই করুন)

### 7.1 Configuration Check করুন

```powershell
.\scripts\check-firebase.ps1
```

এটা দেখাবে:
- ✅ Firebase credentials configured
- ✅ Config file exists
- Services status

### 7.2 Frontend Start করে Test করুন

```powershell
cd frontend
npm start
```

Browser এর **Console** (F12) খুলে check করুন:
- কোনো Firebase error আছে কিনা
- Authentication connection working কিনা

### 7.3 Test Firestore Connection

আপনার app এ register/login করে দেখুন Firebase Authentication কাজ করছে কিনা।

---

## 🔧 Troubleshooting (সমস্যা সমাধান)

### ❌ "Firebase: Error (auth/configuration-not-found)"

**সমাধান:**
1. `.env` file সঠিকভাবে configured আছে কিনা check করুন
2. Frontend server restart করুন: `npm start`

### ❌ "Firebase: Error (auth/api-key-not-valid)"

**সমাধান:**
1. Firebase Console থেকে API key আবার copy করুন
2. `.env` file এ paste করুন (কোনো extra space রাখবেন না)

### ❌ "Firestore: Missing or insufficient permissions"

**সমাধান:**
1. Firebase Console → Firestore Database → Rules
2. Test mode enable করুন বা custom rules set করুন

### ❌ "Storage: User does not have permission"

**সমাধান:**
1. Firebase Console → Storage → Rules
2. Authentication required rules set করুন

---

## 📊 Firebase Console Quick Links

| Service | URL |
|---------|-----|
| **Project Overview** | https://console.firebase.google.com/project/_/overview |
| **Authentication** | https://console.firebase.google.com/project/_/authentication |
| **Firestore Database** | https://console.firebase.google.com/project/_/firestore |
| **Storage** | https://console.firebase.google.com/project/_/storage |
| **App Distribution** | https://console.firebase.google.com/project/_/appdistribution |
| **Project Settings** | https://console.firebase.google.com/project/_/settings/general |

*(URL এর `_` এর জায়গায় আপনার project ID বসবে)*

---

## 🎯 Next Steps (পরবর্তী ধাপ)

✅ **Firebase Setup Complete হলে:**

1. **Vercel Deployment Setup করুন** (Frontend & Admin Panel)
2. **ngrok দিয়ে Backend Public করুন**
3. **Live Testing URLs Generate করুন**

**Vercel setup শুরু করতে:**

```powershell
# Vercel CLI install করুন
npm install -g vercel

# Frontend deploy করুন
cd frontend
vercel
```

---

## 💡 Pro Tips

1. **Firebase Quotas দেখুন:**
   - Spark Plan (Free): 50K read/day, 20K write/day
   - প্রয়োজনে Blaze Plan (Pay as you go) upgrade করুন

2. **Security Rules Production এ Update করুন:**
   - Test mode ৩০ দিন পর expire হয়
   - Production rules দিয়ে replace করুন

3. **Indexes তৈরি করুন:**
   - Complex Firestore queries এর জন্য index প্রয়োজন
   - Console এ error থেকে auto-create করতে পারবেন

4. **Firebase CLI Install করুন (পরে প্রয়োজন হবে):**
   ```powershell
   npm install -g firebase-tools
   firebase login
   ```

---

**🎉 Firebase Setup সম্পূর্ণ!**

এখন Vercel Deployment এ যান → `LIVE_TESTING_SETUP_GUIDE.md` দেখুন।
