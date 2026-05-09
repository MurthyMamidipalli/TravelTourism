'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Info, ArrowLeft, Calendar, Clock, Navigation, 
  Loader2, CloudSun, CloudRain, Star, Wallet, Sparkles, 
  MessageCircle, PartyPopper, Zap, Download
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TouristCard from '@/components/TouristCard';
import DestinationReviews from '@/components/DestinationReviews';
import LocalEvents from '@/components/LocalEvents';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';

// Import map component dynamically to avoid SSR issues with Leaflet
const DestinationMap = dynamic(() => import('@/components/DestinationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-3xl bg-secondary/10 animate-pulse flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground">Loading interactive map...</p>
    </div>
  ),
});

const mockDestinations: Record<string, any> = {
  'tirumala-temple': { id: 'tirumala-temple', name: 'Tirumala Temple', districtId: 'tirupati', district: 'Tirupati', category: 'Pilgrimage', timings: '3AM-12PM', entryFee: '₹300 (Special)', lang: 'Telugu, English', desc: 'World famous Hindu temple on the hills of Tirumala. A spiritual hub of millions.', lat: 13.6833, lng: 79.3500, weather: { temp: '28°C', rain: '5%', bestTime: 'October - March' } },
  'sri-kalahasti': { id: 'sri-kalahasti', name: 'Sri Kalahasti', districtId: 'tirupati', district: 'Tirupati', category: 'Pilgrimage', timings: '6AM-9PM', entryFee: 'Free', lang: 'Telugu', desc: 'Famous Shiva temple known for Vayu Linga and Rahu Ketu Pooja.', lat: 13.7498, lng: 79.6984, weather: { temp: '30°C', rain: '10%', bestTime: 'November - February' } },
  'talakona-waterfalls': { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', districtId: 'tirupati', district: 'Tirupati', category: 'Nature', timings: '6AM-6PM', entryFee: '₹50', lang: 'Telugu', desc: 'Highest waterfall in Andhra Pradesh, located in the Sri Venkateswara National Park.', lat: 13.8055, lng: 79.2222, weather: { temp: '24°C', rain: '40%', bestTime: 'July - September' } },
  'charminar': { id: 'charminar', name: 'Charminar', districtId: 'hyderabad', district: 'Hyderabad', category: 'Heritage', timings: '9AM-5:30PM', entryFee: '₹25', lang: 'Urdu, Telugu', desc: 'Iconic 16th-century mosque and monument in the heart of Hyderabad.', lat: 17.3616, lng: 78.4747, weather: { temp: '32°C', rain: '2%', bestTime: 'October - February' } },
};

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const dest = useMemo(() => {
    return mockDestinations[id] || { 
      id,
      name: id.replace('-', ' ').toUpperCase(), 
      district: 'Unknown', 
      districtId: 'unknown',
      category: 'Travel', 
      timings: '9AM-6PM',
      entryFee: '₹50',
      lang: 'English', 
      desc: 'Explore this breathtaking destination with local experts.', 
      lat: 17.0, 
      lng: 78.0,
      weather: { temp: '27°C', rain: '10%', bestTime: 'Year round' }
    };
  }, [id]);

  const nearbyRecommendations = useMemo(() => {
    return Object.entries(mockDestinations)
      .filter(([key, val]) => val.districtId === dest.districtId && key !== id)
      .slice(0, 4);
  }, [id, dest.districtId]);

  const getDestinationImage = (idKey: string) => {
    const found = PlaceHolderImages.find(img => img.id === idKey);
    return found ? found.imageUrl : `https://picsum.photos/seed/${idKey}/1200/800`;
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={getDestinationImage(id)} alt={dest.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="space-y-4">
             <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4 group bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Explore
             </Link>
             <h1 className="text-white text-6xl md:text-8xl font-headline font-bold drop-shadow-2xl">{dest.name}</h1>
             <div className="flex justify-center gap-2">
                <Badge className="bg-accent text-white border-none px-4 py-1">{dest.category}</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-none px-4 py-1">{dest.district}</Badge>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <Card className="border-none shadow-lg p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem]">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b pb-8">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Info className="w-4 h-4 text-accent" /> Destination Overview
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed font-body">
                    {dest.desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-3">
                       <Clock className="w-6 h-6 text-primary" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Visiting Hours</p>
                         <p className="text-sm font-bold">{dest.timings}</p>
                       </div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-3">
                       <Wallet className="w-6 h-6 text-primary" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Entry Fee</p>
                         <p className="text-sm font-bold">{dest.entryFee}</p>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl min-w-[220px] flex flex-col items-center justify-center text-center">
                  <CloudSun className="w-10 h-10 text-primary mb-2" />
                  <p className="text-3xl font-black">{dest.weather?.temp || '27°C'}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Current Weather</p>
                  <div className="flex items-center gap-4 mt-6 w-full justify-center">
                    <div className="text-xs">
                      <p className="font-bold flex items-center gap-1 text-primary"><CloudRain className="w-3 h-3" /> {dest.weather?.rain || '10%'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase">Rain</p>
                    </div>
                    <div className="text-xs border-l pl-4">
                      <p className="font-bold flex items-center gap-1 text-primary"><Calendar className="w-3 h-3" /> {dest.weather?.bestTime?.split(' ')[0] || 'Year'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase">Best Time</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <Navigation className="w-4 h-4 text-accent" /> Interactive Location
                </div>
                <DestinationMap name={dest.name} lat={dest.lat} lng={dest.lng} />
              </div>
            </Card>

            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="bg-secondary/30 p-1 rounded-2xl mb-8 w-full flex h-auto">
                <TabsTrigger value="reviews" className="rounded-xl flex-1 py-3 flex gap-2">
                  <MessageCircle className="w-4 h-4" /> Community Reviews
                </TabsTrigger>
                <TabsTrigger value="events" className="rounded-xl flex-1 py-3 flex gap-2">
                  <PartyPopper className="w-4 h-4" /> Nearby Events
                </TabsTrigger>
                <TabsTrigger value="nearby" className="rounded-xl flex-1 py-3 flex gap-2">
                  <MapPin className="w-4 h-4" /> Nearby Spots
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews">
                <DestinationReviews destinationId={id} />
              </TabsContent>

              <TabsContent value="events">
                <LocalEvents location={dest.district} />
              </TabsContent>

              <TabsContent value="nearby">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nearbyRecommendations.map(([key, val]) => (
                    <TouristCard
                      key={key}
                      id={key}
                      name={val.name}
                      location={val.district}
                      category={val.category}
                      rating={4.8}
                      description={val.desc}
                      image={getDestinationImage(key)}
                      timings={val.timings}
                      entryFee={val.entryFee}
                    />
                  ))}
                  {nearbyRecommendations.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-secondary/5 rounded-3xl border border-dashed">
                      <p className="text-muted-foreground italic">No other nearby spots mapped for this district yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-primary text-white p-8 rounded-[2rem] sticky top-24">
              <h3 className="font-headline text-2xl font-bold mb-4">Plan with AI</h3>
              <p className="text-white/80 mb-6">Let our AI Travel Assistant craft the perfect day for you in {dest.district}.</p>
              <Link href={`/trip-planner?location=${dest.district}`} className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl h-14 text-lg font-bold shadow-lg">
                  <Zap className="w-5 h-5 mr-2" /> Open AI Planner
                </Button>
              </Link>
            </Card>

            <PersonalizedRecommendations currentCategory={dest.category} currentId={id} />

            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-8 rounded-[2rem] space-y-4">
              <h4 className="font-black flex items-center gap-2 uppercase tracking-widest text-xs text-primary">
                <Download className="w-4 h-4" /> Pro Tip
              </h4>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                Save this destination to access its map and details even when exploring remote areas with limited network connectivity.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
