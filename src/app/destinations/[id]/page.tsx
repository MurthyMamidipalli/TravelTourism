import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, ArrowLeft, Compass, Globe, Calendar, Clock } from 'lucide-react';

const mockDestinations: Record<string, any> = {
  'tirumala-temple': { name: 'Tirumala Temple', district: 'Tirupati', itinerary: '2 Days', category: 'Pilgrimage', lang: 'Telugu, English', desc: 'World famous Hindu temple on the hills of Tirumala. A spiritual hub of millions.' },
  'sri-kalahasti': { name: 'Sri Kalahasti', district: 'Tirupati', itinerary: '1 Day', category: 'Pilgrimage', lang: 'Telugu', desc: 'Famous Shiva temple known for Vayu Linga and Rahu Ketu Pooja.' },
  'talakona-waterfalls': { name: 'Talakona Waterfalls', district: 'Tirupati', itinerary: '1 Day', category: 'Nature', lang: 'Telugu', desc: 'Highest waterfall in Andhra Pradesh, located in the Sri Venkateswara National Park.' },
  'chandragiri-fort': { name: 'Chandragiri Fort', district: 'Tirupati', itinerary: 'Half Day', category: 'Heritage', lang: 'Telugu', desc: 'Historical fort and palace of the Vijayanagara Empire.' },
  'vizag': { name: 'Visakhapatnam (Vizag)', district: 'Visakhapatnam', itinerary: '3 Days', category: 'City', lang: 'Telugu, English', desc: 'A port city known for its beautiful beaches, hill stations, and submarine museum.' },
  'rk-beach': { name: 'RK Beach', district: 'Vizag', itinerary: 'Half Day', category: 'Beach', lang: 'Telugu', desc: 'The most popular beach in Vizag, perfect for evening walks.' },
  'kailasagiri': { name: 'Kailasagiri', district: 'Vizag', itinerary: 'Half Day', category: 'Park', lang: 'Telugu', desc: 'Hilltop park offering a panoramic view of the Vizag coastline.' },
  'ins-kurusura': { name: 'INS Kurusura Museum', district: 'Vizag', itinerary: 'Half Day', category: 'Museum', lang: 'English', desc: 'Real decommissioned submarine converted into a museum on the beach.' },
  'yarada-beach': { name: 'Yarada Beach', district: 'Vizag', itinerary: '1 Day', category: 'Beach', lang: 'Telugu', desc: 'Pristine beach surrounded by hills, offering a tranquil escape.' },
  'simhachalam-temple': { name: 'Simhachalam Temple', district: 'Vizag', itinerary: 'Half Day', category: 'Pilgrimage', lang: 'Telugu', desc: 'Ancient temple dedicated to Lord Narasimha, known for its sandalwood coating.' },
  'araku-valley': { name: 'Araku Valley', district: 'ASR District', itinerary: '2 Days', category: 'Hill Station', lang: 'Telugu, Tribal', desc: 'Beautiful hill station with coffee plantations and tribal museums.' },
  'borra-caves': { name: 'Borra Caves', district: 'Araku', itinerary: '1 Day', category: 'Nature', lang: 'Telugu', desc: 'Millions of years old stalactite and stalagmite formations.' },
  'ananthagiri-hills': { name: 'Ananthagiri Hills', district: 'Vizag Region', itinerary: '1 Day', category: 'Nature', lang: 'Telugu', desc: 'Dense forests and waterfalls, a major trekking destination.' },
  'lambasingi': { name: 'Lambasingi', district: 'ASR District', itinerary: '2 Days', category: 'Hill Station', lang: 'Telugu', desc: 'Known as the Kashmir of Andhra Pradesh due to its winter frost.' },
  'katiki-waterfalls': { name: 'Katiki Waterfalls', district: 'Araku', itinerary: 'Half Day', category: 'Nature', lang: 'Telugu', desc: 'A hidden gem near Borra Caves, perfect for adventure seekers.' },
  'papikondalu': { name: 'Papikondalu', district: 'East Godavari', itinerary: '2 Days', category: 'Nature', lang: 'Telugu', desc: 'Cruising through the Godavari river amidst majestic hills.' },
  'rajahmundry': { name: 'Rajahmundry', district: 'East Godavari', itinerary: '2 Days', category: 'City', lang: 'Telugu', desc: 'Cultural capital of Andhra Pradesh, famous for its grand bridges.' },
  'konaseema': { name: 'Konaseema', district: 'Konaseema', itinerary: '2 Days', category: 'Backwaters', lang: 'Telugu', desc: 'Lush green landscapes and coconut groves resembling Kerala backwaters.' },
  'maredumilli': { name: 'Maredumilli', district: 'East Godavari', itinerary: '2 Days', category: 'Forest', lang: 'Telugu', desc: 'Ecotourism hub known for its rich biodiversity and Bamboo Chicken.' },
  'antarvedi': { name: 'Antarvedi', district: 'Konaseema', itinerary: '1 Day', category: 'Beach', lang: 'Telugu', desc: 'The confluence of the Godavari river and the Bay of Bengal.' },
  'draksharamam': { name: 'Draksharamam Temple', district: 'East Godavari', itinerary: 'Half Day', category: 'Pilgrimage', lang: 'Telugu', desc: 'One of the five Pancharama Kshetras dedicated to Lord Shiva.' },
  'annavaram': { name: 'Annavaram Temple', district: 'Kakinada', itinerary: 'Half Day', category: 'Pilgrimage', lang: 'Telugu', desc: 'Famous for the Satyanarayana Swamy Vratam, located on a hill.' },
  'kakinada-beach': { name: 'Kakinada Beach', district: 'Kakinada', itinerary: '1 Day', category: 'Beach', lang: 'Telugu', desc: 'A quiet port beach known for its long coastline.' },
  'coringa-wildlife': { name: 'Coringa Wildlife Sanctuary', district: 'Kakinada', itinerary: '1 Day', category: 'Wildlife', lang: 'English, Telugu', desc: 'India\'s second-largest stretch of mangrove forests.' },
  'vijayawada': { name: 'Vijayawada', district: 'NTR District', itinerary: '2 Days', category: 'City', lang: 'Telugu, English', desc: 'A major commercial hub on the banks of the Krishna River.' },
  'kanaka-durga': { name: 'Kanaka Durga Temple', district: 'Vijayawada', itinerary: 'Half Day', category: 'Pilgrimage', lang: 'Telugu', desc: 'Iconic temple located on the Indrakeeladri hill.' },
  'bhavani-island': { name: 'Bhavani Island', district: 'Vijayawada', itinerary: '1 Day', category: 'Island', lang: 'English, Telugu', desc: 'One of the largest river islands, perfect for water sports.' },
  'undavalli-caves': { name: 'Undavalli Caves', district: 'Guntur', itinerary: 'Half Day', category: 'Heritage', lang: 'Telugu', desc: 'Monolithic rock-cut caves from the 4th-5th century.' },
  'amaravati': { name: 'Amaravati', district: 'Guntur', itinerary: '1 Day', category: 'Heritage', lang: 'Telugu', desc: 'Ancient Buddhist center and the spiritual capital region.' },
  'nagarjuna-sagar': { name: 'Nagarjuna Sagar', district: 'Palnadu', itinerary: '1 Day', category: 'Dam', lang: 'Telugu, English', desc: 'One of the world\'s largest masonry dams and Buddhist ruins.' },
  'srisailam': { name: 'Srisailam', district: 'Nandyal', itinerary: '2 Days', category: 'Pilgrimage', lang: 'Telugu', desc: 'Holy Jyotirlinga temple and a major tiger reserve.' },
  'srisailam-dam': { name: 'Srisailam Dam', district: 'Nandyal', itinerary: 'Half Day', category: 'Dam', lang: 'Telugu', desc: 'Powerful hydroelectric project on the Krishna River.' }
};

export default async function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dest = mockDestinations[id];

  if (!dest) return notFound();

  return (
    <div className="flex flex-col">
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={`https://picsum.photos/seed/${id}-ap/1920/1080`} alt={dest.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="space-y-4">
             <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4 group">
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
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-lg p-8 bg-white dark:bg-zinc-900 rounded-3xl">
              <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                <Info className="w-5 h-5 text-accent" /> Destination Overview
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-body">
                {dest.desc}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 mt-8 border-t">
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Suggested</p>
                   <p className="text-sm font-bold">{dest.itinerary}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Globe className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Languages</p>
                   <p className="text-sm font-bold">{dest.lang}</p>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-2xl">
                   <Compass className="w-8 h-8 text-accent mx-auto mb-2" />
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Region</p>
                   <p className="text-sm font-bold">{dest.district}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-primary text-white p-8 rounded-3xl">
              <h3 className="font-headline text-2xl font-bold mb-4">Book a Local Guide</h3>
              <p className="text-white/80 mb-6">Explore {dest.name} with an expert local guide from {dest.district}.</p>
              <Link href={`/guides?search=${dest.district}`} className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl h-12">
                  Find Guides
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
