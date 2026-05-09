'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Sparkles, Filter, X, Landmark, Waves, Shield, Building2, Trees, Mountain, History, ArrowRight, Lock, LogIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import TouristCard from '@/components/TouristCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const allDestinations = [
  // Andhra Pradesh
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', category: 'Temples', rating: 4.9, desc: 'World famous Hindu temple on the hills of Tirumala.' },
  { id: 'sri-kalahasti', name: 'Sri Kalahasti', district: 'Tirupati', category: 'Temples', rating: 4.7, desc: 'Famous Shiva temple known for Vayu Linga.' },
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', district: 'Tirupati', category: 'Waterfalls', rating: 4.8, desc: 'Highest waterfall in Andhra Pradesh.' },
  { id: 'vizag', name: 'Visakhapatnam', district: 'Vizag', category: 'Historical places', rating: 4.6, desc: 'A port city known for its beautiful beaches.' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Vizag', category: 'Resorts', rating: 4.5, desc: 'The most popular beach in Vizag.' },
  { id: 'araku-valley', name: 'Araku Valley', district: 'ASR District', category: 'Hill stations', rating: 4.8, desc: 'Beautiful hill station with coffee plantations.' },
  { id: 'charminar', name: 'Charminar', district: 'Hyderabad', category: 'Historical places', rating: 4.7, desc: 'Iconic 16th-century mosque and monument.' },
  { id: 'golconda-fort', name: 'Golconda Fort', district: 'Hyderabad', category: 'Forts', rating: 4.8, desc: 'Historic citadel and former capital of the Qutb Shahi dynasty.' },
  { id: 'ramappa-temple', name: 'Ramappa Temple', district: 'Warangal', category: 'Temples', rating: 4.9, desc: 'UNESCO World Heritage site known for its exquisite architecture.' },
  { id: 'coringa-wildlife', name: 'Coringa Wildlife', district: 'Kakinada', category: 'Wildlife', rating: 4.7, desc: 'India\'s second-largest stretch of mangrove forests.' },
  { id: 'konaseema', name: 'Konaseema Resorts', district: 'Konaseema', category: 'Resorts', rating: 4.7, desc: 'Lush green landscapes resembling Kerala backwaters.' },
  { id: 'amaravati', name: 'Amaravati Stupa', district: 'Guntur', category: 'Historical places', rating: 4.4, desc: 'Ancient Buddhist center and spiritual capital.' },
];

export default function DestinationsPage() {
  const { user, loading: authLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Temples', icon: Landmark },
    { name: 'Waterfalls', icon: Waves },
    { name: 'Forts', icon: Shield },
    { name: 'Resorts', icon: Building2 },
    { name: 'Wildlife', icon: Trees },
    { name: 'Hill stations', icon: Mountain },
    { name: 'Historical places', icon: History },
  ];

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const groupedDestinations = useMemo(() => {
    if (activeCategory !== 'All') return null;
    const groups: Record<string, typeof allDestinations> = {};
    filteredDestinations.forEach(dest => {
      if (!groups[dest.category]) groups[dest.category] = [];
      groups[dest.category].push(dest);
    });
    return groups;
  }, [filteredDestinations, activeCategory]);

  const getDestinationImage = (dest: any) => {
    const found = PlaceHolderImages.find(img => img.id === dest.id);
    if (found) return found.imageUrl;
    
    switch(dest.category.toLowerCase()) {
      case 'temples': return 'https://picsum.photos/seed/temple/600/400';
      case 'waterfalls': return 'https://picsum.photos/seed/waterfall/600/400';
      case 'wildlife': return 'https://picsum.photos/seed/forest/600/400';
      case 'hill stations': return 'https://picsum.photos/seed/hills/600/400';
      case 'forts': return 'https://picsum.photos/seed/fort/600/400';
      default: return `https://picsum.photos/seed/${dest.id}/600/400`;
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-12">
        <Skeleton className="h-20 w-3/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-primary/10 p-6 rounded-full"><Lock className="w-12 h-12 text-primary" /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Places Restricted</h1>
          <p className="text-muted-foreground max-w-md">Join TravelSphere to browse detailed landmark information, reviews, and interactive maps.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">Sign In</Button></Link>
          <Link href="/signup"><Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Create Account</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen [scrollbar-gutter:stable]">
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-bold">Exploration Hub</Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight font-headline">Discover Places</h1>
            <p className="text-muted-foreground text-lg font-medium">Browse by category or search for specific landmarks.</p>
          </div>
          
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name or district..." 
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

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={activeCategory === cat.name ? 'default' : 'outline'}
              className={`rounded-full px-6 transition-all font-bold flex gap-2 h-11 ${activeCategory === cat.name ? 'shadow-lg shadow-primary/20' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </Button>
          ))}
        </div>
      </header>

      <div className="space-y-16">
        <AnimatePresence mode="popLayout">
          {groupedDestinations ? (
            Object.entries(groupedDestinations).map(([category, items]) => (
              <motion.section 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black font-headline text-zinc-900 dark:text-white uppercase tracking-tighter">{category}</h2>
                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-grow" />
                  <Badge variant="outline" className="text-xs uppercase font-black">{items.length} Places</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items.map((dest, idx) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
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
                </div>
              </motion.section>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
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
            </motion.div>
          )}
        </AnimatePresence>

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
            <p className="text-muted-foreground mt-2 font-medium">Try adjusting your filters or search query.</p>
            <Button variant="link" className="mt-4 text-primary font-bold" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>
              Reset All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
