'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Fingerprint, Edit3, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
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
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Aadhar must be exactly 12 digits.' }).optional().or(z.literal('')),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
      aadharNumber: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || user?.displayName || '',
        age: profile.age || 0,
        mobileNumber: profile.mobileNumber || '',
        aadharNumber: profile.aadharNumber || '',
      });
    }
  }, [profile, user?.displayName, form]);

  const onSaveProfile = useCallback(async (values: EditProfileValues) => {
    if (!userDocRef) return;
    setIsSaving(true);
    setDoc(userDocRef, values, { merge: true })
      .then(() => {
        toast({ title: "Profile Updated", description: "Changes saved successfully." });
        setIsEditDialogOpen(false);
      })
      .catch((error: any) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: values,
        }));
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [userDocRef, toast]);

  const handleSendOtp = async () => {
    if (!profile?.aadharNumber && !form.getValues('aadharNumber')) {
      toast({ title: "Aadhar Missing", description: "Please provide your 12-digit Aadhar number first.", variant: "destructive" });
      return;
    }
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      toast({ 
        title: "OTP Sent", 
        description: "A verification code has been sent to your registered mobile number.",
      });
    }, 500);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6 || !userDocRef) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (otpValue === '123456') {
        setDoc(userDocRef, { isVerified: true }, { merge: true })
          .then(() => {
            toast({ title: "Identity Verified", description: "Successfully authenticated via Aadhaar." });
            setIsOtpSent(false);
            setOtpValue('');
          })
          .catch(() => {
            toast({ title: "Verification Error", variant: "destructive" });
          });
      } else {
        toast({ title: "Invalid OTP", description: "The code entered is incorrect. Please try again.", variant: "destructive" });
      }
    }, 500);
  };

  if (authLoading || profileLoading) {
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
        <h1 className="text-3xl font-bold">Sign-in Required</h1>
        <Link href="/login"><Button className="rounded-xl">Sign In</Button></Link>
      </div>
    );
  }

  const displayName = profile?.fullName || user?.displayName || 'Traveler';

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold ${profile?.isVerified ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
            {profile?.isVerified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {profile?.isVerified ? 'Verified' : 'Pending Verification'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border relative">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={user.photoURL || ''} alt={displayName} />
            <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-2 flex-grow">
            <h1 className="text-4xl font-black tracking-tight">{displayName}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-accent" /> {user.email || 'Guest User'}
            </p>
          </div>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute top-8 right-8 rounded-xl h-9"><Edit3 className="w-4 h-4 mr-2" /> Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader><DialogTitle>Edit Profile Details</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSaveProfile)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register('fullName')} className="rounded-xl h-11" placeholder="Enter full name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Age</Label><Input type="number" {...form.register('age')} className="rounded-xl h-11" /></div>
                  <div className="space-y-2"><Label>Mobile Number</Label><Input maxLength={10} {...form.register('mobileNumber')} className="rounded-xl h-11" placeholder="10 digits" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Number (12 digits)</Label>
                  <Input maxLength={12} {...form.register('aadharNumber')} className="rounded-xl h-11" placeholder="XXXX XXXX XXXX" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full rounded-xl h-12" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="premium-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</p>
                <p className="font-bold text-lg">{profile?.age || 'Not set'} Years</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Number</p>
                <p className="font-bold text-lg">{profile?.mobileNumber || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`premium-card ${profile?.isVerified ? 'bg-accent/5' : 'bg-destructive/5'}`}>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Fingerprint className={`w-5 h-5 ${profile?.isVerified ? 'text-accent' : 'text-destructive'}`} /> Identity Verification</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registered Aadhar</p>
                <p className="font-mono text-lg font-bold">
                  {profile?.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : 'Not provided yet'}
                </p>
              </div>

              <div className="pt-2">
                {!profile?.isVerified ? (
                  <div className="space-y-4">
                    {!isOtpSent ? (
                      <Button onClick={handleSendOtp} disabled={isSendingOtp} className="w-full rounded-xl h-11">
                        {isSendingOtp ? <Loader2 className="animate-spin" /> : 'Send Verification OTP'}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Input placeholder="Enter 6-digit OTP" maxLength={6} className="text-center font-bold h-11 rounded-xl" value={otpValue} onChange={e => setOtpValue(e.target.value)} />
                        <Button onClick={handleVerifyOtp} disabled={isVerifying || otpValue.length !== 6} className="w-full bg-accent text-white rounded-xl h-11">
                          {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify Identity'}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-accent font-bold py-2">
                    <CheckCircle2 className="w-5 h-5" /> Your identity is verified.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
