
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Info, ArrowLeft, Camera, Compass, Globe, Calendar, DollarSign } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockDestinations: Record<string, any> = {
  'taj-mahal': { 
    name: 'Taj Mahal', country: 'India', category: 'Heritage/Monument', season: 'Oct-Mar', budget: '$150', language: 'Hindi', currency: 'INR',
    description: 'Ivory marble mausoleum, Shah Jahan\'s love story, Yamuna riverfront. One of the Seven Wonders of the World.'
  },
  'eiffel-tower': { 
    name: 'Eiffel Tower', country: 'France', category: 'Landmark', season: 'Apr-Jun', budget: '$250', language: 'French', currency: 'EUR',
    description: 'Iron lattice icon, Seine cruise, Champ de Mars picnic. The ultimate symbol of Paris.'
  },
  'machu-picchu': { 
    name: 'Machu Picchu', country: 'Peru', category: 'Ruins/Adventure', season: 'May-Sep', budget: '$300', language: 'Spanish', currency: 'PEN',
    description: 'Inca citadel, Sun Gate sunrise, Huayna Picchu hike. A mystical archaeological wonder high in the Andes.'
  },
  'great-wall': { 
    name: 'Great Wall of China', country: 'China', category: 'Heritage', season: 'Apr-Oct', budget: '$200', language: 'Mandarin', currency: 'CNY',
    description: 'Mutianyu section, watchtowers, cable car ride. Stretching across miles of breathtaking terrain.'
  },
  'santorini': { 
    name: 'Santorini', country: 'Greece', category: 'Beach/Romance', season: 'Jun-Sep', budget: '$700', language: 'Greek', currency: 'EUR',
    description: 'Caldera sunset, white-blue architecture, wine tasting. The most romantic island in the Aegean.'
  },
  'colosseum': { 
    name: 'Colosseum', country: 'Italy', category: 'History/Monument', season: 'Apr-Jun', budget: '$180', language: 'Italian', currency: 'EUR',
    description: 'Gladiator arena, Roman Forum, Palatine Hill. Witness the grandeur of Ancient Rome.'
  },
  'serengeti': { 
    name: 'Safari - Serengeti', country: 'Tanzania', category: 'Wildlife/Nature', season: 'Jun-Oct', budget: '$2500', language: 'Swahili', currency: 'TZS',
    description: 'Big Five game drives, wildebeest migration, hot-air balloon. A quintessential African wildlife experience.'
  },
  'angkor-wat': { 
    name: 'Angkor Wat', country: 'Cambodia', category: 'Temple/Heritage', season: 'Nov-Mar', budget: '$120', language: 'Khmer', currency: 'KHR',
    description: 'Khmer empire temples, sunrise reflection, Bayon faces. The world\'s largest religious monument.'
  },
  'petra': { 
    name: 'Petra', country: 'Jordan', category: 'Ruins/Desert', season: 'Mar-May', budget: '$150', language: 'Arabic', currency: 'JOD',
    description: 'Treasury rock-cut facade, Siq canyon, Monastery hike. A legendary city carved into rose-red cliffs.'
  },
  'niagara-falls': { 
    name: 'Niagara Falls', country: 'Canada/USA', category: 'Nature', season: 'Jun-Aug', budget: '$200', language: 'English', currency: 'CAD/USD',
    description: 'Horseshoe Falls, Maid of the Mist boat, light show. A thunderous natural display of power.'
  },
  'bali': { 
    name: 'Bali', country: 'Indonesia', category: 'Beach/Culture', season: 'Apr-Oct', budget: '$600', language: 'Balinese', currency: 'IDR',
    description: 'Ubud rice terraces, temple ceremonies, surf beaches. An island paradise blending spirituality and nature.'
  },
  'kyoto': { 
    name: 'Kyoto', country: 'Japan', category: 'Culture/Temple', season: 'Mar-Apr, Nov', budget: '$800', language: 'Japanese', currency: 'JPY',
    description: 'Fushimi Inari, geisha district Gion, bamboo grove. The historic and cultural soul of Japan.'
  },
  'nyc': { 
    name: 'New York City', country: 'USA', category: 'Urban/Arts', season: 'Sep-Nov', budget: '$1200', language: 'English', currency: 'USD',
    description: 'Times Square, Central Park, Statue of Liberty, Broadway. The city that never sleeps.'
  },
  'patagonia': { 
    name: 'Patagonia', country: 'Argentina/Chile', category: 'Adventure/Nature', season: 'Nov-Mar', budget: '$1800', language: 'Spanish', currency: 'ARS/CLP',
    description: 'Torres del Paine, Perito Moreno glacier, trekking. Pristine wilderness at the end of the world.'
  },
  'maldives': { 
    name: 'Maldives', country: 'Maldives', category: 'Beach/Luxury', season: 'Nov-Apr', budget: '$2000', language: 'Dhivehi', currency: 'MVR',
    description: 'Overwater bungalows, coral reefs, bioluminescent beach. The ultimate tropical luxury escape.'
  }
};

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dest = mockDestinations[id];

  if (!dest) return notFound();

  const imgData = PlaceHolderImages.find(img => img.id === id) || { imageUrl: 'https://picsum.photos/seed/default/1200/800', imageHint: 'Travel scenery' };

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
                <Badge className="bg-accent text-white border-none px-4 py-1">{dest.category}</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-none px-4 py-1">{dest.country}</Badge>
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
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 mt-8 border-t">
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Best Time</p>
                   <p className="text-sm font-bold">{dest.season}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Avg Budget</p>
                   <p className="text-sm font-bold">{dest.budget}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Globe className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Language</p>
                   <p className="text-sm font-bold">{dest.language}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Compass className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Currency</p>
                   <p className="text-sm font-bold">{dest.currency}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
               <h3 className="font-headline text-2xl font-bold">Top Local Experiences</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                       <h4 className="font-bold text-primary mb-1">Authentic Tour {i}</h4>
                       <p className="text-sm text-muted-foreground">Discover the hidden gems of {dest.name} with an expert local guide.</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-primary text-white p-8 rounded-3xl sticky top-24">
              <h3 className="font-headline text-2xl font-bold mb-4">Local Guides</h3>
              <p className="text-white/80 mb-6">Connect with certified experts who live and breathe {dest.name}.</p>
              <div className="space-y-4">
                {[
                  { name: 'Local Expert 1', rating: 4.9, img: 'https://picsum.photos/seed/g1/100/100' },
                  { name: 'Local Expert 2', rating: 4.8, img: 'https://picsum.photos/seed/g2/100/100' }
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
              <Link href={`/guides?search=${dest.country}`} className="block mt-8">
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
