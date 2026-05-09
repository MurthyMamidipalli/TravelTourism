
'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Compass, MapPin, Star, History, Calendar, Settings, User, Phone, Fingerprint, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  const loading = authLoading || profileLoading;

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

  const isAnonymous = user?.isAnonymous;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Welcome, {profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Traveler'}!
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

      {isAnonymous && (
        <Alert className="rounded-2xl bg-primary/5 border-primary/20">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <AlertTitle className="font-bold">Guest Mode</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You are currently exploring as a guest. <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link> to save your verified identity and travel history.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tourist Profile Details */}
        <Card className="premium-card bg-primary/5 border-primary/20 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              <CardTitle>{profile?.isVerified ? 'Verified Profile' : 'Traveler Profile'}</CardTitle>
            </div>
            <CardDescription>Your secure travel identity</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</p>
                  <p className="font-bold">{profile?.fullName || user?.displayName || 'Traveler'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</p>
                  <p className="font-bold">{profile?.age ? `${profile.age} Years` : 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Number</p>
                  <p className="font-bold">{profile?.mobileNumber || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aadhar Verification</p>
                  <p className="font-bold">
                    {profile?.aadharNumber 
                      ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` 
                      : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Places Placeholder */}
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
      </div>

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
            <History className="w-8 h-8 text-muted-foreground mb-2" />
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Review your past travels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Your journey history will appear here.</p>
          </CardContent>
        </Card>

        <Card className="premium-card bg-secondary/50">
          <CardHeader>
            <Compass className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href="/locations" className="text-sm font-bold text-primary hover:underline">Districts of AP</Link>
            <Link href="/restaurants" className="text-sm font-bold text-primary hover:underline">Culinary Delights</Link>
            <Link href="/guides" className="text-sm font-bold text-primary hover:underline">Find Guides</Link>
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
