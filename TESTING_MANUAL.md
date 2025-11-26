# 🧪 Complete Testing Manual

**প্রোজেক্ট:** Social Chat App  
**Testing Type:** Manual + Automated  
**Last Updated:** নভেম্বর ২৬, ২০২৫

---

## 📱 Device Testing Matrix

### ✅ Android Devices (Priority: HIGH)

| Device | Screen | Resolution | Status | Notes |
|--------|--------|------------|--------|-------|
| Samsung Galaxy A10 | 5.5" | 720x1480 | ⏳ | Budget device |
| Samsung Galaxy S21 | 6.2" | 1080x2400 | ⏳ | Flagship |
| OnePlus 9 | 6.55" | 1080x2400 | ⏳ | Mid-range |
| Xiaomi Redmi Note 10 | 6.43" | 1080x2400 | ⏳ | Popular |
| Samsung Tab A7 | 10.4" | 1200x2000 | ⏳ | Tablet |

### ✅ iOS Devices (Priority: MEDIUM)

| Device | Screen | Resolution | Status | Notes |
|--------|--------|------------|--------|-------|
| iPhone SE (2020) | 4.7" | 750x1334 | ⏳ | Small screen |
| iPhone 12 | 6.1" | 1170x2532 | ⏳ | Standard |
| iPhone 13 Pro Max | 6.7" | 1284x2778 | ⏳ | Large |
| iPad Air | 10.9" | 1640x2360 | ⏳ | Tablet |

### ✅ Desktop Browsers (Priority: MEDIUM)

| Browser | Version | OS | Status | Notes |
|---------|---------|-------|--------|-------|
| Chrome | Latest | Windows 11 | ⏳ | Primary |
| Firefox | Latest | Windows 11 | ⏳ | Secondary |
| Edge | Latest | Windows 11 | ⏳ | Secondary |
| Safari | Latest | macOS | ⏳ | iOS users |

---

## 🔐 Authentication Testing

### Test Case 1: Email/Password Login

**URL:** `http://localhost:3000/login`

```
Steps:
1. Open login page
2. Enter email: test@example.com
3. Enter password: Test@123
4. Click "Login" button

Expected Result:
✅ Loading spinner shows
✅ API call to /api/auth/login
✅ Token saved to localStorage
✅ Redirect to /home
✅ User data in global state

Test Data:
- Valid: test@example.com / Test@123
- Invalid email: invalid@email
- Invalid password: wrong123
- Empty fields: Should show validation error
```

**Status:** ⏳

---

### Test Case 2: Phone Number OTP Login

```
Steps:
1. Open login page
2. Click "Login with Phone"
3. Enter phone: +8801712345678
4. Click "Send OTP"
5. Enter OTP: 123456 (mock)
6. Click "Verify"

Expected Result:
✅ OTP sent message
✅ 60 second countdown timer
✅ OTP input accepts 6 digits only
✅ Verify button enabled after 6 digits
✅ Login successful → redirect to /home

Test Scenarios:
- Valid phone: +8801712345678
- Invalid format: 01712345678 (no country code)
- Wrong OTP: 000000 → Error message
- Expired OTP: Wait 5 minutes → "OTP expired"
- Resend OTP: Click "Resend" after 60s
```

**Status:** ⏳

---

### Test Case 3: Google Sign-In

```
Steps:
1. Open login page
2. Click "Continue with Google"
3. Google popup opens
4. Select account
5. Grant permissions

Expected Result:
✅ Google OAuth popup
✅ User info fetched (name, email, photo)
✅ Account created automatically
✅ Redirect to /home
✅ Profile photo displayed

Edge Cases:
- Popup blocked → Show instruction
- User cancels → No error
- Network error → Retry option
```

**Status:** ⏳

---

## 🏠 Home Page Testing

### Test Case 4: Page Load Performance

```
Steps:
1. Open /home in Chrome
2. Open DevTools (F12) → Network tab
3. Reload page (Ctrl+R)
4. Check metrics

Expected Result:
✅ First Contentful Paint < 1.5s
✅ Time to Interactive < 3s
✅ Total page size < 2MB
✅ Images lazy loaded
✅ API calls sequential not parallel

Metrics to Record:
- Load time: ___ ms
- DOM content loaded: ___ ms
- Total requests: ___
- Total size: ___ MB
```

**Status:** ⏳

---

### Test Case 5: TopBar Scroll Behavior

