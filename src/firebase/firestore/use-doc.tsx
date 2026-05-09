'use client';

import { useState, useEffect, useRef } from 'react';
import { onSnapshot, type DocumentReference, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!ref);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      lastPath.current = null;
      return;
    }

    // Optimization: Only set loading to true if the reference path actually changed
    if (ref.path !== lastPath.current) {
      setLoading(true);
      lastPath.current = ref.path;
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        setData(snapshot.exists() ? { ...snapshot.data()!, id: snapshot.id } : null);
        setLoading(false);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({ path: ref.path, operation: 'get' });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]); // Stable ref from useMemo recommended in component

  return { data, loading };
}
