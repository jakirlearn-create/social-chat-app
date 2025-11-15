# Social Chat App - Setup & Installation Guide

## 🎯 Quick Start

Your Social Chat App project is ready! Follow these steps to get everything running.

---

## 📦 Step 1: Backend Setup (Flask + Python)

### 1.1 Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 1.2 Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 1.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 1.4 Setup Environment Variables

```bash
# Copy the example file
copy .env.example .env

# Edit .env with your Firebase credentials:
# - FIREBASE_API_KEY
# - FIREBASE_PROJECT_ID
# - etc.
```

### 1.5 Run Backend

```bash
python app.py
```

✅ Backend will run on: `http://localhost:5000`

---

## 📦 Step 2: Frontend Setup (React)

### 2.1 Install Node Dependencies

```bash
cd frontend
npm install
```

This will install:
- React 18
- React Router
- Axios
- Firebase SDK
- Tailwind CSS
- React Hot Toast
- And more...

### 2.2 Setup Environment Variables

```bash
# Create .env file
copy .env.example .env

# Edit .env with your Firebase and API settings
```

### 2.3 Run Frontend

```bash
npm start
```

✅ Frontend will run on: `http://localhost:3000`

---

## 🔐 Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `social-chat-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable:
   - ✅ Email/Password
   - ✅ Google
   - ✅ Facebook

### Step 3: Get Credentials

1. Go to **Project Settings** (⚙️ icon)
2. Click **Service Accounts**
3. Click **Generate new private key**
4. Save as `serviceAccountKey.json` in `backend/` folder
5. Copy the Web SDK config to your `.env` files

### Step 4: Update .env Files

**Backend `.env`:**
```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

**Frontend `.env`:**
```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running Both Servers

### Terminal 1 - Backend

```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate
python app.py
```

Output:
```
 * Running on http://127.0.0.1:5000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Output:
```
Local:            http://localhost:3000
```

**Now open http://localhost:3000 in your browser!** 🎉

---

## 📂 Project Structure

```
social_chat_app/
├── backend/
│   ├── app.py              # Flask app & routes
│   ├── firebase_config.py  # Firebase setup
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── services/       # API services
│   │   ├── config/         # Configuration
│   │   └── App.js
│   ├── public/
│   ├── package.json        # NPM dependencies
│   ├── .env.example        # Environment template
│   └── .gitignore
│
├── README.md               # Project documentation
└── init_git.bat           # Git initialization script
```

---

## 🔗 API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Reset password
- `POST /api/auth/google` - Google auth
- `POST /api/auth/facebook` - Facebook auth

### Health Check
- `GET /api/health` - Server status

---

## 📱 Features Ready to Use

✅ **Login Page**
- Email/Phone input
- Password validation
- Forgot password link
- Google & Facebook buttons

✅ **Sign Up Page**
- Manual registration
- Google OAuth
- Facebook OAuth
- Terms & Conditions
- Password confirmation

✅ **Forgot Password Page**
- Email verification
- Support contact info
- WhatsApp integration

✅ **Home Page**
- Protected route
- Ready for chat/feed features

---

## 🛠️ Development Tools

### Python Packages
```
Flask==3.0.0
Firebase-Admin==6.2.0
python-dotenv==1.0.0
Flask-CORS==4.0.0
```

### NPM Packages
```
react@18.2.0
react-router-dom@6.16.0
axios@1.6.0
firebase@10.7.0
tailwindcss@3.3.6
react-hot-toast@2.4.1
react-icons@4.12.0
```

---

## 📝 Next Steps

1. ✅ Setup Backend & Frontend
2. ✅ Configure Firebase
3. ⏳ Implement Database schemas
4. ⏳ Add messaging features
5. ⏳ Implement video/audio calls
6. ⏳ Add user profiles
7. ⏳ Implement feed & live features

---

## 🆘 Troubleshooting

### Python Module Not Found
```bash
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

### npm dependencies issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues
- Check your `.env` files are correctly filled
- Verify Firebase project is active
- Check internet connection

### Port Already in Use
```bash
# Change Flask port in app.py (default: 5000)
app.run(port=5001)

# Change React port
set PORT=3001 && npm start  # Windows
PORT=3001 npm start  # Mac/Linux
```

---

## 📞 Support

If you encounter any issues:
1. Check the README.md for more info
2. Review the .env.example files
3. Verify Firebase credentials
4. Check console for error messages

---

## 🎉 You're All Set!

Your Social Chat App is ready to develop. Start building amazing features!

**Happy Coding! 🚀**
