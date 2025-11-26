# 🧪 Complete Testing Guide
## Comprehensive Feature Testing & Error Reporting

---

## ⚡ Quick Start

### Automated Testing
```powershell
# Run all automated tests
.\scripts\test-features.ps1
```

This will:
- ✅ Test all API endpoints
- ✅ Test all frontend pages
- ✅ Test admin panel
- ✅ Generate detailed reports
- ✅ Create HTML test results

### Manual Testing
Use the checklist below for comprehensive manual testing.

---

## 🎯 Testing Strategy

### Test Levels

1. **Unit Tests** - Individual components (not covered here)
2. **Integration Tests** - Feature workflows
3. **UI/UX Tests** - User interface and experience
4. **API Tests** - Backend endpoints
5. **End-to-End Tests** - Complete user journeys

### Test Environments

- **Local** - http://localhost:3000
- **Network** - http://YOUR_IP:3000 (same WiFi)
- **Internet** - ngrok URL
- **Production** - Vercel URL

---

## 📋 Manual Testing Checklist

### 1. User Authentication

#### Registration
- [ ] Open registration page: http://localhost:3000/register
- [ ] Enter valid details:
  - Username: testuser1
  - Email: test@example.com
  - Password: Test@123
  - Phone: +1234567890
- [ ] Submit form
- [ ] **Expected:** Success message, redirect to login
- [ ] **Verify:** User created in database

#### Login
- [ ] Open login page: http://localhost:3000/login
- [ ] Enter credentials:
  - Email: test@example.com
  - Password: Test@123
- [ ] Click login
- [ ] **Expected:** Redirect to homepage
- [ ] **Verify:** User token stored
- [ ] **Verify:** Username displayed in header

#### Logout
- [ ] Click logout button
- [ ] **Expected:** Redirect to login
- [ ] **Verify:** Token cleared
- [ ] **Verify:** Cannot access protected routes

#### Password Reset
- [ ] Click "Forgot Password"
- [ ] Enter email
- [ ] **Expected:** Reset email sent
- [ ] Follow reset link
- [ ] Enter new password
- [ ] **Expected:** Password updated

### 2. Profile Management

#### View Profile
- [ ] Navigate to: http://localhost:3000/profile
- [ ] **Expected:** User details displayed
- [ ] **Verify:** Username, email, phone visible
- [ ] **Verify:** Profile picture shown

#### Edit Profile
- [ ] Click "Edit Profile"
- [ ] Update details:
  - Bio: "Test bio"
  - Location: "Test City"
- [ ] Save changes
- [ ] **Expected:** Success message
- [ ] **Verify:** Changes reflected immediately

#### Upload Profile Picture
- [ ] Click profile picture upload
- [ ] Select image file (JPG/PNG, < 5MB)
- [ ] Upload
- [ ] **Expected:** Image uploads to Cloudinary
- [ ] **Verify:** New picture displayed
- [ ] **Verify:** Picture shows in all places (header, posts, etc.)
- [ ] **Test:** Multiple uploads (replace existing)

#### View Other User Profiles
- [ ] Search for another user
- [ ] Click their profile
- [ ] **Expected:** Their profile shown
- [ ] **Verify:** Cannot edit other profiles
- [ ] **Verify:** Can follow/unfollow

### 3. Posts & Feed

#### Create Post
- [ ] Navigate to homepage
- [ ] Click "Create Post"
- [ ] Enter text: "This is a test post"
- [ ] Add image (optional)
- [ ] Post
- [ ] **Expected:** Post appears in feed
- [ ] **Verify:** Post shows author name & picture
- [ ] **Verify:** Timestamp displayed

#### Like Post
- [ ] Click like button on a post
- [ ] **Expected:** Like count increases
- [ ] **Verify:** Button changes to "Liked"
- [ ] Click again to unlike
- [ ] **Expected:** Like count decreases

#### Comment on Post
- [ ] Click comment button
- [ ] Enter comment: "Test comment"
- [ ] Submit
- [ ] **Expected:** Comment appears under post
- [ ] **Verify:** Comment shows author details
- [ ] **Verify:** Can delete own comments