```
Steps:
1. Open /home
2. Scroll down 100px
3. Observe TopBar
4. Scroll up 50px
5. Observe TopBar

Expected Result:
✅ Scroll down → TopBar hides (translateY -100%)
✅ Scroll up → TopBar shows (translateY 0)
✅ Animation smooth (300ms transition)
✅ No jittering
✅ Works on mobile touch scroll

Test on:
- Desktop mouse wheel
- Laptop trackpad
- Mobile touch scroll
- Slow scroll vs fast scroll
```

**Status:** ⏳

---

## 💬 Posts Page Testing

### Test Case 6: Posts Feed Load

**URL:** `http://localhost:3000/posts`

```
Steps:
1. Navigate to /posts
2. Observe loading state
3. Posts appear
4. Scroll to load more

Expected Result:
✅ Loading spinner/skeleton
✅ Posts appear in 2-3 seconds
✅ User avatars load
✅ Images optimized (WebP preferred)
✅ Infinite scroll or "Load More"
✅ Smooth scrolling

Performance:
- Initial load: 10 posts
- Pagination: 10 posts per page
- Max posts in memory: 50 (to prevent lag)
```

**Status:** ⏳

---

### Test Case 7: Like Button Interaction

```
Steps:
1. Find a post
2. Click ❤️ Like button
3. Observe changes
4. Click again to unlike

Expected Result:
✅ Button turns red immediately (optimistic UI)
✅ Like count increases
✅ API call to /api/posts/:id/like
✅ If API fails → Revert UI
✅ Unlike works (toggle)
✅ Animation on click

Edge Cases:
- Double click → Should handle once
- Network error → Show error toast
- Already liked by user → Unlike
```

**Status:** ⏳

---

### Test Case 8: Comment Modal

```
Steps:
1. Click 💬 Comment button
2. Modal slides up
3. Enter comment text
4. Click "Send"
5. Comment appears

Expected Result:
✅ Modal animation (slide from bottom)
✅ Backdrop blur effect
✅ Input field auto-focus
✅ Send button disabled if empty
✅ Comment posted → appears instantly
✅ Close modal button works

Test Cases:
- Short comment: "Nice!"
- Long comment: 500 characters
- Empty comment: Should not send
- Special characters: Emojis 🎉, symbols @#$
- Mention: @username auto-suggest
```

**Status:** ⏳

---

### Test Case 9: Video Post Playback

```
Steps:
1. Scroll to video post
2. Video auto-plays (muted)
3. Click video to unmute
4. Pause/Play controls
5. Fullscreen button

Expected Result:
✅ Auto-play when in viewport
✅ Pause when out of viewport
✅ Mute/Unmute toggle
✅ Play/Pause on tap
✅ Fullscreen works
✅ Loading spinner while buffering
✅ Playback speed control (optional)

Performance:
- Video resolution: 720p default
- Auto-quality adjustment
- Buffer ahead: 5 seconds
```

**Status:** ⏳

---

## 💰 Wallet Page Testing

### Test Case 10: Balance Display

**URL:** `http://localhost:3000/wallet`

```
Steps:
1. Navigate to /wallet
2. Observe balance load
3. Check transaction history

Expected Result:
✅ Current balance fetched from API
✅ Balance formatted: ৳1,234.56
✅ Last updated timestamp
✅ Refresh button works
✅ Transaction history loads (last 20)

Test Data:
- User with balance: ৳500.00
- User with zero balance: ৳0.00
- New user: "No transactions yet"
```

**Status:** ⏳

---

### Test Case 11: Deposit Request Flow

```
Steps:
1. Click "Deposit" button
2. Enter amount: ৳500
3. Select payment method: Bkash
4. Enter transaction ID: ABC123456
5. Upload screenshot (optional)
6. Submit request

Expected Result:
✅ Amount validation (min ৳50)
✅ Payment method required
✅ Transaction ID required
✅ Screenshot upload (max 5MB)
✅ Confirmation modal
✅ Request sent to admin panel
✅ Status: Pending
✅ Notification: "Request submitted"

API Call:
POST /api/wallet/deposit
{
  "amount": 500,
  "method": "bkash",
  "transactionId": "ABC123456",
  "screenshot": "base64_or_url"
}

Response:
{
  "success": true,
  "requestId": "REQ123456",
  "status": "pending"
}
```

**Status:** ⏳

---

### Test Case 12: Admin Approves Deposit

```
Steps:
1. Admin opens admin panel
2. Goes to Wallet Requests
3. Sees pending deposit
4. Verifies screenshot
5. Clicks "Approve"
6. User's wallet updates

Expected Result:
✅ Admin sees request details
✅ Screenshot preview
✅ User info displayed
✅ Approve button enabled
✅ API call to /api/admin/wallet/approve/:id
✅ User's balance updates real-time
✅ User gets notification: "Deposit approved"
✅ Transaction added to history

Test Scenarios:
- Valid screenshot → Approve
- Suspicious request → Reject with reason
- Already processed → Show error
```

