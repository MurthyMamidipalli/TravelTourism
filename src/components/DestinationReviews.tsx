
'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { Star, User, Calendar, MessageSquare, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface DestinationReviewsProps {
  destinationId: string;
}

export default function DestinationReviews({ destinationId }: DestinationReviewsProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reviewsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'destinations', destinationId, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
  }, [firestore, destinationId]);

  const { data: reviews, loading } = useCollection(reviewsQuery);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast({ title: "Auth Required", description: "Please sign in to review.", variant: "destructive" });
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    const reviewData = {
      userId: user.uid,
      userName: user.displayName || 'Traveler',
      rating,
      comment,
      createdAt: serverTimestamp(),
    };

    const reviewsRef = collection(firestore!, 'destinations', destinationId, 'reviews');

    addDoc(reviewsRef, reviewData)
      .then(() => {
        toast({ title: "Review Added", description: "Thanks for sharing!" });
        setComment('');
        setRating(5);
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: reviewsRef.path,
          operation: 'create',
          requestResourceData: reviewData,
        }));
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="space-y-8">
      <div className="bg-secondary/10 p-8 rounded-[2rem] border border-dashed border-primary/20">
        <h3 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" /> Share Your Experience
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="What was the highlight of your visit?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px] bg-white rounded-2xl"
          />
          <Button disabled={submitting} className="w-full h-12 rounded-xl font-bold shadow-lg">
            {submitting ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Post Public Review</>}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review: any, idx: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-secondary shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.userName}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {review.createdAt ? format(review.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground italic bg-secondary/5 rounded-3xl border border-dashed">
            No reviews yet. Be the first to tell others about this place!
          </div>
        )}
      </div>
    </div>
  );
}
