
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

/**
 * Firebase project configuration retrieved from the Firebase Console.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDzb5BIoBdlNlsK9JNPM8OYswvjUzz6dyQ",
  authDomain: "studio-7690905958-fe5cd.firebaseapp.com",
  projectId: "studio-7690905958-fe5cd",
  storageBucket: "studio-7690905958-fe5cd.firebasestorage.app",
  messagingSenderId: "243378294982",
  appId: "1:243378294982:web:4a358adc9e16f8469c47c7"
};

/**
 * Returns the initialized FirebaseApp instance.
 * Ensures that initializeApp is only called once.
 */
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  
  return initializeApp(firebaseConfig);
}
