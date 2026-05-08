'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

/**
 * Firebase project configuration.
 * These values are public and safe to include in your client-side code.
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
 * Ensures only one instance is created on the client.
 */
export function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}