#### Share Post
- [ ] Click share button
- [ ] **Expected:** Share dialog opens
- [ ] Select share method
- [ ] **Expected:** Post shared successfully

#### Delete Post
- [ ] Click delete on your own post
- [ ] Confirm deletion
- [ ] **Expected:** Post removed from feed
- [ ] **Verify:** Cannot be viewed anymore

#### Edit Post
- [ ] Click edit on your post
- [ ] Modify text
- [ ] Save
- [ ] **Expected:** Post updated
- [ ] **Verify:** "Edited" label shown

### 4. Messenger

#### View Conversations
- [ ] Navigate to: http://localhost:3000/messenger
- [ ] **Expected:** List of conversations shown
- [ ] **Verify:** Last message preview visible
- [ ] **Verify:** Unread count displayed

#### Start New Conversation
- [ ] Click "New Message"
- [ ] Search for user
- [ ] Select user
- [ ] **Expected:** Conversation started
- [ ] **Verify:** Empty chat shown

#### Send Message
- [ ] Type message: "Hello, test message"
- [ ] Press Enter or click Send
- [ ] **Expected:** Message sent
- [ ] **Verify:** Message appears with timestamp
- [ ] **Verify:** "Delivered" status shown

#### Send Image
- [ ] Click image upload button
- [ ] Select image
- [ ] Send
- [ ] **Expected:** Image uploaded and sent
- [ ] **Verify:** Image preview shown
- [ ] **Verify:** Can click to view full size

#### Receive Message
- [ ] Have another user send you a message
- [ ] **Expected:** Message appears in real-time
- [ ] **Verify:** Notification shown
- [ ] **Verify:** Unread count increases

#### Delete Message
- [ ] Long press or right-click message
- [ ] Select delete
- [ ] **Expected:** Message removed
- [ ] **Verify:** "Message deleted" placeholder

#### Search Conversations
- [ ] Use search bar
- [ ] Enter user name or message text
- [ ] **Expected:** Relevant conversations shown
- [ ] **Verify:** Search is case-insensitive

### 5. Wallet

#### View Balance
- [ ] Navigate to: http://localhost:3000/wallet
- [ ] **Expected:** Current balance displayed
- [ ] **Verify:** Transaction history shown
- [ ] **Verify:** Currency symbol correct

#### Add Money
- [ ] Click "Add Money"
- [ ] Enter amount: 100
- [ ] Select payment method
- [ ] Confirm
- [ ] **Expected:** Balance increased
- [ ] **Verify:** Transaction recorded
- [ ] **Verify:** Confirmation message shown

#### Send Money
- [ ] Click "Send Money"
- [ ] Enter recipient username
- [ ] Enter amount: 50
- [ ] Add note (optional)
- [ ] Confirm
- [ ] **Expected:** Money transferred
- [ ] **Verify:** Balance decreased
- [ ] **Verify:** Transaction in history

#### Transaction History
- [ ] View all transactions
- [ ] **Verify:** Date, amount, type shown
- [ ] **Verify:** Can filter by type
- [ ] **Verify:** Can download statement

#### Request Money
- [ ] Click "Request Money"
- [ ] Enter user and amount
- [ ] Send request
- [ ] **Expected:** Request sent
- [ ] **Verify:** User receives notification

### 6. Games

#### View Games List
- [ ] Navigate to: http://localhost:3000/games
- [ ] **Expected:** All games displayed
- [ ] **Verify:** Game thumbnails shown
- [ ] **Verify:** Game descriptions visible

#### Dice Game
- [ ] Click "Dice Game"
- [ ] Enter bet amount: 10
- [ ] Select prediction (High/Low)
- [ ] Roll dice
- [ ] **Expected:** Result shown
- [ ] **Verify:** Balance updated correctly
- [ ] **Verify:** Game result recorded

#### Spin Wheel
- [ ] Click "Spin Wheel"
- [ ] Enter bet amount
- [ ] Spin
- [ ] **Expected:** Wheel animates
- [ ] **Verify:** Result announced
- [ ] **Verify:** Winnings added to wallet

