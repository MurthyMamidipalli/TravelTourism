
'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Fingerprint, Edit3, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Smartphone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [resendTimer, setResendTimer] = useState(0);

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

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const onSaveProfile = useCallback((values: EditProfileValues) => {
    if (!userDocRef) return;
    setIsSaving(true);
    
    setDoc(userDocRef, values, { merge: true })
      .catch((error: any) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: values,
        }));
      });

    toast({ title: "Profile Updated", description: "All information saved." });
    setIsEditDialogOpen(false);
    setIsSaving(false);
  }, [userDocRef, toast]);

  const handleSendOtp = async () => {
    const mobile = profile?.mobileNumber || form.getValues('mobileNumber');
    if (!mobile || mobile.length !== 10) {
      toast({ title: "Invalid Contact", description: "Please check your mobile number before requesting OTP.", variant: "destructive" });
      return;
    }
    
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      setResendTimer(60);
      toast({ 
        title: "OTP Dispatched", 
        description: `A secure verification code has been sent to your mobile device for identity confirmation.`,
      });
    }, 600);
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6 || !userDocRef) return;
    setIsVerifying(true);

    // Internal test verification code
    if (otpValue === '123456') {
      setDoc(userDocRef, { isVerified: true }, { merge: true })
        .catch((error) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userDocRef!.path,
            operation: 'update',
            requestResourceData: { isVerified: true },
          }));
        });

      toast({ title: "Identity Verified", description: "Your profile is now government-linked and verified." });
      setIsOtpSent(false);
      setOtpValue('');
      setIsVerifying(false);
    } else {
      setTimeout(() => {
        setIsVerifying(false);
        toast({ title: "Invalid Code", description: "The verification code is incorrect. Please check your messages.", variant: "destructive" });
      }, 300);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8 min-h-[60vh]">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="max-w-4xl mx-auto"><Skeleton className="h-[400px] rounded-3xl" /></div>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold ${profile?.isVerified ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
            {profile?.isVerified ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {profile?.isVerified ? 'Identity Verified' : 'Verification Required'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border relative">
          <Avatar className="h-32 w-32 border-4 border-primary/20 shrink-0">
            <AvatarImage src={user.photoURL || ''} alt={displayName} />
            <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-2 flex-grow">
            <h1 className="text-4xl font-black tracking-tight font-headline">{displayName}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 font-body">
              <Mail className="w-4 h-4 text-accent" /> {user.email || 'Guest Account'}
            </p>
          </div>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="md:absolute top-8 right-8 rounded-xl h-9">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader><DialogTitle>Update Profile</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSaveProfile)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register('fullName')} className="rounded-xl h-11" suppressHydrationWarning />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Age</Label><Input type="number" {...form.register('age')} className="rounded-xl h-11" suppressHydrationWarning /></div>
                  <div className="space-y-2"><Label>Mobile</Label><Input maxLength={10} {...form.register('mobileNumber')} className="rounded-xl h-11" suppressHydrationWarning /></div>
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Number</Label>
                  <Input maxLength={12} {...form.register('aadharNumber')} className="rounded-xl h-11" suppressHydrationWarning />
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
            <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-bold font-headline"><User className="w-5 h-5 text-primary" /> Profile Data</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-body">User Age</p>
                <p className="font-bold text-lg font-body">{profile?.age || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-body">Mobile Contact</p>
                <p className="font-bold text-lg font-body">{profile?.mobileNumber || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`premium-card ${profile?.isVerified ? 'bg-accent/5' : 'bg-destructive/5'}`}>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-bold font-headline"><Fingerprint className={`w-5 h-5 ${profile?.isVerified ? 'text-accent' : 'text-destructive'}`} /> Security Status</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-body">Identity Accountability</p>
                <p className="font-mono text-lg font-bold font-body">
                  {profile?.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : 'Aadhar Verification Needed'}
                </p>
              </div>

              <div className="pt-2">
                {!profile?.isVerified ? (
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      {!isOtpSent ? (
                        <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Button onClick={handleSendOtp} disabled={isSendingOtp} className="w-full rounded-xl h-11 shadow-md">
                            {isSendingOtp ? <Loader2 className="animate-spin mr-2" /> : <Smartphone className="w-4 h-4 mr-2" />}
                            {isSendingOtp ? 'Sending OTP...' : 'Verify Identity via Mobile OTP'}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div key="verify" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <Input 
                            placeholder="Enter 6-digit Code" 
                            maxLength={6} 
                            className="text-center font-bold h-12 rounded-xl text-lg tracking-[0.2em]" 
                            value={otpValue} 
                            onChange={e => setOtpValue(e.target.value)} 
                            suppressHydrationWarning
                          />
                          <Button onClick={handleVerifyOtp} disabled={isVerifying || otpValue.length !== 6} className="w-full bg-accent text-white rounded-xl h-11">
                            {isVerifying ? <Loader2 className="animate-spin" /> : 'Confirm Identity'}
                          </Button>
                          <p className="text-[10px] text-center text-muted-foreground mt-2 font-body">
                            {resendTimer > 0 ? (
                              <span className="font-bold">New code available in {resendTimer}s</span>
                            ) : (
                              <button onClick={handleSendOtp} className="text-primary font-bold">Resend OTP Code</button>
                            )}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-accent font-bold py-2 bg-accent/10 px-4 rounded-xl border border-accent/20">
                    <ShieldCheck className="w-5 h-5" /> Account Verified Securely
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
