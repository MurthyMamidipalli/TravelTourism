
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

const allDestinations = [
  { id: 'taj-mahal', name: 'Taj Mahal', country: 'India', category: 'Heritage/Monument', img: 'https://picsum.photos/seed/tajmahal/600/400' },
  { id: 'eiffel-tower', name: 'Eiffel Tower', country: 'France', category: 'Landmark', img: 'https://picsum.photos/seed/eiffel/600/400' },
  { id: 'machu-picchu', name: 'Machu Picchu', country: 'Peru', category: 'Ruins/Adventure', img: 'https://picsum.photos/seed/machu/600/400' },
  { id: 'great-wall', name: 'Great Wall of China', country: 'China', category: 'Heritage', img: 'https://picsum.photos/seed/greatwall/600/400' },
  { id: 'santorini', name: 'Santorini', country: 'Greece', category: 'Beach/Romance', img: 'https://picsum.photos/seed/santorini/600/400' },
  { id: 'colosseum', name: 'Colosseum', country: 'Italy', category: 'History/Monument', img: 'https://picsum.photos/seed/colosseum/600/400' },
  { id: 'serengeti', name: 'Safari - Serengeti', country: 'Tanzania', category: 'Wildlife/Nature', img: 'https://picsum.photos/seed/serengeti/600/400' },
  { id: 'angkor-wat', name: 'Angkor Wat', country: 'Cambodia', category: 'Temple/Heritage', img: 'https://picsum.photos/seed/angkor/600/400' },
  { id: 'petra', name: 'Petra', country: 'Jordan', category: 'Ruins/Desert', img: 'https://picsum.photos/seed/petra/600/400' },
  { id: 'niagara-falls', name: 'Niagara Falls', country: 'Canada/USA', category: 'Nature', img: 'https://picsum.photos/seed/niagara/600/400' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', category: 'Beach/Culture', img: 'https://picsum.photos/seed/bali/600/400' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', category: 'Culture/Temple', img: 'https://picsum.photos/seed/kyoto/600/400' },
  { id: 'nyc', name: 'New York City', country: 'USA', category: 'Urban/Arts', img: 'https://picsum.photos/seed/nyc/600/400' },
  { id: 'patagonia', name: 'Patagonia', country: 'Argentina/Chile', category: 'Adventure/Nature', img: 'https://picsum.photos/seed/patagonia/600/400' },
  { id: 'maldives', name: 'Maldives', country: 'Maldives', category: 'Beach/Luxury', img: 'https://picsum.photos/seed/maldives/600/400' },
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
        <p className="text-muted-foreground">The world's 15 most breathtaking tourist destinations, curated just for you.</p>
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search for a city or country..." 
            className="pl-10 h-12 bg-white dark:bg-zinc-900 rounded-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map((dest) => (
          <Link key={dest.id} href={`/destinations/${dest.id}`}>
            <Card className="h-full group hover:shadow-md transition-shadow border-none overflow-hidden bg-white dark:bg-zinc-900">
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
                <p className="text-sm text-muted-foreground line-clamp-2">{dest.category}</p>
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
