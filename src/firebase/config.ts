
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * IMPORTANT: You must replace these placeholders with your actual Firebase project configuration.
 * Find them in: Firebase Console > Project Settings > General > Your apps.
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

export function getFirebaseApp(): FirebaseApp {
  const existingApp = getApps().at(0);
  if (existingApp) return existingApp;
  
  // Basic validation to prevent crashes if placeholders are still present
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn("Firebase API Key is missing. Please update src/firebase/config.ts with your real credentials.");
  }
  
  return initializeApp(firebaseConfig);
}
