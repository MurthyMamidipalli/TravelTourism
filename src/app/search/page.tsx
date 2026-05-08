
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Globe, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const allData = [
  // Countries
  { id: 'france', name: 'France', region: 'Europe', type: 'Country', image: 'https://picsum.photos/seed/france/400/300' },
  { id: 'japan', name: 'Japan', region: 'Asia', type: 'Country', image: 'https://picsum.photos/seed/japan/400/300' },
  { id: 'italy', name: 'Italy', region: 'Europe', type: 'Country', image: 'https://picsum.photos/seed/italy/400/300' },
  { id: 'india', name: 'India', region: 'Asia', type: 'Country', image: 'https://picsum.photos/seed/india/400/300' },
  { id: 'usa', name: 'United States', region: 'North America', type: 'Country', image: 'https://picsum.photos/seed/usa/400/300' },
  { id: 'uk', name: 'United Kingdom', region: 'Europe', type: 'Country', image: 'https://picsum.photos/seed/uk/400/300' },
  { id: 'peru', name: 'Peru', region: 'South America', type: 'Country', image: 'https://picsum.photos/seed/peru/400/300' },
  { id: 'greece', name: 'Greece', region: 'Europe', type: 'Country', image: 'https://picsum.photos/seed/greece/400/300' },
  
  // Cities & Attractions
  { id: 'paris', name: 'Paris', country: 'France', type: 'City', image: 'https://picsum.photos/seed/paris/400/300' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', type: 'City', image: 'https://picsum.photos/seed/tokyo/400/300' },
  { id: 'rome', name: 'Rome', country: 'Italy', type: 'City', image: 'https://picsum.photos/seed/rome/400/300' },
  { id: 'london', name: 'London', country: 'UK', type: 'City', image: 'https://picsum.photos/seed/london/400/300' },
  { id: 'agra', name: 'Agra', country: 'India', type: 'City', image: 'https://picsum.photos/seed/agra/400/300' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', type: 'City', image: 'https://picsum.photos/seed/dubai/400/300' },
  { id: 'venice', name: 'Venice', country: 'Italy', type: 'City', image: 'https://picsum.photos/seed/venice/400/300' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', type: 'City', image: 'https://picsum.photos/seed/barcelona/400/300' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', type: 'Attraction', image: 'https://picsum.photos/seed/bali/400/300' },
  { id: 'machu-picchu', name: 'Machu Picchu', country: 'Peru', type: 'Attraction', image: 'https://picsum.photos/seed/machu/400/300' },
  { id: 'grand-canyon', name: 'Grand Canyon', country: 'USA', type: 'Attraction', image: 'https://picsum.photos/seed/grandcanyon/400/300' },
  { id: 'petra', name: 'Petra', country: 'Jordan', type: 'Attraction', image: 'https://picsum.photos/seed/petra/400/300' },
  { id: 'santorini', name: 'Santorini', country: 'Greece', type: 'Attraction', image: 'https://picsum.photos/seed/santorini/400/300' },
  { id: 'new-york', name: 'New York City', country: 'USA', type: 'City', image: 'https://picsum.photos/seed/ny/400/300' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', type: 'City', image: 'https://picsum.photos/seed/sydney/400/300' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', type: 'City', image: 'https://picsum.photos/seed/cairo/400/300' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', type: 'City', image: 'https://picsum.photos/seed/kyoto/400/300' },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', type: 'City', image: 'https://picsum.photos/seed/rio/400/300' },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', type: 'City', image: 'https://picsum.photos/seed/capetown/400/300' },
  { id: 'amalapuram', name: 'Amalapuram', country: 'India', type: 'City', image: 'https://picsum.photos/seed/amalapuram/400/300' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(allData);

  useEffect(() => {
    if (!query) {
      setResults(allData);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = allData.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) ||
        (item as any).country?.toLowerCase().includes(lowerQuery) ||
        (item as any).city?.toLowerCase().includes(lowerQuery) ||
        (item as any).region?.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-none">Global Discovery</Badge>
          <h1 className="text-4xl md:text-6xl font-bold">Find Your Next Adventure</h1>
          <p className="text-muted-foreground text-lg">Search across countries, cities, and world-famous landmarks.</p>
        </div>

        <div className="relative group max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search city, country or place..." 
            className="pl-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border-none text-xl placeholder:text-muted-foreground/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {results.map((item, idx) => {
            const detailPath = item.type === 'Country' 
              ? `/countries/${item.id}` 
              : item.type === 'City' 
                ? `/cities/${item.id}` 
                : `/destinations/${item.id}`;

            return (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={detailPath}>
                  <Card className="premium-card overflow-hidden group h-full">
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                            {item.type}
                          </Badge>
                          <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-accent" /> 
                          {(item as any).country || (item as any).region || 'Location'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-muted" />
            </div>
            <p className="text-muted-foreground text-lg">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
