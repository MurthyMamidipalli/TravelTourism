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
import { ShieldCheck, Loader2, Fingerprint, CreditCard, ShieldAlert, Globe, Upload, Check } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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
  passportNumber: z.string().optional(),
  bio: z.string().min(50, { message: 'Bio is mandatory (min 50 chars).' }),
  experience: z.string().min(10, { message: 'Experience details are mandatory.' }),
});

export default function GuideRegistrationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Mandatory Upload States
  const [aadharUploaded, setAadharUploaded] = useState(false);
  const [panUploaded, setPanUploaded] = useState(false);
  const [passportUploaded, setPassportUploaded] = useState(false);

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
      passportNumber: '',
      bio: '',
      experience: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Account Required", description: "Please sign in to register as a guide.", variant: "destructive" });
      return;
    }
    if (!firestore) return;
    if (!aadharUploaded || !panUploaded) {
      toast({ title: "Documents Missing", description: "Soft copies of Aadhar and PAN are mandatory.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const guidesRef = collection(firestore, 'guides');
    const guideData = {
      ...values,
      userId: user.uid,
      rating: 0,
      reviewCount: 0,
      isVerified: true,
      createdAt: serverTimestamp(),
      imageUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/400/400`,
    };

    // Optimistic write: Update UI and redirect immediately
    addDoc(guidesRef, guideData)
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: guidesRef.path, 
          operation: 'create', 
          requestResourceData: guideData 
        }));
      });

    toast({ title: "Registration Staged", description: "Welcome! Your expert profile is being activated." });
    router.push('/guides');
  };

  const handleSimulatedUpload = (type: 'aadhar' | 'pan' | 'passport') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files.length > 0) {
        if (type === 'aadhar') setAadharUploaded(true);
        if (type === 'pan') setPanUploaded(true);
        if (type === 'passport') setPassportUploaded(true);
        toast({ title: "Upload Ready", description: `${type.toUpperCase()} copy staged for verification.` });
      }
    };
    input.click();
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        <div className="md:col-span-2 space-y-6 bg-primary rounded-3xl p-8 text-white shadow-2xl md:sticky md:top-24">
          <ShieldCheck className="w-16 h-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">Guide Identity Protocol</h1>
          <p className="text-white/80 text-lg leading-relaxed font-body">
            To ensure absolute safety, every guide must provide verified government documentation and soft copies.
          </p>
          
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-accent">
              <ShieldAlert className="w-5 h-5" /> Mandatory Requirements:
            </h3>
            <ul className="space-y-3 text-sm opacity-90 font-body">
              <li className="flex gap-2"><span className="font-black text-accent">✓</span> Aadhar Soft Copy Upload.</li>
              <li className="flex gap-2"><span className="font-black text-accent">✓</span> PAN Soft Copy Upload.</li>
              <li className="flex gap-2"><span className="font-black opacity-50">○</span> Passport (Temporary / Optional).</li>
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
                        <Input className="rounded-xl h-11" placeholder="As per documents" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" className="rounded-xl h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-secondary/20 p-6 rounded-2xl space-y-6 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-sm tracking-tight uppercase">Government Identification</h3>
                    </div>
                    <Badge variant="destructive" className="text-[8px] h-4">Upload Mandatory</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="aadharNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Aadhar Number</FormLabel>
                        <FormControl>
                          <Input maxLength={12} className="rounded-xl h-11" placeholder="12-digit UID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="panNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> PAN Card Number</FormLabel>
                        <FormControl>
                          <Input className="rounded-xl h-11 uppercase" placeholder="ABCDE1234F" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="passportNumber" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2 font-medium opacity-60"><Globe className="w-4 h-4" /> Passport Number (Optional)</FormLabel>
                        <FormControl>
                          <Input className="rounded-xl h-11" placeholder="Optional for domestic verification" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Upload Proofs (Soft Copies)</p>
                       <p className="text-[9px] text-destructive italic font-bold">* Aadhar and PAN required</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div 
                        onClick={() => handleSimulatedUpload('aadhar')}
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer group ${aadharUploaded ? 'border-accent bg-accent/5' : 'border-primary/20 hover:bg-primary/5'}`}
                      >
                        {aadharUploaded ? <Check className="w-6 h-6 text-accent" /> : <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />}
                        <span className="text-[10px] font-bold text-center">Aadhar *</span>
                      </div>
                      <div 
                        onClick={() => handleSimulatedUpload('pan')}
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer group ${panUploaded ? 'border-accent bg-accent/5' : 'border-primary/20 hover:bg-primary/5'}`}
                      >
                        {panUploaded ? <Check className="w-6 h-6 text-accent" /> : <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />}
                        <span className="text-[10px] font-bold text-center">PAN *</span>
                      </div>
                      <div 
                        onClick={() => handleSimulatedUpload('passport')}
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer group opacity-60 ${passportUploaded ? 'border-accent bg-accent/5' : 'border-zinc-200 hover:bg-zinc-100'}`}
                      >
                        {passportUploaded ? <Check className="w-6 h-6 text-accent" /> : <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-2" />}
                        <span className="text-[10px] font-bold text-center">Passport</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operational City/District</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hyderabad" className="rounded-xl h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit number" maxLength={10} className="rounded-xl h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guiding History & Expertise</FormLabel>
                    <FormControl>
                      <Textarea className="rounded-xl min-h-[120px]" placeholder="Describe your experience..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button 
                  type="submit" 
                  disabled={submitting || !aadharUploaded || !panUploaded} 
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                >
                  {submitting ? <><Loader2 className="animate-spin mr-2" /> Registering...</> : 'Register as Verified Guide'}
                </Button>
                {(!aadharUploaded || !panUploaded) && (
                  <p className="text-center text-[10px] text-destructive font-bold">Please upload mandatory documents to enable registration.</p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
