
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight, ExternalLink, Clock, Wallet, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TouristCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  description: string;
  location: string;
  category: string;
  timings?: string;
  entryFee?: string;
}

export default function TouristCard({ id, name, image, rating, description, location, category, timings, entryFee }: TouristCardProps) {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${location}`)}`;

  useEffect(() => {
    const saved = localStorage.getItem(`saved_dest_${id}`);
    if (saved) setIsSaved(true);
  }, [id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      localStorage.removeItem(`saved_dest_${id}`);
      setIsSaved(false);
      toast({ title: "Removed", description: "Destination removed from offline storage." });
    } else {
      const data = { id, name, image, rating, description, location, category, timings, entryFee };
      localStorage.setItem(`saved_dest_${id}`, JSON.stringify(data));
      setIsSaved(true);
      toast({ title: "Saved Offline", description: "This place is now available offline." });
    }
  };

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="h-full">
      <Card className="premium-card overflow-hidden group h-full flex flex-col shadow-lg hover:shadow-2xl transition-all border-none bg-white dark:bg-zinc-900">
        <div className="relative h-64 overflow-hidden">
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700" 
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/95 dark:bg-black/90 text-primary border-none shadow-md px-3 py-1 font-bold capitalize">
              {category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={toggleSave} className={`p-2 rounded-full backdrop-blur-sm border transition-all ${isSaved ? 'bg-accent text-white border-accent' : 'bg-white/90 text-primary border-primary/10'}`}>
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </button>
            <div className="bg-white/95 dark:bg-black/90 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-primary/10">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-black">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="space-y-1 mb-3">
            <h3 className="text-2xl font-black font-headline line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-accent" /> <span className="line-clamp-1">{location}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"><Clock className="w-3.5 h-3.5 text-primary" /> {timings || '9 AM - 6 PM'}</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"><Wallet className="w-3.5 h-3.5 text-primary" /> {entryFee || '₹50'}</div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-6 flex-grow">{description}</p>
          <div className="flex gap-3 mt-auto">
            <Button variant="outline" className="flex-1 rounded-xl h-11 border-zinc-200 dark:border-zinc-800" asChild>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 w-4 h-4" /> Maps</a>
            </Button>
            <Button className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90 font-bold" asChild>
              <Link href={`/destinations/${id}`}>Details <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
