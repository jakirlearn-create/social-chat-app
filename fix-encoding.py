#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix encoding issues and apply language keys to PostsPage.js"""

import re

# Read the file with UTF-8 encoding
with open('frontend/src/pages/PostsPage.js', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Fix corrupted emojis and special characters
replacements = [
    # Fix corrupted characters
    ('â†ï¸', '←'),
    ('ðŸš«', '🚫'),
    ('ðŸ'¬', '💬'),
    ('ðŸ"—', '🔗'),
    ('ðŸ"•', '🔕'),
    ('ðŸ"–', '🔖'),
    ('ðŸ"'', '🔗'),
    ('â†—ï¸', '↗️'),
    ('ðŸ'', '👍'),
    ('ðŸ'Ž', '👎'),
    ('âœ•', '✕'),
    ('â€™', "'"),
    
    # Apply language keys for header
    ('← Hide', '← {t(\'common.back\')}'),
    ('<h1>Posts</h1>', '<h1>{t(\'posts.title\')}</h1>'),
    
    # Apply language keys for menu
    ('🚫 Block User', '🚫 {t(\'posts.block\')}'),
    ('🔗 Copy Link', '🔗 {t(\'posts.copyLink\')}'),
    ('🔕 Mute Notifications', '🔕 {t(\'posts.mute\')}'),
    ('⚠️ Report', '⚠️ {t(\'posts.report\')}'),
    ('🙈 Hide', '🙈 {t(\'posts.hide\')}'),
    
    # Apply language keys for comments modal
    ('<h2>Comments</h2>', '<h2>{t(\'posts.comments\')}</h2>'),
    ('placeholder="Write a comment..."', 'placeholder={t(\'posts.writeComment\')}'),
    ('<p className="no-comments">No comments yet. Be the first!</p>', 
     '<p className="no-comments">{t(\'posts.noComments\')}</p>'),
    ('<button className="send-comment-btn">Send</button>', 
     '<button className="send-comment-btn">{t(\'common.send\')}</button>'),
]

# Apply replacements
for old, new in replacements:
    content = content.replace(old, new)

# Write back with UTF-8 encoding
with open('frontend/src/pages/PostsPage.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Encoding fixed and language keys applied to PostsPage.js")
