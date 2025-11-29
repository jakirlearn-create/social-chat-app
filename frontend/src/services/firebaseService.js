/**
 * Firebase Service for Realtime Database Operations
 * Handles initialization and provides database reference
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, push, set, update, get, serverTimestamp } from 'firebase/database';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Export database instance and utilities
export { database, ref, onValue, off, push, set, update, get, serverTimestamp };

/**
 * Create a reference to a specific path in the database
 * @param {string} path - Database path (e.g., 'messages/chatRoomId')
 * @returns {DatabaseReference} - Firebase database reference
 */
export const createRef = (path) => {
  return ref(database, path);
};

/**
 * Check if Firebase is initialized
 * @returns {boolean} - True if initialized
 */
export const isFirebaseInitialized = () => {
  return !!database;
};
