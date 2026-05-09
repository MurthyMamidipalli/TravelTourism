
'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Landmark, Waves, Sparkles, Lock, Mountain, Building2, Landmark as HeritageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import TouristCard from '@/components/TouristCard';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const allDestinations = [
  // Andhra Pradesh Data (Previous Integration)
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', category: 'Temples', rating: 4.9, desc: 'World famous Hindu temple on the hills of Tirumala.' },
  { id: 'srisailam', name: 'Srisailam Temple', district: 'Nandyal', category: 'Temples', rating: 4.8, desc: 'Ancient Shiva temple and one of the 12 Jyotirlingas.' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Visakhapatnam', category: 'Beaches', rating: 4.6, desc: 'The most popular urban beach in Visakhapatnam.' },
  { id: 'borra-caves', name: 'Borra Caves', district: 'ASR District', category: 'Caves', rating: 4.9, desc: 'Millions of years old limestone caves.' },
  { id: 'araku-valley', name: 'Araku Valley', district: 'ASR District', category: 'Hill stations', rating: 4.8, desc: 'Beautiful hill station with coffee plantations.' },
  
  // Telangana Spreadsheet Data
  { id: 'charminar', name: 'Charminar', district: 'Hyderabad', category: 'Heritage', rating: 4.8, desc: 'Iconic 16th-century mosque and global landmark.' },
  { id: 'golconda-fort', name: 'Golconda Fort', district: 'Hyderabad', category: 'Heritage', rating: 4.9, desc: 'Historic citadel and former capital of the Qutb Shahis.' },
  { id: 'ramoji-film-city', name: 'Ramoji Film City', district: 'Ranga Reddy', category: 'Entertainment', rating: 4.7, desc: 'The world\'s largest integrated film city.' },
  { id: 'yadadri-temple', name: 'Yadadri Temple', district: 'Yadadri Bhuvanagiri', category: 'Temples', rating: 4.9, desc: 'Major Hindu temple dedicated to Narasimha Swamy.' },
  { id: 'basara-temple', name: 'Basara Saraswati Temple', district: 'Nirmal', category: 'Temples', rating: 4.7, desc: 'Unique temple dedicated to the Goddess of Knowledge.' },
  { id: 'ramappa-temple', name: 'Ramappa Temple', district: 'Mulugu', category: 'Temples', rating: 4.9, desc: 'UNESCO World Heritage site with exquisite carving.' },
  { id: 'bhadrachalam', name: 'Bhadrachalam Temple', district: 'Bhadradri Kothagudem', category: 'Temples', rating: 4.9, desc: 'Sacred Rama temple on the banks of Godavari.' },
  { id: 'bogatha-falls', name: 'Bogatha Waterfalls', district: 'Mulugu', category: 'Waterfalls', rating: 4.8, desc: 'Stunning waterfall known as the Niagara of Telangana.' },
  { id: 'kuntala-falls', name: 'Kuntala Waterfalls', district: 'Nirmal', category: 'Waterfalls', rating: 4.7, desc: 'The highest waterfall in Telangana state.' },
  { id: 'nagarjuna-sagar-dam', name: 'Nagarjuna Sagar Dam', district: 'Nalgonda', category: 'Landmarks', rating: 4.8, desc: 'One of the largest masonry dams in the world.' },
  { id: 'hussain-sagar', name: 'Hussain Sagar Lake', district: 'Hyderabad', category: 'Lakes', rating: 4.7, desc: 'Heart-shaped lake with a monolithic Buddha statue.' },
  { id: 'laknavaram-lake', name: 'Laknavaram Lake', district: 'Mulugu', category: 'Lakes', rating: 4.8, desc: 'Scenic lake with suspension bridges and islands.' },
  { id: 'bhongir-fort', name: 'Bhongir Fort', district: 'Yadadri Bhuvanagiri', category: 'Heritage', rating: 4.7, desc: 'Massive monolithic rock fort offering trekking.' },
];

export default function DestinationsPage() {
  const { user, loading: authLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Temples', icon: Landmark },
    { name: 'Heritage', icon: HeritageIcon },
    { name: 'Beaches', icon: Waves },
    { name: 'Waterfalls', icon: Waves },
    { name: 'Hill stations', icon: Mountain },
    { name: 'Lakes', icon: Waves },
  ];

  const filteredDestinations = useMemo(() => {
    return allDestinations.filter((dest) => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-16 w-3/4 mx-auto rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
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
          <p className="text-muted-foreground max-w-md mx-auto">Sign in to TravelSphere to browse detailed landmark information, reviews, and interactive maps.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg">Sign In</Button></Link>
          <Link href="/signup"><Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Create Account</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      <header className="space-y-8 text-center max-w-4xl mx-auto">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-bold">Premium Membership Access</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-headline">Explore the Heart of India</h1>
          <p className="text-muted-foreground text-lg">Browse our curated list of spiritual, coastal, and natural wonders across AP and Telangana.</p>
        </div>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or district..." 
            className="pl-12 h-14 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={activeCategory === cat.name ? 'default' : 'outline'}
              className={`rounded-full px-6 transition-all font-bold flex gap-2 h-11 ${activeCategory === cat.name ? 'shadow-lg' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
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
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <TouristCard 
                id={dest.id}
                name={dest.name}
                location={dest.district}
                category={dest.category}
                rating={dest.rating}
                description={dest.desc}
                image={`https://picsum.photos/seed/${dest.id}/600/400`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-32 bg-secondary/10 rounded-[2.5rem] border border-dashed">
          <h3 className="text-2xl font-black font-headline">No matching places found</h3>
          <Button variant="link" className="mt-4 text-primary font-bold" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
