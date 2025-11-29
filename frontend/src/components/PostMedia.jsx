import React, { useState } from 'react';
import './PostMedia.css';

const PostMedia = ({ media, type }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % media.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // Image Gallery
  if (type === 'image') {
    const imageCount = media.length;
    const gridClass = imageCount === 1 ? 'grid-single' 
                    : imageCount === 2 ? 'grid-double'
                    : imageCount === 3 ? 'grid-triple'
                    : 'grid-quad';

    return (
      <>
        <div className={`media-gallery ${gridClass}`}>
          {media.slice(0, 4).map((item, index) => (
            <div 
              key={index} 
              className="gallery-item"
              onClick={() => openLightbox(index)}
            >
              <img 
                src={item.thumb || item.url} 
                alt={`Image ${index + 1}`}
                loading="lazy"
              />
              {index === 3 && imageCount > 4 && (
                <div className="more-overlay">
                  <span>+{imageCount - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="lightbox" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            
            {media.length > 1 && (
              <>
                <button className="lightbox-prev" onClick={prevImage}>‹</button>
                <button className="lightbox-next" onClick={nextImage}>›</button>
              </>
            )}

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img 
                src={media[lightboxIndex].url} 
                alt={`Image ${lightboxIndex + 1}`}
              />
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {media.length}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Video Player
  if (type === 'video') {
    const video = media[0];
    return (
      <div className="media-video">
        <video 
          controls 
          poster={video.thumb}
          preload="metadata"
        >
          <source src={video.url} type={video.mimeType || 'video/mp4'} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Audio Player
  if (type === 'audio') {
    const audio = media[0];
    return (
      <div className="media-audio">
        <div className="audio-icon">🎵</div>
        <audio controls preload="metadata">
          <source src={audio.url} type={audio.mimeType || 'audio/mpeg'} />
          Your browser does not support the audio element.
        </audio>
        {audio.duration && (
          <div className="audio-duration">
            {Math.floor(audio.duration / 60)}:{String(Math.floor(audio.duration % 60)).padStart(2, '0')}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PostMedia;
