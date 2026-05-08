
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TouristCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  description: string;
  location: string;
  category: string;
}

export default function TouristCard({ id, name, image, rating, description, location, category }: TouristCardProps) {
  return (
    <Card className="premium-card overflow-hidden group">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-primary hover:bg-white border-none shadow-sm">{category}</Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-zinc-900">{rating}</span>
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold line-clamp-1">{name}</h3>
          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {location}
          </p>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 rounded-xl" asChild>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`} target="_blank" rel="noopener noreferrer">
              Maps
            </a>
          </Button>
          <Button className="flex-1 rounded-xl bg-primary hover:bg-primary/90" asChild>
            <Link href={`/attractions/${id}`}>
              Details <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
