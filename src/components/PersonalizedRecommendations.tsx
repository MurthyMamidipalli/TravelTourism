
'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const allPlaces = [
  { id: 'tirumala-temple', name: 'Tirumala Temple', category: 'Pilgrimage', rating: 4.9 },
  { id: 'sri-kalahasti', name: 'Sri Kalahasti', category: 'Pilgrimage', rating: 4.7 },
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', category: 'Nature', rating: 4.8 },
  { id: 'charminar', name: 'Charminar', category: 'Heritage', rating: 4.7 },
  { id: 'golconda-fort', name: 'Golconda Fort', category: 'Heritage', rating: 4.9 },
];

export default function PersonalizedRecommendations({ currentCategory, currentId }: { currentCategory: string, currentId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);

  const personalized = useMemo(() => {
    // Logic: Match user interests from profile or match current category
    const interests = profile?.interests?.toLowerCase().split(',') || [];
    return allPlaces
      .filter(p => p.id !== currentId)
      .sort((a, b) => {
        const aMatch = interests.some(i => a.category.toLowerCase().includes(i.trim())) ? 2 : (a.category === currentCategory ? 1 : 0);
        const bMatch = interests.some(i => b.category.toLowerCase().includes(i.trim())) ? 2 : (b.category === currentCategory ? 1 : 0);
        return bMatch - aMatch || b.rating - a.rating;
      })
      .slice(0, 3);
  }, [profile, currentCategory, currentId]);

  return (
    <Card className="border-none shadow-md bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-secondary/20 pb-4">
        <CardTitle className="text-lg flex items-center gap-2 font-bold font-headline">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Hand-picked For You
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {personalized.map((place) => (
          <Link key={place.id} href={`/destinations/${place.id}`}>
            <div className="flex items-center gap-4 group p-2 hover:bg-secondary/30 rounded-2xl transition-colors">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={`https://picsum.photos/seed/${place.id}/200/200`} alt={place.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{place.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-black">{place.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold">{place.rating}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
