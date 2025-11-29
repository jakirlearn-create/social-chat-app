# 🚂 Railway.app Backend Deployment Guide

## ✅ Step 1: Railway Account তৈরি করুন

1. এই লিংকে যান: **https://railway.app/**
2. "Login" বাটনে ক্লিক করুন
3. **"GitHub"** দিয়ে sign up করুন
4. GitHub authorization দিন

---

## ✅ Step 2: New Project তৈরি করুন

1. Railway Dashboard এ যাওয়ার পর **"New Project"** ক্লিক করুন
2. **"Deploy from GitHub repo"** সিলেক্ট করুন
3. আপনার **`social-chat-app`** repository সিলেক্ট করুন
4. **Root Directory** সেটিংসে যান এবং লিখুন: `/backend`

---

## ✅ Step 3: Environment Variables যোগ করুন

Railway Dashboard এ **Variables** tab এ যান এবং এই variables যোগ করুন:

```env
MONGODB_URI=mongodb+srv://jakirlearn:Jakir%25404219@fwp.kr8blow.mongodb.net/social_chat_app?retryWrites=true&w=majority

JWT_SECRET=fwp_audiochat_jwt_secret_key_2025_super_secure

PORT=8000

NODE_ENV=production

FRONTEND_URL=https://frontend-jpkcoc8pk-fwps-projects-8ef3c28d.vercel.app
```

**⚠️ Important:** MongoDB URI তে `%25` use করুন (double encoding)

---

## ✅ Step 4: Deploy Settings

1. **Build Command**: (খালি রাখুন - npm install automatically হবে)
2. **Start Command**: `npm start`
3. **Port**: Railway automatically detect করবে

---

## ✅ Step 5: Deploy করুন!

1. **"Deploy"** বাটনে ক্লিক করুন
2. Railway automatically build এবং deploy করবে (2-3 মিনিট লাগবে)
3. Deploy হলে একটা **public URL** পাবেন (যেমন: `https://your-app.up.railway.app`)

---

## ✅ Step 6: Frontend এ Backend URL Update করুন

Deploy হওয়ার পর Railway থেকে আপনার backend URL copy করুন এবং:

1. **Frontend**: `frontend/src/config/api.js` file এ `API_BASE_URL` update করুন
2. **Admin Panel**: `admin-panel/src/services/authService.js` file এ `API_BASE_URL` update করুন
3. Vercel এ redeploy করুন

---

## 🎯 Railway.app এর সুবিধা

✅ **Free Tier**: $5 credit/month (আপনার app এর জন্য যথেষ্ট)
✅ **Auto HTTPS**: Automatic SSL certificate
✅ **Zero CORS Issues**: Proper headers support
✅ **Live Logs**: Real-time logs দেখতে পারবেন
✅ **Auto Deploy**: Git push করলেই automatic deploy হবে
✅ **MongoDB Support**: Direct connection, কোনো issue নেই

---

## 🔧 যদি কোনো সমস্যা হয়

1. Railway Dashboard এ **Logs** tab দেখুন
2. Environment variables সঠিক আছে কিনা check করুন
3. Root directory `/backend` set করা আছে কিনা verify করুন

---

## 📞 পরবর্তী ধাপ

Railway deploy complete হলে আমাকে backend URL দিন, আমি:
1. Frontend এ update করব
2. Admin Panel এ update করব  
3. Vercel এ redeploy করব
4. End-to-end test করব

**এখন Railway.app এ গিয়ে account তৈরি করুন এবং deploy শুরু করুন!** 🚀
