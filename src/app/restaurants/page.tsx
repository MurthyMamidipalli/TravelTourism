
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, Utensils, Star } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const filtered = restaurantData.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.city.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-accent/10 text-accent border-none mb-4 px-4 py-1 flex items-center gap-1.5 mx-auto w-fit">
            <Utensils className="w-3.5 h-3.5" /> Culinary Delights
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">AP Restaurants</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Savor the authentic flavors of Andhra Pradesh. From spicy biryanis to traditional thalis.
          </p>
        </motion.div>

        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name, city or cuisine..." 
            className="pl-12 h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border-none text-lg focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((rest, idx) => {
          const imgData = PlaceHolderImages.find(img => img.id === rest.id) || PlaceHolderImages[0];
          return (
            <motion.div
              key={rest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="premium-card overflow-hidden h-full group flex flex-col">
                <div className="relative h-56">
                  <Image 
                    src={imgData.imageUrl} 
                    alt={rest.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    data-ai-hint={imgData.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white right-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{rest.cuisine}</p>
                    <h3 className="text-xl font-bold tracking-tight line-clamp-1">{rest.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-black">4.5</span>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4 flex flex-col flex-grow bg-white dark:bg-zinc-900">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>{rest.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Suggested: {rest.itinerary}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Badge variant="secondary" className="bg-secondary/50 text-primary border-none text-[10px] font-bold">
                      {rest.cuisine}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-muted-foreground/30">
          <Utensils className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-headline">No restaurants found</h3>
          <p className="text-muted-foreground mt-2">Try searching with a different keyword.</p>
        </div>
      )}
    </div>
  );
}
