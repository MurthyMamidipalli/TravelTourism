
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
    toast({ title: "OTP Sent" });
  }

  async function handleVerifyOtp() {
    if (otpValue.length !== 6) return;
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (otpValue === '123456') {
        setIsAadharVerified(true);
        toast({ title: "Verified" });
      } else {
        toast({ title: "Error", variant: "destructive" });
      }
    }, 100);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !isAadharVerified) return;
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

    toast({ title: "Success!" });
    router.push('/guides');
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white">
          <h1 className="font-headline text-3xl font-bold">Register as a Guide</h1>
          <p className="text-white/80">Share your local expertise and earn while you explore.</p>
        </div>

        <Card className="md:col-span-3 border-none shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl></FormItem>
                  )} />
                </div>

                <div className="bg-secondary/10 p-5 rounded-2xl space-y-4 border">
                  <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Verification</FormLabel>
                      <div className="flex gap-2">
                        <FormControl><Input disabled={isAadharVerified} className="rounded-xl" {...field} /></FormControl>
                        {!isAadharVerified && (
                          <Button type="button" variant="outline" size="sm" onClick={handleSendOtp} disabled={aadharValue.length !== 12 || isOtpSent}>OTP</Button>
                        )}
                      </div>
                    </FormItem>
                  )} />
                  {isOtpSent && !isAadharVerified && (
                    <div className="flex gap-2">
                      <Input placeholder="6-digit" maxLength={6} className="rounded-xl text-center" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} />
                      <Button type="button" size="sm" onClick={handleVerifyOtp} disabled={otpValue.length !== 6}>Verify</Button>
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={submitting || !isAadharVerified} className="w-full h-12 rounded-2xl">
                  {submitting ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
