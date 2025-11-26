# ðŸŒ Live Testing URLs
## Complete URL Reference for Testing

**Generated:** 2025-11-27 01:23:33

---

## ðŸ“Š Server Status

| Service | Status | Port |
|---------|--------|------|
| Backend API | ðŸŸ¢ RUNNING | 8000 |
| Frontend | ðŸŸ¢ RUNNING | 3000 |
| Admin Panel | ðŸŸ¢ RUNNING | 3001 |
| ngrok Tunnel | ðŸ”´ INACTIVE | - |

---

## ðŸ  Local Testing URLs (Your Computer Only)

### Frontend Application
- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Profile:** http://localhost:3000/profile
- **Messenger:** http://localhost:3000/messenger
- **Wallet:** http://localhost:3000/wallet
- **Games:** http://localhost:3000/games
- **Settings:** http://localhost:3000/settings

### Admin Panel
- **Login:** http://localhost:3001/admin/login
- **Dashboard:** http://localhost:3001/admin/dashboard
- **Users:** http://localhost:3001/admin/users
- **Wallet Management:** http://localhost:3001/admin/wallet
- **Game Logs:** http://localhost:3001/admin/games
- **Super Admin:** http://localhost:3001/superadmin

### Backend API
- **Base URL:** http://localhost:8000/api
- **Health Check:** http://localhost:8000/api/health
- **Auth Endpoints:** http://localhost:8000/api/auth
- **Users:** http://localhost:8000/api/users
- **Posts:** http://localhost:8000/api/posts
- **Messages:** http://localhost:8000/api/messages
- **Wallet:** http://localhost:8000/api/wallet

---

## ðŸŒ Local Network URLs (Same WiFi)

**Your Local IP:** `10.65.25.253`

### Frontend Application
- **Homepage:** http://10.65.25.253:3000
- **Login:** http://10.65.25.253:3000/login
- **Register:** http://10.65.25.253:3000/register
- **Profile:** http://10.65.25.253:3000/profile
- **Messenger:** http://10.65.25.253:3000/messenger
- **Wallet:** http://10.65.25.253:3000/wallet

### Admin Panel
- **Login:** http://10.65.25.253:3001/admin/login
- **Dashboard:** http://10.65.25.253:3001/admin/dashboard

### Backend API
- **Base URL:** http://10.65.25.253:8000/api
- **Health Check:** http://10.65.25.253:8000/api/health

**Note:** These URLs work only on devices connected to the same WiFi network.

---

## ðŸŒ Internet URLs (ngrok - Anywhere Access)

**Status:** ðŸ”´ ngrok not running

**To start ngrok:**
```powershell
# Start servers (includes ngrok)
.\scripts\start-all-servers.ps1

# Or manually
ngrok http 8000
```

**After starting, run this script again to capture the URL.**

---

## ðŸš€ Production URLs (Vercel - Permanent)

### Frontend Application
**Status:** âš ï¸ Not deployed yet

**Deploy to Vercel:**
```powershell
.\scripts\deploy-vercel.ps1
```


### Admin Panel (Vercel)
**Base URL:** `\scripts\generate-testing-urls.ps1`

- **Login:** \scripts\generate-testing-urls.ps1/admin/login
- **Dashboard:** \scripts\generate-testing-urls.ps1/admin/dashboard
- **Users:** \scripts\generate-testing-urls.ps1/admin/users
- **Wallet:** \scripts\generate-testing-urls.ps1/admin/wallet

---

## ðŸ“± Mobile Testing

### Android Device (Same WiFi)
Use Local Network URLs: http://10.65.25.253:3000

### Android Device (Any Network)
Deploy to Vercel first, then use production URL

### iOS Device
Same as Android - use either Local Network or Production URLs

---

## ðŸ§ª API Testing

### Using PowerShell
```powershell
# Health check (Local)
curl http://localhost:8000/api/health

# Health check (ngrok)
# Start ngrok first

# Test authentication
$body = @{email='test@example.com'; password='password'} | ConvertTo-Json
curl -Method POST -Uri 'http://localhost:8000/api/auth/login' -Body $body -ContentType 'application/json'
```

### Using Browser
Visit these URLs in your browser:
- http://localhost:8000/api/health


---

## ðŸ”§ Update URLs

### After ngrok Restart
```powershell
# Get new ngrok URL from ngrok terminal
# Then update everywhere:
.\scripts\update-ngrok-url.ps1 -NgrokUrl "YOUR_NEW_URL"
```

### After Vercel Deployment
1. Copy deployment URL from Vercel CLI output
2. Update in Vercel Dashboard â†’ Environment Variables
3. Run this script again to document new URLs

### Regenerate This Document
```powershell
.\scripts\generate-testing-urls.ps1
```

---

## ðŸ“‹ Quick Testing Checklist

### Local Testing
- [ ] Start servers: `.\scripts\start-all-servers.ps1`
- [ ] Open: http://localhost:3000
- [ ] Test registration and login
- [ ] Test all main features

### Network Testing
- [ ] Get local IP from this document
- [ ] Open: http://10.65.25.253:3000 on another device
- [ ] Test on mobile phone (same WiFi)

### Internet Testing
- [ ] Start ngrok (included in start-all-servers script)
- [ ] Copy ngrok URL
- [ ] Update frontend: `.\scripts\update-ngrok-url.ps1`
- [ ] Restart frontend: `npm start`
- [ ] Test from anywhere

### Production Testing
- [ ] Deploy to Vercel: `.\scripts\deploy-vercel.ps1`
- [ ] Update environment variables in Vercel Dashboard
- [ ] Test production URLs
- [ ] Verify all features work

---

## ðŸŽ¯ Test These Features

### Frontend
- [ ] User Registration
- [ ] User Login
- [ ] Profile View/Edit
- [ ] Profile Picture Upload
- [ ] Post Creation
- [ ] Messenger Chat
- [ ] Wallet Balance
- [ ] Games Access

### Admin Panel
- [ ] Admin Login
- [ ] Dashboard Stats
- [ ] User Management
- [ ] Wallet Transactions
- [ ] Game Activity Logs

### API
- [ ] Health endpoint responding
- [ ] Authentication working
- [ ] CRUD operations functional
- [ ] File uploads working
- [ ] Real-time updates (Socket.io)

---

## ðŸ’¡ Tips

1. **Always test locally first** before deploying
2. **Use ngrok for quick external testing** without deploying
3. **Deploy to Vercel for permanent URLs** and professional testing
4. **Keep this document updated** by running the generator script
5. **Bookmark important URLs** for quick access

---

## ðŸ†˜ Troubleshooting

### Can't access localhost URLs
- Make sure servers are running
- Check firewall settings
- Try http://127.0.0.1:3000 instead

### Can't access local network URLs
- Ensure devices are on same WiFi
- Check Windows Firewall
- Verify IP address is correct

### ngrok URL not working
- Check ngrok is running: look for ngrok terminal
- Verify backend is running on port 8000
- Update URLs if ngrok restarted

### Vercel URLs not working
- Check deployment status in Vercel Dashboard
- Verify environment variables are set
- Check build logs for errors

---

**ðŸ“ Document Generated:** 2025-11-27 01:23:33

**ðŸ”„ To update:** `.\scripts\generate-testing-urls.ps1`
