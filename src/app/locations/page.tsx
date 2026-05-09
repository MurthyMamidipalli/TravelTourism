'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ArrowRight, Lock, LogIn } from 'lucide-react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const states = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    badge: 'Sunrise State',
    desc: 'The heart of South India, home to spiritual heights, vibrant coasts, and rich cultural heritage.',
    img: 'https://picsum.photos/seed/ap-state/800/600',
    count: '26 Districts'
  },
  {
    id: 'telangana',
    name: 'Telangana',
    badge: 'State of Harmony',
    desc: 'A blend of grand history and modern growth, from the Charminar to pristine waterfalls.',
    img: 'https://picsum.photos/seed/ts-state/800/600',
    count: '33 Districts'
  }
];

export default function LocationsPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12">
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <Skeleton className="h-[300px] w-full rounded-3xl" />
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full">
          <Lock className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Explore Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Please sign in to explore states, districts, and discover the hidden wonders of India.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
              <LogIn className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">
              Join TravelSphere
            </Button>
          </Link>
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
            <Globe className="w-3.5 h-3.5" /> India
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">Explore Regions</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Start your journey by selecting a state or territory.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        {states.map((state, idx) => (
          <Link key={state.id} href={`/locations/${state.id}`}>
            <motion.div
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Card className="premium-card overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-full">
                    <Image 
                      src={state.img} 
                      alt={state.name} 
                      fill 
                      priority={idx === 0}
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center space-y-6">
                    <div>
                      <Badge className="bg-accent text-white border-none mb-2">{state.badge}</Badge>
                      <h2 className="text-4xl font-bold tracking-tight">{state.name}</h2>
                      <p className="text-muted-foreground mt-2 leading-relaxed font-body">
                        {state.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                      Explore {state.count} <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="text-center pt-12">
        <p className="text-muted-foreground italic text-sm">More states and global regions coming soon...</p>
      </div>
    </div>
  );
}
