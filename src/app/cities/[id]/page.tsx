
'use client';

import { use, useState } from 'react';
import TouristCard from '@/components/TouristCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const mockAttractions: Record<string, any[]> = {
  'paris': [
    { id: 'eiffel', name: 'Eiffel Tower', category: 'Monument', rating: 4.8, description: 'Iconic wrought-iron tower on the Champ de Mars.', image: 'https://picsum.photos/seed/eiffel/800/600', location: 'Paris, France' },
    { id: 'louvre', name: 'Louvre Museum', category: 'Museum', rating: 4.9, description: 'The world\'s largest art museum and a historic monument.', image: 'https://picsum.photos/seed/louvre/800/600', location: 'Paris, France' },
    { id: 'notre-dame', name: 'Notre-Dame Cathedral', category: 'Historical', rating: 4.7, description: 'A medieval Catholic cathedral on the Île de la Cité.', image: 'https://picsum.photos/seed/notre/800/600', location: 'Paris, France' },
  ],
  'tokyo': [
    { id: 'shibuya', name: 'Shibuya Crossing', category: 'Urban', rating: 4.6, description: 'The famous scramble crossing in the heart of Tokyo.', image: 'https://picsum.photos/seed/shibuya/800/600', location: 'Tokyo, Japan' },
    { id: 'sensoji', name: 'Senso-ji Temple', category: 'Historical', rating: 4.8, description: 'Tokyo\'s oldest temple, located in Asakusa.', image: 'https://picsum.photos/seed/sensoji/800/600', location: 'Tokyo, Japan' },
  ]
};

export default function CityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const attractions = mockAttractions[id] || [];
  const cityName = id.charAt(0).toUpperCase() + id.slice(1);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? attractions : attractions.filter(a => a.category === filter);
  const categories = ['All', ...new Set(attractions.map(a => a.category))];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <Link href="/locations" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold">Things to do in {cityName}</h1>
          <p className="text-muted-foreground text-xl max-w-2xl">
            Explore the best tourist spots, landmarks, and experiences handpicked for you in {cityName}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              className="rounded-full px-6"
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <TouristCard {...item} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32 bg-secondary/20 rounded-3xl border border-dashed">
          <p className="text-muted-foreground text-lg">No attractions found for this category yet.</p>
        </div>
      )}
    </div>
  );
}
