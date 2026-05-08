'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function GuidesPage() {
  const [search, setSearch] = useState('');
  const firestore = useFirestore();

  const guidesQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'guides');
  }, [firestore]);

  const { data: guides, loading } = useCollection(guidesQuery);

  const filteredGuides = useMemo(() => {
    if (!guides) return [];
    if (!search.trim()) return guides;
    const lower = search.toLowerCase();
    return guides.filter(guide => 
      guide.location?.toLowerCase().includes(lower) ||
      guide.fullName?.toLowerCase().includes(lower)
    );
  }, [guides, search]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="bg-primary rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <h1 className="font-headline text-4xl font-bold">Find Local Experts</h1>
          <p className="text-white/80 text-lg">
            Connect with certified local guides who will show you the authentic side of Andhra Pradesh.
          </p>
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input 
              placeholder="Search by city (e.g. Tirupati)..." 
              className="pl-12 h-14 bg-white text-foreground rounded-xl shadow-lg border-none focus-visible:ring-accent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="hidden lg:block relative w-64 h-64">
           <Image 
             src="https://picsum.photos/seed/guide-hero/512/512" 
             alt="Guide" 
             fill 
             priority
             className="object-cover rounded-2xl rotate-3 shadow-2xl" 
             sizes="256px"
           />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Scanning for local experts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.length > 0 ? (
            filteredGuides.map((guide, idx) => (
              <Link key={guide.id} href={`/guides/${guide.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all border-none bg-white dark:bg-zinc-900 h-full">
                  <div className="relative h-64 w-full bg-secondary">
                    <Image 
                      src={guide.imageUrl || `https://picsum.photos/seed/${guide.id}/400/400`} 
                      alt={guide.fullName} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-primary border-none flex items-center gap-1 font-bold">
                        <Star className="w-3 h-3 fill-accent text-accent" /> {guide.rating || 'New'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-headline text-xl font-bold flex items-center justify-between">
                        {guide.fullName}
                        <ShieldCheck className="w-5 h-5 text-accent" />
                      </h3>
                      <p className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-accent" /> {guide.location}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {guide.languages?.split(',').map(lang => (
                        <Badge key={lang} variant="secondary" className="bg-secondary/50 text-primary">{lang.trim()}</Badge>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t flex items-center justify-between mt-auto">
                      <span className="text-xs text-muted-foreground italic">{guide.specialty || 'Local'} Specialist</span>
                      <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-white">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Users className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-headline font-bold">No guides found in this area yet</h3>
              <p className="text-muted-foreground">Try searching for another location or register as a guide to appear here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}