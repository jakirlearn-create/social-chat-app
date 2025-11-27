# Social Chat App Backend - Deployment করুন

## ✅ Railway.app এ Deploy (সবচেয়ে সহজ!)

### ধাপ ১: Railway.app Account তৈরি করুন
1. যান: https://railway.app/
2. "Start a New Project" ক্লিক করুন
3. GitHub দিয়ে login করুন

### ধাপ ২: Backend Deploy করুন
1. "Deploy from GitHub repo" সিলেক্ট করুন
2. আপনার `social_chat_app` repo সিলেক্ট করুন
3. Root Directory: `/backend` লিখুন
4. Start Command: `npm start`

### ধাপ ৩: Environment Variables যোগ করুন
Settings → Variables এ যান এবং যোগ করুন:
```
MONGODB_URI=mongodb+srv://jakirlearn:Jakir%404219@fwp.kr8blow.mongodb.net/social_chat_app?retryWrites=true&w=majority&appName=FWP
JWT_SECRET=fwp_audiochat_jwt_secret_key_2025_super_secure
PORT=8080
NODE_ENV=production
```

### ধাপ ৪: Deploy করুন
- Railway স্বয়ংক্রিয়ভাবে deploy করবে
- আপনাকে একটা public URL দেবে (যেমন: `https://your-app.railway.app`)

---

## অথবা Render.com (আরেকটি ফ্রি অপশন)

### ধাপ ১: Render.com Account
1. যান: https://render.com/
2. GitHub দিয়ে signup করুন

### ধাপ ২: New Web Service
1. "New +" → "Web Service" ক্লিক করুন
2. GitHub repo connect করুন
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`

### ধাপ ৩: Environment Variables
```
MONGODB_URI=mongodb+srv://jakirlearn:Jakir%404219@fwp.kr8blow.mongodb.net/social_chat_app
JWT_SECRET=fwp_audiochat_jwt_secret_key_2025_super_secure
PORT=10000
NODE_ENV=production
```

---

## 🎯 আমার পরামর্শ: Railway.app ব্যবহার করুন

কারণ:
✅ সম্পূর্ণ ফ্রি ($5 credit/month free tier)
✅ সেটআপ খুব সহজ (5 মিনিট)
✅ CORS সমস্যা নেই
✅ MongoDB এর সাথে direct connection
✅ Automatic HTTPS
✅ Real-time logs দেখতে পারবেন

এখনই Railway.app এ deploy করতে চান?
