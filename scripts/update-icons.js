/**
 * Icon Auto-Detection Script
 * 
 * This script scans the frontend/public/assets/icons/ folder
 * and automatically updates the Icon.jsx component with available icons.
 * 
 * Usage:
 * 1. Place your icon files in: frontend/public/assets/icons/
 * 2. Run: node scripts/update-icons.js
 * 3. Icon component will be updated automatically
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../frontend/public/assets/icons');
const ICON_COMPONENT_PATH = path.join(__dirname, '../frontend/src/components/Icon.jsx');

// Emoji fallbacks mapping
const EMOJI_FALLBACKS = {
  like: '👍', 'like-active': '👍',
  comment: '💬', share: '🔄', save: '🔖', 'save-active': '🔖',
  'reaction-like': '👍', 'reaction-love': '❤️', 'reaction-haha': '😂',
  'reaction-wow': '😮', 'reaction-sad': '😢', 'reaction-angry': '😡',
  'privacy-public': '🌍', 'privacy-friends': '👥', 'privacy-private': '🔒', 'privacy-custom': '⚙️',
  edit: '✏️', delete: '🗑️', report: '🚩', 'menu-dots': '⋮',
  'media-photo': '📷', 'media-video': '🎥', 'media-audio': '🎵', 'media-live': '🔴',
  'play-button': '▶️', 'pause-button': '⏸️',
  'send-message': '➤', 'attach-file': '📎', 'emoji-picker': '😊', 'voice-record': '🎤', camera: '📸',
  online: '🟢', offline: '⚫', typing: '⌨️', seen: '✓✓', sent: '✓',
  'voice-call': '📞', 'video-call': '📹', 'call-end': '❌',
  'mic-on': '🎤', 'mic-off': '🔇', 'camera-on': '📹', 'camera-off': '📵', 'screen-share': '🖥️',
  home: '🏠', profile: '👤', messenger: '💬', notifications: '🔔', search: '🔍', menu: '☰',
  add: '➕', close: '✕', back: '←', forward: '→', refresh: '🔄', settings: '⚙️', filter: '🔽',
  check: '✓', warning: '⚠️', error: '❌', info: 'ℹ️', 'loading-spinner': '⏳',
  follow: '➕', following: '✓', unfollow: '➖', block: '🚫', 'message-user': '💬',
  followers: '👥', 'posts-count': '📝', photos: '🖼️', videos: '🎬',
  'user-icon': '👤', 'email-icon': '✉️', 'password-icon': '🔒',
  'eye-open': '👁️', 'eye-closed': '👁️‍🗨️', login: '🔑', logout: '🚪',
  upload: '⬆️', download: '⬇️', 'remove-file': '✕',
  reply: '↩️', 'comment-like': '❤️', 'show-replies': '⬇️', 'hide-replies': '⬆️',
  'live-badge': '🔴', 'viewer-icon': '👁️', 'go-live': '📡', 'join-live': '▶️', 'leave-live': '🚪',
  calendar: '📅', location: '📍', link: '🔗', copy: '📋', flag: '🚩', crown: '👑', verified: '✓',
};

function scanIconsFolder() {
  console.log('🔍 Scanning icons folder...');
  
  // Create icons directory if it doesn't exist
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
    console.log('✅ Created icons directory:', ICONS_DIR);
    return {};
  }

  const iconMap = {};
  const files = fs.readdirSync(ICONS_DIR);

  files.forEach(file => {
    const ext = path.extname(file);
    if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext.toLowerCase())) {
      const iconName = path.basename(file, ext);
      iconMap[iconName] = `/assets/icons/${file}`;
      console.log(`  ✓ Found: ${iconName} -> ${file}`);
    }
  });

  console.log(`\n📊 Total icons found: ${Object.keys(iconMap).length}`);
  return iconMap;
}

function generateIconMapCode(iconMap) {
  const entries = Object.entries(iconMap)
    .map(([name, path]) => `  '${name}': '${path}',`)
    .join('\n');

  return `const iconMap = {\n${entries}\n};`;
}

function generateEmojiFallbacksCode() {
  const entries = Object.entries(EMOJI_FALLBACKS)
    .map(([name, emoji]) => `  '${name}': '${emoji}',`)
    .join('\n');

  return `const emojiFallbacks = {\n${entries}\n};`;
}

function updateIconComponent(iconMap) {
  console.log('\n📝 Updating Icon.jsx component...');

  if (!fs.existsSync(ICON_COMPONENT_PATH)) {
    console.error('❌ Icon.jsx not found at:', ICON_COMPONENT_PATH);
    return false;
  }

  let content = fs.readFileSync(ICON_COMPONENT_PATH, 'utf8');

  // Replace iconMap
  const iconMapRegex = /const iconMap = \{[\s\S]*?\};/;
  const newIconMapCode = generateIconMapCode(iconMap);
  
  if (iconMapRegex.test(content)) {
    content = content.replace(iconMapRegex, newIconMapCode);
    console.log('  ✓ Updated iconMap');
  } else {
    console.log('  ⚠️ Could not find iconMap in Icon.jsx');
  }

  // Replace emojiFallbacks
  const emojiRegex = /const emojiFallbacks = \{[\s\S]*?\};/;
  const newEmojiCode = generateEmojiFallbacksCode();
  
  if (emojiRegex.test(content)) {
    content = content.replace(emojiRegex, newEmojiCode);
    console.log('  ✓ Updated emojiFallbacks');
  }

  // Write updated content
  fs.writeFileSync(ICON_COMPONENT_PATH, content, 'utf8');
  console.log('✅ Icon.jsx updated successfully!');
  return true;
}

function main() {
  console.log('\n🎨 Icon Auto-Detection Script\n');
  console.log('━'.repeat(50));
  
  const iconMap = scanIconsFolder();
  
  if (Object.keys(iconMap).length === 0) {
    console.log('\n⚠️  No icons found!');
    console.log('📁 Place your icon files in:', ICONS_DIR);
    console.log('   Supported formats: .png, .jpg, .jpeg, .svg, .gif');
    return;
  }

  const success = updateIconComponent(iconMap);
  
  console.log('\n━'.repeat(50));
  if (success) {
    console.log('✅ Done! Icon component is ready to use.');
    console.log('\n💡 Usage in components:');
    console.log('   import Icon from "./Icon";');
    console.log('   <Icon name="like" size={24} />');
  } else {
    console.log('❌ Update failed. Please check the errors above.');
  }
}

// Run the script
main();
