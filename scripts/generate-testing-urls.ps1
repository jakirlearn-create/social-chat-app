# Live Testing URLs Generator
# Automatically collects and documents all testing URLs

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Live Testing URLs Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$outputFile = "LIVE_TESTING_URLS.md"
$configFile = "testing-urls.json"

# Function to get local IP
function Get-LocalIP {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*"} | Select-Object -First 1).IPAddress
    return $ip
}

# Function to check if port is listening
function Test-Port {
    param($port)
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Function to get ngrok URL
function Get-NgrokUrl {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction SilentlyContinue
        if ($response.tunnels) {
            $tunnel = $response.tunnels | Where-Object {$_.config.addr -like "*8000*"} | Select-Object -First 1
            if ($tunnel) {
                return $tunnel.public_url
            }
        }
    } catch {
        return $null
    }
    return $null
}

# Function to get Vercel URLs from .vercel directory
function Get-VercelUrls {
    $urls = @{
        frontend = $null
        admin = $null
    }
    
    # Check frontend
    if (Test-Path "frontend\.vercel\project.json") {
        $project = Get-Content "frontend\.vercel\project.json" | ConvertFrom-Json
        if ($project.orgId) {
            # Try to get from vercel CLI
            try {
                $output = vercel ls --scope $project.orgId 2>$null
                # Parse output for URL
            } catch {}
        }
    }
    
    return $urls
}

Write-Host "Collecting URLs..." -ForegroundColor Yellow
Write-Host ""

# Collect URLs
$localIP = Get-LocalIP
$backendRunning = Test-Port 8000
$frontendRunning = Test-Port 3000
$adminRunning = Test-Port 3001
$ngrokUrl = Get-NgrokUrl

# Display Status
Write-Host "Server Status:" -ForegroundColor Cyan
Write-Host "  Backend (8000):  $(if($backendRunning){'RUNNING'}else{'STOPPED'})" -ForegroundColor $(if($backendRunning){'Green'}else{'Red'})
Write-Host "  Frontend (3000): $(if($frontendRunning){'RUNNING'}else{'STOPPED'})" -ForegroundColor $(if($frontendRunning){'Green'}else{'Red'})
Write-Host "  Admin (3001):    $(if($adminRunning){'RUNNING'}else{'STOPPED'})" -ForegroundColor $(if($adminRunning){'Green'}else{'Red'})
Write-Host "  ngrok:           $(if($ngrokUrl){'ACTIVE'}else{'INACTIVE'})" -ForegroundColor $(if($ngrokUrl){'Green'}else{'Red'})
Write-Host ""

# Get Vercel URLs from user input
Write-Host "Vercel Deployment URLs:" -ForegroundColor Cyan
Write-Host "Enter your Vercel URLs (press Enter to skip)" -ForegroundColor Gray
Write-Host ""

$vercelFrontend = Read-Host "Frontend URL (e.g., https://your-app.vercel.app)"
$vercelAdmin = Read-Host "Admin Panel URL (e.g., https://your-admin.vercel.app)"

Write-Host ""
Write-Host "Generating documentation..." -ForegroundColor Yellow

# Generate Markdown Documentation
$markdown = @"
# 🌐 Live Testing URLs
## Complete URL Reference for Testing

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

---

## 📊 Server Status

| Service | Status | Port |
|---------|--------|------|
| Backend API | $(if($backendRunning){'🟢 RUNNING'}else{'🔴 STOPPED'}) | 8000 |
| Frontend | $(if($frontendRunning){'🟢 RUNNING'}else{'🔴 STOPPED'}) | 3000 |
| Admin Panel | $(if($adminRunning){'🟢 RUNNING'}else{'🔴 STOPPED'}) | 3001 |
| ngrok Tunnel | $(if($ngrokUrl){'🟢 ACTIVE'}else{'🔴 INACTIVE'}) | - |

---

## 🏠 Local Testing URLs (Your Computer Only)

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

