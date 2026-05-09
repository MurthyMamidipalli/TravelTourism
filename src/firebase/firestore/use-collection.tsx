
'use client';

import { useState, useEffect, useRef } from 'react';
import { onSnapshot, type Query, type DocumentData, type QuerySnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(!!query);
  const lastQueryKey = useRef<string | null>(null);

  const currentKey = (query as any)?._query?.path?.toString() || null;

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      lastQueryKey.current = null;
      return;
    }

    if (currentKey !== lastQueryKey.current) {
      setLoading(true);
      lastQueryKey.current = currentKey;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setData(items);
        setLoading(false);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({ path: currentKey || 'unknown', operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, currentKey]);

  return { data, loading };
}
