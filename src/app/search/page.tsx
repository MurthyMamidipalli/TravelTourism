
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, MapPin, Sparkles, Lock, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const allData = [
  // Telangana Spreadsheet Locations
  { id: 'charminar', name: 'Charminar', district: 'Hyderabad', type: 'Historical' },
  { id: 'golconda-fort', name: 'Golconda Fort', district: 'Hyderabad', type: 'Historical' },
  { id: 'ramoji-film-city', name: 'Ramoji Film City', district: 'Ranga Reddy', type: 'Entertainment' },
  { id: 'birla-mandir', name: 'Birla Mandir', district: 'Hyderabad', type: 'Temple' },
  { id: 'yadadri-temple', name: 'Yadadri Temple', district: 'Yadadri Bhuvanagiri', type: 'Temple' },
  { id: 'basara-temple', name: 'Basara Saraswati Temple', district: 'Nirmal', type: 'Temple' },
  { id: 'keesaragutta', name: 'Keesaragutta Temple', district: 'Medchal-Malkajgiri', type: 'Temple' },
  { id: 'ramappa-temple', name: 'Ramappa Temple', district: 'Mulugu', type: 'Temple' },
  { id: 'thousand-pillar', name: 'Thousand Pillar Temple', district: 'Hanamkonda', type: 'Temple' },
  { id: 'bhadrachalam', name: 'Bhadrachalam Temple', district: 'Bhadradri Kothagudem', type: 'Temple' },
  { id: 'ananthagiri-hills', name: 'Ananthagiri Hills', district: 'Vikarabad', type: 'Hill Station' },
  { id: 'bogatha-falls', name: 'Bogatha Waterfalls', district: 'Mulugu', type: 'Waterfall' },
  { id: 'kuntala-falls', name: 'Kuntala Waterfalls', district: 'Nirmal', type: 'Waterfall' },
  { id: 'pochera-falls', name: 'Pochera Waterfalls', district: 'Nirmal', type: 'Waterfall' },
  { id: 'ethipothala-falls-ts', name: 'Ethipothala Waterfalls', district: 'Suryapet', type: 'Waterfall' },
  { id: 'nagarjuna-sagar-dam', name: 'Nagarjuna Sagar Dam', district: 'Nalgonda', type: 'Dam' },
  { id: 'hussain-sagar', name: 'Hussain Sagar Lake', district: 'Hyderabad', type: 'Lake' },
  { id: 'durgam-cheruvu', name: 'Durgam Cheruvu', district: 'Hyderabad', type: 'Lake' },
  { id: 'laknavaram-lake', name: 'Laknavaram Lake', district: 'Mulugu', type: 'Lake' },
  { id: 'pakhal-lake', name: 'Pakhal Lake', district: 'Warangal', type: 'Lake' },
  { id: 'warangal-fort', name: 'Warangal Fort', district: 'Hanamkonda', type: 'Historical' },
  { id: 'bhongir-fort', name: 'Bhongir Fort', district: 'Yadadri Bhuvanagiri', type: 'Historical' },
  { id: 'elgandal-fort', name: 'Elgandal Fort', district: 'Karimnagar', type: 'Historical' },
  { id: 'medak-fort', name: 'Medak Fort', district: 'Medak', type: 'Historical' },
  
  // Andhra Pradesh Locations
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', type: 'Pilgrimage' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Vizag', type: 'Beach' },
  { id: 'borra-caves', name: 'Borra Caves', district: 'ASR District', type: 'Nature' },
];

export default function SearchPage() {
  const { user, loading: authLoading } = useUser();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return allData;
    const lowerQuery = query.toLowerCase();
    return allData.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.district.toLowerCase().includes(lowerQuery) ||
      item.type.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const getCategoryImage = (item: any) => {
    const found = PlaceHolderImages.find(img => img.id === item.id);
    if (found) return { url: found.imageUrl, hint: found.imageHint };
    return { url: `https://picsum.photos/seed/${item.id}/200/200`, hint: 'Tourist Place' };
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Skeleton className="h-16 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full"><Lock className="w-12 h-12 text-primary" /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Search Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Please sign in to search and discover landmarks across the heart of India.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold">Sign In</Button></Link>
          <Link href="/signup"><Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Join Now</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl [scrollbar-gutter:stable]">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-none">Global Discovery</Badge>
          <h1 className="text-4xl md:text-6xl font-bold">Search Local Places</h1>
          <p className="text-muted-foreground text-lg">Find the best tourist spots across AP and Telangana.</p>
        </div>

        <div className="relative group max-w-2xl mx-auto">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search place, district or type..." 
            className="pl-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border-none text-xl focus-visible:ring-primary/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <AnimatePresence mode="popLayout">
            {results.map((item, idx) => {
              const imgData = getCategoryImage(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                >
                  <Link href={`/destinations/${item.id}`}>
                    <Card className="premium-card overflow-hidden group h-full">
                      <div className="flex items-center gap-4 p-4">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary">
                          <Image 
                            src={imgData.url} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex-grow space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">
                              {item.type}
                            </Badge>
                            <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent" /> {item.district}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
