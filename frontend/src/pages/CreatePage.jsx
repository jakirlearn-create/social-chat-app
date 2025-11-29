import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import PrivacySelector from '../components/PrivacySelector';
import FloatingCreateButton from '../components/FloatingCreateButton';
import './CreatePage.css';

const CreatePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [animateCards, setAnimateCards] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Stagger animation on mount
  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  // Create tools configuration with image paths
  const createTools = [
    {
      id: 'video_post',
      title: t('create.videoPost'),
      description: t('create.videoPostDesc'),
      icon: '/assets/icons/video_post.png',
      features: ['Trim', 'Music', 'Effects', 'Captions', 'Filters'],
      privacy: true,
      action: () => handleToolClick('video_post')
    },
    {
      id: 'photo_post',
      title: t('create.photoPost'),
      description: t('create.photoPostDesc'),
      icon: '/assets/icons/photo_post.png',
      features: ['Filters', 'Stickers', 'Text', 'Collage', 'Effects'],
      privacy: true,
      action: () => handleToolClick('photo_post')
    },
    {
      id: 'audio_post',
      title: t('create.audioPost'),
      description: t('create.audioPostDesc'),
      icon: '/assets/icons/audio_post.png',
      features: ['Record', 'Background Music', 'Effects', 'Waveform'],
      privacy: true,
      action: () => handleToolClick('audio_post')
    },
    {
      id: 'video_live',
      title: t('create.videoLive'),
      description: t('create.videoLiveDesc'),
      icon: '/assets/icons/video_live.png',
      features: ['Camera', 'Beauty', 'Filters', 'Guests', 'PK Battle', 'Gifts'],
      privacy: false,
      action: () => handleLiveTool('video_live')
    },
    {
      id: 'audio_live',
      title: t('create.audioLive'),
      description: t('create.audioLiveDesc'),
      icon: '/assets/icons/audio_live.png',
      features: ['Multi-host', 'Invite Speakers', 'Raise Hand', 'Gifts', 'Admin'],
      privacy: false,
      action: () => handleLiveTool('audio_live')
    },
    {
      id: 'game_live',
      title: t('create.gameLive'),
      description: t('create.gameLiveDesc'),
      icon: '/assets/icons/game_live.png',
      features: ['Screen Capture', 'Facecam', 'Mic', 'FPS Counter', 'Chat'],
      privacy: false,
      action: () => handleLiveTool('game_live')
    },
    {
      id: 'create_frame',
      title: t('create.createFrame'),
      description: t('create.createFrameDesc'),
      icon: '/assets/icons/create_frame.png',
      features: ['Templates', 'Colors', 'Patterns', 'Text', 'Stickers'],
      privacy: true,
      action: () => handleToolClick('create_frame')
    },
    {
      id: 'upload_file',
      title: t('create.uploadFile'),
      description: t('create.uploadFileDesc'),
      icon: '/assets/icons/upload_file.png',
      features: ['All Formats', 'Cloud Storage', 'Preview', 'Share Link'],
      privacy: true,
      action: () => handleToolClick('upload_file')
    }
  ];

  // Handle tool click with privacy check
  const handleToolClick = (toolId) => {
    const tool = createTools.find(t => t.id === toolId);
    if (tool.privacy) {
      setSelectedTool(toolId);
      setShowPrivacy(true);
    } else {
      // Direct launch for live/game tools
      console.log(`Launching ${toolId}...`);
      // Navigate to respective tool page
    }
  };

  // Handle live tool (no privacy needed, instant launch)
  const handleLiveTool = (toolId) => {
    console.log(`Starting ${toolId}...`);
    // Navigate to live/game interface
  };

  // Handle privacy selection
  const handlePrivacySelect = (privacyOption) => {
    console.log(`Creating ${selectedTool} with privacy: ${privacyOption}`);
    setShowPrivacy(false);
    setSelectedTool(null);
    // Proceed to creation flow
  };

  // Icon fallback with gradient placeholder
  const renderIcon = (iconPath, title) => {
    return (
      <div className="tool-icon-wrapper">
        <img
          src={iconPath}
          alt={title}
          className="tool-icon"
          onError={(e) => {
            // Fallback to gradient placeholder
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="tool-icon-fallback" style={{ display: 'none' }}>
          {title.charAt(0)}
        </div>
      </div>
    );
  };

  return (
    <div className={`create-page ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      {/* Back Button */}
      <button
        className="create-back-btn"
        onClick={() => navigate(-1)}
      >
        ← {t('common.back')}
        ← Back
      </button>

      {/* Header */}
      <div className="create-header">
        <h1 className="create-title">Create</h1>
        <button
          className="settings-icon-btn"
          onClick={() => navigate('/settings')}
        >
          <img
            src="/assets/icons/settings.png"
            alt="Settings"
            onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'}
          />
        </button>
      </div>      {/* Tools Grid */}
      <div className={`create-tools-grid ${animateCards ? 'animate' : ''}`}>
        {createTools.map((tool, index) => (
          <div
            key={tool.id}
            className="create-tool-card"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={tool.action}
          >
            {renderIcon(tool.icon, tool.title)}
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-description">{tool.description}</p>
            <div className="tool-features">
              {tool.features.slice(0, 3).map((feature, i) => (
                <span key={i} className="feature-tag">{feature}</span>
              ))}
              {tool.features.length > 3 && (
                <span className="feature-tag">+{tool.features.length - 3}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Quick Create Button */}
      <FloatingCreateButton />

      {/* Privacy Selector Modal */}
      {showPrivacy && (
        <PrivacySelector
          isOpen={showPrivacy}
          onClose={() => setShowPrivacy(false)}
          onSelect={handlePrivacySelect}
        />
      )}
    </div>
  );
};

export default CreatePage;
