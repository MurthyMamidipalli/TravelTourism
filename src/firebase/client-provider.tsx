
'use client';

import React, { useMemo } from 'react';
import { getFirebaseApp } from './config';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FirebaseProvider } from './provider';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { app, firestore, auth } = useMemo(() => {
    const app = getFirebaseApp();
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    return { app, firestore, auth };
  }, []);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
