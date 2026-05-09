'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Compass, Star, History, Calendar, Settings, User, Phone, Fingerprint, ShieldAlert, LogIn, CreditCard, Globe } from 'lucide-react';
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

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8 min-h-screen">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 rounded-3xl md:col-span-2" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
        <div className="bg-primary/10 p-6 rounded-full">
          <LogIn className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Access Restricted</h1>
          <p className="text-muted-foreground">Please sign in to view your personalized dashboard and travel history.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">Sign In Now</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="rounded-2xl h-12 px-8 font-bold">Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  const firstName = profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Traveler';

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-black tracking-tight">
            Welcome, {firstName}!
          </motion.h1>
          <p className="text-muted-foreground text-lg">Your personalized journey through the wonders of India starts here.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/locations">
            <Button className="rounded-2xl h-12 px-6 bg-primary shadow-lg shadow-primary/20">
              <Compass className="w-4 h-4 mr-2" /> Start Exploring
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="rounded-2xl h-12 w-12 p-0">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {user.isAnonymous && (
        <Alert className="rounded-2xl bg-primary/5 border-primary/20">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <AlertTitle className="font-bold">Guest Mode</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You are currently exploring as a guest. <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link> to save your verified identity and travel history.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="premium-card bg-primary/5 border-primary/20 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              <CardTitle>{profile?.isVerified ? 'Verified Profile' : 'Traveler Profile'}</CardTitle>
            </div>
            <CardDescription>Your secure travel identity and documentation</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profileLoading && !profile ? (
              <div className="col-span-full py-4"><Skeleton className="h-20 w-full" /></div>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><User className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Legal Name</p>
                      <p className="font-bold text-sm">{profile?.fullName || user?.displayName || 'Traveler'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><Fingerprint className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aadhar ID</p>
                      <p className="font-mono text-sm font-bold">{profile?.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : 'Pending Verification'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><Phone className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Contact</p>
                      <p className="font-bold text-sm">{profile?.mobileNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm"><Globe className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Passport ID</p>
                      <p className="font-mono text-sm font-bold uppercase">{profile?.passportNumber || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <div className="p-6 pt-0 border-t flex justify-end">
            <Link href="/profile">
              <Button variant="link" className="text-primary font-bold">Update Identity Documents <Settings className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        </Card>

        <Card className="premium-card">
          <CardHeader>
            <Star className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Saved Places</CardTitle>
            <CardDescription>Destinations available offline</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Your saved landmarks will appear here for offline access.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <Card className="premium-card bg-accent/5 border-accent/20">
          <CardHeader>
            <Calendar className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Trip Planning</CardTitle>
            <CardDescription>Personalized AI Itineraries</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/trip-planner">
              <Button variant="link" className="p-0 h-auto font-bold text-accent">Open AI Planner <Compass className="w-3 h-3 ml-1" /></Button>
            </Link>
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
            <Link href="/locations/andhra-pradesh" className="text-sm font-bold text-primary hover:underline">AP Districts</Link>
            <Link href="/locations/telangana" className="text-sm font-bold text-primary hover:underline">Telangana Districts</Link>
            <Link href="/guides" className="text-sm font-bold text-primary hover:underline">Verified Guides</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
