
'use client';

import { use, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, ArrowRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TouristCard from '@/components/TouristCard';

const allDestinations = [
  { id: 'charminar', name: 'Charminar', districtId: 'hyderabad', district: 'Hyderabad', category: 'Heritage', rating: 4.8, timings: '9AM-5:30PM', entryFee: '₹25', desc: 'Iconic 16th century mosque and landmark.' },
  { id: 'golconda-fort', name: 'Golconda Fort', districtId: 'hyderabad', district: 'Hyderabad', category: 'Heritage', rating: 4.9, timings: '9AM-5PM', entryFee: '₹25', desc: 'Historic citadel and former capital of Qutb Shahis.' },
  { id: 'ramappa-temple', name: 'Ramappa Temple', districtId: 'warangal', district: 'Warangal', category: 'Heritage', rating: 4.9, timings: '6AM-6PM', entryFee: 'Free', desc: 'UNESCO World Heritage site with exquisite carving.' },
  { id: 'kuntala-falls', name: 'Kuntala Falls', districtId: 'adilabad', district: 'Adilabad', category: 'Nature', rating: 4.7, timings: '6AM-6PM', entryFee: '₹20', desc: 'The highest waterfall in Telangana.' },
  { id: 'birla-mandir', name: 'Birla Mandir', districtId: 'hyderabad', district: 'Hyderabad', category: 'Pilgrimage', rating: 4.8, timings: '7AM-12PM, 2PM-9PM', entryFee: 'Free', desc: 'White marble temple on a hilltop.' },
  { id: 'salar-jung', name: 'Salar Jung Museum', districtId: 'hyderabad', district: 'Hyderabad', category: 'Museum', rating: 4.7, timings: '10AM-5PM', entryFee: '₹50', desc: 'One of the largest art museums in India.' },
];

export default function TSDistrictPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const districtDestinations = useMemo(() => {
    return allDestinations.filter(d => d.districtId === id);
  }, [id]);

  const categories = useMemo(() => {
    const cats = new Set(districtDestinations.map(d => d.category));
    return ['All', ...Array.from(cats)];
  }, [districtDestinations]);

  const filteredDestinations = useMemo(() => {
    if (activeCategory === 'All') return districtDestinations;
    return districtDestinations.filter(d => d.category === activeCategory);
  }, [districtDestinations, activeCategory]);

  const districtName = useMemo(() => {
    return id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
  }, [id]);

  const getDestinationImage = (dest: any) => {
    const found = PlaceHolderImages.find(img => img.id === dest.id);
    if (found) return found.imageUrl;
    return `https://picsum.photos/seed/${dest.id}/600/400`;
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="space-y-6">
        <Link href="/locations/telangana" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> All Districts
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore {districtName}</h1>
            <p className="text-muted-foreground text-xl max-w-2xl">Discover top landmarks and curated destinations in this region.</p>
          </div>
          <Link href={`/guides?search=${id}`}>
            <Button className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 bg-primary">Find Local Guides</Button>
          </Link>
        </div>

        {/* Category Filter Option Below */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
          <div className="flex items-center gap-2 mr-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <Filter className="w-3.5 h-3.5" /> Filter by
          </div>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-4 h-9 font-bold transition-all ${activeCategory === cat ? 'shadow-md' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, delay: idx * 0.05 }}
              >
                <TouristCard 
                  id={dest.id}
                  name={dest.name}
                  location={dest.district}
                  category={dest.category}
                  rating={dest.rating}
                  description={dest.desc}
                  image={getDestinationImage(dest)}
                  timings={dest.timings}
                  entryFee={dest.entryFee}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-secondary/10 rounded-3xl border border-dashed">
              <p className="text-muted-foreground">No destinations match the selected category in this district.</p>
              <Button variant="link" onClick={() => setActiveCategory('All')}>Clear Filters</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
