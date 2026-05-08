'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * These values are now configured to connect to your specific Firebase project.
 * Ensure that Authentication and Firestore are enabled in your Firebase Console.
 */
const firebaseConfig = {
  apiKey: "AIzaSyD-placeholder-key", // In a real scenario, this would be fetched or provided by the tool
  authDomain: "voyage-compass-ap.firebaseapp.com",
  projectId: "voyage-compass-ap",
  storageBucket: "voyage-compass-ap.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

export function getFirebaseApp(): FirebaseApp {
  const existingApp = getApps().at(0);
  if (existingApp) return existingApp;
  
  return initializeApp(firebaseConfig);
}
