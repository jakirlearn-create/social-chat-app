#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PostsPage.js এ language support add করার script
"""

import re

# PostsPage.js file path
file_path = 'frontend/src/pages/PostsPage.js'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replacements dictionary
replacements = {
    # Import section
    "import './PostsPage.css';": "import { useLanguage } from '../context/LanguageContext';\nimport './PostsPage.css';",
    
    # Hook addition
    "const { theme } = useTheme();": "const { theme } = useTheme();\n  const { t } = useLanguage();",
    
    # Loading text
    'Loading posts...': "{t('common.loading')}",
    
    # Header section - need to be careful with exact matches
    '← Back': "← {t('common.back')}",
    '<h1>Posts</h1>': "<h1>{t('posts.title')}</h1>",
    
    # Menu items
    '📌 Report': "📌 {t('posts.report')}",
    '👁️ Hide': "👁️ {t('posts.hide')}",
    '🚫 Block User': "🚫 {t('posts.block')}",
    '🔗 Copy Link': "🔗 {t('posts.copyLink')}",
    '🔕 Mute Notifications': "🔕 {t('posts.muteNotifications')}",
    
    # Comments modal
    '<h2>Comments</h2>': "<h2>{t('posts.comment')}</h2>",
    'No comments yet. Be the first!': "{t('posts.noComments')}",
    'placeholder="Write a comment..."': "placeholder={t('posts.writeComment')}",
    '<button className="send-comment-btn">Send</button>': '<button className="send-comment-btn">{t("posts.sendComment")}</button>',
}

# Apply replacements
for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print(f"✓ Replaced: {old[:50]}...")
    else:
        print(f"✗ Not found: {old[:50]}...")

# Write updated content
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✓ PostsPage.js updated with language support!")
