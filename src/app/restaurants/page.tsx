'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ArrowRight, Utensils, Lock, LogIn } from 'lucide-react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const states = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    badge: 'Spicy & Authentic',
    desc: 'From the world-famous Hyderabadi Biryani origins to the fiery Rayalaseema Ruchulu, savor every bite.',
    img: 'https://picsum.photos/seed/ap-food/800/600',
    count: '25+ Restaurants'
  },
  {
    id: 'telangana',
    name: 'Telangana',
    badge: 'Ganga-Jamuni Tehzeeb',
    desc: 'Experience the unique blend of Nizami flavors and rustic village tastes, from Irani Chai to Mamsam Pulao.',
    img: 'https://picsum.photos/seed/ts-food/800/600',
    count: '30+ Restaurants'
  }
];

export default function RestaurantsLandingPage() {
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
        <div className="bg-primary/10 p-6 rounded-full"><Lock className="w-12 h-12 text-primary" /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Dining Map Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Access our curated culinary guide and interactive dining maps by signing in to your account.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">Sign In Now</Button></Link>
          <Link href="/signup"><Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Join TravelSphere</Button></Link>
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
            <Utensils className="w-3.5 h-3.5" /> Culinary India
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">Explore Flavors</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Discover the rich gastronomic heritage of the heart of South India.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        {states.map((state, idx) => (
          <Link key={state.id} href={`/restaurants/${state.id}`}>
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
        <p className="text-muted-foreground italic text-sm">More regional cuisines coming soon...</p>
      </div>
    </div>
  );
}
