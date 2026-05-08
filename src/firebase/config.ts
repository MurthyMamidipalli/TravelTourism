
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * ATTENTION: You MUST replace these placeholder values with your real Firebase config.
 * 1. Go to Firebase Console > Project Settings.
 * 2. Scroll to 'Your apps' > Web App.
 * 3. Copy the firebaseConfig object and paste it below.
 */
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_ACTUAL_API_KEY",
  authDomain: "voyage-compass-ap.firebaseapp.com",
  projectId: "voyage-compass-ap",
  storageBucket: "voyage-compass-ap.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

export function getFirebaseApp(): FirebaseApp {
  const apps = getApps();
  if (apps.length > 0) return apps[0];
  
  if (firebaseConfig.apiKey.includes('REPLACE_WITH')) {
    console.warn("Firebase Configuration: Placeholder values detected. Please update src/firebase/config.ts with your actual API key from the Firebase Console.");
  }
  
  return initializeApp(firebaseConfig);
}
