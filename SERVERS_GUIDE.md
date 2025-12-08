# 🚀 সার্ভার গাইড (Servers Guide)

এই অ্যাপ্লিকেশনে ৪টি প্রধান সার্ভার রয়েছে। সবগুলো একসাথে চালু করতে হবে।

---

## 📋 সার্ভার তালিকা (Server List)

| সার্ভার | পোর্ট | টেকনোলজি | স্ট্যাটাস |
|---------|-------|----------|---------|
| Backend | 5000 | Node.js/Express | ✅ Running |
| Frontend | 3000 | React | ✅ Running |
| Admin Panel | 3001 | React | ✅ Running |
| Game Server | 8001 | Python/FastAPI | ✅ Running |

---

## 🎯 দ্রুত শুরু (Quick Start)

### সব সার্ভার একসাথে চালু করুন (Linux/Mac):

```bash
./start-all-servers.sh
```

### Windows এ চালু করুন:

```bash
START.bat
```

অথবা ম্যানুয়ালি প্রতিটি সার্ভার চালু করুন (নিচে দেখুন)

---

## 🔧 ম্যানুয়াল সেটাপ (Manual Setup)

### ১. ব্যাকএন্ড সার্ভার (Backend Server)

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Start server
node server.js
# অথবা development mode এ:
npm run dev
```

**URL**: http://localhost:5000
**Health Check**: http://localhost:5000/api/health

---

### ২. ফ্রন্টএন্ড সার্ভার (Frontend Server)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start server
npm start
```

**URL**: http://localhost:3000

---

### ৩. অ্যাডমিন প্যানেল (Admin Panel)

```bash
# Navigate to admin-panel directory
cd admin-panel

# Install dependencies (first time only)
npm install

# Start server
npm start
# Note: PORT will be automatically set to 3001
```

**URL**: http://localhost:3001

---

### ৪. গেম সার্ভার (Game Server)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies (first time only)
pip3 install fastapi uvicorn[standard] python-multipart

# Start server
python3 -m uvicorn game_server.main:app --reload --port 8001
```

**URL**: http://localhost:8001
**API Docs**: http://localhost:8001/docs

---

## 🛑 সব সার্ভার বন্ধ করুন (Stop All Servers)

### Linux/Mac:

```bash
./stop-all-servers.sh
```

### ম্যানুয়ালি:

প্রতিটি terminal window এ `Ctrl + C` চাপুন

---

## 🔍 সার্ভার স্ট্যাটাস চেক করুন (Check Server Status)

```bash
# Check running ports
netstat -tuln | grep -E ':(3000|3001|5000|8001)'

# Check processes
ps aux | grep -E 'node|python|uvicorn' | grep -v grep
```

---

## 📦 প্রয়োজনীয় ডিপেন্ডেন্সি (Required Dependencies)

### Node.js Servers:
- Node.js v14+ 
- npm v6+

### Python Server:
- Python 3.8+
- pip3

### Installation Commands:

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Admin Panel
cd admin-panel && npm install

# Game Server
pip3 install fastapi uvicorn[standard] python-multipart
```

---

## ⚙️ Environment Variables

প্রতিটি সার্ভারের জন্য `.env` ফাইল প্রয়োজন:

### Backend (.env):
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Admin Panel (.env):
```env
REACT_APP_API_BASE_URL=http://localhost:5000
PORT=3001
```

---

## 🐛 সাধারণ সমস্যা ও সমাধান (Common Issues)

### 1. Port Already in Use

**সমস্যা**: `Error: listen EADDRINUSE: address already in use :::5000`

**সমাধান**:
```bash
# Find process using the port
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

### 2. MongoDB Connection Error

**সমস্যা**: `MongoDB Error: URI must include hostname`

**সমাধান**:
- MongoDB Atlas এ যান এবং cluster চালু আছে কিনা চেক করুন
- Network Access এ আপনার IP whitelist করুন
- `.env` এ সঠিক connection string যোগ করুন

### 3. Module Not Found

**সমস্যা**: `Error: Cannot find module 'express'`

**সমাধান**:
```bash
# Re-install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../admin-panel && npm install
```

### 4. Python Module Not Found

**সমস্যা**: `ModuleNotFoundError: No module named 'fastapi'`

**সমাধান**:
```bash
pip3 install fastapi uvicorn[standard] python-multipart
```

---

## 📊 Development Workflow

### প্রতিদিন কাজ শুরু করার সময়:

1. Terminal খুলুন
2. Project directory তে যান
3. সব সার্ভার চালু করুন:
   ```bash
   ./start-all-servers.sh
   ```
4. Browser এ যান:
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3001

### কাজ শেষে:

1. সব সার্ভার বন্ধ করুন:
   ```bash
   ./stop-all-servers.sh
   ```
2. Code commit করুন

---

## 🔗 দরকারি লিংক (Useful Links)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Backend Health**: http://localhost:5000/api/health
- **Admin Panel**: http://localhost:3001
- **Game Server**: http://localhost:8001
- **Game API Docs**: http://localhost:8001/docs

---

## 📝 নোট (Notes)

- সব সার্ভার ঠিকমতো কাজ করার জন্য একসাথে চালু থাকতে হবে
- Backend সার্ভার প্রথমে চালু করুন, তারপর Frontend ও Admin Panel
- Game Server স্বাধীনভাবে কাজ করে, তবে Wallet features এর জন্য Backend প্রয়োজন
- Development mode এ auto-reload enabled থাকে

---

## 🆘 সাহায্য প্রয়োজন? (Need Help?)

সমস্যার জন্য `SERVER_STATUS_REPORT.md` ফাইল দেখুন বা issue তৈরি করুন।

---

**শুভকামনা! Happy Coding! 🚀**
