
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
import { ShieldCheck, Loader2, Fingerprint, Info } from 'lucide-react';
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

  async function handleSendOtp() {
    if (aadharValue.length !== 12) return;
    setIsOtpSent(true);
    toast({ 
      title: "OTP Sent (Simulation Mode)", 
      description: "In this prototype, please use 123456 to verify.",
    });
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) return;
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (otpValue === '123456') {
        setIsAadharVerified(true);
        toast({ title: "Aadhar Verified", description: "Successfully linked your identity." });
      } else {
        toast({ title: "Verification Failed", description: "Please use the test code: 123456", variant: "destructive" });
      }
    }, 500);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !isAadharVerified) {
      toast({ title: "Aadhar Verification Required", variant: "destructive" });
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
        toast({ title: "Registration Successful!", description: "You are now a verified guide." });
        router.push('/guides');
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: guidesRef.path, operation: 'create', requestResourceData: guideData }));
        setSubmitting(false);
      });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white shadow-2xl">
          <ShieldCheck className="w-16 h-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold">Expert Guide Program</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Join the elite circle of certified local experts in Andhra Pradesh. Your journey to sharing authentic local wisdom starts with government identity verification.
          </p>
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
              <span>Identity Verification</span>
            </div>
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">2</div>
              <span>Profile Creation</span>
            </div>
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">3</div>
              <span>Start Guiding</span>
            </div>
          </div>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="rounded-xl h-11" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input className="rounded-xl h-11" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="bg-secondary/20 p-6 rounded-2xl space-y-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Fingerprint className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-sm">Aadhar Identity Check</h3>
                  </div>
                  <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>12-Digit Aadhar Number</FormLabel>
                      <div className="flex gap-2">
                        <FormControl><Input disabled={isAadharVerified} maxLength={12} className="rounded-xl h-11" placeholder="XXXX XXXX XXXX" {...field} /></FormControl>
                        {!isAadharVerified && (
                          <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={handleSendOtp} disabled={aadharValue.length !== 12 || isOtpSent}>Send OTP</Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {isOtpSent && !isAadharVerified && (
                    <div className="flex gap-2 pt-2">
                      <Input placeholder="Enter 6-digit OTP" maxLength={6} className="rounded-xl h-11 text-center font-bold" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                      <Button type="button" className="h-11 rounded-xl px-8" onClick={handleVerifyOtp} disabled={otpValue.length !== 6 || isVerifyingOtp}>
                        {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify'}
                      </Button>
                    </div>
                  )}
                  {isAadharVerified && (
                    <div className="text-accent text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Identity Verified Successfully
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Operational Location</FormLabel><FormControl><Input placeholder="e.g. Tirupati" className="rounded-xl h-11" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="languages" render={({ field }) => (
                    <FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><Input placeholder="e.g. Telugu, English" className="rounded-xl h-11" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guiding Experience</FormLabel>
                    <FormControl><Textarea className="rounded-xl min-h-[100px]" placeholder="List places you have explored..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 flex gap-3">
                  <Info className="w-5 h-5 text-accent flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">By clicking register, you agree to comply with the platform's local expertise guidelines and verification standards.</p>
                </div>

                <Button type="submit" disabled={submitting || !isAadharVerified} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
                  {submitting ? <Loader2 className="animate-spin" /> : 'Register as Official Guide'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
