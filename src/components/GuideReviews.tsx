
'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Star, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { format } from 'date-fns';

interface GuideReviewsProps {
  guideId: string;
}

export default function GuideReviews({ guideId }: GuideReviewsProps) {
  const firestore = useFirestore();

  const reviewsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'guides', guideId, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
  }, [firestore, guideId]);

  const { data: reviews, loading } = useCollection(reviewsQuery);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-secondary/50 rounded-xl" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-headline text-2xl font-bold">Tourist Reviews</h3>
        <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1 rounded-full text-accent font-bold">
          <Star className="w-4 h-4 fill-accent" />
          {reviews && reviews.length > 0 
            ? (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length).toFixed(1)
            : 'N/A'
          }
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {reviews && reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-secondary shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{review.userName}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {review.createdAt ? format(review.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-muted-foreground/30">
              <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
