'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Filter, Lock, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TouristCard from '@/components/TouristCard';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const allDestinations = [
  // Temples
  { id: 'tirumala-temple', name: 'Tirumala Temple', districtId: 'tirupati', district: 'Tirupati', category: 'Temple', rating: 4.9, timings: '3AM-12PM', entryFee: '₹300', desc: 'World famous Hindu temple on the hills of Tirumala.', lat: 13.6833, lng: 79.3500 },
  { id: 'srisailam', name: 'Srisailam Mallikarjuna', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', rating: 4.8, timings: '5AM-9PM', entryFee: 'Free', desc: 'Ancient Shiva temple and one of the 12 Jyotirlingas.', lat: 16.0748, lng: 78.8681 },
  { id: 'simhachalam', name: 'Simhachalam Temple', districtId: 'vizag', district: 'Visakhapatnam', category: 'Temple', rating: 4.7, timings: '6AM-9PM', entryFee: 'Free', desc: 'Varaha Lakshmi Narasimha temple known for its unique architecture.', lat: 17.7665, lng: 83.2422 },
  { id: 'kanaka-durga', name: 'Kanaka Durga Temple', districtId: 'ntr', district: 'NTR District', category: 'Temple', rating: 4.8, timings: '4AM-9PM', entryFee: 'Free', desc: 'Famous shrine of Goddess Durga on Indrakeeladri hill.', lat: 16.5165, lng: 80.6104 },
  { id: 'annavaram', name: 'Annavaram Satyanarayana', districtId: 'kakinada', district: 'Kakinada', category: 'Temple', rating: 4.7, timings: '5AM-9PM', entryFee: 'Free', desc: 'Sacred temple of Lord Satyanarayana Swami.', lat: 17.2800, lng: 82.4044 },
  { id: 'lepakshi', name: 'Lepakshi Temple', districtId: 'sss', district: 'Sri Sathya Sai', category: 'Temple', rating: 4.8, timings: '6AM-6PM', entryFee: 'Free', desc: 'Famous for its hanging pillar and Veerabhadra temple.', lat: 13.8021, lng: 77.6074 },
  { id: 'ahobilam', name: 'Ahobilam Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', rating: 4.7, timings: '6AM-5PM', entryFee: 'Free', desc: 'Navanarasimha Kshetram located amidst lush forests.', lat: 15.1325, lng: 78.7186 },
  { id: 'mahanandi', name: 'Mahanandi Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', rating: 4.6, timings: '5AM-9PM', entryFee: 'Free', desc: 'Ancient temple famous for its crystal clear water tank.', lat: 15.4628, lng: 78.6186 },
  { id: 'yaganti', name: 'Yaganti Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', rating: 4.7, timings: '6AM-8PM', entryFee: 'Free', desc: 'Famous for the growing stone crow.', lat: 15.3501, lng: 78.1367 },
  
  // Beaches
  { id: 'suryalanka', name: 'Suryalanka Beach', districtId: 'bapatla', district: 'Bapatla', category: 'Beach', rating: 4.5, timings: '24/7', entryFee: 'Free', desc: 'Popular weekend getaway known for its wide sandy shores.', lat: 15.8458, lng: 80.5050 },
  { id: 'rk-beach', name: 'RK Beach', districtId: 'vizag', district: 'Visakhapatnam', category: 'Beach', rating: 4.6, timings: '24/7', entryFee: 'Free', desc: 'The most popular urban beach in Visakhapatnam.', lat: 17.7142, lng: 83.3236 },
  { id: 'rushikonda', name: 'Rushikonda Beach', districtId: 'vizag', district: 'Visakhapatnam', category: 'Beach', rating: 4.7, timings: '24/7', entryFee: 'Free', desc: 'Blue Flag certified beach perfect for water sports.', lat: 17.7828, lng: 83.3854 },
  { id: 'yarada-beach', name: 'Yarada Beach', districtId: 'vizag', district: 'Visakhapatnam', category: 'Beach', rating: 4.8, timings: '24/7', entryFee: 'Free', desc: 'A serene and secluded beach surrounded by hills.', lat: 17.6534, lng: 83.2687 },
  { id: 'manginapudi', name: 'Machilipatnam Beach', districtId: 'krishna', district: 'Krishna', category: 'Beach', rating: 4.4, timings: '24/7', entryFee: 'Free', desc: 'Unique beach with black soil and historic port.', lat: 16.1554, lng: 81.2065 },
  { id: 'mypadu', name: 'Mypadu Beach', districtId: 'nellore', district: 'SPSR Nellore', category: 'Beach', rating: 4.5, timings: '24/7', entryFee: 'Free', desc: 'Pristine coastline with golden sands.', lat: 14.5028, lng: 80.1794 },

  // Hill Stations
  { id: 'araku-valley', name: 'Araku Valley', districtId: 'asr', district: 'ASR District', category: 'Hill Station', rating: 4.8, timings: '24/7', entryFee: 'Free', desc: 'Beautiful hill station with coffee plantations.', lat: 18.3273, lng: 82.8775 },
  { id: 'lambasingi', name: 'Lambasingi', districtId: 'asr', district: 'ASR District', category: 'Hill Station', rating: 4.7, timings: '24/7', entryFee: 'Free', desc: 'Known as the Kashmir of Andhra Pradesh.', lat: 17.8188, lng: 82.4925 },
  { id: 'madanapalle', name: 'Madanapalle', districtId: 'annamayya', district: 'Annamayya', category: 'Hill Station', rating: 4.5, timings: '24/7', entryFee: 'Free', desc: 'Historic town known for its pleasant climate.', lat: 13.5534, lng: 78.5023 },

  // Caves
  { id: 'borra-caves', name: 'Borra Caves', districtId: 'asr', district: 'ASR District', category: 'Caves', rating: 4.9, timings: '10AM-5PM', entryFee: '₹60', desc: 'Millions of years old limestone caves.', lat: 18.2809, lng: 83.0375 },
  { id: 'belum-caves', name: 'Belum Caves', districtId: 'nandyal', district: 'Nandyal', category: 'Caves', rating: 4.8, timings: '10AM-5PM', entryFee: '₹65', desc: 'Second largest cave system in India.', lat: 15.1017, lng: 78.1133 },
  { id: 'undavalli-caves', name: 'Undavalli Caves', districtId: 'guntur', district: 'Guntur', category: 'Caves', rating: 4.7, timings: '9AM-6PM', entryFee: '₹25', desc: 'Monolithic rock-cut caves near Vijayawada.', lat: 16.4914, lng: 80.5816 },

  // Waterfalls
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', districtId: 'annamayya', district: 'Annamayya', category: 'Waterfall', rating: 4.8, timings: '6AM-6PM', entryFee: '₹50', desc: 'Highest waterfall in Andhra Pradesh.', lat: 13.8066, lng: 79.2138 },
  { id: 'ethipothala-falls', name: 'Ethipothala Falls', districtId: 'palnadu', district: 'Palnadu', category: 'Waterfall', rating: 4.6, timings: '6AM-6PM', entryFee: '₹20', desc: 'Beautiful cascade formed by three streams.', lat: 16.5186, lng: 79.3361 },
  { id: 'katiki-falls', name: 'Katiki Waterfalls', districtId: 'asr', district: 'ASR District', category: 'Waterfall', rating: 4.7, timings: '6AM-5PM', entryFee: 'Free', desc: 'Stunning waterfall near Araku Valley.', lat: 18.2568, lng: 83.0125 },
];

