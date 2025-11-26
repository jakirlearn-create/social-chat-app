# 🔌 ngrok Installation Guide

## ধাপ ১: ngrok ডাউনলোড করুন

1. এই লিংকে যান: **https://ngrok.com/download**
2. Windows 64-bit version ডাউনলোড করুন
3. ZIP ফাইল extract করুন
4. `ngrok.exe` ফাইলটি `C:\Windows\System32` ফোল্ডারে copy করুন (Admin permission লাগবে)

## ধাপ ২: ngrok Account তৈরি করুন

1. যান: **https://dashboard.ngrok.com/signup**
2. Email দিয়ে signup করুন (Free)
3. Login করুন

## ধাপ ৩: Auth Token পান

1. Dashboard এ যান: **https://dashboard.ngrok.com/get-started/your-authtoken**
2. Auth Token copy করুন
3. PowerShell এ এই command চালান:

```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## ধাপ ৪: Backend Server চালু করুন

```powershell
# Terminal 1: Backend start করুন
cd C:\Users\User\social_chat_app\backend
npm start
```

## ধাপ ৫: ngrok চালু করুন

```powershell
# Terminal 2: ngrok start করুন
ngrok http 8000
```

## ধাপ ৬: Public URL copy করুন

ngrok চালু হলে এরকম দেখাবে:
```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:8000
```

এই `https://abc123.ngrok-free.app` URL copy করুন।

## ধাপ ৭: API URL আপডেট করুন

এখন আমি আপনার জন্য একটি script তৈরি করেছি যা automatic API URL আপডেট করবে।

PowerShell এ চালান:
```powershell
cd C:\Users\User\social_chat_app
.\scripts\update-ngrok-url.ps1 -NgrokUrl "https://YOUR_NGROK_URL.ngrok-free.app"
```

---

## ✅ সহজ উপায় (যদি উপরের কাজ না করে)

আপনি ngrok install না করেও local testing করতে পারেন:

### Option 1: Local Network দিয়ে
```powershell
# আপনার Local IP address পান
ipconfig

# Backend start করার সময় সব interface এ listen করুন
# backend/server.js এ change করুন:
app.listen(8000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:8000');
});

# এখন আপনার mobile/laptop থেকে access করুন:
# http://YOUR_LOCAL_IP:8000
```

### Option 2: Cloudflare Tunnel (Free, ngrok এর বিকল্প)
```powershell
# Cloudflare Tunnel install করুন
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# এবং চালান:
cloudflared tunnel --url http://localhost:8000
```

---

## 🎯 পরবর্তী ধাপ

ngrok setup complete হলে আমাকে জানান। আমি তখন:
1. Frontend এর API URL আপডেট করব
2. Admin Panel এর API URL আপডেট করব
3. Vercel deployment এর জন্য প্রস্তুত করব

---

**Note:** ngrok free plan এ 2 ঘন্টা পর URL expire হয়ে যায়। তাই প্রতিবার নতুন URL পাবেন।
