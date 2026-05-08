
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCountries = [
  { id: 'france', name: 'France', code: 'FR', region: 'Europe', image: 'https://picsum.photos/seed/france/800/600', cities: 12 },
  { id: 'japan', name: 'Japan', code: 'JP', region: 'Asia', image: 'https://picsum.photos/seed/japan/800/600', cities: 8 },
  { id: 'italy', name: 'Italy', code: 'IT', region: 'Europe', image: 'https://picsum.photos/seed/italy/800/600', cities: 15 },
  { id: 'india', name: 'India', code: 'IN', region: 'Asia', image: 'https://picsum.photos/seed/india/800/600', cities: 20 },
  { id: 'brazil', name: 'Brazil', code: 'BR', region: 'South America', image: 'https://picsum.photos/seed/brazil/800/600', cities: 10 },
  { id: 'usa', name: 'United States', code: 'US', region: 'North America', image: 'https://picsum.photos/seed/usa/800/600', cities: 25 },
];

export default function LocationsPage() {
  const [search, setSearch] = useState('');

  const filtered = mockCountries.filter(c => 
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
          <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1">Global Directory</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white">Discover Countries</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed">
            From the historic streets of Europe to the vibrant cultures of Asia, explore the world's most incredible destinations.
          </p>
        </motion.div>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by country or region..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border-none text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((country, idx) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <Link href={`/countries/${country.id}`}>
              <Card className="premium-card overflow-hidden h-full">
                <div className="relative h-64">
                  <Image 
                    src={country.image} 
                    alt={country.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">{country.region}</p>
                    <h3 className="text-3xl font-bold">{country.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{country.cities} Major Cities</span>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Globe className="w-16 h-16 text-muted mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground text-xl">No countries found matching your search.</p>
        </div>
      )}
    </div>
  );
}
