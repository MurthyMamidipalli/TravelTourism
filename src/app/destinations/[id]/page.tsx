
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
  MapPin, Info, ArrowLeft, Clock, Navigation, 
  Loader2, CloudSun, CloudRain, Star, Wallet, Zap, Download,
  MessageCircle, PartyPopper, Calendar
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import TouristCard from '@/components/TouristCard';
import DestinationReviews from '@/components/DestinationReviews';
import LocalEvents from '@/components/LocalEvents';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';

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
  // Telangana Spreadsheet Integration
  'charminar': { id: 'charminar', name: 'Charminar', districtId: 'hyderabad', district: 'Hyderabad', category: 'Historical', timings: '9AM-5:30PM', entryFee: '₹25', desc: 'Iconic 16th-century mosque and global landmark of Hyderabad.', lat: 17.3616, lng: 78.4747 },
  'golconda-fort': { id: 'golconda-fort', name: 'Golconda Fort', districtId: 'hyderabad', district: 'Hyderabad', category: 'Historical', timings: '9AM-5PM', entryFee: '₹25', desc: 'Historic citadel and former capital of the Qutb Shahis.', lat: 17.3833, lng: 78.4011 },
  'ramoji-film-city': { id: 'ramoji-film-city', name: 'Ramoji Film City', districtId: 'ranga-reddy', district: 'Ranga Reddy', category: 'Entertainment', timings: '9AM-5:30PM', entryFee: '₹1150', desc: 'World\'s largest film studio complex and theme park.', lat: 17.2543, lng: 78.6808 },
  'birla-mandir': { id: 'birla-mandir', name: 'Birla Mandir', districtId: 'hyderabad', district: 'Hyderabad', category: 'Temple', timings: '7AM-9PM', entryFee: 'Free', desc: 'Exquisite white marble temple on Naubath Pahad.', lat: 17.4062, lng: 78.4691 },
  'yadadri-temple': { id: 'yadadri-temple', name: 'Yadadri Temple', districtId: 'yadadri', district: 'Yadadri Bhuvanagiri', category: 'Temple', timings: '5AM-9PM', entryFee: 'Free', desc: 'Renovated architectural marvel dedicated to Lord Narasimha.', lat: 17.59, lng: 78.943 },
  'basara-temple': { id: 'basara-temple', name: 'Basara Saraswati Temple', districtId: 'nirmal', district: 'Nirmal', category: 'Temple', timings: '4AM-8PM', entryFee: 'Free', desc: 'Sacred temple of the Goddess of Knowledge.', lat: 18.88, lng: 77.97 },
  'keesaragutta': { id: 'keesaragutta', name: 'Keesaragutta Temple', districtId: 'medchal', district: 'Medchal-Malkajgiri', category: 'Temple', timings: '6AM-8PM', entryFee: 'Free', desc: 'Ancient hill temple dedicated to Lord Shiva.', lat: 17.5288, lng: 78.6826 },
  'ramappa-temple': { id: 'ramappa-temple', name: 'Ramappa Temple', districtId: 'mulugu', district: 'Mulugu', category: 'Temple', timings: '6AM-6PM', entryFee: 'Free', desc: 'UNESCO Heritage site known for its intricate carvings.', lat: 18.2591, lng: 79.9431 },
  'thousand-pillar': { id: 'thousand-pillar', name: 'Thousand Pillar Temple', districtId: 'hanamkonda', district: 'Hanamkonda', category: 'Temple', timings: '6AM-8PM', entryFee: 'Free', desc: 'Masterpiece of Kakatiya architecture.', lat: 18.0036, lng: 79.5747 },
  'bhadrachalam': { id: 'bhadrachalam', name: 'Bhadrachalam Temple', districtId: 'bhadradri', district: 'Bhadradri Kothagudem', category: 'Temple', timings: '4AM-9PM', entryFee: 'Free', desc: 'Major pilgrimage site on the Godavari River.', lat: 17.6688, lng: 80.888 },
  'bogatha-falls': { id: 'bogatha-falls', name: 'Bogatha Waterfalls', districtId: 'mulugu', district: 'Mulugu', category: 'Waterfall', timings: '9AM-5PM', entryFee: '₹50', desc: 'Breathtaking waterfall amidst lush forests.', lat: 17.9575, lng: 80.825 },
  'kuntala-falls': { id: 'kuntala-falls', name: 'Kuntala Waterfalls', districtId: 'nirmal', district: 'Nirmal', category: 'Waterfall', timings: '6AM-6PM', entryFee: '₹20', desc: 'Highest waterfall in the state of Telangana.', lat: 19.2167, lng: 78.5167 },
  'nagarjuna-sagar-dam': { id: 'nagarjuna-sagar-dam', name: 'Nagarjuna Sagar Dam', districtId: 'nalgonda', district: 'Nalgonda', category: 'Dam', timings: '9AM-6PM', entryFee: '₹20', desc: 'Engineering marvel and major tourist hub.', lat: 16.5756, lng: 79.312 },
  'hussain-sagar': { id: 'hussain-sagar', name: 'Hussain Sagar Lake', districtId: 'hyderabad', district: 'Hyderabad', category: 'Lake', timings: '24/7', entryFee: 'Free', desc: 'Scenic lake connecting the twin cities.', lat: 17.4239, lng: 78.4738 },
  'laknavaram-lake': { id: 'laknavaram-lake', name: 'Laknavaram Lake', districtId: 'mulugu', district: 'Mulugu', category: 'Lake', timings: '8AM-6PM', entryFee: '₹50', desc: 'Beautiful lake with a unique hanging bridge.', lat: 18.2, lng: 80.0167 },
  'bhongir-fort': { id: 'bhongir-fort', name: 'Bhongir Fort', districtId: 'yadadri', district: 'Yadadri Bhuvanagiri', category: 'Historical', timings: '10AM-5PM', entryFee: '₹10', desc: 'Massive monolithic fort offering spectacular views.', lat: 17.515, lng: 78.885 },
};

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const dest = useMemo(() => {
    return mockDestinations[id] || { 
      id,
      name: id.replace('-', ' ').toUpperCase(), 
      district: 'Unknown', 
      districtId: 'unknown',
      category: 'Landmark', 
      timings: '9AM-6PM',
      entryFee: '₹50',
      desc: 'Explore this breathtaking destination with local experts.', 
      lat: 17.3850, 
      lng: 78.4867,
      weather: { temp: '28°C', rain: '5%', bestTime: 'Oct to Mar' }
    };
  }, [id]);

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
            <Card className="border-none shadow-xl p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem]">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b pb-8">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Info className="w-4 h-4 text-accent" /> Destination Overview
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed font-body">{dest.desc}</p>
                  
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
                  <p className="text-3xl font-black">{dest.weather?.temp || '28°C'}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Current Weather</p>
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
              </TabsList>
              
              <TabsContent value="reviews">
                <DestinationReviews destinationId={id} />
              </TabsContent>

              <TabsContent value="events">
                <LocalEvents location={dest.district} />
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
