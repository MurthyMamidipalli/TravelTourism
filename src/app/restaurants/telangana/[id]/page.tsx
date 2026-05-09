
'use client';

import { use, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Search, Utensils, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tsRestaurantData = [
  // Hyderabad
  { id: 'ts-rest-1', name: 'Paradise Biryani', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Biryani', category: 'Biryani' },
  { id: 'ts-rest-2', name: 'Cafe Bahar', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Biryani', category: 'Biryani' },
  { id: 'ts-rest-3', name: 'Shah Ghouse', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Biryani', category: 'Biryani' },
  { id: 'ts-rest-4', name: 'Bawarchi', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Multi Cuisine', category: 'Multi Cuisine' },
  { id: 'ts-rest-5', name: 'Pista House', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Bakery & Haleem', category: 'Bakery' },
  { id: 'ts-rest-6', name: 'Chutneys', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'South Indian', category: 'South Indian' },
  { id: 'ts-rest-7', name: 'Barbeque Nation', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Buffet', category: 'Buffet' },
  { id: 'ts-rest-8', name: 'Absolute Barbecues', cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Buffet', category: 'Buffet' },
  { id: 'ts-rest-9', name: "Ohri's Jiva Imperia", cityId: 'hyderabad', city: 'Hyderabad', cuisine: 'Fine Dining Veg', category: 'Fine Dining' },
  // Warangal
  { id: 'ts-rest-10', name: 'Kakatiya Grand', cityId: 'warangal', city: 'Warangal', cuisine: 'Multi Cuisine', category: 'Multi Cuisine' },
  { id: 'ts-rest-11', name: 'Vaishnavi Restaurant', cityId: 'warangal', city: 'Warangal', cuisine: 'Vegetarian', category: 'Veg' },
  // Karimnagar
  { id: 'ts-rest-12', name: 'Hotel Swetha', cityId: 'karimnagar', city: 'Karimnagar', cuisine: 'Multi Cuisine', category: 'Multi Cuisine' },
  { id: 'ts-rest-13', name: 'Blue Fox Restaurant', cityId: 'karimnagar', city: 'Karimnagar', cuisine: 'Family Dining', category: 'Family Restaurant' },
  // Nizamabad
  { id: 'ts-rest-14', name: 'Hotel Kapila', cityId: 'nizamabad', city: 'Nizamabad', cuisine: 'South Indian', category: 'South Indian' },
  { id: 'ts-rest-15', name: 'Spicy Hub', cityId: 'nizamabad', city: 'Nizamabad', cuisine: 'Chinese', category: 'Chinese' },
  // Khammam
  { id: 'ts-rest-16', name: 'Sri Krishna Vilas', cityId: 'khammam', city: 'Khammam', cuisine: 'Vegetarian', category: 'Veg' },
  { id: 'ts-rest-17', name: 'Royal Family Restaurant', cityId: 'khammam', city: 'Khammam', cuisine: 'Biryani', category: 'Biryani' },
  // Others
  { id: 'ts-rest-18', name: 'Mayuri Restaurant', cityId: 'mahabubnagar', city: 'Mahabubnagar', cuisine: 'Family Dining', category: 'Family Restaurant' },
  { id: 'ts-rest-19', name: 'Food Plaza', cityId: 'adilabad', city: 'Adilabad', cuisine: 'Fast Food', category: 'Fast Food' },
  { id: 'ts-rest-20', name: 'Sai Ram Hotel', cityId: 'medak', city: 'Medak', cuisine: 'South Indian', category: 'South Indian' },
  { id: 'ts-rest-21', name: 'Green Bawarchi', cityId: 'sangareddy', city: 'Sangareddy', cuisine: 'Biryani', category: 'Biryani' },
  { id: 'ts-rest-22', name: 'Hill View Restaurant', cityId: 'vikarabad', city: 'Vikarabad', cuisine: 'Family Dining', category: 'Family Restaurant' },
  { id: 'ts-rest-23', name: 'Suruchi Restaurant', cityId: 'nalgonda', city: 'Nalgonda', cuisine: 'Vegetarian', category: 'Veg' },
  { id: 'ts-rest-24', name: 'Spice Garden', cityId: 'jagtial', city: 'Jagtial', cuisine: 'Chinese', category: 'Chinese' },
  { id: 'ts-rest-25', name: 'Grand Restaurant', cityId: 'mancherial', city: 'Mancherial', cuisine: 'Multi Cuisine', category: 'Multi Cuisine' },
  { id: 'ts-rest-26', name: 'Annapurna Hotel', cityId: 'siddipet', city: 'Siddipet', cuisine: 'Vegetarian', category: 'Veg' },
  { id: 'ts-rest-27', name: 'New Taj Restaurant', cityId: 'kamareddy', city: 'Kamareddy', cuisine: 'Biryani', category: 'Biryani' },
  { id: 'ts-rest-28', name: 'Temple View Restaurant', cityId: 'yadadri', city: 'Yadadri', cuisine: 'South Indian', category: 'South Indian' },
  { id: 'ts-rest-29', name: 'Godavari Restaurant', cityId: 'bhadradri', city: 'Bhadradri Kothagudem', cuisine: 'Seafood', category: 'Seafood' },
  { id: 'ts-rest-30', name: 'Village Treat', cityId: 'nagarkurnool', city: 'Nagarkurnool', cuisine: 'Traditional', category: 'Traditional' },
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
        r.category.toLowerCase().includes(lower) ||
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
            <p className="text-muted-foreground text-xl">Top-rated culinary spots selected for you.</p>
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
                      <Badge className="bg-white/90 text-primary border-none font-bold">{rest.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-headline text-lg font-bold mb-1 line-clamp-1">{rest.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-accent" /> {rest.city}
                      </div>
                      <p className="text-xs text-muted-foreground italic">{rest.cuisine}</p>
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
