
'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const allDestinations = [
  { id: 'tirumala-temple', name: 'Tirumala Temple', districtId: 'tirupati', district: 'Tirupati', itinerary: '2 Days', category: 'Pilgrimage' },
  { id: 'sri-kalahasti', name: 'Sri Kalahasti', districtId: 'tirupati', district: 'Tirupati', itinerary: '1 Day', category: 'Pilgrimage' },
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', districtId: 'tirupati', district: 'Tirupati', itinerary: '1 Day', category: 'Nature' },
  { id: 'chandragiri-fort', name: 'Chandragiri Fort', districtId: 'tirupati', district: 'Tirupati', itinerary: 'Half Day', category: 'Heritage' },
  { id: 'vizag', name: 'Visakhapatnam (Vizag)', districtId: 'vizag', district: 'Visakhapatnam', itinerary: '3 Days', category: 'City' },
  { id: 'rk-beach', name: 'RK Beach', districtId: 'vizag', district: 'Vizag', itinerary: 'Half Day', category: 'Beach' },
  { id: 'kailasagiri', name: 'Kailasagiri', districtId: 'vizag', district: 'Vizag', itinerary: 'Half Day', category: 'Park' },
  { id: 'ins-kurusura', name: 'INS Kurusura Museum', districtId: 'vizag', district: 'Vizag', itinerary: 'Half Day', category: 'Museum' },
  { id: 'yarada-beach', name: 'Yarada Beach', districtId: 'vizag', district: 'Vizag', itinerary: '1 Day', category: 'Beach' },
  { id: 'simhachalam-temple', name: 'Simhachalam Temple', districtId: 'vizag', district: 'Vizag', itinerary: 'Half Day', category: 'Pilgrimage' },
  { id: 'araku-valley', name: 'Araku Valley', districtId: 'asr', district: 'ASR District', itinerary: '2 Days', category: 'Hill Station' },
  { id: 'borra-caves', name: 'Borra Caves', districtId: 'asr', district: 'Araku', itinerary: '1 Day', category: 'Nature' },
  { id: 'lambasingi', name: 'Lambasingi', districtId: 'asr', district: 'ASR District', itinerary: '2 Days', category: 'Hill Station' },
  { id: 'papikondalu', name: 'Papikondalu', districtId: 'east-godavari', district: 'East Godavari', itinerary: '2 Days', category: 'Nature' },
  { id: 'rajahmundry', name: 'Rajahmundry', districtId: 'east-godavari', district: 'East Godavari', itinerary: '2 Days', category: 'City' },
  { id: 'konaseema', name: 'Konaseema', districtId: 'konaseema', district: 'Konaseema', itinerary: '2 Days', category: 'Backwaters' },
  { id: 'annavaram', name: 'Annavaram Temple', districtId: 'kakinada', district: 'Kakinada', itinerary: 'Half Day', category: 'Pilgrimage' },
  { id: 'vijayawada', name: 'Vijayawada', districtId: 'ntr', district: 'NTR District', itinerary: '2 Days', category: 'City' },
  { id: 'srisailam', name: 'Srisailam', districtId: 'nandyal', district: 'Nandyal', itinerary: '2 Days', category: 'Pilgrimage' },
];

export default function DistrictPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const filteredDestinations = useMemo(() => {
    return allDestinations.filter(d => d.districtId === id);
  }, [id]);

  const districtName = useMemo(() => {
    return id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
  }, [id]);

  const getCategoryImage = (dest: any) => {
    const found = PlaceHolderImages.find(img => img.id === dest.id);
    if (found) return { url: found.imageUrl, hint: found.imageHint };
    
    // Category Fallbacks
    switch(dest.category.toLowerCase()) {
      case 'pilgrimage': return { url: 'https://picsum.photos/seed/temple/600/400', hint: 'Hindu Temple' };
      case 'beach': return { url: 'https://picsum.photos/seed/beach/600/400', hint: 'Ocean Beach' };
      case 'nature': return { url: 'https://picsum.photos/seed/nature/600/400', hint: 'Waterfall Forest' };
      case 'city': return { url: 'https://picsum.photos/seed/city/600/400', hint: 'City Skyline' };
      default: return { url: `https://picsum.photos/seed/${dest.id}/600/400`, hint: 'Tourist Spot' };
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <Link href="/locations/andhra-pradesh" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> All Districts
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
            filteredDestinations.map((dest, idx) => {
              const imgData = getCategoryImage(dest);
              return (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.05 }}
                >
                  <Link href={`/destinations/${dest.id}`}>
                    <Card className="premium-card group h-full overflow-hidden flex flex-col">
                      <div className="relative h-48 overflow-hidden bg-secondary">
                        <Image 
                          src={imgData.url} 
                          alt={dest.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          data-ai-hint={imgData.hint}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-primary border-none font-bold shadow-sm">{dest.category}</Badge>
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
              );
            })
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
