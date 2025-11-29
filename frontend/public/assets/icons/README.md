# 🎨 Icons Folder

## তোমার icon files এখানে রাখো

### 📁 Folder Structure:
```
frontend/public/assets/icons/
├── like.png
├── like-active.png
├── comment.png
├── share.png
├── save.png
└── ... (all other icon files)
```

---

## 🚀 How to Add Icons:

### Step 1: তোমার icon files প্রস্তুত করো
- **Format:** PNG (preferred), SVG, JPG also supported
- **Size:** 24x24px or 48x48px recommended
- **Background:** Transparent (PNG)
- **Color:** 
  - Default: #65676b (gray)
  - Active: #667eea (purple/blue)

### Step 2: Files এই folder এ copy করো
সব icon files এই folder (`frontend/public/assets/icons/`) এ paste করো

### Step 3: Auto-update script চালাও
```bash
cd C:\Users\User\social_chat_app
node scripts/update-icons.js
```

Script automatically:
- ✅ Detect করবে সব icon files
- ✅ Update করবে Icon.jsx component
- ✅ Ready করবে use করার জন্য

---

## 📋 Required Icon Files:

**ICON_LIST.md দেখো সব icon এর complete list এর জন্য**

Location: `C:\Users\User\social_chat_app\ICON_LIST.md`

---

## 💡 Usage Example:

```jsx
import Icon from './components/Icon';

// Simple usage
<Icon name="like" size={24} />

// With click handler
<Icon 
  name="comment" 
  size={20} 
  onClick={handleCommentClick}
  className="clickable"
/>

// Active state
<Icon name="like-active" size={24} />
```

---

## 🔄 Auto-Fallback System:

যদি কোনো icon file না পাওয়া যায়, automatically emoji fallback দেখাবে।

Example:
- `like.png` না থাকলে → 👍 দেখাবে
- `comment.png` না থাকলে → 💬 দেখাবে

---

## ✅ Current Status:

- **Icons Found:** 0 (Waiting for your files)
- **Fallback Mode:** ✅ Active (Using emojis)
- **Auto-Detection:** ✅ Ready

---

**👉 তোমার icon files এই folder এ add করো এবং `node scripts/update-icons.js` run করো!**
