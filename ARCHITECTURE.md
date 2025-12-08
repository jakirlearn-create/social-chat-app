# 🏗️ System Architecture - সিস্টেম আর্কিটেকচার

## System Overview - সিস্টেম ওভারভিউ

```
┌─────────────────────────────────────────────────────────────────┐
│                        FWP Social Chat App                      │
│                     Complete Architecture                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │  Admin Panel    │      │  Mobile App     │
│  (React:3000)   │◄────►│  (React:3001)   │      │   (Future)      │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                         │
         │                        │                         │
         ▼                        ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API Server                          │
│                    (Node.js/Express:5000)                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Auth Routes  │  │ User Routes  │  │ Post Routes  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │Message Routes│  │Wallet Routes │  │ Admin Routes │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────┬──────────────────────┬──────────────────────┬─────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│  MongoDB Atlas │    │    Firebase    │    │  Game Server   │
│   (Database)   │    │ (Auth/Storage) │    │(Python:8001)   │
└────────────────┘    └────────────────┘    └────────────────┘
```

---

## Component Details - কম্পোনেন্ট বিস্তারিত

### 1️⃣ Frontend (React Application)

**Technology**: React 18, Vite, Tailwind CSS
**Port**: 3000
**Features**:
```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Home feed
│   │   ├── LoginPage.jsx         # User login
│   │   ├── SignupPage.jsx        # User registration
│   │   ├── ProfilePage.jsx       # User profile
│   │   ├── ChatPage.jsx          # Messaging
│   │   ├── MessengerPage.jsx     # Messenger UI
│   │   ├── PostsPage.jsx         # Posts feed
│   │   ├── WalletPage.jsx        # Wallet management
│   │   └── GamePage.jsx          # Gaming interface
│   │
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── PostCard.jsx          # Post display
│   │   ├── CommentSection.jsx    # Comments
│   │   └── SearchBar.jsx         # Search functionality
│   │
│   └── services/
│       ├── authService.js        # Authentication
│       ├── postService.js        # Post operations
│       ├── chatService.js        # Chat operations
│       └── walletService.js      # Wallet operations
```

**Key Features**:
- ✅ User Authentication (Email, Google, Facebook)
- ✅ Social Feed with Posts
- ✅ Real-time Messaging
- ✅ User Profiles
- ✅ Wallet System
- ✅ Games Integration
- ✅ Search & Discovery

---

### 2️⃣ Admin Panel (React Application)

**Technology**: React, React Scripts
**Port**: 3001
**Features**:
```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx         # Admin dashboard
│   │   ├── Users.jsx             # User management
│   │   ├── Posts.jsx             # Post moderation
│   │   ├── Reports.jsx           # Reports handling
│   │   ├── Analytics.jsx         # Analytics view
│   │   └── Settings.jsx          # System settings
│   │
│   └── components/
│       ├── Sidebar.jsx           # Admin sidebar
│       ├── UserTable.jsx         # User listing
│       └── StatsCard.jsx         # Statistics cards
```

**Key Features**:
- ✅ User Management
- ✅ Content Moderation
- ✅ Analytics & Reports
- ✅ System Configuration
- ✅ Wallet Management

---

### 3️⃣ Backend API (Node.js/Express)

**Technology**: Node.js, Express, MongoDB, JWT
**Port**: 5000
**Architecture**:
```
backend/
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── users.js             # User CRUD operations
│   ├── posts.js             # Post operations
│   ├── messages.js          # Messaging system
│   ├── conversations.js     # Conversation management
│   ├── wallet.js            # Wallet operations
│   ├── admin.js             # Admin operations
│   └── profile.js           # Profile management
│
├── models/
│   ├── User.js              # User schema
│   ├── Post.js              # Post schema
│   ├── Message.js           # Message schema
│   └── Conversation.js      # Conversation schema
│
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── adminTracker.js      # Admin tracking
│
└── server.js                # Main server file
```

**API Endpoints**:
```
Authentication:
POST   /api/auth/signup        # User registration
POST   /api/auth/login         # User login
GET    /api/auth/me            # Get current user

Users:
GET    /api/users              # Get all users
GET    /api/users/search       # Search users
GET    /api/users/profile/:id  # Get user profile

Posts:
GET    /api/posts              # Get all posts
POST   /api/posts              # Create post
PUT    /api/posts/:id          # Update post
DELETE /api/posts/:id          # Delete post

Messages:
GET    /api/messages/:convId   # Get messages
POST   /api/messages           # Send message

Wallet:
GET    /api/wallet/balance     # Get balance
POST   /api/wallet/deposit     # Deposit coins
POST   /api/wallet/withdraw    # Withdraw coins
```

