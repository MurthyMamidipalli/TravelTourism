'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const allDestinations = [
  { id: 'tirumala-temple', name: 'Tirumala Temple', district: 'Tirupati', itinerary: '2 Days', category: 'Pilgrimage' },
  { id: 'sri-kalahasti', name: 'Sri Kalahasti', district: 'Tirupati', itinerary: '1 Day', category: 'Pilgrimage' },
  { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', district: 'Tirupati', itinerary: '1 Day', category: 'Nature' },
  { id: 'chandragiri-fort', name: 'Chandragiri Fort', district: 'Tirupati', itinerary: 'Half Day', category: 'Heritage' },
  { id: 'vizag', name: 'Visakhapatnam (Vizag)', district: 'Visakhapatnam', itinerary: '3 Days', category: 'City' },
  { id: 'rk-beach', name: 'RK Beach', district: 'Vizag', itinerary: 'Half Day', category: 'Beach' },
  { id: 'kailasagiri', name: 'Kailasagiri', district: 'Vizag', itinerary: 'Half Day', category: 'Park' },
  { id: 'ins-kurusura', name: 'INS Kurusura Museum', district: 'Vizag', itinerary: 'Half Day', category: 'Museum' },
  { id: 'yarada-beach', name: 'Yarada Beach', district: 'Vizag', itinerary: '1 Day', category: 'Beach' },
  { id: 'simhachalam-temple', name: 'Simhachalam Temple', district: 'Vizag', itinerary: 'Half Day', category: 'Pilgrimage' },
  { id: 'araku-valley', name: 'Araku Valley', district: 'ASR District', itinerary: '2 Days', category: 'Hill Station' },
  { id: 'borra-caves', name: 'Borra Caves', district: 'Araku', itinerary: '1 Day', category: 'Nature' },
  { id: 'ananthagiri-hills', name: 'Ananthagiri Hills', district: 'Vizag Region', itinerary: '1 Day', category: 'Nature' },
  { id: 'lambasingi', name: 'Lambasingi', district: 'ASR District', itinerary: '2 Days', category: 'Hill Station' },
  { id: 'katiki-waterfalls', name: 'Katiki Waterfalls', district: 'Araku', itinerary: 'Half Day', category: 'Nature' },
  { id: 'papikondalu', name: 'Papikondalu', district: 'East Godavari', itinerary: '2 Days', category: 'Nature' },
  { id: 'rajahmundry', name: 'Rajahmundry', district: 'East Godavari', itinerary: '2 Days', category: 'City' },
  { id: 'konaseema', name: 'Konaseema', district: 'Konaseema', itinerary: '2 Days', category: 'Backwaters' },
  { id: 'maredumilli', name: 'Maredumilli', district: 'East Godavari', itinerary: '2 Days', category: 'Forest' },
  { id: 'antarvedi', name: 'Antarvedi', district: 'Konaseema', itinerary: '1 Day', category: 'Beach' },
  { id: 'draksharamam', name: 'Draksharamam Temple', district: 'East Godavari', itinerary: 'Half Day', category: 'Pilgrimage' },
  { id: 'annavaram', name: 'Annavaram Temple', district: 'Kakinada', itinerary: 'Half Day', category: 'Pilgrimage' },
  { id: 'kakinada-beach', name: 'Kakinada Beach', district: 'Kakinada', itinerary: '1 Day', category: 'Beach' },
  { id: 'coringa-wildlife', name: 'Coringa Wildlife Sanctuary', district: 'Kakinada', itinerary: '1 Day', category: 'Wildlife' },
  { id: 'vijayawada', name: 'Vijayawada', district: 'NTR District', itinerary: '2 Days', category: 'City' },
  { id: 'kanaka-durga', name: 'Kanaka Durga Temple', district: 'Vijayawada', itinerary: 'Half Day', category: 'Pilgrimage' },
  { id: 'bhavani-island', name: 'Bhavani Island', district: 'Vijayawada', itinerary: '1 Day', category: 'Island' },
  { id: 'undavalli-caves', name: 'Undavalli Caves', district: 'Guntur', itinerary: 'Half Day', category: 'Heritage' },
  { id: 'amaravati', name: 'Amaravati', district: 'Guntur', itinerary: '1 Day', category: 'Heritage' },
  { id: 'nagarjuna-sagar', name: 'Nagarjuna Sagar', district: 'Palnadu', itinerary: '1 Day', category: 'Dam' },
  { id: 'srisailam', name: 'Srisailam', district: 'Nandyal', itinerary: '2 Days', category: 'Pilgrimage' },
  { id: 'srisailam-dam', name: 'Srisailam Dam', district: 'Nandyal', itinerary: 'Half Day', category: 'Dam' },
];

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDestinations = allDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold text-primary">Discover Andhra Pradesh</h1>
        <p className="text-muted-foreground">32 Breathtaking tourist destinations across the heart of South India.</p>
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search for a place or district..." 
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
                  src={`https://picsum.photos/seed/${dest.id}/600/400`}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-primary font-bold">{dest.category}</Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-1 text-accent font-semibold text-xs uppercase tracking-wider mb-1">
                  <MapPin className="w-3 h-3" /> {dest.district}
                </div>
                <h3 className="font-headline text-xl font-bold mb-2">{dest.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Suggested: {dest.itinerary}
                </div>
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
