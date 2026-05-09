'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Landmark, Waves, Sparkles, Lock, Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import TouristCard from '@/components/TouristCard';
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
    return <div className="container mx-auto px-4 py-12"><Skeleton className="h-40 w-full rounded-2xl" /></div>;
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
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1 font-bold">Discover Andhra Pradesh</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-headline">Explore 24+ Landmarks</h1>
          <p className="text-muted-foreground text-lg">Browse our curated list of spiritual, coastal, and natural wonders.</p>
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