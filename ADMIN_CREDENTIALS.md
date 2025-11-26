# Admin Panel - Login Credentials

## 🔐 Demo Login Credentials (Hardcoded)

These credentials work **WITHOUT MongoDB** - they are hardcoded in the backend for testing.

---

## 👑 SUPER ADMIN

**Login URL:** http://localhost:3001/superadmin/login

**Credentials:**
- **Email/Username:** `jakirlearn@gmail.com` (or `superadmin`)
- **Password:** `Iqlab4219`

**Access Level:**
- ✅ Full system control
- ✅ Approve/Reject admin requests
- ✅ Manage all admins
- ✅ View all users
- ✅ Wallet control (approve/reject transactions)
- ✅ System settings
- ✅ View all logs

**Personal Account:** This is your personal Super Admin account.

---

## 👔 ADMIN DEMO

**Login URL:** http://localhost:3001/admin/login

**Credentials:**
- **Username:** `admin_demo`
- **Password:** `Jakir4219`

**Access Level:**
- ✅ Dashboard overview
- ✅ User management (view/approve)
- ✅ Wallet requests (view/process)
- ✅ Send messages to users
- ✅ Send notifications
- ✅ View profile (read-only)
- ❌ Cannot edit own profile

**Demo Account:** For testing admin panel features.

---

## 📂 Database Storage

### Current Status:
- ✅ Credentials are **HARDCODED** in backend routes
- ✅ Works without MongoDB connection
- ⚠️ Not saved in database yet

### To Save Permanently in MongoDB:

1. **Start MongoDB:**
   ```bash
   # If installed as service
   net start MongoDB

   # OR if installed manually
   mongod --dbpath C:\data\db
   ```

2. **Run the account creation script:**
   ```bash
   cd C:\Users\User\social_chat_app\backend
   node scripts/createAdminAccounts.js
   ```

3. **Output will show:**
   ```
   ✅ Super Admin account created successfully!
   ✅ Admin demo account created successfully!
   ```

---

## 🔧 Backend Implementation

Credentials are hardcoded in: `backend/routes/admin.js`

### Super Admin Login Route:
```javascript
// Line ~235
router.post('/superadmin/login', async (req, res) => {
  const SUPER_ADMIN_EMAIL = 'jakirlearn@gmail.com';
  const SUPER_ADMIN_USERNAME = 'superadmin';
  const SUPER_ADMIN_PASSWORD = 'Iqlab4219';
  // ... login logic
});
```

### Admin Login Route:
```javascript
// Line ~310
router.post('/login', async (req, res) => {
  const ADMIN_USERNAME = 'admin_demo';
  const ADMIN_PASSWORD = 'Jakir4219';
  // ... login logic
});
```

---

## 🚀 Quick Start

1. **Start Admin Panel:**
   ```bash
   cd C:\Users\User\social_chat_app\admin-panel
   npm start
   ```
   Opens at: http://localhost:3001

2. **Start Backend API:**
   ```bash
   cd C:\Users\User\social_chat_app\backend
   npm start
   ```
   Runs on: http://localhost:8000

3. **Open Browser:**
   - Go to http://localhost:3001
   - Select Super Admin or Admin
   - Login with credentials above

---

## 📝 Testing Flow

### Test Super Admin:
1. Go to http://localhost:3001
2. Click "Super Admin" button
3. Login with:
   - Email: `jakirlearn@gmail.com`
   - Password: `Iqlab4219`
4. Access Super Admin Dashboard
5. View pending admin requests
6. Approve/Reject admins

### Test Admin:
1. Go to http://localhost:3001
2. Click "Admin" button
3. Click "Login"
4. Login with:
   - Username: `admin_demo`
   - Password: `Jakir4219`
5. Access Admin Dashboard
6. View stats, users, wallet requests

---

## ⚠️ Security Notes

1. **Hardcoded credentials are for DEMO only**
2. **Change passwords in production**
3. **Super Admin account is personal - keep secure**
4. **Remove hardcoded credentials after MongoDB setup**
5. **Use environment variables for sensitive data**

---

## 🔄 When MongoDB is Ready

Once MongoDB is running:

1. Run: `node scripts/createAdminAccounts.js`
2. Credentials will be saved with bcrypt hashing
3. Remove hardcoded credentials from routes
4. Use only database authentication

---

## 📞 Support

If you have any issues:
1. Check backend is running (port 8000)
2. Check admin panel is running (port 3001)
3. Open browser console for errors
4. Check backend terminal for logs

---

**Last Updated:** November 24, 2025
**Created By:** GitHub Copilot
