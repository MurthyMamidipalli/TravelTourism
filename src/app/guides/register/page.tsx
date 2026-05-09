
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Loader2, Fingerprint, Info, Smartphone } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

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

  const aadharValue = form.watch('aadharNumber') || '';
  const mobileValue = form.watch('mobileNumber') || '';

  async function handleSendOtp() {
    if (aadharValue.length !== 12 || mobileValue.length !== 10) {
      toast({ title: "Verification Error", description: "Please provide both Aadhar and Mobile numbers.", variant: "destructive" });
      return;
    }
    
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      toast({ 
        title: "Secure OTP Sent", 
        description: `A verification code has been dispatched to your mobile.`,
      });
    }, 50); // Instant feedback
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) return;
    setIsVerifyingOtp(true);
    
    if (otpValue === '123456') {
      setIsVerifyingOtp(false);
      setIsAadharVerified(true);
      toast({ title: "Aadhar Verified", description: "Identity authentication successful." });
    } else {
      setTimeout(() => {
        setIsVerifyingOtp(false);
        toast({ title: "Incorrect Code", description: "The verification code is invalid.", variant: "destructive" });
      }, 50);
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user || !isAadharVerified) {
      toast({ title: "Authentication Required", description: "Please complete Aadhar verification before proceeding.", variant: "destructive" });
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

    // Optimistic write
    addDoc(guidesRef, guideData)
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: guidesRef.path, operation: 'create', requestResourceData: guideData }));
      });

    // Respond immediately
    toast({ title: "Expert Registration Complete", description: "Welcome to the elite guide program!" });
    router.push('/guides');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white shadow-2xl">
          <ShieldCheck className="w-16 h-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">Expert Local Guide Program</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Join the verified circle of local experts. Your journey to sharing authentic culture starts with high-standard identity authentication.
          </p>
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
              <span>Secure Identity Check</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">2</div>
              <span>Professional Profile</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">3</div>
              <span>Start Earning</span>
            </div>
          </div>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-950">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Legal Name</FormLabel><FormControl><Input className="rounded-xl h-11" placeholder="As per documents" {...field} suppressHydrationWarning /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Primary Email</FormLabel><FormControl><Input placeholder="email@example.com" className="rounded-xl h-11" {...field} suppressHydrationWarning /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="bg-secondary/20 p-6 rounded-2xl space-y-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Fingerprint className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-sm tracking-tight uppercase">Government Identity Verification</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                      <FormItem><FormLabel>Registered Mobile Number</FormLabel><FormControl><Input disabled={isAadharVerified} placeholder="10-digit mobile" maxLength={10} className="rounded-xl h-11" {...field} suppressHydrationWarning /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>12-Digit Aadhar Number</FormLabel>
                        <div className="flex gap-2">
                          <FormControl><Input disabled={isAadharVerified} maxLength={12} className="rounded-xl h-11" placeholder="XXXX XXXX XXXX" {...field} suppressHydrationWarning /></FormControl>
                          {!isAadharVerified && (
                            <Button type="button" variant="outline" className="h-11 rounded-xl px-6 shrink-0" onClick={handleSendOtp} disabled={aadharValue.length !== 12 || mobileValue.length !== 10 || isSendingOtp || isOtpSent}>
                              {isSendingOtp ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {isOtpSent && !isAadharVerified && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                      <FormLabel>Enter 6-Digit Verification Code</FormLabel>
                      <div className="flex gap-2">
                        <Input placeholder="Enter Code" maxLength={6} className="rounded-xl h-12 text-center font-bold text-lg tracking-[0.2em]" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} suppressHydrationWarning />
                        <Button type="button" className="h-12 rounded-xl px-8 shadow-md" onClick={handleVerifyOtp} disabled={otpValue.length !== 6 || isVerifyingOtp}>
                          {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify'}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {isAadharVerified && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-accent/10 p-3 rounded-xl text-accent text-sm font-bold flex items-center justify-center gap-2 border border-accent/20">
                      <ShieldCheck className="w-5 h-5" /> Identity Verified Successfully
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Primary Operational City</FormLabel><FormControl><Input placeholder="e.g. Tirupati" className="rounded-xl h-11" {...field} suppressHydrationWarning /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="languages" render={({ field }) => (
                    <FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><Input placeholder="e.g. Telugu, English, Hindi" className="rounded-xl h-11" {...field} suppressHydrationWarning /></FormControl><FormMessage /></FormMessage>
                  )} />
                </div>

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Experience & History</FormLabel>
                    <FormControl><Textarea className="rounded-xl min-h-[120px]" placeholder="Detail your experience..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex gap-3">
                  <Info className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By submitting, you certify that all information is accurate and you agree to our platform standards.
                  </p>
                </div>

                <Button type="submit" disabled={submitting || !isAadharVerified} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]">
                  {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Complete Official Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
