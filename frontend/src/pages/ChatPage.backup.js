import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatPage.css';
import { getWebSocket } from '../services/websocketService';
import { uploadFileWithProgress } from '../services/uploadService';

function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const wsRef = useRef(null);

  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    // load mock messages
    const mock = Array.from({ length: 10 }).map((_, i) => ({ id: i, text: `Mock message ${i+1}`, me: i % 2 === 0 }));
    setMessages(mock);

    // connect to websocket
    const ws = getWebSocket();
    ws.connect();
    const listener = (data) => {
      // handle message types: message, typing, delivery, read
      try {
        if (!data) return;
        if (data.type === 'message' && data.chatId === id) {
          const p = data.payload || {};
          // if local echo (has localId), mark that message as delivered
          if (p.localId) {
            setMessages((m) => m.map((msg) => msg.localId === p.localId ? { ...msg, status: 'delivered' } : msg));
          } else {
            setMessages((m) => [...m, { id: m.length + 1, text: p.text || '', me: false, media: p.media || null }]);
          }
          setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
        } else if (data.type === 'typing' && data.chatId === id) {
          const from = (data.payload && data.payload.from) || 'someone';
          setTypingUsers((t) => ({ ...t, [from]: Date.now() }));
          // clear after 3s
          setTimeout(() => {
            setTypingUsers((t) => {
              const copy = { ...t };
              if (Date.now() - copy[from] > 2800) delete copy[from];
              return copy;
            });
          }, 3000);
        } else if (data.type === 'delivery' && data.chatId === id) {
          const localId = data.payload && data.payload.localId;
          if (localId) setMessages((m) => m.map((msg) => msg.localId === localId ? { ...msg, status: 'delivered' } : msg));
        } else if (data.type === 'read' && data.chatId === id) {
          const localId = data.payload && data.payload.localId;
          if (localId) setMessages((m) => m.map((msg) => msg.localId === localId ? { ...msg, status: 'read' } : msg));
        }
      } catch (e) { console.error(e); }
    };
    ws.addListener(listener);
    wsRef.current = ws;

    return () => {
      ws.removeListener(listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const send = async (opts = {}) => {
    const content = opts.text ?? text;
    if (!content && !opts.media) return;
    const localId = `c_${Date.now()}`;
    const msg = { id: messages.length + 1, localId, text: content || '', me: true, status: 'sending', media: opts.media || null };
    setMessages((m) => [...m, msg]);
    setText('');

    const payload = { type: 'message', chatId: id, payload: { text: content, media: opts.media || null, localId } };
    wsRef.current?.send(payload);

    // if server instantly echoes, listener will mark delivered; otherwise mark as sent
    setMessages((m) => m.map((mm) => mm.localId === localId ? { ...mm, status: 'sent' } : mm));
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  // typing
  const sendTyping = throttle(() => {
    const payload = { type: 'typing', chatId: id, payload: { from: 'you' } };
    wsRef.current?.send(payload);
  }, 800);

  const handleInputChange = (e) => {
    setText(e.target.value);
    sendTyping();
  };

  // upload handler
  const handleUpload = async (file) => {
    if (!file) return;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const localId = `u_${Date.now()}`;
    // optimistic message with progress
    const msg = { id: messages.length + 1, localId, text: '', me: true, status: 'uploading', media: { name: file.name, type: file.type }, progress: 0 };
    setMessages((m) => [...m, msg]);

    try {
      const res = await uploadFileWithProgress(baseUrl + '/upload', file, (p) => {
        setMessages((prev) => prev.map((mm) => mm.localId === localId ? { ...mm, progress: p } : mm));
      });
      const media = { url: res.url, name: file.name, type: file.type };
      // send message payload with media
      const payload = { type: 'message', chatId: id, payload: { media, localId } };
      wsRef.current?.send(payload);
      // mark as sent
      setMessages((prev) => prev.map((mm) => mm.localId === localId ? { ...mm, status: 'sent', media } : mm));
    } catch (err) {
      console.error('Upload failed', err);
      setMessages((prev) => prev.map((mm) => mm.localId === localId ? { ...mm, status: 'failed' } : mm));
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleUpload(f);
    e.target.value = null;
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <div className="chat-title">{id}</div>
      </header>

      <div className="chat-messages" ref={listRef}>
        {messages.map((m) => (
          <div key={m.localId || m.id} className={`msg ${m.me ? 'me' : 'them'}`}>
            {m.media && (
              <div className="msg-media">
                {m.media.type && m.media.type.startsWith('image') && <img src={(process.env.REACT_APP_API_URL || 'http://localhost:8000') + m.media.url} alt={m.media.name} style={{ maxWidth: '240px' }} />}
                {m.media.type && m.media.type.startsWith('video') && <video src={(process.env.REACT_APP_API_URL || 'http://localhost:8000') + m.media.url} controls style={{ maxWidth: '320px' }} />}
                {!m.media.type && <a href={(process.env.REACT_APP_API_URL || 'http://localhost:8000') + m.media.url} target="_blank" rel="noreferrer">{m.media.name}</a>}
              </div>
            )}
            <div className="msg-text">{m.text}</div>
            {m.me && <div className="msg-status">{m.status || ''}</div>}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input value={text} onChange={handleInputChange} placeholder="Type a message" />
        <input type="file" id="fileinput" style={{ display: 'none' }} onChange={onFileChange} />
        <button onClick={() => document.getElementById('fileinput').click()}>Attach</button>
        <button onClick={() => send()}>Send</button>
      </div>

      <div className="typing-indicator">{Object.keys(typingUsers).length > 0 ? 'Someone is typing...' : ''}</div>
    </div>
  );
}

export default ChatPage;
