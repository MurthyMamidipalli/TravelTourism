
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const destinations = [
  { id: 'paris', name: 'Eiffel Tower', city: 'Paris', country: 'France', type: 'Monument' },
  { id: 'tokyo', name: 'Shibuya Crossing', city: 'Tokyo', country: 'Japan', type: 'Urban' },
  { id: 'amalapuram', name: 'Konaseema Backwaters', city: 'Amalapuram', country: 'India', type: 'Nature' },
  { id: 'agra', name: 'Taj Mahal', city: 'Agra', country: 'India', type: 'History' },
  { id: 'rome', name: 'The Colosseum', city: 'Rome', country: 'Italy', type: 'History' },
  { id: 'venice', name: 'Grand Canal', city: 'Venice', country: 'Italy', type: 'Vibrant' },
  { id: 'bali', name: 'Uluwatu Temple', city: 'Bali', country: 'Indonesia', type: 'Spiritual' },
  { id: 'london', name: 'Big Ben', city: 'London', country: 'UK', type: 'History' },
  { id: 'santorini', name: 'Oia Cliffs', city: 'Santorini', country: 'Greece', type: 'Views' },
  { id: 'machu-picchu', name: 'Incan Citadel', city: 'Machu Picchu', country: 'Peru', type: 'Archaeology' },
  { id: 'dubai', name: 'Burj Khalifa', city: 'Dubai', country: 'UAE', type: 'Modern' },
  { id: 'new-york', name: 'Times Square', city: 'New York', country: 'USA', type: 'Urban' },
  { id: 'grand-canyon', name: 'Grand Canyon North Rim', city: 'Grand Canyon', country: 'USA', type: 'Nature' },
  { id: 'sydney', name: 'Opera House', city: 'Sydney', country: 'Australia', type: 'Coastal' },
  { id: 'cairo', name: 'The Great Pyramids', city: 'Cairo', country: 'Egypt', type: 'History' },
  { id: 'kyoto', name: 'Fushimi Inari', city: 'Kyoto', country: 'Japan', type: 'Cultural' },
  { id: 'rio', name: 'Copacabana Beach', city: 'Rio de Janeiro', country: 'Brazil', type: 'Vibrant' },
  { id: 'cape-town', name: 'Table Mountain', city: 'Cape Town', country: 'South Africa', type: 'Coastal' },
  { id: 'petra', name: 'The Treasury', city: 'Petra', country: 'Jordan', type: 'History' },
  { id: 'barcelona', name: 'Sagrada Familia', city: 'Barcelona', country: 'Spain', type: 'Cultural' },
];

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-accent/20 text-accent border-none mb-2">Global Map</Badge>
          <h1 className="font-headline text-4xl font-bold text-primary">Browse All Locations</h1>
          <p className="text-muted-foreground max-w-xl">
            A comprehensive list of the world's most breathtaking tourist spots. Find where you want to go next.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Nature', 'History', 'Urban', 'Coastal', 'Cultural'].map((type) => (
            <Badge key={type} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((loc) => {
          const imgData = PlaceHolderImages.find(img => img.id === loc.id || (loc.id === 'machu-picchu' && img.id === 'machu')) || PlaceHolderImages[0];
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
