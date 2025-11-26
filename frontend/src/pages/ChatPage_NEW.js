import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatPage.css';
import { toast } from 'react-hot-toast';
import API_BASE_URL from '../config/api';

function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Partner info (mock - should come from API)
  const partner = {
    name: 'Chat Partner',
    profilePic: '',
    id: id
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation
  useEffect(() => {
    loadConversation();
  }, [id]);

  const loadConversation = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  // Send text message
  const sendTextMessage = async () => {
    if (!text.trim()) return;
    
    const tempId = `temp_${Date.now()}`;
    const newMessage = {
      id: tempId,
      senderId: 'me',
      type: 'text',
      content: text,
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
          content: text,
          timestamp: new Date().toISOString()
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, id: data.messageId, status: 'sent' } : msg
        ));
        toast.success('Message sent!');
      } else {
        throw new Error('Send failed');
      }
    } catch (err) {
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, status: 'failed' } : msg
      ));
      toast.error('Failed to send message');
    }
  };