**Status:** ⏳

---

## 📞 Video/Audio Meeting Testing

### Test Case 13: Join Video Call

**URL:** `http://localhost:3000/meeting/:roomId`

```
Steps:
1. Click "Join Video Call"
2. Browser asks for camera/mic permission
3. Grant permission
4. See preview of own video
5. Click "Join Room"
6. Enter meeting

Expected Result:
✅ Permission dialog appears
✅ Local video preview
✅ Mic/Camera toggle buttons
✅ "Join Room" enabled after permission
✅ Connects to room successfully
✅ Own video displayed (mirrored)

Permissions:
- Camera: Allow → Shows video
- Camera: Deny → Shows placeholder
- Mic: Allow → Audio works
- Mic: Deny → Muted by default
```

**Status:** ⏳

---

### Test Case 14: Multiple Participants

```
Steps:
1. User A joins room
2. User B joins same room
3. Both see each other
4. User C joins
5. Grid layout adjusts

Expected Result:
✅ User B's video appears for User A
✅ User A's video appears for User B
✅ Grid layout: 1→1, 2→2x1, 3→2x2, 4→2x2, 5-6→3x2
✅ Video quality adjusts automatically
✅ Name labels on each video
✅ Mute status indicator

Test Scenarios:
- 2 participants: Side by side
- 4 participants: 2x2 grid
- 9 participants: 3x3 grid
- 10+ participants: Pagination or scroll
```

**Status:** ⏳

---

### Test Case 15: Network Fluctuation

```
Steps:
1. Join video call with stable connection
2. Simulate slow 3G (Chrome DevTools → Network → Slow 3G)
3. Observe behavior
4. Restore normal connection

Expected Result:
✅ Warning: "Poor connection"
✅ Video quality reduces (720p → 480p → 360p)
✅ Audio continues (priority)
✅ Reconnect attempt automatic
✅ If disconnected → "Reconnecting..." message
✅ On reconnect → Video resumes

Thresholds:
- Good: > 2 Mbps
- Fair: 500 Kbps - 2 Mbps
- Poor: < 500 Kbps
```

**Status:** ⏳

---

## 🎮 Games Testing

### Test Case 16: Game Lobby

**URL:** `http://localhost:3000/games`

```
Steps:
1. Navigate to /games
2. See available games list
3. Click "Join" on a game
4. Enter waiting room
5. Wait for other players
6. Start game when ready

Expected Result:
✅ Games list loads
✅ Player count displayed (2/4)
✅ Join button enabled if space available
✅ Waiting room shows joined players
✅ Ready/Not Ready toggle
✅ Start game when all ready (host only)
✅ Countdown: 3, 2, 1, Start!

Test Cases:
- Room full: Join button disabled
- Leave room: Exit button works
- Host leaves: New host assigned
```

**Status:** ⏳

---

### Test Case 17: Real-time Score Update

```
Steps:
1. Start game
2. Player answers question
3. Score updates
4. Observe leaderboard

Expected Result:
✅ Score increments instantly
✅ Leaderboard re-sorts
✅ Animation on score change
✅ All players see same scores
✅ WebSocket syncing
✅ No lag > 500ms

Performance:
- Score update: < 100ms
- Leaderboard refresh: < 200ms
- Network delay tolerance: 500ms
```

**Status:** ⏳

---

## 👨‍💼 Admin Panel Testing

### Test Case 18: Super Admin Login

**URL:** `http://localhost:3001/super-admin`

```
Steps:
1. Open super admin panel
2. Enter credentials (from ADMIN_CREDENTIALS.md)
3. Click Login
4. Enter 2FA code (if enabled)
5. Access dashboard

Expected Result:
✅ Login form loads
✅ Credentials validated
✅ 2FA code sent to email/phone
✅ Code expires in 5 minutes
✅ Login successful → Dashboard
✅ Session timeout: 30 minutes

Test Credentials:
- Email: superadmin@socialchat.com
- Password: (check ADMIN_CREDENTIALS.md)
- 2FA: 123456 (mock)
```

**Status:** ⏳

---

### Test Case 19: User Management

```
Steps:
1. Go to Users section
2. Search for user
3. Select user
4. View profile
5. Suspend/Ban user
6. Verify action

Expected Result:
✅ Users list with pagination
✅ Search by name/email/phone
✅ Filter: Active/Banned/Suspended
✅ Sort by join date/activity
✅ User profile modal
✅ Suspend button → Confirmation modal
✅ Ban button → Reason required
✅ Unban button for banned users
✅ Action logged in activity log

Test Actions:
- Suspend user for 7 days
- Permanent ban with reason
- Unban user
- Delete user account (soft delete)
```

