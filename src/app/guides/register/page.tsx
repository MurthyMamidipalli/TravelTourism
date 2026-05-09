'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Globe, Fingerprint, CreditCard, Info, Loader2, Phone, MapPin, Briefcase, Mail } from 'lucide-react';
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

  const [isSendingOtp, setIsSendingOtp] = useState(false);
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
    if (aadharValue.length !== 12) {
      toast({ title: "Invalid Aadhar", description: "Please enter exactly 12 digits.", variant: "destructive" });
      return;
    }
    setIsSendingOtp(true);
    // Reduced simulated delay for snappier feel
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsSendingOtp(false);
    setIsOtpSent(true);
    toast({ title: "OTP Sent", description: "Verification code sent to linked mobile." });
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) return;
    setIsVerifyingOtp(true);
    // Reduced simulated delay for snappier feel
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsVerifyingOtp(false);
    if (otpValue === '123456') {
      setIsAadharVerified(true);
      toast({ title: "Verified", description: "Identity authenticated." });
    } else {
      toast({ title: "Error", description: "Invalid OTP (Test: 123456).", variant: "destructive" });
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Sign-in Required", description: "Please log in to register.", variant: "destructive" });
      return;
    }
    if (!isAadharVerified) {
      toast({ title: "Verification Required", description: "Complete Aadhar verification to proceed.", variant: "destructive" });
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

    addDoc(guidesRef, guideData).catch((error) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: guidesRef.path, operation: 'create', requestResourceData: guideData }));
    });

    toast({ title: "Registration Success!", description: "Welcome to our community of local experts." });
    router.push('/guides');
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white">
          <h1 className="font-headline text-3xl font-bold">Guide Registration</h1>
          <p className="text-white/80 text-sm">All fields are mandatory. Aadhar OTP verification ensures a safe and trusted community.</p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold">Identity Verification</p>
                <p className="text-xs text-white/70">Real-time OTP authentication ensuring security.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="w-8 h-8 text-accent flex-shrink-0" />
              <div>
                <p className="font-bold">Expert Profile</p>
                <p className="text-xs text-white/70">Highlight your experience in the Sunrise State.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="bg-secondary/20 border-b p-6">
            <CardTitle className="font-headline text-xl text-primary">Complete Your Expert Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="john@example.com" className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl><Input placeholder="10-digit mobile" maxLength={10} className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl><Input type="number" className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-secondary/10 p-5 rounded-2xl space-y-4 border border-secondary shadow-inner">
                  <p className="text-xs font-bold text-primary flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Identity Verification</p>
                  <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="relative flex-grow">
                            <Input placeholder="12-digit Aadhar" maxLength={12} disabled={isAadharVerified} className="rounded-xl" {...field} />
                            {isAadharVerified && <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />}
                          </div>
                        </FormControl>
                        {!isAadharVerified && (
                          <Button type="button" variant="outline" size="sm" onClick={handleSendOtp} disabled={isSendingOtp || aadharValue.length !== 12 || isOtpSent} className="rounded-xl">
                            {isSendingOtp ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Get OTP'}
                          </Button>
                        )}
                      </div>
                    </FormItem>
                  )} />
                  {isOtpSent && !isAadharVerified && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                      <Input placeholder="Enter OTP" maxLength={6} className="rounded-xl text-center tracking-widest font-bold" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                      <Button type="button" size="sm" onClick={handleVerifyOtp} disabled={isVerifyingOtp || otpValue.length !== 6} className="rounded-xl bg-accent text-white">Verify</Button>
                    </motion.div>
                  )}
                  <FormField control={form.control} name="panNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Card Number</FormLabel>
                      <FormControl><Input placeholder="ABCDE1234F" {...field} className="uppercase rounded-xl" maxLength={10} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operational City</FormLabel>
                      <FormControl><Input placeholder="e.g. Tirupati" className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="languages" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormControl><Input placeholder="Telugu, English" className="rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Place - Frequency)</FormLabel>
                    <FormDescription>Example: Tirumala Temple - 15 times</FormDescription>
                    <FormControl><Textarea placeholder="List your experience here..." className="rounded-xl min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl><Textarea placeholder="Tell travelers about your expertise..." className="rounded-xl min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <Button type="submit" disabled={submitting || !isAadharVerified} className="w-full h-12 text-lg bg-accent text-white rounded-2xl shadow-lg">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
