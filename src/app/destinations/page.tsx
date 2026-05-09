
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
  // Temples
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', category: 'Temples', rating: 4.9, desc: 'World famous Hindu temple on the hills of Tirumala.' },
  { id: 'srisailam', name: 'Srisailam Temple', district: 'Nandyal', category: 'Temples', rating: 4.8, desc: 'Ancient Shiva temple and one of the 12 Jyotirlingas.' },
  { id: 'simhachalam', name: 'Simhachalam Temple', district: 'Visakhapatnam', category: 'Temples', rating: 4.7, desc: 'Varaha Lakshmi Narasimha temple known for its unique architecture.' },
  { id: 'kanaka-durga', name: 'Kanaka Durga Temple', district: 'NTR District', category: 'Temples', rating: 4.8, desc: 'Famous shrine of Goddess Durga on Indrakeeladri hill.' },
  { id: 'annavaram', name: 'Annavaram Temple', district: 'Kakinada', category: 'Temples', rating: 4.7, desc: 'Sacred temple of Lord Satyanarayana Swami.' },
  { id: 'lepakshi', name: 'Lepakshi Temple', district: 'Sri Sathya Sai', category: 'Temples', rating: 4.8, desc: 'Famous for its hanging pillar and Veerabhadra temple.' },
  { id: 'ahobilam', name: 'Ahobilam Temple', district: 'Nandyal', category: 'Temples', rating: 4.7, desc: 'Navanarasimha Kshetram located amidst lush forests.' },
  { id: 'mahanandi', name: 'Mahanandi Temple', district: 'Nandyal', category: 'Temples', rating: 4.6, desc: 'Ancient temple famous for its crystal clear water tank.' },
  { id: 'yaganti', name: 'Yaganti Temple', district: 'Nandyal', category: 'Temples', rating: 4.7, desc: 'Famous for the growing stone crow.' },

  // Beaches
  { id: 'suryalanka', name: 'Suryalanka Beach', district: 'Bapatla', category: 'Beaches', rating: 4.5, desc: 'Popular weekend getaway with wide sandy shores.' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Visakhapatnam', category: 'Beaches', rating: 4.6, desc: 'The most popular urban beach in Visakhapatnam.' },
  { id: 'rushikonda', name: 'Rushikonda Beach', district: 'Visakhapatnam', category: 'Beaches', rating: 4.7, desc: 'Blue Flag certified beach perfect for water sports.' },
  { id: 'yarada-beach', name: 'Yarada Beach', district: 'Visakhapatnam', category: 'Beaches', rating: 4.8, desc: 'A serene and secluded beach surrounded by hills.' },
  { id: 'manginapudi', name: 'Machilipatnam Beach', district: 'Krishna', category: 'Beaches', rating: 4.4, desc: 'Unique beach with black soil and historic port.' },
  { id: 'mypadu', name: 'Mypadu Beach', district: 'SPSR Nellore', category: 'Beaches', rating: 4.5, desc: 'Pristine coastline with golden sands.' },

  // Hill Stations
  { id: 'araku-valley', name: 'Araku Valley', district: 'ASR District', category: 'Hill stations', rating: 4.8, desc: 'Beautiful hill station with coffee plantations.' },
  { id: 'lambasingi', name: 'Lambasingi', district: 'ASR District', category: 'Hill stations', rating: 4.7, desc: 'Known as the Kashmir of Andhra Pradesh.' },
  { id: 'madanapalle', name: 'Madanapalle', district: 'Annamayya', category: 'Hill stations', rating: 4.5, desc: 'Historic town known for its pleasant climate.' },

  // Caves
  { id: 'borra-caves', name: 'Borra Caves', district: 'ASR District', category: 'Caves', rating: 4.9, desc: 'Millions of years old limestone caves.' },
  { id: 'belum-caves', name: 'Belum Caves', district: 'Nandyal', category: 'Caves', rating: 4.8, desc: 'Second largest cave system in the Indian subcontinent.' },
  { id: 'undavalli-caves', name: 'Undavalli Caves', district: 'Guntur', category: 'Caves', rating: 4.7, desc: 'Monolithic rock-cut caves near Vijayawada.' },

  // Waterfalls
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', district: 'Annamayya', category: 'Waterfalls', rating: 4.8, desc: 'Highest waterfall in Andhra Pradesh.' },
  { id: 'ethipothala-falls', name: 'Ethipothala Falls', district: 'Palnadu', category: 'Waterfalls', rating: 4.6, desc: 'Beautiful cascade formed by three streams.' },
  { id: 'katiki-falls', name: 'Katiki Waterfalls', district: 'ASR District', category: 'Waterfalls', rating: 4.7, desc: 'Stunning waterfall near Araku Valley.' },
];

export default function DestinationsPage() {
  const { user, loading: authLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Temples', icon: Landmark },
    { name: 'Beaches', icon: Waves },
    { name: 'Waterfalls', icon: Waves },
    { name: 'Hill stations', icon: Mountain },
    { name: 'Caves', icon: Sparkles },
    { name: 'Wildlife', icon: Trees },
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
      case 'beaches': return 'https://picsum.photos/seed/beach/600/400';
      case 'waterfalls': return 'https://picsum.photos/seed/waterfall/600/400';
      case 'hill stations': return 'https://picsum.photos/seed/hills/600/400';
      case 'caves': return 'https://picsum.photos/seed/cave/600/400';
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
          <h1 className="text-3xl font-black tracking-tight">Access Restricted</h1>
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
            <p className="text-muted-foreground text-lg font-medium">Browse 24+ top tourist destinations across Andhra Pradesh.</p>
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
