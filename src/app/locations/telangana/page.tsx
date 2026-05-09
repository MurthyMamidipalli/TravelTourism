
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ArrowRight, Map, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TS_DISTRICTS = [
  { id: 'hyderabad', name: 'Hyderabad', region: 'Metropolis', image: 'https://picsum.photos/seed/hyd/800/600', count: 6 },
  { id: 'yadadri', name: 'Yadadri Bhuvanagiri', region: 'Spiritual', image: 'https://picsum.photos/seed/yadadri/800/600', count: 2 },
  { id: 'mulugu', name: 'Mulugu', region: 'Nature & Heritage', image: 'https://picsum.photos/seed/mulugu/800/600', count: 3 },
  { id: 'nirmal', name: 'Nirmal', region: 'Waterfalls', image: 'https://picsum.photos/seed/nirmal/800/600', count: 3 },
  { id: 'hanamkonda', name: 'Hanamkonda', region: 'Cultural Hub', image: 'https://picsum.photos/seed/warangal/800/600', count: 2 },
  { id: 'bhadradri', name: 'Bhadradri Kothagudem', region: 'Spiritual', image: 'https://picsum.photos/seed/bhadradri/800/600', count: 1 },
  { id: 'vikarabad', name: 'Vikarabad', region: 'Highlands', image: 'https://picsum.photos/seed/vikarabad/800/600', count: 1 },
  { id: 'ranga-reddy', name: 'Ranga Reddy', region: 'Entertainment', image: 'https://picsum.photos/seed/rr/800/600', count: 1 },
  { id: 'nalgonda', name: 'Nalgonda', region: 'Riverside', image: 'https://picsum.photos/seed/nalgonda/800/600', count: 1 },
  { id: 'suryapet', name: 'Suryapet', region: 'Waterfalls', image: 'https://picsum.photos/seed/suryapet/800/600', count: 1 },
  { id: 'karimnagar', name: 'Karimnagar', region: 'Forts', image: 'https://picsum.photos/seed/karimnagar/800/600', count: 1 },
  { id: 'medak', name: 'Medak', region: 'Historical', image: 'https://picsum.photos/seed/medak/800/600', count: 1 },
];

export default function TSDistrictsPage() {
  const { user, loading } = useUser();
  const [search, setSearchTerm] = useState('');

  const filtered = TS_DISTRICTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full"><Lock className="w-12 h-12 text-primary" /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Access Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Please sign in to discover the landmarks and local guides of Telangana.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">Sign In</Button></Link>
          <Link href="/signup"><Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Register</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1 flex items-center gap-1.5 mx-auto w-fit">
            <Globe className="w-3.5 h-3.5" /> Telangana
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">Explore Districts</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Select a district to discover its unique landmarks and local guides.
          </p>
        </motion.div>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search district or region..." 
            className="pl-12 h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border-none text-lg focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((district, idx) => (
          <motion.div
            key={district.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Link href={`/locations/telangana/${district.id}`}>
              <Card className="premium-card overflow-hidden h-full group flex flex-col">
                <div className="relative h-64">
                  <Image 
                    src={district.image} 
                    alt={district.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white right-6">
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1 font-body">{district.region}</p>
                    <h3 className="text-3xl font-bold tracking-tight font-headline">{district.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6 flex items-center justify-between mt-auto bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Map className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold">{district.count} Places</span>
                  </div>
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