#### Game History
- [ ] View game history
- [ ] **Expected:** Past games listed
- [ ] **Verify:** Date, game type, result shown
- [ ] **Verify:** Can filter by game

### 7. Admin Panel

#### Admin Login
- [ ] Navigate to: http://localhost:3001/admin/login
- [ ] Enter admin credentials:
  - Email: admin@admin.com
  - Password: admin123
- [ ] Login
- [ ] **Expected:** Redirect to dashboard
- [ ] **Verify:** Admin menu visible

#### Dashboard
- [ ] View admin dashboard
- [ ] **Expected:** Statistics displayed
- [ ] **Verify:** Total users count
- [ ] **Verify:** Total transactions
- [ ] **Verify:** Active games count
- [ ] **Verify:** Charts/graphs shown

#### User Management
- [ ] Navigate to Users section
- [ ] **Expected:** All users listed
- [ ] **Verify:** Can search users
- [ ] **Verify:** Can view user details
- [ ] **Verify:** Can suspend/activate users
- [ ] **Verify:** Can reset passwords

#### Wallet Management
- [ ] Navigate to Wallet section
- [ ] **Expected:** All transactions listed
- [ ] **Verify:** Can filter by user
- [ ] **Verify:** Can filter by type
- [ ] **Verify:** Can view details
- [ ] **Verify:** Can approve/reject transactions

#### Game Logs
- [ ] Navigate to Games section
- [ ] **Expected:** All game activities shown
- [ ] **Verify:** Can filter by game type
- [ ] **Verify:** Can view player details
- [ ] **Verify:** Can see bet amounts
- [ ] **Verify:** Can export data

#### Super Admin
- [ ] Login as super admin
- [ ] Navigate to Super Admin section
- [ ] **Expected:** Additional controls shown
- [ ] **Verify:** Can manage admins
- [ ] **Verify:** Can view system logs
- [ ] **Verify:** Can configure settings

### 8. Settings

#### Account Settings
- [ ] Navigate to settings
- [ ] Update email
- [ ] Update phone
- [ ] Save changes
- [ ] **Expected:** Settings saved
- [ ] **Verify:** Changes reflected

#### Privacy Settings
- [ ] Toggle profile visibility
- [ ] Set who can message you
- [ ] Save
- [ ] **Expected:** Privacy updated
- [ ] **Verify:** Settings enforced

#### Notification Settings
- [ ] Toggle push notifications
- [ ] Toggle email notifications
- [ ] Save
- [ ] **Expected:** Preferences saved
- [ ] **Verify:** Notifications follow settings

#### Delete Account
- [ ] Click "Delete Account"
- [ ] Confirm deletion
- [ ] **Expected:** Account deleted
- [ ] **Verify:** Cannot login
- [ ] **Verify:** Data removed

---

## 🔌 API Testing

### Health Check
```powershell
curl http://localhost:8000/api/health
# Expected: {"status": "ok"}
```

### Authentication
```powershell
# Register
$body = @{email='test@test.com'; password='Test@123'; username='testuser'} | ConvertTo-Json
curl -Method POST -Uri 'http://localhost:8000/api/auth/register' -Body $body -ContentType 'application/json'

# Login
$body = @{email='test@test.com'; password='Test@123'} | ConvertTo-Json
$response = curl -Method POST -Uri 'http://localhost:8000/api/auth/login' -Body $body -ContentType 'application/json'
$token = ($response | ConvertFrom-Json).token
```

### Protected Endpoints
```powershell
# Get current user
curl -Method GET -Uri 'http://localhost:8000/api/auth/me' -Headers @{Authorization="Bearer $token"}

# Get users
curl -Method GET -Uri 'http://localhost:8000/api/users' -Headers @{Authorization="Bearer $token"}
```

---

## 🐛 Error Testing

### Test Error Scenarios

#### 1. Invalid Input
- [ ] Try registering with invalid email
- [ ] Try empty required fields
- [ ] Try SQL injection in inputs
- [ ] Try XSS in text fields
- [ ] **Expected:** Validation errors shown