---

### 4️⃣ Game Server (Python/FastAPI)

**Technology**: Python, FastAPI, Uvicorn
**Port**: 8001
**Features**:
```
backend/game_server/
├── main.py                  # FastAPI application
├── probabilityControl.py    # Game probability logic
└── games/                   # Game assets
    ├── ludo/
    ├── carrom/
    ├── chicken_jump/
    ├── crash/
    └── spin_wheel/
```

**API Endpoints**:
```
Health:
GET    /                       # Server status

Games:
GET    /games/list             # List all games
POST   /games/play             # Play a game
GET    /games/config           # Game configuration

Wallet:
POST   /wallet/check           # Check coin balance
POST   /wallet/deduct          # Deduct coins
POST   /wallet/reward          # Add reward coins

API Documentation:
GET    /docs                   # Swagger UI
```

**Supported Games**:
- 🎲 Ludo
- 🎯 Carrom
- 🐔 Chicken Jump
- 💥 Crash
- 🎡 Spin Wheel

---

## Data Flow - ডেটা ফ্লো

### User Authentication Flow:
```
User (Frontend) → POST /api/auth/login → Backend
                                        ↓
                                    Verify Credentials
                                        ↓
                                    Generate JWT Token
                                        ↓
                                    Return Token
                                        ↓
Frontend Stores Token → Include in all API requests
```

### Post Creation Flow:
```
User Creates Post → Frontend
                       ↓
                   POST /api/posts
                       ↓
                   Backend validates
                       ↓
                   Save to MongoDB
                       ↓
                   Broadcast to users
                       ↓
                   Update feeds
```

### Gaming Flow:
```
User Selects Game → Frontend
                       ↓
                   Check Wallet (Backend)
                       ↓
                   Deduct Entry Fee
                       ↓
                   POST /games/play (Game Server)
                       ↓
                   Process Game Logic
                       ↓
                   Determine Win/Loss
                       ↓
                   Update Wallet (Backend)
                       ↓
                   Return Result
```

---

## Database Schema - ডাটাবেস স্কিমা

### MongoDB Collections:

```javascript
// Users Collection
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  idNumber: String (unique),
  countryCode: String,
  profilePicture: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  posts: [ObjectId],
  walletBalance: Number,
  isActive: Boolean,
  createdAt: Date
}

// Posts Collection
{
  _id: ObjectId,
  userId: ObjectId,
  content: String,
  mediaUrl: [String],
  mediaType: String,
  likes: [ObjectId],
  comments: [{
    userId: ObjectId,
    text: String,
    createdAt: Date
  }],
  shares: Number,
  createdAt: Date
}

// Messages Collection
{
  _id: ObjectId,
  conversationId: ObjectId,
  senderId: ObjectId,
  receiverId: ObjectId,
  content: String,
  mediaUrl: String,
  read: Boolean,
  createdAt: Date
}
```

---

## Security - নিরাপত্তা

### Authentication:
- ✅ JWT (JSON Web Tokens) for stateless authentication
- ✅ bcrypt for password hashing
- ✅ Token expiration (7 days)
- ✅ Secure HTTP-only cookies (optional)

### Authorization:
- ✅ Role-based access control (User, Admin)
- ✅ Route-level protection
- ✅ Resource ownership validation

### Data Protection:
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ Input validation and sanitization
- ✅ Rate limiting (recommended)

---

## Deployment - ডিপ্লয়মেন্ট

### Current Deployment:
```
Backend:    Render.com (https://fwp-backend-api.onrender.com)
Frontend:   Firebase Hosting (https://utility-logic-454816-h3.web.app)
Database:   MongoDB Atlas
Auth:       Firebase Authentication
Storage:    Firebase Storage / Cloudinary
```

### Environment Variables:
```
Backend:
- MONGODB_URI
- JWT_SECRET
- FIREBASE_PROJECT_ID
- PORT

Frontend:
- VITE_API_BASE_URL
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_PROJECT_ID
```

---

## Performance - পারফরম্যান্স

### Optimizations:
- ✅ Database indexing
- ✅ Query optimization
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Code splitting
- ✅ Caching strategies

### Scalability:
- 🔄 Horizontal scaling ready
- 🔄 Load balancing support
- 🔄 CDN integration
- 🔄 Microservices architecture (partial)

---

## Monitoring - মনিটরিং

### Logging:
- Console logs for development
- File-based logging (recommended)
- Error tracking (Sentry recommended)

### Metrics:
- API response times
- Database query performance
- User activity analytics
- Error rates

---

**আর্কিটেকচার সম্পূর্ণ এবং স্কেলেবল! 🎉**
