
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  guideId: string;
}

export default function ReviewForm({ guideId }: ReviewFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) return;

    setSubmitting(true);
    const reviewData = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous Traveler',
      rating,
      comment,
      createdAt: serverTimestamp(),
    };

    const reviewsRef = collection(firestore!, 'guides', guideId, 'reviews');

    // Optimistically submit: don't wait for server confirmation to update UI
    addDoc(reviewsRef, reviewData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: reviewsRef.path,
          operation: 'create',
          requestResourceData: reviewData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    // Reset UI immediately for a snappy feel
    setComment('');
    setRating(5);
    setSubmitting(false);
    
    toast({
      title: "Review Posted",
      description: "Thanks! Your review has been added.",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/20 p-6 rounded-2xl border border-secondary">
      <h3 className="font-headline font-bold text-lg">Leave a Review</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${star <= rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Share your experience with this guide..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px] bg-background"
        required
      />
      <Button 
        type="submit" 
        disabled={submitting} 
        className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl h-11"
      >
        {submitting ? 'Submitting...' : 'Post Review'}
      </Button>
    </form>
  );
}