## 🌍 Local Network URLs (Same WiFi)

**Your Local IP:** ``$localIP``

### Frontend Application
- **Homepage:** http://${localIP}:3000
- **Login:** http://${localIP}:3000/login
- **Register:** http://${localIP}:3000/register
- **Profile:** http://${localIP}:3000/profile
- **Messenger:** http://${localIP}:3000/messenger
- **Wallet:** http://${localIP}:3000/wallet

### Admin Panel
- **Login:** http://${localIP}:3001/admin/login
- **Dashboard:** http://${localIP}:3001/admin/dashboard

### Backend API
- **Base URL:** http://${localIP}:8000/api
- **Health Check:** http://${localIP}:8000/api/health

**Note:** These URLs work only on devices connected to the same WiFi network.

---

## 🌐 Internet URLs (ngrok - Anywhere Access)

$(if ($ngrokUrl) {
@"
**ngrok URL:** ``$ngrokUrl``

### Backend API
- **Base URL:** ${ngrokUrl}/api
- **Health Check:** ${ngrokUrl}/api/health
- **Auth:** ${ngrokUrl}/api/auth
- **Users:** ${ngrokUrl}/api/users

**⚠️ Important:** 
- ngrok URL changes every restart
- Free tier shows warning page on first visit
- Update this URL in frontend config: ``.\scripts\update-ngrok-url.ps1 -NgrokUrl "$ngrokUrl"``
"@
} else {
@"
**Status:** 🔴 ngrok not running

**To start ngrok:**
``````powershell
# Start servers (includes ngrok)
.\scripts\start-all-servers.ps1

# Or manually
ngrok http 8000
``````

**After starting, run this script again to capture the URL.**
"@
})

---

## 🚀 Production URLs (Vercel - Permanent)

$(if ($vercelFrontend -and $vercelFrontend -ne "") {
@"
### Frontend Application (Vercel)
**Base URL:** ``$vercelFrontend``

- **Homepage:** $vercelFrontend
- **Login:** $vercelFrontend/login
- **Register:** $vercelFrontend/register
- **Profile:** $vercelFrontend/profile
- **Messenger:** $vercelFrontend/messenger
- **Wallet:** $vercelFrontend/wallet
- **Games:** $vercelFrontend/games
"@
} else {
@"
### Frontend Application
**Status:** ⚠️ Not deployed yet

**Deploy to Vercel:**
``````powershell
.\scripts\deploy-vercel.ps1
``````
"@
})

$(if ($vercelAdmin -and $vercelAdmin -ne "") {
@"

### Admin Panel (Vercel)
**Base URL:** ``$vercelAdmin``

- **Login:** $vercelAdmin/admin/login
- **Dashboard:** $vercelAdmin/admin/dashboard
- **Users:** $vercelAdmin/admin/users
- **Wallet:** $vercelAdmin/admin/wallet
"@
} else {
@"

### Admin Panel
**Status:** ⚠️ Not deployed yet

**Deploy to Vercel:**
``````powershell
cd admin-panel
vercel --prod
``````
"@
})

---

## 📱 Mobile Testing

### Android Device (Same WiFi)
Use Local Network URLs: http://${localIP}:3000

### Android Device (Any Network)
$(if ($vercelFrontend) {
"Use Production URL: $vercelFrontend"
} else {
"Deploy to Vercel first, then use production URL"
})

### iOS Device
Same as Android - use either Local Network or Production URLs

---

## 🧪 API Testing

### Using PowerShell
``````powershell
# Health check (Local)
curl http://localhost:8000/api/health

# Health check (ngrok)
$(if ($ngrokUrl) {"curl ${ngrokUrl}/api/health"} else {"# Start ngrok first"})

# Test authentication
`$body = @{email='test@example.com'; password='password'} | ConvertTo-Json
curl -Method POST -Uri 'http://localhost:8000/api/auth/login' -Body `$body -ContentType 'application/json'
``````

