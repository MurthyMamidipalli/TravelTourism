'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Fingerprint, Calendar, ShieldCheck, MapPin, ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const editProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(1, { message: 'Age is required.' }).max(120),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: 'Mobile must be exactly 10 digits.' }),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      age: 0,
      mobileNumber: '',
    },
  });

  // Sync form with profile data when it loads
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || user?.displayName || '',
        age: profile.age || 0,
        mobileNumber: profile.mobileNumber || '',
      });
    }
  }, [profile, user?.displayName, form]);

  const loading = authLoading || profileLoading;

  async function onSaveProfile(values: EditProfileValues) {
    if (!userDocRef) return;
    
    setIsSaving(true);
    try {
      await setDoc(userDocRef, values, { merge: true });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: values,
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">Please Sign In</h1>
        <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="bg-accent/10 px-4 py-1.5 rounded-full text-accent flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="w-4 h-4" /> Verified Tourist
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border relative">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={user.photoURL || ''} alt={profile?.fullName || 'User'} />
            <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">
              {(profile?.fullName || user.displayName || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-2 flex-grow">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile?.fullName || user.displayName}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          </div>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute top-8 right-8 rounded-xl">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal details here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSaveProfile)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    className="rounded-xl" 
                    {...form.register('fullName')} 
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      className="rounded-xl" 
                      {...form.register('age')} 
                    />
                    {form.formState.errors.age && (
                      <p className="text-xs text-destructive">{form.formState.errors.age.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input 
                      id="mobileNumber" 
                      maxLength={10} 
                      className="rounded-xl" 
                      {...form.register('mobileNumber')} 
                    />
                    {form.formState.errors.mobileNumber && (
                      <p className="text-xs text-destructive">{form.formState.errors.mobileNumber.message}</p>
                    )}
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full rounded-xl" disabled={isSaving}>
                    {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</p>
                <p className="font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" /> {profile?.age || 'N/A'} Years
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Number</p>
                <p className="font-bold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" /> {profile?.mobileNumber || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-accent" /> Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aadhar Card Number</p>
                <p className="font-mono text-lg font-bold">
                  {profile?.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : 'Not Verified'}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-dashed flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span className="text-xs font-medium text-muted-foreground">Identity documents are stored securely.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="bg-secondary/30 rounded-3xl p-8 border text-center space-y-4">
          <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Explore Andhra Pradesh</h3>
            <p className="text-muted-foreground text-sm">You are ready to book certified guides and discover hidden gems.</p>
          </div>
          <Link href="/destinations">
            <Button className="rounded-xl h-12 px-8">Browse Destinations</Button>
          </Link>
        </section>
      </motion.div>
    </div>
  );
}
