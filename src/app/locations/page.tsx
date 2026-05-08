'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe, ArrowRight, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const AP_DISTRICTS = [
  { id: 'tirupati', name: 'Tirupati', region: 'Rayalaseema', image: 'https://picsum.photos/seed/tirupati/800/600', count: 4 },
  { id: 'vizag', name: 'Visakhapatnam', region: 'Coastal AP', image: 'https://picsum.photos/seed/vizag/800/600', count: 6 },
  { id: 'asr', name: 'ASR District', region: 'Highlands', image: 'https://picsum.photos/seed/asr/800/600', count: 2 },
  { id: 'east-godavari', name: 'East Godavari', region: 'Godavari Basin', image: 'https://picsum.photos/seed/egodavari/800/600', count: 4 },
  { id: 'konaseema', name: 'Konaseema', region: 'Godavari Basin', image: 'https://picsum.photos/seed/konaseema/800/600', count: 2 },
  { id: 'kakinada', name: 'Kakinada', region: 'Coastal AP', image: 'https://picsum.photos/seed/kakinada/800/600', count: 3 },
  { id: 'ntr', name: 'NTR District', region: 'Central AP', image: 'https://picsum.photos/seed/vijayawada/800/600', count: 3 },
  { id: 'guntur', name: 'Guntur', region: 'Central AP', image: 'https://picsum.photos/seed/guntur/800/600', count: 2 },
  { id: 'nandyal', name: 'Nandyal', region: 'Rayalaseema', image: 'https://picsum.photos/seed/srisailam/800/600', count: 2 },
];

export default function LocationsPage() {
  const [search, setSearchTerm] = useState('');

  const filtered = AP_DISTRICTS.filter(c => 
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
            <Globe className="w-3.5 h-3.5" /> Sunrise State
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">Explore Districts</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed">
            Discover the diverse regions of Andhra Pradesh, from Rayalaseema to the Coastal Belt.
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
            <Link href={`/destinations?search=${district.name}`}>
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
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">{district.region}</p>
                    <h3 className="text-3xl font-bold tracking-tight">{district.name}</h3>
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
