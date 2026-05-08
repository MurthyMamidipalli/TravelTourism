
'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSy...", // Placeholder, will be populated by Firebase Studio
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

export function getFirebaseApp(): FirebaseApp {
  const existingApp = getApps().at(0);
  return existingApp || initializeApp(firebaseConfig);
}
