
'use client';

import { use, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Search, Utensils, ArrowRight, Navigation, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tsRestaurantData = [
  { id: 'ts-rest-1', name: 'Paradise Biryani', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Biryani', timings: '11AM-11PM', lat: 17.4437, lng: 78.4897 },
  { id: 'ts-rest-2', name: 'Cafe Bahar', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Biryani', timings: '11AM-12AM', lat: 17.3977, lng: 78.4831 },
  { id: 'ts-rest-3', name: 'Shah Ghouse', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Biryani', timings: '12PM-1AM', lat: 17.3600, lng: 78.4735 },
  { id: 'ts-rest-4', name: 'Bawarchi', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Multi Cuisine', timings: '12PM-11PM', lat: 17.4024, lng: 78.4900 },
  { id: 'ts-rest-5', name: 'Pista House', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Bakery & Haleem', timings: '10AM-11PM', lat: 17.3600, lng: 78.4735 },
  { id: 'ts-rest-6', name: 'Chutneys', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'South Indian', timings: '7AM-11PM', lat: 17.4241, lng: 78.4485 },
  { id: 'ts-rest-10', name: 'Kakatiya Grand', cityId: 'warangal', city: 'Warangal', cuisine: 'Multi Cuisine', timings: '11AM-10PM', lat: 17.9689, lng: 79.5941 },
];

export default function TSDistrictRestaurantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = tsRestaurantData.filter(r => r.cityId === id);
    if (search.trim()) {
      const lower = search.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(lower) || 
        r.cuisine.toLowerCase().includes(lower)
      );
    }
    return list;
  }, [id, search]);

  const districtName = useMemo(() => {
    return id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      <div className="space-y-4">
        <Link href="/restaurants/telangana" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Telangana Regions
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Dining in {districtName}</h1>
            <p className="text-muted-foreground text-xl">Interactive restaurant maps and local flavors.</p>
          </div>
          <div className="relative group w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary" />
            <Input 
              placeholder="Search cuisine or name..." 
              className="pl-10 h-12 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((rest, idx) => (
              <motion.div
                key={rest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.05 }}
              >
                <Link href={`/restaurants/details/${rest.id}`}>
                  <Card className="premium-card group h-full overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all border-none">
                    <div className="relative h-48">
                      <Image 
                        src={`https://picsum.photos/seed/${rest.id}/600/400`} 
                        alt={rest.name} 
                        fill 
                        priority={idx < 4}
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-primary border-none font-bold shadow-sm">{rest.cuisine}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 flex-grow flex flex-col justify-between bg-white dark:bg-zinc-900">
                      <div className="space-y-2">
                        <h3 className="font-headline text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{rest.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-accent" /> {rest.city}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {rest.timings}
                        </div>
                      </div>
                      <div className="pt-4 border-t mt-4 flex items-center justify-between text-primary font-bold">
                        <span className="text-[10px] uppercase tracking-widest font-black flex items-center gap-1">
                          <Navigation className="w-3 h-3" /> View Location
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-secondary/10 rounded-3xl border border-dashed">
              <Utensils className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No matches for "{search}" found in this area.</p>
              <Button variant="link" className="mt-2" onClick={() => setSearch('')}>Clear search</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
