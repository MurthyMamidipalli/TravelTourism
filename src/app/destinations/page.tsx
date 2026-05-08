'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

const allDestinations = [
  { id: 'paris', name: 'Paris', country: 'France', description: 'The City of Light, world-renowned for art and romance.', img: 'https://picsum.photos/seed/paris/600/400' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', description: 'A neon-lit metropolis blending tradition and future.', img: 'https://picsum.photos/seed/tokyo/600/400' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', description: 'Tropical paradise with lush jungles and sacred temples.', img: 'https://picsum.photos/seed/bali/600/400' },
  { id: 'amalapuram', name: 'Amalapuram', country: 'India', description: 'A serene coastal town in Andhra Pradesh known for lush greenery.', img: 'https://picsum.photos/seed/amalapuram/600/400' },
  { id: 'rome', name: 'Rome', country: 'Italy', description: 'The Eternal City, home to ancient ruins and divine food.', img: 'https://picsum.photos/seed/rome/600/400' },
  { id: 'new-york', name: 'New York', country: 'USA', description: 'The Big Apple, a melting pot of culture and ambition.', img: 'https://picsum.photos/seed/ny/600/400' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', description: 'Harbor city famous for the Opera House and golden beaches.', img: 'https://picsum.photos/seed/sydney/600/400' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', description: 'Guardian of the Pyramids and the timeless Nile River.', img: 'https://picsum.photos/seed/cairo/600/400' },
];

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = allDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold text-primary">Explore World Destinations</h1>
        <p className="text-muted-foreground">From bustling cities to hidden coastal gems, find your next adventure.</p>
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search for a city or country..." 
            className="pl-10 h-12 bg-white rounded-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map((dest) => (
          <Link key={dest.id} href={`/destinations/${dest.id}`}>
            <Card className="h-full group hover:shadow-md transition-shadow border-none overflow-hidden bg-white">
              <div className="relative h-48">
                <Image
                  src={dest.img}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-1 text-accent font-semibold text-xs uppercase tracking-wider mb-1">
                  <MapPin className="w-3 h-3" /> {dest.country}
                </div>
                <h3 className="font-headline text-xl font-bold mb-2">{dest.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{dest.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No destinations found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}