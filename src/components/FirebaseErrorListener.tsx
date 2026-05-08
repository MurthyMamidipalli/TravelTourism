
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export default function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In development, we want to see the specialized overlay if possible
      // but we always show a toast for clear feedback.
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: `You don't have permission to ${error.context.operation} at ${error.context.path}`,
      });
      
      // Optionally re-throw to trigger Next.js error boundary/overlay in dev
      if (process.env.NODE_ENV === 'development') {
        console.error('Firestore Permission Error Context:', error.context);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
