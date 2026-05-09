
'use client';

import { use, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Clock, Search, Utensils, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const restaurantData = [
  { id: 'rest-1', name: 'Paradise Biryani', cityId: 'vizag', city: 'Visakhapatnam', cuisine: 'Famous Biryani', itinerary: '1 Day' },
  { id: 'rest-2', name: 'Dharani Restaurant', cityId: 'ntr', city: 'Vijayawada', cuisine: 'South Indian Meals', itinerary: '1 Day' },
  { id: 'rest-3', name: 'Sri Sairam Parlour', cityId: 'tirupati', city: 'Tirupati', cuisine: 'Tiffins & Dosa', itinerary: 'Half Day' },
  { id: 'rest-4', name: 'Spicy Venue', cityId: 'vizag', city: 'Vizag', cuisine: 'Andhra Cuisine', itinerary: '1 Day' },
  { id: 'rest-5', name: 'R&G Restaurant', cityId: 'guntur', city: 'Guntur', cuisine: 'Seafood', itinerary: '1 Day' },
  { id: 'rest-6', name: 'Kritunga', cityId: 'ntr', city: 'Vijayawada', cuisine: 'Spicy Andhra Food', itinerary: '1 Day' },
  { id: 'rest-7', name: 'Ulavacharu', cityId: 'vizag', city: 'Vizag', cuisine: 'Traditional Andhra', itinerary: '1 Day' },
  { id: 'rest-8', name: 'Hotel Sarovar', cityId: 'kurnool', city: 'Kurnool', cuisine: 'Veg Meals', itinerary: 'Half Day' },
  { id: 'rest-9', name: 'Aha Emi Ruchi', cityId: 'east-godavari', city: 'Rajahmundry', cuisine: 'Family Dining', itinerary: '1 Day' },
  { id: 'rest-11', name: 'Mekong Restaurant', cityId: 'vizag', city: 'Vizag', cuisine: 'Asian Cuisine', itinerary: '1 Day' },
  { id: 'rest-12', name: 'Food Ex', cityId: 'tirupati', city: 'Tirupati', cuisine: 'Fast Food', itinerary: 'Half Day' },
  { id: 'rest-13', name: 'Abhiruchi Hotel', cityId: 'anantapur', city: 'Anantapur', cuisine: 'Andhra Meals', itinerary: '1 Day' },
  { id: 'rest-14', name: 'Hotel Daspalla', cityId: 'vizag', city: 'Vizag', cuisine: 'Luxury Dining', itinerary: '2 Days' },
  { id: 'rest-15', name: 'Barbeque Nation', cityId: 'ntr', city: 'Vijayawada', cuisine: 'Buffet', itinerary: '1 Day' },
  { id: 'rest-16', name: 'The Square', cityId: 'guntur', city: 'Guntur', cuisine: 'Fine Dining', itinerary: '1 Day' },
  { id: 'rest-18', name: 'Sai Priya Beach', cityId: 'vizag', city: 'Vizag', cuisine: 'Beachside Dining', itinerary: '2 Days' },
  { id: 'rest-19', name: 'Ajantha Restaurant', cityId: 'nellore', city: 'Nellore', cuisine: 'Traditional Meals', itinerary: '1 Day' },
  { id: 'rest-20', name: 'Rayalaseema Ruchulu', cityId: 'kurnool', city: 'Kurnool', cuisine: 'Rayalaseema Food', itinerary: '1 Day' },
  { id: 'rest-21', name: 'Minerva Coffee Shop', cityId: 'tirupati', city: 'Tirupati', cuisine: 'Coffee & Snacks', itinerary: 'Half Day' },
  { id: 'rest-22', name: 'Green Park', cityId: 'vizag', city: 'Vizag', cuisine: 'Luxury Dining', itinerary: '2 Days' },
];

export default function DistrictRestaurantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = restaurantData.filter(r => r.cityId === id);
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
        <Link href="/restaurants/andhra-pradesh" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> All Regions
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Dining in {districtName}</h1>
            <p className="text-muted-foreground text-xl">Top-rated culinary spots selected for you.</p>
          </div>
          <div className="relative group w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary" />
            <Input 
              placeholder="Search cuisine..." 
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
                <Card className="premium-card group h-full overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <Image 
                      src={`https://picsum.photos/seed/${rest.id}/600/400`} 
                      alt={rest.name} 
                      fill 
                      priority={idx < 4}
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white/90 text-primary border-none font-bold">{rest.cuisine}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-headline text-lg font-bold mb-1 line-clamp-1">{rest.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-accent" /> {rest.city}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {rest.itinerary}
                      </div>
                    </div>
                    <div className="pt-4 border-t mt-4 flex items-center justify-between text-primary font-bold">
                      <span className="text-xs uppercase tracking-widest font-black">View Menu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
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
