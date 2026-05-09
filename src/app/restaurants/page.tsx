
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const restaurantData = [
  { id: 'rest-1', name: 'Paradise Biryani', city: 'Visakhapatnam', cuisine: 'Famous Biryani', itinerary: '1 Day' },
  { id: 'rest-2', name: 'Dharani Restaurant', city: 'Vijayawada', cuisine: 'South Indian Meals', itinerary: '1 Day' },
  { id: 'rest-3', name: 'Sri Sairam Parlour', city: 'Tirupati', cuisine: 'Tiffins & Dosa', itinerary: 'Half Day' },
  { id: 'rest-4', name: 'Spicy Venue', city: 'Vizag', cuisine: 'Andhra Cuisine', itinerary: '1 Day' },
  { id: 'rest-5', name: 'R&G Restaurant', city: 'Guntur', cuisine: 'Seafood', itinerary: '1 Day' },
  { id: 'rest-6', name: 'Kritunga', city: 'Vijayawada', cuisine: 'Spicy Andhra Food', itinerary: '1 Day' },
  { id: 'rest-7', name: 'Ulavacharu', city: 'Vizag', cuisine: 'Traditional Andhra', itinerary: '1 Day' },
  { id: 'rest-8', name: 'Hotel Sarovar', city: 'Kurnool', cuisine: 'Veg Meals', itinerary: 'Half Day' },
  { id: 'rest-9', name: 'Aha Emi Ruchi', city: 'Rajahmundry', cuisine: 'Family Dining', itinerary: '1 Day' },
  { id: 'rest-10', name: 'Mourya Inn', city: 'Kadapa', cuisine: 'Multi Cuisine', itinerary: '1 Day' },
  { id: 'rest-11', name: 'Mekong Restaurant', city: 'Vizag', cuisine: 'Asian Cuisine', itinerary: '1 Day' },
  { id: 'rest-12', name: 'Food Ex', city: 'Tirupati', cuisine: 'Fast Food', itinerary: 'Half Day' },
  { id: 'rest-13', name: 'Abhiruchi Hotel', city: 'Anantapur', cuisine: 'Andhra Meals', itinerary: '1 Day' },
  { id: 'rest-14', name: 'Hotel Daspalla', city: 'Vizag', cuisine: 'Luxury Dining', itinerary: '2 Days' },
  { id: 'rest-15', name: 'Barbeque Nation', city: 'Vijayawada', cuisine: 'Buffet', itinerary: '1 Day' },
  { id: 'rest-16', name: 'The Square', city: 'Guntur', cuisine: 'Fine Dining', itinerary: '1 Day' },
  { id: 'rest-17', name: 'Hotel Mayura', city: 'Srikakulam', cuisine: 'Veg & Non Veg', itinerary: '1 Day' },
  { id: 'rest-18', name: 'Sai Priya Beach Resort Restaurant', city: 'Vizag', cuisine: 'Beachside Dining', itinerary: '2 Days' },
  { id: 'rest-19', name: 'Ajantha Restaurant', city: 'Nellore', cuisine: 'Traditional Meals', itinerary: '1 Day' },
  { id: 'rest-20', name: 'Rayalaseema Ruchulu', city: 'Kurnool', cuisine: 'Rayalaseema Food', itinerary: '1 Day' },
  { id: 'rest-21', name: 'Minerva Coffee Shop', city: 'Tirupati', cuisine: 'Coffee & Snacks', itinerary: 'Half Day' },
  { id: 'rest-22', name: 'Green Park Restaurant', city: 'Vizag', cuisine: 'Luxury Dining', itinerary: '2 Days' },
  { id: 'rest-23', name: 'KFC', city: 'Vijayawada', cuisine: 'Fast Food', itinerary: 'Half Day' },
  { id: 'rest-24', name: 'Domino\'s Pizza', city: 'Guntur', cuisine: 'Pizza', itinerary: 'Half Day' },
  { id: 'rest-25', name: 'Sweet Magic', city: 'Vijayawada', cuisine: 'Sweets & Snacks', itinerary: 'Half Day' },
];

export default function RestaurantsPage() {
  const [search, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return restaurantData;
    const lower = search.toLowerCase();
    return restaurantData.filter(r => 
      r.name.toLowerCase().includes(lower) || 
      r.city.toLowerCase().includes(lower) ||
      r.cuisine.toLowerCase().includes(lower)
    );
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4">
          <Badge className="bg-accent/10 text-accent border-none px-4 py-1 flex items-center gap-1.5 mx-auto w-fit">
            <Utensils className="w-3.5 h-3.5" /> Culinary Delights
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-headline">AP Restaurants</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Savor authentic flavors of Andhra Pradesh.
          </p>
        </div>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search name, city or cuisine..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border-none text-lg focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((rest, idx) => {
            const imgData = PlaceHolderImages.find(img => img.id === rest.id) || PlaceHolderImages[0];
            return (
              <motion.div
                key={rest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.1) }}
              >
                <Card className="premium-card overflow-hidden h-full group flex flex-col border-none bg-white dark:bg-zinc-900 shadow-sm">
                  <div className="relative h-56 bg-secondary aspect-video overflow-hidden">
                    <Image 
                      src={imgData.imageUrl} 
                      alt={rest.name} 
                      fill 
                      priority={idx < 4}
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      data-ai-hint={imgData.imageHint}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white right-4">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{rest.cuisine}</p>
                      <h3 className="text-xl font-bold tracking-tight line-clamp-1">{rest.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3 flex flex-col flex-grow">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{rest.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>{rest.itinerary}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <Badge variant="secondary" className="bg-secondary/50 text-primary border-none text-[10px] font-bold">
                        {rest.cuisine}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 bg-secondary/10 rounded-3xl border border-dashed">
          <Utensils className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-headline">No restaurants found</h3>
        </div>
      )}
    </div>
  );
}
