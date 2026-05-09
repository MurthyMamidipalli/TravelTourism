
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ArrowRight, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const TS_FOOD_DISTRICTS = [
  { id: 'hyderabad', name: 'Hyderabad', region: 'Metropolis', image: 'https://picsum.photos/seed/hyd-food/800/600', count: 9 },
  { id: 'warangal', name: 'Warangal', region: 'Cultural Hub', image: 'https://picsum.photos/seed/warangal-food/800/600', count: 2 },
  { id: 'karimnagar', name: 'Karimnagar', region: 'Forts', image: 'https://picsum.photos/seed/karimnagar-food/800/600', count: 2 },
  { id: 'nizamabad', name: 'Nizamabad', region: 'Riverside', image: 'https://picsum.photos/seed/nizamabad-food/800/600', count: 2 },
  { id: 'khammam', name: 'Khammam', region: 'Nature', image: 'https://picsum.photos/seed/khammam-food/800/600', count: 2 },
  { id: 'mahabubnagar', name: 'Mahabubnagar', region: 'Heritage', image: 'https://picsum.photos/seed/mbnr-food/800/600', count: 1 },
  { id: 'adilabad', name: 'Adilabad', region: 'Forests & Falls', image: 'https://picsum.photos/seed/adilabad-food/800/600', count: 1 },
  { id: 'medak', name: 'Medak', region: 'Historical', image: 'https://picsum.photos/seed/medak-food/800/600', count: 1 },
  { id: 'sangareddy', name: 'Sangareddy', region: 'Industrial Hub', image: 'https://picsum.photos/seed/sangareddy-food/800/600', count: 1 },
  { id: 'vikarabad', name: 'Vikarabad', region: 'Highlands', image: 'https://picsum.photos/seed/vikarabad-food/800/600', count: 1 },
  { id: 'nalgonda', name: 'Nalgonda', region: 'Riverside', image: 'https://picsum.photos/seed/nalgonda-food/800/600', count: 1 },
  { id: 'jagtial', name: 'Jagtial', region: 'Spiritual', image: 'https://picsum.photos/seed/jagtial-food/800/600', count: 1 },
  { id: 'mancherial', name: 'Mancherial', region: 'River Town', image: 'https://picsum.photos/seed/mancherial-food/800/600', count: 1 },
  { id: 'siddipet', name: 'Siddipet', region: 'Model Town', image: 'https://picsum.photos/seed/siddipet-food/800/600', count: 1 },
  { id: 'kamareddy', name: 'Kamareddy', region: 'Central Hub', image: 'https://picsum.photos/seed/kamareddy-food/800/600', count: 1 },
  { id: 'yadadri', name: 'Yadadri', region: 'Divine', image: 'https://picsum.photos/seed/yadadri-food/800/600', count: 1 },
  { id: 'bhadradri', name: 'Bhadradri Kothagudem', region: 'Temple Town', image: 'https://picsum.photos/seed/bhadradri-food/800/600', count: 1 },
  { id: 'nagarkurnool', name: 'Nagarkurnool', region: 'Wilderness', image: 'https://picsum.photos/seed/nkurnool-food/800/600', count: 1 },
];

export default function TSFoodDistrictsPage() {
  const [search, setSearchTerm] = useState('');

  const filtered = TS_FOOD_DISTRICTS.filter(c => 
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
            <Globe className="w-3.5 h-3.5" /> Telangana
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">Explore Telangana Flavors</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            From Nizami feasts to local rustic delights across 18 districts.
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
            <Link href={`/restaurants/telangana/${district.id}`}>
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