### Using Browser
Visit these URLs in your browser:
- http://localhost:8000/api/health
$(if ($ngrokUrl) {"- ${ngrokUrl}/api/health"})

---

## 🔧 Update URLs

### After ngrok Restart
``````powershell
# Get new ngrok URL from ngrok terminal
# Then update everywhere:
.\scripts\update-ngrok-url.ps1 -NgrokUrl "YOUR_NEW_URL"
``````

### After Vercel Deployment
1. Copy deployment URL from Vercel CLI output
2. Update in Vercel Dashboard → Environment Variables
3. Run this script again to document new URLs

### Regenerate This Document
``````powershell
.\scripts\generate-testing-urls.ps1
``````

---

## 📋 Quick Testing Checklist

### Local Testing
- [ ] Start servers: ``.\scripts\start-all-servers.ps1``
- [ ] Open: http://localhost:3000
- [ ] Test registration and login
- [ ] Test all main features

### Network Testing
- [ ] Get local IP from this document
- [ ] Open: http://${localIP}:3000 on another device
- [ ] Test on mobile phone (same WiFi)

### Internet Testing
- [ ] Start ngrok (included in start-all-servers script)
- [ ] Copy ngrok URL
- [ ] Update frontend: ``.\scripts\update-ngrok-url.ps1``
- [ ] Restart frontend: ``npm start``
- [ ] Test from anywhere

### Production Testing
- [ ] Deploy to Vercel: ``.\scripts\deploy-vercel.ps1``
- [ ] Update environment variables in Vercel Dashboard
- [ ] Test production URLs
- [ ] Verify all features work

---

## 🎯 Test These Features

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

## 💡 Tips

1. **Always test locally first** before deploying
2. **Use ngrok for quick external testing** without deploying
3. **Deploy to Vercel for permanent URLs** and professional testing
4. **Keep this document updated** by running the generator script
5. **Bookmark important URLs** for quick access

---

## 🆘 Troubleshooting

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

**📝 Document Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

**🔄 To update:** ``.\scripts\generate-testing-urls.ps1``
"@

# Save to file
$markdown | Out-File -FilePath $outputFile -Encoding UTF8

# Save URLs to JSON for programmatic access
$urlData = @{
    generated = Get-Date -Format "o"
    local = @{
        frontend = "http://localhost:3000"
        admin = "http://localhost:3001"
        api = "http://localhost:8000/api"
    }
    network = @{
        ip = $localIP
        frontend = "http://${localIP}:3000"
        admin = "http://${localIP}:3001"
        api = "http://${localIP}:8000/api"
    }
    ngrok = @{
        active = $null -ne $ngrokUrl
        url = $ngrokUrl
        api = if($ngrokUrl) {"${ngrokUrl}/api"} else {$null}
    }
    vercel = @{
        frontend = $vercelFrontend
        admin = $vercelAdmin
    }
    status = @{
        backend = $backendRunning
        frontend = $frontendRunning
        admin = $adminRunning
        ngrok = $null -ne $ngrokUrl
    }
}

$urlData | ConvertTo-Json -Depth 10 | Out-File -FilePath $configFile -Encoding UTF8

Write-Host "========================================" -ForegroundColor Green
Write-Host "URLs Generated Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Documentation: $outputFile" -ForegroundColor Cyan
Write-Host "JSON Config: $configFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "Quick Links:" -ForegroundColor Yellow
Write-Host "  Local Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Local Admin:     http://localhost:3001" -ForegroundColor White
Write-Host "  Local API:       http://localhost:8000/api" -ForegroundColor White
if ($ngrokUrl) {
    Write-Host "  ngrok API:       $ngrokUrl/api" -ForegroundColor White
}
Write-Host ""

if (-not $backendRunning -or -not $frontendRunning) {
    Write-Host "Start servers: .\scripts\start-all-servers.ps1" -ForegroundColor Yellow
    Write-Host ""
}
