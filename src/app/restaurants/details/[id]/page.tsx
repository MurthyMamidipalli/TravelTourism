'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Info, ArrowLeft, Clock, Navigation, 
  Loader2, Star, Utensils, Zap, Download, Wallet, Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import map component dynamically to avoid SSR issues
const RestaurantMap = dynamic(() => import('@/components/DestinationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-3xl bg-secondary/10 animate-pulse flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
      <p className="text-sm text-muted-foreground">Loading interactive map...</p>
    </div>
  ),
});

const allRestaurants: Record<string, any> = {
  'rest-1': { id: 'rest-1', name: 'Paradise Biryani', city: 'Visakhapatnam', cuisine: 'Hyderabadi Biryani', price: '₹₹', rating: 4.5, timings: '11AM-11PM', desc: 'World famous for its authentic Hyderabadi Dum Biryani and Kebabs.', lat: 17.7231, lng: 83.3013 },
  'rest-2': { id: 'rest-2', name: 'Dharani Restaurant', city: 'Vijayawada', cuisine: 'South Indian Thali', price: '₹₹', rating: 4.3, timings: '7AM-10PM', desc: 'Traditional Andhra meals served with love and spice.', lat: 16.5062, lng: 80.6480 },
  'rest-3': { id: 'rest-3', name: 'Sri Sairam Parlour', city: 'Tirupati', cuisine: 'Pure Veg Tiffins', price: '₹', rating: 4.6, timings: '6AM-10PM', desc: 'The most popular breakfast spot in Tirupati, famous for Ghee Roast Dosa.', lat: 13.6285, lng: 79.4192 },
  'ts-rest-1': { id: 'ts-rest-1', name: 'Paradise Biryani', city: 'Hyderabad', cuisine: 'Legendary Biryani', price: '₹₹', rating: 4.7, timings: '11AM-11:30PM', desc: 'The original home of Hyderabadi Biryani, a must-visit for every food lover.', lat: 17.4437, lng: 78.4897 },
  'ts-rest-2': { id: 'ts-rest-2', name: 'Cafe Bahar', city: 'Hyderabad', cuisine: 'Biryani & Haleem', price: '₹₹', rating: 4.6, timings: '11AM-12AM', desc: 'Authentic flavors and bustling atmosphere, famous for its mutton biryani.', lat: 17.3977, lng: 78.4831 },
  'ts-rest-3': { id: 'ts-rest-3', name: 'Shah Ghouse', city: 'Hyderabad', cuisine: 'Mughlai & Biryani', price: '₹₹', rating: 4.5, timings: '12PM-1AM', desc: 'Late-night food hub famous for Haleem and spicy kebabs.', lat: 17.3600, lng: 78.4735 },
};

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const rest = useMemo(() => {
    return allRestaurants[id] || {
      name: 'Gourmet Dining',
      city: 'City Center',
      cuisine: 'Multi-cuisine',
      price: '₹₹',
      rating: 4.0,
      timings: '10AM-10PM',
      desc: 'Experience the local flavors and hospitality at its best.',
      lat: 17.3850,
      lng: 78.4867
    };
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="relative h-[50vh] overflow-hidden">
        <Image 
          src={`https://picsum.photos/seed/${id}/1920/1080`} 
          alt={rest.name} 
          fill 
          className="object-cover brightness-[0.8]" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="space-y-4">
             <Link href="/restaurants" className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4 group bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
               <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dining
             </Link>
             <h1 className="text-white text-5xl md:text-7xl font-headline font-bold drop-shadow-2xl">{rest.name}</h1>
             <div className="flex justify-center gap-2">
                <Badge className="bg-accent text-white border-none px-4 py-1">{rest.cuisine}</Badge>
                <Badge variant="outline" className="bg-white/20 text-white border-none px-4 py-1">{rest.city}</Badge>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <Card className="border-none shadow-xl p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem]">
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-10 border-b pb-8">
                <div className="space-y-6 flex-grow">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Utensils className="w-4 h-4 text-accent" /> Culinary Highlights
                  </div>
                  <p className="text-2xl text-muted-foreground leading-relaxed font-body italic">
                    "{rest.desc}"
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-3">
                       <Clock className="w-6 h-6 text-primary" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Hours</p>
                         <p className="text-sm font-bold">{rest.timings}</p>
                       </div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-3">
                       <Wallet className="w-6 h-6 text-primary" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Price Range</p>
                         <p className="text-sm font-bold">{rest.price}</p>
                       </div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-3">
                       <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                       <div>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Rating</p>
                         <p className="text-sm font-bold">{rest.rating} / 5.0</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Navigation className="w-4 h-4 text-accent" /> Live Location
                  </div>
                </div>
                <RestaurantMap name={rest.name} lat={rest.lat} lng={rest.lng} />
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-primary text-white p-8 rounded-[2rem] sticky top-24">
              <h3 className="font-headline text-2xl font-bold mb-4">Book a Table</h3>
              <p className="text-white/80 mb-6">Skip the wait and reserve your spot at {rest.name} instantly.</p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl h-14 text-lg font-bold shadow-lg transition-transform hover:scale-[1.02]">
                Check Availability
              </Button>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-8 rounded-[2rem] space-y-4">
              <h4 className="font-black flex items-center gap-2 uppercase tracking-widest text-xs text-primary">
                <Download className="w-4 h-4" /> Offline Menu
              </h4>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                Traveling to a low-network zone? Save this restaurant's location and menu for offline access.
              </p>
              <Button variant="outline" className="w-full rounded-xl">Save for Offline</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}