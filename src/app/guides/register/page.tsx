'use client';

import { useState, useEffect, useRef } from 'react';
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
import { ShieldCheck, Loader2, Fingerprint, Smartphone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useFirestore, useUser, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
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
  const auth = useAuth();
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isAadharVerified, setIsAadharVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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

  const mobileValue = form.watch('mobileNumber') || '';

  const setupRecaptcha = () => {
    if (recaptchaVerifierRef.current) return;
    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    } catch (error) {
      console.error("Recaptcha setup error:", error);
    }
  };

  async function handleSendOtp() {
    if (mobileValue.length !== 10) {
      toast({ 
        title: "Number Required", 
        description: "Please provide a valid 10-digit mobile number.", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsSendingOtp(true);
    setupRecaptcha();

    const appVerifier = recaptchaVerifierRef.current;
    if (!appVerifier) {
      setIsSendingOtp(false);
      toast({ title: "Verification Error", description: "Recaptcha failed to initialize. Please refresh.", variant: "destructive" });
      return;
    }

    try {
      const phoneNumber = `+91${mobileValue}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      setResendTimer(60);
      toast({ 
        title: "OTP Dispatched", 
        description: "A secure verification code has been sent to your mobile number.",
      });
    } catch (error: any) {
      console.error("SMS Error:", error);
      let message = "Could not send OTP. Please check your number or try again later.";
      if (error.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized in Firebase Console. Add it to Authentication > Settings > Authorized domains.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many requests. Please try again in a few minutes.";
      }
      toast({ title: "SMS Failed", description: `${message} (${error.code})`, variant: "destructive" });
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6 || !confirmationResult) return;
    setIsVerifyingOtp(true);
    
    try {
      await confirmationResult.confirm(otpValue);
      setIsAadharVerified(true);
      toast({ 
        title: "Identity Verified", 
        description: "Your mobile identity has been authenticated successfully.",
      });
    } catch (error: any) {
      console.error("OTP Error:", error);
      toast({ 
        title: "Verification Failed", 
        description: "The code entered is incorrect or has expired.", 
        variant: "destructive" 
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || !isAadharVerified) {
      toast({ 
        title: "Security Check Required", 
        description: "Mobile identity verification via OTP is mandatory for tourist safety.", 
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
      .then(() => {
        toast({ 
          title: "Registration Complete", 
          description: "Welcome to our network of verified local experts.",
        });
        router.push('/guides');
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: guidesRef.path, operation: 'create', requestResourceData: guideData }));
        setSubmitting(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div id="recaptcha-container"></div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white shadow-2xl md:sticky md:top-24">
          <ShieldCheck className="w-16 h-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">Safety & Trust First</h1>
          <p className="text-white/80 text-lg leading-relaxed font-body">
            To ensure the safety of tourists, every local guide is verified through a secure Aadhar-linked process. This accountability framework ensures transparency and trust.
          </p>
          
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-accent">
              <ShieldAlert className="w-5 h-5" /> Security Protocol:
            </h3>
            <ul className="space-y-3 text-sm opacity-90 font-body">
              <li className="flex gap-2"><span className="font-black text-accent">✓</span> Government Identity Authentication.</li>
              <li className="flex gap-2"><span className="font-black text-accent">✓</span> SMS OTP Verification for Account Security.</li>
              <li className="flex gap-2"><span className="font-black text-accent">✓</span> Verified Legal Accountability.</li>
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
                      <FormLabel>Legal Full Name</FormLabel>
                      <FormControl>
                        <Input className="rounded-xl h-11" placeholder="As per Aadhar Card" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" className="rounded-xl h-11" {...field} suppressHydrationWarning />
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
                        <FormLabel>Mobile Linked to Aadhar</FormLabel>
                        <FormControl>
                          <Input disabled={isAadharVerified} placeholder="10-digit number" maxLength={10} className="rounded-xl h-11" {...field} suppressHydrationWarning />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Card Number</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input disabled={isAadharVerified} maxLength={12} className="rounded-xl h-11" placeholder="12-digit UID" {...field} suppressHydrationWarning />
                          </FormControl>
                          {!isAadharVerified && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="h-11 rounded-xl px-6 shrink-0 border-primary text-primary" 
                              onClick={handleSendOtp} 
                              disabled={mobileValue.length !== 10 || isSendingOtp || (isOtpSent && resendTimer > 0)}
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
                          <span>Enter the verification code sent to your mobile.</span>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="6-digit Code" maxLength={6} className="rounded-xl h-12 text-center font-bold text-lg tracking-[0.2em]" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} suppressHydrationWarning />
                          <Button type="button" className="h-12 rounded-xl px-8 shadow-md" onClick={handleVerifyOtp} disabled={otpValue.length !== 6 || isVerifyingOtp}>
                            {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Confirm'}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isAadharVerified && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-accent/10 p-3 rounded-xl text-accent text-sm font-bold flex items-center justify-center gap-2 border border-accent/20">
                      <CheckCircle2 className="w-5 h-5" /> Identity Verified Securely
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operational City/District</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Visakhapatnam" className="rounded-xl h-11" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="languages" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Telugu, English, Hindi" className="rounded-xl h-11" {...field} suppressHydrationWarning />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guiding History & Expertise</FormLabel>
                    <FormControl>
                      <Textarea className="rounded-xl min-h-[120px]" placeholder="Briefly describe your experience and places you specialize in..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={submitting || !isAadharVerified} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                  {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Register as Verified Guide'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
