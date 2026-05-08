
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
  { id: 'taj-mahal', name: 'Taj Mahal', country: 'India', type: 'Monument', image: 'https://picsum.photos/seed/tajmahal/400/300' },
  { id: 'eiffel-tower', name: 'Eiffel Tower', country: 'France', type: 'Landmark', image: 'https://picsum.photos/seed/eiffel/400/300' },
  { id: 'machu-picchu', name: 'Machu Picchu', country: 'Peru', type: 'Adventure', image: 'https://picsum.photos/seed/machu/400/300' },
  { id: 'great-wall', name: 'Great Wall', country: 'China', type: 'Heritage', image: 'https://picsum.photos/seed/greatwall/400/300' },
  { id: 'santorini', name: 'Santorini', country: 'Greece', type: 'Romance', image: 'https://picsum.photos/seed/santorini/400/300' },
  { id: 'colosseum', name: 'Colosseum', country: 'Italy', type: 'History', image: 'https://picsum.photos/seed/colosseum/400/300' },
  { id: 'serengeti', name: 'Serengeti', country: 'Tanzania', type: 'Wildlife', image: 'https://picsum.photos/seed/serengeti/400/300' },
  { id: 'angkor-wat', name: 'Angkor Wat', country: 'Cambodia', type: 'Heritage', image: 'https://picsum.photos/seed/angkor/400/300' },
  { id: 'petra', name: 'Petra', country: 'Jordan', type: 'Desert', image: 'https://picsum.photos/seed/petra/400/300' },
  { id: 'niagara-falls', name: 'Niagara Falls', country: 'Canada/USA', type: 'Nature', image: 'https://picsum.photos/seed/niagara/400/300' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', type: 'Culture', image: 'https://picsum.photos/seed/bali/400/300' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', type: 'Culture', image: 'https://picsum.photos/seed/kyoto/400/300' },
  { id: 'nyc', name: 'New York City', country: 'USA', type: 'Urban', image: 'https://picsum.photos/seed/nyc/400/300' },
  { id: 'patagonia', name: 'Patagonia', country: 'Argentina/Chile', type: 'Nature', image: 'https://picsum.photos/seed/patagonia/400/300' },
  { id: 'maldives', name: 'Maldives', country: 'Maldives', type: 'Luxury', image: 'https://picsum.photos/seed/maldives/400/300' },
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
        item.country.toLowerCase().includes(lowerQuery) ||
        item.type.toLowerCase().includes(lowerQuery)
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
          <Badge className="bg-primary/10 text-primary border-none">World Discovery</Badge>
          <h1 className="text-4xl md:text-6xl font-bold">Search the 15 Wonders</h1>
          <p className="text-muted-foreground text-lg">Find details on your next dream destination from our exclusive list.</p>
        </div>

        <div className="relative group max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search place, country or type..." 
            className="pl-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border-none text-xl placeholder:text-muted-foreground/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {results.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/destinations/${item.id}`}>
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
                        <MapPin className="w-3 h-3 text-accent" /> {item.country}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
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
