'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const allData = [
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', type: 'Pilgrimage' },
  { id: 'sri-kalahasti', name: 'Sri Kalahasti', district: 'Tirupati', type: 'Pilgrimage' },
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', district: 'Tirupati', type: 'Nature' },
  { id: 'chandragiri-fort', name: 'Chandragiri Fort', district: 'Tirupati', type: 'Heritage' },
  { id: 'vizag', name: 'Visakhapatnam (Vizag)', district: 'Visakhapatnam', type: 'City' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Vizag', type: 'Beach' },
  { id: 'kailasagiri', name: 'Kailasagiri', district: 'Vizag', type: 'Park' },
  { id: 'ins-kurusura', name: 'INS Kurusura Museum', district: 'Vizag', type: 'Museum' },
  { id: 'yarada-beach', name: 'Yarada Beach', district: 'Vizag', type: 'Beach' },
  { id: 'simhachalam-temple', name: 'Simhachalam Temple', district: 'Vizag', type: 'Pilgrimage' },
  { id: 'araku-valley', name: 'Araku Valley', district: 'Araku', type: 'Hill Station' },
  { id: 'borra-caves', name: 'Borra Caves', district: 'Araku', type: 'Nature' },
  { id: 'ananthagiri-hills', name: 'Ananthagiri Hills', district: 'Vizag Region', type: 'Nature' },
  { id: 'lambasingi', name: 'Lambasingi', district: 'ASR District', type: 'Hill Station' },
  { id: 'katiki-waterfalls', name: 'Katiki Waterfalls', district: 'Araku', type: 'Nature' },
  { id: 'papikondalu', name: 'Papikondalu', district: 'East Godavari', type: 'Nature' },
  { id: 'rajahmundry', name: 'Rajahmundry', district: 'East Godavari', type: 'City' },
  { id: 'konaseema', name: 'Konaseema', district: 'Konaseema', type: 'Backwaters' },
  { id: 'maredumilli', name: 'Maredumilli', district: 'East Godavari', type: 'Forest' },
  { id: 'antarvedi', name: 'Antarvedi', district: 'Konaseema', type: 'Beach' },
  { id: 'draksharamam', name: 'Draksharamam Temple', district: 'East Godavari', type: 'Pilgrimage' },
  { id: 'annavaram', name: 'Annavaram Temple', district: 'Kakinada', type: 'Pilgrimage' },
  { id: 'kakinada-beach', name: 'Kakinada Beach', district: 'Kakinada', type: 'Beach' },
  { id: 'coringa-wildlife', name: 'Coringa Wildlife Sanctuary', district: 'Kakinada', type: 'Wildlife' },
  { id: 'vijayawada', name: 'Vijayawada', district: 'NTR District', type: 'City' },
  { id: 'kanaka-durga', name: 'Kanaka Durga Temple', district: 'Vijayawada', type: 'Pilgrimage' },
  { id: 'bhavani-island', name: 'Bhavani Island', district: 'Vijayawada', type: 'Island' },
  { id: 'undavalli-caves', name: 'Undavalli Caves', district: 'Guntur', type: 'Heritage' },
  { id: 'amaravati', name: 'Amaravati', district: 'Guntur', type: 'Heritage' },
  { id: 'nagarjuna-sagar', name: 'Nagarjuna Sagar', district: 'Palnadu', type: 'Dam' },
  { id: 'srisailam', name: 'Srisailam', district: 'Nandyal', type: 'Pilgrimage' },
  { id: 'srisailam-dam', name: 'Srisailam Dam', district: 'Nandyal', type: 'Dam' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return allData;
    const lowerQuery = query.toLowerCase();
    return allData.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.district.toLowerCase().includes(lowerQuery) ||
      item.type.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-none">Discover AP</Badge>
          <h1 className="text-4xl md:text-6xl font-bold">Search Local Places</h1>
          <p className="text-muted-foreground text-lg">Find the best tourist spots in Andhra Pradesh from our list of 32 wonders.</p>
        </div>

        <div className="relative group max-w-2xl mx-auto">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search place, district or type..." 
            className="pl-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border-none text-xl focus-visible:ring-primary/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <AnimatePresence mode="popLayout">
            {results.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
              >
                <Link href={`/destinations/${item.id}`}>
                  <Card className="premium-card overflow-hidden group h-full">
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary">
                        <Image 
                          src={`https://picsum.photos/seed/${item.id}/200/200`} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold">
                            {item.type}
                          </Badge>
                          <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-accent" /> {item.district}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {results.length === 0 && (
          <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed">
            <p className="text-muted-foreground text-lg">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}