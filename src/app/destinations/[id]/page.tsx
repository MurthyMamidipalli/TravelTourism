
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Info, ArrowLeft, Camera, Compass } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockDestinations: Record<string, any> = {
  'paris': { 
    name: 'Paris', 
    country: 'France', 
    description: 'Paris, the capital of France, is a major European city and a global center for art, fashion, gastronomy, and culture.',
    tags: ['Romance', 'Art', 'Cuisine'],
    stats: { visitors: '30M+', rank: '#1 World Wide' }
  },
  'tokyo': { 
    name: 'Tokyo', 
    country: 'Japan', 
    description: "Tokyo, Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.",
    tags: ['Culture', 'Futuristic', 'Food'],
    stats: { visitors: '15M+', rank: '#5 World Wide' }
  },
  'bali': {
    name: 'Bali',
    country: 'Indonesia',
    description: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
    tags: ['Tropical', 'Spiritual', 'Relaxation'],
    stats: { visitors: '6M+', rank: '#1 Island' }
  },
  'amalapuram': { 
    name: 'Amalapuram', 
    country: 'India', 
    description: "Amalapuram is the heart of the Konaseema region, known for its lush green fields, serene backwaters, and traditional temples.",
    tags: ['Nature', 'Backwaters', 'Greenery'],
    stats: { visitors: '1M+', rank: 'Coastal Gem' }
  },
  'rome': {
    name: 'Rome',
    country: 'Italy',
    description: 'Rome, the capital city of Italy, is a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture.',
    tags: ['History', 'Art', 'Cuisine'],
    stats: { visitors: '10M+', rank: '#2 Europe' }
  },
  'london': {
    name: 'London',
    country: 'UK',
    description: 'London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times.',
    tags: ['History', 'Royal', 'Diversity'],
    stats: { visitors: '20M+', rank: '#3 World Wide' }
  },
  'santorini': {
    name: 'Santorini',
    country: 'Greece',
    description: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC.',
    tags: ['Views', 'Luxury', 'Romance'],
    stats: { visitors: '2M+', rank: '#1 Greek Island' }
  },
  'machu-picchu': {
    name: 'Machu Picchu',
    country: 'Peru',
    description: 'Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley.',
    tags: ['Ancient', 'Adventure', 'Mountains'],
    stats: { visitors: '1.5M+', rank: 'Wonder of World' }
  },
  'dubai': {
    name: 'Dubai',
    country: 'UAE',
    description: 'Dubai is a city and emirate in the United Arab Emirates luxury shopping, ultramodern architecture and a lively nightlife scene.',
    tags: ['Modern', 'Luxury', 'Desert'],
    stats: { visitors: '16M+', rank: '#4 World Wide' }
  },
  'new-york': {
    name: 'New York',
    country: 'USA',
    description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan.',
    tags: ['Urban', 'Shopping', 'Energy'],
    stats: { visitors: '60M+', rank: '#1 US' }
  },
  'sydney': {
    name: 'Sydney',
    country: 'Australia',
    description: 'Sydney, capital of New South Wales and one of Australia\'s largest cities, is best known for its harbourfront Sydney Opera House.',
    tags: ['Coastal', 'Surfing', 'Harbour'],
    stats: { visitors: '4M+', rank: '#1 AU' }
  },
  'cairo': {
    name: 'Cairo',
    country: 'Egypt',
    description: 'Cairo is Egypt’s sprawling capital, set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum.',
    tags: ['Antiquity', 'History', 'Nile'],
    stats: { visitors: '9M+', rank: '#1 Africa' }
  },
  'kyoto': {
    name: 'Kyoto',
    country: 'Japan',
    description: 'Kyoto, once the capital of Japan, is a city on the island of Honshu. It\'s famous for its numerous classical Buddhist temples.',
    tags: ['Zen', 'Gardens', 'History'],
    stats: { visitors: '10M+', rank: 'Cultural Heart' }
  },
  'rio': {
    name: 'Rio de Janeiro',
    country: 'Brazil',
    description: 'Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches.',
    tags: ['Festival', 'Beaches', 'Vibrant'],
    stats: { visitors: '2M+', rank: '#1 South America' }
  },
  'cape-town': {
    name: 'Cape Town',
    country: 'South Africa',
    description: 'Cape Town is a port city on South Africa’s southwest coast, on a peninsula beneath the imposing Table Mountain.',
    tags: ['Scenic', 'Coastal', 'Adventure'],
    stats: { visitors: '1.5M+', rank: '#1 SA' }
  }
};

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dest = mockDestinations[id];

  if (!dest) return notFound();

  const imgData = PlaceHolderImages.find(img => img.id === id || (id === 'machu-picchu' && img.id === 'machu')) || PlaceHolderImages[0];

  return (
    <div className="flex flex-col">
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={imgData.imageUrl} alt={dest.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="space-y-4">
             <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4 group">
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Explorations
             </Link>
             <h1 className="text-white text-6xl md:text-8xl font-headline font-bold drop-shadow-2xl">{dest.name}</h1>
             <div className="flex justify-center gap-2">
                {dest.tags.map((tag: string) => (
                  <Badge key={tag} className="bg-accent text-white border-none px-4 py-1">{tag}</Badge>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-lg p-8 bg-white rounded-3xl">
              <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                <Info className="w-5 h-5 text-accent" /> Destination Overview
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-body">
                {dest.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 mt-8 border-t">
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Annual Visitors</p>
                   <p className="text-xl font-bold">{dest.stats.visitors}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Compass className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Travel Rank</p>
                   <p className="text-xl font-bold">{dest.stats.rank}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl hidden sm:block">
                   <Camera className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Photo Spots</p>
                   <p className="text-xl font-bold">500+</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
               <h3 className="font-headline text-2xl font-bold">Top Local Experiences</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                       <h4 className="font-bold text-primary mb-1">Authentic Tour {i}</h4>
                       <p className="text-sm text-muted-foreground">Discover the hidden alleyways and local culture with an expert guide.</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-primary text-white p-8 rounded-3xl sticky top-24">
              <h3 className="font-headline text-2xl font-bold mb-4">Local Guides in {dest.name}</h3>
              <p className="text-white/80 mb-6">Connect with certified experts who live and breathe this city.</p>
              <div className="space-y-4">
                {[
                  { name: 'Suresh Kumar', rating: 4.9, img: 'https://picsum.photos/seed/g1/100/100' },
                  { name: 'Anita Rao', rating: 4.8, img: 'https://picsum.photos/seed/g2/100/100' }
                ].map((guide, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/10 rounded-2xl">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={guide.img} alt={guide.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold">{guide.name}</p>
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <MapPin className="w-3 h-3" /> Licensed Guide
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/guides?search=${dest.name}`} className="block mt-8">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl h-12 shadow-lg shadow-accent/20">
                  Find More Guides
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
