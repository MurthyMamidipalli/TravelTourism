
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ArrowRight } from 'lucide-react';

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
