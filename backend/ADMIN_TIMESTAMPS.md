# Admin Panel & Timestamp Documentation 📊

## ✅ Automatic Timestamps Implemented

### All Models Now Have:

1. **Automatic Timestamps** (`timestamps: true`)
   - `createdAt` - Automatically set when record is created
   - `updatedAt` - Automatically updated when record is modified

2. **Admin Tracking Fields**
   - Who created the record
   - Who last modified it
   - When was it deleted (soft delete)
   - Who deleted it

## 📋 Model-Specific Timestamp Fields

### User Model
```javascript
createdAt      // Auto: Account creation date & time
updatedAt      // Auto: Last profile update date & time
lastLogin      // Manual: Last login timestamp
createdBy      // Admin who created (for manual accounts)
updatedBy      // Admin who last edited
deletedAt      // Soft delete timestamp
deletedBy      // Admin who deleted
```

### Post Model
```javascript
createdAt       // Auto: Post creation date & time
updatedAt       // Auto: Last edit date & time
publishedAt     // When post was published
editedAt        // When post was manually edited
editedBy        // Admin who edited
deletedAt       // Soft delete timestamp
deletedBy       // Admin who deleted
moderatedAt     // When post was moderated
moderatedBy     // Admin who moderated
```

### Message Model
```javascript
createdAt    // Auto: Message sent date & time
updatedAt    // Auto: Last update (e.g., read status change)
readAt       // When message was read
deliveredAt  // When message was delivered
deletedAt    // When message was deleted
editedAt     // When message was edited
editedBy     // Admin who edited
```

### Conversation Model
```javascript
createdAt        // Auto: Conversation start date & time
updatedAt        // Auto: Last activity date & time
lastMessageTime  // Timestamp of last message
createdBy        // Who initiated conversation
lastModifiedBy   // Admin who last modified
```

### Wallet Model
```javascript
createdAt       // Auto: Wallet creation date & time
updatedAt       // Auto: Last balance update date & time
lastTransaction // Timestamp of last transaction
lastModifiedBy  // Admin who last modified
verifiedAt      // When wallet was verified
verifiedBy      // Admin who verified
```

### WalletTransaction Model
```javascript
createdAt        // Auto: Transaction creation date & time
updatedAt        // Auto: Status change date & time
processedAt      // When admin processed transaction
processedBy      // Admin who processed
approvedAt       // Approval timestamp
approvedBy       // Admin who approved
rejectedAt       // Rejection timestamp
rejectedBy       // Admin who rejected
rejectionReason  // Why rejected
```

### Notification Model
```javascript
createdAt     // Auto: Notification creation date & time
updatedAt     // Auto: Last update date & time
readAt        // When notification was read
expiresAt     // When notification expires
sentBy        // Admin who sent (for manual notifications)
scheduledFor  // When to send notification
```

### AdminLog Model (NEW)
```javascript
createdAt  // Auto: When admin action was performed
updatedAt  // Auto: When log was updated
// Full audit trail of all admin actions
```

## 🔐 Admin Role System

### User Roles
```javascript
role: 'user' | 'staff' | 'admin' | 'superadmin'
isAdmin: boolean
isStaff: boolean
permissions: [
  'manage_users',
  'manage_posts',
  'manage_wallet',
  'manage_transactions',
  'view_reports',
  'moderate_content',
  'send_notifications',
  'view_logs',
  'manage_settings'
]
```

## 📊 Admin Activity Logging

### AdminLog Model Features
- **Automatic tracking** of all admin actions
- **Who, What, When, Where** - Complete audit trail
- **Before/After values** for all changes
- **IP address & User Agent** tracking
- **Action types**: create, update, delete, approve, reject, ban, etc.
- **Target tracking**: Which model and record was affected

### Logged Information
```javascript
{
  admin: ObjectId,              // Who performed action
  action: 'create|update|...',  // What action
  targetModel: 'User|Post|...',  // Which model
  targetId: ObjectId,           // Which record
  description: String,          // Human-readable description
  oldValues: {},                // Before changes
  newValues: {},                // After changes
  ipAddress: String,            // From where
  userAgent: String,            // Using what
  createdAt: Date,              // When exactly
  status: 'success|failed'      // Did it work
}
```

## 🔌 Admin API Endpoints

### Activity Logs
```
GET  /api/admin/logs
     - Get all admin activity logs
     - Filters: action, targetModel, adminId, date range, status

GET  /api/admin/logs/my-activity
     - Get current admin's activity

GET  /api/admin/logs/target/:targetModel/:targetId
     - Get all changes to specific record

GET  /api/admin/stats/activity
     - Get activity statistics (charts data)

GET  /api/admin/activity/recent
     - Get recent activity for dashboard

DELETE /api/admin/logs/cleanup?daysOld=90
       - Delete old logs (superadmin only)
```

