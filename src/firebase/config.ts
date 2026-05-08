
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * ATTENTION: You MUST replace these values with your real Firebase config.
 * 
 * 1. Go to Firebase Console (https://console.firebase.google.com/)
 * 2. Select project: voyage-compass-ap
 * 3. Click Project Overview > Project Settings (Gear Icon)
 * 4. Scroll to 'Your apps' > Web App (</>)
 * 5. Copy the config object and paste the values below.
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
  
  const isPlaceholder = firebaseConfig.apiKey.includes('REPLACE_WITH');
  
  if (isPlaceholder && typeof window !== 'undefined') {
    console.error(
      "FIREBASE ERROR: You are using placeholder configuration! " +
      "Please update src/firebase/config.ts with your actual API key from the Firebase Console."
    );
  }
  
  return initializeApp(firebaseConfig);
}
