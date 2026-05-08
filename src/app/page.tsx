
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-3xl">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary tracking-tighter">
          Explore <span className="text-accent">Andhra Pradesh</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Discover the 32 wonders of the Sunrise State.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/destinations">
            <Button size="lg" className="rounded-full h-14 px-8 text-lg">
              Explore Destinations
            </Button>
          </Link>
          <Link href="/guides">
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg">
              Find Local Guides
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