**Status:** ⏳

---

## 🌐 Network Testing

### Test Case 20: Offline Mode

```
Steps:
1. Open app in browser
2. Open DevTools → Network tab
3. Select "Offline"
4. Try to interact with app

Expected Result:
✅ "No internet connection" message
✅ Cached data still visible
✅ Retry button appears
✅ On reconnect → Auto sync
✅ Failed API calls queued

Test Scenarios:
- View posts offline: Show cached posts
- Like post offline: Queue action
- Send message offline: Queue message
- Upload file offline: Show warning
```

**Status:** ⏳

---

### Test Case 21: Slow 3G Performance

```
Steps:
1. Open DevTools → Network
2. Select "Slow 3G"
3. Navigate through app
4. Observe loading times

Expected Result:
✅ Loading skeletons visible
✅ Images load progressively (blur → sharp)
✅ Text content prioritized
✅ Critical API calls first
✅ Non-critical deferred
✅ Timeout handling (30s max)

Performance Targets:
- Time to Interactive: < 10s
- Critical path: < 5s
- Images: Lazy load
- Videos: Don't auto-play
```

**Status:** ⏳

---

## 🎨 Theme Testing

### Test Case 22: Dark Mode

```
Steps:
1. Open Settings
2. Toggle Dark Mode
3. Navigate through all pages
4. Check contrast

Expected Result:
✅ All pages switch to dark theme
✅ Text readable (WCAG AA: contrast ratio > 4.5:1)
✅ Images not too bright
✅ Borders visible
✅ Buttons distinguishable
✅ Preference saved to localStorage

Pages to Check:
- Home
- Posts
- Messenger
- Profile
- Wallet
- Settings
- Games
- Admin Panel
```

**Status:** ⏳

---

## 🌍 Language Testing

### Test Case 23: Language Switching

```
Steps:
1. Open Settings → Language
2. Select "বাংলা"
3. Observe text changes
4. Navigate to different pages
5. Switch to English

Expected Result:
✅ All text updates immediately
✅ No page reload required
✅ All pages affected
✅ Number formatting: 1,234 vs ১,২৩৪
✅ Date formatting: DD/MM/YYYY vs ২৬/১১/২০২৫
✅ Currency: ৳500 vs ৳৫০০
✅ Preference saved

Test Languages:
- English (en)
- বাংলা (bn)
- हिंदी (hi) - if implemented

Translation Coverage:
- Buttons: 100%
- Labels: 100%
- Error messages: 100%
- Notifications: 100%
```

**Status:** ⏳

---

## 📊 Performance Benchmarks

### Target Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Contentful Paint | < 1.5s | ___ | ⏳ |
| Time to Interactive | < 3s | ___ | ⏳ |
| Largest Contentful Paint | < 2.5s | ___ | ⏳ |
| Cumulative Layout Shift | < 0.1 | ___ | ⏳ |
| Total Blocking Time | < 300ms | ___ | ⏳ |
| Bundle Size | < 500 KB | ___ | ⏳ |
| API Response Time | < 500ms | ___ | ⏳ |
| WebSocket Latency | < 100ms | ___ | ⏳ |

### Tools to Use

```bash
# Lighthouse Test
npm install -g lighthouse
lighthouse https://your-app.vercel.app --view

# Bundle Analyzer
npm install --save-dev webpack-bundle-analyzer
npm run analyze

# Load Testing
npm install -g artillery
artillery quick --count 100 --num 50 https://your-backend.com/api/posts
```

---

## ✅ Testing Sign-off

### Checklist

- [ ] ⏳ All authentication flows tested
- [ ] ⏳ All pages load correctly
- [ ] ⏳ All API endpoints working
- [ ] ⏳ Real-time features functional
- [ ] ⏳ Payment flows tested
- [ ] ⏳ Admin panel accessible
- [ ] ⏳ Mobile responsive
- [ ] ⏳ Dark mode tested
- [ ] ⏳ Language switching works
- [ ] ⏳ Performance targets met
- [ ] ⏳ Security measures verified
- [ ] ⏳ Error handling implemented
- [ ] ⏳ Loading states present
- [ ] ⏳ No console errors
- [ ] ⏳ Cross-browser compatible

### Sign-off

```
Tested By: _______________
Date: _______________
Status: PASS / FAIL
Notes: _______________
```

---

**🎉 Testing Complete? Ready for Production! 🚀**
