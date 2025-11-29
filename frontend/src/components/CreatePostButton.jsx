import React, { useState } from 'react';
import './CreatePostButton.css';

const CreatePostButton = ({ userId, onPostCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [privacy, setPrivacy] = useState('public');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    if (!uploading) {
      setShowModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setContent('');
    setSelectedFiles([]);
    setPrivacy('public');
    setUploadProgress(0);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      const isUnder100MB = file.size <= 100 * 1024 * 1024;
      
      return (isImage || isVideo || isAudio) && isUnder100MB;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getPostType = () => {
    if (selectedFiles.length === 0) return 'text';
    const firstFile = selectedFiles[0];
    if (firstFile.type.startsWith('image/')) return 'image';
    if (firstFile.type.startsWith('video/')) return 'video';
    if (firstFile.type.startsWith('audio/')) return 'audio';
    return 'text';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && selectedFiles.length === 0) return;
    if (uploading) return;

    try {
      setUploading(true);
      const postService = (await import('../services/postService')).default;

      // Upload media files
      let mediaUrls = [];
      if (selectedFiles.length > 0) {
        setUploadProgress(10);
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const mediaData = await postService.uploadMedia(file);
          mediaUrls.push(mediaData);
          
          // Update progress
          setUploadProgress(10 + ((i + 1) / selectedFiles.length) * 70);
        }
      }

      setUploadProgress(85);

      // Create post
      const postData = {
        content: content.trim(),
        type: getPostType(),
        privacy: privacy,
        media: mediaUrls
      };

      const newPost = await postService.createPost(postData);
      setUploadProgress(100);

      // Notify parent
      if (onPostCreated) {
        onPostCreated(newPost);
      }

      // Close modal and reset
      setTimeout(() => {
        closeModal();
      }, 500);

    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getPrivacyIcon = (privacyType) => {
    switch (privacyType) {
      case 'public': return '🌍';
      case 'friends': return '👥';
      case 'private': return '🔒';
      default: return '🌍';
    }
  };

  return (
    <>
      {/* Create Post Button */}
      <div className="create-post-button" onClick={openModal}>
        <img 
          src={`https://ui-avatars.com/api/?name=You`}
          alt="Your avatar"
          className="create-post-avatar"
        />
        <div className="create-post-placeholder">
          What's on your mind?
        </div>
        <button className="create-post-icon">📝</button>
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Post</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Privacy Selector */}
                <div className="privacy-selector">
                  <label>Privacy: </label>
                  <select 
                    value={privacy} 
                    onChange={(e) => setPrivacy(e.target.value)}
                    disabled={uploading}
                  >
                    <option value="public">{getPrivacyIcon('public')} Public</option>
                    <option value="friends">{getPrivacyIcon('friends')} Friends</option>
                    <option value="private">{getPrivacyIcon('private')} Only Me</option>
                  </select>
                </div>

                {/* Text Input */}
                <textarea
                  className="post-textarea"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={10000}
                  disabled={uploading}
                  rows={5}
                />

                {/* File Preview */}
                {selectedFiles.length > 0 && (
                  <div className="file-preview">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="preview-item">
                        {file.type.startsWith('image/') && (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${index + 1}`}
                          />
                        )}
                        {file.type.startsWith('video/') && (
                          <video src={URL.createObjectURL(file)} />
                        )}
                        {file.type.startsWith('audio/') && (
                          <div className="audio-preview">
                            <span>🎵</span>
                            <span>{file.name}</span>
                          </div>
                        )}
                        <button 
                          type="button"
                          className="remove-file"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{uploadProgress}%</div>
                  </div>
                )}

                {/* Media Options */}
                <div className="media-options">
                  <label className="media-option">
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      multiple
                      onChange={handleFileSelect}
                      disabled={uploading || selectedFiles.length >= 10}
                      style={{ display: 'none' }}
                    />
                    <span className="option-icon">📷</span>
                    <span>Photo/Video</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button 
                  type="submit" 
                  className="btn-post"
                  disabled={uploading || (!content.trim() && selectedFiles.length === 0)}
                >
                  {uploading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostButton;
