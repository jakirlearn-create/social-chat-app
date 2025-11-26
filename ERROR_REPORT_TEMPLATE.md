# 🐛 Bug/Error Report

---

## Basic Information

**Report ID:** ER-[YYYYMMDD]-[NUMBER]  
**Date:** [DD/MM/YYYY]  
**Time:** [HH:MM AM/PM]  
**Reporter:** [Your Name]  
**Environment:** [Local / Network / Production]

---

## Bug Classification

**Priority:** 
- [ ] 🔴 Critical (App crashes, data loss)
- [ ] 🟠 High (Major feature broken)
- [ ] 🟡 Medium (Feature partially broken)
- [ ] 🟢 Low (Minor issue, cosmetic)

**Type:**
- [ ] 🐛 Bug (Something doesn't work)
- [ ] 💥 Crash (App crashes/freezes)
- [ ] 🎨 UI/UX Issue (Display problem)
- [ ] 🚀 Performance (Slow/lag)
- [ ] 🔒 Security (Vulnerability)
- [ ] 📱 Mobile Specific
- [ ] 🌐 Browser Specific

**Category:**
- [ ] Authentication
- [ ] Profile
- [ ] Posts/Feed
- [ ] Messenger
- [ ] Wallet
- [ ] Games
- [ ] Admin Panel
- [ ] Settings
- [ ] Other: _____________

---

## Bug Details

### Title
**Brief Description (one line):**
```
[Example: Login button not responding when clicked]
```

### Detailed Description
**What happened?**
```
[Provide detailed description of the issue]
```

### Expected Behavior
**What should happen?**
```
[Describe what you expected to see]
```

### Actual Behavior
**What actually happened?**
```
[Describe what actually occurred]
```

---

## Environment Details

### System Information
- **Operating System:** [Windows 11 / macOS / Linux / Android / iOS]
- **OS Version:** [Version number]
- **Browser:** [Chrome / Firefox / Safari / Edge]
- **Browser Version:** [Version number]
- **Screen Resolution:** [1920x1080 / etc]
- **Device:** [Desktop / Laptop / Mobile / Tablet]
- **Device Model:** [If mobile/tablet]

### Application Information
- **URL:** [http://localhost:3000/page or production URL]
- **App Version:** [1.0.0]
- **Backend URL:** [http://localhost:8000]
- **Frontend Port:** [3000 / 3001]
- **Database:** [MongoDB version]

### Network Information
- **Connection Type:** [WiFi / Mobile Data / Ethernet]
- **Connection Speed:** [Fast / Slow]
- **Using VPN:** [Yes / No]
- **Using Proxy:** [Yes / No]

---

## Steps to Reproduce

**Can you reproduce this bug?**
- [ ] Always (Every time)
- [ ] Sometimes (Intermittent)
- [ ] Once (Cannot reproduce)

**Steps:**
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue...]

**Example:**
```
1. Open http://localhost:3000/login
2. Enter email: test@test.com
3. Enter password: Test@123
4. Click "Login" button
5. Wait 5 seconds
6. Bug occurs: Page remains on login, no error shown
```

---

## Screenshots & Evidence

### Screenshots
**Attach screenshots showing the issue:**
- [ ] Screenshot 1: [Description]
- [ ] Screenshot 2: [Description]
- [ ] Screenshot 3: [Description]

**How to take screenshots:**
- Windows: `Win + Shift + S`
- Mac: `Cmd + Shift + 4`
- Browser: F12 > Right-click element > Screenshot

### Screen Recording
- [ ] Video recording attached
- [ ] Video URL: _______________

---

## Console Errors

### Browser Console
**Open with F12 > Console tab**

```javascript
// Paste console errors here

Example:
Uncaught TypeError: Cannot read property 'username' of undefined
    at Profile.js:45
    at App.js:123

Network Error: Failed to fetch
    at authService.js:78
```

### Network Tab
**F12 > Network tab**

**Failed Requests:**
```
Request: POST http://localhost:8000/api/auth/login
Status: 500 Internal Server Error
Response: {"error": "Database connection failed"}
```

### Backend Logs
**From backend console/terminal:**

```bash
# Paste backend errors here

Example:
[ERROR] MongoDB connection error
[ERROR] User not found in database
[ERROR] Token validation failed
```

---

## Database State

### User State
- **Logged In:** [Yes / No]
- **Username:** [username]
- **User ID:** [user_id]
- **Role:** [user / admin / superadmin]

### Data Related
**Relevant data IDs:**
- Post ID: _______________
- Message ID: _______________
- Transaction ID: _______________
- Conversation ID: _______________

---

## Additional Information

### User Actions Before Bug
**What were you doing before the bug occurred?**
```
[Example: Was sending multiple messages rapidly in messenger]
```

### Frequency
**How often does this happen?**
- [ ] Every time I try
- [ ] 75% of the time
- [ ] 50% of the time
- [ ] Rarely (< 25%)
- [ ] Only once

### Impact
**How does this affect your work?**
- [ ] Cannot continue work (Blocker)
- [ ] Can work around it (Major)
- [ ] Minor inconvenience (Minor)
- [ ] Doesn't affect work (Trivial)

### Workaround
**Is there a temporary solution?**
```
[Example: Refreshing the page fixes it temporarily]
```

---

## Technical Investigation

### API Requests
**Copy from Network tab:**

**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "Test@123"
}
```

**Response:**
```json
{
  "error": "Invalid credentials",
  "code": 401
}
```

### Local Storage
**F12 > Application > Local Storage:**
```javascript
token: "eyJhbGc..."
userId: "123456"
username: "testuser"
```

### Cookies
**F12 > Application > Cookies:**
```
session_id: abc123
auth_token: xyz789
```

---

## Possible Causes

**Your theory about what's causing this:**
```
[Example: Seems like the token is expiring too quickly,
or the API is not validating tokens properly]
```

**Related Issues:**
- Similar to issue: ER-20250127-001
- Might be caused by: Recent changes to auth system

---

## Fix Suggestions

**Possible solutions:**
1. [Suggestion 1]
2. [Suggestion 2]
3. [Suggestion 3]

**Code That Might Need Fixing:**
```javascript
// File: authService.js:78
// Current code:
const response = await axios.post('/api/auth/login', data);

// Suggested fix:
const response = await axios.post('/api/auth/login', data)
  .catch(error => {
    console.error('Login error:', error);
    throw new Error('Login failed');
  });
```

---

## Attachments

**Files to attach:**
- [ ] Screenshot of error
- [ ] Video recording
- [ ] Console log file
- [ ] Network HAR file
- [ ] Database dump (if relevant)

**File List:**
1. error-screenshot-1.png
2. console-log.txt
3. network-requests.har

---

## Status Tracking

**Current Status:**
- [ ] 🆕 New (Just reported)
- [ ] 🔍 Investigating (Being looked at)
- [ ] 🔧 In Progress (Being fixed)
- [ ] ✅ Fixed (Awaiting verification)
- [ ] ✔️ Verified (Tested and confirmed fixed)
- [ ] 🚫 Won't Fix (Not a bug or not fixing)
- [ ] 📋 Duplicate (Same as another report)

**Assigned To:** [Developer name]

**Target Fix Date:** [DD/MM/YYYY]

---

## Testing After Fix

### Verification Steps
**How to verify the fix:**
1. [Test step 1]
2. [Test step 2]
3. [Test step 3]

**Expected Result After Fix:**
```
[What should happen after bug is fixed]
```

### Regression Testing
**Check these aren't broken:**
- [ ] Related feature 1
- [ ] Related feature 2
- [ ] Related feature 3

---

## Developer Notes

**For developer use:**

**Root Cause:**
```
[What was causing the bug]
```

**Fix Applied:**
```
[What changes were made]
```

**Files Changed:**
- authService.js:78
- Login.js:45
- auth.js (backend):123

**Commit ID:** [Git commit hash]

**Fix Deployed:** [Date/Time]

---

## Checklist Before Submitting

- [ ] Title is clear and descriptive
- [ ] Priority is set
- [ ] Steps to reproduce are detailed
- [ ] Screenshots attached (if UI bug)
- [ ] Console errors included
- [ ] Environment details provided
- [ ] Can reproduce the bug
- [ ] Checked if already reported
- [ ] Tested in different browser (if relevant)

---

**📧 Contact:** [Your email/phone]

**🔗 Related Links:**
- Issue tracker: _______________
- Documentation: _______________
- Similar bugs: _______________

---

## Quick Reference

### How to Get Information

**Browser Console Errors:**
```
1. Press F12
2. Go to Console tab
3. Look for red errors
4. Copy error messages
```

**Network Errors:**
```
1. Press F12
2. Go to Network tab
3. Look for failed requests (red)
4. Click request to see details
```

**Backend Logs:**
```
1. Open terminal running backend
2. Look for error messages
3. Copy relevant lines
```

**Database Check:**
```powershell
# Connect to MongoDB
mongo
use social_chat_app
db.users.find({email: "test@test.com"})
```

---

**Save this file as:** `bug-report-[DATE]-[DESCRIPTION].md`

**Example:** `bug-report-20250127-login-button-not-working.md`