#### 2. Network Errors
- [ ] Stop backend server
- [ ] Try making API calls
- [ ] **Expected:** Error message shown
- [ ] **Verify:** User-friendly message

#### 3. Authentication Errors
- [ ] Try accessing protected page without login
- [ ] Try expired token
- [ ] Try invalid credentials
- [ ] **Expected:** Redirect to login

#### 4. File Upload Errors
- [ ] Upload file > 5MB
- [ ] Upload invalid file type
- [ ] Upload corrupted file
- [ ] **Expected:** Error message shown

#### 5. Payment Errors
- [ ] Try sending more money than balance
- [ ] Try negative amounts
- [ ] Try invalid recipient
- [ ] **Expected:** Transaction rejected

---

## 📊 Performance Testing

### Load Times
- [ ] Homepage loads < 2 seconds
- [ ] API responses < 500ms
- [ ] Images load progressively
- [ ] No blocking requests

### Resource Usage
- [ ] Memory usage reasonable
- [ ] No memory leaks
- [ ] CPU usage acceptable
- [ ] Network bandwidth efficient

### Scalability
- [ ] Test with 100 posts
- [ ] Test with 1000 messages
- [ ] Test with 50 concurrent users
- [ ] **Verify:** Performance degrades gracefully

---

## 🔒 Security Testing

### Authentication Security
- [ ] Passwords hashed (not plain text)
- [ ] JWT tokens expire
- [ ] Refresh tokens work
- [ ] Session management secure

### Authorization
- [ ] Users can only edit own data
- [ ] Admin routes protected
- [ ] API endpoints authenticated
- [ ] CORS configured correctly

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS attacks blocked
- [ ] CSRF protection enabled
- [ ] File upload validated

### Data Protection
- [ ] Sensitive data encrypted
- [ ] HTTPS used (production)
- [ ] API keys not exposed
- [ ] Error messages don't leak info

---

## 📱 Mobile Testing

### Responsive Design
- [ ] Test on mobile screen sizes
- [ ] Test on tablet
- [ ] Test landscape/portrait
- [ ] **Verify:** UI adapts correctly

### Touch Interactions
- [ ] Buttons easily tappable
- [ ] Swipe gestures work
- [ ] Pinch to zoom (where needed)
- [ ] **Verify:** No accidental clicks

### Mobile Performance
- [ ] App loads quickly
- [ ] Smooth scrolling
- [ ] Images optimized
- [ ] Minimal data usage

---

## 🌐 Cross-Browser Testing

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge (latest)

### Features to Test
- [ ] All pages render correctly
- [ ] JavaScript functions work
- [ ] CSS displays properly
- [ ] Forms submit correctly

---

## 📝 Bug Report Template

When you find a bug, document it:

```markdown
## Bug Report

**Title:** Brief description

**Priority:** High / Medium / Low

**Environment:**
- URL: http://localhost:3000/page
- Browser: Chrome 120
- OS: Windows 11
- Date: 2025-11-27

**Steps to Reproduce:**
1. Go to page X
2. Click button Y
3. Enter value Z
4. Submit form

**Expected Result:**
Should show success message

**Actual Result:**
Error message appears: "undefined is not a function"

**Screenshots:**
[Attach screenshots]

**Console Errors:**
```
TypeError: Cannot read property 'x' of undefined
  at App.js:123
```

**Additional Notes:**
Only happens when logged in as admin
```

---

## ✅ Test Completion Checklist

### Before Release
- [ ] All automated tests pass
- [ ] All manual tests completed
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Mobile tested
- [ ] Cross-browser tested
- [ ] Documentation updated

### Sign-Off
- [ ] Developer tested
- [ ] QA tested
- [ ] Stakeholder approved
- [ ] Ready for deployment

---

## 🎯 Quick Test Commands

```powershell
# Run automated tests
.\scripts\test-features.ps1

# Test specific category
.\scripts\test-features.ps1 -Category "Frontend"

# Generate test report
.\scripts\generate-test-report.ps1

# Test with different environments
$env:TEST_ENV="production"
.\scripts\test-features.ps1
```

---

**🧪 Happy Testing!**

Report issues in: `test-reports/` folder