export default function DistrictPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useUser();
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
    const names: Record<string, string> = {
      vizag: 'Visakhapatnam',
      asr: 'Alluri Sitharama Raju',
      sss: 'Sri Sathya Sai',
      nellore: 'SPSR Nellore',
      ntr: 'NTR District',
      tirupati: 'Tirupati',
      bapatla: 'Bapatla',
      annamayya: 'Annamayya',
      palnadu: 'Palnadu',
      guntur: 'Guntur',
      kakinada: 'Kakinada',
      nandyal: 'Nandyal',
      krishna: 'Krishna'
    };
    return names[id] || id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');
  }, [id]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
        <div className="bg-primary/10 p-6 rounded-full"><Lock className="w-12 h-12 text-primary" /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Access Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Please sign in to view the top landmarks and hidden gems of {districtName}.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">Sign In</Button></Link>
          <Link href="/signup"><Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Join Now</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="space-y-6">
        <Link href="/locations/andhra-pradesh" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
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

        <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
          <div className="flex items-center gap-2 mr-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <Filter className="w-3.5 h-3.5" /> Filter by Category
          </div>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-4 h-9 font-bold transition-all ${activeCategory === cat ? 'shadow-md shadow-primary/20' : ''}`}
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
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <TouristCard 
                  id={dest.id}
                  name={dest.name}
                  location={dest.district}
                  category={dest.category}
                  rating={dest.rating}
                  description={dest.desc}
                  image={`https://picsum.photos/seed/${dest.id}/600/400`}
                  timings={dest.timings}
                  entryFee={dest.entryFee}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-secondary/10 rounded-3xl border border-dashed">
              <p className="text-muted-foreground">No destinations match "{activeCategory}" in this district yet.</p>
              <Button variant="link" onClick={() => setActiveCategory('All')} className="text-primary font-bold">Clear Filters</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
