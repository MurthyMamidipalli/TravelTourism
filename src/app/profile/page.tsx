
'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Fingerprint, Calendar, ShieldCheck, MapPin, ArrowLeft, Edit3, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useCallback } from 'react';
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
  
  // Verification states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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

  const onSaveProfile = useCallback(async (values: EditProfileValues) => {
    if (!userDocRef) return;
    setIsSaving(true);
    try {
      await setDoc(userDocRef, values, { merge: true });
      toast({ title: "Profile Updated", description: "Changes saved successfully." });
      setIsEditDialogOpen(false);
    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: values,
      }));
    } finally {
      setIsSaving(false);
    }
  }, [userDocRef, toast]);

  const handleSendOtp = async () => {
    if (!profile?.aadharNumber) {
      toast({ title: "Aadhar Missing", description: "Please add an Aadhar number in profile settings.", variant: "destructive" });
      return;
    }
    setIsSendingOtp(true);
    await new Promise(r => setTimeout(r, 400));
    setIsSendingOtp(false);
    setIsOtpSent(true);
    toast({ title: "OTP Sent", description: "Code sent to your linked mobile." });
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6 || !userDocRef) return;
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 400));
    setIsVerifying(false);
    
    if (otpValue === '123456') {
      try {
        await setDoc(userDocRef, { isVerified: true }, { merge: true });
        toast({ title: "Identity Verified", description: "Your account is now fully verified." });
        setIsOtpSent(false);
        setOtpValue('');
      } catch (e) {
        toast({ title: "Error", description: "Failed to update verification status.", variant: "destructive" });
      }
    } else {
      toast({ title: "Invalid OTP", description: "Try again with 123456.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="max-w-2xl mx-auto"><Skeleton className="h-[400px] rounded-3xl" /></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">Please Sign In</h1>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold ${profile?.isVerified ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
            {profile?.isVerified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {profile?.isVerified ? 'Verified Identity' : 'Pending Verification'}
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
            <h1 className="text-4xl font-black tracking-tight">{profile?.fullName || user.displayName}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          </div>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute top-8 right-8 rounded-xl"><Edit3 className="w-4 h-4 mr-2" /> Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSaveProfile)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register('fullName')} className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Age</Label><Input type="number" {...form.register('age')} className="rounded-xl" /></div>
                  <div className="space-y-2"><Label>Mobile</Label><Input maxLength={10} {...form.register('mobileNumber')} className="rounded-xl" /></div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full rounded-xl" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="premium-card bg-white dark:bg-zinc-900 border-none shadow-lg">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</p>
                <p className="font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> {profile?.age || 'N/A'} Years</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                <p className="font-bold flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> {profile?.mobileNumber || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`premium-card border-none shadow-lg ${profile?.isVerified ? 'bg-accent/5' : 'bg-destructive/5'}`}>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Fingerprint className={`w-5 h-5 ${profile?.isVerified ? 'text-accent' : 'text-destructive'}`} /> Aadhar Verification</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity Number</p>
                <p className="font-mono text-lg font-bold">
                  {profile?.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : 'Not Provided'}
                </p>
              </div>

              <div className="pt-2">
                {!profile?.isVerified ? (
                  <div className="space-y-4">
                    <p className="text-xs text-destructive font-medium">Action required: Verify your identity via OTP to unlock all features.</p>
                    {!isOtpSent ? (
                      <Button onClick={handleSendOtp} disabled={isSendingOtp} className="w-full bg-destructive hover:bg-destructive/90 rounded-xl">
                        {isSendingOtp ? <Loader2 className="animate-spin mr-2" /> : 'Start Verification'}
                      </Button>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <Input placeholder="6-digit OTP" maxLength={6} className="text-center font-bold tracking-widest h-12 rounded-xl" value={otpValue} onChange={e => setOtpValue(e.target.value)} />
                        <Button onClick={handleVerifyOtp} disabled={isVerifying || otpValue.length !== 6} className="w-full bg-accent text-white rounded-xl">
                          {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify Identity'}
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground">Use test code: 123456</p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-sm font-bold text-accent">Identity Verified</p>
                      <p className="text-[10px] text-muted-foreground">Authentication via Aadhar OTP successful.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="bg-primary/5 rounded-3xl p-10 border-2 border-dashed border-primary/20 text-center space-y-6">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"><MapPin className="w-8 h-8 text-primary" /></div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Plan Your Adventure</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Explore 32 wonders and connect with local experts in Andhra Pradesh.</p>
          </div>
          <Link href="/destinations"><Button className="rounded-xl h-14 px-10 text-lg shadow-xl shadow-primary/20">Start Exploring</Button></Link>
        </section>
      </motion.div>
    </div>
  );
}
