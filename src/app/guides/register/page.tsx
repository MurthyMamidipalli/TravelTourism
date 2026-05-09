'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Loader2, Fingerprint, Info, Smartphone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email({ message: 'Valid email is required.' }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: '10-digit mobile number is mandatory.' }),
  age: z.coerce.number().min(18, { message: 'Must be 18 or older.' }).max(100),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Please select a gender.' }),
  location: z.string().min(3, { message: 'Operational city/region is mandatory.' }),
  languages: z.string().min(2, { message: 'Specify at least one language.' }),
  aadharNumber: z.string().regex(/^\d{12}$/, { message: '12-digit Aadhar number is mandatory.' }),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN card format.' }),
  bio: z.string().min(50, { message: 'Bio is mandatory (min 50 chars).' }),
  experience: z.string().min(10, { message: 'Experience details are mandatory.' }),
});

export default function GuideRegistrationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      age: 25,
      gender: 'Male',
      location: '',
      languages: '',
      aadharNumber: '',
      panNumber: '',
      bio: '',
      experience: '',
    },
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const aadharValue = form.watch('aadharNumber') || '';
  const mobileValue = form.watch('mobileNumber') || '';

  async function handleSendOtp() {
    if (aadharValue.length !== 12 || mobileValue.length !== 10) {
      toast({ 
        title: "Details Incomplete", 
        description: "Please provide both Aadhar and Mobile numbers.", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      setResendTimer(60);
      toast({ 
        title: "Secure OTP Sent", 
        description: `Verification code dispatched to ${mobileValue}.`,
      });
    }, 800);
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) return;
    setIsVerifyingOtp(true);
    
    setTimeout(() => {
      // Simulation test key: 123456
      if (otpValue === '123456') {
        setIsVerifyingOtp(false);
        setIsAadharVerified(true);
        toast({ 
          title: "Identity Authenticated", 
          description: "Government ID verified successfully.",
          className: "bg-accent text-white"
        });
      } else {
        setIsVerifyingOtp(false);
        toast({ 
          title: "Invalid Code", 
          description: "The verification code is incorrect.", 
          variant: "destructive" 
        });
      }
    }, 600);
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || !isAadharVerified) {
      toast({ 
        title: "Security Check Required", 
        description: "Identity verification is mandatory for guide accountability.", 
        variant: "destructive" 
      });
      return;
    }
    setSubmitting(true);
    const guidesRef = collection(firestore!, 'guides');
    const guideData = {
      ...values,
      userId: user.uid,
      rating: 0,
      reviewCount: 0,
      isVerified: true,
      createdAt: serverTimestamp(),
      imageUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/400/400`,
    };

    addDoc(guidesRef, guideData)
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: guidesRef.path, operation: 'create', requestResourceData: guideData }));
      });

    toast({ 
      title: "Successfully Registered", 
      description: "Welcome to our network of verified local experts.",
    });
    router.push('/guides');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white shadow-2xl sticky top-24">
          <ShieldCheck className="w-16 h-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">Accountability Program</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Every guide on Voyage Compass is government-verified. This ensures that tourists are safe and that every guide can be held accountable for their service quality.
          </p>
          
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent" /> Why this is mandatory:
            </h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex gap-2">
                <span className="font-black text-accent">✓</span> 
                Direct link to Government ID (Aadhar).
              </li>
              <li className="flex gap-2">
                <span className="font-black text-accent">✓</span> 
                Verified contact number for real-time support.
              </li>
              <li className="flex gap-2">
                <span className="font-black text-accent">✓</span> 
                Legal accountability for tourist safety.
              </li>
            </ul>
          </div>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Legal Name</FormLabel>
                      <FormControl>
                        <Input className="rounded-xl h-11" placeholder="As per documents" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" className="rounded-xl h-11" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-secondary/20 p-6 rounded-2xl space-y-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Fingerprint className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-sm tracking-tight uppercase">Identity Authentication</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number (for OTP)</FormLabel>
                        <FormControl>
                          <Input disabled={isAadharVerified} placeholder="10-digit mobile" maxLength={10} className="rounded-xl h-11" {...field} suppressHydrationWarning />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Card Number</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input disabled={isAadharVerified} maxLength={12} className="rounded-xl h-11" placeholder="12-digit ID" {...field} suppressHydrationWarning />
                          </FormControl>
                          {!isAadharVerified && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="h-11 rounded-xl px-6 shrink-0 border-primary text-primary" 
                              onClick={handleSendOtp} 
                              disabled={aadharValue.length !== 12 || mobileValue.length !== 10 || isSendingOtp || (isOtpSent && resendTimer > 0)}
                            >
                              {isSendingOtp ? <Loader2 className="animate-spin" /> : isOtpSent && resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Send OTP'}
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <AnimatePresence>
                    {isOtpSent && !isAadharVerified && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 pt-2 overflow-hidden">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <Smartphone className="w-4 h-4 text-primary" />
                          <span>Enter the 6-digit code sent to your device.</span>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Enter Code" maxLength={6} className="rounded-xl h-12 text-center font-bold text-lg tracking-[0.2em]" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} suppressHydrationWarning />
                          <Button type="button" className="h-12 rounded-xl px-8 shadow-md" onClick={handleVerifyOtp} disabled={otpValue.length !== 6 || isVerifyingOtp}>
                            {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify'}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isAadharVerified && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-accent/10 p-3 rounded-xl text-accent text-sm font-bold flex items-center justify-center gap-2 border border-accent/20">
                      <CheckCircle2 className="w-5 h-5" /> Identity Authenticated
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operational City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tirupati" className="rounded-xl h-11" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="languages" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Telugu, English" className="rounded-xl h-11" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guiding History</FormLabel>
                    <FormControl>
                      <Textarea className="rounded-xl min-h-[120px]" placeholder="List places you specialize in..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex gap-3">
                  <Info className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By submitting, you agree that your identity details will be kept on record for tourist safety verification.
                  </p>
                </div>

                <Button type="submit" disabled={submitting || !isAadharVerified} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                  {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Complete Verified Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
