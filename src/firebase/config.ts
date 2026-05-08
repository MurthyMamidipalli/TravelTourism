
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * Replace these values with your actual Firebase project configuration
 * from the Firebase Console: Project Settings > Your Apps > Web App.
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
  const existingApp = getApps().at(0);
  if (existingApp) return existingApp;
  
  // Validation for initial setup
  if (firebaseConfig.apiKey.includes('REPLACE_WITH')) {
    console.warn("Firebase Configuration: Placeholder values detected. Please update src/firebase/config.ts with your actual API key from the Firebase Console.");
  }
  
  return initializeApp(firebaseConfig);
}
