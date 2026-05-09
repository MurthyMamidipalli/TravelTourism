
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center px-4">
      <div className="space-y-8 max-w-xl">
        <div className="bg-primary/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Compass className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter">
          Voyage <span className="text-primary">Compass</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Your portal to the wonders of the heart of India.
        </p>
        <div className="pt-4">
          <Link href="/locations">
            <Button size="lg" className="rounded-2xl h-16 px-12 text-xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
              Start Exploring
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
