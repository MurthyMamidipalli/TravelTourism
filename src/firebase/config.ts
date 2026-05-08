
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * ATTENTION: You MUST replace the values below with your real project configuration!
 * 
 * 1. Go to https://console.firebase.google.com/
 * 2. Select your project "voyage-compass-ap"
 * 3. Go to Project Settings > Your Apps > Web App
 * 4. Copy the "firebaseConfig" object and paste it below.
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
  
  // Basic validation to help the user identify missing keys
  if (firebaseConfig.apiKey.includes('REPLACE_WITH')) {
    console.error("Firebase Error: You haven't added your API Key in src/firebase/config.ts yet.");
  }
  
  return initializeApp(firebaseConfig);
}
