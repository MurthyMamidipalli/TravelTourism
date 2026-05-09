
'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const allDestinations = [
  // Hyderabad
  { id: 'charminar', name: 'Charminar', districtId: 'hyderabad', district: 'Hyderabad', itinerary: 'Half Day', category: 'Heritage' },
  { id: 'golconda-fort', name: 'Golconda Fort', districtId: 'hyderabad', district: 'Hyderabad', itinerary: '1 Day', category: 'Heritage' },
  { id: 'ramoji-film-city', name: 'Ramoji Film City', districtId: 'hyderabad', district: 'Hyderabad', itinerary: '1 Day', category: 'Entertainment' },
  { id: 'hussain-sagar', name: 'Hussain Sagar', districtId: 'hyderabad', district: 'Hyderabad', itinerary: 'Half Day', category: 'Nature' },
  { id: 'salar-jung', name: 'Salar Jung Museum', districtId: 'hyderabad', district: 'Hyderabad', itinerary: '1 Day', category: 'Museum' },
  { id: 'birla-mandir', name: 'Birla Mandir', districtId: 'hyderabad', district: 'Hyderabad', itinerary: 'Half Day', category: 'Pilgrimage' },
  // Warangal
  { id: 'ramappa-temple', name: 'Ramappa Temple', districtId: 'warangal', district: 'Warangal', itinerary: '1 Day', category: 'Heritage' },
  { id: 'thousand-pillar', name: 'Thousand Pillar Temple', districtId: 'warangal', district: 'Warangal', itinerary: 'Half Day', category: 'Heritage' },
  // Adilabad
  { id: 'kuntala-falls', name: 'Kuntala Falls', districtId: 'adilabad', district: 'Adilabad', itinerary: '1 Day', category: 'Nature' },
  { id: 'pochera-falls', name: 'Pochera Falls', districtId: 'adilabad', district: 'Adilabad', itinerary: '1 Day', category: 'Nature' },
  // Others
  { id: 'nagarjuna-sagar', name: 'Nagarjuna Sagar', districtId: 'nalgonda', district: 'Nalgonda', itinerary: '1 Day', category: 'Nature' },
  { id: 'bhadrachalam', name: 'Bhadrachalam Temple', districtId: 'bhadradri', district: 'Bhadradri Kothagudem', itinerary: '1 Day', category: 'Pilgrimage' },
  { id: 'ananthagiri-ts', name: 'Ananthagiri Hills', districtId: 'vikarabad', district: 'Vikarabad', itinerary: '1 Day', category: 'Nature' },
  { id: 'bogatha-falls', name: 'Bogatha Falls', districtId: 'khammam', district: 'Khammam', itinerary: '1 Day', category: 'Nature' },
  { id: 'laknavaram', name: 'Laknavaram Lake', districtId: 'mulugu', district: 'Mulugu', itinerary: '1 Day', category: 'Nature' },
];

export default function TSDistrictPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const filteredDestinations = useMemo(() => {
    return allDestinations.filter(d => d.districtId === id);
  }, [id]);

  const districtName = useMemo(() => {
    return id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <Link href="/locations/telangana" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> All Districts
        </Link>
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore {districtName}</h1>
            <p className="text-muted-foreground text-xl">Top landmarks and curated destinations in this region.</p>
          </div>
          <Link href={`/guides?search=${id}`}>
            <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20">Find Local Guides</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: idx * 0.05 }}
              >
                <Link href={`/destinations/${dest.id}`}>
                  <Card className="premium-card group h-full overflow-hidden flex flex-col">
                    <div className="relative h-48">
                      <Image 
                        src={`https://picsum.photos/seed/${dest.id}/600/400`} 
                        alt={dest.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-white/90 text-primary border-none font-bold">{dest.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline text-lg font-bold mb-2 line-clamp-1">{dest.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" /> {dest.itinerary}
                        </div>
                      </div>
                      <div className="pt-4 border-t mt-4 flex items-center justify-between text-primary font-bold">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-secondary/10 rounded-3xl border border-dashed">
              <p className="text-muted-foreground">No specific destinations listed for this district yet.</p>
              <Link href="/destinations">
                <Button variant="link" className="mt-2">Browse All Destinations</Button>
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
