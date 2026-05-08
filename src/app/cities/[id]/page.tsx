
'use client';

import { use, useState, useEffect } from 'react';
import TouristCard from '@/components/TouristCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getCityAttractions } from '@/lib/google-places';

export default function CityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const cityName = id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getCityAttractions(cityName);
        setAttractions(data);
      } catch (error) {
        console.error('Failed to load attractions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [cityName]);

  const filtered = filter === 'All' 
    ? attractions 
    : attractions.filter(a => a.types?.some((t: string) => t.toLowerCase().includes(filter.toLowerCase())));

  const categories = ['All', 'Museum', 'Park', 'History', 'Monument'];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <Link href="/locations" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Explore {cityName}</h1>
            <div className="bg-accent/10 p-2 rounded-full hidden sm:block">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" /> Discover real-time attractions powered by Google Places.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              className="rounded-full px-6 transition-all"
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-4"
          >
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Scanning Google Places for local gems...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <TouristCard 
                  id={item.id}
                  name={item.displayName?.text || 'Local Attraction'}
                  image={`https://picsum.photos/seed/${item.id}/800/600`} // Placeholder for Place Photo
                  rating={item.rating || 4.5}
                  description={item.editorialSummary?.text || 'Visit this incredible spot for a unique local experience.'}
                  location={item.formattedAddress || cityName}
                  category={item.types?.[0]?.replace('_', ' ') || 'Point of Interest'}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-32 bg-secondary/20 rounded-3xl border border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground text-lg">We couldn't find specific matches for "{filter}" right now.</p>
          <Button variant="link" onClick={() => setFilter('All')} className="mt-2 text-primary">View all attractions</Button>
        </div>
      )}
    </div>
  );
}
