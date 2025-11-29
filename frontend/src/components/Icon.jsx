// Icon component for dynamically loading icons
import React from 'react';
import './Icon.css';

// Icon mapping - maps icon names to file paths
const iconMap = {
  // Post Actions
  like: '/assets/icons/like.png',
  'like-active': '/assets/icons/like-active.png',
  comment: '/assets/icons/comment.png',
  share: '/assets/icons/share.png',
  save: '/assets/icons/save.png',
  'save-active': '/assets/icons/save-active.png',

  // Reactions
  'reaction-like': '/assets/icons/reaction-like.png',
  'reaction-love': '/assets/icons/reaction-love.png',
  'reaction-haha': '/assets/icons/reaction-haha.png',
  'reaction-wow': '/assets/icons/reaction-wow.png',
  'reaction-sad': '/assets/icons/reaction-sad.png',
  'reaction-angry': '/assets/icons/reaction-angry.png',

  // Privacy
  'privacy-public': '/assets/icons/privacy-public.png',
  'privacy-friends': '/assets/icons/privacy-friends.png',
  'privacy-private': '/assets/icons/privacy-private.png',
  'privacy-custom': '/assets/icons/privacy-custom.png',

  // Post Menu
  edit: '/assets/icons/edit.png',
  delete: '/assets/icons/delete.png',
  report: '/assets/icons/report.png',
  'menu-dots': '/assets/icons/menu-dots.png',

  // Media
  'media-photo': '/assets/icons/media-photo.png',
  'media-video': '/assets/icons/media-video.png',
  'media-audio': '/assets/icons/media-audio.png',
  'media-live': '/assets/icons/media-live.png',
  'play-button': '/assets/icons/play-button.png',
  'pause-button': '/assets/icons/pause-button.png',

  // Messenger
  'send-message': '/assets/icons/send-message.png',
  'attach-file': '/assets/icons/attach-file.png',
  'emoji-picker': '/assets/icons/emoji-picker.png',
  'voice-record': '/assets/icons/voice-record.png',
  camera: '/assets/icons/camera.png',

  // Chat Status
  online: '/assets/icons/online.png',
  offline: '/assets/icons/offline.png',
  typing: '/assets/icons/typing.png',
  seen: '/assets/icons/seen.png',
  sent: '/assets/icons/sent.png',

  // Calls
  'voice-call': '/assets/icons/voice-call.png',
  'video-call': '/assets/icons/video-call.png',
  'call-end': '/assets/icons/call-end.png',
  'mic-on': '/assets/icons/mic-on.png',
  'mic-off': '/assets/icons/mic-off.png',
  'camera-on': '/assets/icons/camera-on.png',
  'camera-off': '/assets/icons/camera-off.png',
  'screen-share': '/assets/icons/screen-share.png',

  // Navigation
  home: '/assets/icons/home.png',
  profile: '/assets/icons/profile.png',
  messenger: '/assets/icons/messenger.png',
  notifications: '/assets/icons/notifications.png',
  'notification-badge': '/assets/icons/notification-badge.png',
  search: '/assets/icons/search.png',
  menu: '/assets/icons/menu.png',

  // Actions
  add: '/assets/icons/add.png',
  close: '/assets/icons/close.png',
  back: '/assets/icons/back.png',
  forward: '/assets/icons/forward.png',
  refresh: '/assets/icons/refresh.png',
  settings: '/assets/icons/settings.png',
  filter: '/assets/icons/filter.png',

  // Status
  check: '/assets/icons/check.png',
  warning: '/assets/icons/warning.png',
  error: '/assets/icons/error.png',
  info: '/assets/icons/info.png',
  'loading-spinner': '/assets/icons/loading-spinner.png',

  // Profile
  follow: '/assets/icons/follow.png',
  following: '/assets/icons/following.png',
  unfollow: '/assets/icons/unfollow.png',
  block: '/assets/icons/block.png',
  'message-user': '/assets/icons/message-user.png',
  followers: '/assets/icons/followers.png',
  'posts-count': '/assets/icons/posts-count.png',
  photos: '/assets/icons/photos.png',
  videos: '/assets/icons/videos.png',

  // Forms
  'user-icon': '/assets/icons/user-icon.png',
  'email-icon': '/assets/icons/email-icon.png',
  'password-icon': '/assets/icons/password-icon.png',
  'eye-open': '/assets/icons/eye-open.png',
  'eye-closed': '/assets/icons/eye-closed.png',
  login: '/assets/icons/login.png',
  logout: '/assets/icons/logout.png',

  // Upload
  upload: '/assets/icons/upload.png',
  download: '/assets/icons/download.png',
  'remove-file': '/assets/icons/remove-file.png',

  // Comments
  reply: '/assets/icons/reply.png',
  'comment-like': '/assets/icons/comment-like.png',
  'show-replies': '/assets/icons/show-replies.png',
  'hide-replies': '/assets/icons/hide-replies.png',

  // Live
  'live-badge': '/assets/icons/live-badge.png',
  'viewer-icon': '/assets/icons/viewer-icon.png',
  'go-live': '/assets/icons/go-live.png',
  'join-live': '/assets/icons/join-live.png',
  'leave-live': '/assets/icons/leave-live.png',

  // Misc
  calendar: '/assets/icons/calendar.png',
  location: '/assets/icons/location.png',
  link: '/assets/icons/link.png',
  copy: '/assets/icons/copy.png',
  flag: '/assets/icons/flag.png',
  crown: '/assets/icons/crown.png',
  verified: '/assets/icons/verified.png',
};

// Emoji fallbacks if icon file not found
const emojiFallbacks = {
  like: '👍',
  comment: '💬',
  share: '🔄',
  save: '🔖',
  'reaction-like': '👍',
  'reaction-love': '❤️',
  'reaction-haha': '😂',
  'reaction-wow': '😮',
  'reaction-sad': '😢',
  'reaction-angry': '😡',
  'privacy-public': '🌍',
  'privacy-friends': '👥',
  'privacy-private': '🔒',
  'privacy-custom': '⚙️',
  edit: '✏️',
  delete: '🗑️',
  report: '🚩',
  'menu-dots': '⋮',
  'media-photo': '📷',
  'media-video': '🎥',
  'media-audio': '🎵',
  'media-live': '🔴',
  'play-button': '▶️',
  'send-message': '➤',
  'attach-file': '📎',
  'emoji-picker': '😊',
  online: '🟢',
  add: '➕',
  close: '✕',
  back: '←',
  check: '✓',
  warning: '⚠️',
  error: '❌',
  reply: '↩️',
  'live-badge': '🔴',
  'viewer-icon': '👁️',
};

const Icon = ({ 
  name, 
  size = 20, 
  className = '', 
  alt = '',
  onClick,
  style = {}
}) => {
  const iconPath = iconMap[name];
  const fallbackEmoji = emojiFallbacks[name] || '●';

  // If icon file exists, use it; otherwise use emoji
  const [useImage, setUseImage] = React.useState(true);

  const handleError = () => {
    setUseImage(false); // Switch to emoji fallback on error
  };

  if (useImage && iconPath) {
    return (
      <img
        src={iconPath}
        alt={alt || name}
        className={`icon ${className}`}
        style={{ width: size, height: size, ...style }}
        onClick={onClick}
        onError={handleError}
      />
    );
  }

  // Fallback to emoji
  return (
    <span
      className={`icon icon-emoji ${className}`}
      style={{ fontSize: size, lineHeight: 1, ...style }}
      onClick={onClick}
      role="img"
      aria-label={alt || name}
    >
      {fallbackEmoji}
    </span>
  );
};

export default Icon;
