
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Info, ArrowLeft, Camera, Compass } from 'lucide-react';

const mockDestinations = {
  'paris': { 
    name: 'Paris', 
    country: 'France', 
    description: 'Paris, the capital of France, is a major European city and a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
    img: 'https://picsum.photos/seed/paris/1200/600',
    tags: ['Romance', 'Art', 'Cuisine'],
    stats: { visitors: '30M+', rank: '#1 World Wide' }
  },
  'tokyo': { 
    name: 'Tokyo', 
    country: 'Japan', 
    description: "Tokyo, Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods.",
    img: 'https://picsum.photos/seed/tokyo/1200/600',
    tags: ['Culture', 'Futuristic', 'Food'],
    stats: { visitors: '15M+', rank: '#5 World Wide' }
  },
  'amalapuram': { 
    name: 'Amalapuram', 
    country: 'India', 
    description: "Amalapuram is a town in the East Godavari district of Andhra Pradesh, India. It is known for its lush green fields, serene backwaters, and traditional temples. It is the heart of the Konaseema region.",
    img: 'https://picsum.photos/seed/amalapuram/1200/600',
    tags: ['Nature', 'Backwaters', 'Greenery'],
    stats: { visitors: '1M+', rank: 'Coastal Gem' }
  }
};

export default async function DestinationDetailPage({ params }: { params: { id: string } }) {
  const dest = mockDestinations[params.id as keyof typeof mockDestinations];

  if (!dest) return notFound();

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={dest.img} alt={dest.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="space-y-4">
             <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4 group">
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Explorations
             </Link>
             <h1 className="text-white text-6xl md:text-8xl font-headline font-bold drop-shadow-2xl">{dest.name}</h1>
             <div className="flex justify-center gap-2">
                {dest.tags.map(tag => (
                  <Badge key={tag} className="bg-accent text-white border-none px-4 py-1">{tag}</Badge>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
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

          {/* Sidebar: Guides Suggestion */}
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
