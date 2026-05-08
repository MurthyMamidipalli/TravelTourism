
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
  { id: 'paris', name: 'Paris', country: 'France', type: 'City', image: 'https://picsum.photos/seed/paris/400/300' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', type: 'City', image: 'https://picsum.photos/seed/tokyo/400/300' },
  { id: 'france', name: 'France', region: 'Europe', type: 'Country', image: 'https://picsum.photos/seed/france/400/300' },
  { id: 'eiffel', name: 'Eiffel Tower', city: 'Paris', type: 'Attraction', image: 'https://picsum.photos/seed/eiffel/400/300' },
  { id: 'sensoji', name: 'Senso-ji', city: 'Tokyo', type: 'Attraction', image: 'https://picsum.photos/seed/sensoji/400/300' },
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
      const filtered = allData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item as any).country?.toLowerCase().includes(query.toLowerCase()) ||
        (item as any).city?.toLowerCase().includes(query.toLowerCase())
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
            placeholder="Type anything... (e.g. Paris, Japan, Eiffel)" 
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
              <Link href={item.type === 'Country' ? `/countries/${item.id}` : item.type === 'City' ? `/cities/${item.id}` : `/attractions/${item.id}`}>
                <Card className="premium-card overflow-hidden group">
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
                        <MapPin className="w-3 h-3" /> 
                        {(item as any).country || (item as any).city || (item as any).region}
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
