# 🚀 Quick Testing Guide

এই গাইড আপনাকে দ্রুত লোকাল এবং অনলাইনে টেস্টিং শুরু করতে সাহায্য করবে।

---

## 📋 বর্তমান অবস্থা

✅ **সম্পন্ন:**
- Git repository setup complete
- Initial commit done
- Helper scripts created

⏳ **এখন করতে হবে:**
- ngrok install করুন (অথবা local network ব্যবহার করুন)
- Vercel deployment (পরে)
- Android build (পরে)

---

## 🎯 Option 1: Local Network Testing (সবচেয়ে সহজ)

মোবাইল/অন্য ডিভাইস থেকে টেস্ট করার জন্য:

### ধাপ ১: সব সার্ভার চালু করুন

```powershell
cd C:\Users\User\social_chat_app
.\scripts\start-all-servers.ps1
```

### ধাপ ২: আপনার Local IP address পান

```powershell
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

### ধাপ ৩: Mobile/Laptop থেকে access করুন

```
Frontend:    http://YOUR_IP:3000
Admin Panel: http://YOUR_IP:3001
Backend API: http://YOUR_IP:8000
```

**উদাহরণ:** যদি আপনার IP হয় `192.168.1.100`:
- Frontend: `http://192.168.1.100:3000`
- Admin: `http://192.168.1.100:3001`

---

## 🌐 Option 2: ngrok Testing (Internet থেকে access)

### ধাপ ১: ngrok Install করুন

বিস্তারিত দেখুন: **[INSTALL_NGROK.md](./INSTALL_NGROK.md)**

সংক্ষেপে:
1. https://ngrok.com/download থেকে download করুন
2. Extract করে `ngrok.exe` কে `C:\Windows\System32` তে copy করুন
3. https://dashboard.ngrok.com/signup এ signup করুন
4. Auth token configure করুন

### ধাপ ২: Backend এবং ngrok চালু করুন

```powershell
# Terminal 1
cd C:\Users\User\social_chat_app\backend
npm start

# Terminal 2
ngrok http 8000
```

### ধাপ ৩: ngrok URL দিয়ে API config আপডেট করুন

```powershell
# ngrok থেকে URL copy করুন (e.g., https://abc123.ngrok-free.app)
cd C:\Users\User\social_chat_app
.\scripts\update-ngrok-url.ps1 -NgrokUrl "https://YOUR_NGROK_URL.ngrok-free.app"
```

### ধাপ ৪: Frontend এবং Admin Panel restart করুন

```powershell
# Stop the running servers (Ctrl+C)
# Then start again:
.\scripts\start-all-servers.ps1
```

---

## 📱 Vercel Deployment (Coming Soon)

পরবর্তীতে আমরা Vercel এ deploy করব যাতে permanent URL পাওয়া যায়।

বিস্তারিত: **[LIVE_TESTING_SETUP_GUIDE.md](./LIVE_TESTING_SETUP_GUIDE.md)**

---

## 🔧 Available Scripts

### সব সার্ভার একসাথে চালু করুন
```powershell
.\scripts\start-all-servers.ps1
```

### ngrok URL আপডেট করুন
```powershell
.\scripts\update-ngrok-url.ps1 -NgrokUrl "YOUR_URL"
```

### Testing script (পরে)
```powershell
.\scripts\test-all-features.ps1
```

---

## 🌐 Testing URLs

### Local Testing
```
Frontend:      http://localhost:3000
Admin Panel:   http://localhost:3001
Backend API:   http://localhost:8000
```

### Network Testing (Replace with your IP)
```
Frontend:      http://YOUR_IP:3000
Admin Panel:   http://YOUR_IP:3001
Backend API:   http://YOUR_IP:8000
```

### Internet Testing (ngrok)
```
Backend API:   https://YOUR_NGROK_URL.ngrok-free.app
Frontend:      http://localhost:3000 (use ngrok API URL)
Admin Panel:   http://localhost:3001 (use ngrok API URL)
```

---

## 🧪 Test করার জন্য Pages

### Frontend
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/home` - Main feed
- `/profile` - User profile
- `/messenger` - Chat page
- `/wallet` - Wallet page
- `/games` - Games page
- `/settings` - Settings

### Admin Panel
- `/` - Role selection
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/superadmin/login` - Super admin login
- `/superadmin/dashboard` - Super admin dashboard

### Backend API
- `/api/health` - Health check
- `/api/auth/signup` - User registration
- `/api/auth/login` - User login
- `/api/auth/me` - Get current user
- `/api/users` - Get all users
- `/api/posts` - Posts CRUD
- `/api/wallet` - Wallet operations
- `/api/admin` - Admin operations

---

## 🐛 Common Issues

### Issue: "Cannot connect to backend"
**Solution:** 
- Backend সার্ভার চলছে কিনা check করুন
- API URL সঠিক আছে কিনা verify করুন
- Firewall block করছে কিনা দেখুন

### Issue: "ngrok URL expired"
**Solution:**
- ngrok free plan 2 ঘন্টা পর expire হয়
- নতুন URL এর জন্য ngrok আবার চালু করুন
- Update script দিয়ে নতুন URL set করুন

### Issue: "Port already in use"
**Solution:**
```powershell
# চলমান process খুঁজে বের করুন
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 3001 | Select-Object OwningProcess

# Process stop করুন
Stop-Process -Id PROCESS_ID -Force
```

---

## 📞 Support

যদি কোন সমস্যা হয়:
1. Server logs check করুন
2. Browser console check করুন
3. Network tab এ API calls দেখুন
4. Error messages carefully পড়ুন

---

## 🎯 পরবর্তী ধাপ

1. ✅ Local testing complete করুন
2. ⏳ ngrok দিয়ে internet testing করুন (optional)
3. ⏳ Vercel এ deploy করুন (permanent hosting)
4. ⏳ Android build তৈরি করুন
5. ⏳ CI/CD pipeline setup করুন

---

**Last Updated:** November 27, 2025
