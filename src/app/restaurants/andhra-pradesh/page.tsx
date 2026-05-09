
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ArrowRight, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const FOOD_DISTRICTS = [
  { id: 'tirupati', name: 'Tirupati', region: 'Rayalaseema', image: 'https://picsum.photos/seed/tirupati-food/800/600', count: 3 },
  { id: 'vizag', name: 'Visakhapatnam', region: 'Coastal AP', image: 'https://picsum.photos/seed/vizag-food/800/600', count: 8 },
  { id: 'ntr', name: 'NTR District (Vijayawada)', region: 'Central AP', image: 'https://picsum.photos/seed/vijayawada-food/800/600', count: 5 },
  { id: 'east-godavari', name: 'East Godavari', region: 'Godavari Basin', image: 'https://picsum.photos/seed/egodavari-food/800/600', count: 2 },
  { id: 'guntur', name: 'Guntur', region: 'Central AP', image: 'https://picsum.photos/seed/guntur-food/800/600', count: 3 },
  { id: 'kurnool', name: 'Kurnool', region: 'Rayalaseema', image: 'https://picsum.photos/seed/kurnool-food/800/600', count: 2 },
  { id: 'nellore', name: 'Nellore', region: 'Coastal AP', image: 'https://picsum.photos/seed/nellore-food/800/600', count: 1 },
  { id: 'anantapur', name: 'Anantapur', region: 'Rayalaseema', image: 'https://picsum.photos/seed/anantapur-food/800/600', count: 1 },
];

export default function APFoodDistrictsPage() {
  const [search, setSearchTerm] = useState('');

  const filtered = FOOD_DISTRICTS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1 flex items-center gap-1.5 mx-auto w-fit">
            <Globe className="w-3.5 h-3.5" /> Andhra Pradesh
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">Culinary Map</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Explore the unique tastes and famous dining spots of each district.
          </p>
        </motion.div>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search district or cuisine..." 
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
            <Link href={`/restaurants/andhra-pradesh/${district.id}`}>
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
                    <h3 className="text-2xl font-bold tracking-tight font-headline">{district.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6 flex items-center justify-between mt-auto bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Utensils className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold">{district.count} Restaurants</span>
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
