
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockGuides = [
  { 
    id: '1', 
    name: 'Ravi Teja', 
    location: 'Amalapuram, Andhra Pradesh', 
    rating: 4.9, 
    reviews: 124, 
    languages: ['Telugu', 'English', 'Hindi'],
    img: 'https://picsum.photos/seed/guide1/400/400',
    specialty: 'History & Culture'
  },
  { 
    id: '2', 
    name: 'Sarah Chen', 
    location: 'Tokyo, Japan', 
    rating: 4.8, 
    reviews: 89, 
    languages: ['Japanese', 'English', 'Mandarin'],
    img: 'https://picsum.photos/seed/guide2/400/400',
    specialty: 'Food & Nightlife'
  },
  { 
    id: '3', 
    name: 'Marco Rossi', 
    location: 'Rome, Italy', 
    rating: 5.0, 
    reviews: 210, 
    languages: ['Italian', 'English', 'Spanish'],
    img: 'https://picsum.photos/seed/guide3/400/400',
    specialty: 'Architecture'
  },
  { 
    id: '4', 
    name: 'Anjali Devi', 
    location: 'Amalapuram, Andhra Pradesh', 
    rating: 4.7, 
    reviews: 56, 
    languages: ['Telugu', 'English'],
    img: 'https://picsum.photos/seed/guide4/400/400',
    specialty: 'Nature & Backwaters'
  }
];

export default function GuidesPage() {
  const [search, setSearch] = useState('');

  const filteredGuides = mockGuides.filter(guide => 
    guide.location.toLowerCase().includes(search.toLowerCase()) ||
    guide.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="bg-primary rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <h1 className="font-headline text-4xl font-bold">Find Local Experts</h1>
          <p className="text-white/80 text-lg">
            Connect with certified local guides who will show you the authentic side of their home city.
          </p>
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input 
              placeholder="Search by location (e.g. Amalapuram)..." 
              className="pl-12 h-14 bg-white text-foreground rounded-xl shadow-lg border-none focus-visible:ring-accent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="hidden lg:block relative w-64 h-64">
           <Image src="https://picsum.photos/seed/guide-hero/512/512" alt="Guide" fill className="object-cover rounded-2xl rotate-3 shadow-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all border-none bg-white">
                <div className="relative h-64 w-full">
                  <Image src={guide.img} alt={guide.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-primary border-none flex items-center gap-1 font-bold">
                      <Star className="w-3 h-3 fill-accent text-accent" /> {guide.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-headline text-xl font-bold flex items-center justify-between">
                      {guide.name}
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                      <MapPin className="w-4 h-4" /> {guide.location}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {guide.languages.map(lang => (
                      <Badge key={lang} variant="secondary" className="bg-secondary/50 text-primary">{lang}</Badge>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground italic">{guide.specialty} Specialist</span>
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-white">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Users className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-headline font-bold">No guides found in this area yet</h3>
            <p className="text-muted-foreground">Try searching for another location like "Amalapuram" or "Tokyo".</p>
          </div>
        )}
      </div>
    </div>
  );
}
