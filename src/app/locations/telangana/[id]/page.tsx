'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Filter, Lock, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TouristCard from '@/components/TouristCard';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const allDestinations = [
  // Heritage & Historical
  { id: 'charminar', name: 'Charminar', districtId: 'hyderabad', district: 'Hyderabad', category: 'Heritage', rating: 4.8, timings: '9AM-5:30PM', entryFee: '₹25', desc: 'Iconic 16th-century mosque and global landmark.', lat: 17.3616, lng: 78.4747 },
  { id: 'golconda-fort', name: 'Golconda Fort', districtId: 'hyderabad', district: 'Hyderabad', category: 'Heritage', rating: 4.9, timings: '9AM-5PM', entryFee: '₹25', desc: 'Historic citadel and former capital of the Qutb Shahi dynasty.', lat: 17.3833, lng: 78.4011 },
  { id: 'warangal-fort', name: 'Warangal Fort', districtId: 'hanamkonda', district: 'Hanamkonda', category: 'Heritage', rating: 4.8, timings: '10AM-7PM', entryFee: '₹25', desc: 'Medieval fort featuring impressive stone gateways.', lat: 17.9547, lng: 79.6109 },
  { id: 'bhongir-fort', name: 'Bhongir Fort', districtId: 'yadadri', district: 'Yadadri Bhuvanagiri', category: 'Heritage', rating: 4.7, timings: '10AM-5PM', entryFee: '₹10', desc: 'Massive monolithic rock fort offering trekking.', lat: 17.515, lng: 78.885 },
  { id: 'elgandal-fort', name: 'Elgandal Fort', districtId: 'karimnagar', district: 'Karimnagar', category: 'Heritage', rating: 4.6, timings: '10AM-5PM', entryFee: 'Free', desc: 'Ancient hilltop fort overlooking the Manair River.', lat: 18.4239, lng: 79.0347 },
  { id: 'medak-fort', name: 'Medak Fort', districtId: 'medak', district: 'Medak', category: 'Heritage', rating: 4.7, timings: '10AM-5PM', entryFee: 'Free', desc: 'Stronghold of the Kakatiyas with panoramic views.', lat: 18.0494, lng: 78.2612 },

  // Temples
  { id: 'yadadri-temple', name: 'Yadadri Temple', districtId: 'yadadri', district: 'Yadadri Bhuvanagiri', category: 'Temple', rating: 4.9, timings: '5AM-9PM', entryFee: 'Free', desc: 'Major Hindu temple dedicated to Narasimha Swamy.', lat: 17.59, lng: 78.943 },
  { id: 'birla-mandir', name: 'Birla Mandir', districtId: 'hyderabad', district: 'Hyderabad', category: 'Temple', rating: 4.8, timings: '7AM-9PM', entryFee: 'Free', desc: 'Exquisite white marble temple perched on a hilltop.', lat: 17.4062, lng: 78.4691 },
  { id: 'basara-temple', name: 'Basara Saraswati Temple', districtId: 'nirmal', district: 'Nirmal', category: 'Temple', rating: 4.7, timings: '4AM-8PM', entryFee: 'Free', desc: 'Unique temple dedicated to the Goddess of Knowledge.', lat: 18.88, lng: 77.97 },
  { id: 'ramappa-temple', name: 'Ramappa Temple', districtId: 'mulugu', district: 'Mulugu', category: 'Temple', rating: 4.9, timings: '6AM-6PM', entryFee: 'Free', desc: 'UNESCO World Heritage site known for floating bricks.', lat: 18.2591, lng: 79.9431 },
  { id: 'thousand-pillar', name: 'Thousand Pillar Temple', districtId: 'hanamkonda', district: 'Hanamkonda', category: 'Temple', rating: 4.8, timings: '6AM-8PM', entryFee: 'Free', desc: 'Star-shaped architectural masterpiece from the Kakatiya era.', lat: 18.0036, lng: 79.5747 },
  { id: 'bhadrachalam', name: 'Bhadrachalam Temple', districtId: 'bhadradri', district: 'Bhadradri Kothagudem', category: 'Temple', rating: 4.9, timings: '4AM-9PM', entryFee: 'Free', desc: 'Vaikuntha Rama temple on the banks of River Godavari.', lat: 17.6688, lng: 80.888 },
  { id: 'keesaragutta', name: 'Keesaragutta Temple', districtId: 'medchal', district: 'Medchal-Malkajgiri', category: 'Temple', rating: 4.6, timings: '6AM-8PM', entryFee: 'Free', desc: 'Ancient Shiva temple on a hillock near Hyderabad.', lat: 17.5288, lng: 78.6826 },

  // Nature & Waterfalls
  { id: 'bogatha-falls', name: 'Bogatha Waterfalls', districtId: 'mulugu', district: 'Mulugu', category: 'Waterfall', rating: 4.8, timings: '9AM-5PM', entryFee: '₹50', desc: 'Known as the Niagara of Telangana.', lat: 17.9575, lng: 80.825 },
  { id: 'kuntala-falls', name: 'Kuntala Waterfalls', districtId: 'nirmal', district: 'Nirmal', category: 'Waterfall', rating: 4.7, timings: '6AM-6PM', entryFee: '₹20', desc: 'The highest waterfall in Telangana state.', lat: 19.2167, lng: 78.5167 },
  { id: 'pochera-falls', name: 'Pochera Waterfalls', districtId: 'nirmal', district: 'Nirmal', category: 'Waterfall', rating: 4.6, timings: '6AM-6PM', entryFee: '₹20', desc: 'Picturesque waterfall amidst dense forest.', lat: 19.1678, lng: 78.4345 },
  { id: 'ananthagiri-hills', name: 'Ananthagiri Hills', districtId: 'vikarabad', district: 'Vikarabad', category: 'Hill Station', rating: 4.7, timings: '24/7', entryFee: 'Free', desc: 'Lush greenery and birthplace of the Musi River.', lat: 17.3117, lng: 77.8631 },

  // Entertainment & Modern
  { id: 'ramoji-film-city', name: 'Ramoji Film City', districtId: 'ranga-reddy', district: 'Ranga Reddy', category: 'Entertainment', rating: 4.7, timings: '9AM-5:30PM', entryFee: '₹1150', desc: 'The world\'s largest integrated film city and theme park.', lat: 17.2543, lng: 78.6808 },
  { id: 'nagarjuna-sagar-dam', name: 'Nagarjuna Sagar Dam', districtId: 'nalgonda', district: 'Nalgonda', category: 'Dam', rating: 4.8, timings: '9AM-6PM', entryFee: '₹20', desc: 'One of the largest masonry dams in the world.', lat: 16.5756, lng: 79.312 },

  // Lakes
  { id: 'hussain-sagar', name: 'Hussain Sagar Lake', districtId: 'hyderabad', district: 'Hyderabad', category: 'Lake', rating: 4.7, timings: '24/7', entryFee: 'Free', desc: 'Heart-shaped lake with a monolithic Buddha statue.', lat: 17.4239, lng: 78.4738 },
  { id: 'durgam-cheruvu', name: 'Durgam Cheruvu', districtId: 'hyderabad', district: 'Hyderabad', category: 'Lake', rating: 4.6, timings: '10AM-9PM', entryFee: 'Free', desc: 'Secret lake featuring a stunning cable-stayed bridge.', lat: 17.4326, lng: 78.3888 },
  { id: 'laknavaram-lake', name: 'Laknavaram Lake', districtId: 'mulugu', district: 'Mulugu', category: 'Lake', rating: 4.8, timings: '8AM-6PM', entryFee: '₹50', desc: 'Sprawling lake with suspension bridges and islands.', lat: 18.2, lng: 80.0167 },
  { id: 'pakhal-lake', name: 'Pakhal Lake', districtId: 'warangal', district: 'Warangal', category: 'Lake', rating: 4.7, timings: '24/7', entryFee: 'Free', desc: 'Scenic man-made lake within a wildlife sanctuary.', lat: 17.915, lng: 79.9125 },
];

export default function TSDistrictPage({ params }: { params: Promise<{ id: string }> }) {
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
      hyderabad: 'Hyderabad',
      yadadri: 'Yadadri Bhuvanagiri',
      nirmal: 'Nirmal',
      mulugu: 'Mulugu',
      hanamkonda: 'Hanamkonda',
      bhadradri: 'Bhadradri Kothagudem',
      vikarabad: 'Vikarabad',
      medchal: 'Medchal-Malkajgiri',
      ranga_reddy: 'Ranga Reddy',
      karimnagar: 'Karimnagar',
      medak: 'Medak',
      nalgonda: 'Nalgonda',
      warangal: 'Warangal'
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
