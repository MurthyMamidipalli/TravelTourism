
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * IMPORTANT: Replace the placeholder values below with your actual Firebase project configuration.
 * You can find this in your Firebase Console: Project Settings > General > Your apps > Web apps.
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
  return existingApp || initializeApp(firebaseConfig);
}
