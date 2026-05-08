'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * Firebase Configuration for Voyage Compass.
 * Replace the placeholder values with your actual project keys from the Firebase Console.
 */
const firebaseConfig = {
  apiKey: "AIzaSyD-placeholder-key", // Replace with your real API Key from Firebase Console
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