### Using Admin Tracker Middleware
```javascript
const { adminAuth, trackAdminAction } = require('../middleware/adminTracker');

// Protect route and track action
router.post('/users/:id/ban', 
  auth,                           // User must be logged in
  adminAuth,                      // User must be admin
  trackAdminAction('ban', 'User'), // Auto-log this action
  async (req, res) => {
    // Your handler code
  }
);
```

## 📈 Admin Panel Features

### Dashboard
- Recent activity feed
- Statistics by action type
- Most active admins
- Failed action alerts

### User Management
- View all admin actions on user
- See who created/modified user
- Track bans, unbans, role changes
- Full edit history with timestamps

### Transaction Management
- Who approved/rejected each transaction
- When was it processed
- View processing timeline
- Audit trail for disputes

### Content Moderation
- Track who moderated posts
- See moderation history
- Timestamps for all actions
- Moderation notes with timestamps

### Wallet Management
- Transaction approval tracking
- Who verified wallets
- Balance change history with timestamps
- Fraud detection timeline

## 🎯 How to Use in Frontend

### Display Creation Date
```javascript
// Format timestamp
const createdDate = new Date(user.createdAt).toLocaleString('bn-BD', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

// Output: "২৩ নভেম্বর, ২০২৫ ১২:৩০"
```

### Show Last Update
```javascript
// Check if updated after creation
const isEdited = user.updatedAt > user.createdAt;

if (isEdited) {
  const lastUpdate = new Date(user.updatedAt).toLocaleString('bn-BD');
  console.log(`Last edited: ${lastUpdate}`);
}
```

### Display Admin Actions
```javascript
// Fetch activity logs
const response = await fetch('/api/admin/logs/target/User/12345', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { logs } = await response.json();

logs.forEach(log => {
  console.log(`${log.admin.name} - ${log.action} - ${log.createdAt}`);
  console.log('Changes:', log.oldValues, '→', log.newValues);
});
```

## ⚙️ Database Indexes

All timestamp fields are indexed for efficient querying:
- `createdAt` (descending) - For latest records
- `updatedAt` (descending) - For recent changes
- `createdAt + targetModel` - For model-specific history
- `admin + createdAt` - For admin activity

## 🚀 Migration Steps

### 1. Update Existing Records
```javascript
// Run this once to add timestamps to existing records
const User = require('./models/User');

const users = await User.find({ createdAt: { $exists: false } });
users.forEach(async (user) => {
  user.createdAt = user._id.getTimestamp(); // Get from ObjectId
  user.updatedAt = new Date();
  await user.save();
});
```

### 2. Create First Admin User
```javascript
const user = await User.findOne({ email: 'admin@example.com' });
user.role = 'superadmin';
user.isAdmin = true;
user.permissions = [
  'manage_users',
  'manage_posts',
  'manage_wallet',
  'manage_transactions',
  'view_reports',
  'moderate_content',
  'send_notifications',
  'view_logs',
  'manage_settings'
];
await user.save();
```

### 3. Start Using Admin Logs
```javascript
const { logAdminAction } = require('./middleware/adminTracker');

// Manually log an action
await logAdminAction(adminId, 'ban', 'User', {
  targetId: userId,
  description: 'Banned user for violating terms',
  oldValues: { isActive: true },
  newValues: { isActive: false },
  ipAddress: req.ip
});
```

## 📊 Timestamp Display Examples

### Bengali Format
```javascript
const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
};

const bengaliDate = new Date(record.createdAt).toLocaleString('bn-BD', options);
// Output: "২৩ নভেম্বর, ২০২৫ দুপুর ১২:৩০"
```

### Relative Time
```javascript
function timeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  
  if (seconds < 60) return `${seconds} সেকেন্ড আগে`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} মিনিট আগে`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ঘন্টা আগে`;
  return `${Math.floor(seconds / 86400)} দিন আগে`;
}
```

## 🔍 Querying with Timestamps

### Find records created today
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

const todayRecords = await Model.find({
  createdAt: { $gte: today }
});
```

### Find records updated in last 7 days
```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentlyUpdated = await Model.find({
  updatedAt: { $gte: sevenDaysAgo }
});
```

### Find records by date range
```javascript
const records = await Model.find({
  createdAt: {
    $gte: new Date('2025-01-01'),
    $lte: new Date('2025-12-31')
  }
});
```

---

**Status**: ✅ Complete - All models have automatic timestamps and admin tracking
**Created**: November 23, 2025
**Admin Logs**: Fully functional and ready for use
