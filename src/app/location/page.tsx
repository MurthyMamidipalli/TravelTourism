
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const destinations = [
  { id: 'taj-mahal', name: 'Taj Mahal', city: 'Agra', country: 'India', type: 'Heritage/Monument' },
  { id: 'eiffel-tower', name: 'Eiffel Tower', city: 'Paris', country: 'France', type: 'Landmark' },
  { id: 'machu-picchu', name: 'Machu Picchu', city: 'Cusco', country: 'Peru', type: 'Ruins/Adventure' },
  { id: 'great-wall', name: 'Great Wall', city: 'Beijing', country: 'China', type: 'Heritage' },
  { id: 'santorini', name: 'Santorini', city: 'Oia', country: 'Greece', type: 'Beach/Romance' },
  { id: 'colosseum', name: 'Colosseum', city: 'Rome', country: 'Italy', type: 'History/Monument' },
  { id: 'serengeti', name: 'Serengeti', city: 'Arusha', country: 'Tanzania', type: 'Wildlife/Nature' },
  { id: 'angkor-wat', name: 'Angkor Wat', city: 'Siem Reap', country: 'Cambodia', type: 'Temple/Heritage' },
  { id: 'petra', name: 'Petra', city: 'Ma\'an', country: 'Jordan', type: 'Ruins/Desert' },
  { id: 'niagara-falls', name: 'Niagara Falls', city: 'Ontario', country: 'Canada/USA', type: 'Nature' },
  { id: 'bali', name: 'Bali', city: 'Ubud', country: 'Indonesia', type: 'Beach/Culture' },
  { id: 'kyoto', name: 'Kyoto', city: 'Kyoto', country: 'Japan', type: 'Culture/Temple' },
  { id: 'nyc', name: 'New York City', city: 'New York', country: 'USA', type: 'Urban/Arts' },
  { id: 'patagonia', name: 'Patagonia', city: 'El Chaltén', country: 'Argentina/Chile', type: 'Adventure/Nature' },
  { id: 'maldives', name: 'Maldives', city: 'Malé', country: 'Maldives', type: 'Beach/Luxury' },
];

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-accent/20 text-accent border-none mb-2">Exclusive Map</Badge>
          <h1 className="font-headline text-4xl font-bold text-primary">Browse 15 Global Wonders</h1>
          <p className="text-muted-foreground max-w-xl">
            A curated list of the world's most breathtaking tourist spots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((loc) => {
          const imgData = PlaceHolderImages.find(img => img.id === loc.id) || PlaceHolderImages[0];
          return (
            <Link key={loc.id} href={`/destinations/${loc.id}`}>
              <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={imgData.imageUrl} 
                    alt={loc.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    data-ai-hint={imgData.imageHint}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary border-none shadow-sm">{loc.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline text-2xl font-bold mb-1">{loc.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-1 text-sm font-medium mb-4">
                      <MapPin className="w-4 h-4 text-accent" /> {loc.city}, {loc.country}
                    </p>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between text-primary font-bold group-hover:text-accent transition-colors">
                    <span>Explore Place</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
