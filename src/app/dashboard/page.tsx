
'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Compass, Star, History, Calendar, Settings, User, Phone, Fingerprint, ShieldAlert, LogIn } from 'lucide-react';
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

  const loading = authLoading || (user && profileLoading);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8 min-h-screen">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48 rounded-3xl md:col-span-2" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
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
        <Link href="/login">
          <Button size="lg" className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
            Sign In Now
          </Button>
        </Link>
      </div>
    );
  }

  const isAnonymous = user?.isAnonymous;

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen [scrollbar-gutter:stable]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Welcome, {profile?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Traveler'}!
          </motion.h1>
          <p className="text-muted-foreground text-lg">Your personalized journey through the wonders of India starts here.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <Card className="premium-card bg-accent/5 border-accent/20">
          <CardHeader>
            <Calendar className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Upcoming Trips</CardTitle>
            <CardDescription>Plan your next adventure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No trips planned yet.</p>
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
            <Link href="/locations/andhra-pradesh" className="text-sm font-bold text-primary hover:underline">Andhra Pradesh Districts</Link>
            <Link href="/locations/telangana" className="text-sm font-bold text-primary hover:underline">Telangana Districts</Link>
            <Link href="/guides" className="text-sm font-bold text-primary hover:underline">Find Verified Guides</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
