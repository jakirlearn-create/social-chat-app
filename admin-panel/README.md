# FWP Admin Panel

Complete admin panel for FWP Audio Chat application with role-based access control.

## 🚀 Features

### Role-Based Access
- **Super Admin**: Full system control with approval rights
- **Admin**: Dashboard access with limited permissions

### Admin Registration Flow
1. Role selection (Super Admin / Admin)
2. Country-specific registration forms (5 countries)
3. Super Admin approval required
4. Automated credential generation
5. Email notification on approval

### Super Admin Panel
- ✅ Approve/Reject admin requests
- 👥 Manage all admins
- 💰 Wallet request management
- 📊 User records & analytics
- ✉️ Messaging control
- ⚙️ System settings

### Admin Panel
- 📈 Dashboard overview
- 👤 User management (view/approve)
- 💳 Wallet requests
- 📬 User messaging
- 🔔 Notifications
- 👁️ View-only profile

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running on `localhost:27017`
- Backend API running on port `8000`

### Setup Steps

1. **Navigate to admin panel directory**
   ```powershell
   cd admin-panel
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment**
   - `.env` file is already configured
   - Backend API: `http://localhost:8000/api`
   - Admin Panel Port: `3001`

4. **Start development server**
   ```powershell
   npm start
   ```

   Admin panel will open at: `http://localhost:3001`

## 🏗️ Project Structure

```
admin-panel/
├── public/
│   └── index.html           # Entry HTML
├── src/
│   ├── pages/
│   │   ├── RoleSelectionPage.js         # First screen
│   │   ├── SuperAdminLoginPage.js       # Super Admin login
│   │   ├── AdminOptionsPage.js          # Login/Register choice
│   │   ├── AdminLoginPage.js            # Admin login
│   │   ├── CountrySelectionPage.js      # Country picker
│   │   ├── AdminRegistrationPage.js     # Registration forms
│   │   └── RegistrationSuccessPage.js   # Success message
│   ├── components/          # Reusable components
│   ├── services/
│   │   └── authService.js   # API service
│   ├── styles/              # CSS files
│   ├── App.js               # Main app with routes
│   ├── App.css              # Global styles
│   ├── index.js             # React entry point
│   └── index.css            # Base styles
├── package.json             # Dependencies & scripts
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔄 Routes

### Public Routes
- `/` - Role selection page
- `/superadmin/login` - Super Admin login
- `/admin/options` - Admin options (login/register)
- `/admin/login` - Admin login
- `/admin/register/country` - Country selection
- `/admin/register/form/:country` - Registration form
- `/admin/registration-success` - Success message

### Protected Routes (Coming Soon)
- `/superadmin/dashboard` - Super Admin panel
- `/admin/dashboard` - Admin panel

## 🌍 Supported Countries

1. **Bangladesh** 🇧🇩 - Full registration form
   - NID verification
   - Complete address details
   - Professional information

2. **Malaysia** 🇲🇾 - Simplified form
3. **India** 🇮🇳 - Simplified form
4. **Pakistan** 🇵🇰 - Simplified form
5. **Nepal** 🇳🇵 - Simplified form

## 🔐 Authentication Flow

### Super Admin
1. Direct login (no signup)
2. Pre-configured credentials
3. Full system access

### Admin
1. Choose Login or Create Account
2. Select country → Fill form
3. Wait for Super Admin approval
4. Receive credentials via email
5. Login with provided credentials

## 🎨 Design Features

- **Modern UI**: Gradient backgrounds, animations
- **Responsive**: Mobile-friendly design
- **Toast Notifications**: Real-time feedback
- **Form Validation**: Client-side validation
- **Loading States**: Better UX during API calls

## 📡 API Integration

### Backend Endpoints Used
- `POST /api/admin/register` - Submit registration
- `POST /api/admin/superadmin/login` - Super Admin login
- `POST /api/admin/login` - Admin login
- `GET /api/admin/pending` - Pending requests (Super Admin)
- `PUT /api/admin/approve/:id` - Approve admin
- `PUT /api/admin/reject/:id` - Reject admin
- `GET /api/admin/dashboard` - Dashboard data

## 🔧 Development

### Start in Development Mode
```powershell
npm start
```

### Build for Production
```powershell
npm run build
```

### Run Build Locally
```powershell
npm install -g serve
serve -s build -l 3001
```

## 📝 Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_NAME=FWP Admin Panel
PORT=3001
```

## 🚦 Status

### ✅ Completed
- Role selection page
- Super Admin login
- Admin options page
- Admin login page
- Country selection
- Registration forms (all 5 countries)
- Success page
- Authentication service
- Backend API routes
- Admin request model

### 🔄 In Progress
- Super Admin dashboard
- Admin dashboard
- User management
- Wallet management

### 📋 Pending
- Email service for credentials
- Profile management
- Settings page
- Analytics dashboard

## 🤝 Contributing

This is a private project. For any changes, please contact the project administrator.

## 📄 License

Private - All rights reserved

---

**Note**: Make sure the backend server is running on port 8000 before starting the admin panel.
