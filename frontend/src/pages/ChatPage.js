import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatPage.css';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config/api';

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Mock partner data
  const partner = {
    name: id ? `User ${id}` : 'Chat Partner',
    profilePic: '',
    id: id || '001'
  };

  useEffect(() => {
    loadConversation();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Load conversation error:', err);
      // Set mock messages for demo
      setMessages([
        { id: '1', senderId: 'other', type: 'text', content: 'Hello! How are you?', timestamp: new Date().toISOString(), status: 'read' },
        { id: '2', senderId: 'me', type: 'text', content: 'I am good, thanks!', timestamp: new Date().toISOString(), status: 'read' }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    
    setSending(true);
    const tempId = `temp_${Date.now()}`;
    const newMessage = {
      id: tempId,
      senderId: 'me',
      type: 'text',
      content: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setText('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: 'me',
          recipientId: id,
          conversationId: id,
          type: 'text',
          content: newMessage.content,
          timestamp: newMessage.timestamp
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, id: data.messageId, status: 'sent' } : msg
        ));
      } else {
        throw new Error('Send failed');
      }
    } catch (err) {
      console.error('Send error:', err);
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      ));
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const retryMessage = (msgId) => {
    const msg = messages.find(m => m.id === msgId);
    if (msg) {
      setText(msg.content);
      setMessages(prev => prev.filter(m => m.id !== msgId));
    }
  };

  const handleLocationShare = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }

    toast.loading('Getting location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        toast.dismiss();
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        const tempId = `temp_${Date.now()}`;
        const locationMsg = {
          id: tempId,
          senderId: 'me',
          type: 'location',
          content: ` Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          metadata: { latitude, longitude, mapsUrl },
          timestamp: new Date().toISOString(),
          status: 'sending'
        };
        
        setMessages(prev => [...prev, locationMsg]);
        
        try {
          const res = await fetch(`${API_BASE_URL}/messages/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: 'me',
              recipientId: id,
              conversationId: id,
              type: 'location',
              content: locationMsg.content,
              metadata: locationMsg.metadata,
              timestamp: locationMsg.timestamp
            })
          });
          
          if (res.ok) {
            const data = await res.json();
            setMessages(prev => prev.map(msg => 
              msg.id === tempId ? { ...msg, id: data.messageId, status: 'sent' } : msg
            ));
            toast.success('Location shared!');
          }
        } catch (err) {
          console.error(err);
          setMessages(prev => prev.map(msg => 
            msg.id === tempId ? { ...msg, status: 'failed' } : msg
          ));
          toast.error('Failed to share location');
        }
      },
      (error) => {
        toast.dismiss();
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location permission denied. Please enable it in your browser settings.');
        } else {
          toast.error('Failed to get location');
        }
      }
    );
  };

  const handlePlayGame = () => {
    toast('🎮 Opening game selection...', { duration: 2000 });
    window.open('/games', '_blank');
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxSize = 100 * 1024 * 1024; // 100MB
    const oversized = files.filter(f => f.size > maxSize);
    if (oversized.length) {
      toast.error(`Some files exceed 100MB limit: ${oversized.map(f => f.name).join(', ')}`);
      return;
    }

    for (const file of files) {
      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const fileMsg = {
        id: tempId,
        senderId: 'me',
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
        content: file.name,
        metadata: { fileName: file.name, fileSize: file.size, mimeType: file.type },
        timestamp: new Date().toISOString(),
        status: 'uploading',
        uploadProgress: 0
      };
      
      setMessages(prev => [...prev, fileMsg]);

      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${API_BASE_URL}/attachments/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => prev.map(msg => 
            msg.id === tempId ? { ...msg, status: 'sent', metadata: { ...msg.metadata, url: data.url } } : msg
          ));
          toast.success(`Uploaded ${file.name}`);
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error(err);
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        ));
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    e.target.value = '';
  };
  const handleCameraCapture = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      toast.error('Camera permission denied. Please enable it in browser settings.');
      setShowCameraModal(false);
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      await uploadCapturedMedia(file);
      closeCameraModal();
    }, 'image/jpeg', 0.95);
  };

  const closeCameraModal = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraModal(false);
  };

  const uploadCapturedMedia = async (file) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const mediaMsg = {
      id: tempId,
      senderId: 'me',
      type: file.type.startsWith('image/') ? 'image' : 'video',
      content: file.name,
      metadata: { fileName: file.name, fileSize: file.size, mimeType: file.type },
      timestamp: new Date().toISOString(),
      status: 'uploading'
    };

    setMessages(prev => [...prev, mediaMsg]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/attachments/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(msg =>
          msg.id === tempId ? { ...msg, status: 'sent', metadata: { ...msg.metadata, url: data.url } } : msg
        ));
        toast.success('Media uploaded!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      ));
      toast.error('Failed to upload media');
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
        await uploadVoiceMessage(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('Recording started...');
    } catch (err) {
      console.error('Microphone access error:', err);
      toast.error('Microphone permission denied. Please enable it in browser settings.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const uploadVoiceMessage = async (file) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const voiceMsg = {
      id: tempId,
      senderId: 'me',
      type: 'voice',
      content: `Voice message (${recordingTime}s)`,
      metadata: { fileName: file.name, fileSize: file.size, mimeType: file.type, duration: recordingTime },
      timestamp: new Date().toISOString(),
      status: 'uploading'
    };

    setMessages(prev => [...prev, voiceMsg]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/attachments/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(msg =>
          msg.id === tempId ? { ...msg, status: 'sent', metadata: { ...msg.metadata, url: data.url } } : msg
        ));
        toast.success('Voice message sent!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      ));
      toast.error('Failed to send voice message');
    }
  };

  const handleStoryCamera = async () => {
    setShowStoryModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Story camera error:', err);
      toast.error('Camera permission denied for story.');
      setShowStoryModal(false);
    }
  };

  const captureStory = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], `story_${Date.now()}.jpg`, { type: 'image/jpeg' });
      await uploadStory(file);
      closeStoryModal();
    }, 'image/jpeg', 0.95);
  };

  const closeStoryModal = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowStoryModal(false);
  };

  const uploadStory = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      toast.loading('Uploading story...');
      const res = await fetch(`${API_BASE_URL}/stories/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        toast.dismiss();
        toast.success('Story uploaded! ');
        console.log('Story uploaded:', data);
      } else {
        throw new Error('Story upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('Failed to upload story');
    }
  };

  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case 'location':
        return (
          <div className="location-message">
            <div className="location-icon"></div>
            <div className="location-text">
              <div className="location-title">Shared Location</div>
              {msg.metadata?.mapsUrl && (
                <a href={msg.metadata.mapsUrl} target="_blank" rel="noopener noreferrer" className="location-link">
                  View on Google Maps
                </a>
              )}
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="image-message">
            {msg.metadata?.url ? (
              <img src={msg.metadata.url} alt={msg.content} className="message-image" />
            ) : (
              <div className="uploading-placeholder"> Uploading image...</div>
            )}
            <div className="file-name">{msg.content}</div>
          </div>
        );
      
      case 'video':
        return (
          <div className="video-message">
            {msg.metadata?.url ? (
              <video src={msg.metadata.url} controls className="message-video" />
            ) : (
              <div className="uploading-placeholder"> Uploading video...</div>
            )}
            <div className="file-name">{msg.content}</div>
          </div>
        );
      
      case 'voice':
        return (
          <div className="voice-message">
            <div className="voice-icon"></div>
            {msg.metadata?.url ? (
              <audio src={msg.metadata.url} controls className="voice-player" />
            ) : (
              <div className="uploading-placeholder">Uploading voice...</div>
            )}
            <div className="voice-duration">{msg.metadata?.duration || 0}s</div>
          </div>
        );
      
      case 'file':
        return (
          <div className="file-message">
            <div className="file-icon"></div>
            <div className="file-info">
              <div className="file-name">{msg.content}</div>
              {msg.metadata?.url ? (
                <a href={msg.metadata.url} download className="file-download">Download</a>
              ) : (
                <div className="uploading-placeholder">Uploading...</div>
              )}
            </div>
          </div>
        );
      
      default:
        return <div className="message-content">{msg.content}</div>;
    }
  };


  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <button className="chat-back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="chat-partner-info">
          <div className="chat-partner-avatar">
            {partner.profilePic ? (
              <img src={partner.profilePic} alt={partner.name} />
            ) : (
              <div className="avatar-placeholder">{partner.name.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="chat-partner-name">{partner.name}</div>
        </div>

        {/* Call Buttons */}
        <div className="chat-call-buttons">
          <button 
            className="chat-call-btn audio-call-btn" 
            onClick={() => toast('📞 Audio call feature coming soon!', { duration: 3000 })}
            title="Audio Call"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="chat-call-btn video-call-btn" 
            onClick={() => toast('📹 Video call feature coming soon!', { duration: 3000 })}
            title="Video Call"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M23 7l-7 5 7 5V7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.senderId === 'me' ? 'message-sent' : 'message-received'}`}>
            {renderMessageContent(msg)}
            <div className="message-footer">
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.senderId === 'me' && (
                <span className={`message-status message-status-${msg.status}`}>
                  {msg.status === 'sending' && ''}
                  {msg.status === 'sent' && ''}
                  {msg.status === 'delivered' && ''}
                  {msg.status === 'read' && ''}
                  {msg.status === 'failed' && (
                    <button onClick={() => retryMessage(msg.id)} className="retry-btn"> Retry</button>
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Plus Menu */}
      {showPlusMenu && (
        <>
          <div className="plus-menu-overlay" onClick={() => setShowPlusMenu(false)}></div>
          <div className="plus-menu">
            <button className="plus-menu-item premium-item location-item" onClick={() => { setShowPlusMenu(false); handleLocationShare(); }}>
              <span className="plus-menu-icon"></span>
              <span className="plus-menu-label">Location</span>
            </button>
            <button className="plus-menu-item premium-item quick-game-item" onClick={() => { setShowPlusMenu(false); handlePlayGame(); }}>
              <span className="plus-menu-icon"></span>
              <span className="plus-menu-label">Quick Game</span>
            </button>
            <button className="plus-menu-item premium-item files-item" onClick={() => { setShowPlusMenu(false); fileInputRef.current?.click(); }}>
              <span className="plus-menu-icon"></span>
              <span className="plus-menu-label">Files</span>
            </button>
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="camera-modal-overlay" onClick={closeCameraModal}>
          <div className="camera-modal" onClick={(e) => e.stopPropagation()}>
            <video ref={videoRef} autoPlay playsInline className="camera-preview"></video>
            <div className="camera-controls">
              <button className="camera-btn capture-btn" onClick={capturePhoto}> Capture Photo</button>
              <button className="camera-btn close-btn" onClick={closeCameraModal}> Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {showStoryModal && (
        <div className="camera-modal-overlay" onClick={closeStoryModal}>
          <div className="camera-modal" onClick={(e) => e.stopPropagation()}>
            <video ref={videoRef} autoPlay playsInline className="camera-preview"></video>
            <div className="camera-controls">
              <button className="camera-btn capture-btn" onClick={captureStory}> Use as Story</button>
              <button className="camera-btn close-btn" onClick={closeStoryModal}> Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="chat-composer">
        <button className="composer-icon-btn" onClick={() => setShowPlusMenu(!showPlusMenu)} title="More options">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <button className="composer-icon-btn" onClick={handleCameraCapture} title="Camera">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        
        <button 
          className={`composer-icon-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording} 
          title={isRecording ? 'Stop Recording' : 'Voice Message'}
        >
          {isRecording ? (
            <span className="recording-indicator"> {recordingTime}s</span>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={sending}
        />
        <button 
          className="chat-send-btn" 
          onClick={sendMessage}
          disabled={!text.trim() || sending}
        >
          {sending ? '...' : ''}
        </button>
      </div>

      {/* Floating Camera FAB for Stories */}
      <button className="camera-fab" onClick={handleStoryCamera} title="Create Story">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="currentColor"/>
          <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </button>
    </div>
  );
}

export default ChatPage;














