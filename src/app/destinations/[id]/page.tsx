
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
  // New Destinations from list
  'tirumala-temple': { id: 'tirumala-temple', name: 'Tirumala Temple', districtId: 'tirupati', district: 'Tirupati', category: 'Temple', timings: '3AM-12PM', entryFee: '₹300', desc: 'World famous Hindu temple on the hills of Tirumala.', lat: 13.6833, lng: 79.3476 },
  'srisailam': { id: 'srisailam', name: 'Srisailam Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', timings: '5AM-9PM', entryFee: 'Free', desc: 'Ancient Shiva temple and one of the 12 Jyotirlingas.', lat: 16.0728, lng: 78.8687 },
  'simhachalam': { id: 'simhachalam', name: 'Simhachalam Temple', districtId: 'vizag', district: 'Visakhapatnam', category: 'Temple', timings: '6AM-9PM', entryFee: 'Free', desc: 'Varaha Lakshmi Narasimha temple.', lat: 17.7669, lng: 83.2506 },
  'kanaka-durga': { id: 'kanaka-durga', name: 'Kanaka Durga Temple', districtId: 'ntr', district: 'NTR', category: 'Temple', timings: '4AM-9PM', entryFee: 'Free', desc: 'Famous shrine of Goddess Durga.', lat: 16.5083, lng: 80.648 },
  'annavaram': { id: 'annavaram', name: 'Annavaram Temple', districtId: 'kakinada', district: 'Kakinada', category: 'Temple', timings: '5AM-9PM', entryFee: 'Free', desc: 'Sacred temple of Lord Satyanarayana Swami.', lat: 17.2815, lng: 82.4011 },
  'lepakshi': { id: 'lepakshi', name: 'Lepakshi Temple', districtId: 'sss', district: 'Sri Sathya Sai', category: 'Temple', timings: '6AM-6PM', entryFee: 'Free', desc: 'Famous for its hanging pillar.', lat: 13.8, lng: 77.609 },
  'ahobilam': { id: 'ahobilam', name: 'Ahobilam Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', timings: '6AM-5PM', entryFee: 'Free', desc: 'Navanarasimha Kshetram.', lat: 15.1333, lng: 78.7167 },
  'mahanandi': { id: 'mahanandi', name: 'Mahanandi Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', timings: '5AM-9PM', entryFee: 'Free', desc: 'Ancient temple with crystal clear water.', lat: 15.4868, lng: 78.6164 },
  'yaganti': { id: 'yaganti', name: 'Yaganti Temple', districtId: 'nandyal', district: 'Nandyal', category: 'Temple', timings: '6AM-8PM', entryFee: 'Free', desc: 'Famous for the growing stone crow.', lat: 15.1685, lng: 78.2262 },
  'suryalanka': { id: 'suryalanka', name: 'Suryalanka Beach', districtId: 'bapatla', district: 'Bapatla', category: 'Beach', timings: '24/7', entryFee: 'Free', desc: 'Popular weekend getaway.', lat: 15.8452, lng: 80.537 },
  'rk-beach': { id: 'rk-beach', name: 'RK Beach', districtId: 'vizag', district: 'Visakhapatnam', category: 'Beach', timings: '24/7', entryFee: 'Free', desc: 'The most popular urban beach.', lat: 17.782, lng: 83.385 },
  'rushikonda': { id: 'rushikonda', name: 'Rushikonda Beach', districtId: 'vizag', district: 'Visakhapatnam', category: 'Beach', timings: '24/7', entryFee: 'Free', desc: 'Blue Flag certified beach.', lat: 17.7149, lng: 83.3237 },
  'yarada-beach': { id: 'yarada-beach', name: 'Yarada Beach', districtId: 'vizag', district: 'Visakhapatnam', category: 'Beach', timings: '24/7', entryFee: 'Free', desc: 'Secluded beach surrounded by hills.', lat: 17.6588, lng: 83.2747 },
  'manginapudi': { id: 'manginapudi', name: 'Machilipatnam Beach', districtId: 'krishna', district: 'Krishna', category: 'Beach', timings: '24/7', entryFee: 'Free', desc: 'Unique beach with black soil.', lat: 16.1723, lng: 81.1389 },
  'mypadu': { id: 'mypadu', name: 'Mypadu Beach', districtId: 'nellore', district: 'SPSR Nellore', category: 'Beach', timings: '24/7', entryFee: 'Free', desc: 'Pristine coastline with golden sands.', lat: 14.4421, lng: 80.0352 },
  'araku-valley': { id: 'araku-valley', name: 'Araku Valley', districtId: 'asr', district: 'ASR District', category: 'Hill Station', timings: '24/7', entryFee: 'Free', desc: 'Beautiful hill station with coffee plantations.', lat: 18.327, lng: 82.8806 },
  'lambasingi': { id: 'lambasingi', name: 'Lambasingi', districtId: 'asr', district: 'ASR District', category: 'Hill Station', timings: '24/7', entryFee: 'Free', desc: 'Known as the Kashmir of Andhra Pradesh.', lat: 17.9994, lng: 82.7268 },
  'madanapalle': { id: 'madanapalle', name: 'Madanapalle', districtId: 'annamayya', district: 'Annamayya', category: 'Hill Station', timings: '24/7', entryFee: 'Free', desc: 'Pleasant climate hill station.', lat: 13.658, lng: 78.392 },
  'borra-caves': { id: 'borra-caves', name: 'Borra Caves', districtId: 'asr', district: 'ASR District', category: 'Caves', timings: '10AM-5PM', entryFee: '₹60', desc: 'Millions of years old limestone caves.', lat: 18.2797, lng: 83.0416 },
  'belum-caves': { id: 'belum-caves', name: 'Belum Caves', districtId: 'nandyal', district: 'Nandyal', category: 'Caves', timings: '10AM-5PM', entryFee: '₹65', desc: 'Second largest cave system in India.', lat: 15.1075, lng: 78.1108 },
  'undavalli-caves': { id: 'undavalli-caves', name: 'Undavalli Caves', districtId: 'guntur', district: 'Guntur', category: 'Caves', timings: '9AM-6PM', entryFee: '₹25', desc: 'Monolithic rock-cut caves.', lat: 16.4955, lng: 80.5807 },
  'talakona-waterfalls': { id: 'talakona-waterfalls', name: 'Talakona Waterfalls', districtId: 'annamayya', district: 'Annamayya', category: 'Waterfall', timings: '6AM-6PM', entryFee: '₹50', desc: 'Highest waterfall in Andhra Pradesh.', lat: 13.8156, lng: 79.2177 },
  'ethipothala-falls': { id: 'ethipothala-falls', name: 'Ethipothala Falls', districtId: 'palnadu', district: 'Palnadu', category: 'Waterfall', timings: '6AM-6PM', entryFee: '₹20', desc: 'Beautiful cascade formed by three streams.', lat: 16.2062, lng: 79.3174 },
  'katiki-falls': { id: 'katiki-falls', name: 'Katiki Waterfalls', districtId: 'asr', district: 'ASR District', category: 'Waterfall', timings: '6AM-5PM', entryFee: 'Free', desc: 'Stunning waterfall near Araku.', lat: 18.252, lng: 82.973 },
  'charminar': { id: 'charminar', name: 'Charminar', districtId: 'hyderabad', district: 'Hyderabad', category: 'Heritage', timings: '9AM-5:30PM', entryFee: '₹25', desc: 'Iconic 16th-century mosque.', lat: 17.3616, lng: 78.4747 },
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
