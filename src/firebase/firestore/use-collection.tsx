'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  type Query,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<Error | null>(null);
  const lastQueryPath = useRef<string | null>(null);

  const currentPath = (query as any)?._query?.path?.toString() || null;

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    // Only set loading to true if the query path actually changed
    if (currentPath !== lastQueryPath.current) {
      setLoading(true);
      lastQueryPath.current = currentPath;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(items);
        setLoading(false);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: currentPath || 'unknown',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, currentPath]);

  return { data, loading, error };
}
