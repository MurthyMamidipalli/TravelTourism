
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Sparkles, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import TouristCard from '@/components/TouristCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const allDestinations = [
  // Andhra Pradesh
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', category: 'Pilgrimage', rating: 4.9, desc: 'World famous Hindu temple on the hills of Tirumala.' },
  { id: 'sri-kalahasti', name: 'Sri Kalahasti', district: 'Tirupati', category: 'Pilgrimage', rating: 4.7, desc: 'Famous Shiva temple known for Vayu Linga.' },
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', district: 'Tirupati', category: 'Nature', rating: 4.8, desc: 'Highest waterfall in Andhra Pradesh.' },
  { id: 'vizag', name: 'Visakhapatnam', district: 'Vizag', category: 'City', rating: 4.6, desc: 'A port city known for its beautiful beaches.' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Vizag', category: 'Beach', rating: 4.5, desc: 'The most popular beach in Vizag.' },
  { id: 'araku-valley', name: 'Araku Valley', district: 'ASR District', category: 'Nature', rating: 4.8, desc: 'Beautiful hill station with coffee plantations.' },
  { id: 'charminar', name: 'Charminar', district: 'Hyderabad', category: 'Heritage', rating: 4.7, desc: 'Iconic 16th-century mosque and monument.' },
  { id: 'golconda-fort', name: 'Golconda Fort', district: 'Hyderabad', category: 'Heritage', rating: 4.8, desc: 'Historic citadel and former capital of the Qutb Shahi dynasty.' },
  { id: 'ramappa-temple', name: 'Ramappa Temple', district: 'Warangal', category: 'Heritage', rating: 4.9, desc: 'UNESCO World Heritage site known for its exquisite architecture.' },
  { id: 'ananthagiri-hills', name: 'Ananthagiri Hills', district: 'Vikarabad', category: 'Nature', rating: 4.5, desc: 'Dense forests and a major trekking destination.' },
  { id: 'konaseema', name: 'Konaseema', district: 'Konaseema', category: 'Nature', rating: 4.7, desc: 'Lush green landscapes resembling Kerala backwaters.' },
  { id: 'amaravati', name: 'Amaravati', district: 'Guntur', category: 'Heritage', rating: 4.4, desc: 'Ancient Buddhist center and spiritual capital.' },
];

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Pilgrimage', 'Nature', 'Beach', 'Heritage', 'City'];

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const getDestinationImage = (dest: any) => {
    const found = PlaceHolderImages.find(img => img.id === dest.id);
    if (found) return found.imageUrl;
    
    // Category Fallbacks for consistency
    switch(dest.category.toLowerCase()) {
      case 'pilgrimage': return 'https://picsum.photos/seed/temple/600/400';
      case 'beach': return 'https://picsum.photos/seed/beach/600/400';
      case 'nature': return 'https://picsum.photos/seed/nature/600/400';
      case 'heritage': return 'https://picsum.photos/seed/history/600/400';
      default: return `https://picsum.photos/seed/${dest.id}/600/400`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1 flex items-center gap-1.5 mx-auto w-fit font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Curated Collection
          </Badge>
          <h1 className="font-headline text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tight">
            Discover <span className="text-primary">Wonders</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium">
            Explore the most breathtaking landmarks across South India.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-6">
          <div className="relative w-full max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by place or district..." 
              className="pl-12 h-14 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border-none text-lg focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <Filter className="w-4 h-4 text-muted-foreground mr-2" />
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={`rounded-full px-6 transition-all font-bold ${activeCategory === cat ? 'shadow-lg shadow-primary/20' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <TouristCard 
                id={dest.id}
                name={dest.name}
                location={dest.district}
                category={dest.category}
                rating={dest.rating}
                description={dest.desc}
                image={getDestinationImage(dest)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDestinations.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-secondary/10 rounded-[2.5rem] border border-dashed border-primary/20"
        >
          <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-primary opacity-20" />
          </div>
          <h3 className="text-2xl font-black font-headline">No matching places found</h3>
          <p className="text-muted-foreground mt-2 font-medium">Try adjusting your search or filters to find more gems.</p>
          <Button variant="link" className="mt-4 text-primary font-bold" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>
            Reset Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
