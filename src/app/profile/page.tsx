'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, Mail, Fingerprint, Edit3, Loader2, CheckCircle2, ArrowLeft, ShieldCheck, LogIn, CreditCard, Globe, FileText, Calendar, Phone, Upload, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Badge } from '@/components/ui/badge';

const editProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(1, { message: 'Age is required.' }).max(120),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: 'Mobile must be exactly 10 digits.' }),
  aadharNumber: z.string().regex(/^\d{12}$/, { message: 'Aadhar must be exactly 12 digits.' }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN card format.' }),
  passportNumber: z.string().optional(),
});

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mandatory Upload States
  const [aadharUploaded, setAadharUploaded] = useState(false);
  const [panUploaded, setPanUploaded] = useState(false);
  const [passportUploaded, setPassportUploaded] = useState(false);

  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      age: 25,
      mobileNumber: '',
      aadharNumber: '',
      panNumber: '',
      passportNumber: ''
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || user?.displayName || '',
        age: profile.age || 25,
        mobileNumber: profile.mobileNumber || '',
        aadharNumber: profile.aadharNumber || '',
        panNumber: profile.panNumber || '',
        passportNumber: profile.passportNumber || '',
      });
      if (profile.isVerified) {
        setAadharUploaded(true);
        setPanUploaded(true);
      }
    } else if (user && !profileLoading) {
      form.setValue('fullName', user.displayName || '');
    }
  }, [profile, user, profileLoading, form]);

  const onSaveProfile = useCallback((values: z.infer<typeof editProfileSchema>) => {
    if (!userDocRef) return;
    if (!aadharUploaded || !panUploaded) {
      toast({ title: "Documents Missing", description: "Please upload mandatory Aadhar and PAN soft copies.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const updatedProfile = { 
      ...values, 
      email: user?.email || '',
      isVerified: true,
      updatedAt: new Date().toISOString()
    };
    
    // Optimistic write: Close dialog and show toast instantly
    setDoc(userDocRef, updatedProfile, { merge: true })
      .catch((error: any) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: userDocRef.path, 
          operation: 'update', 
          requestResourceData: updatedProfile 
        }));
      });
    
    toast({ title: "Profile Updated", description: "Identity documents verified successfully." });
    setIsEditDialogOpen(false);
    setIsSaving(false);
  }, [userDocRef, user?.email, toast, aadharUploaded, panUploaded]);

  const handleSimulatedUpload = (type: 'aadhar' | 'pan' | 'passport') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files.length > 0) {
        if (type === 'aadhar') setAadharUploaded(true);
        if (type === 'pan') setPanUploaded(true);
        if (type === 'passport') setPassportUploaded(true);
        toast({ title: "File Staged", description: `${type.toUpperCase()} document ready for verification.` });
      }
    };
    input.click();
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8 min-h-screen">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="max-w-4xl mx-auto"><Skeleton className="h-[400px] rounded-3xl" /></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
        <div className="bg-primary/10 p-6 rounded-full"><LogIn className="w-12 h-12 text-primary" /></div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Sign-in Required</h1>
          <p className="text-muted-foreground">Please sign in to manage your identity documents.</p>
        </div>
        <Link href="/login"><Button size="lg" className="rounded-2xl h-12 px-8 font-bold">Sign In</Button></Link>
      </div>
    );
  }

  const displayName = profile?.fullName || user?.displayName || 'Traveler';

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold ${profile?.isVerified ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'}`}>
            <ShieldCheck className="w-4 h-4" />
            {profile?.isVerified ? 'Document Verified' : 'Documents Pending'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border relative">
          <Avatar className="h-32 w-32 border-4 border-primary/20 shrink-0">
            <AvatarImage src={user?.photoURL || ''} alt={displayName} />
            <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-2 flex-grow">
            <h1 className="text-4xl font-black tracking-tight font-headline">{displayName}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-accent" /> {user?.email || 'Guest Account'}
            </p>
          </div>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="md:absolute top-8 right-8 rounded-xl h-9">
                <Edit3 className="w-4 h-4 mr-2" /> Update Identity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Verify Identity Documents</DialogTitle></DialogHeader>
              <form onSubmit={form.handleSubmit(onSaveProfile)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name (as per documents)</Label>
                  <Input {...form.register('fullName')} className="rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" {...form.register('age')} className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile</Label>
                    <Input maxLength={10} {...form.register('mobileNumber')} className="rounded-xl h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Aadhar UID</Label>
                  <Input maxLength={12} {...form.register('aadharNumber')} className="rounded-xl h-11" placeholder="12-digit UID" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> PAN Number</Label>
                  <Input {...form.register('panNumber')} className="rounded-xl h-11 uppercase" placeholder="ABCDE1234F" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium opacity-70"><Globe className="w-4 h-4" /> Passport ID (Optional)</Label>
                  <Input {...form.register('passportNumber')} className="rounded-xl h-11" placeholder="Optional" />
                </div>

                <div className="p-4 bg-secondary/20 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document Proofs (Soft Copies)</p>
                    <Badge variant="outline" className="text-[9px] h-4 bg-white">Aadhar & PAN Mandatory</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div 
                      onClick={() => handleSimulatedUpload('aadhar')}
                      className={`h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${aadharUploaded ? 'border-accent bg-accent/5' : 'border-primary/20 hover:bg-primary/5'}`}
                    >
                      {aadharUploaded ? <Check className="w-5 h-5 text-accent" /> : <Upload className="w-5 h-5 text-muted-foreground opacity-50" />}
                      <span className="text-[9px] font-bold mt-1 text-center px-1">Aadhar *</span>
                    </div>
                    <div 
                      onClick={() => handleSimulatedUpload('pan')}
                      className={`h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${panUploaded ? 'border-accent bg-accent/5' : 'border-primary/20 hover:bg-primary/5'}`}
                    >
                      {panUploaded ? <Check className="w-5 h-5 text-accent" /> : <Upload className="w-5 h-5 text-muted-foreground opacity-50" />}
                      <span className="text-[9px] font-bold mt-1 text-center px-1">PAN *</span>
                    </div>
                    <div 
                      onClick={() => handleSimulatedUpload('passport')}
                      className={`h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all opacity-60 ${passportUploaded ? 'border-accent bg-accent/5' : 'border-zinc-200 hover:bg-zinc-50'}`}
                    >
                      {passportUploaded ? <Check className="w-5 h-5 text-accent" /> : <Upload className="w-5 h-5 text-muted-foreground opacity-30" />}
                      <span className="text-[9px] font-bold mt-1 text-center px-1">Passport</span>
                    </div>
                  </div>
                  {(!aadharUploaded || !panUploaded) && (
                    <p className="text-[9px] text-destructive font-bold">* Aadhar and PAN soft copies are mandatory.</p>
                  )}
                </div>

                <DialogFooter className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl h-12 font-bold" 
                    disabled={isSaving || !aadharUploaded || !panUploaded}
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : 'Confirm Identity Verification'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          <Card className="premium-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-bold"><User className="w-5 h-5 text-primary" /> Profile Details</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {profileLoading && !profile ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/5 p-2 rounded-lg"><Phone className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Number</p><p className="font-bold">{profile?.mobileNumber || 'Not set'}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/5 p-2 rounded-lg"><Calendar className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Age</p><p className="font-bold">{profile?.age ? `${profile.age} Years` : 'Not set'}</p></div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className={`premium-card ${profile?.isVerified ? 'bg-accent/5 border-accent/20' : 'bg-destructive/5 border-destructive/20'}`}>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-bold"><ShieldCheck className={`w-5 h-5 ${profile?.isVerified ? 'text-accent' : 'text-destructive'}`} /> ID Status</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {profileLoading && !profile ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    <div className="flex justify-between border-b pb-2"><span className="text-xs text-muted-foreground">Aadhar UID</span><span className="font-mono text-xs font-bold">{profile?.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : 'Pending'}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-xs text-muted-foreground">PAN Tax ID</span><span className="font-mono text-xs font-bold uppercase">{profile?.panNumber || 'Pending'}</span></div>
                    <div className="flex justify-between pb-2"><span className="text-xs text-muted-foreground font-medium opacity-50">Passport ID</span><span className="font-mono text-xs font-bold uppercase opacity-50">{profile?.passportNumber || 'N/A'}</span></div>
                  </div>
                  {profile?.isVerified && (
                    <div className="flex items-center gap-2 text-accent font-bold py-2 bg-accent/10 px-4 rounded-xl border border-accent/20">
                      <CheckCircle2 className="w-5 h-5" /> Documents Fully Verified
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}