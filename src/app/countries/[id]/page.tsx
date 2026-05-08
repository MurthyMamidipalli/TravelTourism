
'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCitiesByCountry: Record<string, any> = {
  'france': [
    { id: 'paris', name: 'Paris', desc: 'The City of Light, known for the Eiffel Tower and romance.', img: 'https://picsum.photos/seed/paris/600/400', pop: '2.1M' },
    { id: 'lyon', name: 'Lyon', desc: 'Renowned as France\'s gastronomic capital.', img: 'https://picsum.photos/seed/lyon/600/400', pop: '513k' },
    { id: 'nice', name: 'Nice', desc: 'A stunning coastal city on the French Riviera.', img: 'https://picsum.photos/seed/nice/600/400', pop: '342k' },
  ],
  'japan': [
    { id: 'tokyo', name: 'Tokyo', desc: 'A neon metropolis blending tradition with the future.', img: 'https://picsum.photos/seed/tokyo/600/400', pop: '14M' },
    { id: 'kyoto', name: 'Kyoto', desc: 'The cultural heart of Japan with thousands of temples.', img: 'https://picsum.photos/seed/kyoto/600/400', pop: '1.4M' },
  ]
};

export default function CountryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const cities = mockCitiesByCountry[id] || [];
  const countryName = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[40vh] overflow-hidden">
        <Image 
          src={`https://picsum.photos/seed/${id}-hero/1920/1080`} 
          alt={countryName} 
          fill 
          className="object-cover brightness-[0.7]" 
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <Link href="/locations" className="mb-6 flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Countries
          </Link>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-center"
          >
            Explore {countryName}
          </motion.h1>
          <p className="mt-4 text-xl font-medium opacity-90">Discover the major hubs and hidden gems.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Major Cities</h2>
            <p className="text-muted-foreground">The beating hearts of {countryName}</p>
          </div>
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
            {cities.length} Cities Found
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city: any, idx: number) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/cities/${city.id}`}>
                <Card className="premium-card group h-full">
                  <div className="relative h-56">
                    <Image src={city.img} alt={city.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">{city.name}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Users className="w-4 h-4" /> {city.pop}
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{city.desc}</p>
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-primary font-bold flex items-center gap-1">
                        View Attractions <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
