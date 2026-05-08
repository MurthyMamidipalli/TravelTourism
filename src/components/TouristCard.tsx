
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
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
  // Construct a Google Maps search URL for the specific place
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${location}`)}`;

  return (
    <Card className="premium-card overflow-hidden group h-full flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-primary hover:bg-white border-none shadow-md backdrop-blur-sm px-3 py-1 font-bold capitalize">
            {category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-sm border">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-black text-zinc-900">{rating.toFixed(1)}</span>
        </div>
      </div>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="space-y-1 mb-4">
          <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-accent" /> <span className="line-clamp-1">{location}</span>
          </p>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6 flex-grow">
          {description}
        </p>
        <div className="flex gap-3 mt-auto">
          <Button variant="outline" className="flex-1 rounded-xl h-11 border-zinc-200 hover:border-primary hover:text-primary transition-all" asChild>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 w-4 h-4" /> Maps
            </a>
          </Button>
          <Button className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
            <Link href={`/destinations/${id}`}>
              Details <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
