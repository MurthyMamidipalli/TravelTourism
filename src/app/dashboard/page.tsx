'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Compass, MapPin, Star, History, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Welcome, {user?.displayName?.split(' ')[0] || 'Traveler'}!
          </motion.h1>
          <p className="text-muted-foreground text-lg">Your personalized journey through Andhra Pradesh starts here.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/search">
            <Button className="rounded-2xl h-12 px-6 bg-primary shadow-lg shadow-primary/20">
              <Compass className="w-4 h-4 mr-2" /> Start Exploring
            </Button>
          </Link>
          <Button variant="outline" className="rounded-2xl h-12 w-12 p-0">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="premium-card bg-accent/5 border-accent/20">
          <CardHeader>
            <Calendar className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Upcoming Trips</CardTitle>
            <CardDescription>Plan your next adventure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No trips planned yet. Explore our 32 wonders to get started!</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <Star className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Saved Places</CardTitle>
            <CardDescription>Your favorite destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Save attractions to see them here.</p>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <History className="w-8 h-8 text-muted-foreground mb-2" />
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Review your past travels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Your journey history will appear here.</p>
          </CardContent>
        </Card>
      </div>

      <section className="bg-secondary/20 rounded-3xl p-8 md:p-12 border border-dashed border-muted-foreground/30 text-center space-y-6">
        <div className="bg-white dark:bg-zinc-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
           <MapPin className="w-8 h-8 text-accent" />
        </div>
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold">Ready for a Guided Tour?</h2>
          <p className="text-muted-foreground">
            Connect with certified local guides to unlock the secrets of historical landmarks like Tirumala or Araku Valley.
          </p>
        </div>
        <Link href="/guides">
          <Button variant="outline" className="rounded-xl px-8 h-12 border-primary text-primary hover:bg-primary hover:text-white transition-all">
            Find a Local Expert
          </Button>
        </Link>
      </section>
    </div>
  );
}
