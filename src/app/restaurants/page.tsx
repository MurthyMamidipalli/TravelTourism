
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, ArrowRight, Utensils } from 'lucide-react';

export default function RestaurantsLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1 flex items-center gap-1.5 mx-auto w-fit">
            <Utensils className="w-3.5 h-3.5" /> Culinary India
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white font-headline">Explore Flavors</h1>
          <p className="text-xl text-muted-foreground mt-4 leading-relaxed font-body">
            Discover the rich gastronomic heritage of Andhra Pradesh and beyond.
          </p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Link href="/restaurants/andhra-pradesh">
          <motion.div
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="premium-card overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-900">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-full">
                  <Image 
                    src="https://picsum.photos/seed/ap-food/800/600" 
                    alt="Andhra Pradesh Cuisine" 
                    fill 
                    priority
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>
                <CardContent className="p-8 flex flex-col justify-center space-y-6">
                  <div>
                    <Badge className="bg-accent text-white border-none mb-2">Spicy & Authentic</Badge>
                    <h2 className="text-4xl font-bold tracking-tight">Andhra Pradesh</h2>
                    <p className="text-muted-foreground mt-2 leading-relaxed font-body">
                      From the world-famous Hyderabadi Biryani to the fiery Rayalaseema Ruchulu, savor every bite of the Sunrise State.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                    Explore 25 Top Restaurants <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </Link>
      </div>

      <div className="text-center pt-12">
        <p className="text-muted-foreground italic text-sm">More regional cuisines coming soon...</p>
      </div>
    </div>
  );
}
