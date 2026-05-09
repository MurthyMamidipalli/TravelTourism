import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="space-y-8 max-w-2xl">
        <div className="bg-primary/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/5">
          <Compass className="w-12 h-12 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-1.5 rounded-full text-sm font-bold text-muted-foreground border border-border/50">
            <Sparkles className="w-4 h-4 text-accent" /> Your Intelligent Travel Companion
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Travel<span className="text-primary">Sphere</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
            Discover the vibrant culture, spiritual heights, and culinary gems of the heart of India.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/locations">
            <Button size="lg" className="rounded-2xl h-16 px-12 text-xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all duration-300">
              Start Exploring
            </Button>
          </Link>
          <Link href="/trip-planner">
            <Button size="lg" variant="outline" className="rounded-2xl h-16 px-12 text-xl font-bold border-2">
              AI Trip Planner
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
